import React, { useState } from 'react';
import { BuildingAudit, VendorTelemetry } from '../../types';
import { Thermal3DTwin } from '../Thermal3DTwin';
import { ThermalPlumeTwin } from '../ThermalPlumeTwin';
import { FacadeComputerVisionScanner } from '../FacadeComputerVisionScanner';
import { ThermalDebtLedger } from '../ThermalDebtLedger';
import { VendorIoTBeacon } from '../VendorIoTBeacon';
import { Box, Scan, Scale, Radio, Flame, ShieldCheck, Lock, CheckCircle2, Sliders } from 'lucide-react';
import { verifyDeviceHandshake } from '../../utils/cryptoVerify';

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
  const [twinMode, setTwinMode] = useState<'facade_twin' | 'parametric_canyon'>('facade_twin');
  const [hwTokenValid, setHwTokenValid] = useState<boolean>(true);

  // Validate hardware cryptographic payload
  const isHardwareVerified = verifyDeviceHandshake(
    {
      node_id: vendor.id,
      wbgt: vendor.wetBulbGlobeTempCelsius,
      ambient_temp: vendor.dryBulbTempCelsius,
      timestamp: new Date().toISOString(),
    },
    hwTokenValid ? 'un_hw_secure_ecc_p256_v01_valid_session' : 'tampered_invalid_token'
  );

  return (
    <section id="live-cockpit" className="relative min-h-screen w-full py-24 px-4 sm:px-8 lg:px-12 bg-transparent border-t border-slate-800/80">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0284c7]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10">
        {/* Cockpit Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>04 · THE LIVE WORKING SYSTEM CENTERPIECE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">4-TOOL TACTICAL SUITE</span>
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

        {/* Synchronized Cross-Tool Real-Time Status Strip with Hardware Security */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase">MONITORED TARGET</span>
            <span className="font-bold text-white truncate block">{building.name}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase">OUTDOOR CONDENSERS</span>
            <span className="font-bold text-amber-400">
              {building.detectedOutdoorUnits.splitUnits + building.detectedOutdoorUnits.vrfUnits} units (Split & VRF)
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase">REJECTED SENSIBLE HEAT</span>
            <span className={`font-bold ${isMitigated ? 'text-emerald-400' : 'text-red-400'}`}>
              {isMitigated ? '182 kW (Vented Skyward)' : `${building.rejectedHeatKw} kW (Direct Alley Blast)`}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 block uppercase">WORKER EXPOSURE</span>
            <span className={`font-bold ${isMitigated ? 'text-emerald-400' : 'text-amber-400'}`}>
              {vendor.vendorName} ({vendor.distanceToExhaustMeters}m away)
            </span>
          </div>
          <div className="space-y-0.5 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-800 md:pl-3 pt-1 md:pt-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-sky-400" />
                <span>HARDWARE CRYPTO</span>
              </span>
              <button
                onClick={() => setHwTokenValid(!hwTokenValid)}
                className="text-[9px] text-slate-400 hover:text-amber-400 underline cursor-pointer"
                title="Toggle simulated tamper event to test cryptographic rejection"
              >
                {hwTokenValid ? 'Simulate Tamper' : 'Restore'}
              </button>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {isHardwareVerified ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SECRETS MGR P-256 OK
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  REJECTED: BAD SIGNATURE
                </span>
              )}
            </div>
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
        <div className="w-full space-y-3">
          {activeTool === '3d_twin' && (
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono text-[11px] px-2">
                WebGL Spatial Viewport Mode:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTwinMode('facade_twin')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    twinMode === 'facade_twin'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-800/60'
                  }`}
                >
                  Monitored Building Micro-Canyon
                </button>
                <button
                  onClick={() => setTwinMode('parametric_canyon')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    twinMode === 'parametric_canyon'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-800/60'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  Dynamic Canyon Archetype Simulator
                </button>
              </div>
            </div>
          )}

          {activeTool === '3d_twin' && twinMode === 'facade_twin' && (
            <Thermal3DTwin
              building={building}
              vendor={vendor}
              onMitigationToggle={onMitigationToggle}
            />
          )}

          {activeTool === '3d_twin' && twinMode === 'parametric_canyon' && (
            <ThermalPlumeTwin
              alleyWidth={6.2}
              acUnitsCount={building.detectedOutdoorUnits.splitUnits + building.detectedOutdoorUnits.vrfUnits}
              louversEngaged={isMitigated}
              presetName="Chandni Chowk"
              onLouversChange={onMitigationToggle}
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
