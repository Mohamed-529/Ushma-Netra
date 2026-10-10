import React, { useState } from 'react';
import { StoryAct } from './DynamicAtmosphere';
import { Flame, ShieldCheck, Volume2, VolumeX, Zap, Radio, ChevronRight } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

interface Props {
  activeAct: StoryAct;
  onNavigateTo: (act: StoryAct) => void;
  onSimulateSurge: () => void;
  isSurgeActive: boolean;
  isMitigated: boolean;
  onToggleMitigation: () => void;
}

export const DirectorsFloatingHUD: React.FC<Props> = ({
  activeAct,
  onNavigateTo,
  onSimulateSurge,
  isSurgeActive,
  isMitigated,
  onToggleMitigation,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(false);

  const toggleAudio = () => {
    const state = soundEngine.toggle();
    setSoundOn(state);
  };

  const navItems: { id: StoryAct; label: string; number: string }[] = [
    { id: 'wow_hero', label: 'WOW', number: '01' },
    { id: 'problem', label: 'PROBLEM', number: '02' },
    { id: 'tension', label: 'TENSION', number: '03' },
    { id: 'solution', label: 'SOLUTION', number: '04' },
    { id: 'live_cockpit', label: 'LIVE TWIN', number: '05' },
    { id: 'proof', label: 'PROOF', number: '06' },
    { id: 'technology', label: 'TECH', number: '07' },
    { id: 'final_demo', label: 'IMPACT', number: '08' },
    { id: 'challenge', label: 'CHALLENGE', number: '09' },
  ];

  return (
    <nav className="fixed top-3 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Status Kicker */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSurgeActive ? 'bg-red-400' : 'bg-amber-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSurgeActive ? 'bg-red-500' : 'bg-amber-500'}`} />
          </span>
          <button
            onClick={() => onNavigateTo('wow_hero')}
            className="text-white font-extrabold tracking-wider hover:text-amber-400 transition-colors cursor-pointer"
          >
            USHMA-NETRA
          </button>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">THERMAL EQUITY GRID</span>
        </div>

        {/* Center: The Story Chapter Timeline (Desktop) */}
        <div className="pointer-events-auto hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-black/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl text-[11px] font-mono">
          {navItems.map((item) => {
            const isActive = activeAct === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTo(item.id)}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span className={`text-[9px] ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{item.number}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Act Stepper for Medium & Tablet screens */}
        <div className="pointer-events-auto hidden md:flex xl:hidden items-center gap-1 px-3 py-1.5 rounded-2xl bg-black/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl text-xs font-mono">
          <span className="text-amber-400 font-bold">
            {navItems.find((n) => n.id === activeAct)?.number || '01'}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold tracking-wide">
            {navItems.find((n) => n.id === activeAct)?.label || 'ACT'}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigateTo(item.id)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeAct === item.id ? 'bg-amber-400 w-4' : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={item.label}
              />
            ))}
          </div>
        </div>

        {/* Right: Soundscape, Peak Surge, & Live Twin Shortcuts */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-2xl border text-xs font-mono transition-all cursor-pointer backdrop-blur-xl ${
              soundOn
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md'
                : 'bg-black/80 border-slate-800/90 text-slate-400 hover:text-white'
            }`}
            title="Toggle synthesized compressor drone soundscape"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Simulate Peak Surge Trigger */}
          <button
            onClick={onSimulateSurge}
            className="px-3 py-1.5 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-red-950/40 backdrop-blur-xl transition-all cursor-pointer"
            title="Trigger peak cooling surge"
          >
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">Peak 54°C Surge</span>
          </button>

          {/* Jump to Live Tool */}
          <button
            onClick={() => onNavigateTo('live_cockpit')}
            className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-mono text-[11px] font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Live Twin</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Act Scrubber Strip */}
      <div className="pointer-events-auto md:hidden mt-1.5 flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeAct === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigateTo(item.id)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                  : 'bg-black/80 text-slate-400 border-slate-800 backdrop-blur-md'
              }`}
            >
              {item.number} {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
