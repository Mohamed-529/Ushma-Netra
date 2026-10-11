import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit } from '../types';
import { FacadeComputerVisionScanner } from '../components/FacadeComputerVisionScanner';
import {
  Cpu,
  ChevronRight,
  ArrowRight,
  Camera,
  CheckCircle2,
  Home,
} from 'lucide-react';

interface Props {
  building: BuildingAudit;
  allBuildings: BuildingAudit[];
  onSelectBuilding: (b: BuildingAudit) => void;
}

export const ScannerPage: React.FC<Props> = ({
  building,
  allBuildings,
  onSelectBuilding,
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
          <span className="text-amber-400 font-bold">AI Façade Computer Vision Scanner</span>
        </nav>
      </div>

      {/* Header on #12161A Dark Canvas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-400/15 text-sky-300 border border-sky-400/30">
              Edge Computer Vision
            </span>
            <span className="text-slate-500 text-xs font-mono">·</span>
            <span className="text-slate-300 text-xs font-mono font-semibold">
              YOLOv8 Outdoor Condenser Unit Extraction
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">
            AI Façade Computer Vision &amp; Thermal Leak Scanner
          </h1>
          <p className="text-xs text-slate-300">
            Real-time automated edge camera inference detecting outdoor split condensers, VRF heat exchangers, and unauthorized horizontal exhaust blasts.
          </p>
        </div>

        {/* Quick Cross Links */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/twin')}
            className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <span>Launch 3D Twin</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#a8321a]" />
          </button>
          <button
            onClick={() => navigate('/ledger')}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#111827] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <span>View Surcharge Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#111827]" />
          </button>
        </div>
      </div>

      {/* Embedded Scanner */}
      <FacadeComputerVisionScanner
        building={building}
        onSelectBuilding={onSelectBuilding}
        allBuildings={allBuildings}
        onOpenLedger={() => navigate('/ledger')}
      />

      {/* Edge Hardware & Architecture Specifications in Pure White #FFFFFF Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-white/10">
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] space-y-2 shadow-xl">
          <div className="text-[10px] font-mono text-[#a8321a] uppercase font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>Neural Model Specs</span>
          </div>
          <h4 className="text-sm font-bold text-[#111827]">YOLOv8-Thermal Nano</h4>
          <p className="text-xs text-[#111827]/80 leading-relaxed">
            Quantized INT8 weights executing on Google Coral Edge TPU and Raspberry Pi 5 with 14ms inference latency per frame.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] space-y-2 shadow-xl">
          <div className="text-[10px] font-mono text-sky-700 uppercase font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-700" />
            <span>Optics &amp; Sensor Calibration</span>
          </div>
          <h4 className="text-sm font-bold text-[#111827]">Dual Optical / LWIR Sensor</h4>
          <p className="text-xs text-[#111827]/80 leading-relaxed">
            Co-aligned 4K optical sensor + 8-14μm long-wave infrared thermal sensor registering pixel-level surface temperature false colors.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] space-y-2 shadow-xl">
          <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Evidence Immutability</span>
          </div>
          <h4 className="text-sm font-bold text-[#111827]">Cryptographic Timestamping</h4>
          <p className="text-xs text-[#111827]/80 leading-relaxed">
            Façade audit bounding boxes cryptographically hashed and anchored on AWS Timestream for legal admissibility under Section 133 CrPC.
          </p>
        </div>
      </div>
    </div>
  );
};
