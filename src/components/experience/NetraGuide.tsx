import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  Scale,
  Box,
  Scan,
  ShieldCheck
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

export type TourLanguage = 'en' | 'hi' | 'kn' | 'te';

interface TourStep {
  step: number;
  totalSteps: number;
  targetPath: string;
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
  targetAnchor?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    totalSteps: 10,
    targetPath: '/',
    targetAnchor: 'wow_hero',
    badge: 'ACT 01 · HERO PROOF',
    title: 'The Anthropogenic Thermal Injustice',
    summary: {
      en: 'Indoor AC sanctuaries chill corporate towers to 21°C while dumping 54°C superheated sensible waste directly onto informal street workers.',
      hi: 'वातानुकूलित इमारतें अंदर 21°C का आराम देती हैं, लेकिन बाहर की सड़कों पर 54°C का झुलसाने वाला निकास फेंकती हैं।',
      kn: 'ವಾತಾನುಕೂಲಿತ ಕಟ್ಟಡಗಳು ಒಳಗೆ 21°C ಆರಾಮವನ್ನು ನೀಡುತ್ತವೆ, ಆದರೆ ರಸ್ತೆಯ ಕಾರ್ಮಿಕರ ಮೇಲೆ 54°C ಬಿಸಿ ಹೊರಹಾಕುತ್ತವೆ.',
      te: 'ఎయిర్ కండీషనర్లు లోపల 21°C చల్లదనాన్ని ఇస్తాయి, కానీ వీధి కార్మికులపై 54°C వేడిని కుమ్మరిస్తాయి.',
    },
    audioSpeech: {
      en: 'Welcome to Ushma-Netra. While corporate towers enjoy 21 degree comfort, their condenser banks dump 54 degree exhaust onto street vendors. We quantify this thermal dumping.',
      hi: 'उष्मा-नेत्र में आपका स्वागत है। जब कॉर्पोरेट टॉवर 21 डिग्री पर ठंडे रहते हैं, तो उनका निकास सड़क पर 54 डिग्री गर्मी फेंकता है।',
      kn: 'ಉಷ್ಮಾ-ನೇತ್ರಕ್ಕೆ ಸ್ವಾಗತ. ಕಾರ್ಪೊರೇಟ್ ಟವರ್‌ಗಳು 21 ಡಿಗ್ರಿಯಲ್ಲಿ ತಂಪಾಗಿದ್ದರೆ, ಅವುಗಳ ಶಾಖವು ರಸ್ತೆ ವ್ಯಾಪಾರಿಗಳ ಮೇಲೆ 54 ಡಿಗ್ರಿ ಬೀಳುತ್ತದೆ.',
      te: 'ఉష్మా-నేత్రకు స్వాగతం. కార్పొరేట్ భవనాలు 21 డిగ్రీలలో చల్లగా ఉన్నప్పుడు, వాటి ఎగ్జాస్ట్ వీధి వ్యాపారులపై 54 డిగ్రీల వేడిని చిమ్ముతుంది.',
    },
  },
  {
    step: 2,
    totalSteps: 10,
    targetPath: '/',
    targetAnchor: 'problem',
    badge: 'ACT 02 · CAUSATION',
    title: 'Thermodynamic Rejection in Narrow Canyons',
    summary: {
      en: 'Every 1 TR of cooling rejects 1.35 kW of sensible heat. Trapped between tall facades, street air parcels spike by +6.2°C.',
      hi: 'प्रत्येक 1 टन कूलिंग 1.35 किलोवाट अपशिष्ट ऊष्मा बाहर फेंकती है। तंग गलियों में यह तापमान 6 डिग्री से अधिक बढ़ा देता है।',
      kn: 'ಪ್ರತಿ 1 ಟನ್ ಕೂಲಿಂಗ್ 1.35 ಕಿಲೋವ್ಯಾಟ್ ಶಾಖವನ್ನು ಹೊರಹಾಕುತ್ತದೆ. ಕಿರಿದಾದ ಬೀದಿಗಳಲ್ಲಿ ತಾಪಮಾನ 6 ಡಿಗ್ರಿ ಏರುತ್ತದೆ.',
      te: 'ప్రతి 1 టన్ను కూలింగ్ 1.35 కిలోవాట్ల వేడిని విడుదల చేస్తుంది. ఇరుకైన వీధులలో ఉష్ణోగ్రత 6 డిగ్రీలు పెరుగుతుంది.',
    },
    audioSpeech: {
      en: 'Thermodynamics dictates heat cannot be destroyed. Air conditioners concentrate indoor heat and dump it at head height in narrow urban corridors.',
      hi: 'ऊष्मागतिकी के अनुसार गर्मी नष्ट नहीं होती। एयर कंडीशनर अंदर की गर्मी बाहर सिर की ऊंचाई पर फेंकते हैं।',
      kn: 'ಉಷ್ಣಬಲವಿಜ್ಞಾನದ ಪ್ರಕಾರ ಶಾಖವನ್ನು ನಾಶಪಡಿಸಲಾಗುವುದಿಲ್ಲ. ಎಸಿಗಳು ಶಾಖವನ್ನು ಪಾದಚಾರಿಗಳ ಮೇಲೆ ಎಸೆಯುತ್ತವೆ.',
      te: 'థర్మోడైనమిక్స్ ప్రకారం వేడి నశించదు. ఎయిర్ కండీషనర్లు వీధి వ్యాపారుల తలల ఎత్తులో వేడిని వదులుతాయి.',
    },
  },
  {
    step: 3,
    totalSteps: 10,
    targetPath: '/',
    targetAnchor: 'tension',
    badge: 'ACT 03 · HUMAN COLLATERAL',
    title: 'Physiological Limit: Rameshwar Pal',
    summary: {
      en: 'At 36.8°C Wet Bulb Globe Temperature (WBGT), human sweat physically ceases to evaporate, risking lethal heat stroke in street workers.',
      hi: '36.8°C वेट बल्ब तापमान पर मानव पसीना सूखना बंद हो जाता है, जिससे सड़क किनारे श्रमिकों में हीट स्ट्रोक का खतरा बढ़ जाता है।',
      kn: '36.8°C ವೆಟ್ ಬಲ್ಬ್ ತಾಪಮಾನದಲ್ಲಿ ಬೆವರು ಆವಿಯಾಗುವುದಿಲ್ಲ, ಇದರಿಂದ ಮಾರಣಾಂತಿಕ ಹೀಟ್ ಸ್ಟ್ರೋಕ್ ಅಪಾಯ ಎದುರಾಗುತ್ತದೆ.',
      te: '36.8°C వెట్ బల్బ్ ఉష్ణోగ్రత వద్ద చెమట ఆవిరి అవ్వదు, దీనివల్ల కార్మికులకు ప్రాణాంతక వడదెబ్బ తగులుతుంది.',
    },
    audioSpeech: {
      en: 'At 36.8 degrees Wet Bulb Globe Temperature, sweat evaporation physically fails. Street vendors like Rameshwar Pal face organ hyperthermia.',
      hi: '36.8 डिग्री वेट बल्ब तापमान पर पसीना सूखना बंद हो जाता है। रामेश्वर पाल जैसे रेहड़ी-पटरी वालों को जानलेवा लू का खतरा होता है।',
      kn: '36.8 ಡಿಗ್ರಿ ವೆಟ್ ಬಲ್ಬ್ ತಾಪಮಾನದಲ್ಲಿ ರಸ್ತೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಅಂಗಾಂಗ ಹಾನಿಯ ಅಪಾಯವಿದೆ.',
      te: '36.8 డిగ్రీల వెట్ బల్బ్ ఉష్ణోగ్రత వద్ద చెమట ఆవిరి కాక కార్మికులు తీవ్ర అస్వస్థతకు గురవుతారు.',
    },
  },
  {
    step: 4,
    totalSteps: 10,
    targetPath: '/grid',
    badge: 'ACT 04 · DATA REGISTRY',
    title: 'National Thermal Grid: 10 Monitored Micro-Canyons',
    summary: {
      en: 'Audited across Delhi NCR, Mumbai, Bengaluru, and Ahmedabad with satellite LST overlays and street canyon geometric aspect ratios.',
      hi: 'दिल्ली, मुंबई, बेंगलुरु और अहमदाबाद में सैटेलाइट इंफ्रारेड और स्ट्रीट कैन्यन ज्यामिति द्वारा जांची गई 10 हॉटस्पॉट साइटें।',
      kn: 'ದೆಹಲಿ, ಮುಂಬೈ, ಬೆಂಗಳೂರು ಮತ್ತು ಅಹಮದಾಬಾದ್‌ನ 10 ಸೂಕ್ಷ್ಮ ವಲಯಗಳಲ್ಲಿ ಉಪಗ್ರಹ ದತ್ತಾಂಶದೊಂದಿಗೆ ಮೇಲ್ವಿಚಾರಣೆ.',
      te: 'ఢిల్లీ, ముంబై, బెంగళూరు మరియు అహ్మదాబాద్‌లలో శాటిలైట్ థర్మల్ డేటాతో 10 హాట్‌స్పాట్ సైట్లు.',
    },
    audioSpeech: {
      en: 'Navigating to the National Thermal Grid registry. Here we monitor 10 high-density commercial corridors with Landsat surface radiance overlays.',
      hi: 'राष्ट्रीय थर्मल ग्रिड रजिस्ट्री में आपका स्वागत है। यहाँ 10 अत्यधिक प्रभावित वाणिज्यिक गलियारों की निरंतर निगरानी की जाती है।',
      kn: 'ರಾಷ್ಟ್ರೀಯ ಥರ್ಮಲ್ ಗ್ರಿಡ್ ನೋಂದಣಿಗೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ. 10 ವಾಣಿಜ್ಯ ಕಾರಿಡಾರ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      te: 'నేషనల్ థర్మల్ గ్రిడ్ రిజిస్ట్రీకి నావిగేట్ చేస్తున్నాము. 10 వాణిజ్య కారిడార్లను ఉపగ్రహ డేటాతో పర్యవేక్షిస్తున్నాము.',
    },
  },
  {
    step: 5,
    totalSteps: 10,
    targetPath: '/how-it-works',
    badge: 'ACT 05 · CLOSED-LOOP',
    title: 'Autonomous 6-Stage Sensor to Actuation Pipeline',
    summary: {
      en: 'Landsat-9 satellite infrared → Edge YOLOv8 vision → Eulerian CFD plume model → IoT BLE beacons → DynamoDB ledger → SCADA misting.',
      hi: 'सैटेलाइट इंफ्रारेड → एज कंप्यूटर विजन → सीएफडी मॉडल → आईओटी बीकन → डायनेमोडीबी लेजर → स्वचालित मिस्टिंग रिले।',
      kn: 'ಉಪಗ್ರಹ ಇನ್‌ಫ್ರಾರೆಡ್ → ಎಡ್ಜ್ ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ → ಸಿಎಫ್‌ಡಿ ಪ್ಲೂಮ್ → ಐಒಟಿ ಬೀಕನ್‌ಗಳು → ಡೈನಾಮೊಡಿಬಿ → ಸ್ಕಾಡಾ ಮಿಸ್ಟಿಂಗ್.',
      te: 'శాటిలైట్ ఇన్ఫ్రారెడ్ → ఎడ్జ్ కంప్యూటర్ విజన్ → సిఎఫ్‌డి మోడల్ → ఐఓటి బీకాన్లు → డైనమోడిబి → ఆటోమేటిక్ మిస్టింగ్.',
    },
    audioSpeech: {
      en: 'The 6-stage closed loop: from orbital Landsat radiance down to edge YOLOv8 camera inference and autonomous high-pressure mist actuation.',
      hi: '6-चरणीय पाइपलाइन: सैटेलाइट इंफ्रारेड से लेकर एज कंप्यूटर विजन और स्वचालित मिस्टिंग कियोस्क तक।',
      kn: '6-ಹಂತದ ತಂತ್ರಜ್ಞಾನ: ಉಪಗ್ರಹ ಡೇಟಾದಿಂದ ಹಿಡಿದು ಎಡ್ಜ್ ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಮತ್ತು ಸ್ಕಾಡಾ ಮಿಸ್ಟಿಂಗ್ ವರೆಗೆ.',
      te: '6-దశల స్వయంప్రతిపత్తి పైప్‌లైన్: ఉపగ్రహ సమాచారం నుండి నేరుగా ఆటోమేటిక్ వాటర్ మిస్టింగ్ వరకు.',
    },
  },
  {
    step: 6,
    totalSteps: 10,
    targetPath: '/how-it-works',
    targetAnchor: 'aws-architecture',
    badge: 'ACT 06 · ENTERPRISE CLOUD',
    title: 'AWS EventBridge & Cedar Security Guardrails',
    summary: {
      en: 'AWS IoT Core MQTT, Amazon Timestream telemetry, Amazon Bedrock legal reasoning, and AWS Verified Permissions (Cedar policy) governing SCADA.',
      hi: 'एडब्ल्यूएस आईओटी कोर, अमेज़ॅन टाइमस्ट्रीम, अमेज़ॅन बेडरॉक और सीडर सुरक्षा नीतियां जो मिस्टिंग रिले को नियंत्रित करती हैं।',
      kn: 'ಎಡಬ್ಲ್ಯೂಎಸ್ ಐಒಟಿ ಕೋರ್, ಅಮೆಜಾನ್ ಟೈಮ್‌ಸ್ಟ್ರೀಮ್, ಮತ್ತು ಅಮೆಜಾನ್ ಬೆಡ್‌ರಾಕ್ ಆಧಾರಿತ ಸುರಕ್ಷತಾ ಚೌಕಟ್ಟು.',
      te: 'ఎడబ్ల్యూఎస్ ఐఓటి కోర్, అమెజాన్ టైమ్‌స్ట్రీమ్, మరియు అమెజాన్ బెడ్‌రాక్ ఆధారిత క్లౌడ్ ఆర్కిటెక్చర్.',
    },
    audioSpeech: {
      en: 'Our enterprise AWS backbone: sub-15ms telemetry via AWS IoT Core and DynamoDB, governed by AWS Cedar security policies for safe actuation.',
      hi: 'एडब्ल्यूएस क्लाउड इंफ्रास्ट्रक्चर: आईओटी कोर और अमेज़ॅन बेडरॉक द्वारा संचालित, पूर्ण सुरक्षा नीतियों के साथ।',
      kn: 'ಎಡಬ್ಲ್ಯೂಎಸ್ ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್: ಐಒಟಿ ಕೋರ್ ಮತ್ತು ಬೆಡ್‌ರಾಕ್ ಮೂಲಕ ಅತ್ಯಂತ ಕಡಿಮೆ ಲೇಟೆನ್ಸಿ.',
      te: 'ఎడబ్ల్యూఎస్ క్లౌడ్ బ్యాక్‌బోన్: ఐఓటి కోర్ మరియు అమెజాన్ బెడ్‌రాక్ ద్వారా వేగవంతమైన డేటా ప్రాసెసింగ్.',
    },
  },
  {
    step: 7,
    totalSteps: 10,
    targetPath: '/methodology',
    badge: 'ACT 07 · SCIENTIFIC RIGOR',
    title: 'Honest Validation & Micro-Canyon Thermodynamics',
    summary: {
      en: 'Interactive thermodynamic calculator with honest validation metrics (R² = 0.88, MAE ±0.68°C) and explicit boundary disclosures.',
      hi: 'सटीक भौतिकी समीकरण, वास्तविक अंशांकन मेट्रिक्स (R² = 0.88) और वैज्ञानिक सीमाओं का पारदर्शी प्रकटीकरण।',
      kn: 'ಸಂವಾದಾತ್ಮಕ ಥರ್ಮೋಡೈನಾಮಿಕ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಮತ್ತು ನೈಜ ಮೌಲ್ಯಮಾಪನ ಮೆಟ್ರಿಕ್ಸ್ (R² = 0.88).',
      te: 'ఖచ్చితమైన థర్మోడైనమిక్ కాలిక్యులేటర్ మరియు నిజాయితీ గల సైంటిఫిక్ వాలిడేషన్ మెట్రిక్స్.',
    },
    audioSpeech: {
      en: 'Scientific rigor and honest validation: R squared equals 0.88 against IMD weather stations, with complete transparency on sensor margins.',
      hi: 'वैज्ञानिक प्रामाणिकता: मौसम विज्ञान स्टेशनों के विरुद्ध R² = 0.88 की पुष्टि और स्पष्ट वैज्ञानिक खुलासे।',
      kn: 'ವೈಜ್ಞಾನಿಕ ನಿಖರತೆ: ಹವಾಮಾನ ಕೇಂದ್ರಗಳ ವಿರುದ್ಧ R² = 0.88 ನಿಖರತೆ ಮತ್ತು ಪಾರದರ್ಶಕತೆ.',
      te: 'శాస్త్రీయ ఖచ్చితత్వం: వాతావరణ కేంద్రాల డేటాతో R² = 0.88 కచ్చితత్వం.',
    },
  },
  {
    step: 8,
    totalSteps: 10,
    targetPath: '/ledger',
    badge: 'ACT 08 · CIVIC RESTITUTION',
    title: 'Municipal Debt Ledger & Bedrock Legal Notice',
    summary: {
      en: 'Section 133 CrPC statutory public nuisance penalty calculator. Notice generation powered by Amazon Bedrock (Nova Pro / Claude 3.5).',
      hi: 'धारा 133 सीआरपीसी वैधानिक सार्वजनिक उपद्रव जुर्माना और अमेज़ॅन बेडरॉक द्वारा तैयार कानूनी नोटिस।',
      kn: 'ಸೆಕ್ಷನ್ 133 ಸಿಆರ್‌ಪಿಸಿ ಅಡಿಯಲ್ಲಿ ಶಾಸನಬದ್ಧ ದಂಡ ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ಅಮೆಜಾನ್ ಬೆಡ್‌ರಾಕ್ ನೋಟಿಸ್ ಜನರೇಟರ್.',
      te: 'సెక్షన్ 133 సిఆర్‌పిసి ప్రకారం మున్సిపల్ పెనాల్టీ లెడ్జర్ మరియు అమెజాన్ బెడ్‌రాక్ లీగల్ నోటీసు.',
    },
    audioSpeech: {
      en: 'Section 133 Criminal Procedure Code empowers municipalities to fine commercial AC dumpers, hypothecating fees to vendor hydration kiosks via Amazon Bedrock.',
      hi: 'धारा 133 सीआरपीसी नगर पालिकाओं को एसी गर्मी फेंकने वाली इमारतों पर जुर्माना लगाने और विक्रेताओं को सहायता देने का अधिकार देती है।',
      kn: 'ಸೆಕ್ಷನ್ 133 ಸಿಆರ್‌ಪಿಸಿ ಅಡಿಯಲ್ಲಿ ವಾಣಿಜ್ಯ ಕಟ್ಟಡಗಳಿಗೆ ದಂಡ ವಿಧಿಸಿ ಬೀದಿ ಕಾರ್ಮಿಕರಿಗೆ ಪರಿಹಾರ ನೀಡಲಾಗುತ್ತದೆ.',
      te: 'సెక్షన్ 133 క్రిమినల్ ప్రొసీజర్ కోడ్ ద్వారా వాణిజ్య భవనాలకు జరిమానా విధించి కార్మికులకు రక్షణ కల్పిస్తాము.',
    },
  },
  {
    step: 9,
    totalSteps: 10,
    targetPath: '/twin',
    badge: 'ACT 09 · 3D WEBGL TWIN',
    title: 'Interactive 3D Digital Twin & Plume Deflection',
    summary: {
      en: 'Real-time 60 FPS WebGL simulation of 53°C hot exhaust jet. Toggle 45° upward deflectors to divert the plume skyward in real time.',
      hi: 'वास्तविक समय 60 एफपीएस 3डी सिमुलेशन। 45° अपवर्ड डिफ्लेक्टर चालू करके गर्म निकास को आकाश की ओर मोड़ें।',
      kn: 'ನೈಜ-ಸಮಯದ 60 FPS 3D ಸಿಮ್ಯುಲೇಶನ್. 45° ಡಿಫ್ಲೆಕ್ಟರ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ ಶಾಖವನ್ನು ಆಕಾಶಕ್ಕೆ ತಿರುಗಿಸಿ.',
      te: 'రియల్-టైమ్ 60 FPS 3D వెబ్‌జిఎల్ సిమ్యులేషన్. 45° డిఫ్లెక్టర్లను ఆన్ చేసి వేడిని పైకి మళ్లించండి.',
    },
    audioSpeech: {
      en: 'Our 3D Digital Twin renders the thermal plume in real-time WebGL. Notice how deploying deflectors diverts the 53 degree plume safely skyward.',
      hi: 'हमारा 3डी डिजिटल ट्विन वास्तविक समय में थर्मल प्लूम दिखाता है। डिफ्लेक्टर लगाने से 53 डिग्री गर्मी आकाश की ओर मुड़ जाती है।',
      kn: 'ನಮ್ಮ 3D ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಶಾಖದ ಪ್ರವಾಹವನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ತೋರಿಸುತ್ತದೆ. ಡಿಫ್ಲೆಕ್ಟರ್‌ಗಳು ಶಾಖವನ್ನು ಆಕಾಶಕ್ಕೆ ತಿರುಗಿಸುತ್ತವೆ.',
      te: 'మా 3D డిజిటల్ ట్విన్ వేడి ప్రవాహాన్ని నిజ సమయంలో చూపుతుంది. డిఫ్లెక్టర్లతో వేడిని సురక్షితంగా పైకి పంపుతాము.',
    },
  },
  {
    step: 10,
    totalSteps: 10,
    targetPath: '/watchlist',
    badge: 'ACT 10 · EMERGENCY ACTION',
    title: 'Heat Surge Early Warning & Multilingual Dispatch',
    summary: {
      en: 'Sub-second early warning radar with multilingual emergency SMS/WhatsApp dispatch to informal workers during peak afternoon dumping.',
      hi: 'दोपहर के चरम तापमान के दौरान श्रमिकों को बहुभाषी एसएमएस/व्हाट्सएप आपातकालीन अलर्ट चेतावनी केंद्र।',
      kn: 'ಗರಿಷ್ಠ ತಾಪಮಾನದ ಸಮಯದಲ್ಲಿ ಕಾರ್ಮಿಕರಿಗೆ ಬಹುಭಾಷಾ ಎಸ್‌ಎಂಎಸ್/ವಾಟ್ಸಾಪ್ ತುರ್ತು ಎಚ್ಚರಿಕೆ ರವಾನೆ.',
      te: 'తీవ్రమైన వేడి సమయంలో కార్మికులకు బహుభాషా ఎస్ఎమ్ఎస్ మరియు వాట్సాప్ అత్యవసర హెచ్చరికల వ్యవస్థ.',
    },
    audioSpeech: {
      en: 'Finally, the Heat Surge Watchlist simulates multilingual emergency SMS and WhatsApp alerts to street vendors when lethal WBGT limits are breached.',
      hi: 'अंत में, हीट सर्ज वॉचलिस्ट विक्रेताओं को जानलेवा तापमान पार होने पर बहुभाषी एसएमएस और व्हाट्सएप अलर्ट भेजती है।',
      kn: 'ಕೊನೆಯದಾಗಿ, ಹೀಟ್ ಸರ್ಜ್ ವಾಚ್‌ಲಿಸ್ಟ್ ಮಾರಣಾಂತಿಕ ಮಿತಿ ಮೀರಿದಾಗ ಕಾರ್ಮಿಕರಿಗೆ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಕಳುಹಿಸುತ್ತದೆ.',
      te: 'చివరిగా, ప్రమాదకరమైన వేడి ఉన్నప్పుడు వీధి కార్మికులకు బహుభాషా అత్యవసర హెచ్చరికలను పంపుతాము.',
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

  // Auto-navigate to target page on step change
  useEffect(() => {
    if (!isOpen) return;

    if (location.pathname !== step.targetPath) {
      navigate(step.targetPath);
    }

    if (step.targetAnchor) {
      setTimeout(() => {
        const el = document.getElementById(step.targetAnchor || '');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    }
  }, [currentStepIndex, isOpen, step.targetPath, step.targetAnchor]);

  // Speech synthesizer utilizing Web Speech API
  const handlePlaySpeech = () => {
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

    // Map language code
    if (selectedLanguage === 'hi') utterance.lang = 'hi-IN';
    else if (selectedLanguage === 'kn') utterance.lang = 'kn-IN';
    else if (selectedLanguage === 'te') utterance.lang = 'te-IN';
    else utterance.lang = 'en-US';

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    soundEngine.playTone(660, 'sine', 0.1);
  };

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
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
    <div className="fixed bottom-6 right-4 sm:right-8 z-50 max-w-md w-[calc(100vw-2rem)] select-none animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl bg-[#0b1b2d] text-white border-2 border-amber-500/60 shadow-[0_20px_50px_rgba(11,27,45,0.4)] overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#112338] border-b border-slate-700/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </span>
            <div className="flex items-center gap-1.5 font-bold tracking-wider">
              <span className="text-amber-400">NETRA GUIDE</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">
                STEP {step.step}/{step.totalSteps}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Guide Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
              {step.badge}
            </span>

            {/* Language Pills matching JalRekha tour style */}
            <div className="flex items-center gap-1 bg-[#071320] p-1 rounded-lg border border-slate-700 text-[11px] font-mono font-semibold">
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedLanguage === 'en'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLanguage('hi')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedLanguage === 'hi'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setSelectedLanguage('kn')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedLanguage === 'kn'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setSelectedLanguage('te')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedLanguage === 'te'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight leading-snug">
            {step.title}
          </h3>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {step.summary[selectedLanguage] || step.summary.en}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step.step / step.totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-3 bg-[#071320] border-t border-slate-700/80 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlaySpeech}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="Listen in chosen Indian language"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Listen</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Restart Tour' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
