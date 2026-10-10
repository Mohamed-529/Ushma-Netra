import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Snowflake, ArrowDown, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

interface ThermalContrastCardsProps {
  className?: string;
  onExploreDisparity?: () => void;
}

export const ThermalContrastCards: React.FC<ThermalContrastCardsProps> = ({
  className = '',
  onExploreDisparity,
}) => {
  const [activeHover, setActiveHover] = useState<'card1' | 'card2' | null>(null);

  return (
    <div className={`relative w-full max-w-lg mx-auto select-none ${className}`}>
      {/* Decorative subtle ambient heat plume background aura */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/40 via-red-200/30 to-sky-200/30 rounded-3xl blur-2xl pointer-events-none -z-10" />

      {/* Layered Cards Staging Area (Aspect-ratio matched to the reference layout) */}
      <div className="relative h-[480px] sm:h-[520px] w-full flex items-center justify-center">

        {/* =============================================================== */}
        {/* CARD 1 (BACKGROUND): 21°C Indoor Comfort (Minimalist Tower Architecture) */}
        {/* =============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: activeHover === 'card1' ? 0 : -2,
            scale: activeHover === 'card1' ? 1.03 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onMouseEnter={() => setActiveHover('card1')}
          onMouseLeave={() => setActiveHover(null)}
          className="absolute top-2 left-2 sm:left-4 w-[78%] sm:w-[80%] rounded-2xl bg-white border border-slate-200/90 shadow-xl overflow-hidden z-10 transition-shadow duration-300 hover:shadow-2xl"
        >
          {/* Top Camera Inspection Header Bar */}
          <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-sky-800 font-bold">
              <Snowflake className="w-3.5 h-3.5 text-sky-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span>ZONE 01: INDOOR COMFORT</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              21°C CHILLED
            </div>
          </div>

          {/* Clean, Crisp Minimalist Building Wireframe Graphic */}
          <div className="relative p-5 bg-gradient-to-b from-slate-50 via-white to-sky-50/30">
            {/* Minimalist Corporate Tower Illustration with Cool Air currents */}
            <div className="h-44 sm:h-48 w-full rounded-xl bg-slate-50 border border-slate-150 p-4 relative overflow-hidden flex flex-col justify-between">
              {/* Geometric Architectural Grid Line Art */}
              <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#0284c7_1px,transparent_1px),linear-gradient(to_bottom,#0284c7_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Chilled Air Flow Wave Patterns */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="coolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d="M10,35 Q80,15 150,35 T300,30"
                  fill="none"
                  stroke="url(#coolGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />
                <path
                  d="M10,80 Q90,60 170,80 T320,75"
                  fill="none"
                  stroke="url(#coolGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />
                <path
                  d="M10,125 Q100,105 190,125 T340,120"
                  fill="none"
                  stroke="url(#coolGrad)"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </svg>

              {/* Minimalist Tower Glass Floor Slices */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>PENTHOUSE SUITE L-42</span>
                  <span className="text-sky-700 font-semibold font-mono">HVAC ACTIVE</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-9 rounded bg-sky-100/70 border border-sky-200/80 flex items-center justify-center text-[10px] font-mono font-medium text-sky-800"
                    >
                      21.0°
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-label */}
              <div className="relative z-10 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-200/80">
                <span>SEALED CURTAIN WALL</span>
                <span className="text-sky-600 font-medium">99.4% REJECTION EFFICIENCY</span>
              </div>
            </div>

            {/* Explanatory Caption */}
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 font-sans leading-tight">
              <span className="font-semibold text-slate-800">Private Sanctuaries:</span>
              <span>Fully climate-conditioned interiors running continuous sub-21°C chill zones.</span>
            </div>
          </div>
        </motion.div>


        {/* =============================================================== */}
        {/* CARD 2 (FOREGROUND OVERLAPPING): 54°C Pedestrian Furnace (FLIR Exhaust Camera) */}
        {/* =============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 3 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: activeHover === 'card2' ? 0 : 3,
            scale: activeHover === 'card2' ? 1.04 : 1,
          }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          onMouseEnter={() => setActiveHover('card2')}
          onMouseLeave={() => setActiveHover(null)}
          className="absolute bottom-2 right-1 sm:right-3 w-[84%] sm:w-[85%] rounded-2xl bg-white border-2 border-red-500/80 shadow-2xl overflow-hidden z-20 transition-all duration-300 hover:shadow-red-500/20"
        >
          {/* Top FLIR Camera HUD Header Bar */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white flex items-center justify-between text-xs font-mono shadow-sm">
            <div className="flex items-center gap-1.5 font-black tracking-wider">
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>ZONE 02: STREET CANYON FURNACE</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-[11px] border border-white/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
              54°C EXHAUST
            </div>
          </div>

          {/* High-Contrast Thermal Red/Orange Visualization */}
          <div className="relative p-5 bg-gradient-to-b from-white via-orange-50/40 to-red-50/60">
            {/* Thermal Camera Viewport */}
            <div className="h-48 sm:h-52 w-full rounded-xl bg-slate-950 p-4 relative overflow-hidden flex flex-col justify-between border border-red-950 shadow-inner">
              {/* FLIR Pseudocolor Thermal Gradient Mesh Simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/90 via-red-600/80 to-purple-950/95 opacity-90" />

              {/* Heat Plume Turbulences (Simulating 54°C Jet Dump) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M120,10 C150,50 90,80 140,130 C190,170 240,160 280,210"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="blur-[2px]"
                />
                <path
                  d="M160,20 C180,60 130,90 170,140 C210,180 230,170 260,210"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="blur-[4px]"
                />
              </svg>

              {/* Thermal Inspection Crosshairs & Telemetry HUD */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-yellow-150 text-shadow">
                <span className="flex items-center gap-1 font-bold text-yellow-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  <Thermometer className="w-3 h-3" />
                  HOTSPOT DETECTED
                </span>
                <span className="text-white/90 bg-red-950/80 px-2 py-0.5 rounded font-mono font-bold border border-red-800">
                  +33°C THERMAL DELTA
                </span>
              </div>

              {/* Center Crosshair with Exact 54.2°C Marker */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="px-3 py-1.5 rounded-lg bg-black/75 border border-yellow-400/80 text-center shadow-lg backdrop-blur-md">
                  <div className="text-[10px] font-mono uppercase text-yellow-400 font-bold">
                    AC Condenser Plume
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none tracking-tight">
                    54.2°C
                  </div>
                  <div className="text-[9px] font-mono text-red-300 font-semibold mt-0.5">
                    CRITICAL STREET VENDOR DUMP
                  </div>
                </div>
              </div>

              {/* Thermal Scale Footer Legend */}
              <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] font-mono text-white/90 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-16 rounded bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600 border border-white/30" />
                  <span>21°C ➔ 54°C</span>
                </div>
                <span className="text-yellow-300 font-bold">14 VENDORS EXPOSED</span>
              </div>
            </div>

            {/* Explanatory Caption */}
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-700 font-sans leading-tight">
              <span className="font-bold text-red-600">The Human Toll:</span>
              <span>Blistering 54°C air conditioning exhaust streams crash straight down onto sidewalk workers.</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Micro-Badge */}
      <div className="mt-2 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-mono shadow-md border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-slate-300">Thermal Injustice:</span>
          <span className="text-amber-400 font-bold">+33.2°C Disparity</span>
          <span className="text-slate-400">between Penthouse &amp; Pavement</span>
        </div>
      </div>
    </div>
  );
};
