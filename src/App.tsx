import React, { useState, useEffect } from 'react';
import { BuildingAudit, VendorTelemetry, IncidentLog } from './types';
import { INITIAL_BUILDINGS, INITIAL_VENDORS, INITIAL_LOGS } from './data/mockData';
import { HeroAct } from './components/narrative/HeroAct';
import { TensionAct } from './components/narrative/TensionAct';
import { HumanCrisisAct } from './components/narrative/HumanCrisisAct';
import { InsightAct } from './components/narrative/InsightAct';
import { LiveCenterpieceAct } from './components/narrative/LiveCenterpieceAct';
import { ArchitectureAct } from './components/narrative/ArchitectureAct';
import { ProofAct } from './components/narrative/ProofAct';
import { Interactive3DReadme } from './components/Interactive3DReadme';
import { ClosingAct } from './components/narrative/ClosingAct';
import { FloatingChapterNav } from './components/narrative/FloatingChapterNav';
import { AlertTriangle, X, Flame } from 'lucide-react';

export default function App() {
  const [buildings, setBuildings] = useState<BuildingAudit[]>(INITIAL_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingAudit>(INITIAL_BUILDINGS[0]);
  const [vendors, setVendors] = useState<VendorTelemetry[]>(INITIAL_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState<VendorTelemetry>(INITIAL_VENDORS[0]);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);
  const [logs, setLogs] = useState<IncidentLog[]>(INITIAL_LOGS);
  const [surgeAlertOpen, setSurgeAlertOpen] = useState<boolean>(false);
  const [currentAct, setCurrentAct] = useState<string>('act-hero');

  // Track active section for floating navigator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['act-hero', 'act-tension', 'act-human', 'act-insight', 'live-system', 'architecture', 'proof', 'interactive-readme'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.1) {
            setCurrentAct(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger peak crisis surge simulation
  const handleSimulateSurge = () => {
    setIsMitigated(false);
    setSurgeAlertOpen(true);

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
    scrollToSection('live-system');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Act I: Cinematic Hero Opening */}
      <div id="act-hero">
        <HeroAct onExploreClick={() => scrollToSection('act-tension')} />
      </div>

      {/* Act II: The Thermodynamic Injustice */}
      <div id="act-tension">
        <TensionAct />
      </div>

      {/* Act III: The Human Crisis (Why This Matters Moment) */}
      <div id="act-human">
        <HumanCrisisAct />
      </div>

      {/* Act IV: The Regulatory & Technological Breakthrough */}
      <div id="act-insight">
        <InsightAct onScrollToLive={() => scrollToSection('live-system')} />
      </div>

      {/* Act V: The Live Working System (Centerpiece) */}
      <LiveCenterpieceAct
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

      {/* Act VI: AWS Cloud Infrastructure Architecture */}
      <ArchitectureAct />

      {/* Act VII: Proof, Field Validation & Measured Metrics */}
      <ProofAct />

      {/* Act VIII: Interactive 3D Documentation Tome (Readme Spec) */}
      <div id="interactive-readme">
        <Interactive3DReadme />
      </div>

      {/* Act IX: The Finale */}
      <ClosingAct
        onBackToTop={() => scrollToSection('act-hero')}
        onExploreSystem={() => scrollToSection('live-system')}
      />

      {/* Floating Chapter Progress Navigation */}
      <FloatingChapterNav
        currentAct={currentAct}
        onNavigateAct={scrollToSection}
        onSimulateSurge={handleSimulateSurge}
      />

      {/* Emergency Surge Modal */}
      {surgeAlertOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSurgeAlertOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400 border-b border-slate-800 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-500 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Peak AC Heat Exhaust Surge</h3>
                <span className="text-xs font-mono text-red-400">Hazard Code: #UN-DELHI-01-CRITICAL</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                All 70 split and VRF AC outdoor units at <strong>{selectedBuilding.name}</strong> surged to 100% capacity due to 41.2°C ambient city temperatures.
              </p>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Continuous Waste Heat Rejection:</span>
                  <span className="text-red-400 font-bold">638.4 kW continuous</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Street Alleyway Air Temp:</span>
                  <span className="text-amber-400 font-bold">47.8°C (+6.6°C delta)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor Rameshwar Pal WBGT:</span>
                  <span className="text-red-500 font-bold">36.8°C (Extreme Lethality)</span>
                </div>
              </div>
              <p>
                Ushma-Netra has autonomously dispatched an automated Hindi voice evacuation advisory to the vendor's IoT beacon and generated a Section 133 Municipal Exhaust Tax Notice of <strong>₹1,84,500/month</strong> for the building owner.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSurgeAlertOpen(false);
                  scrollToSection('live-system');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Inspect Live 3D Canyon Reaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
