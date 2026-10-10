import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Satellite,
  Scan,
  Wind,
  Radio,
  Scale,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Terminal,
  Activity,
  Flame,
  Zap,
  Play,
  ArrowLeft,
  Home
} from 'lucide-react';
import { AWSArchitectureExplorer } from '../components/AWSArchitectureExplorer';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const steps = [
    {
      step: 1,
      title: 'Satellite Land Surface Temperature (LST) Calibration',
      shortTitle: 'Satellite Ingestion',
      icon: Satellite,
      badge: 'Earth Observation',
      sensor: 'USGS Landsat-9 (TIR Band 10) & ESA Sentinel-3 SLSTR',
      resolution: '30m Thermal Spatial Grid, 100m Radiometric',
      summary:
        'Continuous orbital ingestion of thermal infrared radiance layers maps baseline metro surface temperatures across Indian urban centers, identifying regional micro-heat island hotspots before street-level inspection.',
      equation: 'LST = (γ / ε) · (ψ₁ · L_sen + ψ₂) + ψ₃ + δ',
      cloudService: 'AWS Lambda + Amazon S3 Planetary Data Ingestion',
      inputData: 'Radiance values: 10.89 W/(m²·sr·μm), Ambient baseline: 41.2°C',
      outputData: 'Delhi NCR Heat Anomaly Polygon: +4.8°C above suburban greenery',
    },
    {
      step: 2,
      title: 'Edge YOLOv8 Computer Vision Façade Profiling',
      shortTitle: 'Edge CV Scanner',
      icon: Scan,
      badge: 'Autonomous CV',
      sensor: 'Street-Level Mobile Survey Cameras + Municipal Drones',
      resolution: '4K Optical + Edge Coral TPU Inference at 30 FPS',
      summary:
        'Custom-trained YOLOv8 neural network detects and classifies outdoor condenser banks (Split ACs, VRF Heat Exchangers, Rooftop Chillers) along building façades, extracting orientation, elevation, and direct exhaust blast vectors.',
      equation: 'IoU ≥ 0.86 · Confidence > 94.2% (142 audited façades)',
      cloudService: 'AWS SageMaker Edge + AWS IoT Greengrass v2',
      inputData: 'Façade video stream: 1080p, 64 detected split units + 6 VRF stacks',
      outputData: 'Total Rejected Heat: 638.4 kW expelled directly into street canyon',
    },
    {
      step: 3,
      title: 'Micro-Climate Urban Canopy Plume Dispersion Model',
      shortTitle: 'Fluid Plume CFD',
      icon: Wind,
      badge: 'Thermodynamics',
      sensor: 'Eulerian Micro-Turbulence Fluid Dynamic Simulation',
      resolution: '0.25m Voxel Grid in Narrow Street Canyons (H/W > 2.0)',
      summary:
        'Physics-informed fluid dynamic solvers compute how superheated 53°C+ exhaust air gets trapped in narrow street canyons, calculating temperature decay curves and trapped boundary heat accumulation over time.',
      equation: '∂T/∂t + u · ∇T = α ∇²T + Q_exhaust / (ρ · c_p)',
      cloudService: 'AWS High-Performance Computing (HPC) ParallelCluster',
      inputData: 'Canyon Width: 7.2m, Wind Velocity: 1.2 m/s, Ambient: 41.2°C',
      outputData: 'Street Plume Air: 47.8°C (+6.6°C thermal trap at ground level)',
    },
    {
      step: 4,
      title: 'Vendor IoT BLE Mesh & Physiological WBGT Ingestion',
      shortTitle: 'IoT BLE Mesh',
      icon: Radio,
      badge: 'Ground Truth',
      sensor: 'ESP32-S3 Wearable & Cart-Mounted BLE Beacons',
      resolution: '1-Second Real-Time Pings (LoRaWAN & Cellular Gateway)',
      summary:
        'Inexpensive, ruggedized IoT sensors mounted on tea carts and vegetable stalls continuously measure Dry Bulb Temperature, Relative Humidity, and Black Globe irradiance, computing Wet Bulb Globe Temperature (WBGT).',
      equation: 'WBGT = 0.7 · T_wet + 0.2 · T_globe + 0.1 · T_dry',
      cloudService: 'AWS IoT Core (MQTT) + Amazon Timestream for Telemetry',
      inputData: 'Dry Bulb: 48.4°C, RH: 44%, Black Globe: 54.0°C',
      outputData: 'WBGT: 36.8°C (Extreme Lethality threshold crossed)',
    },
    {
      step: 5,
      title: 'Immutable Section 133 Thermal Debt Municipal Ledger',
      shortTitle: 'Legal Debt Ledger',
      icon: Scale,
      badge: 'Civic Governance',
      sensor: 'Autonomous Statutory Penalty & Restorative Surcharge Engine',
      resolution: 'Hourly Micro-Surcharge Calculation per Building',
      summary:
        'Translates excess heat dumped onto public pedestrian rights-of-way into an enforceable civic debt under Section 133 CrPC (Public Nuisance & Endangerment), levying monthly restorative tariffs to fund local cooling.',
      equation: 'Tariff = Q_rejected × (T_plume − T_base) × Vendors × R_rate',
      cloudService: 'Amazon DynamoDB + Amazon Bedrock Legal Agent',
      inputData: 'Excess Delta: +6.6°C, Vulnerable Population: 28 vendors',
      outputData: 'Statutory Monthly Surcharge: ₹1,84,500 assessed against building',
    },
    {
      step: 6,
      title: 'Autonomous SCADA Mitigation & Skyward Louver Actuation',
      shortTitle: 'SCADA Mitigation',
      icon: ShieldCheck,
      badge: 'Physical Actuation',
      sensor: '70-Bar High Pressure Evaporative Mist Kiosks & Dynamic Louvers',
      resolution: 'Automatic Sub-Second Relay Triggering via Cloud SCADA',
      summary:
        'When lethal thresholds are breached, the system autonomously triggers pneumatic louver deflectors to direct exhaust upward above the roof canopy, and activates street-level mist hydration arches to cool vendors.',
      equation: 'ΔT_evap = (ṁ_water · h_fg) / (ṁ_air · c_p)',
      cloudService: 'AWS IoT Device Management + MQTT Relay Actuation',
      inputData: 'Surge trigger: WBGT > 36.5°C in alleyway for 5+ minutes',
      outputData: 'Actuation verified: 3 Mist Hydration lines ON, Street delta lowered by 5.4°C',
    },
  ];

  const currentStep = steps.find((s) => s.step === activeStep) || steps[0];

  const runFullPipelineTest = () => {
    setSimulationRunning(true);
    setSimulationLog([]);

    const logMessages = [
      '🛰️ [T+0.0s] Ingesting USGS Landsat-9 TIR Band 10 surface radiance at Laxmi Nagar (28.6318°N, 77.2776°E)...',
      '📷 [T+0.8s] Edge YOLOv8 scanned building façade: 64 Split units + 6 VRF heat exchangers confirmed (Confidence: 96.4%).',
      '💨 [T+1.5s] Eulerian CFD solver executing: 638.4 kW rejected heat injected into 7.2m canyon. Street plume hits 47.8°C.',
      '📡 [T+2.2s] IoT Vendor Beacon #01 (Rameshwar Pal) pinged: WBGT crossed 36.8°C (Extreme Lethality Level).',
      '⚖️ [T+3.0s] Section 133 CrPC Municipal Surcharge triggered: ₹1,84,500/month assessed to building operator.',
      '💦 [T+3.8s] SCADA Relay Actuation: 3 High-pressure evaporative mist hydration kiosks activated. Ground temp dropping to 42.4°C!',
      '✅ [T+4.5s] Pipeline execution complete: 100% data integrity verified on AWS Cloud.',
    ];

    logMessages.forEach((msg, idx) => {
      setTimeout(() => {
        setSimulationLog((prev) => [...prev, msg]);
        if (idx === logMessages.length - 1) {
          setSimulationRunning(false);
        }
      }, (idx + 1) * 700);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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
          <span className="text-amber-400 font-semibold">Autonomous Pipeline</span>
        </nav>
      </div>

      {/* Page Title & Intro */}
      <div className="space-y-3 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            System Architecture
          </span>
          <span className="text-zinc-500 text-xs font-mono">·</span>
          <span className="text-zinc-400 text-xs font-mono">
            6-Stage Sensor to Actuation Closed-Loop
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          How Ushma-Netra Works
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          From high-altitude thermal infrared satellites to street-level edge computer vision, IoT micro-thermistor mesh, statutory civic penalty ledgers, and autonomous physical cooling misting actuation.
        </p>
      </div>

      {/* Step Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.step;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  STAGE 0{s.step}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
              </div>
              <div className="text-xs font-bold font-sans text-zinc-100 truncate">
                {s.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Breakdown */}
      <div className="bg-[#0c0c12] rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold">
                Stage 0{currentStep.step} of 06
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                {currentStep.badge}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{currentStep.title}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {currentStep.summary}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2 lg:w-72">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Cloud Infrastructure</span>
              <span className="text-amber-300 font-bold">{currentStep.cloudService}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Sensor Hardware</span>
              <span className="text-zinc-300">{currentStep.sensor}</span>
            </div>
          </div>
        </div>

        {/* Input vs Output Pipeline Inspection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input Data Card */}
          <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Input Telemetry Layer</span>
            </div>
            <div className="text-sm text-zinc-200 font-mono bg-zinc-900/60 p-3 rounded-lg border border-zinc-850">
              {currentStep.inputData}
            </div>
          </div>

          {/* Processed Verified Output Card */}
          <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Output State</span>
            </div>
            <div className="text-sm text-emerald-300 font-mono bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40">
              {currentStep.outputData}
            </div>
          </div>
        </div>

        {/* Mathematical Formulation */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">
              Core Formulation & Computational Logic
            </span>
            <span className="font-mono text-xs sm:text-sm text-amber-200">
              {currentStep.equation}
            </span>
          </div>
          <Link
            to="/methodology"
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 font-semibold"
          >
            <span>View Full Science</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Interactive Live Pipeline Simulation Playground */}
      <div className="bg-gradient-to-br from-zinc-950 via-[#0d0d14] to-zinc-950 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Live Pipeline Execution Playground</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Trigger an end-to-end simulated cycle: Satellite Radiance → Edge YOLOv8 → Eulerian Plume → IoT Mesh → Legal Ledger → Physical SCADA.
            </p>
          </div>

          <button
            onClick={runFullPipelineTest}
            disabled={simulationRunning}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
          >
            {simulationRunning ? (
              <>
                <span className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Simulating Closed-Loop...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute 6-Stage Cycle</span>
              </>
            )}
          </button>
        </div>

        {/* Live Terminal Log Stream */}
        <div className="bg-black/80 rounded-xl border border-zinc-800 p-4 font-mono text-xs text-zinc-300 space-y-2 min-h-48">
          <div className="text-[11px] text-zinc-500 border-b border-zinc-900 pb-2 flex items-center justify-between">
            <span>Ushma-Netra AWS EventBridge Stream</span>
            <span className="text-emerald-400 font-bold">READY</span>
          </div>
          {simulationLog.length === 0 ? (
            <div className="text-zinc-600 italic py-6 text-center">
              Click &quot;Execute 6-Stage Cycle&quot; above to watch the end-to-end data pipeline run live.
            </div>
          ) : (
            simulationLog.map((log, i) => (
              <div key={i} className="animate-in fade-in duration-300">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* AWS Cloud Architecture Deep Dive Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">AWS Cloud Architecture Topology</h3>
            <p className="text-xs text-zinc-400">
              Serverless enterprise event fabric powering low-latency thermal equity verification.
            </p>
          </div>
        </div>
        <AWSArchitectureExplorer />
      </div>

      {/* Bottom Cross-Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
        <Link
          to="/grid"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors group"
        >
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Explore Data</div>
          <div className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
            <span>National Thermal Grid</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/methodology"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors group"
        >
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Scientific Rigor</div>
          <div className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
            <span>Mathematical Derivations</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          to="/twin"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors group"
        >
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Interactive Simulation</div>
          <div className="text-sm font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
            <span>Launch 3D CFD Twin</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};
