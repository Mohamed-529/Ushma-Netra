import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry, IncidentLog } from '../types';
import { StoryAct } from '../components/experience/DynamicAtmosphere';
import { WowHero } from '../components/experience/WowHero';
import { SpatialWorkspaceAct } from '../components/experience/SpatialWorkspaceAct';
import { VisceralProblem } from '../components/experience/VisceralProblem';
import { WhyThisMatters } from '../components/experience/WhyThisMatters';
import { SolutionReveal } from '../components/experience/SolutionReveal';
import { LiveProductCockpit } from '../components/experience/LiveProductCockpit';
import { ProofValidation } from '../components/experience/ProofValidation';
import { TechnologyBlueprint } from '../components/experience/TechnologyBlueprint';
import { FinalDemoDecree } from '../components/experience/FinalDemoDecree';
import { MunicipalDefenseChallenge } from '../components/experience/MunicipalDefenseChallenge';
import { GrandFinaleFooter } from '../components/experience/GrandFinaleFooter';
import {
  MapPin,
  Satellite,
  BookOpen,
  Bell,
  Scale,
  Box,
  Scan,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Flame,
  Activity
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
}

export const HomePage: React.FC<Props> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  vendors,
  selectedVendor,
  onSelectVendor,
  isMitigated,
  onMitigationToggle,
  onApplyMitigation,
  onSimulateSurge,
  onScrollToAct,
}) => {
  const navigate = useNavigate();

  const moduleGateways = [
    {
      title: 'Thermal Grid Registry',
      path: '/grid',
      badge: 'National Database',
      icon: MapPin,
      color: 'text-amber-400',
      description: 'Explore 10+ monitored urban micro-canyons across Delhi NCR, Mumbai, Bengaluru, and Ahmedabad with satellite LST overlays.',
      stats: `${buildings.length} Monitored Zones`,
    },
    {
      title: 'How It Works Pipeline',
      path: '/how-it-works',
      badge: '6-Stage Closed-Loop',
      icon: Satellite,
      color: 'text-sky-400',
      description: 'Satellite thermal IR, edge YOLOv8 façade vision, Eulerian plume CFD, IoT BLE mesh, and autonomous SCADA misting.',
      stats: 'End-to-End Pipeline',
    },
    {
      title: 'Scientific Methodology',
      path: '/methodology',
      badge: 'Thermodynamics & Math',
      icon: BookOpen,
      color: 'text-purple-400',
      description: 'Peer-reviewed heat rejection derivations, interactive micro-canyon calculator, and satellite calibration curves.',
      stats: 'Interactive Model Solver',
    },
    {
      title: 'Heat Surge Watchlist',
      path: '/watchlist',
      badge: 'Early Warning Center',
      icon: Bell,
      color: 'text-rose-400',
      description: 'Real-time alert streams, custom hotspot pins, and multi-lingual WhatsApp/SMS emergency dispatch simulator.',
      stats: 'Real-Time Telemetry',
    },
    {
      title: 'Municipal Debt Ledger',
      path: '/ledger',
      badge: 'Civic Governance',
      icon: Scale,
      color: 'text-emerald-400',
      description: 'Commercial AC polluter leaderboard, Section 133 CrPC statutory penalty notices, and vendor dividend redistribution.',
      stats: `₹${(buildings.reduce((s, b) => s + b.monthlyExhaustTaxInr, 0) / 100000).toFixed(1)}L Monthly Levies`,
    },
    {
      title: '3D CFD Digital Twin Lab',
      path: '/twin',
      badge: 'Interactive WebGL',
      icon: Box,
      color: 'text-amber-300',
      description: 'Full-bleed physics-informed 3D fluid simulation with wind tunnel controls, temperature sliders, and SCADA relays.',
      stats: '60 FPS Physics Engine',
    },
    {
      title: 'AI Façade CV Scanner',
      path: '/scanner',
      badge: 'Edge YOLOv8 Vision',
      icon: Scan,
      color: 'text-cyan-400',
      description: 'Edge camera inference extracting split ACs, VRF condensers, and chiller exhaust heat leakage in real time.',
      stats: 'Sub-15ms Edge Inference',
    },
  ];

  return (
    <div className="w-full">
      {/* Act 1: Flagship Wow Hero */}
      <div id="wow_hero">
        <WowHero
          onScrollToProblem={() => onScrollToAct('problem')}
          onJumpToLive={() => navigate('/twin')}
        />
      </div>

      {/* Quick Launchpad Gateway Section to all dedicated endpoints */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Multi-Module Navigation
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-400">
              Dedicated URL Endpoints &amp; Deep Systems
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore Ushma-Netra Subsystems
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Every module features a dedicated URL route, full-featured interactivity, and deep technical capabilities designed to beat single-purpose environmental dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {moduleGateways.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.path}
                to={m.path}
                className="group p-5 rounded-2xl bg-[#0c0c14] hover:bg-[#12121c] border border-zinc-800/80 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-lg hover:shadow-amber-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                      {m.badge}
                    </span>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-tight mb-1.5">
                    {m.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 text-[11px]">{m.stats}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Act 2: 3D Spatial Architecture Workspace (Screen 2: Pure White Lab Bench, Multicolor Tokens, Free-Flow Scroll) */}
      <div id="workspace">
        <SpatialWorkspaceAct onScrollToProblem={() => onScrollToAct('problem')} />
      </div>

      {/* Act 3: Anthropogenic Canyon Thermodynamics Problem */}
      <div id="problem">
        <VisceralProblem />
      </div>

      {/* Act 4: Human Collateral & Rameshwar Pal Story */}
      <div id="tension">
        <WhyThisMatters />
      </div>

      {/* Act 5: Solution Reveal (Edge CV + Plume Model + IoT Mesh + SCADA) */}
      <div id="solution">
        <SolutionReveal onScrollToLive={() => onScrollToAct('live_cockpit')} />
      </div>

      {/* Act 6: Live Product Cockpit */}
      <div id="live_cockpit">
        <LiveProductCockpit
          building={selectedBuilding}
          allBuildings={buildings}
          onSelectBuilding={onSelectBuilding}
          vendor={selectedVendor}
          allVendors={vendors}
          onSelectVendor={onSelectVendor}
          isMitigated={isMitigated}
          onMitigationToggle={onMitigationToggle}
          onApplyMitigation={onApplyMitigation}
          onSimulateSurge={onSimulateSurge}
        />
      </div>

      {/* Act 7: Proof & Scientific Validation */}
      <div id="proof">
        <ProofValidation />
      </div>

      {/* Act 8: Technology Blueprint & AWS Architecture */}
      <div id="technology">
        <TechnologyBlueprint />
      </div>

      {/* Act 9: Municipal Defense Challenge */}
      <div id="challenge">
        <MunicipalDefenseChallenge />
      </div>

      {/* Act 10: Final Demo Decree */}
      <div id="final_demo">
        <FinalDemoDecree />
      </div>

      {/* Grand Finale Footer */}
      <GrandFinaleFooter
        onNavigateTo={onScrollToAct}
        onSimulateSurge={onSimulateSurge}
      />
    </div>
  );
};
