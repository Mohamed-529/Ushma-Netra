import React from 'react';
import { motion } from 'motion/react';
import { HeartPulse, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';

export const HumanCrisisAct: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full py-28 px-6 sm:px-12 lg:px-16 flex flex-col justify-center bg-gradient-to-b from-[#1e0a0a] via-[#120404] to-[#0a0712] overflow-hidden">
      {/* Background Pulse Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,#dc2626_0,transparent_70%)] animate-pulse-glow" />

      <div className="max-w-5xl mx-auto w-full space-y-16 relative z-10">
        {/* Header Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono text-red-400">
          <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
          <span>ACT III · THE PHYSIOLOGICAL LETHALITY LIMIT</span>
        </div>

        {/* Sequential Typography Master Statements */}
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-400"
          >
            This is not seasonal summer heat.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            This is an <span className="text-red-400 underline decoration-red-600/50">artificial micro-thermal trap</span> dumped onto public rights-of-way.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-300"
          >
            At 35°C Wet Bulb Globe Temperature (WBGT),{' '}
            <strong className="text-amber-400 font-bold">human sweat physically cannot evaporate.</strong>
          </motion.p>
        </div>

        {/* Ground-Truth Profile: Rameshwar Pal (Laxmi Nagar, Delhi) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Ground-Truth Subject Profile</div>
              <h3 className="text-xl font-bold text-white mt-0.5">Rameshwar Pal, 52 · Tea Stall Operator</h3>
              <p className="text-xs text-slate-400">Gali No. 4, District Centre Alleyway, Laxmi Nagar, Delhi NCR</p>
            </div>
            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Distance to AC Exhaust Bank</span>
              <span className="text-lg font-bold text-red-400 tabular-nums">2.8 meters away</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">LOCAL WBGT MEASURED</span>
              <span className="text-2xl font-bold text-red-500 tabular-nums">36.8°C</span>
              <span className="text-[10px] text-red-400 block mt-0.5">Exceeds physiological limit</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DAILY DURATION OF EXPOSURE</span>
              <span className="text-2xl font-bold text-amber-400 tabular-nums">11.5 Hours</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">07:00 to 18:30 daily</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ESTIMATED HEAT STROKE TIME</span>
              <span className="text-2xl font-bold text-red-400 tabular-nums">&lt; 40 mins</span>
              <span className="text-[10px] text-red-400 block mt-0.5">Without active hydration break</span>
            </div>
          </div>

          <blockquote className="p-4 rounded-xl bg-slate-900/50 border-l-2 border-amber-500 text-xs text-slate-300 italic leading-relaxed">
            "By two in the afternoon, the back of my neck feels like it is on a tandoor fire. The air coming from the building's AC boxes smells of hot metal and grease. You cannot breathe. But this is where my customers come. Where else can I go?"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};
