import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  Radio,
  Scale,
  Wind,
  ArrowRight,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AlternatingFeatureShowcase: React.FC = () => {
  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-16 border-t border-[#d6cebe] bg-[#ebe4d8]/60">
      <div className="max-w-7xl mx-auto space-y-24 sm:space-y-32">
        {/* Section Intro */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-[#a8321a] font-semibold">
            Core Platform Architecture · 4-Tier Closed Loop
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0b1b2d] tracking-tight text-balance">
            From Street-Level Heat Detection to Autonomous Civic Restitution
          </h2>
          <p className="text-base text-[#1f3044] leading-relaxed">
            Each subsystem in Ushma-Netra is engineered to convert invisible anthropogenic heat dumping into verifiable evidence and immediate physical cooling.
          </p>
        </div>

        {/* ================================================================= */}
        {/* ROW 1 (ODD): TEXT ON LEFT, VISUAL MOCKUP ON RIGHT                 */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text (50%) */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              01. Tier 1 · Edge Computer Vision &amp; Orbital TIR
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight leading-tight">
              Automated Façade Condenser &amp; Sensible Heat Profiling
            </h3>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Our quantized YOLOv8-Thermal vision pipeline scans commercial building façades to count split AC units, VRF banks, and rooftop chillers. Paired with Landsat-9 thermal infrared radiance, it calculates the exact kilowatt load expelled into narrow pedestrian alleys.
            </p>
            <div className="pt-1">
              <Link
                to="/scanner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Launch Façade CV Scanner</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Container (50%) */}
          <div className="lg:col-span-6">
            <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-amber-500/60 via-rose-500/40 to-sky-500/50 shadow-[0_20px_50px_rgba(11,27,45,0.14)]">
              <div className="rounded-[22px] bg-[#0b111e] p-6 text-slate-100 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="flex items-center gap-2 text-amber-400 font-bold">
                    <Scan className="w-4 h-4" />
                    <span>YOLOv8-THERMAL // VIKAS MARG FACADE</span>
                  </span>
                  <span className="text-emerald-400">97.4% mAP</span>
                </div>

                {/* Simulated Bounding Box Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'AC-01', type: 'Split 1.5 TR', kw: '5.2 kW', temp: '53.8°C' },
                    { id: 'AC-02', type: 'Split 2.0 TR', kw: '6.8 kW', temp: '54.4°C' },
                    { id: 'VRF-01', type: 'VRF Master', kw: '42.0 kW', temp: '56.1°C' },
                  ].map((unit) => (
                    <div
                      key={unit.id}
                      className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-1 font-mono"
                    >
                      <div className="flex items-center justify-between text-[10px] text-rose-300">
                        <span>{unit.id}</span>
                        <span>{unit.temp}</span>
                      </div>
                      <div className="text-xs font-bold text-white">{unit.type}</div>
                      <div className="text-[11px] text-amber-400 font-semibold">
                        Rejects {unit.kw}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#11192b] border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">AGGREGATE DETECTED REJECTION</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      638.4 kW Continuous Plume
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-[11px]">STREET DELTA</div>
                    <div className="text-lg font-bold text-rose-400 mt-0.5">+6.6°C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 2 (EVEN): VISUAL MOCKUP ON LEFT, TEXT ON RIGHT                */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column on Desktop: Visual Container (50%) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-sky-500/60 via-emerald-500/40 to-amber-500/50 shadow-[0_20px_50px_rgba(11,27,45,0.14)]">
              <div className="rounded-[22px] bg-[#0b111e] p-6 text-slate-100 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="flex items-center gap-2 text-sky-400 font-bold">
                    <Radio className="w-4 h-4" />
                    <span>BLE VENDOR BEACON // NODE #VN-101</span>
                  </span>
                  <span className="text-rose-400 font-bold">WBGT 36.8°C</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-[#11192b] border border-slate-800">
                    <div className="text-[10px] text-slate-400">VENDOR STATION</div>
                    <div className="text-sm font-bold text-white mt-1">Rameshwar Pal</div>
                    <div className="text-[11px] text-slate-400">Chai &amp; Snack Cart · 2.8m from vent</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#11192b] border border-slate-800">
                    <div className="text-[10px] text-slate-400">PHYSIOLOGICAL RISK</div>
                    <div className="text-sm font-bold text-rose-400 mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Sweat Failure Limit</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Bilingual Voice Alert Active</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200">
                  &ldquo;चेतावनी! वेट-बल्ब तापमान 36.8°C पार कर चुका है। कृपया 45 मीटर दूर कूलिंग कियोस्क पर जाएं।&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Right Column on Desktop: Text (50%) */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              02. Tier 2 · Wearable IoT Ground Truth
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight leading-tight">
              Cart-Mounted WBGT Telemetry &amp; Multilingual Voice Advisories
            </h3>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Low-cost ESP32-S3 beacons clipped to street vendor carts stream real-time Wet Bulb Globe Temperature (WBGT). When commercial AC exhaust pushes local WBGT past the 36.0°C human sweat-evaporation threshold, bilingual voice and WhatsApp alerts direct workers to nearby misting shelters.
            </p>
            <div className="pt-1">
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Open Heat Surge Watchlist</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 3 (ODD): TEXT ON LEFT, VISUAL MOCKUP ON RIGHT                 */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text (50%) */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              03. Tier 3 · Section 133 CrPC Restorative Governance
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight leading-tight">
              Autonomous Thermal Debt Ledger &amp; Statutory Notice Engine
            </h3>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Unconsented dumping of 54°C exhaust into public rights-of-way is quantified as a public nuisance under Section 133 CrPC. Ushma-Netra calculates monthly thermal debt surcharges and drafts ready-to-serve statutory notices that fund street-level hydration kiosks.
            </p>
            <div className="pt-1">
              <Link
                to="/ledger"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Inspect Municipal Debt Ledger</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Container (50%) */}
          <div className="lg:col-span-6">
            <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-emerald-500/60 via-amber-500/40 to-sky-500/50 shadow-[0_20px_50px_rgba(11,27,45,0.14)]">
              <div className="rounded-[22px] bg-[#0b111e] p-6 text-slate-100 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Scale className="w-4 h-4" />
                    <span>SECTION 133 CrPC // STATUTORY LEDGER</span>
                  </span>
                  <span className="text-amber-400 font-bold">₹6,16,500 / mo Pool</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { name: 'Vikas Marg Commercial Complex', debt: '92/100', tax: '₹1,85,000', status: 'Unmitigated' },
                    { name: 'Nehru Place IT Tower B', debt: '86/100', tax: '₹1,42,000', status: 'Under Review' },
                    { name: 'Connaught Outer Circle Arcade', debt: '34/100', tax: '₹48,500', status: 'Compliant' },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="p-3 rounded-xl bg-[#11192b] border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-sans font-bold text-white text-xs">{row.name}</div>
                        <div className="text-[11px] text-slate-400">Debt Score: {row.debt}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold tabular-nums">{row.tax}</div>
                        <div className="text-[10px] text-slate-400">{row.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 4 (EVEN): VISUAL MOCKUP ON LEFT, TEXT ON RIGHT                */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column on Desktop: Visual Container (50%) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-indigo-500/60 via-sky-500/50 to-emerald-500/50 shadow-[0_20px_50px_rgba(11,27,45,0.14)]">
              <div className="rounded-[22px] bg-[#0b111e] p-6 text-slate-100 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="flex items-center gap-2 text-sky-400 font-bold">
                    <Wind className="w-4 h-4" />
                    <span>3D EULERIAN CFD // LOUVER MITIGATION</span>
                  </span>
                  <span className="text-emerald-400 font-bold">-4.2°C Sidewalk Relief</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-1">
                    <div className="text-[10px] text-rose-300">BEFORE MITIGATION</div>
                    <div className="text-lg font-bold text-white tabular-nums">47.8°C Alley</div>
                    <div className="text-[11px] text-rose-300">Horizontal 0° Blast Vector</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                    <div className="text-[10px] text-emerald-300">AFTER 45° LOUVERS</div>
                    <div className="text-lg font-bold text-white tabular-nums">42.4°C Alley</div>
                    <div className="text-[11px] text-emerald-300">Skyward Plume Buoyancy</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>65% Surcharge Rebate Unlocked</span>
                  </span>
                  <span className="text-amber-400">SCADA Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column on Desktop: Text (50%) */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left">
            <div className="text-xs font-mono text-[#a8321a] font-semibold">
              04. Tier 4 · 3D Digital Twin &amp; Physical Mitigation
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#0b1b2d] tracking-tight leading-tight">
              Skyward Aerodynamic Deflectors &amp; Evaporative Mist Arches
            </h3>
            <p className="text-sm sm:text-base text-[#1f3044] leading-relaxed">
              Before deploying hardware, municipal engineers simulate 45° upward deflector cowls and high-pressure misting stations in our 60 FPS WebGL Digital Twin—verifying at least a 4.2°C drop in pedestrian breathing-zone temperatures.
            </p>
            <div className="pt-1">
              <Link
                to="/twin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Simulate in 3D Digital Twin</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
