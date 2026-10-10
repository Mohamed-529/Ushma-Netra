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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-bold transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-medium transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-[#0b1b2d]/70">
          <Link to="/" className="hover:text-[#a8321a] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#0b1b2d]/40" />
          <span className="text-[#a8321a] font-bold">3D CFD Digital Twin &amp; SCADA Lab</span>
        </nav>
      </div>

      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#d6cebe]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
              Interactive WebGL Simulation
            </span>
            <span className="text-[#0b1b2d]/40 text-xs font-mono">·</span>
            <span className="text-[#0b1b2d]/80 text-xs font-mono font-semibold">
              60 FPS Physics-Informed Plume Dispersion
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#0b1b2d]">
            3D Thermal Plume &amp; Hardware SCADA Digital Twin
          </h1>
          <p className="text-xs text-[#1f3044]">
            Real-time simulation of commercial condenser exhaust heat rejection in narrow urban street canyons.
          </p>
        </div>

        {/* Mode Switcher & Presets */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-[#efe8dc] rounded-xl border border-[#d6cebe] text-xs font-mono shadow-xs">
            <button
              onClick={() => setTwinViewMode('facade_twin')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                twinViewMode === 'facade_twin'
                  ? 'bg-[#0b1b2d] text-white font-bold shadow-2xs'
                  : 'text-[#0b1b2d]/70 hover:text-[#0b1b2d]'
              }`}
            >
              Building Façade Twin
            </button>
            <button
              onClick={() => setTwinViewMode('parametric_canyon')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                twinViewMode === 'parametric_canyon'
                  ? 'bg-[#0b1b2d] text-white font-bold shadow-2xs'
                  : 'text-[#0b1b2d]/70 hover:text-[#0b1b2d]'
              }`}
            >
              Parametric Canyon CFD
            </button>
          </div>

          <button
            onClick={() => setShowHardwarePanel(!showHardwarePanel)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer font-bold ${
              showHardwarePanel
                ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-xs'
                : 'bg-[#efe8dc] border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
            }`}
          >
            {showHardwarePanel ? 'Hide SCADA Controls' : 'Show SCADA Controls'}
          </button>
        </div>
      </div>

      {/* Target Building Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
        <span className="text-[#526071] shrink-0 font-bold uppercase text-[10px]">Active Hotspot:</span>
        {allBuildings.slice(0, 6).map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectBuilding(b)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors cursor-pointer font-semibold ${
              building.id === b.id
                ? 'bg-[#0b1b2d] border-[#0b1b2d] text-white shadow-2xs font-bold'
                : 'bg-[#efe8dc] border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
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
              isMitigated={isMitigated}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#d6cebe]">
        <Link
          to="/grid"
          className="p-5 rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] text-left transition-colors group shadow-sm"
        >
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold">National Data</div>
          <div className="text-sm font-bold text-[#0b1b2d] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
            <span>Thermal Grid Registry</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/scanner"
          className="p-5 rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] text-left transition-colors group shadow-sm"
        >
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold">Computer Vision</div>
          <div className="text-sm font-bold text-[#0b1b2d] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
            <span>AI Façade Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/ledger"
          className="p-5 rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] text-left transition-colors group shadow-sm"
        >
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold">Statutory Penalties</div>
          <div className="text-sm font-bold text-[#0b1b2d] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
            <span>Thermal Debt Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};
