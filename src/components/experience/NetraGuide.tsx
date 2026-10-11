import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

export type TourLanguage = 'en' | 'hi' | 'kn' | 'te';

interface TourStep {
  step: number;
  totalSteps: number;
  targetPath: string;
  targetAnchor?: string;
  badge: string;
  title: string;
  summary: {
    en: string;
    hi: string;
    kn: string;
    te: string;
  };
  audioSpeech: {
    en: string;
    hi: string;
    kn: string;
    te: string;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    totalSteps: 7,
    targetPath: '/',
    targetAnchor: 'wow_hero',
    badge: 'STEP 01 · PROJECT IMPACT',
    title: '54°C AC Waste Heat Dumping on Street Workers',
    summary: {
      en: 'Corporate towers stay chilled at 21°C inside while dumping 54°C superheated AC exhaust onto street vendors.',
      hi: 'वातानुकूलित इमारतें अंदर 21°C का आराम देती हैं, लेकिन बाहर की सड़कों पर 54°C का झुलसाने वाला निकास फेंकती हैं।',
      kn: 'ವಾತಾನುಕೂಲಿತ ಕಟ್ಟಡಗಳು ಒಳಗೆ 21°C ಆರಾಮವನ್ನು ನೀಡುತ್ತವೆ, ಆದರೆ ರಸ್ತೆಯ ಕಾರ್ಮಿಕರ ಮೇಲೆ 54°C ಬಿಸಿ ಹೊರಹಾಕುತ್ತವೆ.',
      te: 'ఎయిర్ కండీషనర్లు లోపల 21°C చల్లదనాన్ని ఇస్తాయి, కానీ వీధి కార్మికులపై 54°C వేడిని కుమ్మరిస్తాయి.',
    },
    audioSpeech: {
      en: 'Step 1: Welcome to Ushma-Netra. While commercial buildings stay cool at 21 degrees inside, their outdoor AC units dump 54 degree heat onto street workers.',
      hi: 'चरण 1: उष्मा-नेत्र में आपका स्वागत है। जब इमारतें अंदर 21 डिग्री पर ठंडी रहती हैं, तो उनका निकास सड़क पर 54 डिग्री गर्मी फेंकता है।',
      kn: 'ಹಂತ 1: ಉಷ್ಮಾ-ನೇತ್ರಕ್ಕೆ ಸ್ವಾಗತ. ಕಟ್ಟಡಗಳು ಒಳಗೆ ತಂಪಾಗಿದ್ದರೆ, ಅವುಗಳ ಶಾಖವು ರಸ್ತೆ ವ್ಯಾಪಾರಿಗಳ ಮೇಲೆ 54 ಡಿಗ್ರಿ ಬೀಳುತ್ತದೆ.',
      te: 'దశ 1: ఉష్మా-నేత్రకు స్వాగతం. భవనాలు లోపల చల్లగా ఉన్నప్పుడు, వాటి ఎగ్జాస్ట్ వీధి వ్యాపారులపై 54 డిగ్రీల వేడిని చిమ్ముతుంది.',
    },
  },
  {
    step: 2,
    totalSteps: 7,
    targetPath: '/',
    targetAnchor: 'how_it_works_summary',
    badge: 'STEP 02 · 4-STEP SYSTEM',
    title: 'How Ushma-Netra Works in 4 Steps',
    summary: {
      en: 'We combine satellite & AI camera scans, street plume tracking, vendor cart heat alerts, and polluter fines that pay for cooling mist.',
      hi: 'हम सैटेलाइट और एआई कैमरा स्कैन, स्ट्रीट प्लूम ट्रैकिंग, वेंडर कार्ट अलर्ट और कूलिंग मिस्ट के लिए प्रदूषण जुर्माने को जोड़ते हैं।',
      kn: 'ಉಪಗ್ರಹ ಮತ್ತು ಎಐ ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್, ಶಾಖದ ಟ್ರ್ಯಾಕಿಂಗ್, ಕಾರ್ಮಿಕರ ಎಚ್ಚರಿಕೆ ಮತ್ತು ತಂಪಾಗಿಸುವ ಮಿಸ್ಟ್ ವ್ಯವಸ್ಥೆ.',
      te: 'శాటిలైట్ మరియు ఏఐ కెమెరా స్కాన్, వేడి ట్రాకింగ్, కార్మికుల హెచ్చరికలు మరియు కూలింగ్ మిస్ట్ వ్యవస్థ.',
    },
    audioSpeech: {
      en: 'Step 2: In four simple steps, we detect AC vents, track trapped street heat, warn street vendors by voice, and fine polluting towers to fund street cooling.',
      hi: 'चरण 2: चार आसान चरणों में हम एसी वेंट पहचानते हैं, फंसी हुई गर्मी ट्रैक करते हैं, विक्रेताओं को सचेत करते हैं और ठंडी मिस्ट चलाते हैं।',
      kn: 'ಹಂತ 2: ನಾಲ್ಕು ಸರಳ ಹಂತಗಳಲ್ಲಿ ನಾವು ಎಸಿ ಶಾಖವನ್ನು ಪತ್ತೆಹಚ್ಚಿ ರಸ್ತೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ ತಂಪು ನೀಡುತ್ತೇವೆ.',
      te: 'దశ 2: నాలుగు సులభమైన దశల్లో మేము ఏసీ వేడిని గుర్తించి వీధి వ్యాపారులకు చల్లదనాన్ని అందిస్తాము.',
    },
  },
  {
    step: 3,
    totalSteps: 7,
    targetPath: '/grid',
    badge: 'STEP 03 · THERMAL GRID',
    title: 'National Thermal Grid: Monitored Street Canyons',
    summary: {
      en: 'Explore 10+ monitored commercial alleys across Delhi NCR, Mumbai, Bengaluru, and Ahmedabad with live heat debt scores.',
      hi: 'दिल्ली, मुंबई, बेंगलुरु और अहमदाबाद में सैटेलाइट इंफ्रारेड द्वारा जांची गई 10+ हॉटस्पॉट साइटें देखें।',
      kn: 'ದೆಹಲಿ, ಮುಂಬೈ, ಬೆಂಗಳೂರು ಮತ್ತು ಅಹಮದಾಬಾದ್‌ನ ವಾಣಿಜ್ಯ ವಲಯಗಳಲ್ಲಿ ಮೇಲ್ವಿಚಾರಣೆ.',
      te: 'ఢిల్లీ, ముంబై, బెంగళూరు మరియు అహ్మదాబాద్‌లలో హాట్‌స్పాట్ సైట్ల పర్యవేక్షణ.',
    },
    audioSpeech: {
      en: 'Step 3: Here in the Thermal Grid Registry, we monitor high-density commercial street canyons across major Indian cities.',
      hi: 'चरण 3: राष्ट्रीय थर्मल ग्रिड रजिस्ट्री में प्रमुख भारतीय शहरों के वाणिज्यिक गलियारों की निगरानी की जाती है।',
      kn: 'ಹಂತ 3: ರಾಷ್ಟ್ರೀಯ ಥರ್ಮಲ್ ಗ್ರಿಡ್ ನೋಂದಣಿಯಲ್ಲಿ ವಾಣಿಜ್ಯ ಕಾರಿಡಾರ್‌ಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      te: 'దశ 3: థర్మల్ గ్రిడ్ రిజిస్ట్రీలో వాణిజ్య కారిడార్లను ఉపగ్రహ డేటాతో పర్యవేక్షిస్తున్నాము.',
    },
  },
  {
    step: 4,
    totalSteps: 7,
    targetPath: '/twin',
    badge: 'STEP 04 · 3D DIGITAL TWIN',
    title: 'Interactive 3D Digital Twin & Skyward Louvers',
    summary: {
      en: 'Simulate 54°C AC exhaust jets in 3D and deploy 45° upward louvers + misting relays to cool the sidewalk by 4.2°C.',
      hi: 'वास्तविक समय 3डी सिमुलेशन। 45° अपवर्ड डिफ्लेक्टर चालू करके गर्म निकास को आकाश की ओर मोड़ें।',
      kn: 'ನೈಜ-ಸಮಯದ 3D ಸಿಮ್ಯುಲೇಶನ್. 45° ಡಿಫ್ಲೆಕ್ಟರ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ ಶಾಖವನ್ನು ಆಕಾಶಕ್ಕೆ ತಿರುಗಿಸಿ.',
      te: 'రియల్-టైమ్ 3D సిమ್ಯులేషన్. 45° డిఫ్లెక్టర్లను ఆన్ చేసి వేడిని పైకి మళ్లించండి.',
    },
    audioSpeech: {
      en: 'Step 4: Inside the 3D Digital Twin workspace, you can toggle 45 degree upward louvers and see the hot plume deflect safely into the sky.',
      hi: 'चरण 4: 3डी डिजिटल ट्विन में डिफ्लेक्टर लगाने से 54 डिग्री गर्मी आकाश की ओर मुड़ जाती है।',
      kn: 'ಹಂತ 4: 3D ಡಿಜಿಟಲ್ ಟ್ವಿನ್‌ನಲ್ಲಿ ಡಿಫ್ಲೆಕ್ಟರ್‌ಗಳು ಶಾಖವನ್ನು ಆಕಾಶಕ್ಕೆ ತಿರುಗಿಸುತ್ತವೆ.',
      te: 'దశ 4: 3D డిజిటల్ ట్విన్‌లో డిఫ్లెక్టర్లతో వేడిని సురక్షితంగా పైకి పంపుతాము.',
    },
  },
  {
    step: 5,
    totalSteps: 7,
    targetPath: '/scanner',
    badge: 'STEP 05 · AI CV SCANNER',
    title: 'AI Camera Scanner for Building Façades',
    summary: {
      en: 'Edge YOLOv8 computer vision automatically counts split ACs, VRF units, and rooftop chillers dumping heat into public alleys.',
      hi: 'एज कंप्यूटर विजन स्वचालित रूप से इमारतों की दीवारों पर लगे स्प्लिट एसी और वीआरएफ कंडेंसर की गिनती करता है।',
      kn: 'ಎಡ್ಜ್ ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಕಟ್ಟಡದ ಗೋಡೆಗಳ ಮೇಲಿನ ಎಸಿ ಘಟಕಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಎಣಿಸುತ್ತದೆ.',
      te: 'ఎడ్జ్ కంప్యూటర్ విజన్ భవనాలపై ఉన్న ఏసీ యూనిట్లను ఆటోమేటిక్‌గా లెక్కిస్తుంది.',
    },
    audioSpeech: {
      en: 'Step 5: The AI Facade Scanner counts every split AC and VRF unit on a building wall to calculate exact kilowatt heat rejection.',
      hi: 'चरण 5: एआई फासाड स्कैनर दीवार पर लगे हर एसी यूनिट को गिनकर कुल गर्मी की गणना करता है।',
      kn: 'ಹಂತ 5: ಎಐ ಸ್ಕ್ಯಾನರ್ ಕಟ್ಟಡದ ಮೇಲಿನ ಪ್ರತಿಯೊಂದು ಎಸಿ ಘಟಕವನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ.',
      te: 'దశ 5: ఏఐ స్కానర్ భవనంపై ఉన్న ప్రతి ఏసీ యూనిట్‌ను గుర్తించి వేడిని లెక్కిస్తుంది.',
    },
  },
  {
    step: 6,
    totalSteps: 7,
    targetPath: '/ledger',
    badge: 'STEP 06 · DEBT LEDGER',
    title: 'Section 133 CrPC Polluter Debt Ledger',
    summary: {
      en: 'Calculates monthly thermal surcharges against commercial heat dumpers and generates legal notices to fund vendor cooling kiosks.',
      hi: 'धारा 133 सीआरपीसी के तहत जुर्माना तय करता है और विक्रेताओं के कूलिंग कियोस्क के लिए फंड जुटाता है।',
      kn: 'ಸೆಕ್ಷನ್ 133 ಸಿಆರ್‌ಪಿಸಿ ಅಡಿಯಲ್ಲಿ ಶಾಸನಬದ್ಧ ದಂಡ ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ನೋಟಿಸ್ ಜನರೇಟರ್.',
      te: 'సెక్షన్ 133 సిఆర్‌పిసి ప్రకారం మున్సిపల్ పెనాల్టీ లెడ్జర్ మరియు లీగల్ నోటీసు.',
    },
    audioSpeech: {
      en: 'Step 6: Under Section 133 CrPC, the Debt Ledger assesses monthly thermal surcharges and drafts statutory legal notices.',
      hi: 'चरण 6: धारा 133 सीआरपीसी के तहत डेट लेजर मासिक शुल्क और कानूनी नोटिस तैयार करता है।',
      kn: 'ಹಂತ 6: ಸೆಕ್ಷನ್ 133 ಅಡಿಯಲ್ಲಿ ವಾಣಿಜ್ಯ ಕಟ್ಟಡಗಳಿಗೆ ದಂಡ ವಿಧಿಸಿ ಪರಿಹಾರ ನೀಡಲಾಗುತ್ತದೆ.',
      te: 'దశ 6: సెక్షన్ 133 ప్రకారం వాణిజ్య భవనాలకు జరిమానా విధించి కార్మికులకు రక్షణ కల్పిస్తాము.',
    },
  },
  {
    step: 7,
    totalSteps: 7,
    targetPath: '/watchlist',
    badge: 'STEP 07 · HEAT WATCHLIST',
    title: 'Multilingual Vendor SMS & Voice Early Warnings',
    summary: {
      en: 'Dispatches instant Hindi, Tamil, and English emergency heat alerts to street workers when wet-bulb temperature crosses 36°C.',
      hi: 'जानलेवा तापमान पार होने पर रेहड़ी-पटरी वालों को तुरंत हिंदी और अंग्रेजी में अलर्ट भेजता है।',
      kn: 'ಗರಿಷ್ಠ ತಾಪಮಾನದ ಸಮಯದಲ್ಲಿ ಕಾರ್ಮಿಕರಿಗೆ ಬಹುಭಾಷಾ ತುರ್ತು ಎಚ್ಚರಿಕೆ ರವಾನೆ.',
      te: 'తీవ్రమైన వేడి సమయంలో కార్మికులకు బహుభాషా అత్యవసర హెచ్చరికల వ్యవస్థ.',
    },
    audioSpeech: {
      en: 'Step 7: Finally, the Heat Surge Watchlist dispatches instant multilingual warnings to street vendors before heat stroke occurs.',
      hi: 'चरण 7: अंत में, हीट सर्ज वॉचलिस्ट विक्रेताओं को लू लगने से पहले तुरंत आपातकालीन अलर्ट भेजती है।',
      kn: 'ಹಂತ 7: ಹೀಟ್ ಸರ್ಜ್ ವಾಚ್‌ಲಿಸ್ಟ್ ಕಾರ್ಮಿಕರಿಗೆ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಕಳುಹಿಸುತ್ತದೆ.',
      te: 'దశ 7: చివరిగా, ప్రమాదకరమైన వేడి ఉన్నప్పుడు వీధి కార్మికులకు అత్యవసర హెచ్చరికలను పంపుతాము.',
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

  // Auto-navigate to target page and scroll to anchor on step change
  useEffect(() => {
    if (!isOpen) return;

    if (location.pathname !== step.targetPath) {
      navigate(step.targetPath);
    }

    if (step.targetAnchor) {
      const timer = window.setTimeout(() => {
        const el = document.getElementById(step.targetAnchor || '');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
      return () => window.clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex, isOpen, step.targetPath, step.targetAnchor, navigate]);

  // Speech synthesizer utilizing Web Speech API
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

      if (selectedLanguage === 'hi') utterance.lang = 'hi-IN';
      else if (selectedLanguage === 'kn') utterance.lang = 'kn-IN';
      else if (selectedLanguage === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';

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

  // Clean up speech synthesis on unmount or close
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
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end sm:items-end justify-center sm:justify-end p-4 sm:p-6">
      {/* Subtle Backdrop Clickable on Mobile */}
      <div
        onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          onClose();
        }}
        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] pointer-events-auto sm:hidden"
      />

      <div className="relative z-10 pointer-events-auto max-w-md w-full select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="rounded-2xl bg-[#0b1b2d] text-white border-2 border-amber-400 shadow-[0_24px_60px_rgba(11,27,45,0.55)] overflow-hidden flex flex-col">
          {/* Top Header Bar */}
          <div className="px-4 py-3 bg-[#112338] border-b border-slate-700/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Compass className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-1.5 font-bold tracking-wider">
                <span className="text-amber-400">GUIDED TOUR</span>
                <span className="text-slate-500">·</span>
                <span className="text-white">
                  STEP {step.step} OF {step.totalSteps}
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

          {/* Step Quick Dots */}
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
                title={`Jump to Step ${s.step}: ${s.title}`}
              />
            ))}
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                {step.badge}
              </span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-[#071320] p-1 rounded-lg border border-slate-700 text-[11px] font-mono font-semibold">
                {(
                  [
                    { code: 'en', label: 'EN' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'kn', label: 'ಕನ್ನಡ' },
                    { code: 'te', label: 'తెలుగు' },
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
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Restart' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
