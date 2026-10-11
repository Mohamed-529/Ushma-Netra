import React, { useState } from 'react';
import { BuildingAudit, VendorTelemetry } from '../../types';
import { Thermal3DTwin } from '../Thermal3DTwin';
import { ThermalPlumeTwin } from '../ThermalPlumeTwin';
import { VendorIoTBeacon } from '../VendorIoTBeacon';
import { LiveHardwareControl } from '../LiveHardwareControl';
import {
  Box,
  Radio,
  ShieldCheck,
  Sliders,
  Terminal,
  MapPin,
  ChevronDown,
} from 'lucide-react';
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
}) => {
  const [twinMode, setTwinMode] = useState<'facade_twin' | 'parametric_canyon'>('facade_twin');
  const [hardwareTab, setHardwareTab] = useState<'vendor_iot' | 'hardware_serial'>('vendor_iot');

  return (
    <section id="live_cockpit" className="relative w-full py-4 bg-transparent">
      {/* Generous space-y-12 vertical separation so the #12161A dark charcoal background frames each pure white #FFFFFF card */}
      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* FLOATING CARD 1: Pure White (#FFFFFF) Inner Dashboard Card Overhaul ("3D Street Digital Twin" block) */}
        <div className="rounded-3xl bg-[#FFFFFF] text-[#111827] p-6 sm:p-10 space-y-8 border border-[#E5E7EB] shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5E7EB] pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#a8321a]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>3D STREET COOLING SIMULATOR</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight font-sans">
                3D Street Digital Twin
              </h1>
              <p className="text-sm text-[#111827] max-w-xl font-medium">
                See how upward 45° louvers and cool mist stop commercial AC heat from hitting street vendors.
              </p>
            </div>

            {/* Clean Location Dropdown + Single Cooling Action Button */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Interactive Selector Dropdown ("Vikas Surya Commercial Plaza") with #F3F4F6 light gray fill & #E5E7EB border */}
              <div className="relative">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] text-xs font-mono font-bold shadow-xs">
                  <MapPin className="w-4 h-4 text-[#a8321a] shrink-0" />
                  <select
                    value={building.id}
                    onChange={(e) => {
                      const found = allBuildings.find((b) => b.id === e.target.value);
                      if (found) onSelectBuilding(found);
                    }}
                    aria-label="Choose Street Location"
                    className="bg-transparent text-[#111827] font-mono text-xs font-bold pr-6 focus:outline-none cursor-pointer appearance-none"
                  >
                    {allBuildings.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#FFFFFF] text-[#111827]">
                        {b.name} ({b.city} · {b.canyonWidthMeters}m street)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#111827]/60 pointer-events-none -ml-5" />
                </div>
              </div>

              {/* Single Primary Cooling Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(isMitigated ? 420 : 880, 'sine', 0.15);
                  onMitigationToggle(!isMitigated);
                }}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer border transition-all shadow-md ${
                  isMitigated
                    ? 'bg-emerald-700 hover:bg-emerald-600 border-emerald-800 text-white'
                    : 'bg-[#a8321a] hover:bg-[#8c2713] border-[#a8321a] text-white'
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 pointer-events-none ${
                    isMitigated ? 'text-emerald-200' : 'text-amber-200'
                  }`}
                />
                <span className="pointer-events-none">
                  {isMitigated ? 'Cooling ON (-4.2°C)' : 'Turn ON Street Cooling'}
                </span>
              </button>
            </div>
          </div>

          {/* Simple 3-Card Summary Bar inside Pure White Container */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#111827]">
                  AC Heat Blowing Into Street
                </div>
                <div
                  className={`text-xl font-black font-mono mt-0.5 ${
                    isMitigated ? 'text-emerald-700' : 'text-[#a8321a]'
                  }`}
                >
                  {isMitigated ? 'Sent Up to Roof' : `${building.rejectedHeatKw} kW Hot Air`}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#111827] text-white font-mono text-xs font-bold">
                {building.detectedOutdoorUnits.splitUnits + building.detectedOutdoorUnits.vrfUnits} ACs
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#111827]">
                  Heat at Vendor Cart
                </div>
                <div className="text-xl font-black font-mono text-[#111827] mt-0.5">
                  {isMitigated ? '30.2°C (Safe)' : `${vendor.wetBulbGlobeTempCelsius}°C (Danger)`}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-mono text-xs font-bold">
                {vendor.distanceToExhaustMeters}m from AC
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#111827]">
                  Monthly Polluter Fine
                </div>
                <div className="text-xl font-black font-mono text-emerald-700 mt-0.5">
                  ₹{building.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-bold">
                Funds Mist
              </span>
            </div>
          </div>
        </div>

        {/* FLOATING CARD 2: Dedicated 3D Digital Twin Workspace in Pure White (#FFFFFF) Frame */}
        <div className="w-full rounded-3xl bg-[#FFFFFF] text-[#111827] p-6 sm:p-8 space-y-5 border border-[#E5E7EB] shadow-xl">
          <div className="flex flex-wrap items-center justify-between bg-[#F3F4F6] px-4 py-3 rounded-2xl border border-[#E5E7EB] text-xs gap-3">
            <div className="flex items-center gap-2 text-[#111827] font-bold">
              <Box className="w-4 h-4 text-[#a8321a]" />
              <span>{building.name} · 3D Street View</span>
              <span className="text-[#111827]/70 font-normal hidden sm:inline">
                (Drag to rotate · Scroll to zoom)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTwinMode('facade_twin')}
                className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer ${
                  twinMode === 'facade_twin'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#E5E7EB] bg-[#FFFFFF] border border-[#E5E7EB]'
                }`}
              >
                3D Building &amp; Cart View
              </button>
              <button
                type="button"
                onClick={() => setTwinMode('parametric_canyon')}
                className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  twinMode === 'parametric_canyon'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#E5E7EB] bg-[#FFFFFF] border border-[#E5E7EB]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">Custom Street Width Lab</span>
              </button>
            </div>
          </div>

          {twinMode === 'facade_twin' ? (
            <Thermal3DTwin
              building={building}
              vendor={vendor}
              isMitigated={isMitigated}
              onMitigationToggle={onMitigationToggle}
            />
          ) : (
            <ThermalPlumeTwin
              alleyWidth={building.canyonWidthMeters}
              acUnitsCount={
                building.detectedOutdoorUnits.splitUnits +
                building.detectedOutdoorUnits.vrfUnits
              }
              louversEngaged={isMitigated}
              presetName={building.name}
              onLouversChange={onMitigationToggle}
            />
          )}
        </div>

        {/* FLOATING CARD 3: Connected Street Cart Sensor & ESP32 Hardware Section */}
        <div className="space-y-6">
          {/* Section Switcher Bar on the #12161A Dark Canvas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                GROUND-LEVEL HARDWARE CONNECTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                Vendor Cart Sensor &amp; Live ESP32 Hardware
              </h2>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-xl self-start">
              <button
                type="button"
                onClick={() => setHardwareTab('vendor_iot')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  hardwareTab === 'vendor_iot'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#F3F4F6] bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                <Radio className="w-4 h-4 text-amber-400 pointer-events-none" />
                <span className="pointer-events-none">Vendor Cart Voice Alert</span>
              </button>
              <button
                type="button"
                onClick={() => setHardwareTab('hardware_serial')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  hardwareTab === 'hardware_serial'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#F3F4F6] bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                <Terminal className="w-4 h-4 text-[#a8321a] pointer-events-none" />
                <span className="pointer-events-none">ESP32 USB Sensor</span>
              </button>
            </div>
          </div>

          <div className="w-full">
            {hardwareTab === 'vendor_iot' ? (
              <VendorIoTBeacon
                vendor={vendor}
                allVendors={allVendors}
                onSelectVendor={onSelectVendor}
                isMitigated={isMitigated}
              />
            ) : (
              <LiveHardwareControl />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
