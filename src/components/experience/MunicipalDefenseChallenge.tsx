import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Flame,
  Award,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingDown,
  Users,
  Radio,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

interface Sector {
  id: string;
  name: string;
  city: string;
  ambientTemp: number;
  exhaustTemp: number;
  streetWbgt: number;
  acUnits: number;
  vendorsExposed: number;
  louversDeployed: boolean;
  mistingActive: boolean;
  gridThrottled: boolean;
  audioBroadcast: boolean;
  status: 'critical' | 'stable' | 'protected';
}

const INITIAL_SECTORS: Sector[] = [
  {
    id: 'sec-1',
    name: 'Laxmi Nagar District Centre',
    city: 'Delhi NCR',
    ambientTemp: 43.5,
    exhaustTemp: 54.2,
    streetWbgt: 36.8, // lethal
    acUnits: 68,
    vendorsExposed: 12,
    louversDeployed: false,
    mistingActive: false,
    gridThrottled: false,
    audioBroadcast: false,
    status: 'critical',
  },
  {
    id: 'sec-2',
    name: 'Indiranagar 100ft Retail Corridor',
    city: 'Bengaluru',
    ambientTemp: 38.2,
    exhaustTemp: 49.5,
    streetWbgt: 34.2, // dangerous
    acUnits: 52,
    vendorsExposed: 8,
    louversDeployed: false,
    mistingActive: false,
    gridThrottled: false,
    audioBroadcast: false,
    status: 'critical',
  },
  {
    id: 'sec-3',
    name: 'Andheri East Commercial Spine',
    city: 'Mumbai',
    ambientTemp: 39.8,
    exhaustTemp: 51.6,
    streetWbgt: 35.9, // lethal wet bulb
    acUnits: 84,
    vendorsExposed: 15,
    louversDeployed: false,
    mistingActive: false,
    gridThrottled: false,
    audioBroadcast: false,
    status: 'critical',
  },
];

export const MunicipalDefenseChallenge: React.FC = () => {
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [activeSectorId, setActiveSectorId] = useState<string>('sec-1');
  const [simTime, setSimTime] = useState<number>(720); // 12:00 PM (minutes from midnight)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [restorativeFund, setRestorativeFund] = useState<number>(45000);
  const [totalHeatDivertedKw, setTotalHeatDivertedKw] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSector = sectors.find((s) => s.id === activeSectorId) || sectors[0];

  // Simulation tick logic
  useEffect(() => {
    if (isRunning && !gameOver) {
      timerRef.current = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= 1080) {
            // 6:00 PM end of peak afternoon window
            setIsRunning(false);
            setGameOver(true);
            return 1080;
          }
          return prev + 15; // 15 mins per tick
        });

        // Dynamic fluctuations: heat peaks around 2:30 PM (870 min)
        setSectors((prev) =>
          prev.map((sec) => {
            let wbgt = sec.streetWbgt;
            if (!sec.louversDeployed) {
              // Plume stays high
              wbgt = Math.min(37.5, wbgt + (Math.random() * 0.2 - 0.08));
            } else {
              wbgt = Math.max(30.5, wbgt - 0.15);
            }

            if (sec.mistingActive) {
              wbgt = Math.max(29.8, wbgt - 0.35);
            }

            const status = wbgt < 32 ? 'protected' : wbgt < 35 ? 'stable' : 'critical';
            return {
              ...sec,
              streetWbgt: parseFloat(wbgt.toFixed(1)),
              status,
            };
          })
        );
      }, 1200);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, gameOver]);

  // Command 1: Enforce Section 133 Upward Louvers
  const handleDeployLouvers = (sectorId: string) => {
    soundEngine.playSpikeAlert();
    setSectors((prev) =>
      prev.map((s) => {
        if (s.id === sectorId) {
          return {
            ...s,
            louversDeployed: true,
            exhaustTemp: Math.max(38, s.exhaustTemp - 8.5),
            streetWbgt: Math.max(30.2, s.streetWbgt - 3.8),
            status: 'stable',
          };
        }
        return s;
      })
    );
    setRestorativeFund((prev) => prev + 85000); // statutory fine collected
    setTotalHeatDivertedKw((prev) => prev + 340);
  };

  // Command 2: Deploy Solar Misting Umbrella
  const handleDeployMisting = (sectorId: string) => {
    if (restorativeFund < 25000) return;
    setRestorativeFund((prev) => prev - 25000);
    setSectors((prev) =>
      prev.map((s) => {
        if (s.id === sectorId) {
          return {
            ...s,
            mistingActive: true,
            streetWbgt: Math.max(28.5, s.streetWbgt - 2.5),
            status: 'protected',
          };
        }
        return s;
      })
    );
  };

  // Command 3: Grid Demand-Response BMS Relaxation
  const handleThrottleGrid = (sectorId: string) => {
    setSectors((prev) =>
      prev.map((s) => {
        if (s.id === sectorId) {
          return {
            ...s,
            gridThrottled: true,
            exhaustTemp: Math.max(36, s.exhaustTemp - 4.2),
            streetWbgt: Math.max(29.5, s.streetWbgt - 1.8),
            status: 'stable',
          };
        }
        return s;
      })
    );
    setTotalHeatDivertedKw((prev) => prev + 180);
  };

  // Command 4: Broadcast Hindi/Kannada Voice Alert with real Web Speech synthesis
  const handleBroadcastAudio = (sectorId: string) => {
    soundEngine.playSpikeAlert();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text =
        activeSector.city === 'Bengaluru'
          ? 'Ushma-Netra Emergency Heat Advisory for Indiranagar vendors. Ambient AC exhaust is at forty-nine degrees. Please move to shaded misting kiosk immediately.'
          : 'उष्मा-नेत्रा आपातकालीन चेतावनी: एसी एग्जॉस्ट के कारण तापमान अत्यधिक बढ़ गया है। तुरंत पानी पिएं और ठेले को शेड में ले जाएं।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    setSectors((prev) =>
      prev.map((s) => {
        if (s.id === sectorId) {
          return {
            ...s,
            audioBroadcast: true,
          };
        }
        return s;
      })
    );
  };

  const handleReset = () => {
    setSectors(INITIAL_SECTORS);
    setSimTime(720);
    setIsRunning(false);
    setGameOver(false);
    setRestorativeFund(45000);
    setTotalHeatDivertedKw(0);
  };

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    return `${displayHours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const totalProtectedVendors = sectors.filter((s) => s.status !== 'critical').reduce((acc, s) => acc + s.vendorsExposed, 0);
  const totalVendors = sectors.reduce((acc, s) => acc + s.vendorsExposed, 0);
  const protectionScore = Math.round((totalProtectedVendors / totalVendors) * 100);

  return (
    <section id="heat-challenge-act" className="relative min-h-screen w-full py-28 px-4 sm:px-8 lg:px-12 bg-transparent border-t border-zinc-800/40">
      {/* Background Radiance */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,#ef4444_0,transparent_60%)]" />

      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* Header Kicker with Clean Typography (Anti-Slop No-Pill) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/40 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>08 · INTERACTIVE FINALE: THE 48-HOUR HEATWAVE DEFENSE CHALLENGE</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">DECISION SIMULATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-zinc-100 tracking-tight font-sans">
              Take the Commissioner's Hot Seat
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-light">
              It is 43.5°C in Delhi and Bengaluru. Hundreds of commercial AC compressors are baking street vendors with 54°C exhaust. Use Section 133 statutory powers to divert heat, fund misting kiosks, and save informal workers.
            </p>
          </div>

          {/* Master Simulation Clock & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Time:</span>
              <span className="font-extrabold text-white text-sm">{formatTime(simTime)}</span>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause Sim' : 'Start Heatwave'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reset Challenge"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase">EQUITY PROTECTION SCORE</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tabular-nums flex items-center gap-2">
              <span className={protectionScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                {protectionScore}%
              </span>
              <span className="text-xs text-zinc-400 font-sans font-normal">
                ({totalProtectedVendors}/{totalVendors} vendors)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase">HEAT DIVERTED SKYWARD</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 tabular-nums">
              {totalHeatDivertedKw} kW
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase">RESTITUTION POOL BALANCE</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              ₹{restorativeFund.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-md space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase">ACTIVE PILOT SECTORS</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
              3 Districts
            </div>
          </div>
        </div>

        {/* Main Operational Simulator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: District Sector Map & Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
              Select City Canyon Sector to Intervene:
            </div>

            {sectors.map((sec) => {
              const isSelected = sec.id === activeSectorId;
              const isCritical = sec.status === 'critical';
              const isProtected = sec.status === 'protected';

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectorId(sec.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator Stripe */}
                  <div
                    className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-mono font-bold rounded-bl-xl ${
                      isProtected
                        ? 'bg-emerald-950 text-emerald-300 border-l border-b border-emerald-800'
                        : isCritical
                        ? 'bg-red-950 text-red-300 border-l border-b border-red-800 animate-pulse'
                        : 'bg-amber-950 text-amber-300 border-l border-b border-amber-800'
                    }`}
                  >
                    {isProtected ? 'SHIELDED (29°C)' : isCritical ? 'CRITICAL PLUME (36.8°C)' : 'MITIGATED (32°C)'}
                  </div>

                  <div className="space-y-2 pr-12">
                    <div className="text-xs font-mono text-slate-400">{sec.city}</div>
                    <div className="text-base font-bold text-white font-sans">{sec.name}</div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">EXHAUST JET</span>
                        <span className="font-bold text-red-400">{sec.exhaustTemp}°C</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">STREET WBGT</span>
                        <span className={`font-bold ${isCritical ? 'text-red-500' : 'text-emerald-400'}`}>
                          {sec.streetWbgt}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">VENDORS</span>
                        <span className="font-bold text-white">{sec.vendorsExposed} workers</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sector Tactical Command Center (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  ACTIVE SECTOR COMMAND
                </span>
                <h3 className="text-xl font-bold text-white font-sans mt-0.5">{activeSector.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {activeSector.acUnits} AC Outdoor Compressors · {activeSector.vendorsExposed} Informal Workers Exposed
                </p>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">CURRENT STREET WBGT</span>
                <span
                  className={`text-2xl font-black tabular-nums ${
                    activeSector.status === 'critical'
                      ? 'text-red-500'
                      : activeSector.status === 'protected'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {activeSector.streetWbgt}°C
                </span>
              </div>
            </div>

            {/* Tactical Municipal Interventions */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Available Statutory Interventions:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* Action 1: Section 133 Louvers */}
                <button
                  onClick={() => handleDeployLouvers(activeSector.id)}
                  disabled={activeSector.louversDeployed}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeSector.louversDeployed
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">1. Mandate 45° Skyward Louvers</span>
                    {activeSector.louversDeployed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                    Forces 45° upward deflectors on condensers. Collects ₹85,000 statutory penalty; drops street delta by 3.8°C.
                  </p>
                </button>

                {/* Action 2: Restorative Misting */}
                <button
                  onClick={() => handleDeployMisting(activeSector.id)}
                  disabled={activeSector.mistingActive || restorativeFund < 25000}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeSector.mistingActive
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-400 cursor-not-allowed'
                      : restorativeFund < 25000
                      ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400">2. Deploy Solar Misting Kiosks</span>
                    {activeSector.mistingActive && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                    Uses ₹25,000 from the restitution pool to install high-pressure vendor shade misting; drops WBGT by 2.5°C.
                  </p>
                </button>

                {/* Action 3: Grid Setpoint Demand Response */}
                <button
                  onClick={() => handleThrottleGrid(activeSector.id)}
                  disabled={activeSector.gridThrottled}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeSector.gridThrottled
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400">3. Grid BMS Setpoint Throttling</span>
                    {activeSector.gridThrottled && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                    Adjusts corporate indoor setpoint from 20°C to 23.5°C via BMS API; reduces rejected heat by 180 kW.
                  </p>
                </button>

                {/* Action 4: Multilingual Voice Broadcast */}
                <button
                  onClick={() => handleBroadcastAudio(activeSector.id)}
                  disabled={activeSector.audioBroadcast}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeSector.audioBroadcast
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">4. Broadcast Voice Alert (Hindi)</span>
                    {activeSector.audioBroadcast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                    Transmits audio advisory to vendor wearable IoT beacons: "सावधानी: तुरंत ठंडे शेड में जाएं".
                  </p>
                </button>
              </div>
            </div>

            {/* Live Operational Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-mono ${
                activeSector.status === 'protected'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : activeSector.status === 'critical'
                  ? 'bg-red-950/40 border-red-800 text-red-300'
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                {activeSector.status === 'protected'
                  ? 'Sector Successfully Shielded: Street temperature reduced below hazardous physiological threshold.'
                  : activeSector.status === 'critical'
                  ? 'Active Emergency: Commercial ACs venting unmitigated 54°C exhaust. Vendors facing heat stroke lethality.'
                  : 'Mitigation in Progress: Surcharge assessed; diversion louvers active.'}
              </span>
            </div>
          </div>
        </div>

        {/* Challenge Completion Certificate Modal */}
        {gameOver && (
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
              <Award className="w-4 h-4" />
              <span>SIMULATION WINDOW COMPLETE · RESULTS CERTIFIED</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
              Commissioner's Final Resilience Rating:{' '}
              <span className={protectionScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                {protectionScore >= 80 ? 'Grade A+ (Distinguished)' : protectionScore >= 60 ? 'Grade B (Compliant)' : 'Grade C (Under Review)'}
              </span>
            </h3>

            <p className="text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Through your decisive statutory orders under Section 133 CrPC, you diverted <strong>{totalHeatDivertedKw} kW</strong> of superheated AC exhaust away from public sidewalks and protected <strong>{totalProtectedVendors} informal workers</strong> from lethal heat stress.
            </p>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Re-Run Heatwave Defense Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
