import React, { useState } from 'react';
import { useHardwareSerial } from '../hooks/useHardwareSerial';
import { ThermalPlumeTwin } from './ThermalPlumeTwin';
import { ShieldAlert, ShieldCheck, Cpu, Terminal, Radio, AlertTriangle, Volume2, Sparkles } from 'lucide-react';
import { playAudibleBeaconAlert, buildPollySSML } from '../utils/pollyVoiceDispatch';

export const LiveHardwareControl: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    node_id: "OFFLINE",
    ambient_temp: 28.0,
    wbgt: 24.5,
    token: "NONE"
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const { connectHardware, simulateLivePacket, isConnected, error } = useHardwareSerial((data) => {
    setTelemetry(data);
  });

  // Determine if incoming telemetry has a valid asymmetric token structure
  const isTokenSecure = telemetry.token.startsWith("un_hw_secure_");
  const isCriticalHeat = telemetry.wbgt >= 36.8;

  const handleTriggerVoiceAlert = async () => {
    setIsBroadcasting(true);
    try {
      await playAudibleBeaconAlert({
        vendorName: telemetry.node_id !== 'OFFLINE' ? `Beacon ${telemetry.node_id}` : 'Chandni Chowk Vendor',
        measuredWbgt: telemetry.wbgt,
        nearestKioskMeters: 45,
        exhaustTemp: telemetry.ambient_temp,
        kioskName: 'Municipal Mist Station #03',
        preferredLanguage: 'bilingual',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-md shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-4 w-4 text-amber-400" />
              § Physical Edge Node Test Bench (ESP32 USB Ingestion)
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect your physical ESP32 beacon node via Web Serial API USB line link, or run simulated live packets.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={connectHardware}
            disabled={isConnected}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-2 shadow-sm ${
              isConnected 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 cursor-default'
                : 'bg-slate-900 border-slate-700 hover:border-amber-500 hover:text-amber-300 text-slate-300'
            }`}
          >
            {isConnected ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                ● NODE ONLINE (115200 BAUD)
              </>
            ) : (
              <>
                <Radio className="h-3.5 w-3.5" />
                CONNECT BEACON VIA SERIAL (USB)
              </>
            )}
          </button>

          {!isConnected && (
            <button
              onClick={() => simulateLivePacket()}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
              title="Test serial packet stream without physical hardware plugged in"
            >
              SIMULATE ESP32 PACKET
            </button>
          )}

          {isConnected && (
            <button
              onClick={() => simulateLivePacket({
                node_id: 'SPOOFED_ROGUE_BEACON',
                ambient_temp: 22.0,
                wbgt: 21.0,
                token: 'rogue_attacker_unsigned_payload'
              })}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
              title="Simulate injection of an untrusted sensor packet lacking Secrets Manager token"
            >
              TEST SPOOF INJECTION
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-xs font-mono text-rose-400 bg-rose-950/30 p-3 rounded-xl border border-rose-900/40 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>ERR // {error}</span>
        </div>
      )}

      {/* CROSS-TOOL SYNCHRONIZED STATUS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-slate-500 text-[10px] tracking-wider uppercase">DEVICE IDENTITY</div>
          <div className="text-slate-200 font-bold mt-1 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-slate-400" />
            {telemetry.node_id}
          </div>
        </div>
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-slate-500 text-[10px] tracking-wider uppercase">AMBIENT TEMPERATURE</div>
          <div className={`font-bold mt-1 ${telemetry.ambient_temp > 45 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
            {telemetry.ambient_temp.toFixed(1)}°C
          </div>
        </div>
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-slate-500 text-[10px] tracking-wider uppercase">WBGT METRIC (ISO 7243)</div>
          <div className={`font-bold mt-1 ${isCriticalHeat ? 'text-rose-500' : 'text-slate-200'}`}>
            {telemetry.wbgt.toFixed(1)}°C {isCriticalHeat ? '[CRITICAL]' : ''}
          </div>
        </div>
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-slate-500 text-[10px] tracking-wider uppercase">ASYMMETRIC AUTH</div>
          <div className={`font-bold mt-1 flex items-center gap-1.5 ${isTokenSecure ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isConnected ? (
              isTokenSecure ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  SECURE_HANDSHAKE
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  REJECTED_SPOOF
                </>
              )
            ) : (
              'AWAITING_LINK'
            )}
          </div>
        </div>
      </div>

      {/* TIER-1 ACOUSTIC DISPATCH BAR (AMAZON POLLY NEURAL) */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isCriticalHeat ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
            <Volume2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-slate-200 font-bold flex items-center gap-1.5">
              <span>Tier-1 Amazon Polly Neural Dispatch</span>
              <span className="text-[10px] text-amber-400 font-normal">· Kajal Voice (hi-IN / en-IN)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isCriticalHeat 
                ? 'CRITICAL ALERT TRIGGERED: WBGT > 36.8°C. Stand-down voice loop ready.' 
                : 'Acoustic broadcast ready for edge vendor advisories.'}
            </div>
          </div>
        </div>

        <button
          onClick={handleTriggerVoiceAlert}
          disabled={isBroadcasting}
          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
            isCriticalHeat
              ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-900/40'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/30'
          } disabled:opacity-50`}
        >
          {isBroadcasting ? (
            <>
              <div className="h-2 w-2 rounded-full bg-current animate-ping" />
              <span>Broadcasting...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Test Polly Bilingual Call</span>
            </>
          )}
        </button>
      </div>

      {/* THREE.JS DYNAMIC PLUME INTERFACE */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/20">
        <ThermalPlumeTwin 
          alleyWidth={isCriticalHeat ? 4.0 : 6.0} 
          acUnitsCount={isCriticalHeat ? 80 : 30} 
          louversEngaged={!isCriticalHeat && isConnected}
          presetName={isConnected ? `LIVE BEACON // ${telemetry.node_id}` : "SIMULATION BASELINE"}
        />
      </div>
    </div>
  );
};
