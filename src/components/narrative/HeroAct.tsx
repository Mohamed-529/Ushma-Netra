import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, Shield, Radio, Sparkles } from 'lucide-react';

interface Props {
  onExploreClick: () => void;
}

export const HeroAct: React.FC<Props> = ({ onExploreClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientWidth, clientHeight } = document.documentElement;
      setMousePos({
        x: (e.clientX / clientWidth - 0.5) * 40,
        y: (e.clientY / clientHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-hidden bg-[#070b14]">
      {/* Subtle Ambient Cursor Light Following Mouse */}
      <div
        className="pointer-events-none absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 bg-gradient-to-tr from-amber-600 via-red-600 to-transparent transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 2.5}px, ${mousePos.y * 2.5}px)`,
          top: '20%',
          left: '25%',
        }}
      />

      {/* Atmospheric Micro-Particles Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-slate-200 tracking-wider font-semibold">USHMA-NETRA</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400">TRACK 02: HEAT & WATER</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-500">
          <span>AWS ENVIRONMENTAL HACKATHON</span>
          <span>·</span>
          <span>THERMAL EQUITY PROTOCOL</span>
        </div>
      </div>

      {/* Central Epic Typographic Statement */}
      <div className="relative z-10 my-auto max-w-5xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-amber-300"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>The Hidden Micro-Climate Crisis: The AC Exhaust "Death Loop"</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] text-balance"
        >
          As the city stays cool inside,{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            we are actively boiling the streets outside.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed"
        >
          Air conditioners do not destroy heat; they reject 50°C+ waste heat directly into narrow alleys at head height. Ushma-Netra is the first autonomous AI grid to map, quantify, and penalize micro-thermal exhaust dumping on AWS.
        </motion.p>

        {/* The 4-Step Operational Cadence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400"
        >
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-white font-semibold flex items-center gap-1.5">
            <span className="text-amber-400">01</span> Detect (CV Facade)
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-white font-semibold flex items-center gap-1.5">
            <span className="text-amber-400">02</span> Quantify (Thermal Debt)
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-white font-semibold flex items-center gap-1.5">
            <span className="text-amber-400">03</span> Surcharge (Section 133)
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-white font-semibold flex items-center gap-1.5">
            <span className="text-emerald-400">04</span> Shield (Upward Deflection)
          </span>
        </motion.div>
      </div>

      {/* Bottom Action & Scroll Indicator */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-800/60">
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div>
            <span className="text-slate-500 block text-[10px] font-mono">UNMITIGATED EXHAUST JET</span>
            <span className="font-mono font-bold text-red-400 text-sm">53.6°C Direct Blast</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px] font-mono">STREET DELTA IMPACT</span>
            <span className="font-mono font-bold text-amber-400 text-sm">+6.6°C Artificial Delta</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden md:block" />
          <div className="hidden md:block">
            <span className="text-slate-500 block text-[10px] font-mono">PILOT VALIDATION</span>
            <span className="font-mono font-bold text-slate-200 text-sm">Delhi NCR & Bengaluru</span>
          </div>
        </div>

        <button
          onClick={onExploreClick}
          className="group px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-3 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <span>Enter The Documentary Experience</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
