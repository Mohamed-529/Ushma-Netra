import React from 'react';
import { Smartphone, Monitor, Shield, Lock, Server, Cpu, Brain, Mic, Volume2, Database, Activity, Eye, GitBranch, Bell, ArrowRight } from 'lucide-react';

interface Props {
  onBackToMain?: () => void;
}

export const AWSArchitectureView: React.FC<Props> = ({ onBackToMain }) => {
  return (
    <div className="w-full bg-[#fbf9f5] text-slate-900 min-h-screen p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              USHMA-NETRA (ALLY) · ARCHITECTURE BLUEPRINT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-serif">
              AWS Serverless Climate Architecture
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300 font-semibold">
              Event-Driven · Multi-Agent Mesh
            </span>
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Showcase
              </button>
            )}
          </div>
        </div>

        {/* Architecture Canvas (Exact layout from the winning demo video) */}
        <div className="border border-slate-300 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-8">
          {/* SECTION A: PEOPLE & DEVICES */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>A · PEOPLE & DEVICES</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>Galaxy Wear OS / Beacon</span>
                </div>
                <div className="text-[11px] text-slate-500">Vendor wrist/cart telemetry, fall & WBGT probe</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
                  <Monitor className="w-4 h-4 text-sky-600" />
                  <span>Street-View Camera / PWA</span>
                </div>
                <div className="text-[11px] text-slate-500">Facade image stream, audio check-in interface</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Building Security / Owner</span>
                </div>
                <div className="text-[11px] text-slate-500">SMS notice, deflector compliance portal</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <span>Municipal Command Web</span>
                </div>
                <div className="text-[11px] text-slate-500">Ward disaster room, Section 133 order review</div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200" />

          {/* SECTION B: AWS FRONT DOOR */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>B · AWS FRONT DOOR</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                <div className="font-bold text-xs text-amber-950">AWS Amplify</div>
                <div className="text-[11px] text-slate-600">Next.js static web app & command center hosting</div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                <div className="font-bold text-xs text-amber-950">Amazon Cognito</div>
                <div className="text-[11px] text-slate-600">JWT-based identity for ward officers & building owners</div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                <div className="font-bold text-xs text-amber-950">API Gateway</div>
                <div className="text-[11px] text-slate-600">REST front door routing device keys & voice payloads</div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                <div className="font-bold text-xs text-amber-950">Secrets Manager</div>
                <div className="text-[11px] text-slate-600">Hardware device keys, Twilio & Bedrock auth tokens</div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200" />

          {/* SECTION C & D: SERVERLESS RUNTIME + AI & VOICE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* C: Serverless Runtime */}
            <div className="space-y-2 p-5 rounded-xl border border-sky-200 bg-sky-50/30">
              <div className="text-[11px] font-mono font-bold text-sky-800 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-sky-600" />
                <span>C · SERVERLESS RUNTIME (EKS / ECR / LAMBDA)</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700 mt-2">
                <div className="p-3 rounded-lg bg-white border border-sky-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Agent Orchestrator Graph</strong>
                    <span className="text-[11px] text-slate-500">Bedrock Nova multi-agent dispatch on Strands</span>
                  </div>
                  <span className="font-mono text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded">Core Logic</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-sky-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">AWS Lambda · Escalation Step Functions</strong>
                    <span className="text-[11px] text-slate-500">Tiered callback logic: T1 Nudge → T2 Louver → T3 Fine</span>
                  </div>
                  <span className="font-mono text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded">Serverless</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-sky-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Lambda Worker · Thermal Plume Math</strong>
                    <span className="text-[11px] text-slate-500">Computes 638.4 kW sensible heat & canyon temperature delta</span>
                  </div>
                  <span className="font-mono text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded">Worker</span>
                </div>
              </div>
            </div>

            {/* D: AI & Voice On-Ring */}
            <div className="space-y-2 p-5 rounded-xl border border-purple-200 bg-purple-50/30">
              <div className="text-[11px] font-mono font-bold text-purple-800 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                <span>D · AI & VOICE ON-RING</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700 mt-2">
                <div className="p-3 rounded-lg bg-white border border-purple-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Amazon Transcribe</strong>
                    <span className="text-[11px] text-slate-500">Speech-to-text in Hindi, English & Indian dialects</span>
                  </div>
                  <Mic className="w-4 h-4 text-purple-600" />
                </div>

                <div className="p-3 rounded-lg bg-white border border-purple-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Amazon Bedrock (Nova & Claude)</strong>
                    <span className="text-[11px] text-slate-500">Contextual reasoning, tool calling & Section 133 statutory notice</span>
                  </div>
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>

                <div className="p-3 rounded-lg bg-white border border-purple-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Amazon Polly</strong>
                    <span className="text-[11px] text-slate-500">Neural voice responses (Kajal & Aditi) streamed to wrist speaker</span>
                  </div>
                  <Volume2 className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200" />

          {/* SECTION E & F: TRUST & OBSERVABILITY + PROACTIVE ESCALATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* E: Trust, Memory & Observability */}
            <div className="space-y-2 p-5 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <div className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>E · TRUST, MEMORY & OBSERVABILITY</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                <div className="p-3 rounded-lg bg-white border border-emerald-100">
                  <strong className="block text-slate-900">Cedar Policy</strong>
                  <span className="text-[11px] text-slate-500">Deterministic consent checks before building fine</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-emerald-100">
                  <strong className="block text-slate-900">Amazon DynamoDB</strong>
                  <span className="text-[11px] text-slate-500">Single-table design: memory, thermal debt & logs</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-emerald-100">
                  <strong className="block text-slate-900">AWS CloudTrail</strong>
                  <span className="text-[11px] text-slate-500">Immutable audit logs of all municipal notices</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-emerald-100">
                  <strong className="block text-slate-900">Amazon CloudWatch</strong>
                  <span className="text-[11px] text-slate-500">Real-time telemetry prober & error tracing</span>
                </div>
              </div>
            </div>

            {/* F: Proactive & Municipal Escalation */}
            <div className="space-y-2 p-5 rounded-xl border border-rose-200 bg-rose-50/30">
              <div className="text-[11px] font-mono font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-rose-600" />
                <span>F · PROACTIVE & CIVIC ESCALATION</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700 mt-2">
                <div className="p-3 rounded-lg bg-white border border-rose-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">AWS Step Functions</strong>
                    <span className="text-[11px] text-slate-500">State machines for multi-party escalation & timeout handling</span>
                  </div>
                  <GitBranch className="w-4 h-4 text-rose-600" />
                </div>

                <div className="p-3 rounded-lg bg-white border border-rose-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Amazon EventBridge</strong>
                    <span className="text-[11px] text-slate-500">Cron triggers for proactive weather & daily ward checks</span>
                  </div>
                  <Activity className="w-4 h-4 text-rose-600" />
                </div>

                <div className="p-3 rounded-lg bg-white border border-rose-100 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Amazon SNS & Twilio Voice Call</strong>
                    <span className="text-[11px] text-slate-500">Automated IVR call to Ward Officer with "Press 1 to confirm"</span>
                  </div>
                  <Smartphone className="w-4 h-4 text-rose-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-600 flex items-center justify-between">
          <span>
            Every side effect passes through a Cedar authorization boundary. Fully serverless care & climate infrastructure on AWS.
          </span>
          <span className="font-mono text-[11px] text-slate-500">REGION: ap-south-1 (MUMBAI)</span>
        </div>
      </div>
    </div>
  );
};
