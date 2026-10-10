import React, { useState } from 'react';
import { BuildingAudit, VendorTelemetry } from '../../types';
import { Thermal3DTwin } from '../Thermal3DTwin';
import { FacadeComputerVisionScanner } from '../FacadeComputerVisionScanner';
import { ThermalDebtLedger } from '../ThermalDebtLedger';
import { VendorIoTBeacon } from '../VendorIoTBeacon';
import { Box, Scan, Scale, Radio, Flame, ShieldCheck } from 'lucide-react';

interface Props {
  building: BuildingAudit;
  allBuildings: BuildingAudit[];
  onSelectBuilding: (b: BuildingAudit) => void;
  vendor: VendorTelemetry;
  allVendors: VendorTelemetry[];
  onSelectVendor: (v: VendorTelemetry) => void;
  isMitigated: boolean;
  onMitigationToggle: (mitigated: boolean) => void;
  onApplyMitigation: (buildingId: string, intervention: string) => void;
  onSimulateSurge: () => void;
}

export const LiveProductCockpit: React.FC<Props> = ({
  building,
  allBuildings,
  onSelectBuilding,
  vendor,
  allVendors,
  onSelectVendor,
  isMitigated,
  onMitigationToggle,
  onApplyMitigation,
  onSimulateSurge,
}) => {
  const [activeTool, setActiveTool] = useState<'3d_twin' | 'cv_scanner' | 'thermal_debt' | 'vendor_iot'>('3d_twin');

  return (
    <section id="live-cockpit" className="relative min-h-screen w-full py-24 px-4 sm:px-8 lg:px-12 bg-[#060913] border-t border-slate-800/80">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0284c7]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10">
        {/* Cockpit Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>04 · THE LIVE WORKING SYSTEM CENTERPIECE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
              The Autonomous Resilience Engine in Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
              Not static cards or mock diagrams. A fully functional WebGL 3D spatial twin with FLIR thermal infrared false-color rendering, computer vision facade scanner, IoT worker beacon, and statutory order ledger.
            </p>
          </div>

          {/* Quick System Action Triggers */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onSimulateSurge}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Simulate 54°C Exhaust Surge</span>
            </button>

            <button
              onClick={() => onMitigationToggle(!isMitigated)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                isMitigated
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isMitigated ? 'Mitigation Active (Skyward Venting)' : 'Deploy Restorative Louvers'}</span>
            </button>
          </div>
        </div>

        {/* Tactical Sub-Tool Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTool('3d_twin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === '3d_twin'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>1. 3D Thermal Plume Twin (WebGL)</span>
          </button>

          <button
            onClick={() => setActiveTool('cv_scanner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'cv_scanner'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>2. AI Facade CV Scanner</span>
          </button>

          <button
            onClick={() => setActiveTool('thermal_debt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'thermal_debt'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. Municipal Surcharge Ledger (Gemini)</span>
          </button>

          <button
            onClick={() => setActiveTool('vendor_iot')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'vendor_iot'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>4. Street Vendor IoT Beacon & Audio</span>
          </button>
        </div>

        {/* Viewport Render Canvas */}
        <div className="w-full">
          {activeTool === '3d_twin' && (
            <Thermal3DTwin
              building={building}
              vendor={vendor}
              onMitigationToggle={onMitigationToggle}
            />
          )}

          {activeTool === 'cv_scanner' && (
            <FacadeComputerVisionScanner
              building={building}
              onSelectBuilding={onSelectBuilding}
              allBuildings={allBuildings}
              onOpenLedger={() => setActiveTool('thermal_debt')}
            />
          )}

          {activeTool === 'thermal_debt' && (
            <ThermalDebtLedger
              buildings={allBuildings}
              selectedBuilding={building}
              onSelectBuilding={onSelectBuilding}
              vendor={vendor}
              onApplyMitigation={onApplyMitigation}
            />
          )}

          {activeTool === 'vendor_iot' && (
            <VendorIoTBeacon
              vendor={vendor}
              allVendors={allVendors}
              onSelectVendor={onSelectVendor}
              isMitigated={isMitigated}
            />
          )}
        </div>
      </div>
    </section>
  );
};
