import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Users,
  ArrowLeft,
  Home
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
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unmitigated' | 'compliant'>('all');

  const totalMonthlyTax = buildings.reduce((acc, b) => acc + b.monthlyExhaustTaxInr, 0);
  const totalHeatKw = buildings.reduce((acc, b) => acc + b.rejectedHeatKw, 0);
  const totalVendors = buildings.reduce((acc, b) => acc + b.adjacentVulnerablePopulation.vendorsCount, 0);

  // Sorted leaderboard by thermal debt
  const leaderboard = [...buildings].sort((a, b) => b.thermalDebtScore - a.thermalDebtScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-semibold transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-[#0b1b2d]/70">
          <Link to="/" className="hover:text-[#a8321a] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#0b1b2d]/40" />
          <span className="text-[#a8321a] font-bold">Municipal Debt Ledger</span>
        </nav>
      </div>

      {/* Page Title & Metrics Banner */}
      <div className="space-y-4 pb-6 border-b border-[#d6cebe]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
            Section 133 CrPC Statutory Ledger
          </span>
          <span className="text-[#0b1b2d]/40 text-xs font-mono">·</span>
          <span className="text-[#0b1b2d]/80 text-xs font-mono font-semibold">
            Commercial AC Heat Dumping Penalties
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0b1b2d]">
          Municipal Thermal Exhaust Debt Ledger
        </h1>
        <p className="text-sm text-[#1f3044] max-w-3xl leading-relaxed">
          Assessing statutory public nuisance and environmental hazard surcharges against commercial towers that dump unconsented 45°C–56°C AC exhaust onto pedestrian rights-of-way, directly funding municipal hydration and cool-island retrofits.
        </p>

        {/* Aggregate Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[10px] font-mono text-[#526071] uppercase font-bold tracking-wider">
                Total Monthly Surcharge Levied
              </div>
              <div className="text-2xl font-black font-mono text-emerald-800 mt-1">
                ₹{totalMonthlyTax.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[10px] font-mono text-[#526071] uppercase font-bold tracking-wider">
                Aggregate Rejected Heat
              </div>
              <div className="text-2xl font-black font-mono text-[#a8321a] mt-1">
                {(totalHeatKw / 1000).toFixed(2)} Megawatts
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[10px] font-mono text-[#526071] uppercase font-bold tracking-wider">
                Vulnerable Vendor Beneficiaries
              </div>
              <div className="text-2xl font-black font-mono text-rose-800 mt-1">
                {totalVendors} Workers
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300">
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
      <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#0b1b2d] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#a8321a]" />
              <span>Commercial Polluter Heat Debt Leaderboard</span>
            </h3>
            <p className="text-xs text-[#1f3044]">
              Official ranking of commercial complexes dumping the highest sensible heat into pedestrian zones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/grid"
              className="px-3.5 py-1.5 rounded-xl bg-[#f5efe6] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] text-xs font-mono font-bold transition-colors"
            >
              View Full Grid
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#d6cebe]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#dfd7c9] border-b border-[#d6cebe] text-[#0b1b2d] uppercase text-[10px] font-bold">
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
            <tbody className="divide-y divide-[#d6cebe] text-[#0b1b2d] bg-[#f7f2ea]">
              {leaderboard.map((b, idx) => (
                <tr
                  key={b.id}
                  onClick={() => onSelectBuilding(b)}
                  className={`hover:bg-[#efe8dc] cursor-pointer transition-colors ${
                    selectedBuilding.id === b.id ? 'bg-[#e4dcce]/70' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-[#0b1b2d]/60">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#0${idx + 1}`}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-[#0b1b2d]">
                    <div>{b.name}</div>
                    <div className="text-[10px] font-mono text-[#526071] font-normal">
                      {b.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#1f3044]">{b.city}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#a8321a]">
                    +{(b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1)}°C
                  </td>
                  <td className="py-3 px-4 text-right text-[#0b1b2d] font-semibold">
                    {b.rejectedHeatKw} kW ({b.totalCoolingTonnageTR} TR)
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-800">
                    {b.thermalDebtScore}/100
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800">
                    ₹{b.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        b.mitigationStatus === 'compliant'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : b.mitigationStatus === 'under_review'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
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
