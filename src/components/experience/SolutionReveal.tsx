import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Scale, Cpu, Satellite, Radio, ShieldCheck, ArrowDown } from 'lucide-react';

interface Props {
  onScrollToLive: () => void;
}

export const SolutionReveal: React.FC<Props> = ({ onScrollToLive }) => {
  return (
    <section className="relative min-h-screen w-full py-28 px-6 sm:px-12 lg:px-20 flex flex-col justify-center bg-gradient-to-b from-[#090b14] via-[#081326] to-[#070b14] overflow-hidden">
      {/* Background Cyan Vector Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_35%_50%,#0284c7_0,transparent_60%)]" />

      <div className="max-w-5xl mx-auto w-full space-y-16 relative z-10 text-center">
        {/* Section Kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>03 · THE TECHNOLOGICAL & REGULATORY BREAKTHROUGH</span>
        </div>

        {/* The Fundamental Question */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg sm:text-2xl text-slate-400 font-light"
          >
            We asked one simple, urgent question:
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-serif"
          >
            "Why is dumping sewage in a public street a crime, but dumping{' '}
            <span className="bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              600 kW of blistering thermal waste
            </span>{' '}
            onto public sidewalks completely legal?"
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto"
          >
            Because until now, municipal bodies lacked the computer vision, the edge IoT telemetry, and the legal mathematical framework to prove thermal causation and enforce accountability.
          </motion.p>
        </div>

        {/* The 4-Pillar Architectural Assembly */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="p-8 sm:p-10 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-2xl space-y-8"
        >
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">
            THE ARCHITECTURAL CONVERGENCE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <Satellite className="w-5 h-5 text-sky-400" />
              <div className="text-sm font-bold text-white">Landsat-9 Thermal</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Macroscopic Land Surface Temperature (LST) mapping identifying urban heat island anomalies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <div className="text-sm font-bold text-white">SageMaker CV</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Street-view computer vision scanning facades, counting AC outdoor units, and calculating kW rejection.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <Radio className="w-5 h-5 text-purple-400" />
              <div className="text-sm font-bold text-white">IoT Vendor Beacons</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                $8 solar wearables measuring micro-canyon WBGT at pedestrian head level in real time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <div className="text-sm font-bold text-white">Bedrock Policy Agent</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Autonomous Section 133 municipal notices assessing monthly exhaust debt and mandating restorative louvers.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-300 text-left">
              <span className="text-emerald-400 font-bold block text-sm">USHMA-NETRA (उष्मा-नेत्रा)</span>
              The world’s first autonomous thermal equity and exhaust debt orchestration platform.
            </div>

            <button
              onClick={onScrollToLive}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <span>Explore Live Working System</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
