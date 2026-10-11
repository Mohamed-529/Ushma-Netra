import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wind, ShieldCheck, HeartHandshake } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#12161A] text-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Floating Impact Card (Pure White #FFFFFF on Deep Charcoal #12161A Canvas) */}
        <div className="rounded-3xl bg-[#FFFFFF] text-[#111827] overflow-hidden border border-[#E5E7EB] shadow-xl">
          {/* 1. Big Visual Impact Picture */}
          <div className="relative h-[380px] sm:h-[520px] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85"
              alt="Street vendors working safely under cooled urban corridors"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b2d] via-[#0b1b2d]/40 to-transparent" />

            {/* Clean Badge & Headline Over the Big Picture */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Real Street Impact
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Cooler Streets. Protected Vendors.
                </h1>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-[#0b1b2d]/90 border border-emerald-400/40 backdrop-blur-md text-right shrink-0">
                <div className="text-xs font-mono text-emerald-300 font-bold uppercase">
                  Street Heat Drop
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                  -4.2°C
                </div>
              </div>
            </div>
          </div>

          {/* 2. Simple 2-to-3 Line Summary (Zero Clutter, Easy to Read in 3 Seconds) */}
          <div className="p-8 sm:p-12 space-y-8">
            <div className="max-w-3xl space-y-3">
              <p className="text-xl sm:text-2xl font-bold text-[#111827] leading-snug">
                Commercial towers no longer dump 54°C AC exhaust onto crowded sidewalks.
              </p>
              <p className="text-base sm:text-lg text-[#111827]/85 leading-relaxed">
                45° upward louvers lift hot air safely toward the sky, while automated building fines fund free solar voice alerts and cooling mist stations for 10 million street vendors.
              </p>
            </div>

            {/* 3 Clean Visual Pills + Quick Action */}
            <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono font-bold">
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]">
                  <Wind className="w-4 h-4 text-emerald-700" />
                  <span>-4.2°C Cooler Sidewalks</span>
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]">
                  <ShieldCheck className="w-4 h-4 text-[#a8321a]" />
                  <span>100% Polluter-Funded Mist</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/twin"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#a8321a] hover:bg-[#8c2713] text-white font-mono text-xs font-bold transition-colors shadow-md"
                >
                  <span>Open 3D Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/watchlist"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white font-mono text-xs font-bold transition-colors"
                >
                  <span>See Vendor Alerts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
