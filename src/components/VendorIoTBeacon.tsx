import React, { useState } from 'react';
import { VendorTelemetry } from '../types';
import { Radio, Volume2, ShieldAlert, Battery, Wifi, Activity, Play, AlertTriangle, RefreshCw, CheckCircle2, Code2, Sparkles } from 'lucide-react';
import { buildPollySSML, playAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';

interface Props {
  vendor: VendorTelemetry;
  allVendors: VendorTelemetry[];
  onSelectVendor: (v: VendorTelemetry) => void;
  isMitigated: boolean;
}

export const VendorIoTBeacon: React.FC<Props> = ({
  vendor,
  allVendors,
  onSelectVendor,
  isMitigated,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [selectedScenario, setSelectedScenario] = useState<'normal' | 'surge' | 'mitigated'>('surge');
  const [showSSMLPayload, setShowSSMLPayload] = useState<boolean>(false);

  // Compute dynamic values based on scenario and mitigation
  const currentTemp = isMitigated
    ? 33.2
    : selectedScenario === 'surge'
    ? 48.4
    : 42.1;
  const currentWbgt = isMitigated
    ? 29.8
    : selectedScenario === 'surge'
    ? 36.8
    : 32.5;
  const heatCategory = isMitigated
    ? 'Nominal / Safe'
    : selectedScenario === 'surge'
    ? 'Extreme Lethality (WBGT > 35°C)'
    : 'High Risk';

  // Amazon Polly bilingual voice dispatch
  const handlePlayVoice = async (lang: 'hi' | 'en' | 'bilingual') => {
    setIsPlayingAudio(true);
    try {
      await playAudibleBeaconAlert({
        vendorName: vendor.vendorName,
        measuredWbgt: currentWbgt,
        nearestKioskMeters: 45,
        exhaustTemp: currentTemp,
        kioskName: 'Chandni Chowk Municipal Mist Station #03',
        preferredLanguage: lang === 'bilingual' ? 'bilingual' : lang === 'hi' ? 'hi-IN' : 'en-IN',
      });
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const pollyData = buildPollySSML({
    vendorName: vendor.vendorName,
    measuredWbgt: currentWbgt,
    nearestKioskMeters: 45,
    exhaustTemp: currentTemp,
    kioskName: 'Chandni Chowk Municipal Mist Station #03',
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Overview */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <Radio className="w-4 h-4" />
            <span>Edge IoT Telemetry Grid · AWS IoT Core Ingestion</span>
            <span>·</span>
            <span>Sub-Ward Micro-Sensors</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Street Vendor Micro-Climate Wearable & Beacon
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            A zero-setup $8 solar clip-on beacon engineered for informal street workers. Measures micro-canyon WBGT at pedestrian head level and sounds localized multilingual voice advisories when AC exhaust plumes cross survival thresholds.
          </p>
        </div>

        {/* Vendor Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Monitored Worker:</span>
          <select
            value={vendor.id}
            onChange={(e) => {
              const found = allVendors.find((v) => v.id === e.target.value);
              if (found) onSelectVendor(found);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
          >
            {allVendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vendorName} ({v.trade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Twin: Virtual Hardware Enclosure + Real-Time Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Virtual IoT Hardware Unit (Skeuomorphic Clean Device) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center text-xs border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-slate-300">USHMA-BEACON v1.2</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-sky-400" /> LoRaWAN
              </span>
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-emerald-400" /> {vendor.batteryPct}%
              </span>
            </div>
          </div>

          {/* Device Enclosure Graphic */}
          <div className="w-72 bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-inner flex flex-col items-center space-y-4 relative my-2">
            {/* Top Solar Harvester Cell */}
            <div className="w-48 h-8 bg-sky-950/80 rounded-lg border border-sky-800/80 grid grid-cols-6 gap-1 p-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-sky-600/30 rounded-xs" />
              ))}
            </div>

            {/* High-Contrast Segmented LCD Display */}
            <div className="w-full bg-[#05111b] border-2 border-slate-800 rounded-xl p-4 text-center font-mono shadow-inner relative overflow-hidden">
              <div className="text-[10px] text-amber-500/80 uppercase tracking-widest flex justify-between">
                <span>MICRO-CANYON WBGT</span>
                <span className="text-red-400">{vendor.distanceToExhaustMeters}m FROM AC</span>
              </div>
              <div className="text-4xl font-extrabold text-amber-400 my-1 tracking-tight tabular-nums">
                {currentWbgt}°C
              </div>
              <div className="text-xs text-slate-400 flex justify-between pt-1 border-t border-slate-800/60 mt-2">
                <span>DRY BULB: <strong className="text-white">{currentTemp}°C</strong></span>
                <span>RH: <strong className="text-white">{vendor.relativeHumidityPct}%</strong></span>
              </div>
            </div>

            {/* LED Status Matrix */}
            <div className="w-full grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <div className={`w-2.5 h-2.5 mx-auto rounded-full mb-1 ${!isMitigated ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-700'}`} />
                <span className="text-slate-400">EXHAUST JET</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <div className="w-2.5 h-2.5 mx-auto rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] mb-1" />
                <span className="text-slate-400">MQTT LINK</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <div className={`w-2.5 h-2.5 mx-auto rounded-full mb-1 ${isMitigated ? 'bg-emerald-500' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
                <span className="text-slate-400">SHADE NUDGE</span>
              </div>
            </div>

            {/* Speaker Grill */}
            <div className="w-32 flex justify-center gap-1.5 py-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1 h-3 bg-slate-700 rounded-full" />
              ))}
            </div>
          </div>

          {/* Voice Dispatch Triggers */}
          <div className="w-full mt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Amazon Polly Neural Voice Alert
              </span>
              <span className="text-[10px] text-slate-400">Voice: Kajal (hi-IN / en-IN)</span>
            </div>

            {/* Primary Bilingual Mixed Trigger */}
            <button
              onClick={() => handlePlayVoice('bilingual')}
              disabled={isPlayingAudio}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isPlayingAudio ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  <span>Broadcasting Alarm (Tier-1)...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>Bilingual Alert (Hindi + Indian English)</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePlayVoice('hi')}
                disabled={isPlayingAudio}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>हिंदी (Hindi Only)</span>
              </button>
              <button
                onClick={() => handlePlayVoice('en')}
                disabled={isPlayingAudio}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                <span>English Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry Stream, Scenarios & MQTT Payload */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real-time Physiological Stress Alert Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            isMitigated
              ? 'bg-emerald-950/20 border-emerald-800/40'
              : 'bg-red-950/30 border-red-800/60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${isMitigated ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Physiological Distress Triage: {heatCategory}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Carrier: {vendor.vendorName}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isMitigated
                ? 'Upward building deflector active. AC exhaust no longer reaches pedestrian level. Ambient WBGT normalized below dangerous thresholds.'
                : 'Vendor is positioned directly in the 52°C horizontal jet of 64 commercial split AC outdoor units. Sweat evaporation is physiologically blocked. Heat stroke likelihood: 88% within 45 minutes of continuous exposure.'}
            </p>
          </div>

          {/* Interactive Disaster Scenarios Injector */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Inject Micro-Climate Edge Scenarios
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Real-Time State Injection</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedScenario('surge')}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                  selectedScenario === 'surge'
                    ? 'bg-red-950/40 border-red-700 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-red-400">Peak AC Blast</div>
                <div className="text-[10px] text-slate-400 mt-0.5">100% Chiller Load (53.6°C)</div>
              </button>

              <button
                onClick={() => setSelectedScenario('normal')}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                  selectedScenario === 'normal'
                    ? 'bg-amber-950/40 border-amber-700 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-amber-400">Wind Stagnation</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Heat trapped in 7m alley</div>
              </button>

              <button
                onClick={() => setSelectedScenario('mitigated')}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                  isMitigated
                    ? 'bg-emerald-950/40 border-emerald-700 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-emerald-400">Skyward Louver</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Deflected to roof (Safe)</div>
              </button>
            </div>
          </div>

          {/* Dual Ingestion / Amazon Polly SSML Inspector */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="flex flex-wrap justify-between items-center text-slate-400 pb-2 border-b border-slate-800 mb-2 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowSSMLPayload(false)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    !showSSMLPayload
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AWS IoT Core MQTT
                </button>
                <button
                  onClick={() => setShowSSMLPayload(true)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    showSSMLPayload
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  Amazon Polly Neural SSML
                </button>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {!showSSMLPayload ? 'QoS 1 · Real-Time Stream' : `Voice: ${pollyData.voiceId} · Engine: ${pollyData.engine}`}
              </span>
            </div>

            {!showSSMLPayload ? (
              <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto max-h-56">
{JSON.stringify(
  {
    device_uuid: `esp32-beacon-${vendor.id}`,
    worker: vendor.vendorName,
    trade: vendor.trade,
    sensor_readings: {
      dry_bulb_celsius: currentTemp,
      relative_humidity: vendor.relativeHumidityPct,
      computed_wbgt_celsius: currentWbgt,
      exhaust_blast_detected: !isMitigated,
      nearest_ac_distance_m: vendor.distanceToExhaustMeters,
    },
    threat_assessment: {
      lethality_tier: !isMitigated ? 'CRITICAL_STAND_DOWN' : 'NOMINAL',
      voice_dispatch_active: isPlayingAudio,
    },
    timestamp: new Date().toISOString(),
  },
  null,
  2
)}
              </pre>
            ) : (
              <div className="space-y-2">
                <div className="text-[10px] text-sky-400/90 font-mono flex items-center justify-between border-b border-slate-900 pb-1">
                  <span>SPEECH SYNTHESIS MARKUP LANGUAGE (SSML)</span>
                  <span>Est. Duration: {pollyData.audioPromptDurationSec}s · Tier: {pollyData.warningSeverity}</span>
                </div>
                <pre className="text-emerald-300 text-[11px] leading-relaxed overflow-x-auto max-h-56 whitespace-pre-wrap font-mono p-2 bg-slate-900/60 rounded-lg border border-slate-800">
{pollyData.ssml}
                </pre>
                <div className="text-[10px] text-slate-400 leading-normal flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Includes auto-breaths, emphatic pitch modulations, and dual-script &lt;lang xml:lang="en-IN"&gt; phonetic boundaries for street intelligibility.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
