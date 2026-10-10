import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Thermometer, ShieldCheck, ArrowRight, Eye, Sliders, CheckCircle2, AlertTriangle, Wind } from 'lucide-react';

interface ThermalProofCardProps {
  className?: string;
}

export const ThermalProofCard: React.FC<ThermalProofCardProps> = ({ className = '' }) => {
  // Scrubber temperature: default at 54°C to demonstrate peak exhaust, but user can slide between 19°C and 54°C
  const [sliderTemp, setSliderTemp] = useState<number>(54);
  const [viewMode, setViewMode] = useState<'photo' | 'thermal' | 'mitigated'>('thermal');

  // Compute thermal characteristics based on slider
  const isChilled = sliderTemp <= 22;
  const isComfortZone = sliderTemp > 22 && sliderTemp <= 28;
  const isHighHeat = sliderTemp > 28 && sliderTemp <= 44;
  const isSeverePlume = sliderTemp > 44;

  const getHeatLabel = () => {
    if (isChilled) return { title: '19°C – 22°C Luxury Chilled Air', status: 'INDOOR COMFORT', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    if (isComfortZone) return { title: '23°C – 28°C Safe Street Canopy', status: 'EQUITABLE BASELINE', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (isHighHeat) return { title: '29°C – 44°C Sidewalk Ambient Trap', status: 'HEAT STRAIN', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { title: '45°C – 54°C Direct AC Exhaust Blast', status: 'SEVERE THERMAL DEBT', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const label = getHeatLabel();

  return (
    <div className={`relative w-full rounded-2xl bg-white/95 border border-stone-200 shadow-xl overflow-hidden backdrop-blur-md transition-all ${className}`}>
      {/* Top Header Badge & View Switcher */}
      <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-stone-50/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-stone-700">
            Thermal Reality: 19°C to 26°C vs 54°C
          </span>
          <span className="text-stone-300">|</span>
          <span className="text-[10px] font-mono text-stone-500 hidden sm:inline">FIELD MEASURED PROOF</span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg text-[10px] font-mono">
          <button
            onClick={() => setViewMode('photo')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              viewMode === 'photo'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Diagram
          </button>
          <button
            onClick={() => setViewMode('thermal')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              viewMode === 'thermal'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            FLIR 19°-54°C
          </button>
          <button
            onClick={() => setViewMode('mitigated')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              viewMode === 'mitigated'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mitigated (26°C)
          </button>
        </div>
      </div>

      {/* Main Visual Picture Stage: Architectural Section with 19°C vs 54°C contrast */}
      <div className="relative p-5 sm:p-6 bg-gradient-to-b from-stone-50 via-white to-stone-100 overflow-hidden">
        {/* Dynamic Thermal Glow Mask based on view mode and slider */}
        {viewMode === 'thermal' && (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-60"
            style={{
              background: `radial-gradient(circle at 65% 55%, ${
                sliderTemp > 45 ? 'rgba(239, 68, 68, 0.35)' : sliderTemp > 30 ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.25)'
              } 0%, transparent 65%)`,
            }}
          />
        )}

        {/* Visual Architectural Diagram with SVG Cross-Section */}
        <div className="relative w-full h-[230px] sm:h-[260px] rounded-xl bg-stone-900 overflow-hidden border border-stone-800 shadow-inner flex flex-col justify-between p-3 select-none">
          {/* Top Level: 19°C Luxury Penthouse */}
          <div className="relative z-10 flex items-center justify-between p-2.5 rounded-lg bg-sky-950/80 border border-sky-600/40 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <div>
                <div className="text-[11px] font-mono font-bold text-sky-200">INDOOR LUXURY SUITE</div>
                <div className="text-[9px] text-sky-300/80 font-sans">Occupants enjoy chilled air conditioning</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-mono font-black text-sky-300">19.2°C</div>
              <div className="text-[9px] font-mono text-sky-400/80">CHILLED TARGET</div>
            </div>
          </div>

          {/* Middle Wall: Commercial AC Condenser Exhaust Blast */}
          <div className="relative z-10 my-auto py-2 px-3 rounded-lg bg-stone-950/90 border border-red-500/50 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-red-950 border border-red-600/60 text-red-400">
                  <Flame className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-red-300 flex items-center gap-1.5">
                    FACADE AC EXHAUST JET
                    {viewMode === 'mitigated' && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 text-[9px] border border-emerald-500/50">
                        DEFLECTED 90° UP
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-zinc-400 font-sans">
                    {viewMode === 'mitigated'
                      ? 'Louvers direct 54°C plume upward; sidewalk mist active'
                      : 'Blasts sensible heat directly into pedestrian canyon'}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-lg sm:text-xl font-mono font-black ${viewMode === 'mitigated' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {viewMode === 'mitigated' ? '25.8°C' : `${sliderTemp.toFixed(1)}°C`}
                </div>
                <div className="text-[9px] font-mono text-zinc-400">
                  {viewMode === 'mitigated' ? 'MISTED ZONE' : 'EXHAUST PLUME'}
                </div>
              </div>
            </div>

            {/* Simulated Animated Plume Stream */}
            <div className="mt-2 w-full h-2 rounded-full overflow-hidden bg-stone-800 flex">
              <div
                className={`h-full transition-all duration-300 ${
                  viewMode === 'mitigated'
                    ? 'w-[40%] bg-gradient-to-r from-emerald-500 to-sky-400'
                    : 'w-[95%] bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 animate-pulse'
                }`}
              />
            </div>
          </div>

          {/* Ground Level: Sidewalk Vendor Cart */}
          <div className="relative z-10 flex items-center justify-between p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${viewMode === 'mitigated' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <div>
                <div className="text-[11px] font-mono font-bold text-stone-200">SIDEWALK STREET VENDOR</div>
                <div className="text-[9px] text-stone-400 font-sans">
                  {viewMode === 'mitigated'
                    ? 'Hydration shelter & mist cooling protected'
                    : 'Informal workers absorb unmitigated commercial heat'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-base sm:text-lg font-mono font-black ${viewMode === 'mitigated' ? 'text-emerald-300' : 'text-amber-400'}`}>
                {viewMode === 'mitigated' ? '26.0°C' : `${(26 + (sliderTemp - 26) * 0.58).toFixed(1)}°C`}
              </div>
              <div className="text-[9px] font-mono text-stone-400">
                {viewMode === 'mitigated' ? 'SAFE COMFORT' : 'SIDEWALK EXPOSURE'}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Temperature Scrubber (19°C -> 26°C -> 54°C) */}
        <div className="mt-4 pt-3 border-t border-stone-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Sliders className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-semibold text-stone-800">Inspect Temperature Spectrum:</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${label.color}`}>
              {sliderTemp.toFixed(1)}°C — {label.status}
            </span>
          </div>

          {/* Slider Input */}
          <div className="relative flex items-center">
            <input
              type="range"
              min={19}
              max={55}
              step={0.5}
              value={sliderTemp}
              onChange={(e) => setSliderTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-red-600 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />
          </div>

          {/* Three Key Markers: 19°C, 26°C, 54°C */}
          <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 pt-0.5">
            <button
              onClick={() => setSliderTemp(19.2)}
              className="hover:text-stone-900 font-semibold cursor-pointer transition-colors"
            >
              19°C (Penthouse)
            </button>
            <button
              onClick={() => setSliderTemp(26.0)}
              className="hover:text-stone-900 font-semibold cursor-pointer transition-colors"
            >
              26°C (Safe Street Target)
            </button>
            <button
              onClick={() => setSliderTemp(54.0)}
              className="hover:text-stone-900 font-semibold cursor-pointer transition-colors text-red-600 font-bold"
            >
              54°C (AC Exhaust Jet)
            </button>
          </div>
        </div>
      </div>

      {/* Quantitative Disparity Summary Banner */}
      <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-stone-500 block uppercase">INDOOR</span>
            <span className="font-bold text-sky-700">19.2°C</span>
          </div>
          <span className="text-stone-300">➔</span>
          <div>
            <span className="text-[10px] text-stone-500 block uppercase">TARGET</span>
            <span className="font-bold text-emerald-700">26.0°C</span>
          </div>
          <span className="text-stone-300">➔</span>
          <div>
            <span className="text-[10px] text-stone-500 block uppercase">EXHAUST</span>
            <span className="font-bold text-red-600">54.2°C</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-700 text-[11px] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Section 133 Tariff: Enforces 90° skyward louvers</span>
        </div>
      </div>
    </div>
  );
};
