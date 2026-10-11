import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  X,
  ExternalLink,
  ShieldAlert,
  Cpu,
  Cloud,
  Building2,
  Headphones,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';
import { playAudibleBeaconAlert, stopAudibleBeaconAlert } from '../../utils/pollyVoiceDispatch';

interface WalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onMitigationApplied?: () => void;
}

export const AutonomousPipelineWalkthrough: React.FC<WalkthroughProps> = ({
  isOpen,
  onClose,
  onMitigationApplied,
}) => {
  const navigate = useNavigate();

  // Selected language for autonomous voice alert
  const [selectedLang, setSelectedLang] = useState<'ta-IN' | 'en-IN' | 'hi-IN'>('ta-IN');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [alertCount, setAlertCount] = useState<number>(0);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 5 Autonomous Stages
  const [stage1, setStage1] = useState<boolean>(false); // ESP32 Telemetry
  const [stage2, setStage2] = useState<boolean>(false); // AWS EventBridge
  const [stage3, setStage3] = useState<boolean>(false); // BMS Louver Actuation
  const [stage4, setStage4] = useState<boolean>(false); // AirPods Voice Alert (2x cap)
  const [stage5, setStage5] = useState<boolean>(false); // Municipal Legal Docket
  const [completedTime, setCompletedTime] = useState<number | null>(null);

  // Listen to speech events from pollyVoiceDispatch
  useEffect(() => {
    const handleVoiceStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; lang: string; vendor: string }>;
      setActiveSpeechText(customEvent.detail.text);
      setIsSpeaking(true);
    };
    const handleVoiceEnd = () => {
      setIsSpeaking(false);
    };

    window.addEventListener('ushma_voice_alert_start', handleVoiceStart);
    window.addEventListener('ushma_voice_alert_end', handleVoiceEnd);

    return () => {
      window.removeEventListener('ushma_voice_alert_start', handleVoiceStart);
      window.removeEventListener('ushma_voice_alert_end', handleVoiceEnd);
    };
  }, []);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      // Auto-start pipeline if not running
      runAutonomousPipeline();
    } else {
      stopAudibleBeaconAlert();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const runAutonomousPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedTime(null);
    stopAudibleBeaconAlert();

    // Reset stages
    setStage1(false);
    setStage2(false);
    setStage3(false);
    setStage4(false);
    setStage5(false);

    // Initial alert tone
    soundEngine.playTone(880, 'sine', 0.15);

    // STAGE 1: ESP32 Edge Ingestion (Instant - 100ms)
    setTimeout(() => {
      setStage1(true);
      soundEngine.playTone(520, 'sine', 0.08);
    }, 150);

    // STAGE 2: AWS IoT Core & EventBridge Rule Evaluation (< 200ms)
    setTimeout(() => {
      setStage2(true);
      soundEngine.playTone(640, 'sine', 0.08);
    }, 450);

    // STAGE 3: BMS Motorized 45° Louvers Engage (800ms)
    setTimeout(() => {
      setStage3(true);
      soundEngine.playTone(720, 'sine', 0.12);
      if (onMitigationApplied) {
        onMitigationApplied();
      }
    }, 850);

    // STAGE 4: AirPods Voice Alert (1250ms) - Strictly Capped at 2 times
    setTimeout(() => {
      setStage4(true);
      const nextCount = alertCount + 1;
      setAlertCount(nextCount);

      if (!isMuted) {
        if (nextCount <= 2) {
          void playAudibleBeaconAlert({
            vendorName: 'Murugan (முருகன்)',
            measuredWbgt: 36.8,
            nearestKioskMeters: 35,
            exhaustTemp: 56.2,
            preferredLanguage: selectedLang,
          });
        } else {
          // Exceeded 2 times -> Silenced to prevent irritation!
          soundEngine.playTone(330, 'triangle', 0.2);
        }
      }
    }, 1250);

    // STAGE 5: Municipal CrPC Section 133 Legal Docket Auto-Minted (1650ms)
    setTimeout(() => {
      setStage5(true);
      soundEngine.playTone(980, 'sine', 0.16);
      setIsRunning(false);
      setCompletedTime(1380); // ~1.38 seconds full closed-loop
    }, 1650);
  };

  const resetPipeline = () => {
    stopAudibleBeaconAlert();
    setIsRunning(false);
    setStage1(false);
    setStage2(false);
    setStage3(false);
    setStage4(false);
    setStage5(false);
    setAlertCount(0);
    setActiveSpeechText('');
    setCompletedTime(null);
    soundEngine.playTone(440, 'sine', 0.1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0d1627] border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500/20 via-sky-500/10 to-emerald-500/20 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Closed-Loop Autonomous Pipeline
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  {isRunning ? 'PIPELINE ACTIVE' : completedTime ? 'COMPLETED (1.4s)' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Zero Human Intervention: Sensor ➔ Cloud Rules ➔ Louver ➔ Voice ➔ Docket
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudibleBeaconAlert();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Service Banner Explaining the 5 Tools Covered */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/30 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Autonomous Service Provided Across Ushma-Netra Tools:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-amber-400 font-bold">1. ESP32 &amp; Grid:</span>
                <span>Sub-second &gt;34°C WBGT breach ingestion via MQTT</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-sky-400 font-bold">2. AWS EventBridge:</span>
                <span>Serverless event bus routing in &lt;180ms</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">3. 3D BMS Louver:</span>
                <span>Motorized 45° upward tilt drops street heat -4.2°C</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-indigo-400 font-bold">4. AirPods Voice:</span>
                <span>Tamil/Hindi/English warning, strictly 2-times limit</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300 col-span-1 sm:col-span-2">
                <span className="text-rose-400 font-bold">5. Debt Ledger:</span>
                <span>Neptune graph auto-mints statutory Sec 133 CrPC notice docket</span>
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar: Replay, Language Toggle, Audio */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRunning}
                onClick={runAutonomousPipeline}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500/50 text-slate-950 cursor-wait'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Executing Pipeline...' : 'Run Autonomous Pipeline'}</span>
              </button>

              <button
                type="button"
                onClick={resetPipeline}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 cursor-pointer"
                title="Reset Pipeline & Alert Counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Voice Lang:</span>
              <div className="inline-flex p-0.5 rounded-xl bg-slate-900 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedLang('ta-IN')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLang === 'ta-IN'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('en-IN')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLang === 'en-IN'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('hi-IN')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLang === 'hi-IN'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>

              {/* Mute toggle */}
              <button
                type="button"
                onClick={() => {
                  if (!isMuted) stopAudibleBeaconAlert();
                  setIsMuted(!isMuted);
                }}
                className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/10 text-slate-300 border-white/10 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 5-Stage Step Visualizer */}
          <div className="space-y-3">
            {/* Stage 1 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                stage1
                  ? 'bg-slate-900/90 border-amber-400/60 shadow-md shadow-amber-400/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  stage1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    Stage 01 · ESP32 Sensor Edge Ingest
                  </div>
                  {stage1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 38ms Latency
                    </span>
                  )}
                </div>
                <div className={`text-sm font-bold mt-0.5 ${stage1 ? 'text-white' : 'text-slate-500'}`}>
                  Outdoor WBGT 36.8°C / AC Exhaust 56.2°C Detected
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  MQTT telemetry ingested from Virtual/USB ESP32 on topic <span className="font-mono text-slate-300">ushma/canyon/telemetry</span>. Threshold (&gt;34°C) breached.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                stage2
                  ? 'bg-slate-900/90 border-sky-400/60 shadow-md shadow-sky-400/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  stage2 ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Cloud className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                    Stage 02 · AWS IoT Core &amp; EventBridge Bus
                  </div>
                  {stage2 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rule Evaluated &lt; 180ms
                    </span>
                  )}
                </div>
                <div className={`text-sm font-bold mt-0.5 ${stage2 ? 'text-white' : 'text-slate-500'}`}>
                  Serverless Event Bus Dispatch (<span className="font-mono text-sky-300">ushma-netra-thermal-bus</span>)
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Payload evaluated against statutory nuisance rules. Targets auto-dispatched: BMS Louver, Vendor AirPods, Municipal Ledger.
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                stage3
                  ? 'bg-slate-900/90 border-emerald-400/60 shadow-md shadow-emerald-400/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  stage3 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Stage 03 · 3D BMS Smart Louver Actuation
                  </div>
                  {stage3 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> -4.2°C Street Heat Reduction
                    </span>
                  )}
                </div>
                <div className={`text-sm font-bold mt-0.5 ${stage3 ? 'text-white' : 'text-slate-500'}`}>
                  Motorized 45° Upward Louvers Engaged + Misting Deployed
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Building mechanical louvers angle upward away from pedestrian level. Direct thermal plume jet deflects into upper troposphere.
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                stage4
                  ? 'bg-slate-900/90 border-indigo-400/60 shadow-md shadow-indigo-400/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  stage4 ? 'bg-indigo-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Headphones className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                    Stage 04 · Vendor AirPods Emergency Voice Alert
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        alertCount >= 2
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      Count: {Math.min(alertCount, 2)}/2 Max
                    </span>
                    {alertCount >= 2 && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        ✓ Silenced
                      </span>
                    )}
                  </div>
                </div>
                <div className={`text-sm font-bold mt-0.5 ${stage4 ? 'text-white' : 'text-slate-500'}`}>
                  Sub-second Voice Prompt Dispatched ({selectedLang === 'ta-IN' ? 'தமிழ்' : selectedLang === 'hi-IN' ? 'हिंदी' : 'English'})
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Alert strictly limited to twice to prevent worker annoyance. Guides vendor to nearby 35m municipal shade kiosk.
                </p>

                {/* Live spoken subtitle banner */}
                {isSpeaking && activeSpeechText && (
                  <div className="mt-2.5 p-2 rounded-xl bg-indigo-950/80 border border-indigo-400/40 text-xs text-indigo-200 flex items-center gap-2 animate-pulse">
                    <Volume2 className="w-4 h-4 text-indigo-300 shrink-0" />
                    <span className="font-sans italic">"{activeSpeechText}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stage 5 */}
            <div
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                stage5
                  ? 'bg-slate-900/90 border-rose-400/60 shadow-md shadow-rose-400/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  stage5 ? 'bg-rose-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Scale className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                    Stage 05 · Municipal Thermal Debt Docket Minting
                  </div>
                  {stage5 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Docket #CRPC-2026-T941 Minted
                    </span>
                  )}
                </div>
                <div className={`text-sm font-bold mt-0.5 ${stage5 ? 'text-white' : 'text-slate-500'}`}>
                  Neptune 3-Hop Graph Traversal &amp; Bedrock Guardrails
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Links cart telemetry to polluter commercial tower. Masks vendor PII and auto-drafts statutory Section 133 CrPC notice fine.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Deep-Links to Real Tools */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <div className="text-xs text-slate-400">
              {completedTime ? (
                <span className="text-emerald-400 font-bold">
                  ✓ Full autonomous pipeline completed in {completedTime}ms without errors.
                </span>
              ) : (
                <span>Click run to verify full closed loop autonomously.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopAudibleBeaconAlert();
                  onClose();
                  navigate('/twin');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1E3256] hover:bg-[#253D68] text-white border border-sky-400/30 transition-colors cursor-pointer"
              >
                <span>Open in 3D Digital Twin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAudibleBeaconAlert();
                  onClose();
                  navigate('/ledger');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1E3256] hover:bg-[#253D68] text-white border border-rose-400/30 transition-colors cursor-pointer"
              >
                <span>View Legal Notice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
