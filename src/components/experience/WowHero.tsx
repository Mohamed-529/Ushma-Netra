import React, { useState, useEffect } from 'react';
import { ThermalContrastCards } from './ThermalContrastCards';
import { FluidThermalPlumeMesh } from './FluidThermalPlumeMesh';
import { ArrowDown, Waves, Camera } from 'lucide-react';

interface Props {
  onScrollToProblem: () => void;
  onJumpToLive: () => void;
  isIntroRevealed?: boolean;
  onTypingComplete?: () => void;
  onReplayIntro?: () => void;
  replayTrigger?: number;
}

const IMPACT_LINE_1 = 'Mapping 54°C AC waste heat dumping';
const IMPACT_LINE_2 = "to protect India's street workers in real time.";
const TOTAL_CHARS = IMPACT_LINE_1.length + IMPACT_LINE_2.length;

// Subtle floating thermal particles that fade in once typing finishes
const HERO_FLOATING_PARTICLES = [
  { id: 1, left: '8%', top: '18%', size: 'w-2.5 h-2.5', color: 'bg-sky-400/45', duration: '6s', delay: '0s' },
  { id: 2, left: '16%', top: '72%', size: 'w-3 h-3', color: 'bg-amber-400/45', duration: '7.5s', delay: '0.4s' },
  { id: 3, left: '28%', top: '14%', size: 'w-2 h-2', color: 'bg-rose-400/40', duration: '5.5s', delay: '0.8s' },
  { id: 4, left: '74%', top: '16%', size: 'w-2.5 h-2.5', color: 'bg-indigo-400/40', duration: '6.8s', delay: '0.2s' },
  { id: 5, left: '88%', top: '26%', size: 'w-3.5 h-3.5', color: 'bg-amber-500/35', duration: '8s', delay: '0.6s' },
  { id: 6, left: '82%', top: '68%', size: 'w-2 h-2', color: 'bg-emerald-400/40', duration: '6.2s', delay: '1.1s' },
];

export const WowHero: React.FC<Props> = ({
  isIntroRevealed = true,
  onTypingComplete,
  replayTrigger = 0,
}) => {
  const [activeVisualMode, setActiveVisualMode] = useState<'3d_plume' | 'camera_hud'>('3d_plume');
  const [typedChars, setTypedChars] = useState<number>(0);

  useEffect(() => {
    setTypedChars(0);
    let current = 0;

    const interval = window.setInterval(() => {
      current += 1;
      setTypedChars(current);

      if (current >= TOTAL_CHARS) {
        window.clearInterval(interval);
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    }, 38);

    return () => window.clearInterval(interval);
  }, [replayTrigger, onTypingComplete]);

  const renderedLine1 = IMPACT_LINE_1.slice(0, Math.min(typedChars, IMPACT_LINE_1.length));
  const renderedLine2 =
    typedChars > IMPACT_LINE_1.length
      ? IMPACT_LINE_2.slice(0, typedChars - IMPACT_LINE_1.length)
      : '';
  const isCursorOnLine1 = typedChars <= IMPACT_LINE_1.length && typedChars < TOTAL_CHARS;

  const handleInteractWithImpact = () => {
    const target = document.getElementById('hero-plume-interactive');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-10 pb-14 overflow-hidden bg-transparent text-white selection:bg-amber-500/30 selection:text-white">
      {/* Floating Background Particles — Hidden (opacity-0) until typewriter completes */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {HERO_FLOATING_PARTICLES.map((p) => (
          <span
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
            className={`absolute rounded-full ${p.size} ${p.color} animate-pulse-glow`}
          />
        ))}
      </div>

      {/* =============================================================== */}
      {/* 1. CLEAN IMPACT STATEMENT & ONE RELATED INTERACTION BUTTON      */}
      {/* =============================================================== */}
      <div className="relative z-20 my-auto w-full py-8 lg:py-12 space-y-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Single Clear Impact Headline (Typewriter + Blinking Cursor) on #12161A Dark Canvas */}
          <div className="min-h-[110px] sm:min-h-[140px] flex items-center justify-center">
            <h1
              aria-label={`${IMPACT_LINE_1} ${IMPACT_LINE_2}`}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] font-sans text-balance"
            >
              <span className="block">
                {renderedLine1}
                {isCursorOnLine1 && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-[3px] sm:w-[4px] h-[0.88em] bg-amber-400 ml-1.5 align-baseline translate-y-[2px] animate-cursor-blink"
                  />
                )}
              </span>
              <span className="block text-amber-400 mt-1.5">
                {renderedLine2}
                {!isCursorOnLine1 && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-[3px] sm:w-[4px] h-[0.88em] bg-white ml-1.5 align-baseline translate-y-[2px] animate-cursor-blink"
                  />
                )}
              </span>
            </h1>
          </div>

          {/* ONE Main Button to Interact Directly with the Impact Statement */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isIntroRevealed
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <button
              onClick={handleInteractWithImpact}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-[#F3F4F6] text-[#111827] font-bold text-base shadow-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Inspect Live Street Canyon Plume</span>
              <ArrowDown className="w-4 h-4 text-[#a8321a]" />
            </button>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. INTERACTIVE 3D THERMAL PLUME PROOF                           */}
        {/* =============================================================== */}
        <div
          id="hero-plume-interactive"
          className={`max-w-5xl mx-auto w-full space-y-3 transition-all duration-1000 delay-150 ease-out ${
            isIntroRevealed
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="w-full flex items-center justify-between px-1 text-xs font-mono">
            <span className="text-xs text-slate-300 font-semibold">
              Live Canyon Plume &amp; Deflector Simulation
            </span>
            <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#E5E7EB] shadow-md">
              <button
                onClick={() => setActiveVisualMode('3d_plume')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeVisualMode === '3d_plume'
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>3D Fluid Plume</span>
              </button>
              <button
                onClick={() => setActiveVisualMode('camera_hud')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeVisualMode === 'camera_hud'
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Thermal HUD</span>
              </button>
            </div>
          </div>

          {activeVisualMode === '3d_plume' ? (
            <FluidThermalPlumeMesh className="w-full" />
          ) : (
            <ThermalContrastCards className="w-full" />
          )}
        </div>
      </div>
    </section>
  );
};
