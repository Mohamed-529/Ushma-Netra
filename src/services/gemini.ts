import { BuildingAudit, VendorTelemetry, IncidentLog } from '../types';

export interface StatutoryNoticeResponse {
  legalNoticeTitle: string;
  executiveSummary: string;
  thermodynamicFindings: string;
  statutoryDirectives: string[];
  calculatedPenaltyBreakdown: string;
}

// Client-side session cache to avoid redundant network hits on repeated clicks
const clientNoticeCache = new Map<string, StatutoryNoticeResponse>();

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function generateThermalAuditNotice(
  building: BuildingAudit,
  vendor: VendorTelemetry
): Promise<StatutoryNoticeResponse> {
  const cacheKey = `${building.id}:${vendor.id}:${building.monthlyExhaustTaxInr}`;
  const cached = clientNoticeCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetchWithTimeout(
      '/api/gemini/thermal-audit-notice',
      {
        method: 'POST',
        body: JSON.stringify({ building, vendor }),
      },
      12000
    );

    if (response.ok) {
      const parsed = await response.json();
      if (parsed && parsed.legalNoticeTitle) {
        clientNoticeCache.set(cacheKey, parsed);
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Server Gemini endpoint fell back to deterministic generator:', error);
  }

  // High-fidelity domain-grounded fallback
  const fallback: StatutoryNoticeResponse = {
    legalNoticeTitle: `NOTICE UNDER SEC 133 CrPC / MUNICIPAL CORP ACT: UNLAWFUL ANTHROPOGENIC HEAT DUMPING (REF: UN/NDMC/${building.id.toUpperCase()}/2026)`,
    executiveSummary: `Inspection by Ushma-Netra autonomous sensors and street-view computer vision confirmed that ${building.name} is rejecting an unmitigated ${building.rejectedHeatKw} kW of sensible waste heat at ${building.exhaustAirTempCelsius}°C into the public alleyway, artificially inflating ambient pedestrian temperatures by +${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C.`,
    thermodynamicFindings: `The building operates ${building.detectedOutdoorUnits.splitUnits} split and ${building.detectedOutdoorUnits.vrfUnits} VRF outdoor condenser units facing horizontally into a narrow ${building.canyonWidthMeters}m street canyon. This creates an unventilated micro-thermal plume where local Wet Bulb Globe Temperature reaches ${vendor.wetBulbGlobeTempCelsius}°C, imposing physiological heat-stroke lethality on outdoor vendor ${vendor.vendorName} and 140+ neighboring residents.`,
    statutoryDirectives: [
      `Immediate Engineering Order: Install 45° upward aerodynamic deflector cowls on all outdoor units facing the alley within 14 calendar days.`,
      `Civic Restitution: Fund the installation and maintenance of 2 high-pressure evaporative misting cooling kiosks along the vendor corridor.`,
      `Façade Mitigation: Deploy an evaporative living vertical green wall covering at least 40% of the ground-level exhaust frontage to absorb radiant heat.`,
    ],
    calculatedPenaltyBreakdown: `Assessed Monthly Thermal Debt Surcharge: ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')}/month. Surcharge proceeds are directly remitted to the Municipal Urban Shade & Vendor Health Protection Fund under the 2026 City Heat Action Plan.`,
  };
  clientNoticeCache.set(cacheKey, fallback);
  return fallback;
}

export async function recordBuildingMitigation(
  buildingId: string,
  intervention: string
): Promise<{ status: string; building?: BuildingAudit; log?: IncidentLog; signature?: string } | null> {
  try {
    const res = await fetchWithTimeout(`/api/buildings/${encodeURIComponent(buildingId)}/mitigate`, {
      method: 'POST',
      body: JSON.stringify({ intervention }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function ingestSignedHardwarePacket(payload: {
  node_id: string;
  ambient_temp: number;
  wbgt: number;
  token: string;
  vendor_id?: string;
}): Promise<{
  verified: boolean;
  hmacSignature?: string;
  heatStressCategory?: string;
} | null> {
  try {
    const res = await fetchWithTimeout('/api/telemetry/ingest', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Graceful offline fallback
  }
  return null;
}

export async function dispatchEmergencyAlertApi(payload: {
  recipientNumber: string;
  recipientPersona: 'vendor' | 'health_officer' | 'rwa';
  language: 'en' | 'hi' | 'ta';
  tier: 'tier1' | 'tier2';
}): Promise<{
  id: string;
  to: string;
  time: string;
  channel: 'SMS' | 'WhatsApp';
  text: string;
  status: 'Delivered';
  signature?: string;
} | null> {
  try {
    const res = await fetchWithTimeout('/api/alerts/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Graceful offline fallback
  }
  return null;
}
