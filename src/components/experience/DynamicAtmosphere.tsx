import React, { useEffect, useState, useMemo } from 'react';

export type StoryAct =
  | 'wow_hero'
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
          bgColor: '#040711',
          mesh1: 'rgba(239, 68, 68, 0.22)',
          mesh2: 'rgba(245, 158, 11, 0.18)',
          mesh3: 'rgba(30, 58, 138, 0.35)',
          meshPos1: '60% 30%',
          meshPos2: '30% 70%',
          particleColor: '#f59e0b',
          heatAuraOpacity: 0.15,
          tempIndicator: '38.0°C Ambient',
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

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ease-out"
      style={{
        backgroundColor: isSurgeActive ? '#260404' : theme.bgColor,
      }}
    >
      {/* Dynamic Scroll-Responsive Mesh Gradient Layer 1 */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out blur-[150px]"
        style={{
          background: `radial-gradient(circle at ${theme.meshPos1}, ${isSurgeActive ? 'rgba(239, 68, 68, 0.6)' : theme.mesh1} 0%, transparent 60%)`,
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
        className="absolute inset-0 opacity-20 transition-opacity duration-1000"
        style={{
          backgroundImage: `radial-gradient(${theme.particleColor} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Thermal Plume Turbulent Distortion Shimmer (peaks during problem/tension) */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none mix-blend-screen"
        style={{
          opacity: isSurgeActive ? 0.75 : theme.heatAuraOpacity,
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.4) 0%, rgba(245,158,11,0.2) 30%, transparent 70%)',
        }}
      />
    </div>
  );
};
