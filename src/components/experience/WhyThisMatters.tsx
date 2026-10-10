import React from 'react';
import { motion } from 'motion/react';
import { HeartPulse, AlertTriangle, ShieldAlert } from 'lucide-react';

export const WhyThisMatters: React.FC = () => {
  const [exposureHours, setExposureHours] = React.useState<number>(8.5);

  // Thermodynamic physiological calculations
  const coreBodyTemp = (37.0 + (exposureHours / 12) * 3.4).toFixed(1);
  const sweatDeficitMl = Math.round(exposureHours * 820);
  const isCritical = Number(coreBodyTemp) >= 39.0;

  return (
    <section className="relative min-h-screen w-full py-28 px-6 sm:px-12 lg:px-20 flex flex-col justify-center bg-transparent overflow-hidden">
      {/* Background Pulse Ambient Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,#dc2626_0,transparent_70%)] animate-pulse-glow" />

      <div className="max-w-5xl mx-auto w-full space-y-16 relative z-10">
        {/* Section Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono text-red-400">
          <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
          <span>02 · THE HUMAN COLLATERAL & PHYSIOLOGICAL LIMIT</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">BIOMETRIC FIELD EVIDENCE</span>
        </div>

        {/* Sequential Typography Master Statements */}
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-400"
          >
            This is not seasonal summer weather.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-serif"
          >
            This is an <span className="text-red-400 underline decoration-red-600/50">artificial micro-thermal trap</span> dumped onto public sidewalks.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-300"
          >
            At 35°C Wet Bulb Globe Temperature (WBGT),{' '}
            <strong className="text-amber-400 font-bold">human sweat physically cannot evaporate.</strong>
          </motion.p>
        </div>

        {/* Ground-Truth Subject Profile: Rameshwar Pal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <span>Ground-Truth Subject Profile</span>
                <span className="text-slate-600">·</span>
                <span>GPS: 28.6304° N, 77.2772° E</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">Rameshwar Pal, 52 · Tea Stall Operator</h3>
              <p className="text-xs text-slate-400">Gali No. 4, District Centre Alleyway, Laxmi Nagar, Delhi NCR</p>
            </div>
            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Distance to AC Exhaust Bank</span>
              <span className="text-lg font-bold text-red-400 tabular-nums">2.8 meters away</span>
            </div>
          </div>

          {/* Interactive Exposure Duration Slider */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="text-slate-300 font-bold flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Continuous Daily Exposure at Sidewalk Stall:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{exposureHours} Hours</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={exposureHours}
                  onChange={(e) => setExposureHours(parseFloat(e.target.value))}
                  className="w-32 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 block">ESTIMATED CORE TEMP</span>
                <span className={`text-base font-bold ${isCritical ? 'text-red-500' : 'text-amber-400'}`}>
                  {coreBodyTemp}°C
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 block">DEHYDRATION DEFICIT</span>
                <span className="text-base font-bold text-sky-400">-{sweatDeficitMl} mL</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 block">PHYSIOLOGICAL PHASE</span>
                <span className={`text-base font-bold ${isCritical ? 'text-red-400' : 'text-amber-300'}`}>
                  {isCritical ? 'Heat Stroke Risk' : 'Severe Exhaustion'}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 block">REGULATORY ACTION</span>
                <span className="text-base font-bold text-emerald-400">Tier-1 Audio Alarm</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">LOCAL WBGT MEASURED</span>
              <span className="text-3xl font-extrabold text-red-500 tabular-nums">36.8°C</span>
              <span className="text-[10px] text-red-400 block mt-1">Exceeds physiological limit</span>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DAILY DURATION OF EXPOSURE</span>
              <span className="text-3xl font-extrabold text-amber-400 tabular-nums">11.5 Hours</span>
              <span className="text-[10px] text-slate-400 block mt-1">07:00 to 18:30 daily</span>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">HEAT STROKE LETHALITY WINDOW</span>
              <span className="text-3xl font-extrabold text-red-400 tabular-nums">&lt; 40 mins</span>
              <span className="text-[10px] text-red-400 block mt-1">Without active hydration stand-down</span>
            </div>
          </div>

          <blockquote className="p-4 rounded-xl bg-slate-900/50 border-l-2 border-amber-500 text-xs text-slate-300 italic leading-relaxed">
            "By two in the afternoon, the back of my neck feels like it is on a tandoor fire. The air coming from the building's AC boxes smells of hot metal and grease. You cannot breathe. But this is where my customers come. Where else can I go?"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};
