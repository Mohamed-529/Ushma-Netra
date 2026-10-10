import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Snowflake, AlertOctagon, Zap, ArrowRight, Activity, Thermometer } from 'lucide-react';

export const VisceralProblem: React.FC = () => {
  const [acLoad, setAcLoad] = useState<number>(85);

  const exhaustTemp = (36 + (acLoad / 100) * 18).toFixed(1);
  const streetTemp = (38 + (acLoad / 100) * 9.8).toFixed(1);
  const totalHeatKw = ((acLoad / 100) * 638.4).toFixed(0);

  return (
    <section id="problem-act" className="relative min-h-screen w-full py-28 px-6 sm:px-12 lg:px-20 flex flex-col justify-center bg-transparent transition-colors duration-1000 overflow-hidden">
      {/* Background Volcanic Heat Glow & Distortion */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_65%_45%,#ef4444_0,transparent_65%)]" />

      <div className="max-w-6xl mx-auto w-full space-y-14 relative z-10">
        {/* Section Kicker */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>01 · THE ANTHROPOGENIC CANYON INJUSTICE</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">THERMODYNAMIC CAUSATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight text-zinc-100 tracking-tight leading-[1.08] font-sans">
            Air conditioners don't destroy heat. <br />
            <span className="text-red-400 font-normal">They dump it onto the people outside.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-light leading-relaxed">
            Every 1 TR of indoor cooling rejects 1.35 kW of superheated sensible exhaust. In dense Indian street canyons, commercial buildings mount banks of 60+ split AC units directly at head height, creating an unventilated furnace.
          </p>
        </div>

        {/* Visual Narrative Stage: The 4-Stage Thermodynamic Pipeline with Transfer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#0c0d12]/75 backdrop-blur-md border border-zinc-800/40 space-y-2.5 relative group hover:border-zinc-700/60 transition-all">
            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
              <span className="tracking-wider">STAGE 01</span>
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xs font-semibold text-zinc-200 font-mono">Indoor Evaporator</div>
            <div className="text-xl font-light text-sky-400">22.0°C</div>
            <p className="text-[11px] text-zinc-400 font-sans font-light leading-relaxed">
              Extracts 182 TR sensible and latent heat from corporate offices and luxury mall boutiques.
            </p>
            <div className="pt-2 border-t border-zinc-800/40 text-[10px] text-zinc-500 flex items-center justify-between">
              <span>Heat Extracted</span>
              <span className="text-sky-400">→ Dispatched</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0d12]/75 backdrop-blur-md border border-zinc-800/40 space-y-2.5 relative group hover:border-zinc-700/60 transition-all">
            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
              <span className="tracking-wider">STAGE 02</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xs font-semibold text-zinc-200 font-mono">Compressor Work</div>
            <div className="text-xl font-light text-amber-400">+142 kW</div>
            <p className="text-[11px] text-zinc-400 font-sans font-light leading-relaxed">
              Compressor motor converts electrical energy into raw mechanical heat, inflating exhaust load by 35%.
            </p>
            <div className="pt-2 border-t border-zinc-800/40 text-[10px] text-zinc-500 flex items-center justify-between">
              <span>Electrical Added</span>
              <span className="text-amber-400">→ +35% Load</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/20 backdrop-blur-md border border-red-900/40 space-y-2.5 relative group hover:border-red-700/60 transition-all">
            <div className="flex items-center justify-between text-red-400 text-[10px]">
              <span className="tracking-wider">STAGE 03</span>
              <Flame className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-xs font-semibold text-zinc-200 font-mono">Exhaust Blast</div>
            <div className="text-xl font-light text-red-400">{exhaustTemp}°C</div>
            <p className="text-[11px] text-zinc-400 font-sans font-light leading-relaxed">
              64 outdoor condenser units vent 53.6°C sensible heat horizontally at 1.5m pedestrian head height.
            </p>
            <div className="pt-2 border-t border-red-900/40 text-[10px] text-red-400 flex items-center justify-between">
              <span>Sensible Discharge</span>
              <span className="text-red-400">→ Sidewalk Level</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/20 backdrop-blur-md border border-red-900/40 space-y-2.5 relative group hover:border-red-700/60 transition-all">
            <div className="flex items-center justify-between text-red-400 text-[10px]">
              <span className="tracking-wider">STAGE 04</span>
              <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-xs font-semibold text-zinc-200 font-mono">Canyon Trapping</div>
            <div className="text-xl font-light text-red-500">{streetTemp}°C</div>
            <p className="text-[11px] text-zinc-400 font-sans font-light leading-relaxed">
              7.2m narrow street canyon traps the thermal plume. Ambient WBGT crosses 36.8°C lethal threshold.
            </p>
            <div className="pt-2 border-t border-red-900/40 text-[10px] text-red-400 flex items-center justify-between">
              <span>Vortex Stagnation</span>
              <span className="text-red-500 font-semibold">Lethal WBGT</span>
            </div>
          </div>
        </div>

        {/* Interactive Dynamic Chiller Load Stress Tester */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0d12]/80 backdrop-blur-md border border-zinc-800/40 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/40 pb-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                Live Canyon Thermodynamics Engine
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-light">
                Drag the building AC cooling load to simulate real-time thermal plume expansion in the alleyway.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">Commercial AC Load:</span>
              <span className="text-lg font-bold font-mono text-red-400 tabular-nums">{acLoad}%</span>
              <input
                type="range"
                min="30"
                max="100"
                value={acLoad}
                onChange={(e) => setAcLoad(Number(e.target.value))}
                className="w-36 accent-red-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive Heat Plume Expansion Bar */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Sidewalk Thermal Plume Penetration</span>
              <span className="text-red-400 font-semibold">
                {acLoad > 80 ? 'CRITICAL PLUME PENETRATION (100% of Alley Width)' : 'Moderate Plume Depth'}
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800/60">
              <div
                className="h-full rounded-full transition-all duration-200 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600"
                style={{ width: `${acLoad}%` }}
              />
            </div>
          </div>

          {/* Real-Time Mathematical Readout Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/40">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Continuous Waste Heat Dumped</span>
              <span className="text-3xl font-extralight text-red-400 tabular-nums">{totalHeatKw} kW</span>
              <span className="text-[10px] text-zinc-500 block mt-1 font-sans">Equal to {Math.round(Number(totalHeatKw) / 2)} space heaters on sidewalk</span>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/40">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Exhaust Nozzle Temperature</span>
              <span className="text-3xl font-extralight text-amber-400 tabular-nums">{exhaustTemp}°C</span>
              <span className="text-[10px] text-zinc-500 block mt-1 font-sans">Measured at condenser fan grill</span>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/40">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Street Pedestrian Delta</span>
              <span className="text-3xl font-extralight text-red-500 tabular-nums">+{(Number(streetTemp) - 41.2).toFixed(1)}°C</span>
              <span className="text-[10px] text-red-400 block mt-1 font-sans">Direct unconsented thermal inflation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
