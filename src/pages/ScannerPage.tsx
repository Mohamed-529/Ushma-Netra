import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingAudit } from '../types';
import { FacadeComputerVisionScanner } from '../components/FacadeComputerVisionScanner';
import {
  Scan,
  Cpu,
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Home
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
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-bold transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-medium transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-[#0b1b2d]/70">
          <Link to="/" className="hover:text-[#a8321a] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#0b1b2d]/40" />
          <span className="text-[#a8321a] font-bold">AI Façade Computer Vision Scanner</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#d6cebe]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300">
              Edge Computer Vision
            </span>
            <span className="text-[#0b1b2d]/40 text-xs font-mono">·</span>
            <span className="text-[#0b1b2d]/80 text-xs font-mono font-semibold">
              YOLOv8 Outdoor Condenser Unit Extraction
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#0b1b2d]">
            AI Façade Computer Vision &amp; Thermal Leak Scanner
          </h1>
          <p className="text-xs text-[#1f3044]">
            Real-time automated edge camera inference detecting outdoor split condensers, VRF heat exchangers, and unauthorized horizontal exhaust blasts.
          </p>
        </div>

        {/* Quick Cross Links */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/twin')}
            className="px-3.5 py-2 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Launch 3D Twin</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#a8321a]" />
          </button>
          <button
            onClick={() => navigate('/ledger')}
            className="px-3.5 py-2 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] border border-[#0b1b2d] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>View Surcharge Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
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

      {/* Edge Hardware & Architecture Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#d6cebe]">
        <div className="p-5 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] space-y-2 shadow-sm">
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>Neural Model Specs</span>
          </div>
          <h4 className="text-sm font-bold text-[#0b1b2d]">YOLOv8-Thermal Nano</h4>
          <p className="text-xs text-[#1f3044] leading-relaxed">
            Quantized INT8 weights executing on Google Coral Edge TPU and Raspberry Pi 5 with 14ms inference latency per frame.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] space-y-2 shadow-sm">
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-700" />
            <span>Optics &amp; Sensor Calibration</span>
          </div>
          <h4 className="text-sm font-bold text-[#0b1b2d]">Dual Optical / LWIR Sensor</h4>
          <p className="text-xs text-[#1f3044] leading-relaxed">
            Co-aligned 4K optical sensor + 8-14μm long-wave infrared thermal sensor registering pixel-level surface temperature false colors.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] space-y-2 shadow-sm">
          <div className="text-[10px] font-mono text-[#526071] uppercase font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Evidence Immutability</span>
          </div>
          <h4 className="text-sm font-bold text-[#0b1b2d]">Cryptographic Timestamping</h4>
          <p className="text-xs text-[#1f3044] leading-relaxed">
            Façade audit bounding boxes cryptographically hashed and anchored on AWS Timestream for legal admissibility under Section 133 CrPC.
          </p>
        </div>
      </div>
    </div>
  );
};
