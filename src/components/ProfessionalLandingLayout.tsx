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
  Box,
  Scan,
  Scale,
  Compass,
  Download,
} from 'lucide-react';
import { NetraGuide } from './experience/NetraGuide';
import { CustomFloatingCursor } from './experience/CustomFloatingCursor';

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
  isIntroRevealed?: boolean;
  onDownloadPlatformBrief?: () => void;
}

export const ProfessionalLandingLayout: React.FC<LayoutProps> = ({
  children,
  onSimulateSurge,
  isSurgeActive = false,
  isMitigated = false,
  onToggleMitigation,
  isIntroRevealed = true,
  onDownloadPlatformBrief,
}) => {
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
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
    { id: '1', badge: 'LIVE TELEMETRY', text: 'REAL-TIME EDGE SENSOR INGESTION ACTIVE', color: 'text-red-700', isLive: true },
    { id: '2', badge: 'EXHAUST PLUMES', text: '55.4°C JET ANTHROPOGENIC HEAT DUMP MONITORED', color: 'text-amber-800' },
    { id: '3', badge: 'EQUITY THRESHOLD', text: '14 STREET VENDORS IN CRITICAL WBGT EXPOSURE ZONE', color: 'text-rose-800' },
    { id: '4', badge: 'SURCHARGE AGENT', text: 'AUTONOMOUS SECTION 133 CIVIC SURCHARGES ACTIVE', color: 'text-sky-800' },
    { id: '5', badge: 'AWS CLOUD', text: 'IOT CORE MQTT & BEDROCK AUDIT AGENTS ONLINE', color: 'text-emerald-800' },
    { id: '6', badge: '3D CFD TWIN', text: 'PHYSICS-INFORMED TURBULENCE SIMULATION AT 60 FPS', color: 'text-purple-800' },
    { id: '7', badge: 'HARDWARE MESH', text: 'ESP32 LoRaWAN NODES (99.98% PACKET INTEGRITY)', color: 'text-cyan-800' },
    { id: '8', badge: 'HEAT OFFSETS', text: 'MICRO-THERMAL EQUITY CREDITS DISTRIBUTING LIVE', color: 'text-emerald-800' },
    { id: '9', badge: 'AWS TIMESTREAM', text: '12ms INGESTION LATENCY ACROSS CLOUD EDGES', color: 'text-slate-800' },
  ];

  const isHomePage = location.pathname === '/';
  const headerVisible = !isHomePage || isIntroRevealed;

  const handleReturn = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleDownloadClick = () => {
    if (onDownloadPlatformBrief) {
      onDownloadPlatformBrief();
      return;
    }
    const content = `USHMA-NETRA // NEXT-GEN AUTONOMOUS THERMAL EQUITY AGENT PLATFORM
===================================================================
Generated: ${new Date().toISOString()}
Monitored Urban Heat Canyons: 10 Zones (Delhi NCR, Mumbai, Bengaluru, Ahmedabad)
Primary Telemetry: Landsat-9 TIR + Edge YOLOv8 + AWS IoT Core + Amazon Bedrock
Statutory Compliance: Section 133 CrPC Municipal Heat Surcharge Ledger
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ushma-netra-agent-platform-spec.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent text-[#0b1b2d] selection:bg-amber-900/20 selection:text-[#0b1b2d] antialiased overflow-x-hidden font-sans">
      {/* Smooth Custom Floating Cursor (translate3d + requestAnimationFrame + pointer-events: none) */}
      <CustomFloatingCursor />

      {/* Pinned Sticky Header Shell: Hidden at opacity-0 during initial hero typewriter on Home page */}
      <div
        className={`sticky top-0 z-50 w-full transition-all duration-1000 ease-out ${
          headerVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        } ${
          isScrolled || !isHomePage
            ? 'bg-[#e6dfd3]/95 backdrop-blur-xl border-b border-[#d6cebe] shadow-[0_4px_20px_rgba(11,27,45,0.06)]'
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        {/* Tactical Marquee Ribbon */}
        <div className="w-full bg-[#dfd7c9] border-b border-[#d6cebe] text-[11px] font-mono py-1.5 px-0 overflow-hidden flex items-center justify-between text-[#0b1b2d] select-none relative">
          <div className="flex-1 overflow-hidden relative marquee-mask">
            <div className="flex w-max animate-marquee">
              {/* Primary Track */}
              <div className="flex items-center gap-6 shrink-0 pr-6">
                {telemetryItems.map((item) => (
                  <div key={`track-a-${item.id}`} className="flex items-center gap-2 shrink-0">
                    {item.isLive && (
                      <span className="relative flex h-2 w-2 mr-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                      </span>
                    )}
                    <span className={`font-bold tracking-wider ${item.color}`}>
                      {item.badge}
                    </span>
                    <span className="text-[#0b1b2d]/40">/</span>
                    <span className="text-[#0b1b2d] font-semibold">{item.text}</span>
                    <span className="text-[#0b1b2d]/40 ml-4 font-bold">✦</span>
                  </div>
                ))}
              </div>

              {/* Cloned Duplicate Track for Seamless Looping */}
              <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
                {telemetryItems.map((item) => (
                  <div key={`track-b-${item.id}`} className="flex items-center gap-2 shrink-0">
                    {item.isLive && (
                      <span className="relative flex h-2 w-2 mr-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                      </span>
                    )}
                    <span className={`font-bold tracking-wider ${item.color}`}>
                      {item.badge}
                    </span>
                    <span className="text-[#0b1b2d]/40">/</span>
                    <span className="text-[#0b1b2d] font-semibold">{item.text}</span>
                    <span className="text-[#0b1b2d]/40 ml-4 font-bold">✦</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Static Low-Latency Telemetry Badge on Right */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 font-mono text-[10px] text-[#0b1b2d]/80 px-4 border-l border-[#d6cebe] bg-[#dfd7c9] z-10">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              LATENCY: 12ms
            </span>
            <span className="text-[#0b1b2d]/30">·</span>
            <span className="text-emerald-800 font-bold">AWS IOT: VERIFIED</span>
          </div>
        </div>

        {/* Unified Main Navigation Bar */}
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Brand Signature & Return Button */}
            <div className="flex items-center gap-3">
              {!isHomePage && (
                <button
                  onClick={handleReturn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] text-xs font-mono font-bold transition-all cursor-pointer shadow-sm group"
                  title="Return to previous screen"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Return</span>
                </button>
              )}

              <Link
                to="/"
                onClick={() => {
                  if (isHomePage) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="text-base sm:text-lg font-black tracking-wider uppercase font-mono cursor-pointer flex items-center gap-1 text-[#0b1b2d] hover:text-[#a8321a] transition-colors whitespace-nowrap shrink-0"
              >
                <span>USHMA</span>
                <span className="text-[#a8321a]">·</span>
                <span>NETRA</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-mono font-semibold">
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
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#0b1b2d] text-white font-bold shadow-sm'
                        : 'text-[#0b1b2d]/75 hover:text-[#0b1b2d] hover:bg-[#ded5c6]/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Controls & Top-Right Download Button */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                onClick={handleDownloadClick}
                className="px-4 py-1.5 rounded-full bg-[#0b1b2d] hover:bg-[#1a2d42] text-white font-sans font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                title="Download Platform Specification & Audit Package"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Download</span>
              </button>

              {/* Interactive Netra Guide 10-Step Tour Button */}
              <button
                onClick={() => setGuideOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
                title="Launch 10-step audio & scroll interactive walkthrough tour"
              >
                <Compass className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              {onSimulateSurge && (
                <button
                  onClick={onSimulateSurge}
                  className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 border border-red-300 text-red-800 text-xs font-mono font-bold items-center gap-1.5 transition-all cursor-pointer"
                  title="Trigger emergency peak heat surge simulation"
                >
                  <Flame className="w-3.5 h-3.5 text-red-700" />
                </button>
              )}

              {onToggleMitigation && (
                <button
                  onClick={onToggleMitigation}
                  className={`hidden xl:flex px-2.5 py-1.5 rounded-xl border text-xs font-bold font-mono items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isMitigated
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-[#efe8dc] border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
                  }`}
                  title="Toggle skyward diversion louvers"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isMitigated ? 'Louvers Active' : 'Mitigate'}</span>
                </button>
              )}

              <button
                onClick={toggleAudio}
                className="p-2 rounded-xl border border-[#d6cebe] bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] transition-colors cursor-pointer"
                title="Toggle audio synthesizer sound effects"
              >
                {audioActive ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#a8321a]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#0b1b2d]/60" />
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-[#d6cebe] bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] cursor-pointer"
                title="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-[#efe8dc] border-t border-[#d6cebe] px-4 py-4 space-y-3 shadow-xl">
              {!isHomePage && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleReturn();
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[#0b1b2d] font-mono text-xs font-bold flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Previous Screen</span>
                  </span>
                  <span className="text-[10px] text-[#0b1b2d]/60 uppercase">Back</span>
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
                      className={`p-2.5 rounded-xl transition-colors flex items-center gap-2 font-bold ${
                        isActive
                          ? 'bg-[#0b1b2d] text-white shadow-sm'
                          : 'bg-[#f5efe6] text-[#0b1b2d] hover:bg-[#e4dcce] border border-[#d6cebe]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#d6cebe] flex items-center justify-between gap-2">
                <Link
                  to="/twin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2d42] text-white font-bold text-xs font-mono text-center flex items-center justify-center gap-1.5 shadow-sm"
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
      <main className="relative z-10 w-full text-[#0b1b2d]">
        {children}
      </main>

      {/* Floating 10-Step Interactive Netra Guide */}
      <NetraGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
