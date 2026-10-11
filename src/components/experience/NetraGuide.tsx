import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

export type TourLanguage = 'en' | 'ta' | 'hi';

interface TourStep {
  step: number;
  totalSteps: number;
  targetPath: string;
  targetAnchor: string;
  badge: string;
  title: string;
  summary: {
    en: string;
    ta: string;
    hi: string;
  };
  audioSpeech: {
    en: string;
    ta: string;
    hi: string;
  };
}

// Guided Tour focused strictly on the 4 screens of the Hero / Landing Page ('/')
const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    totalSteps: 4,
    targetPath: '/',
    targetAnchor: 'wow_hero',
    badge: 'HERO SCREEN 01 · THERMAL CONTRAST LENS',
    title: '20.5°C Indoor Chill vs. 53.6°C Street Exhaust',
    summary: {
      en: 'Move your cursor across the FLIR thermal lens. Commercial buildings stay chilled inside while dumping 53.6°C AC exhaust onto street vendors.',
      ta: 'வணிக வளாகங்கள் உள்ளே 20.5°C குளிரில் இருக்கும்போது, வெளியே சாலையோர வியாபாரிகள் மீது 53.6°C அனல் காற்றை வெளியேற்றுவதை இந்த லென்ஸ் காட்டுகிறது.',
      hi: 'वातानुकूलित इमारतें अंदर 20.5°C पर ठंडी रहती हैं, लेकिन बाहर सड़क विक्रेताओं पर 53.6°C गर्म हवा फेंकती हैं।',
    },
    audioSpeech: {
      en: 'Screen 1: Move your cursor over the thermal lens to see how commercial buildings stay chilled at 20.5 degrees while dumping 53.6 degree exhaust onto street workers.',
      ta: 'படி 1: வணிகக் கட்டிடங்கள் வெளியேற்றும் 53.6 டிகிரி வெப்பக் காற்றை இந்த தெர்மல் லென்ஸ் மூலம் நேரடியாகப் பாருங்கள்.',
      hi: 'चरण 1: थर्मल लेंस पर कर्सर घुमाएं और देखें कि एसी का 53.6 डिग्री निकास सड़क विक्रेताओं को कैसे प्रभावित करता है।',
    },
  },
  {
    step: 2,
    totalSteps: 4,
    targetPath: '/',
    targetAnchor: 'how_it_works_summary',
    badge: 'HERO SCREEN 02 · 4-PILLAR SYSTEM',
    title: 'How Ushma-Netra Works in 4 Crisp Steps',
    summary: {
      en: '1) AI camera counts AC vents, 2) 5m geofence tracks heat plumes, 3) Cart sensor speaks voice alerts, and 4) Polluter fines fund cooling mist.',
      ta: '1) AI கேமரா AC யூனிட்களை கணக்கிடுகிறது, 2) வெப்ப மண்டலத்தைக் கண்காணிக்கிறது, 3) குரல் எச்சரிக்கை தருகிறது, 4) அபராதம் மூலம் குளிர் நீர்த்தெளிப்பு வழங்குகிறது.',
      hi: 'चार आसान चरण: एसी वेंट की गिनती, स्ट्रीट हीट ट्रैकिंग, वेंडर वॉइस अलर्ट और कूलिंग मिस्ट के लिए जुर्माना।',
    },
    audioSpeech: {
      en: 'Screen 2: In four crisp steps, we count AC condensers, map trapped street heat, warn vendors by voice, and bill polluting towers for cooling mist.',
      ta: 'படி 2: நான்கு எளிய படிகளில் ஏசி வெப்பத்தைக் கண்டறிந்து சாலையோர வியாபாரிகளுக்கு குளிர்ச்சியை வழங்குகிறோம்.',
      hi: 'चरण 2: चार आसान चरणों में हम एसी वेंट पहचानते हैं और सड़क को ठंडा करते हैं।',
    },
  },
  {
    step: 3,
    totalSteps: 4,
    targetPath: '/',
    targetAnchor: 'hero_feature_cards',
    badge: 'HERO SCREEN 03 · AWS LIVE MODULES',
    title: '4 Deep-Dive Modules (CV, Beacon, Ledger & 3D Twin)',
    summary: {
      en: 'Each card links directly to a live AWS workspace: Rekognition CV Scanner, IoT Core Cart Sensor, Neptune & Bedrock Ledger, and 3D WebGL Twin.',
      ta: 'ஒவ்வொரு கார்டும் நேரடியாக AI ஸ்கேனர், கார்ட் சென்சார், நெப்டியூன் லெட்ஜர் மற்றும் 3D டிஜிட்டல் ட்வின் பக்கங்களுக்கு அழைத்துச் செல்லும்.',
      hi: 'प्रत्येक कार्ड सीधे लाइव एआई स्कैनर, कार्ट सेंसर, नेप्च्यून लेजर और 3डी डिजिटल ट्विन से जुड़ता है।',
    },
    audioSpeech: {
      en: 'Screen 3: Explore the four visual feature cards covering computer vision, vendor voice beacons, Section 133 legal notices, and 3D cooling actuation.',
      ta: 'படி 3: கணினி பார்வை, குரல் எச்சரிக்கை, சட்ட நோட்டீஸ் மற்றும் 3D கூலிங் ஆகிய நான்கு முக்கிய அம்சங்களை இங்கே காணலாம்.',
      hi: 'चरण 3: यहां चारों लाइव मॉड्यूल—सीवी स्कैनर, वॉइस अलर्ट, डेट लेजर और 3डी ट्विन दिए गए हैं।',
    },
  },
  {
    step: 4,
    totalSteps: 4,
    targetPath: '/',
    targetAnchor: 'hero_street_diagram',
    badge: 'HERO SCREEN 04 · INTERACTIVE STREET MAP',
    title: 'One Street. Four Clickable Hotspots.',
    summary: {
      en: 'Click pins 01 to 04 on the street canyon photo to inspect how AC heat detection, voice alerts, tower billing, and 45° louvers work together.',
      ta: 'படத்தில் உள்ள 01 முதல் 04 வரையிலான புள்ளிகளைக் கிளிக் செய்து, ஒரே தெருவில் இந்த நான்கு படிகளும் எப்படி இணைந்து செயல்படுகின்றன என்பதைப் பாருங்கள்.',
      hi: 'तस्वीर पर 01 से 04 तक के पिन पर क्लिक करके देखें कि पूरी प्रणाली एक साथ कैसे काम करती है।',
    },
    audioSpeech: {
      en: 'Screen 4: Click numbers 1 through 4 directly on the street canyon diagram to see the complete closed-loop cooling workflow.',
      ta: 'படி 4: படத்தில் உள்ள எண்களைக் கிளிக் செய்து முழுமையான செயல்பாட்டை நேரடியாகப் பாருங்கள்.',
      hi: 'चरण 4: स्ट्रीट डायग्राम पर 1 से 4 नंबरों पर क्लिक करके पूरा कूलिंग लूप देखें।',
    },
  },
];

interface NetraGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetraGuide: React.FC<NetraGuideProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<TourLanguage>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const step = TOUR_STEPS[currentStepIndex];

  // Ensure we are on the Hero page ('/') and smoothly scroll to the active section anchor
  useEffect(() => {
    if (!isOpen) return;

    const scrollToHeroSection = () => {
      const el = document.getElementById(step.targetAnchor);
      if (el) {
        const yOffset = -88; // Account for sticky 80px top navbar
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      const timer = window.setTimeout(scrollToHeroSection, 320);
      return () => window.clearTimeout(timer);
    } else {
      const timer = window.setTimeout(scrollToHeroSection, 120);
      return () => window.clearTimeout(timer);
    }
  }, [currentStepIndex, isOpen, step.targetAnchor, location.pathname, navigate]);

  const handlePlaySpeech = () => {
    try {
      if (!('speechSynthesis' in window)) {
        soundEngine.playTone(440, 'sine', 0.2);
        return;
      }

      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();
      const text = step.audioSpeech[selectedLanguage] || step.audioSpeech.en;
      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedLanguage === 'ta') utterance.lang = 'ta-IN';
      else if (selectedLanguage === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-IN';

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
      soundEngine.playTone(660, 'sine', 0.1);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    soundEngine.playTone(520, 'sine', 0.1);
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setCurrentStepIndex(0);
    }
  };

  const handlePrev = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    soundEngine.playTone(380, 'sine', 0.1);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center sm:justify-end p-4 sm:p-6">
      {/* Subtle Backdrop Clickable on Mobile */}
      <div
        onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          onClose();
        }}
        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] pointer-events-auto sm:hidden"
      />

      <div className="relative z-10 pointer-events-auto max-w-md w-full select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="rounded-2xl bg-[#0b1b2d] text-white border-2 border-amber-400 shadow-[0_24px_60px_rgba(11,27,45,0.65)] overflow-hidden flex flex-col">
          {/* Top Header Bar */}
          <div className="px-4 py-3 bg-[#112338] border-b border-slate-700/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Compass className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-1.5 font-bold tracking-wider">
                <span className="text-amber-400">HERO PAGE TOUR</span>
                <span className="text-slate-500">·</span>
                <span className="text-white">
                  SCREEN {step.step} OF {step.totalSteps}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Guided Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Hero Screen Step Dots */}
          <div className="px-4 pt-3 flex items-center justify-between gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-amber-400'
                    : idx < currentStepIndex
                    ? 'bg-emerald-500/70'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Jump to Hero Screen ${s.step}: ${s.title}`}
              />
            ))}
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                {step.badge}
              </span>

              {/* Language Switcher: English, Tamil, Hindi */}
              <div className="flex items-center gap-1 bg-[#071320] p-1 rounded-lg border border-slate-700 text-[11px] font-mono font-semibold">
                {(
                  [
                    { code: 'en', label: 'EN' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'hi', label: 'हिन्दी' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      selectedLanguage === lang.code
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {step.summary[selectedLanguage] || step.summary.en}
            </p>
          </div>

          {/* Action Bar */}
          <div className="px-4 py-3 bg-[#071320] border-t border-slate-700/80 flex items-center justify-between gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={handlePlaySpeech}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
              }`}
              title="Listen to voice narration"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Voice Audio</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous Screen"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Restart' : 'Next Screen'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
