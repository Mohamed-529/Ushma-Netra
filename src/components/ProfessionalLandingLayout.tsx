import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoryAct } from './experience/DynamicAtmosphere';
import {
  Menu,
  X,
  Compass,
  ChevronDown,
  MapPin,
  Box,
  Scan,
  Scale,
} from 'lucide-react';
import { NetraGuide } from './experience/NetraGuide';
import { GrandFinaleFooter } from './experience/GrandFinaleFooter';
import { soundEngine } from '../utils/audioSynthesizer';

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
  onNavigateTo = () => {},
  onSimulateSurge = () => {},
  isIntroRevealed = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  }, [location.pathname]);

  // Close Tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // The 4 Tools inside the "Tools" Select Menu
  const toolOptions = [
    {
      path: '/grid',
      label: 'Thermal Grid',
      sub: 'Live street heat map & 10 zone cards',
      icon: MapPin,
    },
    {
      path: '/twin',
      label: '3D Twin',
      sub: '3D street cooling & ESP32 cart sensor',
      icon: Box,
    },
    {
      path: '/scanner',
      label: 'CV Scanner',
      sub: 'AI camera counting outdoor AC units',
      icon: Scan,
    },
    {
      path: '/ledger',
      label: 'Debt Ledger',
      sub: 'Building heat fines & cooling fund',
      icon: Scale,
    },
  ];

  const isHomePage = location.pathname === '/';
  const isToolRouteActive = toolOptions.some((t) => location.pathname.startsWith(t.path));
  const isAlertRouteActive =
    location.pathname.startsWith('/watchlist') || location.pathname.startsWith('/alerts');
  const isImpactRouteActive = location.pathname.startsWith('/impact');

  const headerVisible = !isHomePage || isIntroRevealed;

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white selection:bg-amber-500/30 selection:text-white antialiased overflow-x-clip font-sans flex flex-col justify-between">
      {/* Global Sticky Top Navigation Header (Present on Every Page) */}
      <div
        className={`sticky top-0 z-50 w-full transition-all duration-1000 ease-out ${
          headerVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        } ${
          isScrolled || !isHomePage
            ? 'bg-[#12161A]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
            : 'bg-[#12161A]/80 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-8">
            {/* Zone 1: Ushma-Netra Brand Logo */}
            <Link
              to="/"
              onClick={() => {
                if (isHomePage) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-3.5 group cursor-pointer shrink-0"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#1E242B] group-hover:bg-[#262E37] border border-amber-500/40 flex items-center justify-center shadow-sm transition-colors shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
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

              <div className="flex flex-col justify-center leading-none">
                <span className="text-[15px] sm:text-base font-black tracking-[0.12em] text-white uppercase">
                  USHMA
                </span>
                <span className="text-xs sm:text-[13px] font-extrabold tracking-[0.24em] text-amber-400 uppercase mt-1">
                  NETRA
                </span>
              </div>
            </Link>

            {/* Zone 2: Clean 4-Item Navbar: 1. Big Picture | 2. Tools (Select Dropdown) | 3. Alert | 4. Impact */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] sm:text-base font-semibold">
              {/* 1. Big Picture (Replaces generic "Overview") */}
              <Link
                to="/"
                onClick={() => {
                  if (isHomePage) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 border-b-2 ${
                  isHomePage
                    ? 'text-amber-400 border-amber-400 font-bold'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                Big Picture
              </Link>

              {/* 2. Tools (Dropdown Select with Thermal Grid, 3D Twin, CV Scanner, Debt Ledger) */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setToolsDropdownOpen((prev) => !prev)}
                  aria-expanded={toolsDropdownOpen}
                  className={`py-1 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 border-b-2 ${
                    isToolRouteActive || toolsDropdownOpen
                      ? 'text-amber-400 border-amber-400 font-bold'
                      : 'text-slate-300 hover:text-white border-transparent'
                  }`}
                >
                  <span>Tools</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 pointer-events-none ${
                      toolsDropdownOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-2xl p-2 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#a8321a] font-bold">
                      Select Platform Tool
                    </div>
                    <div className="space-y-1">
                      {toolOptions.map((tool) => {
                        const Icon = tool.icon;
                        const active = location.pathname.startsWith(tool.path);
                        return (
                          <Link
                            key={tool.path}
                            to={tool.path}
                            onClick={() => setToolsDropdownOpen(false)}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                              active
                                ? 'bg-[#111827] text-white'
                                : 'text-[#111827] hover:bg-[#F3F4F6]'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                active
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-[#F3F4F6] text-[#a8321a]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold leading-tight">{tool.label}</div>
                              <div
                                className={`text-xs mt-0.5 ${
                                  active ? 'text-slate-300' : 'text-[#4B5563]'
                                }`}
                              >
                                {tool.sub}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Alert (Navigates to Multilingual Vendor SMS & Voice Alert Page) */}
              <Link
                to="/watchlist"
                className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 border-b-2 ${
                  isAlertRouteActive
                    ? 'text-amber-400 border-amber-400 font-bold'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                Alert
              </Link>

              {/* 4. Impact (Navigates to the Simple Feel-Good Impact Page) */}
              <Link
                to="/impact"
                className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 border-b-2 ${
                  isImpactRouteActive
                    ? 'text-amber-400 border-amber-400 font-bold'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                Impact
              </Link>
            </nav>

            {/* Zone 3: Guided Tour CTA + Mobile Menu Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(580, 'sine', 0.12);
                  setGuideOpen((prev) => !prev);
                }}
                aria-expanded={guideOpen}
                className={`px-4 py-2.5 rounded-xl font-sans font-semibold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  guideOpen
                    ? 'bg-[#a8321a] hover:bg-[#8e2915] text-white ring-2 ring-amber-400/60'
                    : 'bg-white hover:bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]'
                }`}
                title="Toggle interactive guided walkthrough tour"
              >
                <Compass
                  className={`w-4 h-4 pointer-events-none ${
                    guideOpen ? 'text-white animate-spin' : 'text-[#a8321a]'
                  }`}
                />
                <span className="pointer-events-none">
                  {guideOpen ? 'Close Tour' : 'Guided Tour'}
                </span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl border border-white/10 bg-[#1E242B] hover:bg-[#262E37] text-white cursor-pointer"
                title="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#181D23] border-t border-white/10 px-4 py-4 space-y-3 shadow-2xl">
              <div className="flex flex-col space-y-1 text-base font-semibold">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl transition-colors ${
                    isHomePage
                      ? 'bg-amber-400 text-[#111827] font-bold'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  Big Picture
                </Link>

                {/* Mobile Tools Group */}
                <div className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#a8321a] font-bold pb-1">
                    Tools (4)
                  </div>
                  {toolOptions.map((tool) => {
                    const active = location.pathname.startsWith(tool.path);
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          active
                            ? 'bg-[#111827] text-white font-bold'
                            : 'text-[#111827] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        {tool.label}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  to="/watchlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl transition-colors ${
                    isAlertRouteActive
                      ? 'bg-amber-400 text-[#111827] font-bold'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  Alert
                </Link>

                <Link
                  to="/impact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl transition-colors ${
                    isImpactRouteActive
                      ? 'bg-amber-400 text-[#111827] font-bold'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  Impact
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Main Content Viewport */}
      <main className="relative z-10 w-full flex-1 text-white">
        {children}
      </main>

      {/* Global Footer Present on Every Single Page */}
      <div
        className={`relative z-10 w-full transition-opacity duration-1000 ${
          headerVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <GrandFinaleFooter
          onNavigateTo={onNavigateTo}
          onSimulateSurge={onSimulateSurge}
        />
      </div>

      {/* Floating 10-Step Interactive Netra Guide */}
      <NetraGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
