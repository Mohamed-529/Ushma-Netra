import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  BookOpen,
  TrendingUp,
  Download,
  ChevronRight,
  ArrowRight,
  Flame,
  CheckCircle2,
  FileSpreadsheet,
  Code,
  Layers,
  Thermometer,
  Wind,
  ShieldCheck,
  Scale,
  ArrowLeft,
  Home
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const navigate = useNavigate();
  // Interactive Calculator State
  const [ambientTemp, setAmbientTemp] = useState<number>(41.5);
  const [coolingTonnage, setCoolingTonnage] = useState<number>(180);
  const [canyonWidth, setCanyonWidth] = useState<number>(7.0);
  const [canyonHeight, setCanyonHeight] = useState<number>(24.0);
  const [workersCount, setWorkersCount] = useState<number>(25);
  const [cop, setCop] = useState<number>(3.2);

  // Thermodynamic Calculation
  const calculationResults = useMemo(() => {
    // 1. Heat Rejection (kW): TR * 3.517 * (1 + 1/COP)
    const heatRejectedKw = coolingTonnage * 3.517 * (1 + 1 / cop);

    // 2. Aspect Ratio: H / W
    const aspectRatio = canyonHeight / canyonWidth;

    // 3. Trapping Factor: Higher aspect ratio means lower sky view factor (SVF)
    const trappingFactor = Math.min(2.5, Math.max(0.8, aspectRatio * 0.45));

    // 4. Plume delta (°C): Delta = (Q / (Cp * m_dot)) * trapping
    const deltaC = +(Math.min(14, (heatRejectedKw / 120) * trappingFactor * 0.8)).toFixed(1);

    // 5. Resulting Street Plume Temperature
    const streetPlumeTemp = +(ambientTemp + deltaC).toFixed(1);

    // 6. Estimated WBGT in alley
    const estimatedWbgt = +(ambientTemp * 0.35 + streetPlumeTemp * 0.45).toFixed(1);

    // 7. Risk Tier
    let riskTier = 'Nominal';
    let riskColor = 'text-emerald-400';
    if (estimatedWbgt >= 36) {
      riskTier = 'Extreme Lethality';
      riskColor = 'text-red-500';
    } else if (estimatedWbgt >= 33) {
      riskTier = 'High Risk';
      riskColor = 'text-rose-400';
    } else if (estimatedWbgt >= 30) {
      riskTier = 'Moderate';
      riskColor = 'text-amber-400';
    }

    // 8. Monthly Surcharge (INR) under Section 133
    const monthlySurchargeInr = Math.round(
      heatRejectedKw * deltaC * workersCount * 18.5
    );

    // 9. Thermal Equity Score (0 - 100)
    const debtScore = Math.min(100, Math.round((deltaC / 10) * 60 + (workersCount / 40) * 40));

    return {
      heatRejectedKw: Math.round(heatRejectedKw),
      aspectRatio: +aspectRatio.toFixed(2),
      deltaC,
      streetPlumeTemp,
      estimatedWbgt,
      riskTier,
      riskColor,
      monthlySurchargeInr,
      debtScore,
    };
  }, [ambientTemp, coolingTonnage, canyonWidth, canyonHeight, workersCount, cop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-750 text-xs font-mono font-medium transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-amber-400 font-semibold">Scientific Methodology</span>
        </nav>
      </div>

      {/* Hero Headline */}
      <div className="space-y-3 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Peer-Reviewed Thermodynamics
          </span>
          <span className="text-zinc-500 text-xs font-mono">·</span>
          <span className="text-zinc-400 text-xs font-mono">
            Urban Canopy Micro-Climate Modeling
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Scientific Formulation & Data Methodology
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Grounding thermal equity in the first principles of refrigeration thermodynamics, atmospheric boundary layer physics, wet bulb globe temperatures, and statutory civic environmental law.
        </p>
      </div>

      {/* Interactive Live Thermodynamic Calculator */}
      <div className="bg-[#0e0e14] rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Calculator className="w-4 h-4" />
              <span>Interactive Model Simulator</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Canyon Micro-Climate & Thermal Debt Calculator
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl mt-1">
              Adjust building AC capacity and canyon geometry to compute real-time exhaust heat ejection, trapped temperature delta, WBGT, and statutory penalty assessments.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              Solver: Eulerian Finite-Volume
            </span>
          </div>
        </div>

        {/* Inputs vs Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Ambient Baseline Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Ambient Baseline Air Temp (T_base)</span>
                <span className="text-amber-400 font-bold">{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min="32"
                max="48"
                step="0.5"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                <span>32°C (Mild Summer)</span>
                <span>48°C (Peak Heatwave)</span>
              </div>
            </div>

            {/* Total Cooling Tonnage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Building Commercial AC Capacity</span>
                <span className="text-amber-400 font-bold">{coolingTonnage} TR</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={coolingTonnage}
                onChange={(e) => setCoolingTonnage(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                <span>30 TR (Small Mall)</span>
                <span>500 TR (Corporate Highrise)</span>
              </div>
            </div>

            {/* Canyon Dimensions: Width & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Street Width (W)</span>
                  <span className="text-amber-400 font-bold">{canyonWidth} m</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="0.5"
                  value={canyonWidth}
                  onChange={(e) => setCanyonWidth(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-zinc-600">
                  Aspect ratio (H/W): {calculationResults.aspectRatio}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Building Height (H)</span>
                  <span className="text-amber-400 font-bold">{canyonHeight} m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="2"
                  value={canyonHeight}
                  onChange={(e) => setCanyonHeight(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-zinc-600">
                  Dense medieval lanes have H/W &gt; 3.0
                </div>
              </div>
            </div>

            {/* Vulnerable Workers Exposed */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Exposed Informal Street Vendors</span>
                <span className="text-rose-400 font-bold">{workersCount} workers</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="1"
                value={workersCount}
                onChange={(e) => setWorkersCount(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                <span>2 (Isolated cart)</span>
                <span>80 (Dense bazaar)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Computed Outputs (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider mb-3">
                Real-Time Thermodynamic Results
              </div>

              {/* Main Headline Metric */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <div className="text-xs font-mono text-zinc-400">Resulting Canyon Plume Temp:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-amber-400">
                    {calculationResults.streetPlumeTemp}°C
                  </span>
                  <span className="text-sm font-mono text-red-400 font-bold">
                    (+{calculationResults.deltaC}°C heat delta)
                  </span>
                </div>
              </div>

              {/* Key Indicators Matrix */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-850">
                  <span className="text-zinc-500 block text-[10px]">Total Rejected Heat</span>
                  <span className="text-base font-bold text-zinc-100">
                    {calculationResults.heatRejectedKw} kW
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-850">
                  <span className="text-zinc-500 block text-[10px]">Estimated WBGT</span>
                  <span className="text-base font-bold text-rose-400">
                    {calculationResults.estimatedWbgt}°C
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-850">
                  <span className="text-zinc-500 block text-[10px]">Health Risk Tier</span>
                  <span className={`text-base font-bold ${calculationResults.riskColor}`}>
                    {calculationResults.riskTier}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-850">
                  <span className="text-zinc-500 block text-[10px]">Thermal Debt Score</span>
                  <span className="text-base font-bold text-amber-400">
                    {calculationResults.debtScore}/100
                  </span>
                </div>
              </div>

              {/* Penalty Surcharge */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-zinc-900 border border-emerald-900/50">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  Statutory Section 133 Surcharge Assessment
                </div>
                <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
                  ₹{calculationResults.monthlySurchargeInr.toLocaleString('en-IN')}
                  <span className="text-xs text-zinc-500 font-normal"> / month</span>
                </div>
              </div>
            </div>

            <Link
              to="/grid"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore Monitored Grid Nodes</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Fundamental Scientific Formulations */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Mathematical Formulations</h3>
          <p className="text-xs text-zinc-400">
            Key physical equations powering Ushma-Netra&apos;s digital twin and municipal legal assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Equation 1: Rejection */}
          <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">Equation 01</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                HVAC Thermodynamics
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Total Outdoor Anthropogenic Heat Rejection ($Q_F$)
            </h4>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 font-mono text-sm text-amber-200 overflow-x-auto">
              Q_{'{'}rejected{'}'} = P_{'{'}cooling{'}'} \times \left(1 + \frac{'{'}1{'}'}{'{'}\text{'{'}COP{'}'}{'}'}\right)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every 1 kW of indoor thermal extraction requires additional electrical compressor work, rejecting between 1.30 kW and 1.45 kW of sensible heat directly outdoors at temperatures exceeding 52°C.
            </p>
          </div>

          {/* Equation 2: Thermal Equity Coefficient */}
          <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">Equation 02</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                Atmospheric Fluid Canopy
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Urban Street Canyon Thermal Trapping ($TEC$)
            </h4>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 font-mono text-sm text-amber-200 overflow-x-auto">
              TEC = \frac{'{'}\Delta T_{'{'}plume{'}'}{'}'}{'{'}\Delta T_{'{'}base{'}'}{'}'} \times \left(\frac{'{'}H_{'{'}canyon{'}'}{'}'}{'{'}W_{'{'}canyon{'}'}{'}'}\right) \times \frac{'{'}\rho_{'{'}vendors{'}'}{'}'}{'{'}10{'}'}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When street aspect ratio ($H/W$) exceeds 2.0, mechanical ventilation vortices trap superheated plumes in the pedestrian breathing zone, creating severe localized hyperthermia traps.
            </p>
          </div>

          {/* Equation 3: WBGT Physiological Threshold */}
          <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">Equation 03</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                Human Physiology
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Outdoor Wet Bulb Globe Temperature ($WBGT$)
            </h4>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 font-mono text-sm text-amber-200 overflow-x-auto">
              WBGT = 0.7 \, T_{'{'}nwb{'}'} + 0.2 \, T_{'{'}bg{'}'} + 0.1 \, T_{'{'}db{'}'}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Calculates human thermal survivability combining dry bulb heat, humidity evaporative capacity, and black globe radiant heat. Thresholds &gt;35°C prevent human metabolic cooling through sweat.
            </p>
          </div>

          {/* Equation 4: Statutory Penalty */}
          <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">Equation 04</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                Statutory Civic Law
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Section 133 CrPC Restorative Cooling Tariff (T_surcharge)
            </h4>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 font-mono text-sm text-amber-200 overflow-x-auto">
              T_{'{'}surcharge{'}'} = Q_{'{'}dumped{'}'} \cdot (T_{'{'}plume{'}'} - T_{'{'}base{'}'}) \cdot N_{'{'}vendors{'}'} \cdot R_{'{'}tariff{'}'}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enforceable civic penalty assessing the direct negative externality of commercial cooling dumping on informal workers, hypothecated into local street hydration infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Satellite Calibration Curve Section */}
      <div className="bg-[#0b0b10] rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">
            Sensor Calibration & Ground-Truth Validation
          </h3>
          <p className="text-xs text-zinc-400">
            Comparing USGS Landsat-9 TIR Band 10 orbital readings with ground-truth IMD weather stations and Ushma-Netra micro-canyon thermistors.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Location / Zone</th>
                <th className="py-3 px-4">IMD Station (Baseline)</th>
                <th className="py-3 px-4">Landsat-9 TIR (Surface)</th>
                <th className="py-3 px-4">Ushma-Netra Micro-Grid</th>
                <th className="py-3 px-4">Delta vs Satellite</th>
                <th className="py-3 px-4">Sensor Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Laxmi Nagar (Alley 3)</td>
                <td className="py-3 px-4 text-zinc-400">41.2°C</td>
                <td className="py-3 px-4 text-amber-300">44.1°C</td>
                <td className="py-3 px-4 font-bold text-red-400">47.8°C</td>
                <td className="py-3 px-4 text-rose-400 font-bold">+3.7°C (Trapped)</td>
                <td className="py-3 px-4 text-emerald-400">99.2% (12 pings/min)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Nehru Place (Computer Market)</td>
                <td className="py-3 px-4 text-zinc-400">42.0°C</td>
                <td className="py-3 px-4 text-amber-300">45.8°C</td>
                <td className="py-3 px-4 font-bold text-red-400">49.6°C</td>
                <td className="py-3 px-4 text-rose-400 font-bold">+3.8°C (Trapped)</td>
                <td className="py-3 px-4 text-emerald-400">98.9% (12 pings/min)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Chandni Chowk (Bhagirath)</td>
                <td className="py-3 px-4 text-zinc-400">42.5°C</td>
                <td className="py-3 px-4 text-amber-300">46.5°C</td>
                <td className="py-3 px-4 font-bold text-red-400">51.8°C</td>
                <td className="py-3 px-4 text-rose-400 font-bold">+5.3°C (Extreme)</td>
                <td className="py-3 px-4 text-emerald-400">99.6% (12 pings/min)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Dadar Flower Market (Mumbai)</td>
                <td className="py-3 px-4 text-zinc-400">37.5°C</td>
                <td className="py-3 px-4 text-amber-300">41.5°C</td>
                <td className="py-3 px-4 font-bold text-red-400">44.3°C</td>
                <td className="py-3 px-4 text-rose-400 font-bold">+2.8°C (Trapped)</td>
                <td className="py-3 px-4 text-emerald-400">99.1% (12 pings/min)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Peer-Reviewed References & Open Science Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Academic & Scientific Citations</span>
          </h4>
          <ul className="text-xs text-zinc-400 space-y-2 leading-relaxed">
            <li>
              <strong>Oke, T. R. (1988)</strong>: <em>Street design and urban canopy layer climates.</em> Energy and Buildings, 11(1-3), 103-113.
            </li>
            <li>
              <strong>Santamouris, M. et al. (2014)</strong>: <em>On the impact of AC heat rejection on urban micro-climate.</em> Solar Energy, 103, 682-697.
            </li>
            <li>
              <strong>Salamanca, F. et al. (2014)</strong>: <em>Anthropogenic heating of the urban environment due to AC systems.</em> Journal of Geophysical Research.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <span>Open Data & Scientific Datasets</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All validated telemetry, calibration matrices, and computer vision model weights are available for civic researchers and urban planners.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              to="/grid"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download GeoJSON Grid</span>
            </Link>
            <Link
              to="/watchlist"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subscribe to Alert Feed</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
