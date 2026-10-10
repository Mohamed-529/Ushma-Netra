import React, { useState, useEffect } from 'react';
import { Radio, Battery, Wifi, Volume2, ShieldCheck, Flame, AlertTriangle, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import { playAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';

interface Props {
  onClose?: () => void;
  onSyncTelemetry?: (data: { ambient_temp: number; wbgt: number; node_id: string; token: string }) => void;
}

export const MobileBeaconClient: React.FC<Props> = ({ onClose, onSyncTelemetry }) => {
  const [ambientTemp, setAmbientTemp] = useState<number>(44.2);
  const [wbgt, setWbgt] = useState<number>(36.8);
  const [batteryPct, setBatteryPct] = useState<number>(88);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [vendorName, setVendorName] = useState<string>('Rameshwar Pal');
  const [nodeId, setNodeId] = useState<string>('UN-DEL-084');
  const [authToken, setAuthToken] = useState<string>('un_hw_secure_ecc_p256_active');

  // Attempt to read physical phone battery level if supported by Chrome Android
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number }> })
        .getBattery()
        .then((battery) => {
          setBatteryPct(Math.round(battery.level * 100));
        })
        .catch(() => {
          // Fallback to default
        });
    }
  }, []);

  // Broadcast live telemetry to laptop screen via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('ushma_netra_hardware_feed');
    const payload = {
      node_id: nodeId,
      ambient_temp: ambientTemp,
      wbgt: wbgt,
      token: authToken,
      timestamp: new Date().toISOString(),
    };
    channel.postMessage(payload);

    if (onSyncTelemetry) {
      onSyncTelemetry(payload);
    }

    return () => {
      channel.close();
    };
  }, [ambientTemp, wbgt, nodeId, authToken, onSyncTelemetry]);

  const handleTriggerAirPodsAlert = async () => {
    setIsAlerting(true);
    try {
      await playAudibleBeaconAlert({
        vendorName: vendorName,
        measuredWbgt: wbgt,
        exhaustTemp: ambientTemp,
        nearestKioskMeters: 35,
        kioskName: 'Chandni Chowk Mist Station #03',
        preferredLanguage: 'bilingual',
      });
    } finally {
      setIsAlerting(false);
    }
  };

  const isLethal = wbgt >= 35.0;

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans p-4 sm:p-6 flex flex-col justify-between selection:bg-amber-500/20">
      
      {/* Top Beacon Hardware Identity Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono tracking-wider text-zinc-100">
                USHMA-NETRA // EDGE NODE
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                ID: {nodeId} · REV.3.4
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Battery className="w-3.5 h-3.5" />
              <span>{batteryPct}%</span>
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white"
              >
                Exit
              </button>
            )}
          </div>
        </div>

        {/* Cryptographic Handshake Status */}
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-zinc-300">Secrets Manager P-256 Auth</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            SIGNED
          </span>
        </div>
      </div>

      {/* Main Sensor Gauge & Heat Status */}
      <div className="my-auto py-6 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>MICRO-CANYON WBGT (HEAD LEVEL)</span>
        </div>

        <div className="space-y-2">
          <div className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight ${isLethal ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
            {wbgt.toFixed(1)}°C
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Ambient Dry Bulb: <strong className="text-zinc-200">{ambientTemp.toFixed(1)}°C</strong> · Relative Humidity: <strong className="text-zinc-200">62%</strong>
          </div>
          <div className={`text-xs font-bold uppercase tracking-wider ${isLethal ? 'text-red-400' : 'text-amber-400'}`}>
            {isLethal ? '⚠️ ISO 7243 EXTREME LETHALITY THRESHOLD CROSSED' : 'MODERATE HEAT STRAIN'}
          </div>
        </div>

        {/* Live Thermal Sensor Slider (Simulate Street Plume Hit) */}
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-left space-y-3 max-w-sm mx-auto">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Simulate Alley AC Blast:</span>
            <span className="text-amber-400 font-bold">{ambientTemp}°C</span>
          </div>
          <input
            type="range"
            min="32"
            max="56"
            step="0.5"
            value={ambientTemp}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAmbientTemp(val);
              setWbgt(parseFloat((26.0 + (val - 32) * 0.45).toFixed(1)));
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>32°C (Shaded)</span>
            <span>44°C (Normal)</span>
            <span>56°C (54°C AC Blast)</span>
          </div>
        </div>

        {/* Big AirPods Audio Broadcast Trigger Button */}
        <button
          onClick={handleTriggerAirPodsAlert}
          disabled={isAlerting}
          className="w-full max-w-sm mx-auto py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/40 transition-all cursor-pointer"
        >
          <Volume2 className={`w-4 h-4 ${isAlerting ? 'animate-bounce' : ''}`} />
          <span>{isAlerting ? 'BROADCASTING TO AIRPODS...' : 'TEST POLLY AUDIO IN AIRPODS'}</span>
        </button>
      </div>

      {/* Bottom Vendor Metadata & Restitution Info */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-xs font-mono space-y-2">
        <div className="flex justify-between text-zinc-400">
          <span>Assigned Vendor:</span>
          <span className="text-zinc-200 font-bold">{vendorName} (Tea Stall #12)</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Distance to Commercial AC:</span>
          <span className="text-red-400 font-bold">2.8 meters direct jet</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Misting Kiosk Stipend:</span>
          <span className="text-emerald-400 font-bold">₹3,400 (Direct Benefit Transfer)</span>
        </div>
      </div>
    </div>
  );
};
