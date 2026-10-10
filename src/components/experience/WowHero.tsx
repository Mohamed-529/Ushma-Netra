import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ThermalContrastCards } from './ThermalContrastCards';
import { FluidThermalPlumeMesh } from './FluidThermalPlumeMesh';
import { ArrowRight, ArrowDown, Box, Waves, Camera } from 'lucide-react';

interface Props {
  onScrollToProblem: () => void;
  onJumpToLive: () => void;
}

export const WowHero: React.FC<Props> = ({ onScrollToProblem, onJumpToLive }) => {
  const [activeVisualMode, setActiveVisualMode] = useState<'3d_plume' | 'camera_hud'>('3d_plume');

  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-8 pb-12 overflow-hidden bg-[#e6dfd3] text-[#0b1b2d] selection:bg-amber-900/20 selection:text-[#0b1b2d]">
      {/* =============================================================== */}
      {/* 1. THE HERO FOLD: HUMAN EMOTION OVER TECHNICAL DATA */}
      {/* Extreme simplicity on the first fold: No data grids, no status bars */}
      {/* =============================================================== */}
      <div className="relative z-20 my-auto w-full py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* MASSIVE TYPOGRAPHY HIERARCHY (Left Side, 7 Cols) */}
          <div className="lg:col-span-7 space-y-7">
            {/* Powerful Contrast Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0b1b2d] tracking-tight leading-[1.08] font-sans"
            >
              The affluent stay cool.{' '}
              <span className="text-[#a8321a] block sm:inline">
                The streets are actively baking.
              </span>
            </motion.h1>

            {/* Standard, Clean Human Story Description Block */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg sm:text-xl text-[#1f3044] font-normal leading-relaxed max-w-2xl font-sans"
            >
              Air conditioners don't destroy heat—they dump blistering 54°C exhaust directly onto informal street workers. Ushma-Netra quantifies this hidden thermal dumping to protect vulnerable citizens.
            </motion.p>

            {/* High-Contrast Human Action Controls */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono"
            >
              <button
                onClick={onScrollToProblem}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0b1b2d] text-white font-medium hover:bg-[#1b2f47] shadow-md hover:shadow-lg transition-all cursor-pointer font-sans text-sm"
              >
                <span>Read The Field Investigation</span>
                <ArrowDown className="w-4 h-4 text-amber-300" />
              </button>

              <Link
                to="/twin"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#efe8dc] border border-[#d6cebe] text-[#0b1b2d] font-bold hover:bg-[#e4dcce] hover:border-[#b8ad9d] shadow-sm transition-all cursor-pointer font-sans text-sm"
              >
                <Box className="w-4 h-4 text-[#a8321a]" />
                <span>Launch 3D Digital Twin</span>
              </Link>
            </motion.div>
          </div>

          {/* =============================================================== */}
          {/* 2. THE VISUAL WEAPON: THE FLUID 3D THERMAL PLUME SHADER */}
          {/* Real-time WebGL mesh that dynamically morphs on louver toggle */}
          {/* =============================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center w-full space-y-3"
          >
            {/* Visual Mode Selector Tabs */}
            <div className="w-full flex items-center justify-between px-1 text-xs font-mono">
              <span className="text-[11px] uppercase tracking-wider text-[#0b1b2d]/60 font-bold">
                Dynamic Thermodynamic Proof
              </span>
              <div className="flex items-center gap-1 bg-[#efe8dc] p-1 rounded-xl border border-[#d6cebe]">
                <button
                  onClick={() => setActiveVisualMode('3d_plume')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeVisualMode === '3d_plume'
                      ? 'bg-[#0b1b2d] text-white shadow-sm'
                      : 'text-[#0b1b2d]/70 hover:text-[#0b1b2d]'
                  }`}
                >
                  <Waves className="w-3 h-3" />
                  <span>3D Fluid Plume</span>
                </button>
                <button
                  onClick={() => setActiveVisualMode('camera_hud')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeVisualMode === 'camera_hud'
                      ? 'bg-[#0b1b2d] text-white shadow-sm'
                      : 'text-[#0b1b2d]/70 hover:text-[#0b1b2d]'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Thermal HUD</span>
                </button>
              </div>
            </div>

            {/* Mode 1: 3D Fluid Plume Mesh (Custom Shader React Three Fiber) */}
            {activeVisualMode === '3d_plume' ? (
              <FluidThermalPlumeMesh className="w-full" />
            ) : (
              <ThermalContrastCards className="w-full" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Subtle Grounding Editorial Footnote */}
      <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#0b1b2d]/70 font-mono border-t border-[#d6cebe] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#a8321a]" />
          <span className="font-semibold text-[#0b1b2d]">MONITORED ACROSS 10 URBAN HEAT CANYONS IN INDIA</span>
        </div>
        <div className="text-[11px] text-[#0b1b2d]/60">
          SATELLITE THERMAL INFRARED · EDGE COMPUTER VISION · MUNICIPAL HEAT PENALTIES
        </div>
      </div>
    </section>
  );
};
