import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ThermalContrastCards } from './ThermalContrastCards';
import { FluidThermalPlumeMesh } from './FluidThermalPlumeMesh';
import { ArrowDown, Box, Waves, Camera, Download, RotateCcw } from 'lucide-react';

interface Props {
  onScrollToProblem: () => void;
  onJumpToLive: () => void;
  isIntroRevealed?: boolean;
  onTypingComplete?: () => void;
  onReplayIntro?: () => void;
}

type HeadlinePreset = 'antigravity' | 'ushma_netra';

const HEADLINE_PRESETS: Record<
  HeadlinePreset,
  { line1: string; line2: string; subtitle: string }
> = {
  antigravity: {
    line1: 'Experience liftoff with',
    line2: 'the next-gen agent platform',
    subtitle:
      'Autonomous multi-agent orchestration for urban micro-thermal telemetry, 3D fluid dynamics, and real-time civic actuation.',
  },
  ushma_netra: {
    line1: 'The affluent stay cool.',
    line2: 'The streets are actively baking.',
    subtitle:
      "Air conditioners don't destroy heat—they dump blistering 54°C exhaust directly onto informal street workers. Ushma-Netra quantifies this hidden thermal dumping to protect vulnerable citizens.",
  },
};

// Floating background particles inside the Hero container that fade in after typing completes
const HERO_FLOATING_PARTICLES = [
  { id: 1, left: '8%', top: '18%', size: 'w-2.5 h-2.5', color: 'bg-sky-500/50', duration: '6s', delay: '0s' },
  { id: 2, left: '16%', top: '72%', size: 'w-3 h-3', color: 'bg-amber-500/50', duration: '7.5s', delay: '0.4s' },
  { id: 3, left: '28%', top: '14%', size: 'w-2 h-2', color: 'bg-rose-500/45', duration: '5.5s', delay: '0.8s' },
  { id: 4, left: '74%', top: '16%', size: 'w-2.5 h-2.5', color: 'bg-indigo-500/45', duration: '6.8s', delay: '0.2s' },
  { id: 5, left: '88%', top: '26%', size: 'w-3.5 h-3.5', color: 'bg-amber-600/40', duration: '8s', delay: '0.6s' },
  { id: 6, left: '82%', top: '68%', size: 'w-2 h-2', color: 'bg-emerald-500/45', duration: '6.2s', delay: '1.1s' },
  { id: 7, left: '62%', top: '82%', size: 'w-2.5 h-2.5', color: 'bg-sky-600/40', duration: '7.2s', delay: '0.3s' },
  { id: 8, left: '44%', top: '12%', size: 'w-2 h-2', color: 'bg-[#a8321a]/45', duration: '5.8s', delay: '0.9s' },
];

export const WowHero: React.FC<Props> = ({
  onScrollToProblem,
  isIntroRevealed = true,
  onTypingComplete,
  onReplayIntro,
}) => {
  const [activeVisualMode, setActiveVisualMode] = useState<'3d_plume' | 'camera_hud'>('3d_plume');
  const [preset, setPreset] = useState<HeadlinePreset>('antigravity');
  const [typedChars, setTypedChars] = useState<number>(0);
  const [runId, setRunId] = useState<number>(0);

  const currentCopy = HEADLINE_PRESETS[preset];
  const fullLength = currentCopy.line1.length + currentCopy.line2.length;

  // Typewriter character-by-character effect
  useEffect(() => {
    setTypedChars(0);
    let current = 0;

    const interval = window.setInterval(() => {
      current += 1;
      setTypedChars(current);

      if (current >= fullLength) {
        window.clearInterval(interval);
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    }, 42);

    return () => window.clearInterval(interval);
  }, [preset, fullLength, runId, onTypingComplete]);

  const handleReplay = useCallback(
    (nextPreset?: HeadlinePreset) => {
      if (nextPreset && nextPreset !== preset) {
        setPreset(nextPreset);
      }
      if (onReplayIntro) {
        onReplayIntro();
      }
      setRunId((prev) => prev + 1);
    },
    [preset, onReplayIntro]
  );

  const handleDownloadSpec = () => {
    const content = `USHMA-NETRA // NEXT-GEN AUTONOMOUS AGENT PLATFORM
====================================================
Headline: ${currentCopy.line1} ${currentCopy.line2}
Generated: ${new Date().toISOString()}
Modules:
1. National Thermal Grid Registry (/grid)
2. 6-Stage Autonomous Pipeline (/how-it-works)
3. Scientific Thermodynamic Methodology (/methodology)
4. Heat Surge Early Warning Watchlist (/watchlist)
5. Municipal Section 133 Debt Ledger (/ledger)
6. 3D WebGL CFD Digital Twin Lab (/twin)
7. AI Façade Computer Vision Scanner (/scanner)
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ushma-netra-agent-platform.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderedLine1 = currentCopy.line1.slice(0, Math.min(typedChars, currentCopy.line1.length));
  const renderedLine2 =
    typedChars > currentCopy.line1.length
      ? currentCopy.line2.slice(0, typedChars - currentCopy.line1.length)
      : '';
  const isCursorOnLine1 = typedChars <= currentCopy.line1.length && typedChars < fullLength;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-8 pb-12 overflow-hidden bg-transparent text-[#0b1b2d] selection:bg-amber-900/20 selection:text-[#0b1b2d]">
      {/* Floating Background Particles Layer — Hidden (opacity-0) until typewriter completes */}
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
      {/* 1. CENTERED ANCHOR STAGE: TYPEWRITER HEADLINE + CENTERED CTA */}
      {/* On page load, ONLY the two-line headline is visible (opacity-100) */}
      {/* =============================================================== */}
      <div className="relative z-20 my-auto w-full py-6 lg:py-10 space-y-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Headline Mode & Replay Controls — Hidden until typewriter completes */}
          <div
            className={`flex flex-wrap items-center justify-center gap-3 text-xs font-mono transition-all duration-1000 ease-out ${
              isIntroRevealed
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1 bg-[#efe8dc] p-1 rounded-lg border border-[#d6cebe]">
              <button
                onClick={() => handleReplay('antigravity')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  preset === 'antigravity'
                    ? 'bg-[#0b1b2d] text-white shadow-xs'
                    : 'text-[#0b1b2d]/70 hover:text-[#0b1b2d]'
                }`}
              >
                Antigravity Headline
              </button>
              <button
                onClick={() => handleReplay('ushma_netra')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  preset === 'ushma_netra'
                    ? 'bg-[#0b1b2d] text-white shadow-xs'
                    : 'text-[#0b1b2d]/70 hover:text-[#0b1b2d]'
                }`}
              >
                Thermal Equity Headline
              </button>
            </div>

            <button
              onClick={() => handleReplay()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Replay initial typewriter and full page reveal animation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#a8321a]" />
              <span>Replay Intro</span>
            </button>
          </div>

          {/* TWO-LINE MAIN HERO HEADLINE — Always opacity-100 on page load */}
          <div className="min-h-[120px] sm:min-h-[150px] flex items-center justify-center">
            <h1
              aria-label={`${currentCopy.line1} ${currentCopy.line2}`}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0b1b2d] tracking-tight leading-[1.12] font-sans text-balance"
            >
              <span className="block">
                {renderedLine1}
                {isCursorOnLine1 && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-[3px] sm:w-[4px] h-[0.88em] bg-[#a8321a] ml-1.5 align-baseline translate-y-[2px] animate-cursor-blink"
                  />
                )}
              </span>
              <span className="block text-[#a8321a] mt-1">
                {renderedLine2}
                {!isCursorOnLine1 && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-[3px] sm:w-[4px] h-[0.88em] bg-[#0b1b2d] ml-1.5 align-baseline translate-y-[2px] animate-cursor-blink"
                  />
                )}
              </span>
            </h1>
          </div>

          {/* Supporting Description — Fades in smoothly after final character */}
          <p
            className={`text-base sm:text-lg text-[#1f3044] font-normal leading-relaxed max-w-2xl mx-auto font-sans transition-all duration-1000 ease-out ${
              isIntroRevealed
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            {currentCopy.subtitle}
          </p>

          {/* Centered "Download" CTA & Secondary Actions — Fades in smoothly after final character */}
          <div
            className={`pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 transition-all duration-1000 ease-out ${
              isIntroRevealed
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <button
              onClick={handleDownloadSpec}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b1b2d] text-white font-semibold hover:bg-[#1b2f47] shadow-md hover:shadow-lg transition-all cursor-pointer font-sans text-sm whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download</span>
            </button>

            <button
              onClick={onScrollToProblem}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#efe8dc] border border-[#d6cebe] text-[#0b1b2d] font-semibold hover:bg-[#e4dcce] hover:border-[#b8ad9d] shadow-xs transition-all cursor-pointer font-sans text-sm whitespace-nowrap shrink-0"
            >
              <span>Read The Field Investigation</span>
              <ArrowDown className="w-4 h-4 text-[#a8321a]" />
            </button>

            <Link
              to="/twin"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#efe8dc] border border-[#d6cebe] text-[#0b1b2d] font-semibold hover:bg-[#e4dcce] hover:border-[#b8ad9d] shadow-xs transition-all cursor-pointer font-sans text-sm whitespace-nowrap shrink-0"
            >
              <Box className="w-4 h-4 text-[#a8321a]" />
              <span>Launch 3D Digital Twin</span>
            </Link>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. THE VISUAL WEAPON: THE FLUID 3D THERMAL PLUME SHADER */}
        {/* Smoothly revealed once headline typewriter finishes */}
        {/* =============================================================== */}
        <div
          className={`max-w-5xl mx-auto w-full space-y-3 transition-all duration-1000 delay-150 ease-out ${
            isIntroRevealed
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Visual Mode Selector Tabs */}
          <div className="w-full flex items-center justify-between px-1 text-xs font-mono">
            <span className="text-[11px] uppercase tracking-wider text-[#0b1b2d]/60 font-bold">
              Dynamic Thermodynamic Proof
            </span>
            <div className="flex items-center gap-1 bg-[#efe8dc] p-1 rounded-xl border border-[#d6cebe]">
              <button
                onClick={() => setActiveVisualMode('3d_plume')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
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

          {activeVisualMode === '3d_plume' ? (
            <FluidThermalPlumeMesh className="w-full" />
          ) : (
            <ThermalContrastCards className="w-full" />
          )}
        </div>
      </div>

      {/* Subtle Grounding Editorial Footnote — Fades in after typewriter completes */}
      <div
        className={`relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#0b1b2d]/70 font-mono border-t border-[#d6cebe] gap-2 transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="font-semibold text-[#0b1b2d]">
          MONITORED ACROSS 10 URBAN HEAT CANYONS IN INDIA
        </div>
        <div className="text-[11px] text-[#0b1b2d]/60">
          SATELLITE THERMAL INFRARED · EDGE COMPUTER VISION · MUNICIPAL HEAT PENALTIES
        </div>
      </div>
    </section>
  );
};
