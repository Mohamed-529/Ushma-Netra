import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Snowflake, AlertOctagon, TrendingUp, ArrowRight, Zap } from 'lucide-react';

export const TensionAct: React.FC = () => {
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');

  return (
    <section className="relative min-h-screen w-full py-24 px-6 sm:px-12 lg:px-16 flex flex-col justify-center bg-gradient-to-b from-[#070b14] via-[#1a0808] to-[#1e0a0a] transition-colors duration-1000 overflow-hidden">
      {/* Background Heat Shimmer Distortion Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_70%_40%,#ef4444_0,transparent_60%)]" />

      <div className="max-w-6xl mx-auto w-full space-y-12 relative z-10">
        {/* Act Kicker */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>ACT II · THE THERMODYNAMIC INJUSTICE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            We are artificially baking the poor <br className="hidden sm:inline" />
            <span className="text-red-400">so the privileged can stay cool.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-light leading-relaxed">
            Thermodynamics cannot be cheated. An air conditioner does not delete heat. It pumps extracted indoor heat outside, adding another 35% compressor motor heat, dumping a 54°C blast directly into street-level human lungs.
          </p>
        </div>

        {/* Interactive The Thermodynamic Divide Slider */}
        <div className="bg-slate-950/80 rounded-2xl border border-red-900/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
            <span className="text-slate-400">Interactive Divide: Drag To Reveal The Contrast</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeOfDay('day')}
                className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                  timeOfDay === 'day' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400'
                }`}
              >
                14:00 Peak Solar Blast
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                  timeOfDay === 'night' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400'
                }`}
              >
                22:00 Nocturnal Heat Trap
              </button>
            </div>
          </div>

          {/* Visual Dual-World Contrast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* The Cool Interior */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-sky-950/30 to-slate-900 border border-sky-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-sky-400" />
                  Inside Corporate Tower / Luxury Mall
                </span>
                <span className="text-xs font-mono text-emerald-400">Hermetically Sealed</span>
              </div>
              <div className="text-5xl font-extrabold text-sky-300 font-mono tabular-nums">
                22.0°C
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filtered, chilled air at 50% relative humidity. Total occupant comfort. Thick double-glazed acoustic glass shields them from hearing or feeling the street.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-sky-900/40 flex justify-between">
                <span>Power Consumed:</span>
                <span className="text-white font-bold">142 kW Electrical Load</span>
              </div>
            </div>

            {/* The Boiling Street Outside */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-red-950/60 to-amber-950/40 border border-red-700/60 space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-400" />
                  Outside in the 7.2m Public Alleyway
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold">
                  Exhaust Dumping Zone
                </span>
              </div>
              <div className="text-5xl font-extrabold text-red-400 font-mono tabular-nums">
                53.6°C
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Superheated horizontal jet of 638.4 kW rejected heat blasting at head height. Pedestrians, fruit vendors, and rickshaw pullers receive the thermal punishment.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-300 border-t border-red-800/40 flex justify-between">
                <span>Total Waste Heat Dumped:</span>
                <span className="text-red-400 font-bold">638.4 kW Continuous (No Permit)</span>
              </div>
            </div>
          </div>

          {/* The Scientific Thermodynamic Law Box */}
          <div className="p-4 rounded-xl bg-black/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono">
            <div className="text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1st Law of Thermodynamics in Street Canyons:</span>
            </div>
            <div className="text-amber-300 font-bold bg-amber-950/40 px-3 py-1.5 rounded border border-amber-900/60">
              Q_exhaust = Q_indoor + W_compressor = 1.35 × Cooling Tonnage
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
