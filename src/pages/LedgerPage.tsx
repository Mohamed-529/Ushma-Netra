import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import { ThermalDebtLedger } from '../components/ThermalDebtLedger';
import {
  Scale,
  Building2,
  TrendingDown,
  Award,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  IndianRupee,
  Users
} from 'lucide-react';

interface Props {
  buildings: BuildingAudit[];
  selectedBuilding: BuildingAudit;
  onSelectBuilding: (b: BuildingAudit) => void;
  vendor: VendorTelemetry;
  onApplyMitigation: (buildingId: string, intervention: string) => void;
}

export const LedgerPage: React.FC<Props> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  vendor,
  onApplyMitigation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unmitigated' | 'compliant'>('all');

  const totalMonthlyTax = buildings.reduce((acc, b) => acc + b.monthlyExhaustTaxInr, 0);
  const totalHeatKw = buildings.reduce((acc, b) => acc + b.rejectedHeatKw, 0);
  const totalVendors = buildings.reduce((acc, b) => acc + b.adjacentVulnerablePopulation.vendorsCount, 0);

  // Sorted leaderboard by thermal debt
  const leaderboard = [...buildings].sort((a, b) => b.thermalDebtScore - a.thermalDebtScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link to="/" className="hover:text-zinc-200 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-amber-400 font-semibold">Municipal Debt Ledger</span>
      </nav>

      {/* Page Title & Metrics Banner */}
      <div className="space-y-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Section 133 CrPC Statutory Ledger
          </span>
          <span className="text-zinc-500 text-xs font-mono">·</span>
          <span className="text-zinc-400 text-xs font-mono">
            Commercial AC Heat Dumping Penalties
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Municipal Thermal Exhaust Debt Ledger
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Assessing statutory public nuisance and environmental hazard surcharges against commercial towers that dump unconsented 45°C–56°C AC exhaust onto pedestrian rights-of-way, directly funding municipal hydration and cool-island retrofits.
        </p>

        {/* Aggregate Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                Total Monthly Surcharge Levied
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                ₹{totalMonthlyTax.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                Aggregate Rejected Heat
              </div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {(totalHeatKw / 1000).toFixed(2)} Megawatts
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">
                Vulnerable Vendor Beneficiaries
              </div>
              <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                {totalVendors} Workers
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Deep Interactive Ledger Component */}
      <ThermalDebtLedger
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={onSelectBuilding}
        vendor={vendor}
        onApplyMitigation={onApplyMitigation}
      />

      {/* Leaderboard Table of Top Heat Polluters */}
      <div className="bg-[#0b0b10] rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Commercial Polluter Heat Debt Leaderboard</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Official ranking of commercial complexes dumping the highest sensible heat into pedestrian zones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/grid"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
            >
              View Full Grid
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Commercial Complex</th>
                <th className="py-3 px-4">City / Ward</th>
                <th className="py-3 px-4 text-right">Plume Delta</th>
                <th className="py-3 px-4 text-right">Rejected Heat</th>
                <th className="py-3 px-4 text-right">Thermal Debt</th>
                <th className="py-3 px-4 text-right">Assessed Surcharge</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {leaderboard.map((b, idx) => (
                <tr
                  key={b.id}
                  onClick={() => onSelectBuilding(b)}
                  className={`hover:bg-zinc-900/60 cursor-pointer transition-colors ${
                    selectedBuilding.id === b.id ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-zinc-500">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#0${idx + 1}`}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-white">
                    <div>{b.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500 font-normal">
                      {b.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{b.city}</td>
                  <td className="py-3 px-4 text-right font-bold text-amber-400">
                    +{(b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1)}°C
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-200">
                    {b.rejectedHeatKw} kW ({b.totalCoolingTonnageTR} TR)
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    {b.thermalDebtScore}/100
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    ₹{b.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.mitigationStatus === 'compliant'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : b.mitigationStatus === 'under_review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {b.mitigationStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
