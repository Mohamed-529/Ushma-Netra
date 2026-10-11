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
    <section id="live_cockpit" className="relative w-full py-10 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10">
        
        {/* High-Contrast Header with Clear Dark Typography & Vibrant Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#d6cebe] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#a8321a]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>THE LIVE DIGITAL TWIN</span>
              <span className="text-[#0b1b2d]/40">·</span>
              <span className="text-[#0b1b2d]/80">HARDWARE-SOFTWARE WORKSPACE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0b1b2d] tracking-tight font-sans">
              Micro-Canyon Digital Twin &amp; Control
            </h2>
            <p className="text-sm text-[#1f3044] max-w-2xl font-medium">
              Interactive 3D WebGL spatial physics, facade computer vision, and statutory municipal restitution ledger.
            </p>
          </div>

          {/* High-Contrast Action Trigger Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundEngine.playTone(180, 'sawtooth', 0.35);
                onSimulateSurge();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#a8321a] hover:bg-[#8c2713] text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Simulate Surge</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTone(isMitigated ? 420 : 880, 'sine', 0.15);
                onMitigationToggle(!isMitigated);
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer border transition-all shadow-md ${
                isMitigated
                  ? 'bg-emerald-700 hover:bg-emerald-600 border-emerald-800 text-white'
                  : 'bg-[#0b1b2d] hover:bg-[#162d47] border-[#0b1b2d] text-white'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isMitigated ? 'text-emerald-200' : 'text-amber-400'}`} />
              <span>{isMitigated ? 'Louvers: Active' : 'Deploy Louvers'}</span>
            </button>
          </div>
        </div>

        {/* High-Contrast Precinct Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#0b1b2d] flex items-center gap-1.5 mr-2">
            <MapPin className="w-4 h-4 text-[#a8321a]" />
            <span>Target Precinct:</span>
          </span>
          {allBuildings.map((b) => {
            const isSelected = b.id === building.id;
            return (
              <button
                key={b.id}
                onClick={() => onSelectBuilding(b)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0b1b2d] border-[#0b1b2d] text-white shadow-sm'
                    : 'bg-[#efe8dc] border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
                }`}
              >
                {b.name} ({b.canyonWidthMeters}m Alley)
              </button>
            );
          })}
        </div>

        {/* Concise Vital Telemetry Strip */}
        <div className="relative bg-[#0b111e] p-5 rounded-2xl border border-slate-800 text-xs font-mono overflow-hidden shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Sensible Heat Rejected</div>
              <div className={`text-lg font-bold tabular-nums font-mono mt-0.5 ${isMitigated ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isMitigated ? '182 kW (Deflected)' : `${building.rejectedHeatKw} kW (Alley Blast)`}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Vendor Exposure WBGT</div>
              <div className="text-lg font-bold text-amber-400 tabular-nums font-mono mt-0.5">
                {vendor.wetBulbGlobeTempCelsius}°C ({vendor.distanceToExhaustMeters}m away)
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Statutory Surcharge</div>
              <div className="text-lg font-bold text-white tabular-nums font-mono mt-0.5">
                ₹{building.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Hardware Handshake</div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 font-mono mt-0.5">
                <Lock className="w-4 h-4" />
                <span>{isHardwareVerified ? 'P-256 Verified' : 'Checking'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Contrast Tool Navigation Tabs */}
        <div className="flex items-center gap-2 p-2 bg-[#efe8dc] rounded-2xl border border-[#d6cebe] overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveTool('3d_twin')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === '3d_twin'
                ? 'bg-[#0b1b2d] text-white shadow-sm'
                : 'text-[#0b1b2d] hover:bg-[#e4dcce]'
            }`}
          >
            <Box className="w-4 h-4 text-amber-500" />
            <span>1. 3D Digital Twin</span>
          </button>

          <button
            onClick={() => setActiveTool('cv_scanner')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'cv_scanner'
                ? 'bg-[#0b1b2d] text-white shadow-sm'
                : 'text-[#0b1b2d] hover:bg-[#e4dcce]'
            }`}
          >
            <Scan className="w-4 h-4 text-[#a8321a]" />
            <span>2. AI Facade Scanner</span>
          </button>

          <button
            onClick={() => setActiveTool('thermal_debt')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'thermal_debt'
                ? 'bg-[#0b1b2d] text-white shadow-sm'
                : 'text-[#0b1b2d] hover:bg-[#e4dcce]'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>3. Surcharge Ledger</span>
          </button>

          <button
            onClick={() => setActiveTool('vendor_iot')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'vendor_iot'
                ? 'bg-[#0b1b2d] text-white shadow-sm'
                : 'text-[#0b1b2d] hover:bg-[#e4dcce]'
            }`}
          >
            <Radio className="w-4 h-4 text-sky-700" />
            <span>4. Vendor IoT Beacon</span>
          </button>

          <button
            onClick={() => setActiveTool('hardware_serial')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTool === 'hardware_serial'
                ? 'bg-[#0b1b2d] text-white shadow-sm'
                : 'text-[#a8321a] bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25'
            }`}
          >
            <Terminal className="w-4 h-4 text-[#a8321a]" />
            <span>5. ESP32 Serial Edge</span>
          </button>
        </div>

        {/* Viewport Interactive Container */}
        <div className="w-full rounded-2xl bg-[#0b111e] border border-slate-800 p-3 sm:p-6 space-y-4 shadow-2xl">
          
          {activeTool === '3d_twin' && (
            <div className="flex flex-wrap items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs gap-2">
              <span className="text-slate-300 font-mono font-semibold text-[11px] px-1">
                WebGL Viewport Mode:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTwinMode('facade_twin')}
                  className={`px-3.5 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer ${
                    twinMode === 'facade_twin'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-200 hover:text-white bg-slate-800'
                  }`}
                >
                  Monitored Micro-Canyon
                </button>
                <button
                  onClick={() => setTwinMode('parametric_canyon')}
                  className={`px-3.5 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    twinMode === 'parametric_canyon'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-200 hover:text-white bg-slate-800'
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
