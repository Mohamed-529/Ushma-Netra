import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  ChevronRight,
  Eye,
  ShieldCheck,
  Lock,
  Cpu,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { StoryAct } from './DynamicAtmosphere';

interface Props {
  onNavigateTo: (act: StoryAct) => void;
  onSimulateSurge: () => void;
}

export const GrandFinaleFooter: React.FC<Props> = ({
  onSimulateSurge,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Interactive Glowing Particle Brand Logo Canvas ("USHMA · NETRA") — only active on Hero/Home page
  const logoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isHomePage) return;
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 340);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 900;
      height = canvas.height = 340;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const nodes = Array.from({ length: 75 }, (_, i) => {
      const angle = (i / 75) * Math.PI * 2;
      const radius = 55 + (i % 4) * 28;
      return {
        baseX: width / 2 + Math.cos(angle) * radius * 1.4,
        baseY: height / 2 + Math.sin(angle) * radius * 0.75,
        x: width / 2 + Math.cos(angle) * radius * 1.4,
        y: height / 2 + Math.sin(angle) * radius * 0.75,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: (i % 3) + 1.5,
        color: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#ef4444' : '#38bdf8',
      };
    });

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((n, idx) => {
        const orbitX = width / 2 + Math.cos(t + idx * 0.25) * (80 + (idx % 5) * 32);
        const orbitY = height / 2 + Math.sin(t * 1.2 + idx * 0.25) * (42 + (idx % 4) * 18);

        let targetX = orbitX;
        let targetY = orbitY;

        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            targetX -= (dx / Math.max(dist, 1)) * 35;
            targetY -= (dy / Math.max(dist, 1)) * 35;
          }
        }

        n.x += (targetX - n.x) * 0.06;
        n.y += (targetY - n.y) * 0.06;

        // Draw connecting filaments
        nodes.forEach((other, j) => {
          if (j <= idx) return;
          const dx = n.x - other.x;
          const dy = n.y - other.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - d / 85) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animId);
    };
  }, [isHomePage]);

  const exploreLinks = [
    { label: 'Check a commercial corridor', path: '/scanner' },
    { label: 'Street canyons we track', path: '/grid' },
    { label: 'Which alleys to cool first', path: '/ledger' },
    { label: 'All monitored zones in India', path: '/grid' },
    { label: 'Your heat surge watchlist', path: '/watchlist' },
  ];

  const aboutLinks = [
    { label: 'How it works', path: '/how-it-works' },
    { label: 'How sure is the thermal model?', path: '/methodology' },
    { label: 'How often our sensors are right', path: '/methodology' },
    { label: 'Where the data comes from', path: '/how-it-works' },
  ];

  const securityAndScalabilityItems = [
    {
      icon: Lock,
      title: 'Strict HTTP Security & Sanitization',
      detail:
        'HSTS, X-Content-Type-Options: nosniff, XSS/prototype-pollution deep payload scrubbing, and strict 32KB JSON body limits.',
    },
    {
      icon: ShieldCheck,
      title: 'HMAC-SHA256 Hardware & Legal Signatures',
      detail:
        'Cryptographic token handshakes for ESP32-S3 telemetry packets and signed Section 133 CrPC municipal penalty receipts.',
    },
    {
      icon: Server,
      title: 'Tiered Rate Limiting & Coalescing',
      detail:
        'Sliding-window per-IP token buckets across all endpoints plus in-flight Gemini request deduplication under concurrent load.',
    },
    {
      icon: Cpu,
      title: 'Bounded LRU Cache & ETag Scaling',
      detail:
        'Sub-millisecond 15-minute LRU response caching, HTTP 304 ETag conditional validation, and 12s AbortController timeouts.',
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden font-sans border-t border-sky-300/15 bg-[#12203A]/90 backdrop-blur-lg text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 space-y-12">
        {/* Only Showcase the Interactive Particle Logo Canvas & Small CTA Div on the Home / Hero Page */}
        {isHomePage && (
          <>
            {/* Interactive Glowing Particle Brand Logo Finale */}
            <div className="rounded-3xl bg-[#162847]/90 border border-sky-400/20 shadow-[0_24px_60px_rgba(8,18,38,0.55)] overflow-hidden relative">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />

              <canvas
                ref={logoCanvasRef}
                className="w-full h-[300px] sm:h-[340px] block cursor-crosshair"
              />

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0b1b2d]/90 border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.35)] flex items-center justify-center mb-3">
                  <Eye className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-xs font-mono tracking-[0.28em] text-amber-400 uppercase font-semibold">
                  USHMA
                </div>
                <div className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-0.5">
                  NETRA
                </div>
                <p className="text-xs font-mono text-slate-300 mt-2 max-w-md">
                  Move your cursor across the thermal field · Autonomous Urban Cooling Grid
                </p>
              </div>
            </div>

            {/* Short & Crisp Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#181D23] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Thermal Justice at Ground Level.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Detecting 54°C AC waste heat and turning polluter fines into street cooling.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <Link
                  to="/twin"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Open 3D Twin</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={onSimulateSurge}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Test 54°C Surge</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Security Hardening & Endpoint Scalability Architecture Banner */}
        <div className="rounded-3xl bg-[#161B22] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>ENTERPRISE SECURITY &amp; SCALABILITY ARCHITECTURE</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Zero-Trust API Hardening &amp; High-Throughput Endpoint Scaling
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>HMAC-SHA256 Signed</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold">
                <span>LRU Cached + ETag 304</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                <span>Rate-Limited API</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityAndScalabilityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 rounded-2xl bg-[#1E242C] border border-white/5 space-y-2"
                >
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-white font-sans font-bold text-sm leading-snug">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Four-Column Content Hierarchy on Dark Charcoal Canvas */}
        <div
          className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-slate-300"
        >
          {/* Column 1: Brand Profile & Context */}
          <div className="space-y-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1E242B] group-hover:bg-[#262E37] border border-amber-500/40 flex items-center justify-center shadow-xs transition-colors shrink-0">
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
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-wider text-white uppercase">
                  USHMA
                </span>
                <span className="text-xs font-extrabold tracking-[0.22em] text-amber-400 uppercase mt-0.5">
                  NETRA
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Ushma-Netra is an autonomous micro-thermal equity and AC exhaust restitution grid built for Track 02 (Heat &amp; Water) of the AWS Global Environmental Hackathon.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              We track commercial HVAC waste heat dumping across dense urban street canyons, protecting outdoor vendors with real-time WBGT alerts and statutory cooling restitution.
            </p>
          </div>

          {/* Column 2: Explore - Link Group */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="inline-block text-slate-300 hover:text-amber-400 font-medium underline-offset-4 hover:underline transition-all duration-200 hover:translate-x-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About - Link Group */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              About
            </h3>
            <ul className="space-y-2.5 text-sm">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="inline-block text-slate-300 hover:text-amber-400 font-medium underline-offset-4 hover:underline transition-all duration-200 hover:translate-x-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Data Attributes & Attributions */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">
              Data &amp; Security
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Orbital thermal infrared observations (2019–2026) are ingested from USGS Landsat-9 TIR Band 10 and ESA Sentinel-3 SLSTR via the Registry of Open Data on AWS, calibrated against street-level ESP32-S3 WBGT telemetry nodes.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              All API endpoints enforce strict sliding-window rate limits, HMAC-SHA256 telemetry verification, ETag conditional caching, and request coalescing.
            </p>
            <p className="text-[11px] font-mono text-slate-400 pt-1">
              © 2026 Ushma-Netra Civic Commons · CC BY-NC-SA 4.0 · OpenStreetMap ODbL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
