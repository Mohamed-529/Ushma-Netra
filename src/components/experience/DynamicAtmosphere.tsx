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
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute theme colors and aura properties based on current story act
  const theme = useMemo(() => {
    switch (activeAct) {
      case 'wow_hero':
        return {
          bgColor: '#faf7f2', // mild pleasant sandalwood white canvas
          mesh1: 'rgba(237, 222, 206, 0.65)', // warm sandalwood glow
          mesh2: 'rgba(247, 240, 232, 0.85)', // rich creamy ivory sheen
          mesh3: 'rgba(254, 243, 199, 0.50)', // soft natural sunlight amber
          meshPos1: '50% 20%',
          meshPos2: '35% 65%',
          particleColor: '#c9b9a6',
          heatAuraOpacity: 0.04,
          tempIndicator: '38.0°C Ambient',
          isLight: true,
        };
      case 'workspace':
        return {
          bgColor: '#05070e',
          mesh1: 'rgba(6, 182, 212, 0.25)',
          mesh2: 'rgba(139, 92, 246, 0.22)',
          mesh3: 'rgba(16, 185, 129, 0.2)',
          meshPos1: '40% 30%',
          meshPos2: '70% 65%',
          particleColor: '#38bdf8',
          heatAuraOpacity: 0.18,
          tempIndicator: '3D Spatial Test-Bench',
        };
      case 'problem':
        return {
          bgColor: '#170505',
          mesh1: 'rgba(239, 68, 68, 0.45)',
          mesh2: 'rgba(185, 28, 28, 0.35)',
          mesh3: 'rgba(245, 158, 11, 0.25)',
          meshPos1: '70% 50%',
          meshPos2: '20% 60%',
          particleColor: '#ef4444',
          heatAuraOpacity: 0.45,
          tempIndicator: '53.6°C Exhaust Plume',
        };
      case 'tension':
        return {
          bgColor: '#1f0606',
          mesh1: 'rgba(220, 38, 38, 0.55)',
          mesh2: 'rgba(153, 27, 27, 0.45)',
          mesh3: 'rgba(251, 146, 60, 0.3)',
          meshPos1: '50% 40%',
          meshPos2: '80% 60%',
          particleColor: '#f87171',
          heatAuraOpacity: 0.6,
          tempIndicator: '36.8°C WBGT Lethal Trap',
        };
      case 'solution':
        return {
          bgColor: '#060e1d',
          mesh1: 'rgba(6, 182, 212, 0.35)',
          mesh2: 'rgba(59, 130, 246, 0.3)',
          mesh3: 'rgba(16, 185, 129, 0.2)',
          meshPos1: '30% 40%',
          meshPos2: '70% 60%',
          particleColor: '#38bdf8',
          heatAuraOpacity: 0.15,
          tempIndicator: 'Sensing & Policy Convergence',
        };
      case 'live_cockpit':
        return {
          bgColor: '#060913',
          mesh1: 'rgba(14, 165, 233, 0.3)',
          mesh2: 'rgba(245, 158, 11, 0.2)',
          mesh3: 'rgba(16, 185, 129, 0.2)',
          meshPos1: '50% 20%',
          meshPos2: '50% 80%',
          particleColor: '#38bdf8',
          heatAuraOpacity: 0.2,
          tempIndicator: 'Live WebGL Spatial Engine',
        };
      case 'proof':
        return {
          bgColor: '#04130f',
          mesh1: 'rgba(16, 185, 129, 0.35)',
          mesh2: 'rgba(5, 150, 105, 0.25)',
          mesh3: 'rgba(14, 165, 233, 0.2)',
          meshPos1: '70% 40%',
          meshPos2: '25% 70%',
          particleColor: '#34d399',
          heatAuraOpacity: 0.1,
          tempIndicator: '-4.2°C Measured Reduction',
        };
      case 'technology':
        return {
          bgColor: '#070b1a',
          mesh1: 'rgba(59, 130, 246, 0.35)',
          mesh2: 'rgba(139, 92, 246, 0.3)',
          mesh3: 'rgba(14, 165, 233, 0.25)',
          meshPos1: '40% 30%',
          meshPos2: '60% 70%',
          particleColor: '#60a5fa',
          heatAuraOpacity: 0.15,
          tempIndicator: 'AWS EventBridge & Bedrock',
        };
      case 'final_demo':
        return {
          bgColor: '#090814',
          mesh1: 'rgba(245, 158, 11, 0.35)',
          mesh2: 'rgba(168, 85, 247, 0.25)',
          mesh3: 'rgba(16, 185, 129, 0.25)',
          meshPos1: '50% 50%',
          meshPos2: '30% 80%',
          particleColor: '#fbbf24',
          heatAuraOpacity: 0.2,
          tempIndicator: 'Statutory Section 133 Decree',
        };
      case 'challenge':
        return {
          bgColor: '#0a0d18',
          mesh1: 'rgba(239, 68, 68, 0.35)',
          mesh2: 'rgba(245, 158, 11, 0.3)',
          mesh3: 'rgba(16, 185, 129, 0.25)',
          meshPos1: '50% 30%',
          meshPos2: '50% 70%',
          particleColor: '#f59e0b',
          heatAuraOpacity: 0.25,
          tempIndicator: '48-Hour Defense Simulation',
        };
    }
  }, [activeAct]);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle wavy kinetic thermal isotherms
      ctx.lineWidth = 1;
      const waveCount = 4;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const baseAlpha = isSurgeActive ? 0.18 : 0.07;
        const color = i % 2 === 0 ? `rgba(245, 158, 11, ${baseAlpha})` : `rgba(239, 68, 68, ${baseAlpha * 0.8})`;
        ctx.strokeStyle = color;

        const yOffset = h * 0.45 + i * 85 + Math.sin(t * 0.5 + i) * 35;
        for (let x = 0; x <= w; x += 15) {
          const wave1 = Math.sin(x * 0.003 + t + i * 1.2) * 28;
          const wave2 = Math.cos(x * 0.007 - t * 0.8) * 16;
          const y = yOffset + wave1 + wave2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isSurgeActive]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ease-out"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Structural Grid Blocks */}
      <div
        className={`absolute inset-0 engineering-grid-bg transition-opacity duration-700 ${
          (theme as any).isLight ? 'opacity-25' : 'opacity-70'
        }`}
      />

      {/* Fluid Kinetic Thermal Waves (WebGL / Canvas Wave Shimmer) */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          (theme as any).isLight ? 'opacity-30 mix-blend-multiply' : 'opacity-80 mix-blend-screen'
        }`}
      />

      {/* Dynamic Scroll-Responsive Mesh Gradient Layer 1 */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out blur-[150px]"
        style={{
          background: `radial-gradient(circle at ${theme.meshPos1}, ${isSurgeActive ? 'rgba(239, 68, 68, 0.45)' : theme.mesh1} 0%, transparent 60%)`,
          transform: `translateY(${Math.sin(scrollY * 0.001) * 30}px)`,
        }}
      />

      {/* Dynamic Mesh Gradient Layer 2 */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out blur-[160px]"
        style={{
          background: `radial-gradient(circle at ${theme.meshPos2}, ${theme.mesh2} 0%, transparent 65%)`,
          transform: `translateY(${Math.cos(scrollY * 0.001) * -25}px)`,
        }}
      />

      {/* Dynamic Mesh Gradient Layer 3 */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out blur-[180px]"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${theme.mesh3} 0%, transparent 70%)`,
        }}
      />

      {/* Micro-Particle Thermal Mesh */}
      <div
        className="absolute inset-0 opacity-15 transition-opacity duration-1000"
        style={{
          backgroundImage: `radial-gradient(${theme.particleColor} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Thermal Plume Turbulent Distortion Shimmer */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none mix-blend-screen"
        style={{
          opacity: isSurgeActive ? 0.65 : theme.heatAuraOpacity * 0.7,
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.3) 0%, rgba(245,158,11,0.15) 30%, transparent 70%)',
        }}
      />
    </div>
  );
};
