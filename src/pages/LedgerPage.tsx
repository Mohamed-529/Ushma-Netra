import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import { ThermalDebtLedger } from '../components/ThermalDebtLedger';
import {
  Building2,
  Award,
  ChevronRight,
  IndianRupee,
  Users,
  Home,
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
  const totalMonthlyTax = buildings.reduce((acc, b) => acc + b.monthlyExhaustTaxInr, 0);
  const totalHeatKw = buildings.reduce((acc, b) => acc + b.rejectedHeatKw, 0);
  const totalVendors = buildings.reduce((acc, b) => acc + b.adjacentVulnerablePopulation.vendorsCount, 0);

  // Sorted leaderboard by thermal debt
  const leaderboard = [...buildings].sort((a, b) => b.thermalDebtScore - a.thermalDebtScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation & Breadcrumbs Bar on #12161A Dark Canvas */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] shadow-md text-xs font-mono font-bold transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Link to="/" className="text-white hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-amber-400 font-bold">Municipal Debt Ledger</span>
        </nav>
      </div>

      {/* Page Title & Metrics Banner on #12161A Dark Canvas */}
      <div className="space-y-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
            Section 133 CrPC Statutory Ledger
          </span>
          <span className="text-slate-500 text-xs font-mono">·</span>
          <span className="text-slate-300 text-xs font-mono font-semibold">
            Commercial AC Heat Dumping Penalties
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Municipal Thermal Exhaust Debt Ledger
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Assessing statutory public nuisance and environmental hazard surcharges against commercial towers that dump unconsented 45°C–56°C AC exhaust onto pedestrian rights-of-way, directly funding municipal hydration and cool-island retrofits.
        </p>

        {/* Aggregate Counters in Pure White #FFFFFF Floating Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-mono text-[#111827]/70 uppercase font-bold tracking-wider">
                Total Monthly Surcharge Levied
              </div>
              <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                ₹{totalMonthlyTax.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-mono text-[#111827]/70 uppercase font-bold tracking-wider">
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

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-mono text-[#111827]/70 uppercase font-bold tracking-wider">
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

      {/* Leaderboard Table of Top Heat Polluters in Pure White #FFFFFF Floating Card */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 space-y-5 shadow-xl text-[#111827]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#a8321a]" />
              <span>Commercial Polluter Heat Debt Leaderboard</span>
            </h3>
            <p className="text-xs text-[#111827]/80">
              Official ranking of commercial complexes dumping the highest sensible heat into pedestrian zones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/grid"
              className="px-3.5 py-1.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[#111827] text-xs font-mono font-bold transition-colors"
            >
              View Full Grid
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F3F4F6] border-b border-[#E5E7EB] text-[#111827] uppercase text-[10px] font-bold">
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
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827] bg-[#FFFFFF]">
              {leaderboard.map((b, idx) => (
                <tr
                  key={b.id}
                  onClick={() => onSelectBuilding(b)}
                  className={`hover:bg-[#F3F4F6] cursor-pointer transition-colors ${
                    selectedBuilding.id === b.id ? 'bg-[#F3F4F6]' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-[#111827]/60">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#0${idx + 1}`}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-[#111827]">
                    <div>{b.name}</div>
                    <div className="text-[10px] font-mono text-[#111827]/70 font-normal">
                      {b.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#111827]">{b.city}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#a8321a]">
                    +{(b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1)}°C
                  </td>
                  <td className="py-3 px-4 text-right text-[#111827] font-semibold">
                    {b.rejectedHeatKw} kW ({b.totalCoolingTonnageTR} TR)
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-800">
                    {b.thermalDebtScore}/100
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">
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
