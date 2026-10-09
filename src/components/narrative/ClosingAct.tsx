import React from 'react';
import { motion } from 'motion/react';
import { Flame, ArrowUp, Github, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  onBackToTop: () => void;
  onExploreSystem: () => void;
}

export const ClosingAct: React.FC<Props> = ({ onBackToTop, onExploreSystem }) => {
  return (
    <section className="relative min-h-[85vh] w-full py-24 px-6 sm:px-12 lg:px-16 flex flex-col justify-between bg-[#05070d] border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto w-full text-center space-y-10 my-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>USHMA-NETRA · TRACK 02 (HEAT & WATER) CONCLUSION</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            From unconsented heat dumping <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              to autonomous civic thermal equity.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Built for the AWS Environmental Hackathon. A production-grade architecture restoring thermodynamic balance to the street canyons of Indian megacities.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onExploreSystem}
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
          >
            Launch Interactive 3D Simulator
          </button>

          <button
            onClick={onBackToTop}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 text-slate-400" />
            <span>Return to Beginning</span>
          </button>
        </div>
      </div>

      {/* Minimal Hackathon Credentials Strip */}
      <div className="max-w-5xl mx-auto w-full pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Ushma-Netra (Thermal Equity Agent)</span>
          <span>·</span>
          <span>Open Track / Environment Track 02</span>
        </div>

        <div className="flex items-center gap-6">
          <span>AWS Bedrock Nova</span>
          <span>·</span>
          <span>Amazon Rekognition</span>
          <span>·</span>
          <span>AWS IoT Core</span>
          <span>·</span>
          <span>Amazon Polly</span>
        </div>
      </div>
    </section>
  );
};
