import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, Sparkles, Zap, Eye, Volume2, VolumeX, Thermometer, ShieldCheck, Crosshair } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

interface Props {
  onScrollToProblem: () => void;
  onJumpToLive: () => void;
}

export const WowHero: React.FC<Props> = ({ onScrollToProblem, onJumpToLive }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const [flirMode, setFlirMode] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [spotTemp, setSpotTemp] = useState<number>(53.8);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = e.clientX / innerWidth;
      const normY = e.clientY / innerHeight;
      setMousePos({
        x: (normX - 0.5) * 50,
        y: (normY - 0.5) * 50,
        clientX: e.clientX,
        clientY: e.clientY,
      });

      // Calculate spot temperature based on cursor position
      // Lower Y (near bottom street level) is hotter (50 - 55°C)
      // Upper Y (inside penthouse) is chilled (20 - 24°C)
      const simulatedTemp = 20.5 + normY * 34.0 + (Math.sin(normX * 8) * 1.5);
      setSpotTemp(parseFloat(simulatedTemp.toFixed(1)));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleSound = () => {
    const playing = soundEngine.toggle();
    setIsAudioPlaying(playing);
  };

  return (
    <section
      ref={heroRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-hidden transition-colors duration-1000 ${
        flirMode ? 'bg-[#06040e]' : 'bg-[#040711]'
      }`}
    >
      {/* Dynamic FLIR Thermal Infrared Heat Matrix Simulation */}
      {flirMode ? (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Street Level 54°C Superheated Thermal Plume Gradient */}
          <div
            className="absolute bottom-0 inset-x-0 h-[65%] opacity-55 blur-[120px] transition-all duration-700 bg-gradient-to-t from-red-600 via-amber-500 to-transparent"
            style={{
              transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.5}px)`,
            }}
          />
          {/* Top Floor 20°C Chilled Penthouse Indigo Cold Basin */}
          <div className="absolute top-0 inset-x-0 h-[45%] opacity-40 blur-[130px] bg-gradient-to-b from-blue-700 via-indigo-900 to-transparent" />

          {/* FLIR Thermal False-Color Contours */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_70%_75%,#ef4444_0%,#f59e0b_35%,#3b82f6_65%,transparent_80%)]" />

          {/* FLIR Reticle / Optical Grain */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 bg-gradient-to-tr from-amber-600 via-red-600 to-transparent"
            style={{
              transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
              top: '20%',
              left: '25%',
            }}
          />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
      )}

      {/* Interactive Cursor Thermal Spot Meter HUD (Only active when inside hero) */}
      {isHovered && (
        <div
          className="pointer-events-none fixed z-40 hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/85 border border-slate-700/80 shadow-2xl backdrop-blur-md text-[10px] font-mono transition-transform duration-75"
          style={{
            left: `${mousePos.clientX + 16}px`,
            top: `${mousePos.clientY - 12}px`,
          }}
        >
          <Crosshair className={`w-3 h-3 animate-spin ${spotTemp > 45 ? 'text-red-400' : 'text-sky-400'}`} />
          <span className="text-slate-400">IR SPOT:</span>
          <span
            className={`font-bold ${
              spotTemp > 45 ? 'text-red-400' : spotTemp > 35 ? 'text-amber-400' : 'text-sky-400'
            }`}
          >
            {spotTemp}°C
          </span>
          <span className="text-slate-500 text-[9px]">
            {spotTemp > 45 ? '[EXHAUST PLUME]' : spotTemp < 25 ? '[CHILLED INTERIOR]' : '[STREET AMBIENT]'}
          </span>
        </div>
      )}

      {/* Top Floating Telemetry & Sensor Controls */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-white font-extrabold tracking-widest text-sm uppercase">USHMA-NETRA</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-semibold">TRACK 02: HEAT & WATER</span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">MICRO-THERMAL EQUITY AGENT</span>
        </div>

        <div className="flex items-center gap-3">
          {/* FLIR Mode Toggle */}
          <button
            onClick={() => setFlirMode(!flirMode)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
              flirMode
                ? 'bg-red-950/80 border-red-700/80 text-red-300 shadow-lg shadow-red-950/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle simulated FLIR Thermal Infrared spectrum"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>{flirMode ? 'FLIR False-Color: ACTIVE' : 'Thermal Vision: OFF'}</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle synthesized compressor drone soundscape"
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAudioPlaying ? 'Compressor Hum ON' : 'Audio Drone OFF'}</span>
          </button>

          {/* Jump directly to Live Twin */}
          <button
            onClick={onJumpToLive}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Launch Live Twin</span>
          </button>
        </div>
      </div>

      {/* Central Provocative Typographic Architecture */}
      <div className="relative z-10 my-auto max-w-5xl space-y-6 pt-8 pb-4">
        {/* Provocative Kicker with Clean Typography (Anti-Slop No-Pill) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 text-xs font-mono text-red-400"
        >
          <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">ANTHROPOGENIC CANYON INJUSTICE</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">THE AC EXHAUST "DEATH LOOP" IN INDIAN MEGACITIES</span>
        </motion.div>

        {/* Master Provocative Contrast Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] text-balance font-serif"
        >
          While the penthouse chills to 20°C,{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            the street below is actively baking at 54°C.
          </span>
        </motion.h1>

        {/* Core Scientific Briefing */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl font-light leading-relaxed"
        >
          Air conditioners do not destroy heat — they extract indoor heat and blast superheated 54°C exhaust directly into narrow street canyons at head height. We are artificially baking informal street workers so commercial buildings stay cool.
        </motion.p>

        {/* The 4-Pillar Pipeline Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono"
        >
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">STEP 01 // CV SCAN</div>
            <div className="font-bold text-white">SageMaker CV</div>
            <div className="text-[11px] text-slate-400 font-sans">Counts outdoor units & calculates kW load</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">STEP 02 // SATELLITE</div>
            <div className="font-bold text-sky-400">Landsat-9 Thermal</div>
            <div className="text-[11px] text-slate-400 font-sans">Maps micro-plume hitting adjacent street</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">STEP 03 // REASONING</div>
            <div className="font-bold text-amber-400">Bedrock Legal Agent</div>
            <div className="text-[11px] text-slate-400 font-sans">Computes Thermal Debt & ₹ Exhaust Tax</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">STEP 04 // MITIGATION</div>
            <div className="font-bold text-emerald-400">Section 133 Shield</div>
            <div className="text-[11px] text-slate-400 font-sans">Mandates skyward louvers & shade funds</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Quantitative Telemetry Bar & Investigation Button */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px] uppercase">UNMITIGATED AC EXHAUST</span>
            <span className="font-bold text-red-400 text-sm">53.6°C Direct Jet</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px] uppercase">STREET OVERHEAT DELTA</span>
            <span className="font-bold text-amber-400 text-sm">+6.6°C Artificial Trap</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px] uppercase">FIELD VALIDATED HUBS</span>
            <span className="font-bold text-emerald-400 text-sm">Delhi NCR & Bengaluru</span>
          </div>
        </div>

        <button
          onClick={onScrollToProblem}
          className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center gap-2.5 transition-all shadow-xl shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <span>Begin The Investigation</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
