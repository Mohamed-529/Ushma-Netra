import React, { useState } from 'react';
import { BuildingAudit, VendorTelemetry } from '../../types';
import { Thermal3DTwin } from '../Thermal3DTwin';
import { ThermalPlumeTwin } from '../ThermalPlumeTwin';
import { FacadeComputerVisionScanner } from '../FacadeComputerVisionScanner';
import { ThermalDebtLedger } from '../ThermalDebtLedger';
import { VendorIoTBeacon } from '../VendorIoTBeacon';
import { LiveHardwareControl } from '../LiveHardwareControl';
import {
  Box,
  Scan,
  Scale,
  Radio,
  Flame,
  ShieldCheck,
  Lock,
  Sliders,
  Terminal,
  MapPin
} from 'lucide-react';
import { verifyDeviceHandshake } from '../../utils/cryptoVerify';
import { soundEngine } from '../../utils/audioSynthesizer';

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
  const [activeTool, setActiveTool] = useState<'3d_twin' | 'cv_scanner' | 'thermal_debt' | 'vendor_iot' | 'hardware_serial'>('3d_twin');
  const [twinMode, setTwinMode] = useState<'facade_twin' | 'parametric_canyon'>('facade_twin');

  const isHardwareVerified = verifyDeviceHandshake(
    {
      node_id: vendor.id,
      wbgt: vendor.wetBulbGlobeTempCelsius,
      ambient_temp: vendor.dryBulbTempCelsius,
      timestamp: new Date().toISOString(),
    },
    'un_hw_secure_ecc_p256_v01_valid_session'
  );

  return (
    <section id="live_cockpit" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10">
        
        {/* Clean, Spacious Header with Kinetic Minimal Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/40 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>THE LIVE DIGITAL TWIN</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">HARDWARE-SOFTWARE WORKSPACE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-zinc-100 tracking-tight font-sans">
              Micro-Canyon Digital Twin & Control
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-light">
              Interactive 3D WebGL spatial physics, facade computer vision, and statutory municipal restitution ledger.
            </p>
          </div>

          {/* Action Trigger Buttons with Tactile Skeuo-Industrial Finish */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                soundEngine.playTone(180, 'sawtooth', 0.35);
                onSimulateSurge();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Simulate Surge</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTone(isMitigated ? 420 : 880, 'sine', 0.15);
                onMitigationToggle(!isMitigated);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-all ${
                isMitigated
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-[#0c0d12]/80 border-zinc-800/40 text-zinc-300 hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isMitigated ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{isMitigated ? 'Louvers: Active' : 'Deploy Louvers'}</span>
            </button>
          </div>
        </div>

        {/* Precinct Switcher (Horizontal Selector Ribbon) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 mr-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Precinct:</span>
          </span>
          {allBuildings.map((b) => {
            const isSelected = b.id === building.id;
            return (
              <button
                key={b.id}
                onClick={() => onSelectBuilding(b)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/70 text-amber-300 font-semibold shadow-sm'
                    : 'bg-black/40 border-zinc-800/40 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {b.name} ({b.canyonWidthMeters}m Alley)
              </button>
            );
          })}
        </div>

        {/* Concise Vital Telemetry Strip with Kinetic Skeuo-Industrial Finish */}
        <div className="relative bg-[#0c0d12]/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800/40 text-xs font-mono overflow-hidden shadow-lg">
          {/* Subtle Structural Registration Marks */}
          <span className="absolute top-1 left-2 text-[10px] text-zinc-600 select-none font-mono pointer-events-none">+</span>
          <span className="absolute top-1 right-2 text-[10px] text-zinc-600 select-none font-mono pointer-events-none">+</span>
          <span className="absolute bottom-1 left-2 text-[10px] text-zinc-600 select-none font-mono pointer-events-none">+</span>
          <span className="absolute bottom-1 right-2 text-[10px] text-zinc-600 select-none font-mono pointer-events-none">+</span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Sensible Heat Rejected</div>
              <div className={`text-lg font-light tabular-nums font-mono ${isMitigated ? 'text-emerald-400' : 'text-red-400'}`}>
                {isMitigated ? '182 kW (Deflected)' : `${building.rejectedHeatKw} kW (Alley Blast)`}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Vendor Exposure WBGT</div>
              <div className="text-lg font-light text-amber-400 tabular-nums font-mono">
                {vendor.wetBulbGlobeTempCelsius}°C ({vendor.distanceToExhaustMeters}m away)
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Statutory Surcharge</div>
              <div className="text-lg font-light text-zinc-200 tabular-nums font-mono">
                ₹{building.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Hardware Handshake</div>
              <div className="text-lg font-light text-emerald-400 flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>{isHardwareVerified ? 'P-256 Verified' : 'Checking'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0c0d12]/70 rounded-xl border border-zinc-800/40 overflow-x-auto backdrop-blur-md">
          <button
            onClick={() => setActiveTool('3d_twin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === '3d_twin'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>1. 3D Digital Twin</span>
          </button>

          <button
            onClick={() => setActiveTool('cv_scanner')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'cv_scanner'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>2. AI Facade Scanner</span>
          </button>

          <button
            onClick={() => setActiveTool('thermal_debt')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'thermal_debt'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. Surcharge Ledger</span>
          </button>

          <button
            onClick={() => setActiveTool('vendor_iot')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'vendor_iot'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>4. Vendor IoT Beacon</span>
          </button>

          <button
            onClick={() => setActiveTool('hardware_serial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'hardware_serial'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-amber-400/90 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>5. ESP32 Serial Edge</span>
          </button>
        </div>

        {/* Viewport Interactive Container (Spacious, Full Width) */}
        <div className="w-full rounded-2xl bg-[#0c0d12]/75 backdrop-blur-xl border border-zinc-800/40 p-3 sm:p-6 space-y-4 shadow-2xl">
          
          {activeTool === '3d_twin' && (
            <div className="flex flex-wrap items-center justify-between bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 text-xs gap-2">
              <span className="text-zinc-400 font-mono text-[11px] px-1">
                WebGL Viewport Mode:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTwinMode('facade_twin')}
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer ${
                    twinMode === 'facade_twin'
                      ? 'bg-amber-500 text-zinc-950 shadow-sm'
                      : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                  }`}
                >
                  Monitored Micro-Canyon
                </button>
                <button
                  onClick={() => setTwinMode('parametric_canyon')}
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    twinMode === 'parametric_canyon'
                      ? 'bg-amber-500 text-zinc-950 shadow-sm'
                      : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  Dynamic Canyon Simulator
                </button>
              </div>
            </div>
          )}

          {activeTool === '3d_twin' && twinMode === 'facade_twin' && (
            <Thermal3DTwin
              building={building}
              vendor={vendor}
              isMitigated={isMitigated}
              onMitigationToggle={onMitigationToggle}
            />
          )}

          {activeTool === '3d_twin' && twinMode === 'parametric_canyon' && (
            <ThermalPlumeTwin
              alleyWidth={building.canyonWidthMeters}
              acUnitsCount={building.detectedOutdoorUnits.splitUnits + building.detectedOutdoorUnits.vrfUnits}
              louversEngaged={isMitigated}
              presetName={building.name}
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

          {activeTool === 'hardware_serial' && (
            <LiveHardwareControl />
          )}
        </div>
      </div>
    </section>
  );
};
