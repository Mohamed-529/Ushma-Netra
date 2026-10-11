import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Activity,
  Zap,
  Play,
  Home,
} from 'lucide-react';
import { AWSArchitectureExplorer } from '../components/AWSArchitectureExplorer';

export const HowItWorksPage: React.FC = () => {
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
      resolution: '30m Thermal Spatial Grid · 100m Radiometric',
      bullets: [
        'Ingests orbital thermal infrared (TIR) radiance across Indian commercial corridors',
        'Flags +4.8°C micro-heat island polygons before street-level drone/camera dispatch',
      ],
      equation: 'LST = (γ / ε) · (ψ₁ · L_sen + ψ₂) + ψ₃ + δ',
      cloudService: 'AWS Lambda + Amazon S3 Planetary Ingestion',
      inputData: 'Radiance: 10.89 W/(m²·sr·μm) · Ambient Baseline: 41.2°C',
      outputData: 'Hotspot Polygon Flagged: +4.8°C above suburban greenery',
    },
    {
      step: 2,
      title: 'Edge YOLOv8 Computer Vision Façade Profiling',
      shortTitle: 'Edge CV Scanner',
      icon: Scan,
      badge: 'Autonomous CV',
      sensor: 'Street-Level Survey Cameras + Edge Coral TPU',
      resolution: '4K Optical + INT8 Inference at 30 FPS',
      bullets: [
        'Counts Split AC condensers, VRF banks, and rooftop chillers on commercial façades',
        'Extracts vent elevation, horizontal blast orientation, and total kW heat rejection',
      ],
      equation: 'IoU ≥ 0.86 · Confidence > 94.2% (142 audited façades)',
      cloudService: 'AWS SageMaker Edge + AWS IoT Greengrass v2',
      inputData: 'Façade Frame: 64 Split Units + 6 VRF Heat Exchangers',
      outputData: 'Rejected Sensible Heat: 638.4 kW into street canyon',
    },
    {
      step: 3,
      title: 'Micro-Climate Urban Canopy Plume Dispersion Model',
      shortTitle: 'Fluid Plume CFD',
      icon: Wind,
      badge: 'Thermodynamics',
      sensor: 'Eulerian Micro-Turbulence Fluid Dynamic Solver',
      resolution: '0.25m Voxel Grid in Narrow Street Canyons (H/W > 2.0)',
      bullets: [
        'Models how 53.6°C AC exhaust gets trapped inside narrow urban canyons',
        'Computes pedestrian head-level temperature elevation and stagnation vortices',
      ],
      equation: '∂T/∂t + u · ∇T = α ∇²T + Q_exhaust / (ρ · c_p)',
      cloudService: 'AWS HPC ParallelCluster + Amazon Location Geofence',
      inputData: 'Canyon Width: 7.2m · Wind: 1.2 m/s · Ambient: 41.2°C',
      outputData: 'Street Plume Air: 47.8°C (+6.6°C trapped delta)',
    },
    {
      step: 4,
      title: 'Vendor ESP32-S3 + Phone Beacon + AirPods Voice Alert',
      shortTitle: 'ESP32 & AirPods',
      icon: Radio,
      badge: 'Ground Truth Hardware',
      sensor: 'ESP32-S3 USB/BLE Sensor + Smartphone Bridge + AirPods',
      resolution: 'Sub-Second MQTT Pings (<180ms Latency)',
      bullets: [
        'Streams Dry-Bulb, Humidity, and WBGT from cart sensor via USB cable or BLE',
        'Fires instant Tamil (தமிழ்), English, and Hindi voice warnings into vendor AirPods',
      ],
      equation: 'WBGT = 0.7 · T_wet + 0.2 · T_globe + 0.1 · T_dry',
      cloudService: 'AWS IoT Core (MQTT) + EventBridge + Amazon Polly',
      inputData: 'Dry Bulb: 53.6°C · RH: 44% · Node: ESP32_S3_CART_01',
      outputData: 'WBGT: 36.8°C (Lethal Limit) → AirPods Audio Triggered',
    },
    {
      step: 5,
      title: 'Neptune 3-Hop Liability Graph & Section 133 Debt Ledger',
      shortTitle: 'Legal Debt Ledger',
      icon: Scale,
      badge: 'Civic Governance',
      sensor: 'Autonomous Statutory Penalty & Restorative Surcharge Engine',
      resolution: '14.2ms Graph Traversal + Bedrock Guardrails v2',
      bullets: [
        'Links [Vendor Cart] → [HVAC Outlet] → [Corporate Entity] in Amazon Neptune Serverless',
        'Drafts PII-redacted Section 133 CrPC notices via Bedrock Agents + OpenSearch RAG',
      ],
      equation: 'Tariff = Q_rejected × (T_plume − T_base) × Vendors × R_rate',
      cloudService: 'Amazon Neptune Serverless + Bedrock Guardrails',
      inputData: 'Delta: +6.6°C · Exposed Vendors: 28 · Load: 638.4 kW',
      outputData: 'Monthly Restorative Tariff: ₹1,84,500 assessed',
    },
    {
      step: 6,
      title: 'Autonomous SCADA Mitigation & 45° Louver Actuation',
      shortTitle: 'SCADA Mitigation',
      icon: ShieldCheck,
      badge: 'Physical Actuation',
      sensor: '70-Bar Evaporative Mist Kiosks & Pneumatic 45° Louvers',
      resolution: 'Sub-Second MQTT Relay Triggering',
      bullets: [
        'Tilts commercial AC louvers 45° skyward and activates street misting arches',
        'Drops sidewalk temperature by -5.4°C and reduces building surcharge by 65%',
      ],
      equation: 'ΔT_evap = (ṁ_water · h_fg) / (ṁ_air · c_p)',
      cloudService: 'AWS IoT Core MQTT Command + DynamoDB Streams',
      inputData: 'Trigger: Alley WBGT > 36.5°C sustained for 5+ mins',
      outputData: '3 Mist Lines ON · Street WBGT dropped to 31.4°C',
    },
  ];

  const currentStep = steps.find((s) => s.step === activeStep) || steps[0];

  const runFullPipelineTest = () => {
    setSimulationRunning(true);
    setSimulationLog([]);

    const logMessages = [
      '🛰️ [01] Landsat-9 TIR Band 10 ingested → +4.8°C thermal anomaly polygon locked.',
      '📷 [02] YOLOv8 Façade CV → 64 Split ACs + 6 VRF banks (638.4 kW exhaust).',
      '💨 [03] Canyon CFD + Amazon Location 5m Geofence → 47.8°C plume breach.',
      '🎧 [04] ESP32-S3 USB + Phone Beacon → 36.8°C WBGT → Tamil/EN alert played in AirPods.',
      '⚖️ [05] Neptune 3-Hop Graph + Bedrock Guardrails → ₹1,84,500/mo Section 133 notice.',
      '💦 [06] SCADA Relay Actuation → 45° Louvers + Mist ON → Street cooled by -5.4°C.',
    ];

    logMessages.forEach((msg, idx) => {
      setTimeout(() => {
        setSimulationLog((prev) => [...prev, msg]);
        if (idx === logMessages.length - 1) {
          setSimulationRunning(false);
        }
      }, (idx + 1) * 550);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] shadow-md text-xs font-mono font-bold transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-[#a8321a]" />
          <span>Home Overview</span>
        </Link>

        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-amber-400 font-semibold">How Ushma-Netra Works</span>
        </nav>
      </div>

      {/* Page Title & Crisp Point-by-Point Intro (No Long Paragraphs) */}
      <div className="space-y-2 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            System Architecture
          </span>
          <span className="text-zinc-500 text-xs font-mono">·</span>
          <span className="text-zinc-300 text-xs font-mono font-bold">
            6-Stage Sensor-to-Actuation Closed Loop
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          How Ushma-Netra Works
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-300 pt-1">
          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            1. Satellite TIR
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            2. YOLOv8 CV
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            3. Canyon CFD
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300">
            4. ESP32 + Phone + AirPods
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            5. Neptune Sec 133
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-300">
            6. Mist &amp; Louvers
          </span>
        </div>
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
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
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

      {/* Active Stage Detailed Breakdown (Crisp Bullets, Zero Wall of Text) */}
      <div className="bg-[#0c0c12] rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="space-y-3">
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
            <ul className="space-y-1.5 text-sm text-zinc-300">
              {currentStep.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2 lg:w-80">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">AWS Cloud Service</span>
              <span className="text-amber-300 font-bold">{currentStep.cloudService}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Hardware / Sensor</span>
              <span className="text-zinc-300">{currentStep.sensor}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Resolution</span>
              <span className="text-emerald-400">{currentStep.resolution}</span>
            </div>
          </div>
        </div>

        {/* Input vs Output Pipeline Inspection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
            <div className="text-[11px] font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Input Telemetry</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-200 font-mono bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
              {currentStep.inputData}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
            <div className="text-[11px] font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Output</span>
            </div>
            <div className="text-xs sm:text-sm text-emerald-300 font-mono bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40">
              {currentStep.outputData}
            </div>
          </div>
        </div>

        {/* Mathematical Formulation */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">
              Governing Formula
            </span>
            <span className="font-mono text-xs sm:text-sm text-amber-200 font-bold">
              {currentStep.equation}
            </span>
          </div>
          <Link
            to="/methodology"
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 font-bold"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Live Pipeline Simulation Playground */}
      <div className="bg-gradient-to-br from-zinc-950 via-[#0d0d14] to-zinc-950 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Live 6-Stage Execution Trace</h3>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Satellite → YOLOv8 → CFD → ESP32/AirPods → Neptune Ledger → Mist SCADA
            </p>
          </div>

          <button
            onClick={runFullPipelineTest}
            disabled={simulationRunning}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{simulationRunning ? 'Running 6 Stages...' : 'Execute 6-Stage Cycle'}</span>
          </button>
        </div>

        <div className="bg-black/80 rounded-xl border border-zinc-800 p-4 font-mono text-xs text-zinc-300 space-y-1.5 min-h-36">
          <div className="text-[11px] text-zinc-500 border-b border-zinc-900 pb-2 flex items-center justify-between">
            <span>AWS EventBridge Bus: ushma-netra-thermal-bus</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          {simulationLog.length === 0 ? (
            <div className="text-zinc-500 py-5 text-center">
              Click &quot;Execute 6-Stage Cycle&quot; to stream all 6 stages.
            </div>
          ) : (
            simulationLog.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>

      {/* AWS Cloud Architecture Deep Dive Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">AWS Cloud Architecture Blueprint</h3>
          <span className="text-xs font-mono text-amber-400 font-bold">
            4 Core Serverless Pillars ($0.00/hr Idle)
          </span>
        </div>
        <AWSArchitectureExplorer />
      </div>
    </div>
  );
};
