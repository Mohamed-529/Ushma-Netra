import React, { useState } from 'react';
import { VendorTelemetry } from '../types';
import {
  Radio,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  MapPin,
  Sliders,
  X,
  ChevronDown,
} from 'lucide-react';
import { playAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';
import { soundEngine } from '../utils/audioSynthesizer';

interface Props {
  vendor: VendorTelemetry;
  allVendors: VendorTelemetry[];
  onSelectVendor: (v: VendorTelemetry) => void;
  isMitigated?: boolean;
}

export const VendorIoTBeacon: React.FC<Props> = ({
  vendor,
  allVendors,
  onSelectVendor,
  isMitigated = false,
}) => {
  const [simSurge, setSimSurge] = useState<'none' | 'ac_peak' | 'wind_drop'>('none');
  const [voiceActive, setVoiceActive] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ta' | 'hi' | 'en'>('ta');
  const [demoMenuOpen, setDemoMenuOpen] = useState<boolean>(false);
  const [iotStreamModalOpen, setIotStreamModalOpen] = useState<boolean>(false);

  // Dynamically computed WBGT based on mitigation & local surge simulation
  const baseWbgt = isMitigated
    ? +(vendor.wetBulbGlobeTempCelsius - 5.4).toFixed(1)
    : vendor.wetBulbGlobeTempCelsius;

  const currentWbgt =
    simSurge === 'ac_peak'
      ? +(baseWbgt + 2.4).toFixed(1)
      : simSurge === 'wind_drop'
      ? +(baseWbgt + 1.5).toFixed(1)
      : baseWbgt;

  const isCriticalHazard = !isMitigated && currentWbgt >= 34.0;

  const handleDispatchVoiceAlert = () => {
    setVoiceActive(vendor.id);

    void playAudibleBeaconAlert({
      vendorName: vendor.vendorName,
      measuredWbgt: currentWbgt,
      nearestKioskMeters: 35,
      exhaustTemp: vendor.dryBulbTempCelsius,
      preferredLanguage: language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN',
    }).finally(() => {
      setVoiceActive(null);
    });
  };

  return (
    <div className="rounded-3xl bg-[#FFFFFF] text-[#111827] p-8 sm:p-10 space-y-8 border border-[#E5E7EB] shadow-xl">
      {/* 1. CLEAN UPPER HEADER + SLEEK DEMO CONTROLS DROPDOWN + AWS IOT CORE STREAM LINK */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-[#a8321a] uppercase tracking-wider">
            STREET VENDOR MICRO-CLIMATE WEARABLE &amp; BEACON
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Solar Cart Heat Sensor &amp; Voice Alert
          </h3>
        </div>

        {/* Streamlined Control Zone: Vendor Picker + Demo Controls Dropdown + View AWS IoT Core Stream Link */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Vendor Cart Selector */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-mono font-bold text-[#111827]">
            <MapPin className="w-3.5 h-3.5 text-[#a8321a]" />
            <select
              value={vendor.id}
              onChange={(e) => {
                const found = allVendors.find((v) => v.id === e.target.value);
                if (found) onSelectVendor(found);
              }}
              aria-label="Select Street Vendor Cart"
              className="bg-transparent text-[#111827] font-mono text-xs font-bold focus:outline-none cursor-pointer"
            >
              {allVendors.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#FFFFFF] text-[#111827]">
                  {v.vendorName} ({v.trade})
                </option>
              ))}
            </select>
          </div>

          {/* Sleek Single "Demo Controls" Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDemoMenuOpen((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[#111827] font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#a8321a] pointer-events-none" />
              <span className="pointer-events-none">
                Demo Controls {simSurge !== 'none' ? '· Active' : ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 pointer-events-none" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-2xl p-3 z-30 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#111827]/60 font-bold px-1">
                  Simulate Street Conditions
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(540, 'sawtooth', 0.12);
                    setSimSurge(simSurge === 'ac_peak' ? 'none' : 'ac_peak');
                    setDemoMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer ${
                    simSurge === 'ac_peak'
                      ? 'bg-[#a8321a] text-white'
                      : 'hover:bg-[#F3F4F6] text-[#111827]'
                  }`}
                >
                  Peak AC Blast (+2.4°C)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(460, 'triangle', 0.12);
                    setSimSurge(simSurge === 'wind_drop' ? 'none' : 'wind_drop');
                    setDemoMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer ${
                    simSurge === 'wind_drop'
                      ? 'bg-amber-600 text-white'
                      : 'hover:bg-[#F3F4F6] text-[#111827]'
                  }`}
                >
                  Wind Stagnation (+1.5°C)
                </button>
                {simSurge !== 'none' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSimSurge('none');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl font-mono text-[11px] text-[#111827]/70 hover:text-[#111827] cursor-pointer"
                  >
                    Reset to Normal
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Clean Text Link Layer for Raw JSON Telemetry */}
          <button
            type="button"
            onClick={() => setIotStreamModalOpen(true)}
            className="px-3 py-2 text-xs font-mono font-bold text-[#a8321a] hover:text-[#111827] underline underline-offset-4 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View AWS IoT Core Stream ↗</span>
          </button>
        </div>
      </div>

      {/* 2. FULL-WIDTH HIGH-CONTRAST STRUCTURAL STATUS BANNER */}
      <div
        className={`w-full rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
          isCriticalHazard
            ? 'bg-gradient-to-r from-[#b91c1c] to-[#ea580c] text-white shadow-lg'
            : 'bg-emerald-700 text-white shadow-md'
        }`}
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/90">
            {isCriticalHazard ? (
              <AlertTriangle className="w-4 h-4 text-amber-200 animate-bounce" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
            )}
            <span>PHYSIOLOGICAL DISTRESS TRIAGE · {vendor.vendorName.toUpperCase()}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight uppercase">
            {isCriticalHazard
              ? 'CRITICAL ALERT: EXTREME HEAT EXHAUST BLAST'
              : 'SAFE OPERATING ZONE: COOLING MIST ACTIVE'}
          </div>
          <ul className="text-xs sm:text-sm text-white/95 font-medium space-y-0.5">
            {isCriticalHazard ? (
              <>
                <li>• Cart Distance: {vendor.distanceToExhaustMeters}m from AC exhaust vents</li>
                <li>• Measured WBGT: {currentWbgt}°C (Immediate shade &amp; AirPods alert active)</li>
              </>
            ) : (
              <>
                <li>• Upward 45° Louvers + Mist Kiosk Active</li>
                <li>• Cart WBGT lowered to {currentWbgt}°C safe threshold</li>
              </>
            )}
          </ul>
        </div>

        {/* Instant Voice Broadcast Action */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex rounded-xl bg-black/25 p-1 border border-white/20 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                language === 'ta' ? 'bg-white text-slate-950' : 'text-white/80 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                language === 'en' ? 'bg-white text-slate-950' : 'text-white/80 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                language === 'hi' ? 'bg-white text-slate-950' : 'text-white/80 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            type="button"
            onClick={handleDispatchVoiceAlert}
            className="px-5 py-3 rounded-xl bg-white hover:bg-amber-50 text-slate-950 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Volume2
              className={`w-4 h-4 text-[#a8321a] pointer-events-none ${
                voiceActive ? 'animate-ping' : ''
              }`}
            />
            <span className="pointer-events-none">
              {voiceActive ? 'Playing in AirPods...' : 'Play in AirPods'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. FLAT, GENEROUS 3-COLUMN METRIC BLOCKS (No Double Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-1">
          <div className="text-xs font-semibold text-[#111827]/70">
            Wet-Bulb Heat (WBGT)
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black font-mono ${
              isCriticalHazard ? 'text-[#a8321a]' : 'text-emerald-700'
            }`}
          >
            {currentWbgt}°C
          </div>
          <div className="text-xs font-mono text-[#111827]/70 pt-1">
            Safe Limit: 32.0°C · {vendor.relativeHumidityPct}% Humidity
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-1">
          <div className="text-xs font-semibold text-[#111827]/70">
            Dry-Bulb Air Temp
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#111827]">
            {isMitigated
              ? (vendor.dryBulbTempCelsius - 5.4).toFixed(1)
              : vendor.dryBulbTempCelsius}
            °C
          </div>
          <div className="text-xs font-mono text-[#111827]/70 pt-1">
            Distance from AC Vent: {vendor.distanceToExhaustMeters}m
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-1">
          <div className="text-xs font-semibold text-[#111827]/70">
            Solar Beacon Battery &amp; Status
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#111827]">
            {vendor.batteryPct}%{' '}
            <span className="text-base font-normal text-[#111827]/70">Solar</span>
          </div>
          <div className="text-xs font-mono text-[#111827]/70 pt-1">
            Node ID: {vendor.id} · {vendor.lastPingTimestamp}
          </div>
        </div>
      </div>

      {/* 4. OVERLAY MODAL FOR RAW JSON TELEMETRY (Hidden Out of Primary Viewport) */}
      {iotStreamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0b111e] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>AWS IoT Core MQTT Telemetry Stream</span>
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
  "device_id": "${vendor.id}",
  "vendor_name": "${vendor.vendorName}",
  "wbgt_c": ${currentWbgt},
  "dry_bulb_c": ${
    isMitigated
      ? +(vendor.dryBulbTempCelsius - 5.4).toFixed(1)
      : vendor.dryBulbTempCelsius
  },
  "humidity_pct": ${vendor.relativeHumidityPct},
  "distance_to_ac_m": ${vendor.distanceToExhaustMeters},
  "distress_alert": ${isCriticalHazard},
  "mqtt_topic": "ushma/delhi/canyon/telemetry"
}`}
            </pre>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Topic: ushma/delhi/canyon/telemetry</span>
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
