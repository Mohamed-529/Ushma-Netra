import React, { useState, useEffect } from 'react';
import { BuildingAudit, VendorTelemetry, IncidentLog } from './types';
import { INITIAL_BUILDINGS, INITIAL_VENDORS, INITIAL_LOGS } from './data/mockData';
import { DynamicAtmosphere, StoryAct } from './components/experience/DynamicAtmosphere';
import { DirectorsFloatingHUD } from './components/experience/DirectorsFloatingHUD';
import { WowHero } from './components/experience/WowHero';
import { VisceralProblem } from './components/experience/VisceralProblem';
import { WhyThisMatters } from './components/experience/WhyThisMatters';
import { SolutionReveal } from './components/experience/SolutionReveal';
import { LiveProductCockpit } from './components/experience/LiveProductCockpit';
import { ProofValidation } from './components/experience/ProofValidation';
import { TechnologyBlueprint } from './components/experience/TechnologyBlueprint';
import { FinalDemoDecree } from './components/experience/FinalDemoDecree';
import { MunicipalDefenseChallenge } from './components/experience/MunicipalDefenseChallenge';
import { soundEngine } from './utils/audioSynthesizer';
import { Flame, AlertTriangle, ShieldCheck, X, Activity } from 'lucide-react';

export default function App() {
  const [activeAct, setActiveAct] = useState<StoryAct>('wow_hero');
  const [buildings, setBuildings] = useState<BuildingAudit[]>(INITIAL_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingAudit>(INITIAL_BUILDINGS[0]);
  const [vendors, setVendors] = useState<VendorTelemetry[]>(INITIAL_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState<VendorTelemetry>(INITIAL_VENDORS[0]);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);
  const [logs, setLogs] = useState<IncidentLog[]>(INITIAL_LOGS);
  const [surgeModalOpen, setSurgeModalOpen] = useState<boolean>(false);

  // Smooth scroll to target story act
  const scrollToAct = (act: StoryAct) => {
    const el = document.getElementById(act);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveAct(act);
  };

  // Track active act on scroll using IntersectionObserver
  useEffect(() => {
    const actIds: StoryAct[] = [
      'wow_hero',
      'problem',
      'tension',
      'solution',
      'live_cockpit',
      'proof',
      'technology',
      'final_demo',
      'challenge',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as StoryAct;
            if (actIds.includes(id)) {
              setActiveAct(id);
            }
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    actIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Trigger peak crisis simulation
  const handleSimulateSurge = () => {
    setIsMitigated(false);
    setSurgeModalOpen(true);
    soundEngine.playSpikeAlert();

    const newLog: IncidentLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'exhaust_spike',
      tier: 1,
      title: 'City-Wide Peak Cooling Heat Surge Triggered',
      detail: `Commercial AC rejection spiked to 638.4 kW at ${selectedBuilding.name}. Ambient alley WBGT crossed 36.8°C lethal threshold.`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Apply restorative engineering mitigation
  const handleApplyMitigation = (buildingId: string, intervention: string) => {
    setIsMitigated(true);
    setBuildings((prev) =>
      prev.map((b) => {
        if (b.id === buildingId) {
          return {
            ...b,
            mitigationStatus: 'compliant',
            monthlyExhaustTaxInr: Math.round(b.monthlyExhaustTaxInr * 0.35),
            streetPlumeTempCelsius: b.ambientBaselineTempCelsius + 1.2,
            thermalDebtScore: Math.round(b.thermalDebtScore * 0.4),
          };
        }
        return b;
      })
    );

    const newLog: IncidentLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'mitigation_action',
      tier: 2,
      title: `Municipal Mitigation Enforced: ${intervention}`,
      detail: `${selectedBuilding.name} deployed verified thermal diversion. Street heat delta reduced by 4.2°C; surcharge discounted.`,
    };
    setLogs((prev) => [newLog, ...prev]);
    scrollToAct('live_cockpit');
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased overflow-x-hidden">
      {/* Dynamic Background with scroll-aware color temperatures, mesh gradients & particles */}
      <DynamicAtmosphere activeAct={activeAct} isSurgeActive={surgeModalOpen} />

      {/* Floating Director's HUD with 8-Act Timeline & Audio Toggle */}
      <DirectorsFloatingHUD
        activeAct={activeAct}
        onNavigateTo={scrollToAct}
        onSimulateSurge={handleSimulateSurge}
        isSurgeActive={surgeModalOpen}
        isMitigated={isMitigated}
        onToggleMitigation={() => setIsMitigated(!isMitigated)}
      />

      {/* Narrative Sequence: WOW -> PROBLEM -> TENSION -> SOLUTION -> LIVE TWIN -> PROOF -> TECH -> IMPACT */}
      <main className="relative z-10 w-full">
        {/* Act 1: WOW HERO */}
        <div id="wow_hero">
          <WowHero
            onScrollToProblem={() => scrollToAct('problem')}
            onJumpToLive={() => scrollToAct('live_cockpit')}
          />
        </div>

        {/* Act 2: PROBLEM (Anthropogenic Canyon Thermodynamics) */}
        <div id="problem">
          <VisceralProblem />
        </div>

        {/* Act 3: TENSION & HUMAN COLLATERAL (Physiological Limit & Rameshwar Pal Story) */}
        <div id="tension">
          <WhyThisMatters />
        </div>

        {/* Act 4: INSIGHT & SOLUTION REVEAL (The Architectural Convergence) */}
        <div id="solution">
          <SolutionReveal onScrollToLive={() => scrollToAct('live_cockpit')} />
        </div>

        {/* Act 5: LIVE WORKING PRODUCT COCKPIT (3D WebGL Twin + CV Scanner + Surcharge Ledger + IoT Beacon) */}
        <div id="live_cockpit">
          <LiveProductCockpit
            building={selectedBuilding}
            allBuildings={buildings}
            onSelectBuilding={setSelectedBuilding}
            vendor={selectedVendor}
            allVendors={vendors}
            onSelectVendor={setSelectedVendor}
            isMitigated={isMitigated}
            onMitigationToggle={(m) => setIsMitigated(m)}
            onApplyMitigation={handleApplyMitigation}
            onSimulateSurge={handleSimulateSurge}
          />
        </div>

        {/* Act 6: PROOF & FIELD VALIDATION (Delhi & Bengaluru Field Trial Data) */}
        <div id="proof">
          <ProofValidation />
        </div>

        {/* Act 7: AWS PRODUCTION TECHNOLOGY & SERVERLESS BLUEPRINT */}
        <div id="technology">
          <TechnologyBlueprint />
        </div>

        {/* Act 8: MUNICIPAL THERMAL DEBT CALCULATOR, SECTION 133 DECREE & JUDGE EVALUATION */}
        <div id="final_demo">
          <FinalDemoDecree />
        </div>

        {/* Act 9: INTERACTIVE FINALE - 48-HOUR HEATWAVE DEFENSE CHALLENGE */}
        <div id="challenge">
          <MunicipalDefenseChallenge />
        </div>
      </main>

      {/* Peak Heat Crisis Simulation Modal */}
      {surgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-slate-950 border-2 border-red-600 rounded-3xl p-6 shadow-2xl shadow-red-950/80 space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm font-mono">
                <Flame className="w-5 h-5 animate-pulse" />
                <span>54°C PEAK EXHAUST SPIKE DETECTED</span>
              </div>
              <button
                onClick={() => setSurgeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 font-sans leading-relaxed">
              <p>
                Commercial AC systems at <strong>{selectedBuilding.name}</strong> surged to maximum load during 42.5°C peak afternoon ambient heat.
              </p>
              <div className="p-3 bg-red-950/40 rounded-xl border border-red-900 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Outdoor Sensible Blast:</span>
                  <span className="text-red-400 font-bold">53.6°C Direct Jet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Rejected Heat:</span>
                  <span className="text-red-400 font-bold">638.4 kW sensible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor Rameshwar Pal WBGT:</span>
                  <span className="text-red-500 font-bold">36.8°C (Extreme Lethality)</span>
                </div>
              </div>
              <p>
                Ushma-Netra has autonomously dispatched an automated Hindi voice evacuation advisory to the vendor's IoT beacon and generated a Section 133 Municipal Exhaust Tax Notice of <strong>₹{selectedBuilding.monthlyExhaustTaxInr.toLocaleString('en-IN')}/month</strong>.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3 font-mono">
              <button
                onClick={() => {
                  setSurgeModalOpen(false);
                  scrollToAct('live_cockpit');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium cursor-pointer border border-slate-700"
              >
                Inspect Live Twin
              </button>
              <button
                onClick={() => {
                  setSurgeModalOpen(false);
                  scrollToAct('final_demo');
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg"
              >
                Review Section 133 Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Hackathon Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-lg py-8 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-white tracking-wider">USHMA-NETRA</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold">TRACK 02 (HEAT & WATER)</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">AWS ENVIRONMENTAL HACKATHON</span>
          </div>

          <div className="text-[11px] text-slate-400 text-center md:text-right">
            Engineered with Amazon Bedrock · SageMaker · AWS IoT Core · Step Functions · Three.js WebGL
          </div>
        </div>
      </footer>
    </div>
  );
}
