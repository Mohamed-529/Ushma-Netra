import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Scan,
  Wind,
  Radio,
  Scale,
  ArrowRight,
  Thermometer,
} from 'lucide-react';

interface ScrollDrivenShowcaseProps {
  onReplayIntro: () => void;
}

export const ScrollDrivenShowcase: React.FC<ScrollDrivenShowcaseProps> = ({
  onReplayIntro,
}) => {
  const corePillars = [
    {
      num: '01',
      title: 'Satellite & AI Camera Detection',
      desc: 'Finds outdoor AC units dumping 54°C heat into narrow streets.',
      icon: Scan,
    },
    {
      num: '02',
      title: 'Street Plume Heat Tracking',
      desc: 'Maps trapped hot air pockets where street vendors work.',
      icon: Wind,
    },
    {
      num: '03',
      title: 'Cart Sensor & Voice Alerts',
      desc: 'Warns workers in Hindi & English before heat becomes deadly.',
      icon: Radio,
    },
    {
      num: '04',
      title: 'Polluter Fine & Cooling Mist',
      desc: 'Bills commercial towers to fund skyward louvers and mist stations.',
      icon: Scale,
    },
  ];

  return (
    <section id="how_it_works_summary" className="relative w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-16 border-t border-[#d6cebe]">
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

      {/* Single Clean Two-Column Block: Left = 4 Short Crisp Points, Right = Related Visual Picture */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT SIDE: Short, Crisp, Simple English Summary of All 4 Core Capabilities */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#a8321a] font-semibold uppercase tracking-wider">
                How Ushma-Netra Works in 4 Steps
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0b1b2d] tracking-tight leading-tight">
                Stop commercial AC heat from cooking street workers.
              </h2>
              <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
                We track waste heat from big buildings and turn it into instant street cooling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {corePillars.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className="p-4 rounded-2xl bg-[#efe8dc] border border-[#d6cebe] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#a8321a]">
                        {item.num}
                      </span>
                      <Icon className="w-4 h-4 text-[#0b1b2d]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1b2d] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#1f3044] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-1">
              <Link
                to="/twin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b1b2d] hover:bg-[#1a2f47] text-white text-sm font-semibold transition-all cursor-pointer shadow-md"
              >
                <span>See Live 3D Street View</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Clean Related Visual Picture with Key Thermal Overlay */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#d6cebe] bg-[#0b111e] shadow-[0_24px_60px_rgba(11,27,45,0.18)]">
              {/* High-Contrast Street Canyon Thermal Visual */}
              <div className="relative h-[380px] sm:h-[430px] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                  alt="Urban commercial facade dumping AC exhaust heat into street corridor"
                  className="w-full h-full object-cover opacity-55 mix-blend-luminosity scale-105"
                />
                {/* Infrared Thermal Plume Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0b111e] via-red-900/45 to-amber-500/35" />

                {/* Top Camera Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-end text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-full bg-rose-600/90 text-white font-bold backdrop-blur-md">
                    54.2°C Exhaust
                  </span>
                </div>

                {/* Annotated Visual Callouts on the Picture */}
                <div className="absolute top-1/3 left-6 p-3 rounded-xl bg-[#0b111e]/90 border border-rose-500/60 text-white font-mono text-xs space-y-0.5 backdrop-blur-md shadow-lg">
                  <div className="text-[10px] text-rose-300 uppercase">Building AC Vents</div>
                  <div className="text-sm font-bold text-white">68 Condensers · 638 kW</div>
                </div>

                <div className="absolute bottom-24 right-6 p-3 rounded-xl bg-[#0b111e]/90 border border-emerald-400/60 text-white font-mono text-xs space-y-0.5 backdrop-blur-md shadow-lg">
                  <div className="text-[10px] text-emerald-300 uppercase">Cooling Action</div>
                  <div className="text-sm font-bold text-emerald-300">-4.2°C Mist + 45° Louvers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
