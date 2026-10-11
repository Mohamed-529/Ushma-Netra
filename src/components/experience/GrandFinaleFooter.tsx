import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { StoryAct } from './DynamicAtmosphere';
import footerBgImg from '../../assets/images/footer_hvac_city_night_1791701051390.jpg';

interface Props {
  onNavigateTo: (act: StoryAct) => void;
  onSimulateSurge: () => void;
}

export const GrandFinaleFooter: React.FC<Props> = () => {
  // Clean Navigation Lists (No Numbers, No Angle Brackets)
  const exploreLinks = [
    { label: 'Thermal Grid Registry', path: '/grid' },
    { label: '3D Street Digital Twin', path: '/twin' },
    { label: 'AI Façade CV Scanner', path: '/scanner' },
    { label: 'Thermal Debt Ledger', path: '/ledger' },
  ];

  const aboutLinks = [
    { label: 'How Ushma-Netra Works', path: '/how-it-works' },
    { label: 'Thermodynamic Methodology', path: '/methodology' },
    { label: 'Street Cooling Impact', path: '/impact' },
    { label: 'SAM Infra Compliance', path: '/admin' },
  ];

  // Crisp Data & Security Items with Micro-Badges
  const dataAndSecurityItems = [
    {
      tag: 'IOT + EVENTBUS',
      text: 'Landsat-9 TIR & ESP32-S3 MQTT (~36ms EventBridge fan-out)',
    },
    {
      tag: 'SPATIAL GRAPH',
      text: '5.0m Location Geofence & Neptune 3-Hop Liability Graph',
    },
    {
      tag: 'AI FIREWALL',
      text: 'Bedrock Guardrails PII/PHI Redaction & Prompt Shield',
    },
    {
      tag: 'ZERO-TRUST',
      text: 'HMAC-SHA256 Hardware Signatures & Token-Bucket Rate Limits',
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden font-sans border-t border-slate-800/80 bg-slate-950">
      {/* Background Urban Imagery Layer: Solid dark left for crisp text, fading smoothly to visible urban HVAC night photography on right */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={footerBgImg}
          alt="Urban commercial district with rooftop HVAC chiller banks"
          className="w-full h-full object-cover object-right md:object-center opacity-75"
        />
        {/* Horizontal & Vertical Masking Layers: Solid left-to-right gradient (like JalRekha/Mapbox) + deep slate-950/92 contrast mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
      </div>

      {/* Full-Bleed Container Block */}
      <div className="relative z-10 w-full bg-slate-950/70 backdrop-blur-[2px] py-16 px-8">
        {/* 4-Column Grid Framework on Desktop Viewports */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {/* Column 1: Brand Profile & Location Box */}
          <div>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-3 group cursor-pointer mb-5"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-amber-500/50 flex items-center justify-center transition-colors shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    d="M3 18C6.8 10.5 12 7 18 7C24 7 29.2 10.5 33 18C29.2 25.5 24 29 18 29C12 29 6.8 25.5 3 18Z"
                    stroke="#f59e0b"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="18" cy="18" r="5.2" fill="#ef4444" />
                  <circle cx="18" cy="18" r="2.2" fill="#fde68a" />
                </svg>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-sm font-bold text-white tracking-wider uppercase block leading-none">
                  USHMA NETRA
                </span>
                <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase block mt-1">
                  THERMAL EQUITY GRID
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              Autonomous urban micro-climate liability and street cooling platform turning commercial AC exhaust surcharges into 45° skyward louvers and 70-bar misting relief.
            </p>

            {/* Location Box Grouped Neatly at the Bottom */}
            <div className="border border-slate-800 bg-slate-900/50 p-4 rounded-xl mt-4">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Headquarters &amp; Field Lab</span>
              </div>
              <div className="text-sm font-semibold text-white">
                Kundrathur, Chennai
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Tamil Nadu, India
              </div>
            </div>
          </div>

          {/* Column 2: Explore (Clean Vertically Stacked Link Tree — No Numbers or Brackets) */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              Explore
            </h3>
            <nav aria-label="Explore platform tools">
              {exploreLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-slate-400 text-sm hover:text-white transition-colors duration-200 block mb-3.5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: About (Clean Vertically Stacked Link Tree — No Numbers or Brackets) */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              About
            </h3>
            <nav aria-label="About Ushma-Netra">
              {aboutLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-slate-400 text-sm hover:text-white transition-colors duration-200 block mb-3.5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Data & Security (Thin Inline Vector Graphics & Micro-Badges) */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              Data &amp; Security
            </h3>
            <ul className="space-y-3.5">
              {dataAndSecurityItems.map((item) => (
                <li key={item.tag} className="flex items-start gap-2.5">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1.5L13.5 4V8.2C13.5 11.4 11.15 13.85 8 14.5C4.85 13.85 2.5 11.4 2.5 8.2V4L8 1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.75 8.25L7.25 9.75L10.5 6.5"
                      stroke="#34d399"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    <span className="inline-block px-1.5 py-0.5 mr-1.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px] font-semibold uppercase tracking-wide">
                      {item.tag}
                    </span>
                    <span className="text-slate-300">{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* System Metadata & Corporate Copyright Row */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-slate-900 text-xs text-slate-500">
          <div>
            © 2026 Ushma-Netra. All Rights Reserved. · Kundrathur, Chennai, Tamil Nadu, India.
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] rounded-full uppercase">
              AWS Serverless ($0.00/hr Idle)
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              CC BY-NC-SA 4.0 · OpenStreetMap ODbL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
