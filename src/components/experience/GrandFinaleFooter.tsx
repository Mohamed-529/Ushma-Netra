import React from 'react';
import { Flame, ArrowUpRight, ChevronRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { StoryAct } from './DynamicAtmosphere';

interface Props {
  onNavigateTo: (act: StoryAct) => void;
  onSimulateSurge: () => void;
}

export const GrandFinaleFooter: React.FC<Props> = ({
  onNavigateTo,
  onSimulateSurge,
}) => {
  return (
    <footer className="relative w-full text-zinc-300 overflow-hidden font-sans py-24 sm:py-32">
      {/* Subtle radial backdrop illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-red-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10 space-y-16">
        
        {/* Spacious, Elegant Central Banner */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CIVIC HEAT RESTITUTION GRID</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Thermal Justice at Ground Level.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
            Not personal consumer gadgets that alert workers after they overheat. A municipal hardware-software grid that detects anthropogenic heat at the source and enforces restorative restitution.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigateTo('live_cockpit')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Explore 3D Digital Twin</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSimulateSurge}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-mono text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>Simulate 54°C Surge</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards (High Spacing, Minimal Words) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md text-center space-y-1 hover:border-zinc-700 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              -12°C
            </div>
            <div className="text-xs text-zinc-300 font-medium pt-1">Plume Deflection</div>
            <div className="text-[11px] text-zinc-500">Skyward louvers break vortex</div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md text-center space-y-1 hover:border-zinc-700 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              $8.00
            </div>
            <div className="text-xs text-zinc-300 font-medium pt-1">IoT Beacon Cost</div>
            <div className="text-[11px] text-zinc-500">ESP32 + SHT31-D + Secrets Mgr</div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md text-center space-y-1 hover:border-zinc-700 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">
              Sec. 133
            </div>
            <div className="text-xs text-zinc-300 font-medium pt-1">CrPC Legal Basis</div>
            <div className="text-[11px] text-zinc-500">Public nuisance statutory order</div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md text-center space-y-1 hover:border-zinc-700 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              100%
            </div>
            <div className="text-xs text-zinc-300 font-medium pt-1">Vendor Restitution</div>
            <div className="text-[11px] text-zinc-500">Funded misting kiosk network</div>
          </div>
        </div>

        {/* Massive Minimalist Iconic Wordmark (Spacious & Clean) */}
        <div className="pt-12 text-center select-none pointer-events-none">
          <div className="text-[11vw] sm:text-[12vw] font-black tracking-tighter leading-none text-zinc-900/60 uppercase font-mono">
            USHMA·NETRA
          </div>
        </div>

        {/* Minimal Sub-Footer Row */}
        <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            <span className="text-zinc-300 font-bold">Ushma-Netra</span> · Autonomous Micro-Thermal Equity Grid
          </div>
          <div>
            AWS Global Environmental Hackathon 2026 · Track 02 (Heat & Water)
          </div>
        </div>
      </div>
    </footer>
  );
};
