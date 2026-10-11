import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  MapPin,
  Box,
  Scan,
  Scale,
  Bell,
  HeartHandshake,
  Globe,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

export type TourLanguage = 'en' | 'ta' | 'hi';

interface TourStep {
  step: number;
  totalSteps: number;
  targetPath: string;
  targetAnchor?: string;
  badge: string;
  title: string;
  screenName: string;
  icon: React.ComponentType<{ className?: string }>;
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

// Complete 7-Screen Guided Tour covering every core workspace of Ushma-Netra
const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    totalSteps: 7,
    targetPath: '/',
    targetAnchor: 'wow_hero',
    badge: '01 · BIG PICTURE & MISSION',
    title: '20.5°C Indoor Chill vs. 53.6°C Street Vendor Plumes',
    screenName: 'Big Picture',
    icon: Globe,
    summary: {
      en: 'Commercial towers stay chilled inside while dumping superheated 53.6°C AC exhaust onto informal street vendors. Ushma-Netra creates the first autonomous thermal equity grid to track and remediate anthropogenic street heat.',
      ta: 'வணிக வளாகங்கள் உள்ளே 20.5°C குளிரில் இருக்கும்போது, வெளியே சாலையோர வியாபாரிகள் மீது 53.6°C அனல் காற்றை வெளியேற்றுகின்றன. உஷ்மா நேத்ரா இதன் மூலம் வெப்ப நீதியை நிலைநாட்டுகிறது.',
      hi: 'वातानुकूलित इमारतें अंदर ठंडी रहती हैं, लेकिन बाहर सड़क विक्रेताओं पर 53.6°C गर्म निकास फेंकती हैं। उष्मा-नेत्र इस कृत्रिम गर्मी को ट्रैक करके न्याय दिलाता है।',
    },
    audioSpeech: {
      en: 'Step 1, Big Picture: Commercial towers stay chilled inside while dumping 53.6 degree AC exhaust onto street workers. Ushma-Netra tracks and remediates this artificial street heat.',
      ta: 'படி 1, பிக் பிக்சர்: வணிகக் கட்டிடங்கள் வெளியேற்றும் 53.6 டிகிரி வெப்பக் காற்றால் பாதிக்கப்படும் சாலையோரத் தொழிலாளர்களுக்கு உஷ்மா நேத்ரா வெப்ப நீதியை வழங்குகிறது.',
      hi: 'चरण 1, बिग पिक्चर: इमारतें अंदर ठंडी रहती हैं लेकिन बाहर 53.6 डिग्री गर्मी फेंकती हैं। उष्मा-नेत्र इस समस्या का समाधान करता है।',
    },
  },
  {
    step: 2,
    totalSteps: 7,
    targetPath: '/grid',
    badge: '02 · NATIONAL THERMAL GRID',
    title: 'Satellite Radiance & Amazon Location 5m Geofencing',
    screenName: 'Thermal Grid',
    icon: MapPin,
    summary: {
      en: 'Ingests orbital Landsat-9 TIR thermal infrared radiance across Delhi, Mumbai, and Chennai. Amazon Location Service monitors 5-meter micro-geofences to detect vendor carts trapped inside dangerous commercial exhaust jets.',
      ta: 'சாட்டிலைட் இன்ஃப்ராரெட் தரவுகள் மற்றும் அமேசான் லொகேஷன் 5 மீட்டர் எல்லை கண்காணிப்பு மூலம் நகரங்களின் தீவிர வெப்ப அனல் மண்டலங்களை வரைபடத்தில் நேரலையாகக் காட்டுகிறது.',
      hi: 'उपग्रह थर्मल डेटा और अमेज़ॅन लोकेशन 5-मीटर जियोफेंसिंग के ज़रिये दिल्ली और अन्य शहरों के 50 डिग्री वाले हॉटस्पॉट और वेंडर कार्ट्स को ट्रैक करता है।',
    },
    audioSpeech: {
      en: 'Step 2, Thermal Grid: Satellite infrared radiance combined with Amazon Location 5-meter geofences flags vendor carts trapped inside dangerous AC exhaust jets.',
      ta: 'படி 2, தெர்மல் கிரிட்: சாட்டிலைட் தரவுகள் மற்றும் 5 மீட்டர் ஜியோஃபென்ஸ் மூலம் ஏசி அனல் மண்டலத்தில் சிக்கியுள்ள வியாபாரிகளை அடையாளம் காண்கிறது.',
      hi: 'चरण 2, थर्मल ग्रिड: सैटेलाइट डेटा और 5-मीटर जियोफेंसिंग से एसी निकास के जाल में फंसे वेंडरों की पहचान होती है।',
    },
  },
  {
    step: 3,
    totalSteps: 7,
    targetPath: '/twin',
    badge: '03 · 3D CFD DIGITAL TWIN & HARDWARE RIG',
    title: 'Street Plume Physics, ESP32 USB Rig & AirPods Alert',
    screenName: '3D Twin',
    icon: Box,
    summary: {
      en: 'Real-time 3D Eulerian CFD engine modeling waste heat stagnation in narrow street canyons. Connects directly to your physical ESP32 via USB (115200 bps), routes voice alerts to AirPods, and tests 45° upward cooling louvers.',
      ta: 'தெருக்களில் வெப்பக் காற்று சுழற்சியை காட்டும் 3D டிஜிட்டல் ட்வின். உங்கள் ESP32 வன்பொருளுடன் நேரடியாக இணைந்து, ஏர்போட்ஸ் குரல் எச்சரிக்கை மற்றும் 45° கூலிங் லூவர்களை இயக்குகிறது.',
      hi: '3D डिजिटल ट्विन गलियों में फंसी गर्मी का सिमुलेशन करता है। आपके ईएसपी32 हार्डवेयर से सीधे जुड़कर एयरपॉड्स वॉयस अलर्ट और कूलिंग सिस्टम सक्रिय करता है।',
    },
    audioSpeech: {
      en: 'Step 3, 3D Digital Twin: Real-time particle aerodynamics model heat stagnation. Connect your ESP32 board over USB to stream live sensor readings and trigger 45-degree cooling louvers.',
      ta: 'படி 3, 3D டிஜிட்டல் ட்வின்: தெருக்களில் வெப்பப் பரவலை நேரடியாகப் பாருங்கள். உங்கள் ESP32 போர்டை இணைத்து நேரலை சென்சார் தரவுகள் மற்றும் குளிர்ச்சியை சோதிக்கலாம்.',
      hi: 'चरण 3, 3D डिजिटल ट्विन: गर्म हवा का 3D मॉडल। अपने ईएसपी32 बोर्ड को यूएसबी से जोड़कर लाइव सेंसर डेटा और कूलिंग सिस्टम की जांच करें।',
    },
  },
  {
    step: 4,
    totalSteps: 7,
    targetPath: '/scanner',
    badge: '04 · AI FAÇADE CV SCANNER',
    title: 'Edge Computer Vision AC Unit Detection & Surcharge',
    screenName: 'CV Scanner',
    icon: Scan,
    summary: {
      en: 'Autonomous computer vision models audit commercial building façades: counting split units, VRF banks, and rooftop chillers. Computes sensible heat in kW and assesses statutory monthly municipal restoration surcharges.',
      ta: 'AI கேமரா மூலம் கட்டிட சுவர்களில் உள்ள ஏசி யூனிட்களை தானாகக் கணக்கிட்டு, வெளியேற்றப்படும் வெப்பத்தின் அளவையும் அதற்கான நகராட்சி வரியையும் கணக்கிடுகிறது.',
      hi: 'कंप्यूटर विज़न इमारतों के एसी कंप्रेसर को गिनता है, कुल गर्मी की गणना करता है और मासिक नगर निगम बहाली जुर्माना निर्धारित करता है।',
    },
    audioSpeech: {
      en: 'Step 4, CV Scanner: Edge computer vision audits building façades, counting outdoor AC units to calculate rejected heat and assessed monthly restorative taxes.',
      ta: 'படி 4, சிவி ஸ்கேனர்: கேமரா மூலம் ஏசி யூனிட்களைக் கணக்கிட்டு, அது வெளியேற்றும் வெப்பத்திற்கு ஏற்ப மாதாந்திர நகராட்சி வரியை மதிப்பீடு செய்கிறது.',
      hi: 'चरण 4, सीवी स्कैनर: कंप्यूटर विज़न एसी यूनिट गिनकर गर्म निकास और मासिक जुर्माने का आकलन करता है।',
    },
  },
  {
    step: 5,
    totalSteps: 7,
    targetPath: '/ledger',
    badge: '05 · THERMAL DEBT LEDGER',
    title: 'Amazon Neptune Graph, Bedrock Guardrails & Sec 133 CrPC',
    screenName: 'Debt Ledger',
    icon: Scale,
    summary: {
      en: 'Traverses a 3-hop Neptune liability graph (Cart → HVAC → Corporate Entity) to attribute heat damage. Bedrock Guardrails redact vendor personal PII while drafting statutory Section 133 CrPC environmental nuisance notices.',
      ta: 'அமேசான் நெப்டியூன் வரைபடம் மூலம் வெப்ப பாதிப்பை கட்டிட உரிமையாளருடன் இணைக்கிறது. தொழிலாளர் ரகசியங்களை பாதுகாத்து பிரிவு 133 சட்ட நோட்டீஸ் அனுப்புகிறது.',
      hi: 'नेप्च्यून ग्राफ के ज़रिये गर्मी के नुकसान को कंपनी से जोड़ता है और धारा 133 के तहत कानूनी पर्यावरण नोटिस तैयार करता है।',
    },
    audioSpeech: {
      en: 'Step 5, Thermal Debt Ledger: Neptune knowledge graphs link exposed vendors to corporate polluters, while Bedrock Guardrails redact personal PII during legal notice generation.',
      ta: 'படி 5, தெர்மல் டெட் லெட்ஜர்: நெப்டியூன் வரைபடம் வெப்ப பாதிப்புக்கு காரணமான நிறுவனத்தை அடையாளம் கண்டு, தொழிலாளர் விவரங்களை மறைத்து சட்ட நோட்டீஸ் உருவாக்குகிறது.',
      hi: 'चरण 5, डेट लेजर: नेप्च्यून ग्राफ के माध्यम से कॉर्पोरेट जिम्मेदारी तय होती है और कानूनी नोटिस जारी किया जाता है।',
    },
  },
  {
    step: 6,
    totalSteps: 7,
    targetPath: '/watchlist',
    badge: '06 · EARLY WARNING WATCHLIST',
    title: 'Multilingual SMS & WhatsApp Voice Safety Dispatch',
    screenName: 'Alerts',
    icon: Bell,
    summary: {
      en: 'Real-time municipal watchlist of violating commercial complexes. Dispatches sub-second encrypted WhatsApp and SMS heat alerts in Tamil, Hindi, and English directing vendors to nearby municipal evaporative mist kiosks.',
      ta: 'ஆபத்தான வெப்பம் ஏற்படும் போது, வியாபாரிகளுக்கு தமிழ், இந்தி மற்றும் ஆங்கிலத்தில் உடனடி வாட்ஸ்அப், எஸ்எம்எஸ் மற்றும் இயர்பட்ஸ் குரல் எச்சரிக்கைகளை அனுப்புகிறது.',
      hi: 'लाइव वॉचलिस्ट से रेहड़ी-पटरी वालों को तमिल, हिंदी और अंग्रेजी में तत्काल व्हाट्सएप/एसएमएस चेतावनी और मिस्ट कियोस्क की जानकारी भेजी जाती है।',
    },
    audioSpeech: {
      en: 'Step 6, Watchlist and Alerts: When lethal thresholds are breached, sub-second encrypted SMS and WhatsApp warnings dispatch in Tamil, Hindi, and English to protect street vendors.',
      ta: 'படி 6, அலர்ட் வாட்ச்லிஸ்ட்: ஆபத்தான வெப்பநிலையின் போது, தொழிலாளர்களுக்கு தமிழ், இந்தி மற்றும் ஆங்கிலத்தில் உடனடி பாதுகாப்பு எச்சரிக்கைகளை அனுப்புகிறது.',
      hi: 'चरण 6, वॉचलिस्ट और अलर्ट: घातक तापमान पर तमिल, हिंदी और अंग्रेजी में तत्काल सुरक्षा संदेश भेजे जाते हैं।',
    },
  },
  {
    step: 7,
    totalSteps: 7,
    targetPath: '/impact',
    badge: '07 · MUNICIPAL IMPACT & RESTITUTION',
    title: 'Urban Shade Corridors, Misting Kiosks & Lives Protected',
    screenName: 'Impact',
    icon: HeartHandshake,
    summary: {
      en: 'Demonstrates the closed-loop economic impact: 100% of collected commercial thermal surcharges fund urban shade canopies, tree planting, cold ORS hydration kiosks, and protect informal street workers from heatstroke.',
      ta: 'வசூலிக்கப்படும் அபராதத் தொகை முழுவதும் சாலையோர நிழற்குடைகள், மரங்கள் மற்றும் குளிர்ந்த நீர் நிலையங்களை அமைத்து தொழிலாளர்களின் உயிரைப் பாதுகாக்கிறது.',
      hi: 'वसूल किया गया जुर्माना सीधे सड़क पर छायादार शेल्टर, पेड़ लगाने और ओआरएस पानी के कियोस्क बनाने में खर्च होता है, जिससे वेंडरों की जान बचती है।',
    },
    audioSpeech: {
      en: 'Step 7, Municipal Impact: 100% of collected thermal surcharges fund urban shade canopies and hydration mist kiosks to protect vulnerable street livelihoods.',
      ta: 'படி 7, நகராட்சி தாக்கம்: வசூலிக்கப்படும் அபராதம் முழுவதும் சாலையோர நிழற்குடைகள் மற்றும் குளிர் நிலையங்கள் அமைத்து தொழிலாளர்களைப் பாதுகாக்கிறது.',
      hi: 'चरण 7, प्रभाव: एकत्रित जुर्माना सीधे छाया और पानी के कियोस्क बनाने में लगाया जाता है।',
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

  // Route awareness: When the tour step changes, navigate to the exact screen and smoothly scroll
  useEffect(() => {
    if (!isOpen) return;

    if (location.pathname !== step.targetPath) {
      navigate(step.targetPath);
      const timer = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
      return () => window.clearTimeout(timer);
    } else {
      if (step.targetAnchor && step.targetPath === '/') {
        const el = document.getElementById(step.targetAnchor);
        if (el) {
          const yOffset = -88;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStepIndex, isOpen, step.targetPath, step.targetAnchor, location.pathname, navigate]);

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
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    soundEngine.playTone(380, 'sine', 0.1);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const CurrentIcon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center sm:justify-end p-4 sm:p-6">
      {/* Subtle Backdrop Clickable on Mobile */}
      <div
        onClick={() => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
          onClose();
        }}
        className="fixed inset-0 bg-black/35 backdrop-blur-[1px] pointer-events-auto sm:hidden"
      />

      <div className="relative z-10 pointer-events-auto max-w-lg w-full select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="rounded-3xl bg-[#0b1b2d] text-white border-2 border-amber-400 shadow-[0_24px_70px_rgba(11,27,45,0.85)] overflow-hidden flex flex-col">
          {/* Top Header Bar with Live Screen Badge */}
          <div className="px-5 py-3.5 bg-[#112338] border-b border-slate-700/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Compass className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-2 font-bold tracking-wider">
                <span className="text-amber-400 uppercase">FULL PLATFORM TOUR</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                  {step.screenName}
                </span>
                <span className="text-slate-400 text-[11px]">
                  ({step.step}/{step.totalSteps})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Guided Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 7 Interactive Screen Progress Step Dots */}
          <div className="px-5 pt-3 flex items-center justify-between gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                  setCurrentStepIndex(idx);
                }}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-amber-400 ring-2 ring-amber-400/50'
                    : idx < currentStepIndex
                    ? 'bg-emerald-500/80'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Jump to Screen ${s.step}: ${s.screenName}`}
              />
            ))}
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <CurrentIcon className="w-3 h-3 text-amber-400" />
                <span>{step.badge}</span>
              </span>

              {/* Language Switcher: English, Tamil, Hindi */}
              <div className="flex items-center gap-1 bg-[#071320] p-1 rounded-xl border border-slate-700 text-[11px] font-mono font-semibold">
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
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                      setIsPlayingAudio(false);
                      setSelectedLanguage(lang.code);
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
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

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {step.summary[selectedLanguage] || step.summary.en}
            </p>
          </div>

          {/* Action Bar */}
          <div className="px-5 py-3.5 bg-[#071320] border-t border-slate-700/80 flex items-center justify-between gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={handlePlaySpeech}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
              }`}
              title="Listen to multilingual voice narration"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Stop Audio ⏹</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Voice Audio 🔊</span>
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
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Restart Tour' : 'Next Screen &rarr;'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
