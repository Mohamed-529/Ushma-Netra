import React, { useState } from 'react';
import {
  Usb,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Smartphone,
  X,
} from 'lucide-react';
import { useHardwareSerial } from '../hooks/useHardwareSerial';
import { playAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';
import { MobileBeaconClient } from './MobileBeaconClient';
import { verifyDeviceHandshake } from '../utils/cryptoVerify';
import { ingestSignedHardwarePacket } from '../services/gemini';

export const LiveHardwareControl: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    node_id: 'OFFLINE',
    wbgt: 0,
    ambient_temp: 0,
    status: 'AWAITING_CONNECTION',
  });
  const [iotStreamModalOpen, setIotStreamModalOpen] = useState<boolean>(false);
  const [mobileBeaconOpen, setMobileBeaconOpen] = useState<boolean>(false);
  const [cryptoVerified, setCryptoVerified] = useState<boolean>(false);
  const [packetSignature, setPacketSignature] = useState<string | null>(null);

  const handleIncomingPacket = async (data: {
    node_id?: string;
    wbgt?: number;
    ambient_temp?: number;
    token?: string;
  }) => {
    const incomingNodeId = data.node_id || 'ESP32_CART_01';
    const incomingWbgt = data.wbgt ?? 35.8;
    const incomingAmbient = data.ambient_temp ?? 48.9;
    const timestamp = new Date().toISOString();

    const verifiedLocal = verifyDeviceHandshake(
      {
        node_id: incomingNodeId,
        wbgt: incomingWbgt,
        ambient_temp: incomingAmbient,
        timestamp,
      },
      data.token || 'un_hw_secure_998123487123'
    );
    setCryptoVerified(verifiedLocal);

    setTelemetry({
      node_id: incomingNodeId,
      wbgt: incomingWbgt,
      ambient_temp: incomingAmbient,
      status: incomingWbgt >= 34.0 ? 'CRITICAL_SPIKE' : 'NOMINAL',
    });

    if (incomingWbgt >= 34.0) {
      void playAudibleBeaconAlert({
        vendorName: 'Street Vendor Node',
        measuredWbgt: incomingWbgt,
        nearestKioskMeters: 35,
        exhaustTemp: incomingAmbient,
        preferredLanguage: 'en-IN',
      });
    }

    const ingestResult = await ingestSignedHardwarePacket({
      node_id: incomingNodeId,
      wbgt: incomingWbgt,
      ambient_temp: incomingAmbient,
      token: data.token || 'un_hw_secure_998123487123',
    });

    if (ingestResult?.hmacSignature) {
      setPacketSignature(ingestResult.hmacSignature);
    }
  };

  const { isConnected, connectHardware, simulateLivePacket } =
    useHardwareSerial(handleIncomingPacket);

  const isCritical = telemetry.wbgt >= 34.0;

  return (
    <div className="rounded-3xl bg-[#FFFFFF] text-[#111827] p-8 sm:p-10 space-y-8 border border-[#E5E7EB] shadow-xl">
      {/* 1. UNIFIED HEADER & SINGLE CLEAN CONTROL BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-[#a8321a] uppercase tracking-wider">
            LIVE ESP32-S3 USB &amp; MOBILE SENSOR LINK
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Plug-and-Play Hardware Telemetry
          </h3>
        </div>

        {/* Unified Single-Row Control Bar: Connect Serial | Simulate Packet | Mobile Mode | AWS Stream Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={connectHardware}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isConnected
                ? 'bg-emerald-700 text-white'
                : 'bg-[#111827] hover:bg-[#1f2937] text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5 text-amber-400 pointer-events-none" />
            <span className="pointer-events-none">
              {isConnected ? 'USB Connected (115200)' : 'Connect Serial'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => simulateLivePacket()}
            className="px-4 py-2.5 rounded-xl bg-[#a8321a] hover:bg-[#8c2713] text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-200 pointer-events-none" />
            <span className="pointer-events-none">Simulate Packet</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileBeaconOpen((prev) => !prev)}
            className="px-3.5 py-2.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[#111827] font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#a8321a] pointer-events-none" />
            <span className="pointer-events-none">Phone Sensor</span>
          </button>

          <button
            type="button"
            onClick={() => setIotStreamModalOpen(true)}
            className="px-3 py-2 text-xs font-mono font-bold text-[#a8321a] hover:text-[#111827] underline underline-offset-4 cursor-pointer"
          >
            View AWS IoT Core Stream ↗
          </button>
        </div>
      </div>

      {/* 2. HIGH-IMPACT FULL-WIDTH HARDWARE STATUS BANNER */}
      <div
        className={`w-full rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
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
            <div className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">
              HARDWARE TELEMETRY STATUS · NODE {telemetry.node_id}
            </div>
            <div className="text-lg sm:text-xl font-black tracking-tight uppercase">
              {isCritical
                ? `CRITICAL ALERT: ${telemetry.wbgt.toFixed(1)}°C WET-BULB SPIKE DETECTED ON CART SENSOR`
                : telemetry.node_id !== 'OFFLINE'
                ? 'LIVE STREAM ACTIVE: SENSOR OPERATING IN SAFE RANGE'
                : 'READY: PLUG IN ESP32 VIA USB OR CLICK "SIMULATE PACKET"'}
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

      {/* 3. CLEAN 3-CARD HARDWARE METRICS (Full-Width Layout — Overlapping 3D Picture Removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-2 flex flex-col justify-between">
          <div className="text-xs font-semibold text-[#111827]/70">
            Sensor Node ID
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#111827] truncate">
            {telemetry.node_id}
          </div>
          <div className="text-xs font-mono text-[#111827]/70">
            Web Serial UART · 115200 bps
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-2 flex flex-col justify-between">
          <div className="text-xs font-semibold text-[#111827]/70">
            Measured Wet-Bulb (WBGT)
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black font-mono ${
              isCritical ? 'text-[#a8321a]' : 'text-[#111827]'
            }`}
          >
            {telemetry.wbgt > 0 ? `${telemetry.wbgt.toFixed(1)}°C` : '--.-°C'}
          </div>
          <div className="text-xs font-mono text-[#111827]/70">
            Threshold: 34.0°C Lethal Limit
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-2 flex flex-col justify-between">
          <div className="text-xs font-semibold text-[#111827]/70">
            Exhaust Plume Air Temp
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#111827]">
            {telemetry.ambient_temp > 0 ? `${telemetry.ambient_temp.toFixed(1)}°C` : '--.-°C'}
          </div>
          <div className="text-xs font-mono text-[#111827]/70">
            Direct SHT31 Probe Reading
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
  "transport": "${isConnected ? 'WEB_SERIAL_UART' : 'SIMULATED_PACKET'}",
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
