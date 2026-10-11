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
  // Cohesive Premium Off-Black / Dark Charcoal Canvas (#12161A) with Urban Heatwave Physics
  const theme = useMemo(() => {
    return {
      bgColor: '#12161A',
      mesh1: isSurgeActive
        ? 'rgba(239, 68, 68, 0.24)'
        : 'rgba(234, 88, 12, 0.14)',
      mesh2: isSurgeActive
        ? 'rgba(249, 115, 22, 0.20)'
        : 'rgba(245, 158, 11, 0.10)',
      mesh3: isSurgeActive
        ? 'rgba(220, 38, 38, 0.18)'
        : 'rgba(239, 68, 68, 0.08)',
      meshPos1: '35% 20%',
      meshPos2: '72% 80%',
      isLight: false,
    };
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

    // Cursor tracking for interactive street-level heat plumes
    const mouse = { x: width * 0.5, y: height * 0.65, active: false };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Thermal FLIR / Heatwave Ember Palette
    const palette = [
      { r: 239, g: 68, b: 68 },   // Crimson Heat Hazard (#EF4444)
      { r: 249, g: 115, b: 22 },  // Solar Orange (#F97316)
      { r: 245, g: 158, b: 11 },  // Thermal Amber (#F59E0B)
      { r: 251, g: 191, b: 36 },  // Incandescent Gold (#FBBF24)
      { r: 220, g: 38, b: 38 },   // Deep Infrared Red (#DC2626)
    ];

    // 1. Rising Thermal Embers & Micro-Convection Particles
    const particles = Array.from({ length: 68 }, (_, idx) => {
      const col = palette[idx % palette.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.6 + 0.9,
        baseVy: -(Math.random() * 0.75 + 0.25), // Rising upward like hot air
        wobbleAmp: Math.random() * 0.8 + 0.3,
        wobbleFreq: Math.random() * 0.025 + 0.01,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.42 + 0.14,
        color: col,
        glow: idx % 3 === 0, // Every 3rd ember has a soft thermal halo
      };
    });

    // 2. Rising Heat-Haze Mirage Ribbons (Sinusoidal Thermal Waves)
    const heatRibbons = Array.from({ length: 6 }, (_, idx) => ({
      yRatio: 0.18 + idx * 0.15,
      amplitude: 18 + idx * 5,
      wavelength: 0.0035 + (idx % 2) * 0.0015,
      speed: 0.018 + idx * 0.004,
      phase: idx * 1.3,
      color: idx % 2 === 0 ? '249, 115, 22' : '239, 68, 68',
      alpha: 0.045 + (idx % 3) * 0.015,
    }));

    // 3. Expanding Topographic Heat-Island Isotherm Rings
    const isotherms = [
      { xRatio: 0.22, yRatio: 0.32, maxR: 380, phase: 0.0, color: '239, 68, 68' },
      { xRatio: 0.78, yRatio: 0.68, maxR: 440, phase: 0.35, color: '249, 115, 22' },
      { xRatio: 0.50, yRatio: 0.88, maxR: 520, phase: 0.7, color: '245, 158, 11' },
    ];

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const surgeMultiplier = isSurgeActive ? 1.85 : 1.0;

      // A. Draw Street-Level Asphalt Radiant Horizon Glow at bottom of viewport
      const horizonGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
      horizonGrad.addColorStop(0, 'rgba(18, 22, 26, 0)');
      horizonGrad.addColorStop(
        0.65,
        isSurgeActive ? 'rgba(220, 38, 38, 0.09)' : 'rgba(234, 88, 12, 0.05)'
      );
      horizonGrad.addColorStop(
        1,
        isSurgeActive ? 'rgba(239, 68, 68, 0.22)' : 'rgba(249, 115, 22, 0.12)'
      );
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, height * 0.55, width, height * 0.45);

      // B. Draw Interactive Cursor Thermal Hotspot Plume (subtle warm aura)
      if (mouse.active) {
        const cursorGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          10,
          mouse.x,
          mouse.y,
          280
        );
        cursorGrad.addColorStop(0, 'rgba(249, 115, 22, 0.09)');
        cursorGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.04)');
        cursorGrad.addColorStop(1, 'rgba(18, 22, 26, 0)');
        ctx.fillStyle = cursorGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2);
        ctx.fill();
      }

      // C. Draw Expanding Topographic Thermal Isotherm Contours
      isotherms.forEach((iso) => {
        const cx = width * iso.xRatio;
        const cy = height * iso.yRatio;
        // Draw 3 concentric pulsing isotherm rings per heat island center
        for (let ring = 0; ring < 3; ring++) {
          const progress = ((tick * 0.0022 * surgeMultiplier + iso.phase + ring * 0.33) % 1);
          const radius = 50 + progress * iso.maxR;
          const ringAlpha = (1 - progress) * (isSurgeActive ? 0.14 : 0.08);

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

      // D. Draw Rising Heat-Haze Mirage Waves (Sinusoidal Thermal Distortion Ribbons)
      heatRibbons.forEach((ribbon, idx) => {
        ribbon.phase += ribbon.speed * surgeMultiplier;
        // Slowly drift upward and wrap
        const verticalDrift = ((tick * 0.25 + idx * 120) % (height * 0.9));
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
        const finalAlpha = ribbon.alpha * Math.max(0.15, edgeFade) * (isSurgeActive ? 1.6 : 1);
        ctx.strokeStyle = `rgba(${ribbon.color}, ${finalAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.75;
        ctx.stroke();
        ctx.restore();
      });

      // E. Draw Rising Thermal Embers & Shimmering Updraft Sparks
      particles.forEach((p) => {
        p.phase += p.wobbleFreq * surgeMultiplier;
        // Sinusoidal horizontal heat shimmer as the ember rises
        p.x += Math.sin(p.phase) * p.wobbleAmp;
        p.y += p.baseVy * surgeMultiplier;

        // Wrap around top/sides
        if (p.y < -20) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 15;
        if (p.x > width + 20) p.x = -15;

        // Pulsing ember luminance
        const pulse = 0.75 + 0.25 * Math.sin(p.phase * 2.2);
        const alpha = Math.min(0.85, p.alpha * pulse * (isSurgeActive ? 1.35 : 1));
        const { r, g, b } = p.color;

        // Soft thermal halo for larger convection embers
        if (p.glow) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5.5);
          glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.45).toFixed(3)})`);
          glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core ember particle + vertical heat streak
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 0.85, p.r * 1.35, 0, 0, Math.PI * 2);
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
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Layer 1: Breathing Infrared Heat-Dome Radial Plumes */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            radial-gradient(circle at ${theme.meshPos1}, ${theme.mesh1} 0%, transparent 52%),
            radial-gradient(circle at ${theme.meshPos2}, ${theme.mesh2} 0%, transparent 58%),
            radial-gradient(circle at 50% 92%, ${theme.mesh3} 0%, transparent 65%)
          `,
        }}
      />

      {/* Layer 2: Animated Solar Thermal Aura Blobs (Slow Convection Drift) */}
      <div
        className={`absolute -top-32 left-1/4 w-[38rem] h-[38rem] rounded-full blur-[130px] mix-blend-screen transition-opacity duration-1000 ${
          isIntroRevealed ? 'opacity-35' : 'opacity-0'
        } ${isSurgeActive ? 'bg-red-600/30 animate-pulse' : 'bg-orange-500/20 animate-pulse'}`}
        style={{ animationDuration: '7s' }}
      />
      <div
        className={`absolute -bottom-40 right-1/5 w-[44rem] h-[44rem] rounded-full blur-[140px] mix-blend-screen transition-opacity duration-1000 ${
          isIntroRevealed ? 'opacity-35' : 'opacity-0'
        } ${isSurgeActive ? 'bg-orange-600/35 animate-pulse' : 'bg-amber-500/15 animate-pulse'}`}
        style={{ animationDuration: '9s' }}
      />

      {/* Layer 3: Dark Architectural & Thermal Sensor Grid */}
      <div
        className={`absolute inset-0 engineering-grid-bg transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-65' : 'opacity-0'
        }`}
      />

      {/* Layer 4: Live HTML5 Canvas — Rising Embers, Mirage Waves & Isotherm Contours */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
          isIntroRevealed ? 'opacity-95' : 'opacity-0'
        }`}
      />

      {/* Layer 5: Subtle Perimeter Heatwave Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: isSurgeActive
            ? 'inset 0 0 140px rgba(220, 38, 38, 0.22)'
            : 'inset 0 0 110px rgba(234, 88, 12, 0.09)',
        }}
      />

      {/* Layer 6: Emergency Thermal Surge Warm Glow Overlay */}
      {isSurgeActive && (
        <div className="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse duration-1000" />
      )}
    </div>
  );
};
