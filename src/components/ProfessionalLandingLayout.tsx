import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StoryAct } from './experience/DynamicAtmosphere';
import { soundEngine } from '../utils/audioSynthesizer';
import {
  Flame,
  Volume2,
  VolumeX,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Layers,
  MapPin,
  Satellite,
  BookOpen,
  Bell,
  Scale,
  Box,
  Scan
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePresetName?: string;
  isHardwareConnected?: boolean;
  activeAct?: StoryAct;
  onNavigateTo?: (act: StoryAct) => void;
  onSimulateSurge?: () => void;
  isSurgeActive?: boolean;
  isMitigated?: boolean;
  onToggleMitigation?: () => void;
  onConnectHardware?: () => void;
}

export const ProfessionalLandingLayout: React.FC<LayoutProps> = ({
  children,
  activeAct = 'wow_hero',
  onNavigateTo,
  onSimulateSurge,
  isSurgeActive = false,
  isMitigated = false,
  onToggleMitigation,
}) => {
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleAudio = () => {
    const state = soundEngine.toggle();
    setAudioActive(state);
  };

  // Dedicated Route Navigation Links for Multi-Endpoint Architecture
  const routeLinks = [
    { path: '/', label: 'Overview' },
    { path: '/grid', label: 'Thermal Grid' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/methodology', label: 'Methodology' },
    { path: '/watchlist', label: 'Watchlist' },
    { path: '/ledger', label: 'Debt Ledger' },
    { path: '/twin', label: '3D Twin' },
    { path: '/scanner', label: 'CV Scanner' },
  ];

  const telemetryItems = [
    { id: '1', badge: 'LIVE TELEMETRY', text: 'REAL-TIME EDGE SENSOR INGESTION ACTIVE', color: 'text-red-400', isLive: true },
    { id: '2', badge: 'EXHAUST PLUMES', text: '55.4°C JET ANTHROPOGENIC HEAT DUMP MONITORED', color: 'text-amber-400' },
    { id: '3', badge: 'EQUITY THRESHOLD', text: '14 STREET VENDORS IN CRITICAL WBGT EXPOSURE ZONE', color: 'text-rose-400' },
    { id: '4', badge: 'SURCHARGE AGENT', text: 'AUTONOMOUS SECTION 133 CIVIC SURCHARGES ACTIVE', color: 'text-sky-400' },
    { id: '5', badge: 'AWS CLOUD', text: 'IOT CORE MQTT & BEDROCK AUDIT AGENTS ONLINE', color: 'text-emerald-400' },
    { id: '6', badge: '3D CFD TWIN', text: 'PHYSICS-INFORMED TURBULENCE SIMULATION AT 60 FPS', color: 'text-purple-400' },
    { id: '7', badge: 'HARDWARE MESH', text: 'ESP32 LoRaWAN NODES (99.98% PACKET INTEGRITY)', color: 'text-cyan-400' },
    { id: '8', badge: 'HEAT OFFSETS', text: 'MICRO-THERMAL EQUITY CREDITS DISTRIBUTING LIVE', color: 'text-emerald-300' },
    { id: '9', badge: 'AWS TIMESTREAM', text: '12ms INGESTION LATENCY ACROSS CLOUD EDGES', color: 'text-zinc-300' },
  ];

  const isHomePage = location.pathname === '/';
  const isAtHero = isHomePage && activeAct === 'wow_hero';

  return (
    <div className="relative min-h-screen w-full bg-transparent text-zinc-100 selection:bg-amber-500/20 selection:text-amber-200 antialiased overflow-x-hidden font-sans">
      {/* Pinned Sticky Shell: When at top of Hero, render clean borderless transparent navbar overlay */}
      <div
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isAtHero
            ? 'bg-transparent border-none shadow-none backdrop-blur-none'
            : 'bg-[#08080a]/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl'
        }`}
      >
        {/* Tactical Marquee Ribbon: Hidden or minimized on Hero fold if requested for ultra-clean header, visible on deeper sections */}
        {!isAtHero && (
          <div className="w-full bg-[#08080a] border-b border-zinc-800/80 text-[11px] font-mono py-1.5 px-0 overflow-hidden flex items-center justify-between text-zinc-300 select-none relative">
            <div className="flex-1 overflow-hidden relative marquee-mask">
              <div className="flex w-max animate-marquee">
                {/* Primary Track */}
                <div className="flex items-center gap-6 shrink-0 pr-6">
                  {telemetryItems.map((item) => (
                    <div key={`track-a-${item.id}`} className="flex items-center gap-2 shrink-0">
                      {item.isLive && (
                        <span className="relative flex h-2 w-2 mr-0.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                      <span className={`font-bold tracking-wider ${item.color}`}>
                        {item.badge}
                      </span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-200 font-medium">{item.text}</span>
                      <span className="text-zinc-700 ml-4 font-bold">✦</span>
                    </div>
                  ))}
                </div>

                {/* Cloned Duplicate Track for 100% Mathematically Seamless Snake Looping */}
                <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
                  {telemetryItems.map((item) => (
                    <div key={`track-b-${item.id}`} className="flex items-center gap-2 shrink-0">
                      {item.isLive && (
                        <span className="relative flex h-2 w-2 mr-0.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                      <span className={`font-bold tracking-wider ${item.color}`}>
                        {item.badge}
                      </span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-200 font-medium">{item.text}</span>
                      <span className="text-zinc-700 ml-4 font-bold">✦</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Static Low-Latency Telemetry Badge on Right */}
            <div className="hidden lg:flex items-center gap-3 shrink-0 font-mono text-[10px] text-zinc-400 px-4 border-l border-zinc-800/80 bg-[#08080a] z-10 shadow-[-10px_0_15px_rgba(8,8,10,0.9)]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LATENCY: 12ms
              </span>
              <span className="text-zinc-700">·</span>
              <span className="text-emerald-400 font-bold">AWS APPSYNC: ONLINE</span>
            </div>
          </div>
        )}

        {/* Sleek Header Navigation - When isAtHero is true, hidden here because WowHero contains the ultra-clean single transparent navbar requested */}
        {!isAtHero && (
          <header className="w-full transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Brand Signature */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSurgeActive ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isSurgeActive ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <Link
                to="/"
                className="text-sm font-black tracking-wider text-zinc-100 hover:text-amber-400 transition-colors uppercase font-mono cursor-pointer flex items-center gap-1.5"
              >
                USHMA<span className="text-amber-500">·</span>NETRA
              </Link>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-zinc-500 pl-2.5 border-l border-zinc-800">
                Civic Heat Grid
              </span>
            </div>

            {/* Desktop Navigation Links with Active State Highlighting */}
            <nav className="hidden xl:flex items-center gap-4 text-xs font-mono font-medium text-zinc-400">
              {routeLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`transition-colors py-1 cursor-pointer ${
                      isActive
                        ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                        : 'hover:text-zinc-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Controls & Mobile Menu Button */}
            <div className="flex items-center gap-2.5">
              {/* Direct 3D Simulation Drill Launcher */}
              <Link
                to="/twin"
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 text-xs font-black font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20 border border-amber-300"
              >
                <span>3D DRILL</span>
                <span className="text-[13px] leading-none">➔</span>
              </Link>

              {onSimulateSurge && (
                <button
                  onClick={onSimulateSurge}
                  className="hidden sm:flex px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-mono font-semibold items-center gap-1.5 transition-all cursor-pointer"
                  title="Trigger emergency peak heat surge"
                >
                  <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                </button>
              )}

              {onToggleMitigation && (
                <button
                  onClick={onToggleMitigation}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMitigated
                      ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Toggle skyward diversion louvers"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{isMitigated ? 'Louvers Active' : 'Engage'}</span>
                </button>
              )}

              <button
                onClick={toggleAudio}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Toggle audio synthesizer"
              >
                {audioActive ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                title="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="xl:hidden bg-[#0c0c14] border-t border-zinc-800 px-4 py-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {routeLinks.map((link) => {
                  const isActive =
                    link.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                          : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                </div>
              </div>
            )}
          </header>
        )}
      </div>

      {/* Main Content Viewport */}
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};
