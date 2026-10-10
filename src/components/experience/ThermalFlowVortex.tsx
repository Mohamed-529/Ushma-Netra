import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { RotateCcw, Wind, Layers, Sparkles, Sliders, Volume2, VolumeX, Eye } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

interface ThermalFlowVortexProps {
  flirMode?: boolean;
  onInteract?: () => void;
  className?: string;
}

type VortexVisualMode = 'sculptural' | 'streamlines' | 'core';

export const ThermalFlowVortex: React.FC<ThermalFlowVortexProps> = ({
  flirMode = false,
  onInteract,
  className = '',
}) => {
  // Container & Interaction Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [visualMode, setVisualMode] = useState<VortexVisualMode>('sculptural');
  const [flowTurbulence, setFlowTurbulence] = useState<'laminar' | 'turbulent'>('turbulent');
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [time, setTime] = useState(0);

  // 3D Rotation Motion Values (with spring physics for hyper-smooth organic lag)
  const targetRotX = useMotionValue(12);
  const targetRotY = useMotionValue(-18);
  const targetRotZ = useMotionValue(0);
  const targetScale = useMotionValue(1);

  // Spring configuration for buttery fluid momentum
  const springConfig = { damping: 22, stiffness: 120, mass: 0.8 };
  const smoothRotX = useSpring(targetRotX, springConfig);
  const smoothRotY = useSpring(targetRotY, springConfig);
  const smoothRotZ = useSpring(targetRotZ, springConfig);
  const smoothScale = useSpring(targetScale, springConfig);

  // Mouse coordinate normalized for dynamic specular highlight positioning
  const [lightPos, setLightPos] = useState({ x: 260, y: 180 });

  // Animation frame loop for continuous organic breathing & ribbon wave morphing
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastStamp) / 1000;
      lastStamp = now;
      const speedMult = flowTurbulence === 'turbulent' ? 1.6 : 0.8;
      setTime((prev) => (prev + delta * speedMult) % 1000);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [flowTurbulence]);

  // Window mouse tracking for 3D parallax tilt (when not actively dragging)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from vortex center
      const dx = (e.clientX - centerX) / (window.innerWidth * 0.5);
      const dy = (e.clientY - centerY) / (window.innerHeight * 0.5);

      // Smooth subtle 3D tilt
      targetRotY.set(-18 + dx * 28);
      targetRotX.set(12 - dy * 24);
      targetRotZ.set(dx * dy * -15);

      // Move specular light source relative to SVG viewBox (0..500)
      const svgX = Math.max(50, Math.min(450, 250 + dx * 220));
      const svgY = Math.max(50, Math.min(450, 220 + dy * 220));
      setLightPos({ x: svgX, y: svgY });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isDragging, targetRotX, targetRotY, targetRotZ]);

  // Pointer Drag Handlers for 360-degree orbital inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: targetRotX.get(),
      rotY: targetRotY.get(),
    };
    targetScale.set(1.04);
    if (onInteract) onInteract();
    if (isSoundActive) {
      soundEngine.playTone(520, 'sine', 0.08);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    targetRotY.set(dragStart.current.rotY + deltaX * 0.45);
    targetRotX.set(dragStart.current.rotX - deltaY * 0.45);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    targetScale.set(1);
    if (isSoundActive) {
      soundEngine.playTone(380, 'triangle', 0.1);
    }
  };

  // Reset orientation back to default hero perspective
  const resetOrientation = useCallback(() => {
    targetRotX.set(12);
    targetRotY.set(-18);
    targetRotZ.set(0);
    targetScale.set(1);
    if (isSoundActive) {
      soundEngine.playTone(660, 'sine', 0.12);
    }
  }, [targetRotX, targetRotY, targetRotZ, targetScale, isSoundActive]);

  // Toggle ambient acoustic feedback
  const toggleSound = () => {
    const next = !isSoundActive;
    setIsSoundActive(next);
    if (next) {
      soundEngine.playTone(580, 'sine', 0.15);
    }
  };

  // Mathematically calculated C-shaped aerodynamic vortex ribs and ribbons
  // The C-arc spans ~260 degrees from upper right (40deg) around the left side down to lower right (310deg)
  const ribCount = 22;
  const ribs = useMemo(() => {
    const items = [];
    const startAngle = 0.55; // radians (~32 degrees)
    const endAngle = 5.65; // radians (~324 degrees)
    const span = endAngle - startAngle;

    for (let i = 0; i < ribCount; i++) {
      const tNorm = i / (ribCount - 1);
      // Angle around the C-loop
      const angle = startAngle + tNorm * span;

      // Base radius with tapered aerodynamic horns at tips and wider belly on left
      const rBase = 155 - Math.sin(tNorm * Math.PI) * 18;

      // Cross-section elliptical size
      const crossRadius = 24 + Math.sin(tNorm * Math.PI) * 22;

      items.push({
        idx: i,
        tNorm,
        angle,
        rBase,
        crossRadius,
      });
    }
    return items;
  }, [ribCount]);

  // Generate dynamic wave-morphing paths for the C-shape outer and inner contour ribbons
  const waveOffset = Math.sin(time * 2.2) * 6;
  const waveOffset2 = Math.cos(time * 1.8) * 5;

  // Primary C-ribbon path coordinates
  const ribbonPaths = useMemo(() => {
    // Generate spline points along outer and inner edges of the C
    const outerPts: [number, number][] = [];
    const innerPts: [number, number][] = [];
    const spinePts: [number, number][] = [];

    const cx = 250;
    const cy = 250;

    ribs.forEach((rib) => {
      const dynamicR = rib.rBase + Math.sin(rib.angle * 3 + time * 2) * 4;
      const cosA = Math.cos(rib.angle);
      const sinA = Math.sin(rib.angle);

      // Spine point
      const sx = cx + dynamicR * cosA;
      const sy = cy + dynamicR * sinA;
      spinePts.push([sx, sy]);

      // Outer rim
      const ox = cx + (dynamicR + rib.crossRadius * 0.95) * cosA;
      const oy = cy + (dynamicR + rib.crossRadius * 0.95) * sinA;
      outerPts.push([ox, oy]);

      // Inner rim
      const ix = cx + (dynamicR - rib.crossRadius * 0.85) * cosA;
      const iy = cy + (dynamicR - rib.crossRadius * 0.85) * sinA;
      innerPts.push([ix, iy]);
    });

    // Construct smooth SVG path strings
    const makeSmoothPath = (pts: [number, number][]) => {
      if (pts.length === 0) return '';
      let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const mx = (prev[0] + curr[0]) / 2;
        const my = (prev[1] + curr[1]) / 2;
        d += ` Q ${prev[0].toFixed(1)},${prev[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
      }
      const last = pts[pts.length - 1];
      d += ` T ${last[0].toFixed(1)},${last[1].toFixed(1)}`;
      return d;
    };

    // Construct closed solid ribbon hull (Outer curve forward -> Inner curve backward)
    const reversedInner = [...innerPts].reverse();
    let hullD = `M ${outerPts[0][0].toFixed(1)},${outerPts[0][1].toFixed(1)}`;
    for (let i = 1; i < outerPts.length; i++) {
      hullD += ` L ${outerPts[i][0].toFixed(1)},${outerPts[i][1].toFixed(1)}`;
    }
    for (let i = 0; i < reversedInner.length; i++) {
      hullD += ` L ${reversedInner[i][0].toFixed(1)},${reversedInner[i][1].toFixed(1)}`;
    }
    hullD += ' Z';

    return {
      hull: hullD,
      spine: makeSmoothPath(spinePts),
      outer: makeSmoothPath(outerPts),
      inner: makeSmoothPath(innerPts),
      points: spinePts,
    };
  }, [ribs, time]);

  // Dynamic particle drift along the C-vortex slipstream
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const progress = ((time * 0.22 + i / 14) % 1);
      const angle = 0.55 + progress * (5.65 - 0.55);
      const r = 155 + Math.sin(progress * Math.PI * 4 + i) * 16;
      const x = 250 + r * Math.cos(angle);
      const y = 250 + r * Math.sin(angle);
      const opacity = Math.sin(progress * Math.PI);
      const size = 1.8 + Math.sin(i * 1.5) * 1.2;
      return { id: i, x, y, opacity, size };
    });
  }, [time]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center select-none ${className}`}
    >
      {/* 3D Motion Interactive Viewport Stage */}
      <div
        className="relative w-[340px] sm:w-[420px] md:w-[480px] xl:w-[520px] h-[340px] sm:h-[420px] md:h-[480px] xl:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ perspective: 1200 }}
      >
        {/* Dynamic Engineering Ambient Glow (Clean Luminous White) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full blur-[80px] transition-all duration-700"
            style={{
              background: flirMode
                ? 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.12) 40%, rgba(255,255,255,0.04) 70%, transparent 80%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.01) 75%, transparent 80%)',
            }}
          />
        </div>

        {/* Floating 3D Object Motion Container */}
        <motion.div
          style={{
            rotateX: smoothRotX,
            rotateY: smoothRotY,
            rotateZ: smoothRotZ,
            scale: smoothScale,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] overflow-visible"
          >
            <defs>
              {/* Pristine Ceramic White Gradient with Volumetric Shading */}
              <linearGradient id="vortexWhiteMantle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                <stop offset="25%" stopColor="#F1F5F9" stopOpacity="0.94" />
                <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#64748B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1E293B" stopOpacity="0.25" />
              </linearGradient>

              {/* Dynamic Interactive Specular Lighting Gradient */}
              <radialGradient
                id="specularLight"
                cx={`${((lightPos.x / 500) * 100).toFixed(1)}%`}
                cy={`${((lightPos.y / 500) * 100).toFixed(1)}%`}
                r="45%"
                fx={`${((lightPos.x / 500) * 100).toFixed(1)}%`}
                fy={`${((lightPos.y / 500) * 100).toFixed(1)}%`}
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#F8FAFC" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
              </radialGradient>

              {/* Inner Cavitation Fluid Gradient */}
              <linearGradient id="innerCavity" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0F172A" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#334155" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.15" />
              </linearGradient>

              {/* Streamline White Luminescence */}
              <linearGradient id="streamlineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#F1F5F9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.2" />
              </linearGradient>

              {/* Soft Ethereal Rim Filter */}
              <filter id="vortexGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Engineering Reticle Rings (Aerodynamic Polar Coordinate Grid) */}
            <g className="opacity-15" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" fill="none">
              <circle cx="250" cy="250" r="195" strokeDasharray="3 6" />
              <circle cx="250" cy="250" r="155" strokeDasharray="1 4" />
              <circle cx="250" cy="250" r="115" strokeDasharray="2 8" />
              <line x1="250" y1="40" x2="250" y2="460" strokeDasharray="2 10" />
              <line x1="40" y1="250" x2="460" y2="250" strokeDasharray="2 10" />
            </g>

            {/* Ambient Shadow Volume (Volumetric 3D Drop-Shadow behind C) */}
            <path
              d={ribbonPaths.hull}
              fill="rgba(0,0,0,0.6)"
              transform="translate(8, 14)"
              filter="url(#vortexGlow)"
              className="opacity-70"
            />

            {/* Deep Underbelly Ribbon Cavity */}
            <path
              d={ribbonPaths.hull}
              fill="url(#innerCavity)"
            />

            {/* PRIMARY SCULPTURAL BODY: Pristine Ceramic White Fluid Hull */}
            {(visualMode === 'sculptural' || visualMode === 'core') && (
              <path
                d={ribbonPaths.hull}
                fill="url(#vortexWhiteMantle)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.8"
                className="transition-all duration-300"
              />
            )}

            {/* DYNAMIC SPECULAR HIGHLIGHT OVERLAY (Reflects Cursor Light) */}
            <path
              d={ribbonPaths.hull}
              fill="url(#specularLight)"
              style={{ mixBlendMode: 'screen' }}
              className="pointer-events-none"
            />

            {/* 3D AERODYNAMIC TRANSVERSE RIBS (Slices forming volumetric structure) */}
            {(visualMode === 'sculptural' || visualMode === 'streamlines') && (
              <g className="pointer-events-none">
                {ribs.map((rib) => {
                  const dynamicR = rib.rBase + Math.sin(rib.angle * 3 + time * 2) * 4;
                  const cosA = Math.cos(rib.angle);
                  const sinA = Math.sin(rib.angle);
                  const cx = 250 + dynamicR * cosA;
                  const cy = 250 + dynamicR * sinA;

                  // Ellipse rotation matches normal to curve
                  const deg = (rib.angle * 180) / Math.PI + 90;

                  return (
                    <ellipse
                      key={rib.idx}
                      cx={cx}
                      cy={cy}
                      rx={rib.crossRadius * (visualMode === 'streamlines' ? 0.95 : 0.85)}
                      ry={rib.crossRadius * 0.32}
                      transform={`rotate(${deg} ${cx} ${cy})`}
                      fill="none"
                      stroke={
                        visualMode === 'streamlines'
                          ? 'rgba(255,255,255,0.75)'
                          : 'rgba(255,255,255,0.32)'
                      }
                      strokeWidth={visualMode === 'streamlines' ? '1.2' : '0.8'}
                      strokeDasharray={visualMode === 'streamlines' ? '2 3' : 'none'}
                    />
                  );
                })}
              </g>
            )}

            {/* CONTINUOUS FLOWING STREAMLINES (Aerodynamic Vector Filaments) */}
            <g fill="none" className="pointer-events-none">
              {/* Outer Lip Streamline */}
              <path
                d={ribbonPaths.outer}
                stroke="url(#streamlineGlow)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="16 8"
                style={{
                  strokeDashoffset: -time * 70,
                }}
              />

              {/* Core Spine Streamline (High-Glow Razor Highlight) */}
              <path
                d={ribbonPaths.spine}
                stroke="#FFFFFF"
                strokeWidth={visualMode === 'core' ? '2.8' : '1.8'}
                strokeLinecap="round"
                filter={visualMode === 'core' ? 'url(#vortexGlow)' : undefined}
                className="opacity-95"
              />

              {/* Inner Cavity Streamline */}
              <path
                d={ribbonPaths.inner}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.2"
                strokeDasharray="8 6"
                style={{
                  strokeDashoffset: time * 55,
                }}
              />
            </g>

            {/* DRIFTING CONVECTIVE PARTICLES (Micro Airflow Tracers) */}
            <g className="pointer-events-none">
              {particles.map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.size}
                  fill="#FFFFFF"
                  opacity={p.opacity * 0.9}
                  filter="url(#vortexGlow)"
                />
              ))}
            </g>

            {/* C-TAPER TIP HIGHLIGHTS (Aerodynamic Horn Terminations) */}
            {ribbonPaths.points.length > 0 && (
              <g className="pointer-events-none">
                {/* Upper Horn Tip */}
                <circle
                  cx={ribbonPaths.points[0][0]}
                  cy={ribbonPaths.points[0][1]}
                  r="4"
                  fill="#FFFFFF"
                  filter="url(#vortexGlow)"
                />
                <circle
                  cx={ribbonPaths.points[0][0]}
                  cy={ribbonPaths.points[0][1]}
                  r="1.8"
                  fill="#0F172A"
                />

                {/* Lower Horn Tip */}
                <circle
                  cx={ribbonPaths.points[ribbonPaths.points.length - 1][0]}
                  cy={ribbonPaths.points[ribbonPaths.points.length - 1][1]}
                  r="4"
                  fill="#FFFFFF"
                  filter="url(#vortexGlow)"
                />
                <circle
                  cx={ribbonPaths.points[ribbonPaths.points.length - 1][0]}
                  cy={ribbonPaths.points[ribbonPaths.points.length - 1][1]}
                  r="1.8"
                  fill="#0F172A"
                />
              </g>
            )}

            {/* FLIR Mode Thermal Core Filament (Engages false-color accents only if FLIR active) */}
            {flirMode && (
              <g className="pointer-events-none" filter="url(#vortexGlow)">
                <path
                  d={ribbonPaths.spine}
                  stroke="rgba(245, 158, 11, 0.75)"
                  strokeWidth="2.2"
                  strokeDasharray="14 10"
                  style={{ strokeDashoffset: -time * 90 }}
                />
                <path
                  d={ribbonPaths.inner}
                  stroke="rgba(239, 68, 68, 0.6)"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* Aerodynamic Center-Eye Indicator */}
            <g transform="translate(250, 250)" className="pointer-events-none opacity-40">
              <circle r="6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
            </g>
          </svg>
        </motion.div>

        {/* Tactical Drag & Spatial Inspection Prompt */}
        <div
          className={`absolute bottom-2 inset-x-0 flex justify-center items-center pointer-events-none transition-opacity duration-300 ${
            isDragging ? 'opacity-0' : 'opacity-70'
          }`}
        >
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 bg-[#08080a]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-800/60 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            DRAG TO ORBIT 3D VORTEX
          </span>
        </div>
      </div>

      {/* Kinetic Minimalist Tactile Control Bar */}
      <div className="w-full max-w-sm sm:max-w-md mt-2 p-2.5 rounded-xl bg-[#0c0d12]/80 border border-zinc-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Visual Mode Segmented Selector (Anti-Slop Clean Buttons) */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/50">
          <button
            onClick={() => setVisualMode('sculptural')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
              visualMode === 'sculptural'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Clean white ceramic sculptural fluid mantle"
          >
            Sculptural
          </button>
          <button
            onClick={() => setVisualMode('streamlines')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
              visualMode === 'streamlines'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Aerodynamic vector streamlines & transverse ribs"
          >
            Streamlines
          </button>
          <button
            onClick={() => setVisualMode('core')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
              visualMode === 'core'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Luminous energy vortex core"
          >
            Core
          </button>
        </div>

        {/* Speed / Turbulence & Audio Controls */}
        <div className="flex items-center gap-1.5">
          {/* Turbulence Toggle */}
          <button
            onClick={() =>
              setFlowTurbulence((prev) => (prev === 'laminar' ? 'turbulent' : 'laminar'))
            }
            className={`px-2 py-1 rounded-md border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
              flowTurbulence === 'turbulent'
                ? 'bg-zinc-800/50 border-zinc-700/80 text-zinc-200'
                : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle aerodynamic flow turbulence"
          >
            <Wind className="w-3 h-3 text-zinc-300" />
            <span className="hidden sm:inline">
              {flowTurbulence === 'turbulent' ? 'Turbulent' : 'Laminar'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
              isSoundActive
                ? 'bg-white text-zinc-950 border-white shadow-sm'
                : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle vortex interaction sound"
          >
            {isSoundActive ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>

          {/* Reset Orientation */}
          <button
            onClick={resetOrientation}
            className="p-1.5 rounded-md border border-zinc-800/40 bg-zinc-900/40 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            title="Reset 3D perspective"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Real-Time Aerodynamic Telemetry Micro-Ribbon */}
      <div className="w-full max-w-sm sm:max-w-md mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
        <div className="flex items-center gap-2">
          <span>VORTEX FLUID: C-01</span>
          <span>·</span>
          <span className="text-zinc-300 font-semibold">
            {flowTurbulence === 'turbulent' ? 'RE: 4,820' : 'RE: 1,450'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>AERODYNAMIC CORE</span>
          <span>·</span>
          <span className="text-zinc-400 font-mono">FLOW: 5.4 M/S</span>
        </div>
      </div>
    </div>
  );
};
