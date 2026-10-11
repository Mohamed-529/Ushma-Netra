import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  CheckSquare,
  Square,
  Terminal,
  Globe,
  Sliders,
  ArrowRight,
  Cpu,
  Eye,
  ShieldCheck,
  Flame,
  Radio,
} from 'lucide-react';

interface ScrollDrivenShowcaseProps {
  onReplayIntro: () => void;
}

interface AgentTask {
  id: string;
  label: string;
  file: string;
  completed: boolean;
}

interface ParallelAgentItem {
  id: string;
  name: string;
  ward: string;
  metric: string;
  status: 'Running' | 'Idle';
  summary: string;
  commandOutput: string;
}

export const ScrollDrivenShowcase: React.FC<ScrollDrivenShowcaseProps> = ({
  onReplayIntro,
}) => {
  // Section 1: Interactive Agent Editor Tasks
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 't1',
      label: 'Ingest Landsat-9 TIR Band 10 radiance over Laxmi Nagar Ward 42',
      file: 'satellite_tir_ingest.ts',
      completed: true,
    },
    {
      id: 't2',
      label: 'Extract 64 split AC & 6 VRF outdoor condensers via YOLOv8',
      file: 'facade_cv_detector.ts',
      completed: true,
    },
    {
      id: 't3',
      label: 'Compute Eulerian canyon heat trap (+6.6°C street plume delta)',
      file: 'canyon_cfd_solver.ts',
      completed: true,
    },
    {
      id: 't4',
      label: 'Dispatch Section 133 CrPC surcharge & trigger 70-bar misting relay',
      file: 'section133_enforcement.ts',
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Section 2: Simulated Browser App ("Canyon Thermal Plume Tracker")
  const [corridorQuery, setCorridorQuery] = useState<string>('Vikas Marg Commercial Canyon, Delhi');
  const [condenserCount, setCondenserCount] = useState<number>(68);
  const [canyonWidthM, setCanyonWidthM] = useState<number>(6.8);
  const [trackedResult, setTrackedResult] = useState<{
    rejectedKw: number;
    plumeTempC: number;
    wbgtC: number;
    surchargeInr: number;
    status: string;
  }>({
    rejectedKw: 638,
    plumeTempC: 48.2,
    wbgtC: 36.8,
    surchargeInr: 185000,
    status: 'Critical Plume Trap · Mist Relay Armed',
  });

  const handleRunTracker = (e: React.FormEvent) => {
    e.preventDefault();
    const rejectedKw = Math.round(condenserCount * 9.4);
    const trapFactor = Math.max(1.0, 13.5 / Math.max(canyonWidthM, 3.5));
    const delta = +((rejectedKw / 125) * trapFactor * 0.72).toFixed(1);
    const plumeTempC = +(41.4 + delta).toFixed(1);
    const wbgtC = +(30.8 + delta * 0.88).toFixed(1);
    const surchargeInr = Math.round(rejectedKw * delta * 42);
    const status =
      wbgtC >= 36.0
        ? 'Critical Plume Trap · Mist Relay Armed'
        : wbgtC >= 33.5
        ? 'High Thermal Stress · Deflectors Advised'
        : 'Nominal Canyon Ventilation';

    setTrackedResult({
      rejectedKw,
      plumeTempC,
      wbgtC,
      surchargeInr,
      status,
    });
  };

  // Section 4: Parallel Agents Inbox Control Board
  const parallelAgents: ParallelAgentItem[] = [
    {
      id: 'ag-1',
      name: 'Landsat-9 Orbital TIR Calibration Agent',
      ward: 'Delhi NCR · Ward 42 & Nehru Place',
      metric: '44.8°C LST (+6.2°C Anomaly)',
      status: 'Running',
      summary: 'Continuously normalizes 30m orbital infrared radiance against ground weather stations.',
      commandOutput:
        '{"agent":"landsat9-tir","band":10,"radiance":10.94,"surfaceTempC":44.8,"confidence":0.97}',
    },
    {
      id: 'ag-2',
      name: 'YOLOv8 Façade Condenser Extraction Agent',
      ward: 'Laxmi Nagar · Vikas Marg Block C',
      metric: '70 Outdoor Units Flagged',
      status: 'Running',
      summary: 'Identifies horizontal split AC and VRF exhaust vents dumping sensible heat into narrow alleys.',
      commandOutput:
        '{"agent":"yolov8-facade","splitUnits":64,"vrfStacks":6,"rejectedHeatKw":638.4,"mAP":0.974}',
    },
    {
      id: 'ag-3',
      name: 'ESP32 Wearable WBGT Telemetry Agent',
      ward: 'Chai Cart #04 · Rameshwar Pal (2.8m from vent)',
      metric: '36.8°C WBGT · Lethal Threshold',
      status: 'Running',
      summary: 'Streams 1Hz dry-bulb, globe irradiance, and relative humidity from street vendor carts.',
      commandOutput:
        '{"agent":"ble-wbgt-mesh","nodeId":"VN-101","wbgtC":36.8,"dryBulbC":48.2,"rhPct":44}',
    },
    {
      id: 'ag-4',
      name: 'Section 133 CrPC Statutory Decree Agent',
      ward: 'Municipal Enforcement Queue',
      metric: '₹1,85,000 / mo Assessed',
      status: 'Idle',
      summary: 'Drafts legally binding municipal thermal nuisance orders and routes restitution to vendor cooling funds.',
      commandOutput:
        '{"agent":"sec133-decree","ref":"UN/NDMC/2026/084","surchargeInr":185000,"complianceDays":14}',
    },
    {
      id: 'ag-5',
      name: 'SCADA Pneumatic Louver & Mist Controller',
      ward: 'Sub-Station Relay #03',
      metric: '45° Skyward + 70-Bar Mist ON',
      status: 'Running',
      summary: 'Autonomously tilts condenser louvers upward and triggers evaporative cooling arches along sidewalks.',
      commandOutput:
        '{"agent":"scada-relay","louverAngleDeg":45,"mistPressureBar":70,"streetCoolingDeltaC":-4.2}',
    },
  ];

  const [reviewedAgent, setReviewedAgent] = useState<ParallelAgentItem>(parallelAgents[0]);

  // Section 5: Interactive Glowing Particle Brand Logo Canvas ("USHMA · NETRA")
  const logoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 900;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const nodes = Array.from({ length: 75 }, (_, i) => {
      const angle = (i / 75) * Math.PI * 2;
      const radius = 55 + (i % 4) * 28;
      return {
        baseX: width / 2 + Math.cos(angle) * radius * 1.4,
        baseY: height / 2 + Math.sin(angle) * radius * 0.75,
        x: width / 2 + Math.cos(angle) * radius * 1.4,
        y: height / 2 + Math.sin(angle) * radius * 0.75,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: (i % 3) + 1.5,
        color: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#ef4444' : '#38bdf8',
      };
    });

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((n, idx) => {
        const orbitX = width / 2 + Math.cos(t + idx * 0.25) * (80 + (idx % 5) * 32);
        const orbitY = height / 2 + Math.sin(t * 1.2 + idx * 0.25) * (42 + (idx % 4) * 18);

        let targetX = orbitX;
        let targetY = orbitY;

        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            targetX -= (dx / Math.max(dist, 1)) * 35;
            targetY -= (dy / Math.max(dist, 1)) * 35;
          }
        }

        n.x += (targetX - n.x) * 0.06;
        n.y += (targetY - n.y) * 0.06;

        // Draw connecting filaments
        nodes.forEach((other, j) => {
          if (j <= idx) return;
          const dx = n.x - other.x;
          const dy = n.y - other.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - d / 85) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-16 border-t border-[#d6cebe]">
      {/* Persistent Sticky Floating "Play intro" Control Panel */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              onReplayIntro();
            }, 350);
          }}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0b1b2d]/95 hover:bg-[#162a42] text-white border border-slate-700/80 shadow-[0_10px_30px_rgba(11,27,45,0.28)] backdrop-blur-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 group"
          title="Scroll to top and replay typewriter intro"
        >
          <span className="w-6 h-6 rounded-full bg-[#a8321a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </span>
          <span className="font-semibold tracking-tight pr-1">Play intro</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-24">
        {/* ================================================================= */}
        {/* SECTION 1: OPEN EDITOR / AGENT INTERFACE PANEL (DARK THEME)       */}
        {/* ================================================================= */}
        <div className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              01. Autonomous Audit Engine &amp; Rule Execution
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight">
              Live Thermodynamic Code &amp; Field Task Orchestration
            </h2>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Inspect how Ushma-Netra converts orbital radiance and street-level camera feeds into executable municipal compliance directives.
            </p>
          </div>

          {/* Realistic OS / IDE Dark Window Frame */}
          <div className="rounded-2xl bg-[#0b111e] border border-slate-800 shadow-[0_24px_60px_rgba(11,27,45,0.22)] overflow-hidden text-slate-100">
            {/* Dark Inner Window Header */}
            <div className="px-4 py-3 bg-[#11192b] border-b border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>ushma-netra-agent // section133_enforcement.ts</span>
                </span>
              </div>
              <span className="text-slate-400">
                {tasks.filter((t) => t.completed).length} of {tasks.length} Tasks Verified
              </span>
            </div>

            {/* Split IDE Body: Code Diff Left + Interactive Task Checkboxes Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {/* Code Modification Pane */}
              <div className="lg:col-span-7 p-5 font-mono text-xs leading-relaxed overflow-x-auto bg-[#090e19]">
                <div className="text-slate-500 mb-2">
                  src/agents/section133_enforcement.ts
                </div>
                <pre className="space-y-1 text-[12px]">
                  <div className="text-slate-400">
                    export async function evaluateStreetCanyonPlume(audit: CanyonTelemetry) &#123;
                  </div>
                  <div className="text-slate-400 pl-4">
                    const qRejectedKw = audit.tonnageTR * 3.517 * (1 + 1 / audit.cop);
                  </div>
                  <div className="bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded">
                    - const maxPermittedDeltaC = 4.5; // Legacy uncalibrated limit
                  </div>
                  <div className="bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded">
                    + const maxPermittedDeltaC = 2.0; // Wet-Bulb Vendor Protection Standard
                  </div>
                  <div className="text-slate-300 pl-4">
                    if (audit.wbgtCelsius &gt;= 36.0 &amp;&amp; audit.plumeDeltaC &gt; maxPermittedDeltaC) &#123;
                  </div>
                  <div className="bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded pl-8">
                    + await scadaRelay.actuateDeflectors(audit.buildingId, 45);
                  </div>
                  <div className="bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded pl-8">
                    + await ledger.issueSection133Surcharge(audit.buildingId, qRejectedKw);
                  </div>
                  <div className="text-slate-300 pl-4">&#125;</div>
                  <div className="text-slate-400">&#125;</div>
                </pre>
              </div>

              {/* Interactive Agent Tasks & Checkboxes */}
              <div className="lg:col-span-5 p-5 bg-[#0d1424] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>ACTIVE PIPELINE CHECKLIST</span>
                    <span className="text-emerald-400">Interactive</span>
                  </div>

                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          task.completed
                            ? 'bg-slate-900/90 border-emerald-500/30 text-slate-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {task.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1 text-xs">
                          <div className="font-medium leading-snug">{task.label}</div>
                          <div className="text-[11px] font-mono text-amber-400/80">
                            {task.file}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Click any task to toggle verification state</span>
                  <span className="text-emerald-400 font-semibold">AWS IoT Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2: SIMULATED USER BROWSER INTERFACE (CANYON PLUME TRACKER)*/}
        {/* ================================================================= */}
        <div className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              02. Interactive Street Canyon Plume Simulator
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight">
              Real-Time Urban Corridor Thermal Tracker
            </h2>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Test any commercial street corridor below to compute sensible waste heat rejection, pedestrian WBGT lethality, and monthly restorative surcharges.
            </p>
          </div>

          {/* Browser Window Wrapper */}
          <div className="rounded-2xl bg-[#0b111e] border border-slate-800 shadow-[0_24px_60px_rgba(11,27,45,0.22)] overflow-hidden text-slate-100">
            {/* Browser Top Address Bar */}
            <div className="px-4 py-3 bg-[#11192b] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 max-w-xl mx-auto px-3 py-1.5 rounded-lg bg-[#090e19] border border-slate-800 text-slate-300 flex items-center gap-2 truncate">
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">https://grid.ushma-netra.org/live-canyon-tracker</span>
              </div>
              <span className="text-emerald-400 font-semibold">60 FPS Solver</span>
            </div>

            {/* Functional App Layout Inside Browser Frame */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#0b111e] to-[#0f172a]">
              <form onSubmit={handleRunTracker} className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Monitored Street Corridor / Commercial Complex
                  </label>
                  <input
                    type="text"
                    value={corridorQuery}
                    onChange={(e) => setCorridorQuery(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11192b] border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="Enter ward or commercial corridor..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">Outdoor AC Units:</span>
                      <span className="text-amber-400 font-bold tabular-nums">{condenserCount}</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={120}
                      value={condenserCount}
                      onChange={(e) => setCondenserCount(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">Alley Width:</span>
                      <span className="text-sky-400 font-bold tabular-nums">{canyonWidthM}m</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={18}
                      step={0.5}
                      value={canyonWidthM}
                      onChange={(e) => setCanyonWidthM(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Calculate Street Plume Impact</span>
                </button>
              </form>

              {/* Live Computed Telemetry Output */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#11192b] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-slate-300 font-semibold truncate">
                    {corridorQuery || 'Selected Urban Corridor'}
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-semibold shrink-0">
                    Live Simulation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div className="p-3 rounded-xl bg-[#090e19] border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Rejected Waste Heat</div>
                    <div className="text-xl font-bold text-rose-400 tabular-nums mt-0.5">
                      {trackedResult.rejectedKw} kW
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090e19] border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Alley Plume Air</div>
                    <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">
                      {trackedResult.plumeTempC}°C
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090e19] border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Vendor Zone WBGT</div>
                    <div className="text-xl font-bold text-red-400 tabular-nums mt-0.5">
                      {trackedResult.wbgtC}°C
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090e19] border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Monthly Surcharge</div>
                    <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
                      ₹{trackedResult.surchargeInr.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-300 flex items-center justify-between pt-1">
                  <span>Status: {trackedResult.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 3: CENTERED MISSION STATEMENT & CTA TRANSITION            */}
        {/* ================================================================= */}
        <div className="py-12 text-center max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-mono text-[#a8321a] font-semibold">
            03. Closed-Loop Thermal Equity
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0b1b2d] tracking-tight leading-tight text-balance">
            Autonomous thermal justice for every urban street canyon.
          </h2>
          <p className="text-base sm:text-lg text-[#1f3044] leading-relaxed">
            Every kilowatt of sensible heat dumped onto public sidewalks is metered, modeled in 3D, and neutralized through skyward louver deflection and street-level hydration.
          </p>
          <div className="pt-2">
            <Link
              to="/twin"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0b1b2d] hover:bg-[#1a2d42] text-white font-semibold text-sm shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Open 3D Digital Twin Lab</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 4: PARALLEL AGENTS INBOX CONTROL BOARD                    */}
        {/* ================================================================= */}
        <div className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              04. Parallel Field Agents Inbox
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight">
              Multi-Agent Telemetry &amp; Enforcement Control Board
            </h2>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Five specialized agents operate in parallel across satellite ingestion, edge computer vision, wearable IoT telemetry, legal notice drafting, and physical SCADA actuation.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0b111e] border border-slate-800 shadow-[0_24px_60px_rgba(11,27,45,0.22)] overflow-hidden text-slate-100">
            <div className="px-5 py-3.5 bg-[#11192b] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">PARALLEL AGENTS INBOX // MUNICIPAL COMMAND</span>
              </div>
              <span className="text-slate-400">4 Running · 1 Idle</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {parallelAgents.map((agent) => {
                const isSelected = reviewedAgent.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isSelected ? 'bg-[#152036]' : 'hover:bg-[#11192b]/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-sm text-white">{agent.name}</span>
                        <span className="text-xs font-mono text-slate-400">·</span>
                        <span
                          className={`text-xs font-mono font-semibold ${
                            agent.status === 'Running' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{agent.summary}</p>
                      <div className="text-[11px] font-mono text-sky-300">
                        {agent.ward} — <span className="text-amber-300 font-semibold">{agent.metric}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => setReviewedAgent(agent)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Agent Payload Inspector */}
            <div className="p-4 sm:p-5 bg-[#070b14] border-t border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-slate-400 flex items-center justify-between">
                <span>INSPECTING PAYLOAD: {reviewedAgent.name.toUpperCase()}</span>
                <span className="text-emerald-400">VERIFIED STREAM</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800 text-amber-300 overflow-x-auto">
                {reviewedAgent.commandOutput}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 5: INTERACTIVE GLOWING PARTICLE BRAND LOGO FINALE         */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-[#070b14] border border-slate-800 shadow-[0_24px_60px_rgba(11,27,45,0.28)] overflow-hidden relative">
          {/* Cosmic Engineering Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          <canvas
            ref={logoCanvasRef}
            className="w-full h-[360px] block cursor-crosshair"
          />

          {/* Centered Brand Lockup Overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0b1b2d]/90 border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.35)] flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-amber-400" />
            </div>
            <div className="text-xs font-mono tracking-[0.28em] text-amber-400 uppercase font-semibold">
              USHMA
            </div>
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-0.5">
              NETRA
            </div>
            <p className="text-xs font-mono text-slate-400 mt-3 max-w-md">
              Move your cursor across the thermal field · Autonomous Urban Micro-Climate Equity Grid
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
