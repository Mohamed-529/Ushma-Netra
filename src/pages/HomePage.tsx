import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import { StoryAct } from '../components/experience/DynamicAtmosphere';
import { WowHero } from '../components/experience/WowHero';
import { ScrollDrivenShowcase } from '../components/experience/ScrollDrivenShowcase';
import { AlternatingFeatureShowcase } from '../components/experience/AlternatingFeatureShowcase';
import {
  Scan,
  Radio,
  Scale,
  Wind,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  buildings: BuildingAudit[];
  selectedBuilding: BuildingAudit;
  onSelectBuilding: (b: BuildingAudit) => void;
  vendors: VendorTelemetry[];
  selectedVendor: VendorTelemetry;
  onSelectVendor: (v: VendorTelemetry) => void;
  isMitigated: boolean;
  onMitigationToggle: (mitigated: boolean) => void;
  onApplyMitigation: (buildingId: string, intervention: string) => void;
  onSimulateSurge: () => void;
  onScrollToAct: (act: StoryAct) => void;
  isIntroRevealed?: boolean;
  onTypingComplete?: () => void;
  onReplayIntro?: () => void;
  replayTrigger?: number;
}

export const HomePage: React.FC<Props> = ({
  onSimulateSurge,
  onScrollToAct,
  isIntroRevealed = true,
  onTypingComplete,
  onReplayIntro,
  replayTrigger = 0,
}) => {
  const navigate = useNavigate();
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  // Simple, zero-jargon 4-step visual workflow mapped onto one clear street-canyon picture
  const workflowSteps = [
    {
      num: '01',
      shortTitle: 'Spot the AC Heat',
      simpleLine: 'AI cameras count AC vents blowing 54°C heat into the street.',
      statTag: '68 AC Vents Found',
      pinTop: '24%',
      pinLeft: '26%',
      color: 'bg-rose-500 border-rose-300 text-white',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      icon: Scan,
      route: '/scanner',
    },
    {
      num: '02',
      shortTitle: 'Warn the Vendor',
      simpleLine: 'Solar cart sensor speaks a voice alert in Hindi & English.',
      statTag: '36.8°C Voice Alert',
      pinTop: '68%',
      pinLeft: '36%',
      color: 'bg-amber-400 border-amber-200 text-slate-950',
      badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
      icon: Radio,
      route: '/watchlist',
    },
    {
      num: '03',
      shortTitle: 'Bill the Tower',
      simpleLine: 'The heat-dumping building gets an automatic cooling fine.',
      statTag: '₹1.85L Heat Fine',
      pinTop: '34%',
      pinLeft: '74%',
      color: 'bg-sky-400 border-sky-200 text-slate-950',
      badgeBg: 'bg-sky-400/20 text-sky-300 border-sky-400/40',
      icon: Scale,
      route: '/ledger',
    },
    {
      num: '04',
      shortTitle: 'Cool the Street',
      simpleLine: '45° upward louvers and cool mist drop street heat by 4.2°C.',
      statTag: '-4.2°C Cool Mist',
      pinTop: '62%',
      pinLeft: '72%',
      color: 'bg-emerald-400 border-emerald-200 text-slate-950',
      badgeBg: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
      icon: Wind,
      route: '/twin',
    },
  ];

  const activeStep = workflowSteps[activeStepIdx];

  return (
    <div className="w-full">
      {/* Slide 1: Project Intro Hero (Single Impact Statement + One Main Interactive Button) */}
      <div id="wow_hero">
        <WowHero
          onScrollToProblem={() => navigate('/twin')}
          onJumpToLive={() => navigate('/twin')}
          isIntroRevealed={isIntroRevealed}
          onTypingComplete={onTypingComplete}
          onReplayIntro={onReplayIntro}
          replayTrigger={replayTrigger}
        />
      </div>

      {/* Remaining Landing Page Content — Smoothly Revealed After Hero Typewriter Completes */}
      <div
        className={`transition-opacity duration-1000 ease-out ${
          isIntroRevealed
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Slide 2: Single Section with 4 Short Crisp Points Left & Related Picture Right */}
        <ScrollDrivenShowcase
          onReplayIntro={() => {
            if (onReplayIntro) onReplayIntro();
          }}
        />

        {/* Slide 3: Alternating Two-Column Z-Pattern Visual Feature Showcase */}
        <AlternatingFeatureShowcase />

        {/* Slide 4 (Replaced Overlap Section): One Visual Street Diagram Explaining How All 4 Work Together Simply */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
              How The 4 Steps Work Together
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              One Street. Four Simple Steps.
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Click any number on the picture to see how we turn AC waste heat into cool air.
            </p>
          </div>

          <div className="rounded-3xl bg-[#0b111e] border border-white/10 shadow-2xl overflow-hidden">
            {/* Top Part: Interactive Single Picture Diagram with 4 Numbered Hotspots */}
            <div className="relative h-[360px] sm:h-[440px] w-full overflow-hidden select-none">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
                alt="Street canyon visual diagram showing all 4 steps working together"
                className="w-full h-full object-cover opacity-55"
              />
              {/* Clean Visual Gradient Overlay (Hot Left -> Cool Right) */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950/70 via-[#0b111e]/55 to-emerald-950/70" />

              {/* SVG Dotted Flow Line Connecting Step 01 -> 02 -> 03 -> 04 on the Picture */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <path
                  d="M 26 24 L 36 68 L 74 34 L 72 62"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.55)"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
              </svg>

              {/* 4 Clickable Numbered Hotspot Pins Directly on the Picture */}
              {workflowSteps.map((step, idx) => {
                const isSelected = idx === activeStepIdx;
                const Icon = step.icon;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStepIdx(idx)}
                    style={{ top: step.pinTop, left: step.pinLeft }}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 flex items-center gap-2 px-3.5 py-2 rounded-full border-2 font-mono text-xs font-bold shadow-xl transition-all cursor-pointer ${
                      isSelected
                        ? `${step.color} scale-110 ring-4 ring-white/25`
                        : 'bg-[#0b111e]/90 border-slate-600 text-white hover:scale-105'
                    }`}
                  >
                    <span className="font-black">{step.num}</span>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{step.shortTitle}</span>
                  </button>
                );
              })}

              {/* Floating Active Step Spotlight Card Inside Bottom of Picture */}
              <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 p-4 sm:p-5 rounded-2xl bg-[#0b1b2d]/95 border border-slate-700/90 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-2xl">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-black shrink-0 border ${activeStep.color}`}
                  >
                    {activeStep.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {activeStep.shortTitle}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${activeStep.badgeBg}`}
                      >
                        {activeStep.statTag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                      {activeStep.simpleLine}
                    </p>
                  </div>
                </div>

                <Link
                  to={activeStep.route}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold shrink-0 transition-colors"
                >
                  <span>Try Step {activeStep.num}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bottom Part: 4 Clean Connected Flow Pills (1 -> 2 -> 3 -> 4) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 bg-[#11192b]">
              {workflowSteps.map((step, idx) => {
                const isSelected = idx === activeStepIdx;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStepIdx(idx)}
                    className={`p-4 sm:p-5 text-left transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#1a2942] text-white'
                        : 'hover:bg-[#162238] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        STEP {step.num}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isSelected ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      {step.shortTitle}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {step.simpleLine}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
