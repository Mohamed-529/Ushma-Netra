import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoryAct } from './experience/DynamicAtmosphere';
import {
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { NetraGuide } from './experience/NetraGuide';
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
  isIntroRevealed = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
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
  }, [location.pathname]);

  // Minimized, high-legibility core navigation links
  const routeLinks = [
    { path: '/', label: 'Overview' },
    { path: '/grid', label: 'Thermal Grid' },
    { path: '/twin', label: '3D Twin' },
    { path: '/scanner', label: 'CV Scanner' },
    { path: '/ledger', label: 'Debt Ledger' },
  ];

  const isHomePage = location.pathname === '/';
  const headerVisible = !isHomePage || isIntroRevealed;

  return (
    <div className="relative min-h-screen w-full bg-transparent text-[#0b1b2d] selection:bg-amber-900/20 selection:text-[#0b1b2d] antialiased overflow-x-hidden font-sans">
      {/* Clean, Streamlined Top Navigation Header */}
      <div
        className={`sticky top-0 z-50 w-full transition-all duration-1000 ease-out ${
          headerVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        } ${
          isScrolled || !isHomePage
            ? 'bg-[#e6dfd3]/95 backdrop-blur-xl border-b border-[#d6cebe] shadow-[0_4px_20px_rgba(11,27,45,0.05)]'
            : 'bg-transparent border-b border-[#d6cebe]/50'
        }`}
      >
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-8">
            {/* Zone 1: Ushma-Netra Brand Logo + Upper USHMA / Lower NETRA */}
            <Link
              to="/"
              onClick={() => {
                if (isHomePage) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-3.5 group cursor-pointer shrink-0"
            >
              {/* Custom Ushma-Netra Thermal Eye Emblem */}
              <div className="w-11 h-11 rounded-2xl bg-[#0b1b2d] group-hover:bg-[#162d47] border border-[#a8321a]/40 flex items-center justify-center shadow-sm transition-colors shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  {/* Outer Thermal Eye Contour */}
                  <path
                    d="M3 18C6.8 10.5 12 7 18 7C24 7 29.2 10.5 33 18C29.2 25.5 24 29 18 29C12 29 6.8 25.5 3 18Z"
                    stroke="#f59e0b"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Inner Infrared Core */}
                  <circle cx="18" cy="18" r="5.2" fill="#ef4444" />
                  <circle cx="18" cy="18" r="2.2" fill="#fde68a" />
                </svg>
              </div>

              {/* Stacked Brand Typography: Upper USHMA / Lower NETRA */}
              <div className="flex flex-col justify-center leading-none">
                <span className="text-[15px] sm:text-base font-black tracking-[0.12em] text-[#0b1b2d] uppercase">
                  USHMA
                </span>
                <span className="text-xs sm:text-[13px] font-extrabold tracking-[0.24em] text-[#a8321a] uppercase mt-1">
                  NETRA
                </span>
              </div>
            </Link>

            {/* Zone 2: Minimized Navigation Links with Larger Font Size */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[15px] sm:text-base font-semibold">
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
                    className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 border-b-2 ${
                      isActive
                        ? 'text-[#a8321a] border-[#a8321a] font-bold'
                        : 'text-[#0b1b2d]/80 hover:text-[#0b1b2d] border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Single Clean Primary CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(580, 'sine', 0.12);
                  setGuideOpen((prev) => !prev);
                }}
                aria-expanded={guideOpen}
                className={`px-4 py-2.5 rounded-xl font-sans font-semibold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  guideOpen
                    ? 'bg-[#a8321a] hover:bg-[#8e2915] text-white ring-2 ring-amber-400/60'
                    : 'bg-[#0b1b2d] hover:bg-[#1a2f47] text-white'
                }`}
                title="Toggle interactive guided walkthrough tour"
              >
                <Compass className={`w-4 h-4 ${guideOpen ? 'text-white animate-spin' : 'text-amber-400'}`} />
                <span>{guideOpen ? 'Close Tour' : 'Guided Tour'}</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl border border-[#d6cebe] bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] cursor-pointer"
                title="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#efe8dc] border-t border-[#d6cebe] px-4 py-4 space-y-2 shadow-xl">
              <div className="flex flex-col space-y-1 text-base font-semibold">
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
                      className={`px-3.5 py-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#0b1b2d] text-white font-bold'
                          : 'text-[#0b1b2d] hover:bg-[#e4dcce]'
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
