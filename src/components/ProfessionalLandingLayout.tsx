import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Home,
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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener to smoothly transition navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleAudio = () => {
    const state = soundEngine.toggle();
    setAudioActive(state);
  };

  // Dedicated Route Navigation Links for Multi-Endpoint Architecture
  const routeLinks = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/grid', label: 'Thermal Grid', icon: MapPin },
    { path: '/how-it-works', label: 'How It Works', icon: Satellite },
    { path: '/methodology', label: 'Methodology', icon: BookOpen },
    { path: '/watchlist', label: 'Watchlist', icon: Bell },
    { path: '/ledger', label: 'Debt Ledger', icon: Scale },
    { path: '/twin', label: '3D Twin', icon: Box },
    { path: '/scanner', label: 'CV Scanner', icon: Scan },
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
  const showDarkNavbar = isScrolled || !isHomePage;

  const handleReturn = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent text-zinc-100 selection:bg-amber-500/20 selection:text-amber-200 antialiased overflow-x-hidden font-sans">
      {/* Pinned Sticky Header Shell: Always interactive, adapts background when scrolled or on subpages */}
      <div
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          showDarkNavbar
            ? 'bg-[#08080a]/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl'
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        {/* Tactical Marquee Ribbon: Displayed when scrolled or on deeper pages */}
        {showDarkNavbar && (
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

                {/* Cloned Duplicate Track for Seamless Looping */}
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

        {/* Unified Main Navigation Bar */}
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Brand Signature & Return Button */}
            <div className="flex items-center gap-3">
              {/* Return Button if on Subpage */}
              {!isHomePage && (
                <button
                  onClick={handleReturn}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-amber-400 hover:text-amber-300 text-xs font-mono font-medium transition-all cursor-pointer shadow-sm group"
                  title="Return to previous screen"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Return</span>
                </button>
              )}

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
                onClick={() => {
                  if (isHomePage) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`text-sm sm:text-base font-black tracking-wider uppercase font-mono cursor-pointer flex items-center gap-1.5 transition-colors ${
                  showDarkNavbar ? 'text-zinc-100 hover:text-amber-400' : 'text-slate-900 hover:text-amber-700'
                }`}
              >
                <span>USHMA</span>
                <span className="text-amber-500">·</span>
                <span>NETRA</span>
              </Link>

              <span
                className={`hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest pl-2.5 border-l ${
                  showDarkNavbar
                    ? 'text-zinc-500 border-zinc-800'
                    : 'text-slate-500 border-slate-300'
                }`}
              >
                Thermal Equity Grid
              </span>
            </div>

            {/* Desktop Navigation Links with Active State Highlighting */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 text-xs font-mono font-medium">
              {routeLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (link.path === '/' && isHomePage) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? showDarkNavbar
                          ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                          : 'bg-slate-900 text-white font-bold shadow-sm'
                        : showDarkNavbar
                        ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/60'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Controls & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Direct 3D Simulation Twin Launcher */}
              <Link
                to="/twin"
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:shadow-lg ${
                  showDarkNavbar
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold border border-amber-300'
                    : 'bg-slate-950 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Launch Live Twin</span>
                <span className="text-[12px] leading-none">➔</span>
              </Link>

              {onSimulateSurge && (
                <button
                  onClick={onSimulateSurge}
                  className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-mono font-semibold items-center gap-1.5 transition-all cursor-pointer"
                  title="Trigger emergency peak heat surge simulation"
                >
                  <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                </button>
              )}

              {onToggleMitigation && (
                <button
                  onClick={onToggleMitigation}
                  className={`hidden md:flex px-2.5 py-1.5 rounded-lg border text-xs font-medium items-center gap-1.5 transition-all cursor-pointer ${
                    isMitigated
                      ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                      : showDarkNavbar
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      : 'bg-white/80 border-slate-300 text-slate-700 hover:text-slate-950'
                  }`}
                  title="Toggle skyward diversion louvers"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isMitigated ? 'Louvers Active' : 'Mitigate'}</span>
                </button>
              )}

              <button
                onClick={toggleAudio}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  showDarkNavbar
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'bg-white/80 border-slate-300 text-slate-700 hover:text-slate-950'
                }`}
                title="Toggle audio synthesizer sound effects"
              >
                {audioActive ? (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg border cursor-pointer ${
                  showDarkNavbar
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'bg-white/80 border-slate-300 text-slate-700 hover:text-slate-950'
                }`}
                title="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-[#0c0c14] border-t border-zinc-800 px-4 py-4 space-y-3 shadow-2xl">
              {/* Quick Return in Mobile Menu if on Subpage */}
              {!isHomePage && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleReturn();
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Previous Screen</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase">Back</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {routeLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2.5 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                          : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-zinc-850'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-zinc-850 flex items-center justify-between gap-2">
                <Link
                  to="/twin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono text-center flex items-center justify-center gap-1.5"
                >
                  <span>Launch 3D Twin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Main Content Viewport */}
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};
