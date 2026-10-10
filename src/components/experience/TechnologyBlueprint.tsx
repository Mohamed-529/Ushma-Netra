import React from 'react';
import { AWSArchitectureExplorer } from '../AWSArchitectureExplorer';
import { Cloud, Cpu, Database, Server, ShieldCheck, Zap } from 'lucide-react';

export const TechnologyBlueprint: React.FC = () => {
  return (
    <section id="technology-act" className="relative min-h-screen w-full py-28 px-4 sm:px-8 lg:px-12 bg-transparent border-t border-slate-800/80">
      {/* Dynamic Data Wave & Signal Traces Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_70%_25%,#3b82f6_0,transparent_60%)]" />

      <div className="max-w-7xl mx-auto w-full space-y-10 relative z-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>06 · AWS PRODUCTION ARCHITECTURE & DATA PIPELINE</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">SERVERLESS CITY-SCALE TOPOLOGY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
            Serverless Infrastructure Engineered for City-Scale Enforcement
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-light leading-relaxed">
            Every edge reading, street-view computer vision bounding box, and statutory Section 133 environmental decree is orchestrated across AWS serverless services with sub-second event latency.
          </p>
        </div>

        {/* Real-Time AWS Cloud Performance Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sky-400 text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span>AWS IoT Core</span>
            </div>
            <div className="text-lg font-bold text-white tabular-nums">12,400 ev/min</div>
            <div className="text-[10px] text-slate-500">Sub-second MQTT ingest</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>SageMaker CV</span>
            </div>
            <div className="text-lg font-bold text-amber-400 tabular-nums">240 ms</div>
            <div className="text-[10px] text-slate-500">YOLO-v10 facade inference</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 text-[11px]">
              <Server className="w-3.5 h-3.5" />
              <span>Bedrock Agent</span>
            </div>
            <div className="text-lg font-bold text-purple-400 tabular-nums">1.8 s</div>
            <div className="text-[10px] text-slate-500">Statutory notice reasoning</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <Database className="w-3.5 h-3.5" />
              <span>DynamoDB Ledger</span>
            </div>
            <div className="text-lg font-bold text-emerald-400 tabular-nums">&lt; 4 ms</div>
            <div className="text-[10px] text-slate-500">Single-table audit reads</div>
          </div>
        </div>

        {/* AWS Explorer Wrapper */}
        <div className="rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/70 backdrop-blur-md shadow-2xl p-6 sm:p-8">
          <AWSArchitectureExplorer />
        </div>
      </div>
    </section>
  );
};
