import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import { StoryAct } from '../components/experience/DynamicAtmosphere';
import { WowHero } from '../components/experience/WowHero';
import { ScrollDrivenShowcase } from '../components/experience/ScrollDrivenShowcase';
import { AlternatingFeatureShowcase } from '../components/experience/AlternatingFeatureShowcase';
import { GrandFinaleFooter } from '../components/experience/GrandFinaleFooter';
import {
  MapPin,
  Scale,
  Box,
  Scan,
  ArrowRight,
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

  const moduleGateways = [
    {
      title: 'Thermal Grid Map',
      path: '/grid',
      icon: MapPin,
      description: 'See hot buildings and street canyons across Indian cities.',
      image:
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: '3D Digital Twin',
      path: '/twin',
      icon: Box,
      description: 'Test upward AC louvers and street mist cooling in 3D.',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'AI Camera Scanner',
      path: '/scanner',
      icon: Scan,
      description: 'Scan building walls to count outdoor AC heat vents.',
      image:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Thermal Debt Ledger',
      path: '/ledger',
      icon: Scale,
      description: 'Track polluter fines that pay for vendor cooling kiosks.',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
  ];

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

        {/* Clean 4-Card Visual Launchpad */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-2 mb-8">
            <div className="text-xs font-mono text-[#a8321a] font-semibold uppercase tracking-wider">
              Explore Live Tools
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0b1b2d] tracking-tight">
              One-Click Platform Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moduleGateways.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.path}
                  to={m.path}
                  className="group rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] hover:border-[#b8ad9d] overflow-hidden transition-all flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-[#0b111e]">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b111e]/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 p-2 rounded-xl bg-[#0b111e]/90 text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0b1b2d] group-hover:text-[#a8321a] transition-colors mb-1">
                        {m.title}
                      </h3>
                      <p className="text-xs text-[#1f3044] leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#d6cebe]/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#a8321a] font-bold flex items-center gap-1">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Grand Finale Footer with Interactive Glowing Particle Logo */}
        <GrandFinaleFooter
          onNavigateTo={onScrollToAct}
          onSimulateSurge={onSimulateSurge}
        />
      </div>
    </div>
  );
};
