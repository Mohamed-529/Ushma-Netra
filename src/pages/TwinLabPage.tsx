import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import { LiveProductCockpit } from '../components/experience/LiveProductCockpit';
import {
  ChevronRight,
  ArrowRight,
  Home,
} from 'lucide-react';

interface Props {
  building: BuildingAudit;
  allBuildings: BuildingAudit[];
  onSelectBuilding: (b: BuildingAudit) => void;
  vendor: VendorTelemetry;
  allVendors?: VendorTelemetry[];
  onSelectVendor?: (v: VendorTelemetry) => void;
  isMitigated: boolean;
  onMitigationToggle: (mitigated: boolean) => void;
  onApplyMitigation?: (buildingId: string, intervention: string) => void;
  onSimulateSurge: () => void;
}

export const TwinLabPage: React.FC<Props> = ({
  building,
  allBuildings,
  onSelectBuilding,
  vendor,
  allVendors = [vendor],
  onSelectVendor = () => {},
  isMitigated,
  onMitigationToggle,
  onApplyMitigation = () => {},
  onSimulateSurge,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#12161A] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Navigation & Breadcrumbs Bar on #12161A Dark Canvas */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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
            <span className="text-white font-bold">3D CFD Digital Twin</span>
          </nav>
        </div>

        {/* Full Interactive 3D Digital Twin & Hardware-Software Workspace */}
        <LiveProductCockpit
          building={building}
          allBuildings={allBuildings}
          onSelectBuilding={onSelectBuilding}
          vendor={vendor}
          allVendors={allVendors}
          onSelectVendor={onSelectVendor}
          isMitigated={isMitigated}
          onMitigationToggle={onMitigationToggle}
          onApplyMitigation={onApplyMitigation}
          onSimulateSurge={onSimulateSurge}
        />

        {/* Cross Navigation Footer Cards (Pure White #FFFFFF Cards Floating on #12161A Canvas) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <Link
            to="/grid"
            className="p-6 rounded-3xl bg-[#FFFFFF] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-left transition-all group shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#a8321a] uppercase font-bold">
              National Data
            </div>
            <div className="text-base font-black text-[#111827] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
              <span>Thermal Grid Registry</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
          <Link
            to="/scanner"
            className="p-6 rounded-3xl bg-[#FFFFFF] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-left transition-all group shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#a8321a] uppercase font-bold">
              Computer Vision
            </div>
            <div className="text-base font-black text-[#111827] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
              <span>AI Façade Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
          <Link
            to="/ledger"
            className="p-6 rounded-3xl bg-[#FFFFFF] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-left transition-all group shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#a8321a] uppercase font-bold">
              Statutory Penalties
            </div>
            <div className="text-base font-black text-[#111827] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
              <span>Thermal Debt Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
