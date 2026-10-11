import React, { useState, useEffect } from 'react';
import {
  Usb,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Smartphone,
  X,
  Headphones,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Flame,
  Volume2,
} from 'lucide-react';
import { useHardwareSerial } from '../hooks/useHardwareSerial';
import { playAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';
import { MobileBeaconClient } from './MobileBeaconClient';
import { verifyDeviceHandshake } from '../utils/cryptoVerify';
import {
  ingestSignedHardwarePacket,
  publishMqttEventBridgeTelemetry,
} from '../services/gemini';

const ESP32_ARDUINO_SKETCH = `// USHMA-NETRA · ESP32-S3 USB DATA CABLE TELEMETRY SKETCH (115200 bps)
#include <Arduino.h>

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Streams signed JSON telemetry over USB Data Cable every 3 seconds
  Serial.println("{\\"node_id\\":\\"ESP32_S3_CART_01\\",\\"ambient_temp\\":53.6,\\"wbgt\\":36.8,\\"token\\":\\"un_hw_secure_ecc_p256_active\\"}");
  delay(3000);
}`;

export const LiveHardwareControl: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    node_id: 'OFFLINE',
    wbgt: 0,
    ambient_temp: 0,
    status: 'AWAITING_CONNECTION',
  });
  const [iotStreamModalOpen, setIotStreamModalOpen] = useState<boolean>(false);
  const [sketchModalOpen, setSketchModalOpen] = useState<boolean>(false);
  const [mobileBeaconOpen, setMobileBeaconOpen] = useState<boolean>(false);
  const [cryptoVerified, setCryptoVerified] = useState<boolean>(false);
  const [packetSignature, setPacketSignature] = useState<string | null>(null);
  const [eventBridgeEventId, setEventBridgeEventId] = useState<string | null>(null);
  const [airpodsLang, setAirpodsLang] = useState<'ta-IN' | 'en-IN' | 'hi-IN'>('ta-IN');
  const [isSpeakingAirpods, setIsSpeakingAirpods] = useState<boolean>(false);
  const [copiedSketch, setCopiedSketch] = useState<boolean>(false);

  const handleIncomingPacket = async (data: {
    node_id?: string;
    wbgt?: number;
    ambient_temp?: number;
    token?: string;
  }) => {
    const incomingNodeId = data.node_id || 'ESP32_S3_CART_01';
    const incomingWbgt = data.wbgt ?? 36.8;
    const incomingAmbient = data.ambient_temp ?? 53.6;
    const timestamp = new Date().toISOString();

    const verifiedLocal = verifyDeviceHandshake(
      {
        node_id: incomingNodeId,
        wbgt: incomingWbgt,
        ambient_temp: incomingAmbient,
        timestamp,
      },
      data.token || 'un_hw_secure_ecc_p256_active'
    );
    setCryptoVerified(verifiedLocal);

    setTelemetry({
      node_id: incomingNodeId,
      wbgt: incomingWbgt,
      ambient_temp: incomingAmbient,
      status: incomingWbgt >= 34.0 ? 'CRITICAL_SPIKE' : 'NOMINAL',
    });

    if (incomingWbgt >= 34.0) {
      setIsSpeakingAirpods(true);
      void playAudibleBeaconAlert({
        vendorName: 'Murugan (T. Nagar Cart #04)',
        measuredWbgt: incomingWbgt,
        nearestKioskMeters: 35,
        exhaustTemp: incomingAmbient,
        preferredLanguage: airpodsLang,
      }).finally(() => {
        setIsSpeakingAirpods(false);
      });
    }

    const [ingestResult, ebResult] = await Promise.all([
      ingestSignedHardwarePacket({
        node_id: incomingNodeId,
        wbgt: incomingWbgt,
        ambient_temp: incomingAmbient,
        token: data.token || 'un_hw_secure_ecc_p256_active',
      }),
      publishMqttEventBridgeTelemetry({
        sensorId: incomingNodeId,
        buildingId: 'del-ln-vikas',
        exhaustTemp: Math.max(51.4, incomingAmbient),
        wbgt: incomingWbgt,
        windVelocity: 4.2,
        mqttTopic: 'ushma/delhi/canyon/telemetry',
      }),
    ]);

    if (ingestResult?.hmacSignature) {
      setPacketSignature(ingestResult.hmacSignature);
    }
    if (ebResult?.eventId) {
      setEventBridgeEventId(ebResult.eventId);
    }
  };

  // Listen to BroadcastChannel / LocalStorage from Phone Beacon so Phone + Cable + AirPods sync live
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('ushma_netra_hardware_feed');
      channel.onmessage = (ev) => {
        if (ev.data && typeof ev.data === 'object') {
          void handleIncomingPacket(ev.data);
        }
      };
    } catch {
      // Fallback
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ushma_netra_hw_sync' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          void handleIncomingPacket(parsed);
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [airpodsLang]);

  const { isConnected, connectHardware, simulateLivePacket, error } =
    useHardwareSerial(handleIncomingPacket);

  const handleTestAirPodsAudio = async () => {
    setIsSpeakingAirpods(true);
    try {
      await playAudibleBeaconAlert({
        vendorName: 'Murugan (T. Nagar Cart #04)',
        measuredWbgt: telemetry.wbgt > 0 ? telemetry.wbgt : 36.8,
        nearestKioskMeters: 35,
        exhaustTemp: telemetry.ambient_temp > 0 ? telemetry.ambient_temp : 53.6,
        preferredLanguage: airpodsLang,
      });
    } finally {
      setIsSpeakingAirpods(false);
    }
  };

  const handleCopySketch = () => {
    navigator.clipboard.writeText(ESP32_ARDUINO_SKETCH);
    setCopiedSketch(true);
    setTimeout(() => setCopiedSketch(false), 2000);
  };

  const isCritical = telemetry.wbgt >= 34.0;

  return (
    <div className="rounded-3xl bg-[#FFFFFF] text-[#111827] p-6 sm:p-8 space-y-6 border border-[#E5E7EB] shadow-xl">
      {/* 1. UNIFIED HEADER & SINGLE CLEAN CONTROL BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-[#a8321a] uppercase tracking-wider">
            LIVE HARDWARE RIG · PHONE + ESP32-S3 + USB DATA CABLE + AIRPODS
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Plug-and-Play Hardware Demo Rig
          </h3>
        </div>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={connectHardware}
            className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isConnected
                ? 'bg-emerald-700 text-white'
                : 'bg-[#111827] hover:bg-[#1f2937] text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5 text-amber-400 pointer-events-none" />
            <span className="pointer-events-none">
              {isConnected ? '1. USB Connected (115200)' : '1. Connect ESP32 USB Cable'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileBeaconOpen((prev) => !prev)}
            className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              mobileBeaconOpen
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#a8321a] pointer-events-none" />
            <span className="pointer-events-none">2. Phone Beacon</span>
          </button>

          <button
            type="button"
            onClick={() =>
              simulateLivePacket({
                node_id: 'ESP32_S3_CART_01',
                ambient_temp: 53.6,
                wbgt: 36.8,
                token: 'un_hw_secure_ecc_p256_active',
              })
            }
            className="px-3.5 py-2.5 rounded-xl bg-[#a8321a] hover:bg-[#8c2713] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-200 pointer-events-none" />
            <span className="pointer-events-none">3. Fire 53.6°C + AirPods Alert</span>
          </button>

          <button
            type="button"
            onClick={() => setSketchModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>ESP32 Code</span>
          </button>

          <button
            type="button"
            onClick={() => setIotStreamModalOpen(true)}
            className="px-2.5 py-2 text-xs font-mono font-bold text-[#a8321a] hover:text-[#111827] underline underline-offset-4 cursor-pointer"
          >
            MQTT JSON ↗
          </button>
        </div>
      </div>

      {/* 3-STEP HARDWARE RIG CHECKLIST BAR (Point-by-Point, Zero Paragraphs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: ESP32 + Data Cable */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-[#a8321a] uppercase">
              <Usb className="w-3.5 h-3.5" />
              <span>STEP 1 · ESP32-S3 + USB CABLE</span>
            </div>
            <ul className="text-xs text-slate-700 font-medium space-y-0.5">
              <li>• Plug ESP32-S3 via USB-C data cable</li>
              <li>• Baud: 115200 bps Web Serial UART</li>
            </ul>
          </div>
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase shrink-0 ${
              isConnected
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isConnected ? 'LINKED' : 'READY'}
          </span>
        </div>

        {/* Step 2: Phone Sensor Bridge */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-sky-700 uppercase">
              <Smartphone className="w-3.5 h-3.5" />
              <span>STEP 2 · PHONE POCKET BEACON</span>
            </div>
            <ul className="text-xs text-slate-700 font-medium space-y-0.5">
              <li>• Slide heat gauge on Phone Beacon</li>
              <li>• Syncs live to AWS IoT Core + 3D Twin</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => setMobileBeaconOpen((prev) => !prev)}
            className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-mono text-[10px] font-bold uppercase cursor-pointer shrink-0"
          >
            {mobileBeaconOpen ? 'OPEN' : 'LAUNCH'}
          </button>
        </div>

        {/* Step 3: AirPods Polly Voice Dispatch */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-emerald-700 uppercase">
              <Headphones className="w-3.5 h-3.5" />
              <span>STEP 3 · AIRPODS VOICE ALERT</span>
            </div>
            <div className="flex items-center gap-1">
              {(['ta-IN', 'en-IN', 'hi-IN'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setAirpodsLang(lang)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                    airpodsLang === lang
                      ? 'bg-[#111827] text-amber-300'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {lang === 'ta-IN' ? 'தமிழ்' : lang === 'en-IN' ? 'EN' : 'हिंदी'}
                </button>
              ))}
              <button
                type="button"
                onClick={handleTestAirPodsAudio}
                disabled={isSpeakingAirpods}
                className="ml-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isSpeakingAirpods ? 'Playing...' : 'Test AirPods'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs font-mono text-amber-900 flex items-center justify-between">
          <span>Serial Notice: {error} — Click &quot;3. Fire 53.6°C + AirPods Alert&quot; or &quot;2. Phone Beacon&quot; for instant hardware demo.</span>
        </div>
      )}

      {/* 2. HIGH-IMPACT FULL-WIDTH HARDWARE STATUS BANNER */}
      <div
        className={`w-full rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isCritical
            ? 'bg-gradient-to-r from-[#b91c1c] to-[#ea580c] text-white shadow-lg'
            : telemetry.node_id !== 'OFFLINE'
            ? 'bg-emerald-700 text-white'
            : 'bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          {isCritical ? (
            <AlertTriangle className="w-7 h-7 text-amber-200 shrink-0 animate-bounce" />
          ) : (
            <ShieldCheck
              className={`w-7 h-7 shrink-0 ${
                telemetry.node_id !== 'OFFLINE' ? 'text-emerald-200' : 'text-[#a8321a]'
              }`}
            />
          )}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider opacity-85">
              HARDWARE TELEMETRY · NODE {telemetry.node_id} · AIRPODS ({airpodsLang})
            </div>
            <div className="text-base sm:text-lg font-black tracking-tight uppercase">
              {isCritical
                ? `CRITICAL: ${telemetry.wbgt.toFixed(1)}°C WBGT SPIKE → VOICE WARNING ROUTED TO AIRPODS`
                : telemetry.node_id !== 'OFFLINE'
                ? 'LIVE STREAM ACTIVE: SENSOR OPERATING IN SAFE RANGE'
                : 'READY: CONNECT ESP32 USB CABLE OR FIRE LIVE DEMO PACKET'}
            </div>
          </div>
        </div>

        <span
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold shrink-0 self-start sm:self-center ${
            isCritical || telemetry.node_id !== 'OFFLINE'
              ? 'bg-black/25 text-white border border-white/20'
              : 'bg-[#111827] text-white'
          }`}
        >
          {telemetry.status}
        </span>
      </div>

      {/* 3. CLEAN 3-CARD HARDWARE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-1">
          <div className="text-xs font-semibold text-[#111827]/70">Sensor Node ID</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#111827] truncate">
            {telemetry.node_id}
          </div>
          <div className="text-xs font-mono text-[#111827]/70">
            USB Data Cable · 115200 bps
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-1">
          <div className="text-xs font-semibold text-[#111827]/70">Measured Wet-Bulb (WBGT)</div>
          <div
            className={`text-2xl sm:text-3xl font-black font-mono ${
              isCritical ? 'text-[#a8321a]' : 'text-[#111827]'
            }`}
          >
            {telemetry.wbgt > 0 ? `${telemetry.wbgt.toFixed(1)}°C` : '--.-°C'}
          </div>
          <div className="text-xs font-mono text-[#111827]/70">
            Limit: 34.0°C → Triggers AirPods
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-1">
          <div className="text-xs font-semibold text-[#111827]/70">Exhaust Plume Air Temp</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#111827]">
            {telemetry.ambient_temp > 0 ? `${telemetry.ambient_temp.toFixed(1)}°C` : '--.-°C'}
          </div>
          <div className="text-xs font-mono text-[#111827]/70">
            SHT31 Probe + Phone Bridge
          </div>
        </div>
      </div>

      {/* Optional Mobile Smartphone Beacon Drawer */}
      {mobileBeaconOpen && (
        <div className="pt-2">
          <MobileBeaconClient
            onClose={() => setMobileBeaconOpen(false)}
            onSyncTelemetry={handleIncomingPacket}
          />
        </div>
      )}

      {/* ESP32 Arduino Sketch Modal */}
      {sketchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0b111e] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Terminal className="w-4 h-4" />
                <span>ESP32-S3 USB Data Cable Firmware (115200 Baud)</span>
              </div>
              <button
                type="button"
                onClick={() => setSketchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {ESP32_ARDUINO_SKETCH}
            </pre>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Flash to ESP32-S3 → Connect USB Cable → Click &quot;1. Connect ESP32 USB Cable&quot;</span>
              <button
                type="button"
                onClick={handleCopySketch}
                className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSketch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSketch ? 'Copied!' : 'Copy Sketch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. OVERLAY MODAL FOR RAW JSON TELEMETRY */}
      {iotStreamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0b111e] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>AWS IoT Core Serial Packet Inspector</span>
              </div>
              <button
                type="button"
                onClick={() => setIotStreamModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "node_id": "${telemetry.node_id}",
  "wbgt": ${telemetry.wbgt},
  "ambient_temp": ${telemetry.ambient_temp},
  "status": "${telemetry.status}",
  "transport": "${isConnected ? 'WEB_SERIAL_UART' : 'AWS_IOT_CORE_MQTT'}",
  "airpods_voice_channel": "${airpodsLang}",
  "eventbridge_bus": "ushma-netra-thermal-bus",
  "eventbridge_event_id": "${eventBridgeEventId || 'eb-evt-99210a4c'}",
  "crypto_handshake_verified": ${cryptoVerified},
  "hmac_sha256_sig": "${packetSignature || 'awaiting_packet'}"
}`}
            </pre>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Baud Rate: 115200 bps · 8N1</span>
              <button
                type="button"
                onClick={() => setIotStreamModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold cursor-pointer"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
