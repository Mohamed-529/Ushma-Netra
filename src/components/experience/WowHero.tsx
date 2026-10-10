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
      className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-hidden bg-transparent transition-colors duration-1000"
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

        <div className="flex items-center gap-2.5">
          {/* FLIR Mode Toggle */}
          <button
            onClick={() => setFlirMode(!flirMode)}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              flirMode
                ? 'bg-red-950/40 border-red-500/40 text-red-300 shadow-sm'
                : 'bg-[#0c0d12]/80 border-zinc-800/40 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle simulated FLIR Thermal Infrared spectrum"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>{flirMode ? 'FLIR False-Color: ACTIVE' : 'Thermal Vision: OFF'}</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-[#0c0d12]/80 border-zinc-800/40 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle synthesized compressor drone soundscape"
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAudioPlaying ? 'Drone ON' : 'Audio OFF'}</span>
          </button>

          {/* Jump directly to Live Twin */}
          <button
            onClick={onJumpToLive}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold font-mono text-xs shadow-md shadow-amber-500/15 transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300"
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

        {/* Master Provocative Contrast Headline with Word Text-Masking Reveal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.045, delayChildren: 0.1 },
            },
          }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extralight text-zinc-100 tracking-tight leading-[1.08] text-balance font-sans"
        >
          {/* Word-masking staggered reveal */}
          {[
            { text: 'While', highlight: false },
            { text: 'the', highlight: false },
            { text: 'penthouse', highlight: false },
            { text: 'stays', highlight: false },
            { text: 'cool', highlight: false },
            { text: 'at', highlight: false },
            { text: '21°C,', highlight: 'sky' },
            { text: 'street', highlight: false },
            { text: 'vendors', highlight: false },
            { text: 'burn', highlight: 'red' },
            { text: 'under', highlight: false },
            { text: '54°C', highlight: 'amber' },
            { text: 'blast', highlight: 'red' },
            { text: 'jets.', highlight: 'red' },
          ].map((item, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.22em] pb-1 align-bottom">
              <motion.span
                variants={{
                  hidden: { y: '100%', opacity: 0 },
                  visible: {
                    y: '0%',
                    opacity: 1,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className={`inline-block ${
                  item.highlight === 'sky'
                    ? 'text-sky-400 font-normal'
                    : item.highlight === 'amber'
                    ? 'text-amber-400 font-semibold'
                    : item.highlight === 'red'
                    ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent font-semibold'
                    : 'text-zinc-100 font-light'
                }`}
              >
                {item.text}
              </motion.span>
            </span>
          ))}
        </motion.div>

        {/* Core Scientific Briefing */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-base sm:text-xl text-zinc-400 max-w-3xl font-light leading-relaxed tracking-normal"
        >
          Air conditioners do not destroy heat — they extract indoor warmth and blast superheated 54°C sensible exhaust directly into pedestrian alleys at face level. Ushma-Netra computes the invisible thermal debt, penalizes commercial violators, and autonomously protects informal street workers.
        </motion.p>

        {/* The 4-Pillar Pipeline Ribbon with Razor-Thin Kinetic Minimalist Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono"
        >
          <div className="p-3.5 rounded-xl bg-[#0c0d12]/75 border border-zinc-800/40 backdrop-blur-md space-y-1.5 hover:border-zinc-700/60 transition-all">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
              <span>STEP 01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="font-semibold text-zinc-200 font-mono">SageMaker CV</div>
            <div className="text-[11px] text-zinc-400 font-sans font-light">Counts facade condensers & computes heat load</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d12]/75 border border-zinc-800/40 backdrop-blur-md space-y-1.5 hover:border-zinc-700/60 transition-all">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
              <span>STEP 02</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            </div>
            <div className="font-semibold text-sky-400 font-mono">Landsat-9 Thermal</div>
            <div className="text-[11px] text-zinc-400 font-sans font-light">Maps canyon micro-plume hitting adjacent sidewalk</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d12]/75 border border-zinc-800/40 backdrop-blur-md space-y-1.5 hover:border-zinc-700/60 transition-all">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
              <span>STEP 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <div className="font-semibold text-amber-400 font-mono">Bedrock Legal Agent</div>
            <div className="text-[11px] text-zinc-400 font-sans font-light">Assesses Thermal Debt & assesses statutory ₹ Tax</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d12]/75 border border-zinc-800/40 backdrop-blur-md space-y-1.5 hover:border-zinc-700/60 transition-all">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
              <span>STEP 04</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="font-semibold text-emerald-400 font-mono">Section 133 Shield</div>
            <div className="text-[11px] text-zinc-400 font-sans font-light">Enforces skyward louvers & hydration re-routing</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Quantitative Telemetry Bar & Investigation Button */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800/40">
        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-mono">
          <div className="space-y-0.5">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">UNMITIGATED AC EXHAUST</span>
            <span className="font-semibold text-red-400 text-sm">53.6°C Direct Jet</span>
          </div>
          <div className="h-6 w-px bg-zinc-800/60 hidden sm:block" />
          <div className="space-y-0.5">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">STREET OVERHEAT DELTA</span>
            <span className="font-semibold text-amber-400 text-sm">+6.6°C Artificial Trap</span>
          </div>
          <div className="h-6 w-px bg-zinc-800/60 hidden sm:block" />
          <div className="space-y-0.5">
            <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">FIELD VALIDATED HUBS</span>
            <span className="font-semibold text-emerald-400 text-sm">Delhi NCR & Bengaluru</span>
          </div>
        </div>

        <button
          onClick={onScrollToProblem}
          className="group px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 border border-zinc-200"
        >
          <span>Begin The Investigation</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
