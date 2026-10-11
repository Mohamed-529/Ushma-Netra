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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
          <span className="text-[#a8321a] font-bold">3D CFD Digital Twin &amp; Control</span>
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

      {/* Cross Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#d6cebe]">
        <Link
          to="/grid"
          className="p-5 rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] text-left transition-colors group shadow-sm"
        >
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold">National Data</div>
          <div className="text-sm font-bold text-[#0b1b2d] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
            <span>Thermal Grid Registry</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/scanner"
          className="p-5 rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] text-left transition-colors group shadow-sm"
        >
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold">Computer Vision</div>
          <div className="text-sm font-bold text-[#0b1b2d] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
            <span>AI Façade Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/ledger"
          className="p-5 rounded-2xl bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] text-left transition-colors group shadow-sm"
        >
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold">Statutory Penalties</div>
          <div className="text-sm font-bold text-[#0b1b2d] group-hover:text-[#a8321a] flex items-center justify-between mt-1">
            <span>Thermal Debt Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};
