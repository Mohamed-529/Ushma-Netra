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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-750 text-xs font-mono font-medium transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-amber-400 font-semibold">AI Façade Computer Vision Scanner</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Edge Computer Vision
            </span>
            <span className="text-zinc-500 text-xs font-mono">·</span>
            <span className="text-zinc-400 text-xs font-mono">
              YOLOv8 Outdoor Condenser Unit Extraction
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">
            AI Façade Computer Vision &amp; Thermal Leak Scanner
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time automated edge camera inference detecting outdoor split condensers, VRF heat exchangers, and unauthorized horizontal exhaust blasts.
          </p>
        </div>

        {/* Quick Cross Links */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/twin')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Launch 3D Twin</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => navigate('/ledger')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-zinc-800">
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Neural Model Specs</span>
          </div>
          <h4 className="text-sm font-bold text-white">YOLOv8-Thermal Nano</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Quantized INT8 weights executing on Google Coral Edge TPU and Raspberry Pi 5 with 14ms inference latency per frame.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Optics & Sensor Calibration</span>
          </div>
          <h4 className="text-sm font-bold text-white">Dual Optical / LWIR Sensor</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Co-aligned 4K optical sensor + 8-14μm long-wave infrared thermal sensor registering pixel-level surface temperature false colors.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Evidence Immutability</span>
          </div>
          <h4 className="text-sm font-bold text-white">Cryptographic Timestamping</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Façade audit bounding boxes cryptographically hashed and anchored on AWS Timestream for legal admissibility under Section 133 CrPC.
          </p>
        </div>
      </div>
    </div>
  );
};
