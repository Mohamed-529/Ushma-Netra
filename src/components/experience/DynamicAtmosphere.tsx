import React, { useEffect, useMemo } from 'react';

export type StoryAct =
  | 'wow_hero'
  | 'workspace'
  | 'problem'
  | 'tension'
  | 'solution'
  | 'live_cockpit'
  | 'proof'
  | 'technology'
  | 'final_demo'
  | 'challenge';

interface Props {
  activeAct: StoryAct;
  isSurgeActive: boolean;
  isIntroRevealed?: boolean;
}

export const DynamicAtmosphere: React.FC<Props> = ({
  activeAct,
  isSurgeActive,
  isIntroRevealed = true,
}) => {
  // Route-aware Oceanic Indigo & Thermal Twilight Canvas (No flat black!)
  // Harmonizes with the interactive 3D Thermal Plume (Teal/Cyan/Ocean Blue + Solar Amber/Crimson)
  const theme = useMemo(() => {
    if (isSurgeActive) {
      return {
        bgGradient: 'linear-gradient(155deg, #2b1329 0%, #3d1628 48%, #1e1c38 100%)',
        mesh1: 'rgba(244, 63, 94, 0.30)',
        mesh2: 'rgba(249, 115, 22, 0.25)',
        mesh3: 'rgba(56, 189, 248, 0.18)',
        meshPos1: '30% 22%',
        meshPos2: '75% 75%',
      };
    }

    switch (activeAct) {
      case 'live_cockpit': // 3D Twin Page
        return {
          bgGradient: 'linear-gradient(155deg, #162647 0%, #1d3557 50%, #152b44 100%)',
          mesh1: 'rgba(56, 189, 248, 0.22)',
          mesh2: 'rgba(245, 158, 11, 0.18)',
          mesh3: 'rgba(20, 184, 166, 0.16)',
          meshPos1: '28% 24%',
          meshPos2: '76% 72%',
        };
      case 'tension': // Thermal Grid Page
        return {
          bgGradient: 'linear-gradient(155deg, #1b2848 0%, #24345a 50%, #172742 100%)',
          mesh1: 'rgba(249, 115, 22, 0.20)',
          mesh2: 'rgba(56, 189, 248, 0.20)',
          mesh3: 'rgba(245, 158, 11, 0.15)',
          meshPos1: '35% 20%',
          meshPos2: '70% 80%',
        };
      case 'technology': // CV Scanner Page
        return {
          bgGradient: 'linear-gradient(155deg, #172a4a 0%, #1e375c 50%, #152642 100%)',
          mesh1: 'rgba(14, 165, 233, 0.24)',
          mesh2: 'rgba(245, 158, 11, 0.16)',
          mesh3: 'rgba(16, 185, 129, 0.15)',
          meshPos1: '25% 25%',
          meshPos2: '74% 76%',
        };
      case 'final_demo': // Debt Ledger Page
        return {
          bgGradient: 'linear-gradient(155deg, #162944 0%, #1d3654 50%, #162c46 100%)',
          mesh1: 'rgba(16, 185, 129, 0.20)',
          mesh2: 'rgba(245, 158, 11, 0.18)',
          mesh3: 'rgba(56, 189, 248, 0.16)',
          meshPos1: '32% 24%',
          meshPos2: '72% 76%',
        };
      default: // Big Picture (Home) & Impact / Alert Pages
        return {
          bgGradient: 'linear-gradient(155deg, #172542 0%, #1f3358 48%, #162946 100%)',
          mesh1: 'rgba(56, 189, 248, 0.22)',
          mesh2: 'rgba(245, 158, 11, 0.18)',
          mesh3: 'rgba(249, 115, 22, 0.15)',
          meshPos1: '32% 22%',
          meshPos2: '72% 78%',
        };
    }
  }, [isSurgeActive, activeAct]);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Cursor tracking for interactive thermal-to-cooling aura
    const mouse = { x: width * 0.5, y: height * 0.65, active: false };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Dual-Spectrum Palette matching the interactive 3D Plume (Solar Amber/Orange + Cooling Cyan/Teal)
    const palette = [
      { r: 56, g: 189, b: 248 },  // Skyward Cooling Blue (#38BDF8)
      { r: 245, g: 158, b: 11 },  // Solar Thermal Amber (#F59E0B)
      { r: 20, g: 184, b: 166 },  // Restorative Mist Teal (#14B8A6)
      { r: 249, g: 115, b: 22 },  // Warm Exhaust Orange (#F97316)
      { r: 251, g: 191, b: 36 },  // Gold Highlight (#FBBF24)
    ];

    // 1. Floating Thermal & Cooling Micro-Convection Particles
    const particles = Array.from({ length: 64 }, (_, idx) => {
      const col = palette[idx % palette.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1.0,
        baseVy: -(Math.random() * 0.65 + 0.22),
        wobbleAmp: Math.random() * 0.75 + 0.25,
        wobbleFreq: Math.random() * 0.022 + 0.01,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.42 + 0.16,
        color: col,
        glow: idx % 3 === 0,
      };
    });

    // 2. Smooth Sinusoidal Airflow & Plume Wave Ribbons (Matching the 3D Fluid Plume shader)
    const waveRibbons = Array.from({ length: 6 }, (_, idx) => ({
      yRatio: 0.18 + idx * 0.15,
      amplitude: 16 + idx * 4.5,
      wavelength: 0.0032 + (idx % 2) * 0.0014,
      speed: 0.016 + idx * 0.0035,
      phase: idx * 1.3,
      color: idx % 2 === 0 ? '56, 189, 248' : '245, 158, 11',
      alpha: 0.055 + (idx % 3) * 0.015,
    }));

    // 3. Expanding Topographic Isotherm Rings
    const isotherms = [
      { xRatio: 0.22, yRatio: 0.32, maxR: 380, phase: 0.0, color: '56, 189, 248' },
      { xRatio: 0.78, yRatio: 0.68, maxR: 440, phase: 0.35, color: '245, 158, 11' },
      { xRatio: 0.50, yRatio: 0.88, maxR: 520, phase: 0.7, color: '20, 184, 166' },
    ];

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const surgeMultiplier = isSurgeActive ? 1.8 : 1.0;

      // A. Warm Solar-Amber & Cool-Teal Horizon Glow at bottom of viewport
      const horizonGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      horizonGrad.addColorStop(0, 'rgba(23, 37, 66, 0)');
      horizonGrad.addColorStop(
        0.65,
        isSurgeActive ? 'rgba(244, 63, 94, 0.12)' : 'rgba(56, 189, 248, 0.08)'
      );
      horizonGrad.addColorStop(
        1,
        isSurgeActive ? 'rgba(249, 115, 22, 0.22)' : 'rgba(245, 158, 11, 0.14)'
      );
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);

      // B. Interactive Cursor Aura (matches interactive plume)
      if (mouse.active) {
        const cursorGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          10,
          mouse.x,
          mouse.y,
          300
        );
        cursorGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        cursorGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.06)');
        cursorGrad.addColorStop(1, 'rgba(23, 37, 66, 0)');
        ctx.fillStyle = cursorGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 300, 0, Math.PI * 2);
        ctx.fill();
      }

      // C. Expanding Isotherm Contours
      isotherms.forEach((iso) => {
        const cx = width * iso.xRatio;
        const cy = height * iso.yRatio;
        for (let ring = 0; ring < 3; ring++) {
          const progress = (tick * 0.002 * surgeMultiplier + iso.phase + ring * 0.33) % 1;
          const radius = 50 + progress * iso.maxR;
          const ringAlpha = (1 - progress) * (isSurgeActive ? 0.15 : 0.09);

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${iso.color}, ${ringAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([8, 6]);
          ctx.stroke();
          ctx.restore();
        }
      });

      // D. Sinusoidal Plume Airflow Waves
      waveRibbons.forEach((ribbon, idx) => {
        ribbon.phase += ribbon.speed * surgeMultiplier;
        const verticalDrift = (tick * 0.22 + idx * 120) % (height * 0.9);
        const baseY = height - verticalDrift;

        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= width; x += 24) {
          const waveY =
            baseY +
            Math.sin(x * ribbon.wavelength + ribbon.phase) * ribbon.amplitude +
            Math.cos(x * ribbon.wavelength * 0.5 - ribbon.phase * 0.7) * (ribbon.amplitude * 0.4);
          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        const edgeFade = Math.sin((verticalDrift / (height * 0.9)) * Math.PI);
        const finalAlpha = ribbon.alpha * Math.max(0.18, edgeFade) * (isSurgeActive ? 1.5 : 1);
        ctx.strokeStyle = `rgba(${ribbon.color}, ${finalAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.75;
        ctx.stroke();
        ctx.restore();
      });

      // E. Rising Thermal & Mist Particles
      particles.forEach((p) => {
        p.phase += p.wobbleFreq * surgeMultiplier;
        p.x += Math.sin(p.phase) * p.wobbleAmp;
        p.y += p.baseVy * surgeMultiplier;

        if (p.y < -20) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 15;
        if (p.x > width + 20) p.x = -15;

        const pulse = 0.75 + 0.25 * Math.sin(p.phase * 2.2);
        const alpha = Math.min(0.85, p.alpha * pulse * (isSurgeActive ? 1.35 : 1));
        const { r, g, b } = p.color;

        if (p.glow) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5.5);
          glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.45).toFixed(3)})`);
          glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 0.9, p.r * 1.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isSurgeActive]);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-700 ease-in-out"
      style={{ background: theme.bgGradient }}
    >
      {/* Layer 1: Luminous Interactive Plume Mesh Gradients (Cyan/Teal + Solar Amber/Orange) */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out opacity-100"
        style={{
          background: `
            radial-gradient(circle at ${theme.meshPos1}, ${theme.mesh1} 0%, transparent 55%),
            radial-gradient(circle at ${theme.meshPos2}, ${theme.mesh2} 0%, transparent 60%),
            radial-gradient(circle at 50% 88%, ${theme.mesh3} 0%, transparent 65%)
          `,
        }}
      />

      {/* Layer 2: Soft Atmospheric Plume Glow Orbs (Always visible, even during hero intro!) */}
      <div
        className={`absolute -top-28 left-1/5 w-[42rem] h-[42rem] rounded-full blur-[135px] mix-blend-screen transition-opacity duration-1000 opacity-50 ${
          isSurgeActive ? 'bg-rose-500/35 animate-pulse' : 'bg-sky-400/25 animate-pulse'
        }`}
        style={{ animationDuration: '7s' }}
      />
      <div
        className={`absolute top-1/3 right-1/6 w-[38rem] h-[38rem] rounded-full blur-[135px] mix-blend-screen transition-opacity duration-1000 opacity-45 ${
          isSurgeActive ? 'bg-orange-500/35 animate-pulse' : 'bg-amber-500/22 animate-pulse'
        }`}
        style={{ animationDuration: '8.5s' }}
      />
      <div
        className={`absolute -bottom-36 left-1/3 w-[44rem] h-[44rem] rounded-full blur-[140px] mix-blend-screen transition-opacity duration-1000 opacity-45 ${
          isSurgeActive ? 'bg-red-500/30 animate-pulse' : 'bg-teal-400/20 animate-pulse'
        }`}
        style={{ animationDuration: '10s' }}
      />

      {/* Layer 3: Subtle Atmospheric Sensor Grid */}
      <div
        className={`absolute inset-0 engineering-grid-bg transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-75' : 'opacity-45'
        }`}
      />

      {/* Layer 4: Live HTML5 Canvas — Interactive Plume Waves, Mist & Solar Particles */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-95' : 'opacity-70'
        }`}
      />

      {/* Layer 5: Soft Twilight Horizon Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: isSurgeActive
            ? 'inset 0 0 140px rgba(244, 63, 94, 0.25)'
            : 'inset 0 0 120px rgba(56, 189, 248, 0.12)',
        }}
      />
    </div>
  );
};
