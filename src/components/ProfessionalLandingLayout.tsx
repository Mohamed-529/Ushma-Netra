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
      {/* Sleek, Non-Intrusive Header with High Breathing Room */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          
          {/* Brand Signature */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSurgeActive ? 'bg-red-400' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isSurgeActive ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
            </span>
            <button
              onClick={() => onNavigateTo && onNavigateTo('wow_hero')}
              className="text-sm font-bold tracking-tight text-zinc-100 hover:text-amber-400 transition-colors uppercase font-mono cursor-pointer"
            >
              USHMA·NETRA
            </button>
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 pl-2 border-l border-zinc-800">
              Civic Heat Grid
            </span>
          </div>

          {/* Minimalist Navigation Links with Generous Spacing */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            {navLinks.map((link) => {
              const isActive = activeAct === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigateTo && onNavigateTo(link.id)}
                  className={`transition-colors py-1 cursor-pointer ${
                    isActive
                      ? 'text-zinc-100 font-semibold border-b-2 border-amber-400'
                      : 'hover:text-zinc-200'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Clean Action Controls (No Crowding) */}
          <div className="flex items-center gap-3">
            {onSimulateSurge && (
              <button
                onClick={onSimulateSurge}
                className="px-3.5 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                title="Test 54°C heatwave surge"
              >
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Simulate Surge</span>
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
