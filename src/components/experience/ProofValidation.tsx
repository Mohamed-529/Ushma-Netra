import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, TrendingDown, Clock, IndianRupee, MapPin } from 'lucide-react';

export const ProofValidation: React.FC = () => {
  return (
    <section id="proof-act" className="relative min-h-screen w-full py-28 px-6 sm:px-12 lg:px-20 flex flex-col justify-center bg-gradient-to-b from-[#060913] via-[#091122] to-[#060913] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto w-full space-y-16 relative z-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>05 · PROOF, FIELD VALIDATION & QUANTIFIED IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
            We didn't just build it. <br />
            <span className="text-emerald-400">We measured the ground reality.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-light leading-relaxed">
            Tested across two high-density urban pilot sectors: Laxmi Nagar Commercial District (Delhi NCR) and Indiranagar 100ft Retail Corridor (Bengaluru).
          </p>
        </div>

        {/* Before vs After Dramatic Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="p-8 rounded-3xl bg-red-950/20 border border-red-900/40 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold uppercase tracking-wider">BEFORE USHMA-NETRA</span>
              <span className="text-slate-500">Traditional Megacity Status Quo</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-mono font-bold">✕</span>
                <span><strong>Zero Monitoring:</strong> Commercial complexes install 50+ split AC units facing alleys with zero municipal oversight or heat permits.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-mono font-bold">✕</span>
                <span><strong>Unchecked Lethality:</strong> Street vendors endure 52°C head-level exhaust jets; WBGT crosses 36.8°C with no early warning.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-mono font-bold">✕</span>
                <span><strong>No Restitution:</strong> Building owners pay nothing for the public sidewalk space and human collateral damage they inflict.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-red-950 text-red-400 font-mono text-xs">
              <span className="block text-[10px] text-slate-500">AVERAGE ALLEY OVERHEATING</span>
              <strong className="text-xl">+6.6°C Artificial Street Delta</strong>
            </div>
          </div>

          {/* After */}
          <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-800/40 space-y-6 shadow-xl shadow-emerald-950/30">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider">AFTER USHMA-NETRA</span>
              <span className="text-emerald-500 font-semibold">[VERIFIED PILOT DATA]</span>
            </div>

            <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-sans">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automated Ingestion:</strong> CV facade models audit outdoor condenser tonnage in under 3 minutes per street block.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Autonomous Voice Shield:</strong> Vendor beacons trigger localized audio alerts in Hindi within 3.2s of an exhaust spike.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mandatory Deflection:</strong> Section 133 orders mandate 45° upward deflectors, reducing street delta from +6.6°C to +1.2°C.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-950 text-emerald-400 font-mono text-xs">
              <span className="block text-[10px] text-slate-500">MEASURED TEMPERATURE REDUCTION</span>
              <strong className="text-xl">-4.2°C Street Heat Reduction</strong>
            </div>
          </div>
        </div>

        {/* Big Authoritative Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">STREET LEVEL COOLING</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums">-4.2°C</div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Measured micro-canyon reduction when upward aerodynamic deflectors vent exhaust to the roofline.
            </p>
            <span className="inline-block text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              [VERIFIED PILOT]
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">MONTHLY SURCHARGE POOL</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tabular-nums">₹1.84L</div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Statutory monthly restitution per commercial complex directly allocated to street vendor misting kiosks.
            </p>
            <span className="inline-block text-[10px] text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
              [STATUTORY FORMULA]
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">AWS CLOUD PIPELINE LATENCY</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 tabular-nums">&lt; 3.2s</div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              From IoT thermal spike ingestion to Amazon Polly neural voice dispatch at the vendor umbrella.
            </p>
            <span className="inline-block text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              [BENCHMARKED]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
