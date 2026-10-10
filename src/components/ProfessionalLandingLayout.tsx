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

  return (
    <div className="relative min-h-screen w-full bg-transparent text-zinc-100 selection:bg-amber-500/20 selection:text-amber-200 antialiased overflow-x-hidden font-sans">
      {/* Tactical Marquee Ribbon Outperforming Game Reference */}
      <div className="w-full bg-black border-b border-zinc-800 text-[11px] font-mono py-1 px-4 overflow-hidden flex items-center justify-between text-zinc-400 select-none z-50 relative">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            LIVE TELEMETRY
          </span>
          <span className="text-zinc-600">/</span>
          <span>53.6°C ANTHROPOGENIC EXHAUST JETS DETECTED</span>
          <span className="text-zinc-600">·</span>
          <span className="text-amber-400 font-semibold">14 STREET VENDORS MONITORED IN CRITICAL WBGT ZONE</span>
          <span className="text-zinc-600">·</span>
          <span>AUTONOMOUS SECTION 133 CIVIC SURCHARGES ACTIVE</span>
          <span className="text-zinc-600">·</span>
          <span className="text-emerald-400">AWS IOT CORE & BEDROCK AGENTS ONLINE</span>
          <span className="text-zinc-600">·</span>
          <span className="text-sky-400">3D CFD DIGITAL TWIN SIMULATION READY</span>
        </div>
        <div className="hidden lg:flex items-center gap-3 shrink-0 font-mono text-[10px] text-zinc-500 pl-4 border-l border-zinc-800">
          <span>LATENCY: 12ms</span>
          <span>·</span>
          <span className="text-emerald-400">AWS APPSYNC: CONNECTED</span>
        </div>
      </div>

      {/* Sleek Header with Tactile Drill Launcher */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
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
