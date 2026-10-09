import React from 'react';
import { AWSArchitectureExplorer } from '../AWSArchitectureExplorer';
import { Cloud, Layers, Terminal } from 'lucide-react';

export const ArchitectureAct: React.FC = () => {
  return (
    <section id="architecture" className="relative min-h-screen w-full py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#070b14] via-[#090e1c] to-[#070b14] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>ACT VI · SERVERLESS CLIMATE INFRASTRUCTURE ON AWS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How The Intelligence Flows
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
            Every layer serves a specific physical purpose: from LoRaWAN MQTT packet ingestion at the vendor umbrella, to SageMaker facade segmentation and Amazon Bedrock statutory order generation.
          </p>
        </div>

        <AWSArchitectureExplorer />
      </div>
    </section>
  );
};
