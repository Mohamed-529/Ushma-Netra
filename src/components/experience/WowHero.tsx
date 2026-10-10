import React from 'react';
import { motion } from 'motion/react';
import { ThermalContrastCards } from './ThermalContrastCards';

interface Props {
  onScrollToProblem: () => void;
  onJumpToLive: () => void;
}

export const WowHero: React.FC<Props> = ({ onScrollToProblem, onJumpToLive }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-8 pb-12 overflow-hidden bg-[#faf7f2] text-slate-900 selection:bg-amber-500/20 selection:text-amber-900">
      {/* =============================================================== */}
      {/* 1. THE ULTRA-CLEAN NAVBAR */}
      {/* Single, borderless, crystal-clear transparent navbar overlay */}
      {/* =============================================================== */}
      <nav className="relative z-30 w-full flex items-center justify-between py-2">
        {/* Left Side: Clean text logo "Ushma-Netra" with subtitle "Thermal Equity Grid" */}
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
            Ushma-Netra
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-medium tracking-wider text-slate-500 uppercase">
            Thermal Equity Grid
          </span>
        </div>

        {/* Center: 3 simple text links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 font-sans">
          <button
            onClick={() => scrollToSection('problem')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            The Injustice
          </button>
          <button
            onClick={() => scrollToSection('live_cockpit')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            Live Network
          </button>
          <button
            onClick={() => scrollToSection('technology')}
            className="hover:text-slate-950 transition-colors cursor-pointer"
          >
            How It Works
          </button>
        </div>

        {/* Right Side: A single, high-contrast, rounded primary button */}
        <div className="flex items-center">
          <button
            onClick={onJumpToLive}
            className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Launch Live Twin
          </button>
        </div>
      </nav>

      {/* =============================================================== */}
      {/* MAIN HERO VIEWPORT: High-Impact Human Story Layout */}
      {/* =============================================================== */}
      <div className="relative z-20 my-auto w-full py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* 2. MASSIVE TYPOGRAPHY HIERARCHY (Left Side, 7 Cols) */}
          <div className="lg:col-span-7 space-y-7">
            {/* Main Headline (text-5xl or text-6xl, font-bold, tracking-tight) */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans"
            >
              The affluent stay cool.{' '}
              <span className="text-amber-800 block sm:inline">
                The streets are actively baking.
              </span>
            </motion.h1>

            {/* Simple 2-sentence description block in standard, clean English */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg sm:text-xl text-slate-700 font-normal leading-relaxed max-w-2xl font-sans"
            >
              Air conditioners don't destroy heat—they dump blistering 54°C exhaust directly onto informal street workers. Ushma-Netra quantifies this hidden thermal dumping to protect vulnerable citizens.
            </motion.p>

            {/* Quick Action Anchor */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500"
            >
              <button
                onClick={onScrollToProblem}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-medium hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all cursor-pointer font-sans text-sm"
              >
                <span>Read The Field Investigation</span>
                <span className="text-amber-700">↓</span>
              </button>
              <span className="hidden sm:inline text-slate-400">·</span>
              <span className="hidden sm:inline text-slate-500 font-sans">
                Monitored across 10 Urban Heat Canyons in India
              </span>
            </motion.div>
          </div>

          {/* 3. CRISP VISUAL PROOF: Overlapping Thermal Image Cards (Right Side, 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center w-full"
          >
            <ThermalContrastCards className="w-full" />
          </motion.div>
        </div>
      </div>

      {/* Subtle Bottom Grounding Footnote */}
      <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-200/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>REAL-TIME CITIZEN SENSOR TELEMETRY VERIFIED</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          POWERED BY SATELLITE LST + EDGE COMPUTER VISION + SECTION 133 CIVIC TARIFFS
        </div>
      </div>
    </section>
  );
};
