import React, { useState, useEffect } from 'react';
import {
  Radio,
  Battery,
  Wifi,
  Volume2,
  ShieldCheck,
  Flame,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Lock,
  Smartphone,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { playAudibleBeaconAlert } from '../utils/pollyVoiceDispatch';

interface Props {
  onClose?: () => void;
  onSyncTelemetry?: (data: {
    ambient_temp: number;
    wbgt: number;
    node_id: string;
    token: string;
    surge_triggered?: boolean;
    louvers_deployed?: boolean;
  }) => void;
}

export const MobileBeaconClient: React.FC<Props> = ({ onClose, onSyncTelemetry }) => {
  const [ambientTemp, setAmbientTemp] = useState<number>(44.2);
  const [wbgt, setWbgt] = useState<number>(36.8);
  const [batteryPct, setBatteryPct] = useState<number>(88);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [vendorName, setVendorName] = useState<string>('Rameshwar Pal');
  const [nodeId, setNodeId] = useState<string>('UN-DEL-084');
  const [authToken, setAuthToken] = useState<string>('un_hw_secure_ecc_p256_active');
  const [louversActive, setLouversActive] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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

  // Broadcast live telemetry to laptop screen via BroadcastChannel & LocalStorage
  const broadcastSync = (customPayload?: Record<string, unknown>) => {
    const payload = {
      node_id: nodeId,
      ambient_temp: ambientTemp,
      wbgt: wbgt,
      token: authToken,
      louvers_deployed: louversActive,
      timestamp: new Date().toISOString(),
      ...customPayload,
    };

    // 1. BroadcastChannel (Same-origin tabs/windows)
    try {
      const channel = new BroadcastChannel('ushma_netra_hardware_feed');
      channel.postMessage(payload);
      channel.close();
    } catch {
      // Fallback
    }

    // 2. LocalStorage Event (cross-window storage event listener)
    try {
      localStorage.setItem('ushma_netra_hw_sync', JSON.stringify(payload));
    } catch {
      // Fallback
    }

    if (onSyncTelemetry) {
      onSyncTelemetry(payload as any);
    }
  };

  useEffect(() => {
    broadcastSync();
  }, [ambientTemp, wbgt, nodeId, authToken, louversActive]);

  const handleTriggerAirPodsAlert = async () => {
    setIsAlerting(true);
    broadcastSync({ alert_broadcast_active: true });
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

  const handleSimulateSurge = () => {
    setAmbientTemp(53.6);
    setWbgt(36.8);
    broadcastSync({ surge_triggered: true });
  };

  const handleToggleLouvers = () => {
    const nextState = !louversActive;
    setLouversActive(nextState);
    if (nextState) {
      setAmbientTemp(38.0);
      setWbgt(31.2);
    } else {
      setAmbientTemp(53.6);
      setWbgt(36.8);
    }
    broadcastSync({ louvers_deployed: nextState });
  };

  const handleCopyBeaconUrl = () => {
    if (typeof window !== 'undefined') {
      const beaconUrl = `${window.location.origin}${window.location.pathname}?mode=beacon`;
      navigator.clipboard.writeText(beaconUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isLethal = wbgt >= 35.0;
  const isHardwareValid = authToken.startsWith('un_hw_secure_');

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans p-4 sm:p-6 flex flex-col justify-between selection:bg-amber-500/20">
      
      {/* Top Beacon Hardware Identity Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono tracking-wider text-zinc-100 flex items-center gap-1.5">
                <span>USHMA-NETRA // POCKET BEACON</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                NODE: {nodeId} · ASYMMETRIC P-256
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
              <Battery className="w-3.5 h-3.5" />
              <span>{batteryPct}%</span>
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Cryptographic Security Strip */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Lock className={`w-3.5 h-3.5 ${isHardwareValid ? 'text-emerald-400' : 'text-red-400'}`} />
            <span className="text-[11px] text-zinc-300">
              {isHardwareValid ? 'AWS Secrets Manager P-256 Handshake' : 'Tampered / Unsigned Packet'}
            </span>
          </div>
          <button
            onClick={() => {
              if (isHardwareValid) {
                setAuthToken('tampered_fake_signature_packet');
              } else {
                setAuthToken('un_hw_secure_ecc_p256_active');
              }
            }}
            className={`text-[9px] px-2 py-0.5 rounded border cursor-pointer font-bold ${
              isHardwareValid
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                : 'bg-red-950/60 border-red-800 text-red-400'
            }`}
          >
            {isHardwareValid ? 'TOKEN VALID' : 'SPOOF DETECTED'}
          </button>
        </div>
      </div>

      {/* Main Sensor Gauge & Heat Status */}
      <div className="my-auto py-4 space-y-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>MICRO-CANYON WBGT (PEDESTRIAN HEAD LEVEL)</span>
        </div>

        <div className="space-y-1">
          <div className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight ${isLethal ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
            {wbgt.toFixed(1)}°C
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Ambient Air: <strong className="text-zinc-200">{ambientTemp.toFixed(1)}°C</strong> · Humidity: <strong className="text-zinc-200">62%</strong>
          </div>
          <div className={`text-xs font-bold uppercase tracking-wider ${isLethal ? 'text-red-400' : 'text-amber-400'}`}>
            {isLethal ? '⚠️ ISO 7243 EXTREME LETHALITY THRESHOLD CROSSED' : 'MODERATE HEAT STRAIN'}
          </div>
        </div>

        {/* Live Thermal Sensor Slider */}
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-left space-y-3 max-w-sm mx-auto">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Simulate Street AC Exhaust Blast:</span>
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
            <span>44°C (Ambient)</span>
            <span>54°C (Direct Jet)</span>
          </div>
        </div>

        {/* Action Controls for Demo & Video */}
        <div className="max-w-sm mx-auto space-y-2">
          {/* Big AirPods Audio Broadcast Trigger Button */}
          <button
            onClick={handleTriggerAirPodsAlert}
            disabled={isAlerting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isAlerting ? 'animate-bounce' : ''}`} />
            <span>{isAlerting ? 'BROADCASTING TO AIRPODS...' : 'TEST POLLY AUDIO IN AIRPODS'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSimulateSurge}
              className="py-2.5 px-3 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/80 text-red-200 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Simulate 54°C Surge</span>
            </button>

            <button
              onClick={handleToggleLouvers}
              className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                louversActive
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{louversActive ? 'Louvers Active' : 'Deploy Louvers'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Pairing Link & Vendor Metadata */}
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs font-mono flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-zinc-300">Open on Your Phone Browser:</span>
          </div>
          <button
            onClick={handleCopyBeaconUrl}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedLink ? 'Copied' : 'Copy /?mode=beacon'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/50 text-[11px] font-mono flex items-center justify-between text-zinc-400">
          <div>
            <span className="text-zinc-500">VENDOR: </span>
            <span className="text-zinc-200 font-bold">{vendorName}</span>
          </div>
          <div>
            <span className="text-zinc-500">STIPEND: </span>
            <span className="text-emerald-400 font-bold">₹3,400 DBT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
