import React from 'react';
import { AWSArchitectureExplorer } from '../AWSArchitectureExplorer';
import { Cloud, Cpu, Database, Server, ShieldCheck, Zap } from 'lucide-react';

export const TechnologyBlueprint: React.FC = () => {
  return (
    <section id="technology-act" className="relative min-h-screen w-full py-28 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#060913] via-[#070e22] to-[#060913] border-t border-slate-800/80">
      {/* Dynamic Data Wave & Signal Traces Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_70%_25%,#3b82f6_0,transparent_60%)]" />

      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>06 · AWS PRODUCTION ARCHITECTURE & DATA PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
            Serverless Infrastructure Engineered for City-Scale Enforcement
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-light leading-relaxed">
            Every edge reading, street-view computer vision bounding box, and statutory Section 133 environmental decree is orchestrated across AWS serverless services with sub-second event latency.
          </p>
        </div>

        {/* AWS Explorer Wrapper */}
        <div className="rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/70 backdrop-blur-md shadow-2xl p-6 sm:p-8">
          <AWSArchitectureExplorer />
        </div>
      </div>
    </section>
  );
};
