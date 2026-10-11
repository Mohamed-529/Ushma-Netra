import React, { useState, useEffect } from 'react';
import {
  Radio,
  Battery,
  Volume2,
  ShieldCheck,
  Flame,
  Lock,
  Smartphone,
  Copy,
  Headphones,
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
  const [ambientTemp, setAmbientTemp] = useState<number>(53.6);
  const [wbgt, setWbgt] = useState<number>(36.8);
  const [batteryPct, setBatteryPct] = useState<number>(92);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [vendorName] = useState<string>('Murugan (T. Nagar Cart #04)');
  const [nodeId] = useState<string>('ESP32-CHN-04');
  const [authToken, setAuthToken] = useState<string>('un_hw_secure_ecc_p256_active');
  const [louversActive, setLouversActive] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<'ta-IN' | 'en-IN' | 'hi-IN'>('ta-IN');

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number }> })
        .getBattery()
        .then((battery) => {
          setBatteryPct(Math.round(battery.level * 100));
        })
        .catch(() => {});
    }
  }, []);

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

    try {
      const channel = new BroadcastChannel('ushma_netra_hardware_feed');
      channel.postMessage(payload);
      channel.close();
    } catch {
      // Fallback
    }

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
        kioskName: 'T. Nagar Mist Station #02',
        preferredLanguage: voiceLang,
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
      const beaconUrl = `${window.location.origin}/twin`;
      navigator.clipboard.writeText(beaconUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isLethal = wbgt >= 35.0;
  const isHardwareValid = authToken.startsWith('un_hw_secure_');

  return (
    <div className="rounded-3xl w-full bg-zinc-950 text-zinc-100 font-sans p-5 sm:p-6 space-y-5 border border-zinc-800 shadow-2xl">
      {/* Top Beacon Hardware Identity Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono tracking-wider text-zinc-100 flex items-center gap-1.5">
                <span>PHONE + ESP32 + AIRPODS BEACON</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                NODE: {nodeId} · USB DATA CABLE + BLE
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
      <div className="py-2 space-y-4 text-center">
        <div className="space-y-1">
          <div
            className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight ${
              isLethal ? 'text-red-500' : 'text-amber-400'
            }`}
          >
            {wbgt.toFixed(1)}°C WBGT
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Exhaust Jet: <strong className="text-zinc-200">{ambientTemp.toFixed(1)}°C</strong> · Humidity:{' '}
            <strong className="text-zinc-200">62%</strong>
          </div>
        </div>

        {/* Live Thermal Sensor Slider */}
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-left space-y-2.5 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Slide Phone Sensor Exhaust Temp:</span>
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
            <span>53.6°C (AC Blast)</span>
          </div>
        </div>

        {/* Action Controls for Demo & AirPods */}
        <div className="max-w-md mx-auto space-y-2.5">
          {/* Language Picker for AirPods */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300 pl-1">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>AirPods Language:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['ta-IN', 'en-IN', 'hi-IN'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setVoiceLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    voiceLang === lang
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  {lang === 'ta-IN' ? 'தமிழ்' : lang === 'en-IN' ? 'EN' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          {/* Big AirPods Audio Broadcast Trigger Button */}
          <button
            onClick={handleTriggerAirPodsAlert}
            disabled={isAlerting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isAlerting ? 'animate-bounce' : ''}`} />
            <span>
              {isAlerting
                ? 'BROADCASTING TO AIRPODS...'
                : `PLAY POLLY VOICE IN AIRPODS (${
                    voiceLang === 'ta-IN' ? 'தமிழ்' : voiceLang === 'en-IN' ? 'EN' : 'हिंदी'
                  })`}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSimulateSurge}
              className="py-2.5 px-3 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/80 text-red-200 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>53.6°C Surge</span>
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
              <span>{louversActive ? 'Louvers ON (38°C)' : 'Deploy 45° Louvers'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Pairing Link */}
      <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs font-mono flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] text-zinc-300">Vendor: {vendorName}</span>
        </div>
        <button
          onClick={handleCopyBeaconUrl}
          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
        >
          <Copy className="w-3 h-3" />
          <span>{copiedLink ? 'Copied URL' : 'Copy Phone Link'}</span>
        </button>
      </div>
    </div>
  );
};
