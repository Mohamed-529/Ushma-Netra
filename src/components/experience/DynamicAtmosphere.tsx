import React, { useEffect, useState, useMemo } from 'react';

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
}

export const DynamicAtmosphere: React.FC<Props> = ({ activeAct, isSurgeActive }) => {
  // Cohesive Warm Magazine Canvas across ALL pages & story acts (#e6dfd3 canvas + #0b1b2d midnight blue text)
  const theme = useMemo(() => {
    return {
      bgColor: '#e6dfd3', // luxury warm magazine linen canvas
      mesh1: isSurgeActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(235, 218, 198, 0.70)',
      mesh2: 'rgba(250, 245, 237, 0.85)',
      mesh3: isSurgeActive ? 'rgba(249, 115, 22, 0.12)' : 'rgba(245, 230, 205, 0.50)',
      meshPos1: '45% 25%',
      meshPos2: '65% 75%',
      particleColor: '#b8a894',
      heatAuraOpacity: isSurgeActive ? 0.25 : 0.05,
      tempIndicator: '38.0°C Thermal Ambient',
      isLight: true,
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

    // Warm organic air particles
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.15,
      alpha: Math.random() * 0.25 + 0.08,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Subtle warm wave streamlines
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 168, 148, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Warm Ambient Radial Gradients */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `
            radial-gradient(circle at ${theme.meshPos1}, ${theme.mesh1} 0%, transparent 55%),
            radial-gradient(circle at ${theme.meshPos2}, ${theme.mesh2} 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, ${theme.mesh3} 0%, transparent 70%)
          `,
        }}
      />

      {/* Warm Magazine Architectural Grid */}
      <div className="absolute inset-0 engineering-grid-bg opacity-40 mix-blend-multiply" />

      {/* Kinetic Ambient Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Emergency Thermal Surge Warm Glow Overlay */}
      {isSurgeActive && (
        <div className="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse duration-1000" />
      )}
    </div>
  );
};
