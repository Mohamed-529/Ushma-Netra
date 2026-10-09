import React, { useEffect, useState } from 'react';
import { Flame, Play, Box, Sparkles, ShieldCheck, Cloud, Compass } from 'lucide-react';

interface Props {
  currentAct: string;
  onNavigateAct: (actId: string) => void;
  onSimulateSurge: () => void;
}

export const FloatingChapterNav: React.FC<Props> = ({
  currentAct,
  onNavigateAct,
  onSimulateSurge,
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const acts = [
    { id: 'act-hero', label: 'I. Problem' },
    { id: 'act-tension', label: 'II. Injustice' },
    { id: 'act-human', label: 'III. Lethality' },
    { id: 'act-insight', label: 'IV. Insight' },
    { id: 'live-system', label: 'V. Live 3D' },
    { id: 'architecture', label: 'VI. Cloud' },
    { id: 'proof', label: 'VII. Proof' },
    { id: 'interactive-readme', label: 'VIII. 3D Readme' },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto bg-[#0a0f1d]/90 backdrop-blur-xl border border-slate-800 rounded-full py-2 px-3 shadow-2xl flex items-center gap-1.5 sm:gap-2 text-[11px] font-mono">
        {/* Progress Bar indicator */}
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1" />

        {acts.map((act) => {
          const isActive = currentAct === act.id;
          return (
            <button
              key={act.id}
              onClick={() => onNavigateAct(act.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {act.label}
            </button>
          );
        })}

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Instant Surge Trigger Button */}
        <button
          onClick={onSimulateSurge}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] tracking-wider uppercase transition-all shadow-md shadow-red-600/30 cursor-pointer"
        >
          <Flame className="w-3 h-3 fill-current" />
          <span>Surge</span>
        </button>
      </div>
    </div>
  );
};
