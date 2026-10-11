import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Pause,
  Play,
  RotateCcw,
  Thermometer,
  Wind,
  AlertTriangle,
  Scan,
  Scale,
  Radio,
  Box,
  MapPin,
  ShieldCheck,
  Flame,
  Volume2,
  ArrowUpRight,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

interface FastTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_DURATION_MS = 30000; // 30.0s fast showcase

export const FastTrailerModal: React.FC<FastTrailerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [runKey, setRunKey] = useState<number>(0);

  // Accurate high-resolution clock refs so Restart and step jumps reset immediately
  const elapsedRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const handleRestart = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundEngine.playTone(580, 'sine', 0.12);
    elapsedRef.current = 0;
    lastTickTimeRef.current = performance.now();
    setElapsedMs(0);
    setIsPaused(false);
    setRunKey((prev) => prev + 1);
  }, []);

  const jumpToTimeMs = useCallback((targetMs: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION_MS, targetMs));
    elapsedRef.current = clamped;
    lastTickTimeRef.current = performance.now();
    setElapsedMs(clamped);
    setIsPaused(false);
  }, []);

  // Reset timeline whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      elapsedRef.current = 0;
      lastTickTimeRef.current = null;
      setElapsedMs(0);
      setIsPaused(false);
      return;
    }
    elapsedRef.current = 0;
    lastTickTimeRef.current = performance.now();
    setElapsedMs(0);
    setIsPaused(false);
    soundEngine.playTone(540, 'sine', 0.14);
  }, [isOpen]);

  // Smooth requestAnimationFrame clock loop tied to performance.now()
  useEffect(() => {
    if (!isOpen || isPaused) {
      lastTickTimeRef.current = null;
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    lastTickTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (lastTickTimeRef.current === null) {
        lastTickTimeRef.current = now;
      }
      const delta = Math.max(0, now - lastTickTimeRef.current);
      lastTickTimeRef.current = now;

      const nextElapsed = Math.min(TOTAL_DURATION_MS, elapsedRef.current + delta);
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);

      if (nextElapsed < TOTAL_DURATION_MS) {
        rafIdRef.current = window.requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isOpen, isPaused, runKey]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, handleRestart]);

  if (!isOpen) return null;

  const sec = elapsedMs / 1000;
  const remainingSec = Math.max(0, Math.ceil(30 - sec));

  // Custom Ushma-Netra Editing Sequence:
  // Scene 1 (0.0s - 4.0s): Thermal Split Contrast (21°C Indoor Comfort vs 54.2°C Sidewalk Exhaust Blast)
  // Scene 2 (4.0s - 22.0s): 5 Alternating Half-Bleed Screen Reels (~3.6s each) with angled/cropped edge-bleeding UI frames
  // Scene 3 (22.0s - 26.2s): The 3-Pillar Closed Loop Summary (Near the end)
  // Scene 4 (26.2s - 30.0s): Live National Impact Counter + Ushma-Netra Thermal Eye Finale
  const reelDuration = (22.0 - 4.0) / 5; // 3.6s per screen reel
  const activeReelIdx = Math.min(4, Math.max(0, Math.floor((sec - 4.0) / reelDuration)));

  // Animated counter for Scene 4 (26.2s -> 30.0s)
  const finaleProgress = Math.min(1, Math.max(0, (sec - 26.2) / 1.8));
  const animatedKwTracked = (0.4 + finaleProgress * 1.73).toFixed(2); // 2.13 MW
  const animatedFundInr = Math.round(120000 + finaleProgress * 496500); // ₹6,16,500

  const halfScreenReels = [
    {
      step: '01',
      tag: 'SCREEN 1 · THERMAL GRID REGISTRY',
      route: '/grid · Delhi, Mumbai, Bengaluru',
      side: 'right' as const,
      headline: 'Pinpoint every street canyon trapping AC waste heat.',
      caption: 'Satellite thermal infrared + street geometry ranks India’s hottest commercial alleys.',
      croppedView: (
        <div className="space-y-4">
          {/* Cropped Half-Screen Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
              <MapPin className="w-4 h-4" />
              <span>NATIONAL THERMAL GRID // TOP HOTSPOTS</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[11px] font-bold">
              +6.6°C Peak Delta
            </span>
          </div>

          {/* Cropped Half-Cards Bleeding off Right Edge */}
          <div className="space-y-2.5 pr-0 -mr-10">
            {[
              { name: 'Vikas Marg Commercial Complex', city: 'Delhi NCR · 6.8m Alley', plume: '47.8°C Plume', score: '92/100 Debt' },
              { name: 'Nehru Place IT Tower Block B', city: 'Delhi NCR · 7.2m Alley', plume: '46.9°C Plume', score: '88/100 Debt' },
              { name: 'Zaveri Bazaar Bullion Arcade', city: 'Mumbai · 5.4m Alley', plume: '45.6°C Plume', score: '85/100 Debt' },
            ].map((b) => (
              <div
                key={b.name}
                className="p-3.5 rounded-l-2xl bg-[#11192b] border-l-4 border-l-rose-500 border-y border-slate-800 flex items-center justify-between text-white"
              >
                <div>
                  <div className="text-sm font-bold">{b.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{b.city}</div>
                </div>
                <div className="text-right pr-8 font-mono">
                  <div className="text-sm font-bold text-amber-400">{b.plume}</div>
                  <div className="text-[11px] text-rose-400">{b.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      step: '02',
      tag: 'SCREEN 2 · AI FAÇADE CV SCANNER',
      route: '/scanner · YOLOv8-Thermal Edge',
      side: 'left' as const,
      headline: 'Count outdoor AC condensers on any building wall.',
      caption: 'Edge camera vision flags Split ACs and VRF units to compute exact kilowatt heat dumping.',
      croppedView: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-sky-400 font-bold flex items-center gap-1.5">
              <Scan className="w-4 h-4" />
              <span>YOLOv8 FACADE DETECTION // 97.4% mAP</span>
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">70 Units Flagged</span>
          </div>

          {/* Cropped Bounding Box Matrix Bleeding Left */}
          <div className="grid grid-cols-3 gap-3 -ml-8 pl-4">
            {[
              { id: 'SPLIT-12', temp: '53.9°C', kw: '5.2 kW', color: 'border-rose-500 bg-rose-950/30' },
              { id: 'SPLIT-27', temp: '54.4°C', kw: '6.8 kW', color: 'border-rose-500 bg-rose-950/30' },
              { id: 'VRF-STACK', temp: '56.1°C', kw: '42.0 kW', color: 'border-amber-400 bg-amber-950/30' },
            ].map((u) => (
              <div key={u.id} className={`p-3 rounded-xl border-2 ${u.color} font-mono text-white space-y-1`}>
                <div className="text-[10px] text-amber-300 font-bold">{u.id}</div>
                <div className="text-base font-black">{u.temp}</div>
                <div className="text-[11px] text-slate-300">Rejects {u.kw}</div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#11192b] border border-slate-800 flex items-center justify-between font-mono text-xs text-white">
            <span className="text-slate-400">AGGREGATE SENSIBLE HEAT DUMPED</span>
            <span className="text-base font-black text-rose-400">638.4 kW Continuous</span>
          </div>
        </div>
      ),
    },
    {
      step: '03',
      tag: 'SCREEN 3 · 3D WEBGL DIGITAL TWIN',
      route: '/twin · 60 FPS Plume & Louver Lab',
      side: 'right' as const,
      headline: 'Deflect 54°C exhaust skyward with 45° louvers.',
      caption: 'Simulate upward aerodynamic cowls and 70-bar sidewalk misting arches in real-time 3D.',
      croppedView: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <Box className="w-4 h-4" />
              <span>3D EULERIAN PLUME TWIN // SCADA ACTIVE</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
              -4.2°C Sidewalk Drop
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 -mr-8 pr-6 font-mono">
            <div className="p-4 rounded-2xl bg-rose-950/35 border border-rose-500/40 text-white space-y-1">
              <div className="text-[10px] text-rose-300">BEFORE (0° HORIZONTAL BLAST)</div>
              <div className="text-2xl font-black text-rose-400">47.8°C</div>
              <div className="text-xs text-slate-300">Hits vendor head height</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/35 border border-emerald-500/50 text-white space-y-1">
              <div className="text-[10px] text-emerald-300">AFTER (45° UPWARD + MIST)</div>
              <div className="text-2xl font-black text-emerald-400">42.4°C</div>
              <div className="text-xs text-slate-300">Vented safely to roofline</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Unlocks 65% monthly surcharge rebate for compliant buildings</span>
          </div>
        </div>
      ),
    },
    {
      step: '04',
      tag: 'SCREEN 4 · CART IOT BEACON & VOICE',
      route: '/watchlist · Hindi, Tamil, Kannada, Telugu',
      side: 'left' as const,
      headline: 'Warn street vendors in their own language.',
      caption: 'An $8 solar cart beacon tracks Wet-Bulb temperature and speaks instant alerts before heat stroke.',
      croppedView: (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 font-mono text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              <span>BEACON #VN-101 · RAMESHWAR PAL (2.8m FROM AC)</span>
            </span>
            <span className="text-rose-400 font-bold">WBGT 36.8°C</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#11192b] border border-amber-500/40 text-amber-200 font-sans text-xs sm:text-sm leading-relaxed -ml-6 pl-6">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold mb-1">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>LIVE BILINGUAL VOICE BROADCAST (HI-IN / EN-IN)</span>
            </div>
            &ldquo;चेतावनी! AC निकास से वेट-बल्ब तापमान 36.8°C पार हो गया है। कृपया 45 मीटर दूर कूलिंग कियोस्क #03 पर जाएं।&rdquo;
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold">हिन्दी</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200">English</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200">தமிழ்</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200">ಕನ್ನಡ</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200">తెలుగు</span>
          </div>
        </div>
      ),
    },
    {
      step: '05',
      tag: 'SCREEN 5 · SECTION 133 DEBT LEDGER',
      route: '/ledger · Statutory Restitution Engine',
      side: 'right' as const,
      headline: 'Turn polluter heat fines into vendor cooling.',
      caption: 'Automated Section 133 CrPC notices bill heat-dumping towers to fund solar misting kiosks.',
      croppedView: (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 font-mono text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>SEC. 133 CrPC // MUNICIPAL ABATEMENT ORDER</span>
            </span>
            <span className="text-amber-300 font-bold">REF: UN/NDMC/2026</span>
          </div>

          <div className="p-4 rounded-l-2xl bg-[#11192b] border-l-4 border-l-emerald-400 border-y border-slate-800 text-white space-y-2 -mr-8 pr-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">ASSESSED MONTHLY SURCHARGE</span>
              <span className="text-xl font-mono font-black text-emerald-400">₹1,85,000 / mo</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              100% of collected thermal debt is escrowed to operate 2 solar evaporative misting shelters and free ORS hydration for 18 street vendors in Laxmi Nagar Ward 42.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const activeReel = halfScreenReels[activeReelIdx];

  return (
    <div className="fixed inset-0 z-[120] w-screen h-screen overflow-hidden select-none animate-in fade-in duration-200 font-sans bg-[#0b111e]">
      {/* Top Floating Control HUD */}
      <div className="absolute top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-3 bg-[#0b1b2d]/90 backdrop-blur-md text-white px-4 py-2 rounded-full border border-amber-500/30 text-xs font-mono shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold tracking-wider uppercase text-amber-300">USHMA-NETRA // 30s REEL</span>
          <span className="text-white/30">·</span>
          <span className="text-white font-bold tabular-nums">{remainingSec}s</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (elapsedMs >= TOTAL_DURATION_MS) {
                handleRestart(e);
              } else {
                setIsPaused((p) => !p);
              }
            }}
            className="px-3.5 py-2 rounded-full bg-[#0b1b2d]/90 hover:bg-[#162a42] active:scale-95 text-white border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
          >
            {isPaused || elapsedMs >= TOTAL_DURATION_MS ? (
              <Play className="w-3.5 h-3.5 text-amber-400 pointer-events-none" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-amber-400 pointer-events-none" />
            )}
            <span className="pointer-events-none">
              {elapsedMs >= TOTAL_DURATION_MS
                ? 'Replay'
                : isPaused
                ? 'Resume'
                : 'Pause'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="px-3.5 py-2 rounded-full bg-[#0b1b2d]/90 hover:bg-[#162a42] active:scale-95 text-white border border-amber-400/50 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            title="Restart 30s Reel from beginning (00:00)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 pointer-events-none" />
            <span className="pointer-events-none">Restart</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2 rounded-full bg-[#a8321a] hover:bg-[#8e2915] active:scale-95 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <X className="w-4 h-4 pointer-events-none" />
            <span className="pointer-events-none">Close</span>
          </button>
        </div>
      </div>

      {/* Bottom 30s Interactive Scrubbing Progress Bar */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          jumpToTimeMs(ratio * TOTAL_DURATION_MS);
        }}
        className="absolute bottom-0 inset-x-0 z-50 h-2.5 bg-slate-900/90 cursor-pointer group"
        title="Click anywhere to scrub timeline"
      >
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-[#a8321a] to-emerald-400 transition-none"
          style={{ width: `${(elapsedMs / TOTAL_DURATION_MS) * 100}%` }}
        />
      </div>

      {/* ================================================================= */}
      {/* SCENE 1 (0.0s - 4.0s): DRAMATIC THERMAL CONTRAST OPENER            */}
      {/* ================================================================= */}
      {sec < 4.0 && (
        <div
          key={`scene-1-${runKey}`}
          className="w-full h-full grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden"
        >
          {/* Left Half: Chilled 21°C Corporate Tower Sanctuary */}
          <div className="lg:col-span-6 bg-[#0b1b2d] text-white flex flex-col justify-center px-8 sm:px-14 py-12 border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="max-w-md ml-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 font-mono text-xs font-bold">
                INSIDE COMMERCIAL TOWERS
              </span>
              <div className="text-7xl sm:text-8xl font-black text-sky-400 font-mono tracking-tighter">
                21.0°C
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-200 leading-snug">
                Chilled corporate comfort inside glass offices.
              </p>
            </div>
          </div>

          {/* Right Half: 54.2°C Sidewalk Exhaust Blast */}
          <div className="lg:col-span-6 bg-[#e6dfd3] text-[#0b1b2d] flex flex-col justify-center px-8 sm:px-14 py-12 relative">
            <div className="max-w-md mr-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a8321a]/15 border border-[#a8321a]/40 text-[#a8321a] font-mono text-xs font-bold">
                2.8 METERS AWAY ON THE SIDEWALK
              </span>
              <div className="text-7xl sm:text-8xl font-black text-[#a8321a] font-mono tracking-tighter">
                54.2°C
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0b1b2d] leading-snug">
                Superheated AC waste heat blasted onto street vendors.
              </p>
            </div>
          </div>

          {/* Center Floating Impact Pill */}
          <div className="absolute inset-x-0 bottom-12 flex justify-center px-4 pointer-events-none">
            <div className="px-6 py-3 rounded-full bg-[#0b111e]/95 border border-amber-400/50 text-white font-mono text-xs sm:text-sm font-bold shadow-2xl">
              Ushma-Netra makes invisible AC heat dumping visible, measurable, and accountable.
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SCENE 2 (4.0s - 22.0s): 5 ALTERNATING HALF-SCREEN CROPPED REELS    */}
      {/* ================================================================= */}
      {sec >= 4.0 && sec < 22.0 && (
        <div
          key={`scene-2-${runKey}-${activeReelIdx}`}
          className="w-full h-full bg-[#e6dfd3] text-[#0b1b2d] flex flex-col justify-center px-6 sm:px-14 lg:px-20 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full space-y-8">
            {/* Reel Step Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d6cebe] pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#0b1b2d] text-amber-300 font-mono text-xs font-bold">
                  {activeReel.tag}
                </span>
                <span className="text-xs font-mono text-[#526071] hidden sm:inline">
                  {activeReel.route}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {halfScreenReels.map((r, idx) => (
                  <button
                    key={r.step}
                    type="button"
                    onClick={() => jumpToTimeMs((4.0 + idx * reelDuration + 0.05) * 1000)}
                    className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                      idx === activeReelIdx
                        ? 'bg-[#a8321a] text-white shadow-sm'
                        : 'bg-[#efe8dc] text-[#0b1b2d]/60 hover:text-[#0b1b2d] border border-[#d6cebe]'
                    }`}
                  >
                    {r.step}
                  </button>
                ))}
              </div>
            </div>

            {/* Alternating Split: Half-Screen Story + Half-Cropped Live UI Viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Narrative Half */}
              <div
                className={`lg:col-span-5 space-y-4 ${
                  activeReel.side === 'left' ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#a8321a] uppercase tracking-wider">
                  <span>MODULE {activeReel.step} OF 05</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0b1b2d] tracking-tight leading-[1.1]">
                  {activeReel.headline}
                </h2>
                <p className="text-base sm:text-lg text-[#1f3044] leading-relaxed">
                  {activeReel.caption}
                </p>
              </div>

              {/* Cropped Half-Window UI Preview (Bleeds off screen edge like a trailer cut) */}
              <div
                className={`lg:col-span-7 ${
                  activeReel.side === 'left' ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="rounded-3xl bg-[#0b111e] border-2 border-slate-800 shadow-[0_28px_70px_rgba(11,27,45,0.25)] overflow-hidden">
                  {/* Dark Window Header */}
                  <div className="px-5 py-3 bg-[#11192b] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-slate-300 font-semibold">{activeReel.route}</span>
                    <span className="text-amber-400 font-bold">HALF-VIEW PREVIEW</span>
                  </div>

                  {/* Half-Cropped Content Body */}
                  <div className="p-6 sm:p-8 min-h-[270px] flex flex-col justify-center overflow-hidden">
                    {activeReel.croppedView}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SCENE 3 (22.0s - 26.2s): 3-PILLAR CLOSED LOOP SUMMARY NEAR THE END */}
      {/* ================================================================= */}
      {sec >= 22.0 && sec < 26.2 && (
        <div
          key={`scene-3-${runKey}`}
          className="w-full h-full bg-[#efe8dc] text-[#0b1b2d] flex flex-col justify-center px-8 sm:px-16 lg:px-24"
        >
          <div className="max-w-6xl mx-auto w-full space-y-10">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-[#a8321a] uppercase tracking-widest">
                THE COMPLETE CLOSED-LOOP SYSTEM
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0b1b2d]">
                How Ushma-Netra turns <span className="text-[#a8321a]">waste heat</span> into street relief.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-3xl bg-[#0b1b2d] text-white space-y-3 shadow-xl">
                <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-amber-300 font-bold">01 · DETECT AT SOURCE</div>
                <div className="text-xl font-bold leading-snug">
                  Landsat-9 thermal IR + YOLOv8 cameras meter every kilowatt of AC exhaust.
                </div>
              </div>

              <div className="p-7 rounded-3xl bg-[#0b1b2d] text-white space-y-3 shadow-xl">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-rose-300 font-bold">02 · PROTECT WORKERS</div>
                <div className="text-xl font-bold leading-snug">
                  $8 solar cart beacons broadcast multilingual voice alerts before 36.8°C WBGT lethality.
                </div>
              </div>

              <div className="p-7 rounded-3xl bg-[#0b1b2d] text-white space-y-3 shadow-xl">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Wind className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-emerald-300 font-bold">03 · COOL THE ALLEY</div>
                <div className="text-xl font-bold leading-snug">
                  Section 133 polluter surcharges fund 45° upward louvers and 70-bar misting kiosks.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SCENE 4 (26.2s - 30.0s): NATIONAL COUNTER + USHMA-NETRA FINALE     */}
      {/* ================================================================= */}
      {sec >= 26.2 && (
        <div
          key={`scene-4-${runKey}`}
          className="w-full h-full bg-[#070b14] text-white flex items-center justify-center px-8 relative overflow-hidden"
        >
          {/* Subtle Thermal Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(245,158,11,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.14) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Live Final Telemetry Counters */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>AUTONOMOUS THERMAL EQUITY GRID</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#0b1b2d]/90 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400">WASTE HEAT METERED</div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-rose-400 tabular-nums mt-1">
                    {animatedKwTracked} MW
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#0b1b2d]/90 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400">COOLING RESTITUTION</div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tabular-nums mt-1">
                    ₹{(animatedFundInr / 100000).toFixed(2)}L/mo
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 font-mono">
                10 Monitored Street Canyons · Delhi NCR, Mumbai, Bengaluru &amp; Ahmedabad
              </p>

              {/* Prominent Replay Button when Reel Finishes */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-mono text-xs font-bold shadow-lg cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 pointer-events-none" />
                  <span className="pointer-events-none">Watch 30s Reel Again</span>
                </button>
              </div>
            </div>

            {/* Ushma-Netra Brand Lockup */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-end text-center lg:text-right space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-[#0b1b2d] border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] flex items-center justify-center">
                <svg viewBox="0 0 36 36" fill="none" className="w-11 h-11">
                  <path
                    d="M3 18C6.8 10.5 12 7 18 7C24 7 29.2 10.5 33 18C29.2 25.5 24 29 18 29C12 29 6.8 25.5 3 18Z"
                    stroke="#f59e0b"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="18" cy="18" r="5.5" fill="#ef4444" />
                  <circle cx="18" cy="18" r="2.3" fill="#fde68a" />
                </svg>
              </div>

              <div>
                <div className="text-sm font-mono tracking-[0.3em] text-amber-400 uppercase font-extrabold">
                  USHMA
                </div>
                <div className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  NETRA
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-200 max-w-md font-medium">
                Thermal justice at ground level—turning commercial AC exhaust into street cooling.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
