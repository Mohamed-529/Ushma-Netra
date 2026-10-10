import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ThermalContrastCards } from './ThermalContrastCards';
import { ArrowRight, ArrowDown, MapPin, Box, ShieldAlert } from 'lucide-react';

interface Props {
  onScrollToProblem: () => void;
  onJumpToLive: () => void;
}

export const WowHero: React.FC<Props> = ({ onScrollToProblem, onJumpToLive }) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-6 pb-12 overflow-hidden bg-[#faf7f2] text-slate-900 selection:bg-amber-500/20 selection:text-amber-900">
      {/* Top Ambient Status Strip */}
      <div className="relative z-20 w-full flex items-center justify-between py-2 text-xs font-mono text-slate-500 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">NODE SENSOR TELEMETRY LIVE</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-500 hidden sm:inline">10 MONITORED CITIES</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/grid"
            className="hover:text-slate-900 text-slate-600 transition-colors hidden sm:flex items-center gap-1 font-medium"
          >
            <span>Thermal Grid</span>
            <ArrowRight className="w-3 h-3 text-amber-700" />
          </Link>
          <Link
            to="/twin"
            className="hover:text-slate-900 text-slate-600 transition-colors hidden sm:flex items-center gap-1 font-medium"
          >
            <span>3D Twin Lab</span>
            <ArrowRight className="w-3 h-3 text-amber-700" />
          </Link>
        </div>
      </div>

      {/* =============================================================== */}
      {/* MAIN HERO VIEWPORT: High-Impact Human Story Layout */}
      {/* =============================================================== */}
      <div className="relative z-20 my-auto w-full py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* MASSIVE TYPOGRAPHY HIERARCHY (Left Side, 7 Cols) */}
          <div className="lg:col-span-7 space-y-7">
            {/* Main Headline */}
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

            {/* Primary Action Anchors */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono"
            >
              <button
                onClick={onScrollToProblem}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium hover:bg-slate-800 shadow-md transition-all cursor-pointer font-sans text-sm"
              >
                <span>Read The Field Investigation</span>
                <ArrowDown className="w-4 h-4 text-amber-400" />
              </button>

              <Link
                to="/grid"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all cursor-pointer font-sans text-sm"
              >
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Explore 10 Hotspot Canyons</span>
              </Link>

              <Link
                to="/twin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 font-medium hover:bg-amber-200/80 shadow-sm transition-all cursor-pointer font-sans text-sm"
              >
                <Box className="w-4 h-4 text-amber-800" />
                <span>Launch 3D Twin</span>
              </Link>
            </motion.div>
          </div>

          {/* CRISP VISUAL PROOF: Overlapping Thermal Image Cards (Right Side, 5 Cols) */}
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
