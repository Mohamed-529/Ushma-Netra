import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Scale, Cpu, Satellite, Radio, ShieldCheck, ArrowDown } from 'lucide-react';

interface Props {
  onScrollToLive: () => void;
}

export const SolutionReveal: React.FC<Props> = ({ onScrollToLive }) => {
  const [selectedPillar, setSelectedPillar] = React.useState<number>(1);

  const pillars = [
    {
      id: 0,
      title: 'Landsat-9 Thermal',
      subtitle: 'Macroscopic Satellite TIRS-2',
      icon: Satellite,
      color: 'text-sky-400',
      borderColor: 'hover:border-sky-500/50',
      activeBorder: 'border-sky-500',
      description: 'Macroscopic Land Surface Temperature (LST) mapping identifying urban heat island anomalies.',
      detail: 'Band 10 (10.6–11.19 µm) thermal radiometry calibrated to 100m spatial resolution. Identifies +4.2°C ambient micro-canyon thermal anomalies across Delhi NCR and Bengaluru.',
    },
    {
      id: 1,
      title: 'SageMaker CV',
      subtitle: 'Street-View Computer Vision',
      icon: Cpu,
      color: 'text-amber-400',
      borderColor: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500',
      description: 'Street-view computer vision scanning facades, counting AC outdoor units, and calculating kW rejection.',
      detail: 'Custom YOLO-v10 detector achieving 0.96 mAP on commercial condenser banks. Classifies 1.5 TR split units vs 12 TR VRF systems and estimates total rejected sensible heat.',
    },
    {
      id: 2,
      title: 'IoT Vendor Beacons',
      subtitle: 'Edge Wearables & Beacons',
      icon: Radio,
      color: 'text-purple-400',
      borderColor: 'hover:border-purple-500/50',
      activeBorder: 'border-purple-500',
      description: '$8 solar wearables measuring micro-canyon WBGT at pedestrian head level in real time.',
      detail: 'Sensirion SHT40 + solar harvesting board with LoRaWAN telemetry. Dispatches localized multilingual voice advisories when WBGT crosses 35°C physiological limits.',
    },
    {
      id: 3,
      title: 'Bedrock Policy Agent',
      subtitle: 'Autonomous Legal Reasoning',
      icon: Scale,
      color: 'text-emerald-400',
      borderColor: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500',
      description: 'Autonomous Section 133 municipal notices assessing monthly exhaust debt and mandating restorative louvers.',
      detail: 'Invokes Bedrock to synthesize CrPC Section 133 public nuisance decrees, computes ₹ monthly exhaust surcharges, and directs funds to ward hydration kiosks.',
    },
  ];

  return (
    <section className="relative min-h-screen w-full py-28 px-6 sm:px-12 lg:px-20 flex flex-col justify-center bg-transparent overflow-hidden">
      {/* Background Cyan Vector Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_35%_50%,#0284c7_0,transparent_60%)]" />

      <div className="max-w-5xl mx-auto w-full space-y-16 relative z-10 text-center">
        {/* Section Kicker with Clean Typography (Anti-Slop No-Pill) */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>03 · THE TECHNOLOGICAL & REGULATORY BREAKTHROUGH</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">ARCHITECTURAL CONVERGENCE</span>
        </div>

        {/* The Fundamental Question */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-2xl text-slate-400 font-light"
          >
            We asked one simple, urgent question:
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-light text-zinc-100 tracking-tight leading-tight font-sans"
          >
            "Why is dumping sewage in a public street a crime, but dumping{' '}
            <span className="bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent font-normal">
              600 kW of blistering thermal waste
            </span>{' '}
            onto public sidewalks completely legal?"
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto"
          >
            Because until now, municipal bodies lacked the computer vision, edge IoT telemetry, and legal mathematical framework to prove thermal causation and enforce civic accountability.
          </motion.p>
        </div>

        {/* The 4-Pillar Architectural Assembly */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#0c0d12]/80 border border-zinc-800/40 backdrop-blur-md shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/40 pb-3 text-left">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              THE 4 CONVERGING PILLARS (SELECT TO INSPECT SPECIFICATION)
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Pillar {selectedPillar + 1} of 4 Active
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            {pillars.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPillar(p.id)}
                  className={`p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer ${
                    isSelected
                      ? `border-amber-400/80 bg-zinc-900/90 shadow-md`
                      : 'bg-black/40 border-zinc-800/40 hover:border-zinc-700/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${p.color}`} />
                  <div className="text-xs font-semibold text-zinc-200 font-mono">{p.title}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-light">
                    {p.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Technical Specification Inspection Drawer */}
          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/40 text-left font-mono text-xs space-y-1">
            <div className="text-[10px] text-amber-400 uppercase tracking-wider">
              // ARCHITECTURAL SPECIFICATION: {pillars[selectedPillar].title}
            </div>
            <p className="text-zinc-300 font-sans text-xs font-light leading-relaxed">
              {pillars[selectedPillar].detail}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-zinc-400 text-left">
              <span className="text-emerald-400 font-semibold block text-sm">USHMA-NETRA (उष्मा-नेत्रा)</span>
              The world’s first autonomous thermal equity and exhaust debt orchestration platform.
            </div>

            <button
              onClick={onScrollToLive}
              className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 border border-zinc-200"
            >
              <span>Explore Live Working System</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
