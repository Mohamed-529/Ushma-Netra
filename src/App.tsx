import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry, IncidentLog } from './types';
import { INITIAL_BUILDINGS, INITIAL_VENDORS, INITIAL_LOGS } from './data/mockData';
import { DynamicAtmosphere, StoryAct } from './components/experience/DynamicAtmosphere';
import { ProfessionalLandingLayout } from './components/ProfessionalLandingLayout';
import { HomePage } from './pages/HomePage';
import { ThermalGridPage } from './pages/ThermalGridPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { LedgerPage } from './pages/LedgerPage';
import { TwinLabPage } from './pages/TwinLabPage';
import { ScannerPage } from './pages/ScannerPage';
import { ImpactPage } from './pages/ImpactPage';
import { soundEngine } from './utils/audioSynthesizer';
import { recordBuildingMitigation } from './services/gemini';
import { Flame, AlertTriangle, ShieldCheck, X } from 'lucide-react';

// Scroll-to-top handler on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Inner Application Component with Route-Aware Atmosphere
function AppContent() {
  const location = useLocation();
  const [activeAct, setActiveAct] = useState<StoryAct>('wow_hero');
  const [buildings, setBuildings] = useState<BuildingAudit[]>(INITIAL_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingAudit>(INITIAL_BUILDINGS[0]);
  const [vendors, setVendors] = useState<VendorTelemetry[]>(INITIAL_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState<VendorTelemetry>(INITIAL_VENDORS[0]);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);
  const [logs, setLogs] = useState<IncidentLog[]>(INITIAL_LOGS);
  const [surgeModalOpen, setSurgeModalOpen] = useState<boolean>(false);
  const [isIntroRevealed, setIsIntroRevealed] = useState<boolean>(false);
  const [replayTrigger, setReplayTrigger] = useState<number>(0);
  const handleTypingComplete = React.useCallback(() => {
    setIsIntroRevealed(true);
  }, []);
  const handleReplayIntro = React.useCallback(() => {
    setIsIntroRevealed(false);
    setReplayTrigger((prev) => prev + 1);
  }, []);

  // Map route to theme atmosphere
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveAct('wow_hero');
    } else if (location.pathname.startsWith('/grid')) {
      setActiveAct('tension');
    } else if (location.pathname.startsWith('/how-it-works') || location.pathname.startsWith('/pipeline')) {
      setActiveAct('solution');
    } else if (location.pathname.startsWith('/methodology') || location.pathname.startsWith('/science')) {
      setActiveAct('proof');
    } else if (location.pathname.startsWith('/watchlist') || location.pathname.startsWith('/alerts')) {
      setActiveAct('problem');
    } else if (location.pathname.startsWith('/ledger') || location.pathname.startsWith('/audit')) {
      setActiveAct('final_demo');
    } else if (location.pathname.startsWith('/twin') || location.pathname.startsWith('/digital-twin')) {
      setActiveAct('live_cockpit');
    } else if (location.pathname.startsWith('/scanner') || location.pathname.startsWith('/vision')) {
      setActiveAct('technology');
    }
  }, [location.pathname]);

  // Smooth scroll to target story act on Home page
  const scrollToAct = (act: StoryAct) => {
    const el = document.getElementById(act);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveAct(act);
  };

  // Trigger peak crisis heat surge simulation
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
            streetPlumeTempCelsius: +(b.ambientBaselineTempCelsius + 1.2).toFixed(1),
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

    void recordBuildingMitigation(buildingId, intervention);
  };

  return (
    <div className="relative min-h-screen bg-[#12161A] text-white font-sans selection:bg-amber-500/30 selection:text-white antialiased overflow-x-clip">
      {/* Dynamic Background with unified #12161A dark charcoal canvas & ambient mesh */}
      <DynamicAtmosphere
        activeAct={activeAct}
        isSurgeActive={surgeModalOpen}
        isIntroRevealed={location.pathname !== '/' || isIntroRevealed}
      />

      {/* Global Layout: Sticky Header Navigation with Infinite Ticker & Routing */}
      <ProfessionalLandingLayout
        activePresetName={`${selectedBuilding.name} Canyon`}
        isHardwareConnected={false}
        activeAct={activeAct}
        onNavigateTo={scrollToAct}
        onSimulateSurge={handleSimulateSurge}
        isSurgeActive={surgeModalOpen}
        isMitigated={isMitigated}
        onToggleMitigation={() => setIsMitigated(!isMitigated)}
        onConnectHardware={() => scrollToAct('live_cockpit')}
        isIntroRevealed={location.pathname !== '/' || isIntroRevealed}
      >
        <Routes>
          {/* Flagship Home Page */}
          <Route
            path="/"
            element={
              <HomePage
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
                vendors={vendors}
                selectedVendor={selectedVendor}
                onSelectVendor={setSelectedVendor}
                isMitigated={isMitigated}
                onMitigationToggle={setIsMitigated}
                onApplyMitigation={handleApplyMitigation}
                onSimulateSurge={handleSimulateSurge}
                onScrollToAct={scrollToAct}
                isIntroRevealed={isIntroRevealed}
                onTypingComplete={handleTypingComplete}
                onReplayIntro={handleReplayIntro}
                replayTrigger={replayTrigger}
              />
            }
          />

          {/* National Thermal Grid & Hotspot Registry */}
          <Route
            path="/grid"
            element={
              <ThermalGridPage
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
                onApplyMitigation={handleApplyMitigation}
                vendors={vendors}
              />
            }
          />
          <Route
            path="/grid/:zoneId"
            element={
              <ThermalGridPage
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
                onApplyMitigation={handleApplyMitigation}
                vendors={vendors}
              />
            }
          />

          {/* 6-Stage Autonomous Pipeline */}
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pipeline" element={<HowItWorksPage />} />

          {/* Scientific Methodology & Live Thermodynamic Calculator */}
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/science" element={<MethodologyPage />} />

          {/* Heat Surge Watchlist & Community SMS/WhatsApp Alerts */}
          <Route
            path="/watchlist"
            element={
              <WatchlistPage
                buildings={buildings}
                logs={logs}
                onSimulateSurge={handleSimulateSurge}
              />
            }
          />
          <Route
            path="/alerts"
            element={
              <WatchlistPage
                buildings={buildings}
                logs={logs}
                onSimulateSurge={handleSimulateSurge}
              />
            }
          />

          {/* Municipal Section 133 CrPC Thermal Debt Ledger */}
          <Route
            path="/ledger"
            element={
              <LedgerPage
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
                vendor={selectedVendor}
                onApplyMitigation={handleApplyMitigation}
              />
            }
          />
          <Route
            path="/audit"
            element={
              <LedgerPage
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
                vendor={selectedVendor}
                onApplyMitigation={handleApplyMitigation}
              />
            }
          />

          {/* Full-Bleed 3D CFD Digital Twin & SCADA Lab */}
          <Route
            path="/twin"
            element={
              <TwinLabPage
                building={selectedBuilding}
                allBuildings={buildings}
                onSelectBuilding={setSelectedBuilding}
                vendor={selectedVendor}
                allVendors={vendors}
                onSelectVendor={setSelectedVendor}
                isMitigated={isMitigated}
                onMitigationToggle={setIsMitigated}
                onApplyMitigation={handleApplyMitigation}
                onSimulateSurge={handleSimulateSurge}
              />
            }
          />
          <Route
            path="/digital-twin"
            element={
              <TwinLabPage
                building={selectedBuilding}
                allBuildings={buildings}
                onSelectBuilding={setSelectedBuilding}
                vendor={selectedVendor}
                allVendors={vendors}
                onSelectVendor={setSelectedVendor}
                isMitigated={isMitigated}
                onMitigationToggle={setIsMitigated}
                onApplyMitigation={handleApplyMitigation}
                onSimulateSurge={handleSimulateSurge}
              />
            }
          />

          {/* AI Façade Computer Vision Scanner */}
          <Route
            path="/scanner"
            element={
              <ScannerPage
                building={selectedBuilding}
                allBuildings={buildings}
                onSelectBuilding={setSelectedBuilding}
              />
            }
          />
          <Route
            path="/vision"
            element={
              <ScannerPage
                building={selectedBuilding}
                allBuildings={buildings}
                onSelectBuilding={setSelectedBuilding}
              />
            }
          />

          {/* Simple Feel-Good Impact Page */}
          <Route path="/impact" element={<ImpactPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProfessionalLandingLayout>

      {/* Emergency Heat Surge Crisis Modal */}
      {surgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12080a] border border-red-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl shadow-red-950/80">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-950 rounded-xl border border-red-800 text-red-500 animate-pulse">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-red-400 tracking-wider">
                    Tier-1 Anthropogenic Heat Alert
                  </span>
                  <h3 className="text-lg font-bold text-white">Peak Cooling Crisis Triggered</h3>
                </div>
              </div>
              <button
                onClick={() => setSurgeModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono text-zinc-300">
              <p className="leading-relaxed">
                Aggregated commercial AC condensers rejection surged past{' '}
                <span className="text-red-400 font-bold">638.4 kW</span> at{' '}
                <span className="text-white font-bold">{selectedBuilding.name}</span>.
              </p>
              <div className="p-3 bg-red-950/40 rounded-xl border border-red-900/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Exhaust Air Jet:</span>
                  <span className="text-red-400 font-bold">55.4°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Street Alley WBGT:</span>
                  <span className="text-red-400 font-bold">36.8°C (Lethal Limit Crossed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Affected Cart:</span>
                  <span className="text-white font-bold">{selectedVendor.vendorName} (2.8m from vent)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  handleApplyMitigation(selectedBuilding.id, 'Pneumatic Deflection Louvers + Misting');
                  setSurgeModalOpen(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 fill-current text-zinc-950" />
                <span>Deploy Autonomous Mitigation</span>
              </button>
              <button
                onClick={() => setSurgeModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-xs font-mono"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
