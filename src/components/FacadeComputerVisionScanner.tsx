import React, { useState } from 'react';
import { BuildingAudit } from '../types';
import { Scan, Cpu, CheckCircle2, AlertOctagon, ShieldAlert, ArrowRight, Layers, Camera } from 'lucide-react';

interface Props {
  building: BuildingAudit;
  onSelectBuilding: (building: BuildingAudit) => void;
  allBuildings: BuildingAudit[];
  onOpenLedger: () => void;
}

export const FacadeComputerVisionScanner: React.FC<Props> = ({
  building,
  onSelectBuilding,
  allBuildings,
  onOpenLedger,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'all' | 'split' | 'vrf'>('all');

  const handleStartScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  // Generate bounding boxes representing real AC units detected on the facade
  const splitBoxes = Array.from({ length: 24 }).map((_, i) => ({
    id: `split-${i}`,
    type: 'Split AC Outdoor Unit',
    confidence: (0.94 + (i % 6) * 0.01).toFixed(2),
    tonnage: '1.5 TR',
    rejectionKw: '5.2 kW',
    top: `${20 + (Math.floor(i / 6) * 18)}%`,
    left: `${12 + ((i % 6) * 13)}%`,
    width: '9%',
    height: '11%',
  }));

  const vrfBoxes = Array.from({ length: 4 }).map((_, i) => ({
    id: `vrf-${i}`,
    type: 'VRF Heat Exchanger',
    confidence: '0.98',
    tonnage: '12 TR',
    rejectionKw: '42.0 kW',
    top: '76%',
    left: `${18 + (i * 18)}%`,
    width: '14%',
    height: '16%',
  }));

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AWS Sagemaker / Rekognition CV Pipeline</span>
            <span>·</span>
            <span>Micro-Thermal Model v4.2</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Building Facade Computer Vision Ingestion
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatically detects horizontal AC outdoor units, classifies compressor tonnage, and computes sensible waste heat rejection rates.
          </p>
        </div>

        {/* Building Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Target Facade:</span>
          <select
            value={building.id}
            onChange={(e) => {
              const selected = allBuildings.find((b) => b.id === e.target.value);
              if (selected) onSelectBuilding(selected);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
          >
            {allBuildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
          >
            <Scan className="w-4 h-4" />
            {isScanning ? 'Scanning Facade...' : 'Run Real-Time AI Detection'}
          </button>
        </div>
      </div>

      {/* Main Facade Scanner Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Street Facade with AI Bounding Boxes */}
        <div className="lg:col-span-2 relative min-h-[460px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          {/* Simulated Building Facade Graphic */}
          <div className="relative flex-1 w-full bg-gradient-to-b from-slate-900 via-slate-950 to-[#0e1626] overflow-hidden">
            {/* Architectural building grid pattern */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Simulated Commercial Building Windows and Facade Texture */}
            <div className="absolute inset-6 border border-slate-800/80 rounded-lg bg-slate-900/60 p-6 flex flex-col justify-between">
              {/* Building Floor Ledgers */}
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono text-slate-500">{building.name.toUpperCase()} · FACADE ELEVATION</span>
                <span className="text-xs font-mono text-amber-400/80">{building.facadeOrientation}</span>
              </div>

              {/* Window grid */}
              <div className="grid grid-cols-6 gap-3 my-4 flex-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-sky-900/40 bg-sky-950/20 rounded p-1 flex flex-col justify-between relative group"
                  >
                    <div className="text-[9px] font-mono text-sky-500/60">LVL {Math.floor(i / 6) + 1}</div>
                    <div className="w-full h-8 bg-sky-500/10 rounded-sm" />
                  </div>
                ))}
              </div>

              {/* Ground floor street entrance */}
              <div className="h-12 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>STREET CANYON ELEVATION: 0.00m (WIDTH: {building.canyonWidthMeters}m)</span>
                <span className="text-red-400">PEDESTRIAN ZONE ADJACENT</span>
              </div>
            </div>

            {/* Laser Scan Line Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce transition-all duration-300" />
            )}

            {/* Detected Bounding Boxes Layer */}
            {scanComplete && (
              <div className="absolute inset-6 pointer-events-none">
                {/* Render Split AC Bounding Boxes */}
                {(filterType === 'all' || filterType === 'split') &&
                  splitBoxes.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        height: box.height,
                      }}
                      className="absolute border border-red-500/80 bg-red-500/10 rounded-sm pointer-events-auto group hover:border-amber-400 hover:bg-amber-400/20 transition-all cursor-pointer"
                    >
                      <div className="absolute -top-4 left-0 bg-red-600 text-white font-mono text-[9px] px-1 rounded-xs whitespace-nowrap shadow">
                        Split AC ({box.confidence})
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full border border-red-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Render VRF Master Condensers */}
                {(filterType === 'all' || filterType === 'vrf') &&
                  vrfBoxes.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        height: box.height,
                      }}
                      className="absolute border-2 border-amber-500 bg-amber-500/15 rounded-sm pointer-events-auto group hover:border-white transition-all cursor-pointer"
                    >
                      <div className="absolute -top-4 left-0 bg-amber-600 text-slate-950 font-mono font-bold text-[9px] px-1 rounded-xs whitespace-nowrap shadow">
                        VRF MASTER (42 kW)
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Scanner Bottom Toolbar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Filter Detected Classes:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${filterType === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All (70 Units)
              </button>
              <button
                onClick={() => setFilterType('split')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${filterType === 'split' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Split Units ({building.detectedOutdoorUnits.splitUnits})
              </button>
              <button
                onClick={() => setFilterType('vrf')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${filterType === 'vrf' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                VRF Commercial ({building.detectedOutdoorUnits.vrfUnits})
              </button>
            </div>

            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Model Confidence: 97.4% mAP</span>
            </div>
          </div>
        </div>

        {/* Right Audit Results Panel */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">AI Telemetry Audit</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-semibold">
                Critical Violation
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Total Sensible Heat Dumping</div>
                <div className="text-2xl font-bold font-mono text-red-400 tabular-nums">
                  {building.rejectedHeatKw} <span className="text-sm font-normal text-slate-400">kW continuous</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Equivalent to {Math.round(building.rejectedHeatKw / 2)} domestic space heaters running simultaneously on the sidewalk.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Exhaust Air Temp</div>
                  <div className="text-base font-bold font-mono text-amber-400 tabular-nums">
                    {building.exhaustAirTempCelsius}°C
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Street Heat Delta</div>
                  <div className="text-base font-bold font-mono text-red-400 tabular-nums">
                    +{(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Human Collateral Footprint</div>
                <div className="text-xs text-slate-300 mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span>Directly Exposed Street Vendors:</span>
                    <span className="font-mono font-bold text-white">{building.adjacentVulnerablePopulation.vendorsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Informal Settlement Dwellers:</span>
                    <span className="font-mono font-bold text-white">{building.adjacentVulnerablePopulation.informalSettlementDwellers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Pedestrian Footfall:</span>
                    <span className="font-mono font-bold text-white">{building.adjacentVulnerablePopulation.dailyPedestrianFootfall.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-800/50 text-amber-200 text-xs">
                <div className="font-semibold mb-1 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                  Thermal Debt Score: {building.thermalDebtScore}/100
                </div>
                Assessed Monthly Exhaust Tax: <strong className="font-mono font-bold text-white">₹{building.monthlyExhaustTaxInr.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenLedger}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700 cursor-pointer"
          >
            <span>Proceed to Municipal Thermal Debt Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
