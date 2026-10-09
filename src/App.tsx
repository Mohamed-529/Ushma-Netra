import React, { useState } from 'react';
import { ActiveTab, BuildingAudit, VendorTelemetry, IncidentLog } from './types';
import { INITIAL_BUILDINGS, INITIAL_VENDORS, INITIAL_LOGS } from './data/mockData';
import { Navigation } from './components/Navigation';
import { Thermal3DTwin } from './components/Thermal3DTwin';
import { FacadeComputerVisionScanner } from './components/FacadeComputerVisionScanner';
import { ThermalDebtLedger } from './components/ThermalDebtLedger';
import { VendorIoTBeacon } from './components/VendorIoTBeacon';
import { AWSArchitectureExplorer } from './components/AWSArchitectureExplorer';
import { Flame, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Zap, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('3d_twin');
  const [buildings, setBuildings] = useState<BuildingAudit[]>(INITIAL_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingAudit>(INITIAL_BUILDINGS[0]);
  const [vendors, setVendors] = useState<VendorTelemetry[]>(INITIAL_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState<VendorTelemetry>(INITIAL_VENDORS[0]);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);
  const [logs, setLogs] = useState<IncidentLog[]>(INITIAL_LOGS);
  const [surgeAlertOpen, setSurgeAlertOpen] = useState<boolean>(false);

  // Trigger peak crisis simulation
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
    setActiveTab('3d_twin');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSimulateSurge={handleSimulateSurge}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Editorial Context Kicker */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>TRACK 02: HEAT & WATER</span>
              <span>·</span>
              <span>THE AC EXHAUST "DEATH LOOP"</span>
              <span>·</span>
              <span className="text-emerald-400">AWS ENVIRONMENTAL HACKATHON</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ushma-Netra: Autonomous Thermal Equity & AC Exhaust Debt Grid
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl leading-relaxed">
              Air conditioners don't destroy heat—they transfer indoor cooling and dump 50°C+ exhaust into narrow alleys, artificially baking street vendors and informal settlements. Ushma-Netra is the world's first AI platform to map, quantify, and penalize micro-thermal exhaust dumping on AWS.
            </p>
          </div>

          {/* Quick Stats Pill Replacement */}
          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">MONITORED REJECTION</span>
              <span className="font-bold text-red-400 text-sm">638.4 kW Waste Heat</span>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CURRENT STREET DELTA</span>
              <span className={`font-bold text-sm ${isMitigated ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isMitigated ? '+1.2°C (Mitigated)' : '+6.6°C (Unmitigated)'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab View Switching */}
        {activeTab === '3d_twin' && (
          <div className="space-y-6">
            <Thermal3DTwin
              building={selectedBuilding}
              vendor={selectedVendor}
              onMitigationToggle={(mitigated) => setIsMitigated(mitigated)}
            />

            {/* Quick Context Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">The Thermodynamic Injustice</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    64 AC outdoor units eject 53.6°C exhaust horizontally into the 7.2m alley. Indoor occupants enjoy 22°C while street workers endure 48°C.
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Human Collateral Damage</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Vendor Rameshwar Pal is positioned 2.8m from the exhaust jet. Wet Bulb Globe Temperature reaches 36.8°C—crossing the physiological survivability threshold.
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">The Ushma-Netra Fix</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Mandatory 45° upward aerodynamic deflector cowls redirect exhaust towards the roofline, cooling the street by 3.8°C.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cv_scanner' && (
          <FacadeComputerVisionScanner
            building={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            allBuildings={buildings}
            onOpenLedger={() => setActiveTab('thermal_debt')}
          />
        )}

        {activeTab === 'thermal_debt' && (
          <ThermalDebtLedger
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            vendor={selectedVendor}
            onApplyMitigation={handleApplyMitigation}
          />
        )}

        {activeTab === 'vendor_iot' && (
          <VendorIoTBeacon
            vendor={selectedVendor}
            allVendors={vendors}
            onSelectVendor={setSelectedVendor}
            isMitigated={isMitigated}
          />
        )}

        {activeTab === 'aws_architecture' && (
          <AWSArchitectureExplorer />
        )}

        {/* Real-Time Live Activity & Incident Stream */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
                Live Incident & Agentic Escalation Audit Feed
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              AWS EventBridge Event Bus · Real-Time Dispatch
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-slate-500 text-[11px] shrink-0">
                    {log.timestamp}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    log.tier === 1 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    log.tier === 2 ? 'bg-red-950 text-red-300 border border-red-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    Tier {log.tier}
                  </span>
                  <span className="font-semibold text-slate-200">{log.title}:</span>
                  <span className="text-slate-400">{log.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Surge Disaster Modal */}
      {surgeAlertOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSurgeAlertOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Peak AC Heat Exhaust Surge</h3>
                <span className="text-xs font-mono text-red-400">Micro-Thermal Hazard Alert #UN-709</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                All 70 split and VRF AC outdoor units at <strong>{selectedBuilding.name}</strong> have surged to 100% capacity due to 41.2°C ambient city temperatures.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Exhaust Heat Rejection:</span>
                  <span className="text-red-400 font-bold">638.4 kW continuous</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alleyway Temperature:</span>
                  <span className="text-amber-400 font-bold">47.8°C (+6.6°C artificial delta)</span>
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

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSurgeAlertOpen(false);
                  setActiveTab('vendor_iot');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Inspect Vendor Beacon
              </button>
              <button
                onClick={() => {
                  setSurgeAlertOpen(false);
                  setActiveTab('thermal_debt');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
              >
                Review Legal Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Ushma-Netra</span>
            <span>·</span>
            <span>AI Thermal Equity & AC Exhaust Debt Grid</span>
            <span>·</span>
            <span>Track 02 (Heat & Water)</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Engineered on AWS Serverless (Bedrock, SageMaker, IoT Core, Step Functions)
          </div>
        </div>
      </footer>
    </div>
  );
}
