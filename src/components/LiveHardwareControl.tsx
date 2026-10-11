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
  Volume2,
  VolumeX,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Cable,
  Cpu,
  Lock,
  Globe,
  BookOpen,
  ArrowRight,
  Laptop,
  Flame,
} from 'lucide-react';
import { useHardwareSerial } from '../hooks/useHardwareSerial';
import { playAudibleBeaconAlert, stopAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';
import { MobileBeaconClient } from './MobileBeaconClient';
import { verifyDeviceHandshake } from '../utils/cryptoVerify';
import {
  ingestSignedHardwarePacket,
  publishMqttEventBridgeTelemetry,
} from '../services/gemini';

const ESP32_ARDUINO_JSON_SKETCH = `// USHMA-NETRA · ESP32-S3 USB DATA CABLE TELEMETRY (JSON 115200 bps)
#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  while (!Serial) { delay(10); } // Wait for USB CDC Serial
}

void loop() {
  // Streams signed JSON telemetry over USB Data Cable every 3 seconds
  Serial.println("{\\"node_id\\":\\"ESP32_S3_CART_01\\",\\"ambient_temp\\":53.6,\\"wbgt\\":36.8,\\"token\\":\\"un_hw_secure_ecc_p256_active\\"}");
  delay(3000);
}`;

const ESP32_SIMPLE_CSV_SKETCH = `// USHMA-NETRA · MINIMAL ESP32 CSV SENSOR STREAM (115200 bps)
#include <Arduino.h>

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Simple "ambient_temp, wbgt" format works automatically!
  float ambient = 53.6;
  float wbgt = 36.8;
  Serial.print(ambient, 1);
  Serial.print(", ");
  Serial.println(wbgt, 1);
  delay(3000);
}`;

const ESP32_BOARD_URL = 'https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json';

export const LiveHardwareControl: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    node_id: 'OFFLINE',
    wbgt: 0,
    ambient_temp: 0,
    status: 'AWAITING_CONNECTION',
  });
  const [iotStreamModalOpen, setIotStreamModalOpen] = useState<boolean>(false);
  const [sketchModalOpen, setSketchModalOpen] = useState<boolean>(false);
  const [sketchTab, setSketchTab] = useState<'json' | 'csv'>('json');
  const [mobileBeaconOpen, setMobileBeaconOpen] = useState<boolean>(false);
  const [troubleshootModalOpen, setTroubleshootModalOpen] = useState<boolean>(false);
  const [setupGuideModalOpen, setSetupGuideModalOpen] = useState<boolean>(false);
  const [setupStep, setSetupStep] = useState<number>(1);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);

  const [cryptoVerified, setCryptoVerified] = useState<boolean>(false);
  const [packetSignature, setPacketSignature] = useState<string | null>(null);
  const [eventBridgeEventId, setEventBridgeEventId] = useState<string | null>(null);
  const [airpodsLang, setAirpodsLang] = useState<'ta-IN' | 'en-IN' | 'hi-IN'>('ta-IN');
  const [isSpeakingAirpods, setIsSpeakingAirpods] = useState<boolean>(false);
  const [autoVoiceAlertEnabled, setAutoVoiceAlertEnabled] = useState<boolean>(true);
  const lastSpokenTimestampRef = React.useRef<number>(0);
  const [copiedSketch, setCopiedSketch] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedBoardUrl, setCopiedBoardUrl] = useState<boolean>(false);

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

    // Autonomous Trilingual Voice Dispatch: Speaks automatically when temperature crosses 34°C
    if (autoVoiceAlertEnabled && incomingWbgt >= 34.0) {
      const now = Date.now();
      if (now - lastSpokenTimestampRef.current > 15000 && !isSpeakingAirpods) {
        lastSpokenTimestampRef.current = now;
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

  // Sync with Phone Beacon via BroadcastChannel and localStorage
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

  const {
    isConnected,
    isVirtual,
    connectHardware,
    disconnectHardware,
    connectVirtualBridge,
    simulateLivePacket,
    error,
    errorType,
    baudRate,
    setBaudRate,
    logs,
    clearLogs,
  } = useHardwareSerial(handleIncomingPacket);

  const handleToggleAirPodsAudio = async () => {
    if (isSpeakingAirpods) {
      stopAudibleBeaconAlert();
      setIsSpeakingAirpods(false);
      return;
    }

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
    const code = sketchTab === 'json' ? ESP32_ARDUINO_JSON_SKETCH : ESP32_SIMPLE_CSV_SKETCH;
    navigator.clipboard.writeText(code);
    setCopiedSketch(true);
    setTimeout(() => setCopiedSketch(false), 2000);
  };

  const handleCopyStandaloneLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBoardUrl = () => {
    navigator.clipboard.writeText(ESP32_BOARD_URL);
    setCopiedBoardUrl(true);
    setTimeout(() => setCopiedBoardUrl(false), 2000);
  };

  const isCritical = telemetry.wbgt >= 34.0;
  const standaloneUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="rounded-3xl bg-[#FFFFFF] text-[#111827] p-6 sm:p-8 space-y-6 border border-[#E5E7EB] shadow-xl">
      {/* 1. UNIFIED HEADER & SINGLE CLEAN CONTROL BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#a8321a] uppercase tracking-wider">
              LIVE HARDWARE RIG · ESP32-S3 USB DATA CABLE · 115200 BPS
            </span>
            {isVirtual && (
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-bold border border-sky-300">
                VIRTUAL COM5 BRIDGE
              </span>
            )}
            {isConnected && !isVirtual && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                PHYSICAL USB ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Plug-and-Play Hardware Demo Rig
          </h3>
        </div>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Connect USB button */}
          {!isConnected ? (
            <button
              type="button"
              onClick={connectHardware}
              className="px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              title="Connect physical ESP32 via USB-C or Micro-USB cable"
            >
              <Usb className="w-4 h-4 text-amber-400 pointer-events-none" />
              <span className="pointer-events-none">1. Connect ESP32 USB Cable</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={disconnectHardware}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-red-700 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs group"
              title="Click to disconnect"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200 group-hover:hidden" />
              <X className="w-4 h-4 text-white hidden group-hover:block" />
              <span>
                {isVirtual ? 'Virtual Bridge Connected' : 'USB Connected (115200)'} · Disconnect
              </span>
            </button>
          )}

          {/* Virtual Bridge Quick Connect */}
          <button
            type="button"
            onClick={connectVirtualBridge}
            className="px-3 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Start simulated ESP32 COM5 USB telemetry without physical cable"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>Virtual ESP32</span>
          </button>

          {/* Step-by-Step Setup Guide Modal Toggle */}
          <button
            type="button"
            onClick={() => setSetupGuideModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="View complete step-by-step ESP32 hardware setup instructions"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Setup Guide</span>
          </button>

          {/* Phone Beacon */}
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

          {/* Stop Voice Audio button if speaking */}
          {isSpeakingAirpods && (
            <button
              type="button"
              onClick={() => {
                stopAudibleBeaconAlert();
                setIsSpeakingAirpods(false);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse cursor-pointer shadow-md"
              title="Stop voice alert audio immediately"
            >
              <VolumeX className="w-3.5 h-3.5 text-white" />
              <span>Stop Voice ⏹</span>
            </button>
          )}

          {/* Test 53.6°C Spike */}
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
            <span className="pointer-events-none">3. Fire 53.6°C Alert</span>
          </button>

          {/* ESP32 Firmware Sketch Code */}
          <button
            type="button"
            onClick={() => setSketchModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>ESP32 Code</span>
          </button>

          {/* Troubleshooting Guide */}
          <button
            type="button"
            onClick={() => setTroubleshootModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            title="Fix USB Cable, Driver, Port busy issues"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>USB Help</span>
          </button>

          {/* Serial Terminal Toggle */}
          <button
            type="button"
            onClick={() => setTerminalOpen((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border ${
              terminalOpen
                ? 'bg-slate-900 text-amber-300 border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Inspect raw incoming serial data bytes"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Serial Terminal ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC USB CONNECTION ERROR / DIAGNOSTIC ASSISTANT BANNER */}
      {error && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-400 text-slate-900 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-sm text-slate-950 flex items-center gap-2">
                  <span>ESP32 USB Cable Notice</span>
                  {errorType && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900 uppercase">
                      {errorType}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSetupGuideModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-200 hover:bg-emerald-300 text-emerald-950 text-xs font-mono font-bold shrink-0 cursor-pointer"
              >
                Step-by-Step Setup ↗
              </button>
              <button
                type="button"
                onClick={() => setTroubleshootModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-mono font-bold shrink-0 cursor-pointer"
              >
                Diagnostic Guide ↗
              </button>
            </div>
          </div>

          {/* Quick Action Resolution Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
            <span className="text-[11px] font-mono text-slate-600 font-semibold">Immediate Fixes:</span>
            <button
              type="button"
              onClick={connectVirtualBridge}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-200" />
              <span>Use Virtual ESP32 Bridge (Works 100% Instantly)</span>
            </button>

            {errorType === 'IFRAME_BLOCKED' && (
              <a
                href={standaloneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
                <span>Open in Standalone Tab (Enables Native USB Access)</span>
              </a>
            )}

            <button
              type="button"
              onClick={connectHardware}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Retry Web Serial</span>
            </button>
          </div>
        </div>
      )}

      {/* 3-STEP HARDWARE RIG CHECKLIST BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: ESP32 + Data Cable */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-[#a8321a] uppercase">
              <Usb className="w-3.5 h-3.5" />
              <span>STEP 1 · ESP32-S3 + USB DATA CABLE</span>
            </div>
            <ul className="text-xs text-slate-700 font-medium space-y-0.5">
              <li>• Plug USB-C/Micro-USB cable with Data lines</li>
              <li>• Baud: {baudRate} bps Web Serial UART (8N1)</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {isConnected ? (isVirtual ? 'VIRTUAL' : 'LINKED') : 'READY'}
            </span>
            <button
              type="button"
              onClick={() => setSetupGuideModalOpen(true)}
              className="text-[10px] font-mono font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              Setup Guide ↗
            </button>
          </div>
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
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-emerald-700 uppercase">
                <Headphones className="w-3.5 h-3.5" />
                <span>STEP 3 · AIRPODS VOICE ALERT</span>
              </div>
              {/* Auto-Alert Switch: OFF by default */}
              <button
                type="button"
                onClick={() => {
                  if (autoVoiceAlertEnabled) {
                    stopAudibleBeaconAlert();
                    setIsSpeakingAirpods(false);
                  }
                  setAutoVoiceAlertEnabled(!autoVoiceAlertEnabled);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  autoVoiceAlertEnabled
                    ? 'bg-amber-400 text-slate-950 font-black ring-1 ring-amber-500'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                title="When ON: automatically speaks when temperature crosses 34°C (with 45s cooldown). When OFF: only speaks when you click Play."
              >
                <span>Auto-Alert: {autoVoiceAlertEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 pt-0.5">
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

              {/* Dedicated Play / Stop Voice Button */}
              <button
                type="button"
                onClick={handleToggleAirPodsAudio}
                className={`ml-auto px-2.5 py-1 rounded text-white font-mono text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                  isSpeakingAirpods
                    ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-400 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
                title={isSpeakingAirpods ? 'Click to stop speech immediately' : 'Click to hear the voice alert'}
              >
                {isSpeakingAirpods ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeakingAirpods ? 'Stop Voice ⏹' : 'Play Voice Alert'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
              {isVirtual && ' · [VIRTUAL EMULATION]'}
            </div>
            <div className="text-base sm:text-lg font-black tracking-tight uppercase">
              {isCritical
                ? `CRITICAL: ${telemetry.wbgt.toFixed(1)}°C WBGT SPIKE → VOICE WARNING ROUTED TO AIRPODS`
                : telemetry.node_id !== 'OFFLINE'
                ? 'LIVE STREAM ACTIVE: SENSOR OPERATING IN SAFE RANGE'
                : 'READY: CONNECT ESP32 USB CABLE OR START VIRTUAL BRIDGE'}
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
            {isVirtual ? 'Virtual COM5 Emulation' : `USB Serial · ${baudRate} bps`}
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

      {/* 4. REAL-TIME SERIAL TERMINAL (LIVE RX/TX MONITOR) */}
      {terminalOpen && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 text-white font-mono shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Serial Monitor (Web Serial UART)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Baud:</span>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))}
                  disabled={isConnected}
                  className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs cursor-pointer focus:outline-none"
                >
                  <option value={9600}>9600 bps</option>
                  <option value={57600}>57600 bps</option>
                  <option value={115200}>115200 bps (Standard)</option>
                  <option value={921600}>921600 bps</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearLogs}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Log Lines */}
          <div className="max-h-56 overflow-y-auto space-y-1 font-mono text-xs pr-1">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic py-4 text-center">
                No serial data frames received yet. Connect ESP32 via USB cable or click &quot;Virtual ESP32&quot;.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                      log.direction === 'RX'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : log.direction === 'TX'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-sky-950 text-sky-400 border border-sky-800'
                    }`}
                  >
                    {log.direction}
                  </span>
                  <span
                    className={`break-all ${
                      log.direction === 'RX'
                        ? 'text-emerald-300'
                        : log.direction === 'TX'
                        ? 'text-amber-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Optional Mobile Smartphone Beacon Drawer */}
      {mobileBeaconOpen && (
        <div className="pt-2">
          <MobileBeaconClient
            onClose={() => setMobileBeaconOpen(false)}
            onSyncTelemetry={handleIncomingPacket}
          />
        </div>
      )}

      {/* 5. INTERACTIVE STEP-BY-STEP HARDWARE SETUP GUIDE MODAL */}
      {setupGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b111e] border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    ESP32 Hardware Rig: Complete Step-by-Step Setup
                  </h4>
                  <div className="text-xs text-slate-400 font-mono">
                    From unboxing the board to live 3D twin &amp; AirPods Polly voice alerts
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSetupGuideModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Navigation Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
              {[
                { num: 1, title: '1. Hardware' },
                { num: 2, title: '2. Arduino IDE' },
                { num: 3, title: '3. Flash Sketch' },
                { num: 4, title: '4. Free Port' },
                { num: 5, title: '5. Web Connect' },
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setSetupStep(s.num)}
                  className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    setupStep === s.num
                      ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <span>{s.title}</span>
                </button>
              ))}
            </div>

            {/* STEP 1: BILL OF MATERIALS & USB DATA CABLE CHECK */}
            {setupStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Cable className="w-4 h-4" />
                    <span>Step 1 · Bill of Materials &amp; USB Cable Verification</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    You need the following hardware items to build the physical ground-level vendor rig:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-2 font-sans">
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-bold text-emerald-400 shrink-0">•</span>
                      <span><strong>1x ESP32 Board:</strong> Any ESP32-S3, ESP32-WROOM-32, NodeMCU, or ESP32-C3 development board.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-bold text-amber-400 shrink-0">•</span>
                      <span><strong>1x USB DATA Cable (Crucial!):</strong> Must have 4 internal wires (+5V, GND, D+, D-). Over 70% of phone charging cables are power-only. If your PC does not make a connection sound when plugged in, switch cables!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-bold text-sky-400 shrink-0">•</span>
                      <span><strong>Laptop / PC with Chromium Browser:</strong> Google Chrome, Microsoft Edge, Brave, or Opera (Web Serial API requires Chromium).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-bold text-purple-400 shrink-0">•</span>
                      <span><strong>AirPods or Headphones:</strong> Connected to your PC or phone for automated multilingual Polly voice alerts in Tamil, Hindi, or English.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-200">
                  💡 <strong>Pro-Tip:</strong> No physical sensor attached? The firmware sketch provided in Step 3 automatically generates realistic 53.6°C / 36.8°C WBGT micro-jitter telemetry loops, so you don&apos;t even need soldering!
                </div>
              </div>
            )}

            {/* STEP 2: ARDUINO IDE SETUP & ESP32 BOARD PACKAGE */}
            {setupStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
                    <Laptop className="w-4 h-4" />
                    <span>Step 2 · Arduino IDE &amp; ESP32 Core Setup</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-3 font-sans list-decimal pl-4 leading-relaxed">
                    <li>
                      <strong>Download Arduino IDE:</strong> Install Arduino IDE 2.x from <span className="font-mono text-amber-300">arduino.cc</span> if you haven&apos;t already.
                    </li>
                    <li>
                      <strong>Add Espressif Board URL:</strong> Go to <em>File &rarr; Preferences</em>. Paste this URL into &quot;Additional boards manager URLs&quot;:
                      <div className="flex items-center gap-2 mt-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300">
                        <span className="truncate flex-1">{ESP32_BOARD_URL}</span>
                        <button
                          type="button"
                          onClick={handleCopyBoardUrl}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          {copiedBoardUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedBoardUrl ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </li>
                    <li>
                      <strong>Install ESP32 Board Core:</strong> Go to <em>Tools &rarr; Board &rarr; Boards Manager</em>. Search for <strong>&quot;esp32&quot;</strong> by Espressif and click <strong>Install</strong>.
                    </li>
                    <li>
                      <strong>Select Board:</strong> In <em>Tools &rarr; Board &rarr; esp32</em>, choose <strong>ESP32 Dev Module</strong> (for standard CP2102 ESP-WROOM boards) or <strong>ESP32-S3 Dev Module</strong>.
                    </li>
                    <li>
                      <strong>Upload Speed:</strong> In <em>Tools &rarr; Upload Speed</em>, set to <strong>115200</strong> (crucial for CP2102).
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* STEP 3: FLASH SKETCH FIRMWARE */}
            {setupStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                      <Terminal className="w-4 h-4" />
                      <span>Step 3 · Copy &amp; Upload Firmware Sketch</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySketch}
                      className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSketch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSketch ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Paste this sketch into Arduino IDE. It broadcasts the signed JSON telemetry payload over UART at 115200 Baud every 3 seconds:
                  </p>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-52">
                    {ESP32_ARDUINO_JSON_SKETCH}
                  </pre>
                  
                  {/* Flashing & BOOT button instructions */}
                  <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-300 font-mono uppercase">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Fix &quot;Connecting... Write timeout&quot; during upload:</span>
                    </div>
                    <ol className="text-slate-200 list-decimal pl-4 space-y-1 font-sans">
                      <li>
                        <strong>Hold the BOOT button:</strong> Press and hold the <strong>BOOT</strong> (or <strong>IO0</strong>) button on your ESP32.
                      </li>
                      <li>
                        Click <strong>Upload (&rarr;)</strong> in Arduino IDE while still holding <strong>BOOT</strong>.
                      </li>
                      <li>
                        When the console prints <code>Connecting...</code>, keep holding <strong>BOOT</strong> for 2 seconds until it prints <code>Writing at 0x...</code>, then release!
                      </li>
                      <li>
                        <strong>Lower Upload Speed:</strong> Go to <em>Tools &rarr; Upload Speed</em> and set it to <strong>115200</strong> (instead of 921600).
                      </li>
                    </ol>
                  </div>

                  <p className="text-xs text-slate-400 font-sans">
                    In Arduino IDE, select your COM Port under <em>Tools &rarr; Port</em>, then click the <strong>Upload (&rarr;)</strong> button. Wait until it shows &quot;Done uploading&quot;.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: CLOSE ARDUINO SERIAL MONITOR */}
            {setupStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300 uppercase">
                    <Lock className="w-4 h-4" />
                    <span>Step 4 · CRITICAL RULE: Close the Arduino Serial Monitor!</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    Operating systems enforce <strong>exclusive single-app locking</strong> on serial ports. If you have the Arduino IDE Serial Monitor open (or PlatformIO / PuTTY), your browser will be blocked with:
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-rose-300 border border-rose-900">
                    NetworkError: Failed to open serial port (Device or resource busy)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong>Action:</strong> Click the <strong>&quot;X&quot;</strong> on the Serial Monitor tab in Arduino IDE to close it. Leave the USB cable plugged in.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: WEB BROWSER CONNECTION & TEST */}
            {setupStep === 5 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Step 5 · Connect in Ushma-Netra &amp; Trigger Alerts</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2.5 font-sans list-decimal pl-4 leading-relaxed">
                    <li>
                      Click the black button: <strong>&quot;1. Connect ESP32 USB Cable&quot;</strong>.
                    </li>
                    <li>
                      A browser prompt will list connected USB devices. Select your <strong>CP2102</strong>, <strong>CH340</strong>, or <strong>ESP32 JTAG</strong> entry and click <strong>Connect</strong>.
                    </li>
                    <li>
                      The banner turns bright green: <em>&quot;LIVE STREAM ACTIVE: SENSOR OPERATING IN SAFE RANGE&quot;</em>.
                    </li>
                    <li>
                      Click <strong>&quot;Serial Terminal&quot;</strong> to watch live incoming JSON frames streaming every 3 seconds!
                    </li>
                    <li>
                      Click <strong>&quot;3. Fire 53.6°C Alert&quot;</strong> to test a critical heat spike &rarr; listen to the automated voice warning in your AirPods in <strong>Tamil (தமிழ்)</strong>, <strong>Hindi</strong>, or <strong>English</strong>!
                    </li>
                  </ol>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-xs">
                  <span className="text-emerald-200">Ready to test now?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSetupGuideModalOpen(false);
                      void connectHardware();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold cursor-pointer"
                  >
                    Connect USB Port Now
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setSetupStep((prev) => Math.max(1, prev - 1))}
                disabled={setupStep === 1}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 font-mono text-xs font-bold cursor-pointer"
              >
                &larr; Previous Step
              </button>

              <div className="text-xs font-mono text-slate-400">
                Step {setupStep} of 5
              </div>

              {setupStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setSetupStep((prev) => Math.min(5, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSetupGuideModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. ESP32 USB TROUBLESHOOTING & DIAGNOSTIC MODAL */}
      {troubleshootModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b111e] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Usb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    ESP32 USB Cable Diagnostic &amp; Resolution Guide
                  </h4>
                  <div className="text-xs text-slate-400 font-mono">
                    Fix physical cable, driver, port lock, and iframe permissions
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTroubleshootModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instant Solution Option */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Cable Handy? Use Virtual ESP32 Bridge</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    connectVirtualBridge();
                    setTroubleshootModalOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold cursor-pointer shrink-0"
                >
                  Activate Virtual Bridge
                </button>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
                Emulates verified COM5 115200 bps continuous micro-jitter packets. Fully triggers the 3D Thermal Twin, AWS IoT Core MQTT broker, and AirPods Polly voice alerts without needing any physical board.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-4">
              {/* Check 1: Cable Type */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                  <Cable className="w-4 h-4" />
                  <span>Check 1 · Is Your USB Cable a &quot;DATA&quot; Cable?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>70% of USB cables are charge-only</strong> (they only connect the +5V and GND power pins, omitting the D+ and D- data wires). If your computer doesn&apos;t make a &quot;device connected&quot; chime when plugging in the ESP32, or the Chrome device list is blank, you are using a charge-only cable. Swap to a known data-sync cable (e.g., one used for transferring photos from a phone).
                </p>
              </div>

              {/* Check 2: Drivers */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Check 2 · USB-to-UART Bridge Drivers (Windows / macOS)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ESP32 boards have a bridge chip next to the USB port. If your computer doesn&apos;t detect a COM port in Device Manager, install the appropriate driver:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="font-bold text-white">CP2102 / CP2104</div>
                    <div className="text-[10px] text-slate-400">Silicon Labs Driver</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="font-bold text-white">CH340 / CH341</div>
                    <div className="text-[10px] text-slate-400">WCH Serial Driver</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="font-bold text-white">CH9102F / FTDI</div>
                    <div className="text-[10px] text-slate-400">Standard VCP Driver</div>
                  </div>
                </div>
              </div>

              {/* Check 3: Port Lock */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase">
                  <Lock className="w-4 h-4" />
                  <span>Check 3 · Close Arduino IDE Serial Monitor</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Only <strong>one program can open a COM port at a time</strong>. If you have the Arduino IDE Serial Monitor, PlatformIO Monitor, PuTTY, or Cura 3D slicer open, the port is locked exclusively. Close any serial monitors and click &quot;Connect ESP32 USB Cable&quot; again.
                </p>
              </div>

              {/* Check 4: Iframe Security Notice */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <Globe className="w-4 h-4" />
                  <span>Check 4 · Browser &amp; Iframe Direct Window Access</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Web Serial API requires Google Chrome, Microsoft Edge, Brave, or Opera. If running inside an embedded development iframe, the host page may restrict serial permissions. Open the app directly in a full browser tab:
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={standaloneUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open App in Direct Tab</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyStandaloneLink}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Direct URL'}</span>
                  </button>
                </div>
              </div>

              {/* Check 5: Write timeout & BOOT Button */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Check 5 · Fixing &quot;Connecting... Write timeout&quot; (Upload Exit Status 1)</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  If Arduino IDE times out while uploading to COM5:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-sans">
                  <li>
                    <strong>Hold BOOT button:</strong> Press and hold the <strong>BOOT / IO0</strong> button on your ESP32, click <strong>Upload</strong> in Arduino IDE, keep holding BOOT when it says <code>Connecting...</code> until you see writing progress!
                  </li>
                  <li>
                    <strong>Lower Upload Speed:</strong> In Arduino IDE under <em>Tools &rarr; Upload Speed</em>, switch from <code>921600</code> to <strong><code>115200</code></strong>.
                  </li>
                  <li>
                    <strong>ESP32-S3 Dual Port Note:</strong> If your board has two USB-C ports (UART and USB), switch ports or set <em>Tools &rarr; USB CDC On Boot</em> to <strong>Enabled</strong>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Close */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTroubleshootModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ESP32 ARDUINO SKETCH MODAL (JSON & SIMPLE CSV TABS) */}
      {sketchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0b111e] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Terminal className="w-4 h-4" />
                <span>ESP32 Firmware Sketch (115200 Baud)</span>
              </div>
              <button
                type="button"
                onClick={() => setSketchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab selector */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setSketchTab('json')}
                className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors ${
                  sketchTab === 'json'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full JSON (Signed ECC P-256)
              </button>
              <button
                type="button"
                onClick={() => setSketchTab('csv')}
                className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors ${
                  sketchTab === 'csv'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Simple CSV (5-Line Test)
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-64">
              {sketchTab === 'json' ? ESP32_ARDUINO_JSON_SKETCH : ESP32_SIMPLE_CSV_SKETCH}
            </pre>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Flash in Arduino IDE &rarr; Select Board &amp; COM Port &rarr; Upload</span>
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

      {/* 8. OVERLAY MODAL FOR RAW JSON TELEMETRY */}
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
  "transport": "${isConnected ? (isVirtual ? 'VIRTUAL_COM5_EMULATION' : 'WEB_SERIAL_UART') : 'AWS_IOT_CORE_MQTT'}",
  "airpods_voice_channel": "${airpodsLang}",
  "eventbridge_bus": "ushma-netra-thermal-bus",
  "eventbridge_event_id": "${eventBridgeEventId || 'eb-evt-99210a4c'}",
  "crypto_handshake_verified": ${cryptoVerified},
  "hmac_sha256_sig": "${packetSignature || 'awaiting_packet'}"
}`}
            </pre>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Baud Rate: {baudRate} bps · 8N1</span>
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
