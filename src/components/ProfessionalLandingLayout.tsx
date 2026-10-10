import React, { useState } from 'react';
import { StoryAct } from './experience/DynamicAtmosphere';
import { soundEngine } from '../utils/audioSynthesizer';
import { Flame, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePresetName?: string;
  isHardwareConnected?: boolean;
  activeAct?: StoryAct;
  onNavigateTo?: (act: StoryAct) => void;
  onSimulateSurge?: () => void;
  isSurgeActive?: boolean;
  isMitigated?: boolean;
  onToggleMitigation?: () => void;
  onConnectHardware?: () => void;
}

export const ProfessionalLandingLayout: React.FC<LayoutProps> = ({
  children,
  activeAct = 'wow_hero',
  onNavigateTo,
  onSimulateSurge,
  isSurgeActive = false,
  isMitigated = false,
  onToggleMitigation,
}) => {
  const [audioActive, setAudioActive] = useState<boolean>(false);

  const toggleAudio = () => {
    const state = soundEngine.toggle();
    setAudioActive(state);
  };

  const navLinks: { id: StoryAct; label: string }[] = [
    { id: 'wow_hero', label: 'Overview' },
    { id: 'problem', label: 'The Physics' },
    { id: 'solution', label: 'System' },
    { id: 'live_cockpit', label: '3D Digital Twin' },
    { id: 'technology', label: 'AWS Cloud' },
    { id: 'final_demo', label: 'Civic Impact' },
  ];

  const telemetryItems = [
    { id: '1', badge: 'LIVE TELEMETRY', text: 'REAL-TIME EDGE SENSOR INGESTION ACTIVE', color: 'text-red-400', isLive: true },
    { id: '2', badge: 'EXHAUST PLUMES', text: '53.6°C JET ANTHROPOGENIC HEAT DUMP MONITORED', color: 'text-amber-400' },
    { id: '3', badge: 'EQUITY THRESHOLD', text: '14 STREET VENDORS IN CRITICAL WBGT EXPOSURE ZONE', color: 'text-rose-400' },
    { id: '4', badge: 'SURCHARGE AGENT', text: 'AUTONOMOUS SECTION 133 CIVIC SURCHARGES ACTIVE', color: 'text-sky-400' },
    { id: '5', badge: 'AWS CLOUD', text: 'IOT CORE MQTT & BEDROCK AUDIT AGENTS ONLINE', color: 'text-emerald-400' },
    { id: '6', badge: '3D CFD TWIN', text: 'PHYSICS-INFORMED TURBULENCE SIMULATION AT 60 FPS', color: 'text-purple-400' },
    { id: '7', badge: 'HARDWARE MESH', text: 'ESP32 LoRaWAN NODES (99.98% PACKET INTEGRITY)', color: 'text-cyan-400' },
    { id: '8', badge: 'HEAT OFFSETS', text: 'MICRO-THERMAL EQUITY CREDITS DISTRIBUTING LIVE', color: 'text-emerald-300' },
    { id: '9', badge: 'AWS TIMESTREAM', text: '12ms INGESTION LATENCY ACROSS CLOUD EDGES', color: 'text-zinc-300' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-transparent text-zinc-100 selection:bg-amber-500/20 selection:text-amber-200 antialiased overflow-x-hidden font-sans">
      {/* Tactical Marquee Ribbon: Infinite Seamless Snake Looping Stream */}
      <div className="w-full bg-[#08080a] border-b border-zinc-800/80 text-[11px] font-mono py-1.5 px-0 overflow-hidden flex items-center justify-between text-zinc-400 select-none z-50 relative">
        <div className="flex-1 overflow-hidden relative marquee-mask">
          <div className="flex w-max animate-marquee">
            {/* Primary Track */}
            <div className="flex items-center gap-6 shrink-0 pr-6">
              {telemetryItems.map((item) => (
                <div key={`track-a-${item.id}`} className="flex items-center gap-2 shrink-0">
                  {item.isLive && (
                    <span className="relative flex h-2 w-2 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  <span className={`font-bold tracking-wider ${item.color}`}>
                    {item.badge}
                  </span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-zinc-300">{item.text}</span>
                  <span className="text-zinc-700 ml-4 font-bold">✦</span>
                </div>
              ))}
            </div>

            {/* Cloned Duplicate Track for 100% Mathematically Seamless Snake Looping */}
            <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
              {telemetryItems.map((item) => (
                <div key={`track-b-${item.id}`} className="flex items-center gap-2 shrink-0">
                  {item.isLive && (
                    <span className="relative flex h-2 w-2 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  <span className={`font-bold tracking-wider ${item.color}`}>
                    {item.badge}
                  </span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-zinc-300">{item.text}</span>
                  <span className="text-zinc-700 ml-4 font-bold">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Static Low-Latency Telemetry Badge on Right */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 font-mono text-[10px] text-zinc-500 px-4 border-l border-zinc-800/80 bg-[#08080a] z-10 shadow-[-10px_0_15px_rgba(8,8,10,0.9)]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            LATENCY: 12ms
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-emerald-400 font-medium">AWS APPSYNC: ONLINE</span>
        </div>
      </div>

      {/* Sleek Header with Tactile Drill Launcher */}
      <header className="sticky top-0 z-50 w-full bg-[#08080a]/85 backdrop-blur-xl border-b border-zinc-800/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Signature */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSurgeActive ? 'bg-red-400' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isSurgeActive ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
            </span>
            <button
              onClick={() => onNavigateTo && onNavigateTo('wow_hero')}
              className="text-sm font-black tracking-wider text-zinc-100 hover:text-amber-400 transition-colors uppercase font-mono cursor-pointer flex items-center gap-1.5"
            >
              USHMA<span className="text-amber-500">·</span>NETRA
            </button>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-zinc-500 pl-2.5 border-l border-zinc-800">
              Civic Heat Grid
            </span>
          </div>

          {/* Minimalist Navigation Links with Generous Spacing */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-mono font-medium text-zinc-400">
            {navLinks.map((link) => {
              const isActive = activeAct === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigateTo && onNavigateTo(link.id)}
                  className={`transition-colors py-1 cursor-pointer ${
                    isActive
                      ? 'text-zinc-100 font-bold border-b-2 border-amber-400'
                      : 'hover:text-zinc-200'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Clean Action Controls with CampusEvac Style Tactical Launcher */}
          <div className="flex items-center gap-2.5">
            {/* Direct 3D Simulation Drill Launcher (Beating Game Reference) */}
            <button
              onClick={() => onNavigateTo && onNavigateTo('live_cockpit')}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 text-xs font-black font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20 border border-amber-300"
            >
              <span>START 3D DRILL</span>
              <span className="text-[13px] leading-none">➔</span>
            </button>

            {onSimulateSurge && (
              <button
                onClick={onSimulateSurge}
                className="hidden sm:flex px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-mono font-semibold items-center gap-1.5 transition-all cursor-pointer"
                title="Trigger 54°C emergency heat spike"
              >
                <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              </button>
            )}

            {onToggleMitigation && (
              <button
                onClick={onToggleMitigation}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMitigated
                    ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
                title="Toggle skyward diversion louvers"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{isMitigated ? 'Louvers Active' : 'Engage Louvers'}</span>
              </button>
            )}

            <button
              onClick={toggleAudio}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title="Toggle audio synthesizer"
            >
              {audioActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport: Clean, Spacious, Unobstructed */}
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};
