import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  Radio,
  Scale,
  Wind,
  ArrowRight,
} from 'lucide-react';

export const AlternatingFeatureShowcase: React.FC = () => {
  const rows = [
    {
      step: '01 · AI Camera Detection',
      title: 'Count Every Outdoor AC Dumping Heat Into Streets',
      summary:
        'Our edge camera scans building walls and spots every AC unit blowing 54°C air onto narrow sidewalks.',
      ctaLabel: 'Open CV Scanner',
      ctaPath: '/scanner',
      image:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      badge: '68 AC Units Flagged',
      metric: '638 kW Exhaust Heat',
      icon: Scan,
    },
    {
      step: '02 · Cart Heat Sensor',
      title: 'Protect Street Vendors With Live Voice Warnings',
      summary:
        'A small sensor on vendor carts tracks heat and humidity, speaking instant alerts in Hindi and English when air turns dangerous.',
      ctaLabel: 'Open Heat Watchlist',
      ctaPath: '/watchlist',
      image:
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
      badge: '',
      metric: '36.8°C Wet-Bulb Alert',
      icon: Radio,
    },
    {
      step: '03 · Polluter Accountability',
      title: 'Bill Commercial Towers for Public Street Heat',
      summary:
        'Buildings that overheat public alleys receive automated Section 133 thermal notices that pay directly for street cooling.',
      ctaLabel: 'Open Debt Ledger',
      ctaPath: '/ledger',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      badge: 'Section 133 Notice',
      metric: '₹1.85L Monthly Levy',
      icon: Scale,
    },
    {
      step: '04 · 3D Cooling Action',
      title: 'Tilt Exhaust Skyward & Trigger Cooling Mist',
      summary:
        'Upward 45° louvers and sidewalk misting stations drop street temperatures by 4.2°C within minutes.',
      ctaLabel: 'Open 3D Twin',
      ctaPath: '/twin',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
      badge: 'SCADA Active',
      metric: '-4.2°C Street Drop',
      icon: Wind,
    },
  ];

  return (
    <section className="relative w-full py-20 sm:py-24 px-4 sm:px-8 lg:px-16 border-t border-white/10 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-12">
        {rows.map((row, index) => {
          const isEven = index % 2 === 1;
          const Icon = row.icon;

          return (
            <div
              key={row.step}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Text Column Inside Pure White Card */}
              <div
                className={`lg:col-span-6 space-y-4 text-left ${
                  isEven ? 'order-1 lg:order-2' : 'order-1'
                }`}
              >
                <div className="text-xs font-mono text-[#a8321a] font-bold uppercase tracking-wider">
                  {row.step}
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight leading-tight">
                  {row.title}
                </h3>
                <p className="text-sm sm:text-base text-[#111827] leading-relaxed max-w-xl">
                  {row.summary}
                </p>
                <div className="pt-1">
                  <Link
                    to={row.ctaPath}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <span>{row.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </Link>
                </div>
              </div>

              {/* Visual Picture Column */}
              <div
                className={`lg:col-span-6 ${
                  isEven ? 'order-2 lg:order-1' : 'order-2'
                }`}
              >
                <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#0b111e] shadow-lg">
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <img
                      src={row.image}
                      alt={row.title}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b111e] via-[#0b111e]/30 to-transparent" />

                    {row.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b111e]/90 border border-slate-700 text-xs font-mono text-amber-300 font-semibold backdrop-blur-md">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{row.badge}</span>
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono">
                      <span className="text-xs text-slate-300">Live Field Evidence</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-300">
                        {row.metric}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
