import React from 'react';
import { FloatingTechWorkspace } from './FloatingTechWorkspace';
import { Layers, Sparkles, Cpu, Satellite, ShieldCheck, ArrowDown } from 'lucide-react';

interface Props {
  onScrollToProblem?: () => void;
}

export const SpatialWorkspaceAct: React.FC<Props> = ({ onScrollToProblem }) => {
  return (
    <section
      id="workspace"
      className="relative min-h-screen w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 bg-transparent border-t border-zinc-800/40"
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,#0284c7_0,transparent_60%)]" />

      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-10 relative z-10">
        {/* Narrative Act Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-bold tracking-wider">ACT 02 · 3D HARDWARE TEST-BENCH</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 uppercase">Interactive Spatial Telemetry Grid</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal text-[#0b1b2d] tracking-tight font-sans">
              Tactile 3D Infrastructure Console & Multi-Spectral Bench
            </h2>
            <p className="text-sm sm:text-base text-[#1f3044] max-w-3xl font-normal leading-relaxed">
              Before dissecting the street-level anthropogenic heat physics, explore the physical test-bench docking all 7 multi-spectral data tokens—from Landsat-9 infrared satellite scans and IoT LoRaWAN sensors to DynamoDB audit ledgers and autonomous Section 133 municipal decrees.
            </p>
          </div>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-400 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PURE WHITE AESTHETIC</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>FREE-FLOWING SCROLL</span>
            </span>
          </div>
        </div>

        {/* 3D Interactive Canvas Container Component */}
        <div className="w-full">
          <FloatingTechWorkspace />
        </div>

        {/* Bottom Act Transition Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-mono text-zinc-200 font-semibold block sm:inline">
                READY TO INSPECT GROUND REALITY?
              </span>
              <span className="text-zinc-400 sm:ml-2 font-light">
                Discover why the street level actively bakes at 54°C while penthouses chill to 20°C.
              </span>
            </div>
          </div>

          {onScrollToProblem && (
            <button
              onClick={onScrollToProblem}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20 shrink-0"
            >
              <span>DISSECT CANYON THERMODYNAMICS</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
