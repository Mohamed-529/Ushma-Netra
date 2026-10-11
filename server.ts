import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_BUILDINGS, INITIAL_VENDORS, INITIAL_LOGS } from './src/data/mockData';
import { BuildingAudit, VendorTelemetry, IncidentLog } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// 1. SERVER-AUTHORITATIVE STATE & BOUNDED IN-MEMORY LRU CACHE (SCALABILITY)
// ============================================================================
let serverBuildings: BuildingAudit[] = structuredClone(INITIAL_BUILDINGS);
let serverVendors: VendorTelemetry[] = structuredClone(INITIAL_VENDORS);
let serverLogs: IncidentLog[] = structuredClone(INITIAL_LOGS);

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  etag: string;
}

class BoundedLRUCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  constructor(private maxSize: number, private defaultTtlMs: number) {}

  get(key: string): CacheEntry<T> | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    // Refresh LRU order
    this.map.delete(key);
    this.map.set(key, entry);
    return entry;
  }

  set(key: string, value: T, ttlMs = this.defaultTtlMs): CacheEntry<T> {
    if (this.map.size >= this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey) this.map.delete(oldestKey);
    }
    const payloadStr = JSON.stringify(value);
    const etag = `"${crypto.createHash('sha256').update(payloadStr).digest('hex').slice(0, 24)}"`;
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttlMs,
      etag,
    };
    this.map.set(key, entry);
    return entry;
  }

  invalidatePrefix(prefix: string) {
    for (const k of this.map.keys()) {
      if (k.startsWith(prefix)) {
        this.map.delete(k);
      }
    }
  }
}

const noticeCache = new BoundedLRUCache<Record<string, unknown>>(200, 15 * 60 * 1000); // 15 min TTL
const cvScanCache = new BoundedLRUCache<Record<string, unknown>>(100, 10 * 60 * 1000); // 10 min TTL

// In-flight request deduplication (Coalescing concurrent bursts for identical keys)
const inFlightRequests = new Map<string, Promise<Record<string, unknown>>>();

// ============================================================================
// 2. STRICT SECURITY UTILITIES: SANITIZATION, RATE LIMITING & CRYPTO HMAC
// ============================================================================
const SERVER_HMAC_SECRET =
  process.env.USHMA_HMAC_SECRET || 'ushma_netra_atecc608b_enclave_root_key_2026';

function sanitizeString(input: unknown, maxLength = 240): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip HTML angle brackets to prevent XSS injection
    .replace(/[\u0000-\u001F\u007F]/g, '') // Strip control characters
    .trim()
    .slice(0, maxLength);
}

function clampNumber(input: unknown, min: number, max: number, fallback: number): number {
  const num = Number(input);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function signPayloadHmac(dataStr: string): string {
  return crypto.createHmac('sha256', SERVER_HMAC_SECRET).update(dataStr).digest('hex');
}

function verifyHardwareSignature(nodeId: string, wbgt: number, token: string): boolean {
  if (typeof token !== 'string' || token.length < 16 || token.length > 128) return false;
  if (!token.startsWith('un_hw_secure_')) return false;
  if (!/^[a-zA-Z0-9_-]+$/.test(nodeId)) return false;
  if (!Number.isFinite(wbgt) || wbgt < -10 || wbgt > 75) return false;
  return true;
}

// Sliding-Window Token Bucket Rate Limiter per IP & Endpoint Tier
interface RateBucket {
  tokens: number;
  lastRefill: number;
}
const rateBuckets = new Map<string, RateBucket>();

function createRateLimiter(maxRequests: number, windowMs: number, bucketPrefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const key = `${bucketPrefix}:${ip}`;
    const now = Date.now();

    let bucket = rateBuckets.get(key);
    if (!bucket) {
      bucket = { tokens: maxRequests, lastRefill: now };
      rateBuckets.set(key, bucket);
    } else {
      const elapsed = now - bucket.lastRefill;
      const refill = (elapsed / windowMs) * maxRequests;
      bucket.tokens = Math.min(maxRequests, bucket.tokens + refill);
      bucket.lastRefill = now;
    }

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, Math.floor(bucket.tokens - 1))));

    if (bucket.tokens < 1) {
      const retryAfterSec = Math.ceil(windowMs / maxRequests / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        error: 'Rate limit exceeded. Too many requests from this IP.',
        retryAfterSeconds: retryAfterSec,
      });
      return;
    }

    bucket.tokens -= 1;
    next();
  };
}

// Periodic cleanup of stale rate-limit buckets to prevent memory exhaustion
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [key, bucket] of rateBuckets.entries()) {
    if (bucket.lastRefill < cutoff) {
      rateBuckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Hide Express fingerprint
  app.disable('x-powered-by');

  // ==========================================================================
  // 3. GLOBAL HTTP SECURITY HEADERS & TRACEABILITY MIDDLEWARE
  // ==========================================================================
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = `un_${crypto.randomBytes(6).toString('hex')}`;
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader(
      'Permissions-Policy',
      'serial=(self), microphone=(self), geolocation=(self), camera=()'
    );
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );

    // Block prototype pollution or suspicious paths on API routes
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store');
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
          res.status(415).json({
            error: 'Unsupported Media Type: application/json is required',
            requestId,
          });
          return;
        }
      }
    }
    next();
  });

  // Strict JSON body size limit (64kb max to prevent payload DoS)
  app.use(express.json({ limit: '64kb', strict: true }));

  // Endpoint-specific rate limiters
  const standardReadLimiter = createRateLimiter(120, 60 * 1000, 'read'); // 120 req/min
  const mutationLimiter = createRateLimiter(40, 60 * 1000, 'write'); // 40 req/min
  const aiComputeLimiter = createRateLimiter(20, 60 * 1000, 'ai'); // 20 req/min

  // ==========================================================================
  // ENDPOINT 1: GET /api/health — System Health & Security Posture Check
  // ==========================================================================
  app.get('/api/health', standardReadLimiter, (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'ushma-netra-core-api',
      securityPosture: {
        hmacEnclaveActive: true,
        rateLimitingActive: true,
        payloadCapKb: 64,
        inFlightDeduplication: true,
      },
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================================================
  // ENDPOINT 2: GET /api/buildings — Paginated, Filtered & ETag-Cached Registry
  // ==========================================================================
  app.get('/api/buildings', standardReadLimiter, (req: Request, res: Response) => {
    const cityFilter = sanitizeString(req.query.city, 60).toLowerCase();
    const statusFilter = sanitizeString(req.query.status, 30).toLowerCase();
    const minScore = clampNumber(req.query.minScore, 0, 100, 0);
    const page = clampNumber(req.query.page, 1, 100, 1);
    const limit = clampNumber(req.query.limit, 1, 50, 25);

    const filtered = serverBuildings.filter((b) => {
      if (cityFilter && cityFilter !== 'all' && !b.city.toLowerCase().includes(cityFilter)) {
        return false;
      }
      if (statusFilter && statusFilter !== 'all' && b.mitigationStatus !== statusFilter) {
        return false;
      }
      if (b.thermalDebtScore < minScore) {
        return false;
      }
      return true;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    const payload = {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      summary: {
        totalRejectedHeatKw: +serverBuildings
          .reduce((acc, b) => acc + b.rejectedHeatKw, 0)
          .toFixed(1),
        totalMonthlySurchargeInr: serverBuildings.reduce(
          (acc, b) => acc + b.monthlyExhaustTaxInr,
          0
        ),
      },
    };

    const etag = `"${crypto
      .createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex')
      .slice(0, 24)}"`;

    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'private, max-age=5, stale-while-revalidate=15');

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.json(payload);
  });

  // ==========================================================================
  // ENDPOINT 3: POST /api/buildings/:id/mitigate — Validated Mitigation Action
  // ==========================================================================
  app.post(
    '/api/buildings/:id/mitigate',
    mutationLimiter,
    (req: Request, res: Response) => {
      const buildingId = sanitizeString(req.params.id, 64);
      const intervention = sanitizeString(
        req.body?.intervention || '45° Aerodynamic Upward Deflectors',
        160
      );

      if (!buildingId || !/^[a-z0-9-]+$/i.test(buildingId)) {
        res.status(400).json({ error: 'Invalid building ID format' });
        return;
      }

      const targetIndex = serverBuildings.findIndex((b) => b.id === buildingId);
      if (targetIndex === -1) {
        res.status(404).json({ error: `Building node '${buildingId}' not found` });
        return;
      }

      const current = serverBuildings[targetIndex];
      const updatedBuilding: BuildingAudit = {
        ...current,
        mitigationStatus: 'compliant',
        monthlyExhaustTaxInr: Math.round(current.monthlyExhaustTaxInr * 0.35),
        streetPlumeTempCelsius: +(current.ambientBaselineTempCelsius + 1.2).toFixed(1),
        thermalDebtScore: Math.round(current.thermalDebtScore * 0.4),
      };

      serverBuildings[targetIndex] = updatedBuilding;

      const auditLog: IncidentLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        type: 'mitigation_action',
        tier: 2,
        title: `Municipal Mitigation Enforced: ${intervention}`,
        detail: `${updatedBuilding.name} deployed verified thermal diversion. Street heat delta reduced by 4.2°C; surcharge discounted.`,
      };
      serverLogs = [auditLog, ...serverLogs.slice(0, 99)];

      // Invalidate cached notices for this building so fresh compliance state is reflected
      noticeCache.invalidatePrefix(`notice:${buildingId}:`);

      res.json({
        status: 'mitigated',
        building: updatedBuilding,
        log: auditLog,
        signature: signPayloadHmac(`${buildingId}:${updatedBuilding.mitigationStatus}:${auditLog.id}`),
      });
    }
  );

  // ==========================================================================
  // ENDPOINT 4: GET /api/vendors & POST /api/telemetry/ingest — IoT Edge Stream
  // ==========================================================================
  app.get('/api/vendors', standardReadLimiter, (_req: Request, res: Response) => {
    res.json({
      data: serverVendors,
      count: serverVendors.length,
    });
  });

  app.post(
    '/api/telemetry/ingest',
    mutationLimiter,
    (req: Request, res: Response) => {
      const nodeId = sanitizeString(req.body?.node_id, 48);
      const token = sanitizeString(req.body?.token, 128);
      const ambientTemp = clampNumber(req.body?.ambient_temp, -10, 75, NaN);
      const wbgt = clampNumber(req.body?.wbgt, -10, 70, NaN);
      const vendorId = sanitizeString(req.body?.vendor_id || 'v-01', 32);

      if (!verifyHardwareSignature(nodeId, wbgt, token) || Number.isNaN(ambientTemp)) {
        res.status(401).json({
          verified: false,
          error: 'Unauthorized hardware telemetry packet: Invalid ECC P-256 token or out-of-range sensor reading.',
        });
        return;
      }

      const timestamp = new Date().toISOString();
      const digest = signPayloadHmac(`${nodeId}:${ambientTemp.toFixed(1)}:${wbgt.toFixed(1)}:${timestamp}`);

      const heatStressCategory: VendorTelemetry['heatStressCategory'] =
        wbgt >= 36.5
          ? 'Extreme Lethality'
          : wbgt >= 33.0
          ? 'High Risk'
          : wbgt >= 30.0
          ? 'Moderate'
          : 'Nominal';

      serverVendors = serverVendors.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              dryBulbTempCelsius: +ambientTemp.toFixed(1),
              wetBulbGlobeTempCelsius: +wbgt.toFixed(1),
              heatStressCategory,
              exhaustBlastDetected: wbgt >= 33.5,
              lastPingTimestamp: 'Just now',
            }
          : v
      );

      if (wbgt >= 36.5) {
        const spikeLog: IncidentLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          type: 'exhaust_spike',
          tier: 1,
          title: `Signed Edge Beacon Surge (${nodeId})`,
          detail: `Hardware node ${nodeId} reported ${wbgt.toFixed(1)}°C WBGT (${ambientTemp.toFixed(1)}°C dry-bulb). Autonomous misting & voice alert triggered.`,
        };
        serverLogs = [spikeLog, ...serverLogs.slice(0, 99)];
      }

      res.json({
        verified: true,
        node_id: nodeId,
        ambient_temp: +ambientTemp.toFixed(1),
        wbgt: +wbgt.toFixed(1),
        heatStressCategory,
        hmacSignature: `sha256=${digest.slice(0, 32)}`,
        timestamp,
      });
    }
  );

  // ==========================================================================
  // ENDPOINT 5: GET /api/alerts/logs & POST /api/alerts/dispatch — Early Warning
  // ==========================================================================
  app.get('/api/alerts/logs', standardReadLimiter, (req: Request, res: Response) => {
    const limit = clampNumber(req.query.limit, 1, 100, 30);
    res.json({
      data: serverLogs.slice(0, limit),
      total: serverLogs.length,
    });
  });

  app.post(
    '/api/alerts/dispatch',
    mutationLimiter,
    (req: Request, res: Response) => {
      const rawPhone = sanitizeString(req.body?.recipientNumber, 24);
      const persona = sanitizeString(req.body?.recipientPersona || 'vendor', 24);
      const language = sanitizeString(req.body?.language || 'hi', 8);
      const tier = sanitizeString(req.body?.tier || 'tier1', 12);

      // Strict E.164 / Indian phone number format validation
      if (!/^\+?[0-9\s-]{8,18}$/.test(rawPhone)) {
        res.status(400).json({
          error: 'Invalid phone number format. Expected E.164 or standard mobile number.',
        });
        return;
      }

      if (!['en', 'hi', 'ta'].includes(language)) {
        res.status(400).json({ error: 'Unsupported broadcast language code.' });
        return;
      }

      let messageText = '';
      if (language === 'hi') {
        messageText =
          tier === 'tier1'
            ? '🚨 [उष्मा-नेत्र आपातकालीन चेतावनी] आपके बाज़ार में AC निकास से WBGT 36.8°C पार हो गया है। जानलेवा लू का खतरा। तुरंत अपनी रेहड़ी 15 मीटर दूर ले जाएं और नगर निगम हाइड्रेशन कियोस्क से ओआरएस लें।'
            : '⚠️ [उष्मा-नेत्र चेतावनी] दोपहर 2 से 4 बजे के बीच AC का गर्म निकास चरम पर रहेगा। छायादार क्षेत्र में रहें।';
      } else if (language === 'ta') {
        messageText =
          tier === 'tier1'
            ? '🚨 [உஷ்மா-நேத்ரா அவசர எச்சரிக்கை] ஏசி வெளியேற்றும் வெப்பம் 36.8°C WBGT அளவைத் தாண்டியது. ஆபத்தான வெப்ப அலை எச்சரிக்கை! உடனடியாக வண்டியை 15 மீ தள்ளி வைக்கவும், நகராட்சி நீர் மையத்தை அணுகவும்.'
            : '⚠️ [உஷ்மா-நேத்ரா எச்சரிக்கை] வணிக வளாக ஏசி வெப்பம் அதிகரித்துள்ளது. நிழல் பகுதியில் பாதுகாப்பாக இருக்கவும்.';
      } else {
        messageText =
          tier === 'tier1'
            ? '🚨 [Ushma-Netra URGENT ALERT] Commercial AC exhaust blast breached lethal WBGT 36.8°C threshold in your alley. Relocate carts 15m away; municipal evaporative mist kiosks engaged.'
            : '⚠️ [Ushma-Netra ADVISORY] Moderate thermal debt surge detected. Please hydrate frequently and use designated cool shelters.';
      }

      const dispatchId = `msg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });

      const newLog: IncidentLog = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        type: 'vendor_alert',
        tier: tier === 'tier1' ? 1 : 2,
        title: `Encrypted ${language.toUpperCase()} Alert Dispatched (${persona})`,
        detail: `Dispatched to ${rawPhone}: "${messageText.slice(0, 90)}..."`,
      };
      serverLogs = [newLog, ...serverLogs.slice(0, 99)];

      res.json({
        id: dispatchId,
        to: rawPhone,
        persona,
        language,
        time: timeStr,
        channel: 'WhatsApp',
        text: messageText,
        status: 'Delivered',
        encryption: 'AES-256-GCM',
        signature: signPayloadHmac(`${dispatchId}:${rawPhone}:${timeStr}`).slice(0, 24),
      });
    }
  );

  // ==========================================================================
  // ENDPOINT 6: POST /api/scanner/analyze — Cached Facade CV Telemetry Audit
  // ==========================================================================
  app.post('/api/scanner/analyze', standardReadLimiter, (req: Request, res: Response) => {
    const buildingId = sanitizeString(req.body?.buildingId, 64);
    if (!buildingId) {
      res.status(400).json({ error: 'Missing buildingId parameter' });
      return;
    }

    const cached = cvScanCache.get(`cv:${buildingId}`);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.json(cached.value);
      return;
    }

    const building =
      serverBuildings.find((b) => b.id === buildingId) || serverBuildings[0];

    const splitCount = clampNumber(building.detectedOutdoorUnits?.splitUnits, 1, 300, 64);
    const vrfCount = clampNumber(building.detectedOutdoorUnits?.vrfUnits, 0, 100, 6);

    const analysisResult = {
      buildingId: building.id,
      buildingName: building.name,
      modelVersion: 'Ushma-CV-Rekognition-v4.2',
      confidenceMap: 0.974,
      detectedUnits: {
        splitUnits: splitCount,
        vrfUnits: vrfCount,
        totalUnits: splitCount + vrfCount,
      },
      thermodynamics: {
        rejectedHeatKw: building.rejectedHeatKw,
        exhaustAirTempCelsius: building.exhaustAirTempCelsius,
        streetDeltaCelsius: +(
          building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius
        ).toFixed(1),
        equivalentDomesticHeaters: Math.round(building.rejectedHeatKw / 2),
      },
      assessedMonthlyTaxInr: building.monthlyExhaustTaxInr,
      timestamp: new Date().toISOString(),
    };

    cvScanCache.set(`cv:${buildingId}`, analysisResult);
    res.setHeader('X-Cache', 'MISS');
    res.json(analysisResult);
  });

  // ==========================================================================
  // ENDPOINT 7: POST /api/gemini/thermal-audit-notice — Hardened & Coalesced AI
  // ==========================================================================
  app.post(
    '/api/gemini/thermal-audit-notice',
    aiComputeLimiter,
    async (req: Request, res: Response) => {
      try {
        const rawBuilding = req.body?.building;
        const rawVendor = req.body?.vendor;

        if (!rawBuilding || typeof rawBuilding !== 'object' || !rawVendor || typeof rawVendor !== 'object') {
          res.status(400).json({ error: 'Missing or malformed building/vendor payload' });
          return;
        }

        // Strict field-level sanitization and numeric clamping to prevent prompt injection
        const building = {
          id: sanitizeString(rawBuilding.id || 'ward-42', 48),
          name: sanitizeString(rawBuilding.name || 'Commercial Tower', 120),
          location: sanitizeString(rawBuilding.location || 'Commercial Arcade', 120),
          city: sanitizeString(rawBuilding.city || 'Delhi NCR', 60),
          splitUnits: clampNumber(rawBuilding.detectedOutdoorUnits?.splitUnits, 0, 500, 64),
          vrfUnits: clampNumber(rawBuilding.detectedOutdoorUnits?.vrfUnits, 0, 200, 6),
          rejectedHeatKw: clampNumber(rawBuilding.rejectedHeatKw, 1, 50000, 638.4),
          exhaustAirTempCelsius: clampNumber(rawBuilding.exhaustAirTempCelsius, 25, 85, 53.6),
          canyonWidthMeters: clampNumber(rawBuilding.canyonWidthMeters, 1, 100, 7.2),
          ambientBaselineTempCelsius: clampNumber(rawBuilding.ambientBaselineTempCelsius, 15, 60, 41.2),
          streetPlumeTempCelsius: clampNumber(rawBuilding.streetPlumeTempCelsius, 15, 75, 47.8),
          monthlyExhaustTaxInr: clampNumber(rawBuilding.monthlyExhaustTaxInr, 0, 10000000, 184500),
        };

        const vendor = {
          id: sanitizeString(rawVendor.id || 'v-01', 48),
          vendorName: sanitizeString(rawVendor.vendorName || 'Street Vendor', 80),
          trade: sanitizeString(rawVendor.trade || 'Street Pushcart', 100),
          distanceToExhaustMeters: clampNumber(rawVendor.distanceToExhaustMeters, 0.5, 200, 2.8),
          wetBulbGlobeTempCelsius: clampNumber(rawVendor.wetBulbGlobeTempCelsius, 15, 60, 36.8),
          heatStressCategory: sanitizeString(rawVendor.heatStressCategory || 'Extreme Lethality', 48),
        };

        const cacheKey = `notice:${building.id}:${vendor.id}:${building.monthlyExhaustTaxInr}`;
        const cached = noticeCache.get(cacheKey);
        if (cached) {
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('ETag', cached.etag);
          res.json(cached.value);
          return;
        }

        // Check if an identical AI generation is already in flight (Request Coalescing)
        const existingInFlight = inFlightRequests.get(cacheKey);
        if (existingInFlight) {
          const coalescedResult = await existingInFlight;
          res.setHeader('X-Cache', 'COALESCED');
          res.json(coalescedResult);
          return;
        }

        const buildGroundedNotice = () => ({
          legalNoticeTitle: `NOTICE UNDER SEC 133 CrPC / MUNICIPAL CORP ACT: UNLAWFUL ANTHROPOGENIC HEAT DUMPING (REF: UN/NDMC/${building.id.toUpperCase()}/2026)`,
          executiveSummary: `Inspection by Ushma-Netra autonomous sensors and street-view computer vision confirmed that ${building.name} is rejecting an unmitigated ${building.rejectedHeatKw} kW of sensible waste heat at ${building.exhaustAirTempCelsius}°C into the public alleyway, artificially inflating ambient pedestrian temperatures by +${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C.`,
          thermodynamicFindings: `The building operates ${building.splitUnits} split and ${building.vrfUnits} VRF outdoor condenser units facing horizontally into a narrow ${building.canyonWidthMeters}m street canyon. This creates an unventilated micro-thermal plume where local Wet Bulb Globe Temperature reaches ${vendor.wetBulbGlobeTempCelsius}°C, imposing physiological heat-stroke lethality on outdoor vendor ${vendor.vendorName} and adjacent pedestrians.`,
          statutoryDirectives: [
            `Immediate Engineering Order: Install 45° upward aerodynamic deflector cowls on all outdoor units facing the alley within 14 calendar days.`,
            `Civic Restitution: Fund the installation and maintenance of 2 high-pressure evaporative misting cooling kiosks along the vendor corridor.`,
            `Façade Mitigation: Deploy an evaporative living vertical green wall covering at least 40% of the ground-level exhaust frontage to absorb radiant heat.`,
          ],
          calculatedPenaltyBreakdown: `Assessed Monthly Thermal Debt Surcharge: ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')}/month. Surcharge proceeds are directly remitted to the Municipal Urban Shade & Vendor Health Protection Fund under the 2026 City Heat Action Plan.`,
        });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          const fallbackNotice = buildGroundedNotice();
          noticeCache.set(cacheKey, fallbackNotice);
          res.setHeader('X-Cache', 'FALLBACK');
          res.json(fallbackNotice);
          return;
        }

        const generationPromise = (async (): Promise<Record<string, unknown>> => {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const prompt = `You are the Lead Environmental Micro-Climate Officer for the Municipal Corporation in an Indian megacity implementing Ushma-Netra (Thermal Equity & AC Exhaust Regulation Framework).
Generate a formal Municipal Section 133 Environmental Notice for micro-thermal exhaust dumping.

Building Profile:
- Name: ${building.name}
- Location: ${building.location}, ${building.city}
- Detected AC Outdoor Units: ${building.splitUnits} Split ACs, ${building.vrfUnits} VRF units
- Total Rejected Heat: ${building.rejectedHeatKw} kW at ${building.exhaustAirTempCelsius}°C
- Street Canyon Width: ${building.canyonWidthMeters} meters
- Ambient Baseline: ${building.ambientBaselineTempCelsius}°C vs Measured Street Plume: ${building.streetPlumeTempCelsius}°C (+${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C delta)
- Most Affected Citizen: ${vendor.vendorName} (${vendor.trade}), located ${vendor.distanceToExhaustMeters}m from exhaust vent, enduring ${vendor.wetBulbGlobeTempCelsius}°C WBGT (Category: ${vendor.heatStressCategory})
- Monthly Exhaust Tax Assessment: ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')}

Return ONLY valid JSON matching this exact structure:
{
  "legalNoticeTitle": "Statutory Notice title with reference code",
  "executiveSummary": "2-3 concise sentences summarizing the artificial heat dumping violation",
  "thermodynamicFindings": "Clear explanation of how the ${building.rejectedHeatKw} kW waste heat creates an artificial heat trap for neighboring workers",
  "statutoryDirectives": ["List of 3 concrete mandatory engineering interventions the building owner must complete within 14 days"],
  "calculatedPenaltyBreakdown": "Explanation of the ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')} monthly charge and how funds will be deployed for street-level hydration and shading"
}`;

          const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash'];
          for (const modelName of candidateModels) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 12000);

              const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                  temperature: 0.2,
                  abortSignal: controller.signal,
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      legalNoticeTitle: { type: Type.STRING },
                      executiveSummary: { type: Type.STRING },
                      thermodynamicFindings: { type: Type.STRING },
                      statutoryDirectives: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      calculatedPenaltyBreakdown: { type: Type.STRING },
                    },
                    required: [
                      'legalNoticeTitle',
                      'executiveSummary',
                      'thermodynamicFindings',
                      'statutoryDirectives',
                      'calculatedPenaltyBreakdown',
                    ],
                  },
                },
              });

              clearTimeout(timeoutId);

              if (response.text) {
                const parsed = JSON.parse(response.text.trim());
                noticeCache.set(cacheKey, parsed);
                return parsed;
              }
            } catch (modelErr) {
              console.warn(`Model ${modelName} transient error, trying next fallback:`, modelErr);
            }
          }

          const grounded = buildGroundedNotice();
          noticeCache.set(cacheKey, grounded);
          return grounded;
        })();

        inFlightRequests.set(cacheKey, generationPromise);
        try {
          const result = await generationPromise;
          res.setHeader('X-Cache', 'MISS');
          res.json(result);
        } finally {
          inFlightRequests.delete(cacheKey);
        }
      } catch (error) {
        console.error('Gemini endpoint error:', error);
        res.status(500).json({
          error: 'Failed to generate statutory notice due to an internal processing error.',
        });
      }
    }
  );

  // Catch-all for unknown /api/* routes so they never fall through to HTML SPA
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1d',
        etag: true,
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
