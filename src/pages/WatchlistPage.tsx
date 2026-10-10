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
  RefreshCw,
  ArrowLeft,
  Home
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
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-bold transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-medium transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-[#0b1b2d]/70">
          <Link to="/" className="hover:text-[#a8321a] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#0b1b2d]/40" />
          <span className="text-[#a8321a] font-bold">Heat Surge Watchlist &amp; Alert Center</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#d6cebe]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>Real-Time Alert Feed</span>
            </span>
            <span className="text-[#0b1b2d]/40 text-xs font-mono">·</span>
            <span className="text-[#0b1b2d]/80 text-xs font-mono font-semibold">Early Warning System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0b1b2d]">
            Heat Surge Watchlist &amp; Alert Center
          </h1>
          <p className="text-sm text-[#1f3044] max-w-2xl leading-relaxed">
            Monitor flagged high-vulnerability urban micro-canyons, simulate multi-lingual WhatsApp/SMS emergency dispatches to street vendors, and inspect autonomous SCADA mitigation logs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSimulateSurge}
            className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 border border-red-300 text-red-900 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Flame className="w-4 h-4 text-red-700 animate-pulse" />
            <span>Simulate City-Wide Surge</span>
          </button>
        </div>
      </div>

      {/* Section 1: Monitored Watchlist Nodes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#0b1b2d] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#a8321a]" />
              <span>My Monitored Hotspot Watchlist ({watchlistedBuildings.length})</span>
            </h2>
            <p className="text-xs text-[#1f3044]">
              Zones currently pinned for sub-second lethal temperature threshold alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addAllCritical}
              className="text-xs font-mono text-[#a8321a] hover:underline font-bold cursor-pointer"
            >
              + Add All Critical Hotspots
            </button>
            <Link
              to="/grid"
              className="text-xs font-mono text-[#0b1b2d] hover:text-[#a8321a] px-3.5 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] transition-colors font-bold"
            >
              Browse Registry
            </Link>
          </div>
        </div>

        {watchlistedBuildings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#efe8dc] border border-dashed border-[#d6cebe] text-center space-y-3">
            <p className="text-sm text-[#1f3044]">Your watchlist is currently empty.</p>
            <button
              onClick={addAllCritical}
              className="px-4 py-2 rounded-xl bg-[#0b1b2d] text-white font-mono font-bold text-xs cursor-pointer"
            >
              Add Critical Delhi &amp; Mumbai Nodes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchlistedBuildings.map((b) => (
              <div
                key={b.id}
                className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] hover:border-[#b8ad9d] p-5 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#526071] font-bold">
                        {b.city} ({b.district})
                      </span>
                      <h4 className="text-sm font-bold text-[#0b1b2d]">{b.name}</h4>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(b.id)}
                      className="text-[#526071] hover:text-red-700 transition-colors p-1 cursor-pointer"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#d6cebe] flex items-center justify-between my-2 shadow-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#526071] font-bold block uppercase">Plume Temp</span>
                      <span className="text-lg font-black font-mono text-[#a8321a]">
                        {b.streetPlumeTempCelsius}°C
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[#526071] font-bold block uppercase">Exposed</span>
                      <span className="text-lg font-black font-mono text-rose-800">
                        {b.adjacentVulnerablePopulation.vendorsCount} vendors
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#d6cebe] flex items-center justify-between text-xs font-mono">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      b.thermalDebtScore >= 85 ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    Debt: {b.thermalDebtScore}/100
                  </span>
                  <Link
                    to={`/grid/${b.id}`}
                    className="text-[#a8321a] hover:text-[#8c2210] flex items-center gap-1 font-bold"
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
      <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1 pb-4 border-b border-[#d6cebe]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a8321a] font-bold">
            <Smartphone className="w-4 h-4" />
            <span>Community Early Warning System</span>
          </div>
          <h2 className="text-2xl font-bold text-[#0b1b2d]">
            SMS &amp; WhatsApp Emergency Dispatch Simulator
          </h2>
          <p className="text-xs text-[#1f3044] max-w-2xl leading-relaxed">
            Simulate automated micro-targeted alerts sent via AWS SNS / WhatsApp Business API to street vendors and local health responders when exhaust temperatures breach survivability thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dispatch Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#526071] font-bold">Recipient Phone Number</label>
              <input
                type="text"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-[#fbf9f5] border border-[#d6cebe] rounded-xl px-4 py-2.5 text-xs text-[#0b1b2d] font-mono focus:outline-none focus:border-[#0b1b2d] shadow-2xs font-semibold"
              />
            </div>

            {/* Persona Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#526071] font-bold">Recipient Persona</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'vendor', label: 'Street Vendor' },
                  { id: 'health_officer', label: 'Civic Health' },
                  { id: 'rwa', label: 'Market Assn.' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setRecipientPersona(p.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                      recipientPersona === p.id
                        ? 'bg-[#0b1b2d] text-white font-bold shadow-xs'
                        : 'bg-[#f5efe6] border border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#526071] font-bold">Broadcast Language</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिन्दी (Hindi)' },
                  { id: 'ta', label: 'தமிழ் (Tamil)' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                      selectedLanguage === lang.id
                        ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-xs'
                        : 'bg-[#f5efe6] border border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Severity Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#526071] font-bold">Hazard Tier</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedAlertTier('tier1')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    selectedAlertTier === 'tier1'
                      ? 'bg-red-100 text-red-900 font-bold border border-red-300 shadow-xs'
                      : 'bg-[#f5efe6] border border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
                  }`}
                >
                  Tier 1: Lethal Spike (&gt;36.5°C)
                </button>
                <button
                  onClick={() => setSelectedAlertTier('tier2')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    selectedAlertTier === 'tier2'
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-xs'
                      : 'bg-[#f5efe6] border border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
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
              className="w-full py-3 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
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
          <div className="lg:col-span-6 bg-[#f5efe6] rounded-2xl border border-[#d6cebe] p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#d6cebe] text-xs font-mono text-[#0b1b2d]">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Business Gateway Preview</span>
                </span>
                <span className="text-[#526071] text-[11px]">Encrypted AES-256</span>
              </div>

              {/* Message Feed inside phone */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {dispatchedMessages.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#efe8dc] border border-dashed border-[#d6cebe] text-xs font-mono text-[#526071] italic text-center py-10">
                    No active dispatches sent in this session. Configure alert parameters and click &quot;Dispatch Warning Alert&quot;.
                  </div>
                ) : (
                  dispatchedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-[#fbf9f5] border border-emerald-300 space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-800">
                        <span className="font-bold">TO: {msg.to}</span>
                        <span>{msg.time} · Delivered ✓✓</span>
                      </div>
                      <p className="text-xs text-[#0b1b2d] leading-relaxed font-sans">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#526071] pt-3 border-t border-[#d6cebe] flex justify-between font-medium">
              <span>Channel: AWS SNS SMS &amp; Meta Cloud API</span>
              <span>Latency: 420ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Live Incident Log Stream */}
      <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#d6cebe] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0b1b2d] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#a8321a]" />
              <span>Real-Time Incident Stream &amp; SCADA Actuation Queue</span>
            </h3>
            <p className="text-xs text-[#1f3044]">
              Live audit logs of thermal surges, vendor alerts, Section 133 notices, and mist cannon engagements.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            STREAM ACTIVE
          </span>
        </div>

        <div className="space-y-2.5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#d6cebe] flex items-start justify-between gap-4 font-mono text-xs shadow-2xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#526071] font-bold">{log.timestamp}</span>
                  <span className="text-[#0b1b2d]/30">·</span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      log.type === 'exhaust_spike'
                        ? 'text-red-700'
                        : log.type === 'vendor_alert'
                        ? 'text-rose-700'
                        : log.type === 'tax_issued'
                        ? 'text-[#a8321a]'
                        : 'text-emerald-800'
                    }`}
                  >
                    {log.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[#0b1b2d] font-bold font-sans">{log.title}</div>
                <div className="text-[#1f3044] text-[11px] leading-relaxed font-sans">{log.detail}</div>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    log.tier === 1
                      ? 'bg-red-100 text-red-900 border border-red-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
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
