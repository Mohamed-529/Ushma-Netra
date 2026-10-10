import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit, IncidentLog } from '../types';
import {
  Bell,
  AlertTriangle,
  Flame,
  Radio,
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Volume2,
  VolumeX,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MapPin,
  Trash2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface Props {
  buildings: BuildingAudit[];
  logs: IncidentLog[];
  onSimulateSurge: () => void;
}

export const WatchlistPage: React.FC<Props> = ({
  buildings,
  logs,
  onSimulateSurge,
}) => {
  const navigate = useNavigate();

  // Watchlist stored in localStorage
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('ushma_watchlist') || '["del-ln-vikas", "del-np-devika", "del-cc-bhagirath"]'
      );
    } catch {
      return ['del-ln-vikas', 'del-np-devika', 'del-cc-bhagirath'];
    }
  });

  // Remove from watchlist
  const removeFromWatchlist = (id: string) => {
    const updated = watchlistIds.filter((item) => item !== id);
    setWatchlistIds(updated);
    localStorage.setItem('ushma_watchlist', JSON.stringify(updated));
  };

  // Add all critical nodes
  const addAllCritical = () => {
    const criticalIds = buildings.filter((b) => b.thermalDebtScore >= 80).map((b) => b.id);
    const combined = Array.from(new Set([...watchlistIds, ...criticalIds]));
    setWatchlistIds(combined);
    localStorage.setItem('ushma_watchlist', JSON.stringify(combined));
  };

  // SMS & WhatsApp Dispatch Simulator state
  const [recipientNumber, setRecipientNumber] = useState<string>('+91 98101 23456');
  const [recipientPersona, setRecipientPersona] = useState<'vendor' | 'health_officer' | 'rwa'>('vendor');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'ta'>('hi');
  const [selectedAlertTier, setSelectedAlertTier] = useState<'tier1' | 'tier2'>('tier1');
  const [dispatchedMessages, setDispatchedMessages] = useState<
    {
      id: string;
      to: string;
      time: string;
      channel: 'SMS' | 'WhatsApp';
      text: string;
      status: 'Delivered';
    }[]
  >([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Watchlisted building objects
  const watchlistedBuildings = buildings.filter((b) => watchlistIds.includes(b.id));

  // Handle Dispatch
  const handleDispatchNotification = () => {
    setIsSending(true);
    soundEngine.playSpikeAlert();

    setTimeout(() => {
      let text = '';
      if (selectedLanguage === 'hi') {
        text =
          selectedAlertTier === 'tier1'
            ? '🚨 [उष्मा-नेत्र आपातकालीन चेतावनी] आपके बाज़ार में AC निकास से WBGT 36.8°C पार हो गया है। जानलेवा लू का खतरा। तुरंत अपनी रेहड़ी 15 मीटर दूर ले जाएं और नगर निगम हाइड्रेशन कियोस्क से ओआरएस लें।'
            : '⚠️ [उष्मा-नेत्र चेतावनी] दोपहर 2 से 4 बजे के बीच AC का गर्म निकास चरम पर रहेगा। छायादार क्षेत्र में रहें।';
      } else if (selectedLanguage === 'ta') {
        text =
          selectedAlertTier === 'tier1'
            ? '🚨 [உஷ்மா-நேத்ரா அவசர எச்சரிக்கை] ஏசி வெளியேற்றும் வெப்பம் 36.8°C WBGT அளவைத் தாண்டியது. ஆபத்தான வெப்ப அலை எச்சரிக்கை! உடனடியாக வண்டியை 15 மீ தள்ளி வைக்கவும், நகராட்சி நீர் மையத்தை அணுகவும்.'
            : '⚠️ [உஷ்மா-நேத்ரா எச்சரிக்கை] வணிக வளாக ஏசி வெப்பம் அதிகரித்துள்ளது. நிழல் பகுதியில் பாதுகாப்பாக இருக்கவும்.';
      } else {
        text =
          selectedAlertTier === 'tier1'
            ? '🚨 [Ushma-Netra URGENT ALERT] Commercial AC exhaust blast breached lethal WBGT 36.8°C threshold in your alley. Relocate carts 15m away; municipal evaporative mist kiosks engaged.'
            : '⚠️ [Ushma-Netra ADVISORY] Moderate thermal debt surge detected. Please hydrate frequently and use designated cool shelters.';
      }

      const newMsg = {
        id: `msg-${Date.now()}`,
        to: recipientNumber,
        time: new Date().toLocaleTimeString(),
        channel: 'WhatsApp' as const,
        text,
        status: 'Delivered' as const,
      };

      setDispatchedMessages((prev) => [newMsg, ...prev]);
      setIsSending(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link to="/" className="hover:text-zinc-200 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-amber-400 font-semibold">Heat Surge Watchlist & Alert Center</span>
      </nav>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Real-Time Alert Feed</span>
            </span>
            <span className="text-zinc-500 text-xs font-mono">·</span>
            <span className="text-zinc-400 text-xs font-mono">Early Warning System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Heat Surge Watchlist & Alert Center
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Monitor flagged high-vulnerability urban micro-canyons, simulate multi-lingual WhatsApp/SMS emergency dispatches to street vendors, and inspect autonomous SCADA mitigation logs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSimulateSurge}
            className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/40"
          >
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Simulate City-Wide Surge</span>
          </button>
        </div>
      </div>

      {/* Section 1: Monitored Watchlist Nodes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>My Monitored Hotspot Watchlist ({watchlistedBuildings.length})</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Zones currently pinned for sub-second lethal temperature threshold alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addAllCritical}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              + Add All Critical Hotspots
            </button>
            <Link
              to="/grid"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
            >
              Browse Registry
            </Link>
          </div>
        </div>

        {watchlistedBuildings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 text-center space-y-3">
            <p className="text-sm text-zinc-400">Your watchlist is currently empty.</p>
            <button
              onClick={addAllCritical}
              className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-mono font-bold text-xs"
            >
              Add Critical Delhi & Mumbai Nodes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchlistedBuildings.map((b) => (
              <div
                key={b.id}
                className="bg-[#0e0e14] rounded-xl border border-zinc-800 hover:border-amber-500/50 p-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-500">
                        {b.city} ({b.district})
                      </span>
                      <h4 className="text-sm font-bold text-white">{b.name}</h4>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(b.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-between my-2">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 block">Plume Temp</span>
                      <span className="text-lg font-black font-mono text-amber-400">
                        {b.streetPlumeTempCelsius}°C
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block">Exposed</span>
                      <span className="text-lg font-black font-mono text-rose-400">
                        {b.adjacentVulnerablePopulation.vendorsCount} vendors
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-xs font-mono">
                  <span
                    className={`text-[10px] uppercase font-bold ${
                      b.thermalDebtScore >= 85 ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    Debt: {b.thermalDebtScore}/100
                  </span>
                  <Link
                    to={`/grid/${b.id}`}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Interactive SMS & WhatsApp Early Warning Dispatch Simulator */}
      <div className="bg-[#0c0c14] rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-1 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Smartphone className="w-4 h-4" />
            <span>Community Early Warning System</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            SMS & WhatsApp Emergency Dispatch Simulator
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Simulate automated micro-targeted alerts sent via AWS SNS / WhatsApp Business API to street vendors and local health responders when exhaust temperatures breach survivability thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dispatch Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Recipient Phone Number</label>
              <input
                type="text"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Persona Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Recipient Persona</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'vendor', label: 'Street Vendor' },
                  { id: 'health_officer', label: 'Civic Health' },
                  { id: 'rwa', label: 'Market Assn.' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setRecipientPersona(p.id as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      recipientPersona === p.id
                        ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                        : 'bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Broadcast Language</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिन्दी (Hindi)' },
                  { id: 'ta', label: 'தமிழ் (Tamil)' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      selectedLanguage === lang.id
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Severity Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Hazard Tier</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedAlertTier('tier1')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedAlertTier === 'tier1'
                      ? 'bg-red-950/60 text-red-300 font-bold border border-red-800'
                      : 'bg-zinc-950 border border-zinc-850 text-zinc-400'
                  }`}
                >
                  Tier 1: Lethal Spike (WBGT &gt;36.5°C)
                </button>
                <button
                  onClick={() => setSelectedAlertTier('tier2')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedAlertTier === 'tier2'
                      ? 'bg-amber-950/60 text-amber-300 font-bold border border-amber-800'
                      : 'bg-zinc-950 border border-zinc-850 text-zinc-400'
                  }`}
                >
                  Tier 2: High Risk Warning
                </button>
              </div>
            </div>

            {/* Dispatch Button */}
            <button
              onClick={handleDispatchNotification}
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching Gateway Messages...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>Dispatch Warning Alert</span>
                </>
              )}
            </button>
          </div>

          {/* Smartphone Preview (6 cols) */}
          <div className="lg:col-span-6 bg-zinc-950 rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Business Gateway Preview</span>
                </span>
                <span className="text-zinc-600">Encrypted AES-256</span>
              </div>

              {/* Message Feed inside phone */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {dispatchedMessages.length === 0 ? (
                  <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 text-xs font-mono text-zinc-500 italic text-center py-10">
                    No active dispatches sent in this session. Configure alert parameters and click &quot;Dispatch Warning Alert&quot;.
                  </div>
                ) : (
                  dispatchedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-[#12221b] border border-emerald-900/60 space-y-1.5 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                        <span className="font-bold">TO: {msg.to}</span>
                        <span>{msg.time} · Delivered ✓✓</span>
                      </div>
                      <p className="text-xs text-zinc-100 leading-relaxed font-sans">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-[10px] font-mono text-zinc-600 pt-3 border-t border-zinc-900 flex justify-between">
              <span>Channel: AWS SNS SMS &amp; Meta Cloud API</span>
              <span>Latency: 420ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Live Incident Log Stream */}
      <div className="bg-[#0c0c12] rounded-2xl border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Real-Time Incident Stream & SCADA Actuation Queue</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Live audit logs of thermal surges, vendor alerts, Section 133 notices, and mist cannon engagements.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold animate-pulse">
            ● STREAM ACTIVE
          </span>
        </div>

        <div className="space-y-2.5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 flex items-start justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-bold">{log.timestamp}</span>
                  <span className="text-zinc-700">·</span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      log.type === 'exhaust_spike'
                        ? 'text-red-400'
                        : log.type === 'vendor_alert'
                        ? 'text-rose-400'
                        : log.type === 'tax_issued'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {log.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-zinc-200 font-bold font-sans">{log.title}</div>
                <div className="text-zinc-400 text-[11px] leading-relaxed">{log.detail}</div>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.tier === 1
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  TIER {log.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
