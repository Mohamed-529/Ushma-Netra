import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import { Thermal3DTwin } from '../components/Thermal3DTwin';
import { ThermalPlumeTwin } from '../components/ThermalPlumeTwin';
import { LiveHardwareControl } from '../components/LiveHardwareControl';
import {
  Box,
  Sliders,
  Wind,
  Flame,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Eye,
  Activity,
  Layers,
  ArrowLeft,
  Home
} from 'lucide-react';

interface Props {
  building: BuildingAudit;
  allBuildings: BuildingAudit[];
  onSelectBuilding: (b: BuildingAudit) => void;
  vendor: VendorTelemetry;
  isMitigated: boolean;
  onMitigationToggle: (mitigated: boolean) => void;
  onSimulateSurge: () => void;
}

export const TwinLabPage: React.FC<Props> = ({
  building,
  allBuildings,
  onSelectBuilding,
  vendor,
  isMitigated,
  onMitigationToggle,
  onSimulateSurge,
}) => {
  const navigate = useNavigate();
  const [twinViewMode, setTwinViewMode] = useState<'facade_twin' | 'parametric_canyon'>('facade_twin');
  const [showHardwarePanel, setShowHardwarePanel] = useState<boolean>(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-750 text-xs font-mono font-medium transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-amber-400 font-semibold">3D CFD Digital Twin & SCADA Lab</span>
        </nav>
      </div>

      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Interactive WebGL Simulation
            </span>
            <span className="text-zinc-500 text-xs font-mono">·</span>
            <span className="text-zinc-400 text-xs font-mono">
              60 FPS Physics-Informed Plume Dispersion
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">
            3D Thermal Plume & Hardware SCADA Digital Twin
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time simulation of commercial condenser exhaust heat rejection in narrow urban street canyons.
          </p>
        </div>

        {/* Mode Switcher & Presets */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setTwinViewMode('facade_twin')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                twinViewMode === 'facade_twin'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Building Façade Twin
            </button>
            <button
              onClick={() => setTwinViewMode('parametric_canyon')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                twinViewMode === 'parametric_canyon'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Parametric Canyon CFD
            </button>
          </div>

          <button
            onClick={() => setShowHardwarePanel(!showHardwarePanel)}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
              showHardwarePanel
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            {showHardwarePanel ? 'Hide SCADA Controls' : 'Show SCADA Controls'}
          </button>
        </div>
      </div>

      {/* Target Building Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
        <span className="text-zinc-500 shrink-0">Active Hotspot:</span>
        {allBuildings.slice(0, 6).map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectBuilding(b)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
              building.id === b.id
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {b.name} ({b.city})
          </button>
        ))}
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={showHardwarePanel ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {twinViewMode === 'facade_twin' ? (
            <Thermal3DTwin
              building={building}
              vendor={vendor}
              onMitigationToggle={onMitigationToggle}
            />
          ) : (
            <ThermalPlumeTwin
              alleyWidth={building.canyonWidthMeters}
              acUnitsCount={building.detectedOutdoorUnits.splitUnits}
              louversEngaged={isMitigated}
              presetName={building.name}
              onLouversChange={onMitigationToggle}
            />
          )}
        </div>

        {/* Hardware & SCADA Actuation Panel */}
        {showHardwarePanel && (
          <div className="lg:col-span-4 space-y-6">
            <LiveHardwareControl />
          </div>
        )}
      </div>

      {/* Cross Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
        <Link
          to="/grid"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors group"
        >
          <div className="text-[10px] font-mono text-zinc-500 uppercase">National Data</div>
          <div className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
            <span>Thermal Grid Registry</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/scanner"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors group"
        >
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Computer Vision</div>
          <div className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
            <span>AI Façade Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/ledger"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors group"
        >
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Statutory Penalties</div>
          <div className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
            <span>Thermal Debt Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};
