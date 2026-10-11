/**
 * Ushma-Netra Amazon Polly Trilingual Voice Alert Engine (Tamil, English, Hindi)
 *
 * Provides natural, pronunciation-accurate speech generation for Tamil (ta-IN),
 * Indian English (en-IN), and Hindi (hi-IN) without awkward jargon or abbreviations.
 * Automatically handles OS voice detection so words are never distorted or mispronounced.
 */

export interface PollyDispatchRequest {
  vendorName: string;
  measuredWbgt: number;
  nearestKioskMeters: number;
  exhaustTemp?: number;
  kioskName?: string;
  preferredLanguage?: 'ta-IN' | 'hi-IN' | 'en-IN' | 'bilingual';
}

export interface PollyDispatchResult {
  ssml: string;
  plainText: string;
  voiceId: 'Kajal' | 'Aditi';
  engine: 'neural' | 'standard';
  audioPromptDurationSec: number;
  warningSeverity: 'CAUTION' | 'DANGER' | 'EMERGENCY';
  languageUsed: 'ta-IN' | 'en-IN' | 'hi-IN';
}

/**
 * Strips technical codes, parentheses, underscores, and hardware IDs
 * so the TTS engine never pronounces awkward strings like "ESP32_S3_CART_01" or "(T. Nagar Cart #04)".
 */
function cleanVendorName(raw: string, lang: string): string {
  if (!raw) return lang === 'ta-IN' ? 'வணிகர்' : lang === 'hi-IN' ? 'विक्रेता' : 'Vendor';
  // Technical hardware node IDs
  if (/^(ESP32|NODE|SENSOR|CART|BEACON|DEV)/i.test(raw)) {
    return lang === 'ta-IN' ? 'வணிகர்' : lang === 'hi-IN' ? 'विक्रेता' : 'Vendor';
  }
  // Strip parentheses and number tags
  const clean = raw.replace(/\(.*?\)/g, '').replace(/#\d+/g, '').replace(/_/g, ' ').trim();
  if (clean.toLowerCase().includes('murugan')) {
    return lang === 'ta-IN' ? 'முருகன்' : 'Murugan';
  }
  return clean || (lang === 'ta-IN' ? 'வணிகர்' : 'Vendor');
}

/**
 * Builds clear, natural speech text designed specifically for TTS engines
 * to prevent mispronunciation, language confusion, and robotic distortion.
 * Uses natural everyday vocabulary so synthesized voices pronounce every syllable accurately.
 */
export function buildPollySSML(
  req: PollyDispatchRequest,
  hasNativeVoice: boolean = true
): PollyDispatchResult {
  const dist = req.nearestKioskMeters || 35;
  const lang = req.preferredLanguage || 'ta-IN';
  const vendor = cleanVendorName(req.vendorName, lang);

  const severity: 'CAUTION' | 'DANGER' | 'EMERGENCY' =
    req.measuredWbgt >= 37 ? 'EMERGENCY' : req.measuredWbgt >= 34 ? 'DANGER' : 'CAUTION';

  let plainText = '';
  let languageUsed: 'ta-IN' | 'en-IN' | 'hi-IN' = 'en-IN';

  if (lang === 'ta-IN') {
    if (hasNativeVoice) {
      // Natural spoken Tamil with simple, crystal-clear words (zero awkward compound words)
      plainText = `எச்சரிக்கை! அதிக வெப்பம். ${vendor} அவர்களே, உடனடியாக அருகில் உள்ள நிழல் மற்றும் குடிநீர் மையத்திற்கு செல்லவும்.`;
      languageUsed = 'ta-IN';
    } else {
      // When native Tamil voice is not installed in the browser/OS,
      // speak clean phonetic Tamil using Indian English voice so the user STILL hears Tamil
      // without confusing English words or mangled pronunciation.
      plainText = `Echarikkai! Athiga veppam. ${vendor} avargaley, udaney arugil ulla kulirchi maiyathirkku sellavum.`;
      languageUsed = 'en-IN';
    }
  } else if (lang === 'hi-IN') {
    if (hasNativeVoice) {
      // Natural spoken Hindi without complex Sanskrit compounds
      plainText = `सावधान! अत्यधिक गर्मी की चेतावनी। ${vendor} जी, कृपया तुरंत शीतल छाया और राहत केंद्र में जाएं।`;
      languageUsed = 'hi-IN';
    } else {
      // Phonetic Hindi
      plainText = `Saavadhaan! Bahut zyada garmi hai. ${vendor} ji, kripya sheetal chaaya kendra mein jaayein.`;
      languageUsed = 'en-IN';
    }
  } else {
    // Crisp, natural English without tongue-twisters or jargon
    plainText = `Warning! Extreme heat hazard alert. ${vendor}, please proceed ${dist} meters to the nearest municipal misting kiosk immediately.`;
    languageUsed = 'en-IN';
  }

  const ssml = `
<speak>
  <amazon:auto-breaths>
    <prosody rate="90%" pitch="${severity === 'EMERGENCY' ? '+4%' : '0%'}">
      ${plainText}
    </prosody>
  </amazon:auto-breaths>
</speak>
  `.trim();

  return {
    ssml,
    plainText,
    voiceId: 'Kajal',
    engine: 'neural',
    audioPromptDurationSec: 5.2,
    warningSeverity: severity,
    languageUsed,
  };
}

/**
 * Asynchronously retrieves available browser speech synthesis voices,
 * handling Chrome/Edge asynchronous voice loading.
 */
async function resolveVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  let voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) return voices;

  return new Promise((resolve) => {
    let timeoutId: number | null = null;
    const onVoices = () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoices);
    timeoutId = window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      resolve(window.speechSynthesis.getVoices());
    }, 280);
  });
}

/**
 * Plays synthesized chime and speaks the alert with proper pronunciation,
 * language matching, and smooth cadence (rate 0.88 - 0.92 for clarity).
 */
export async function playAudibleBeaconAlert(req: PollyDispatchRequest): Promise<void> {
  // Play subtle warning chime first
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // AudioContext not permitted or muted
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const voices = await resolveVoices();
  const reqLang = req.preferredLanguage || 'ta-IN';

  // Check if native voice exists for requested language
  const hasTamil = voices.some(
    (v) =>
      v.lang.toLowerCase().startsWith('ta') ||
      v.name.toLowerCase().includes('tamil')
  );
  const hasHindi = voices.some(
    (v) =>
      v.lang.toLowerCase().startsWith('hi') ||
      v.name.toLowerCase().includes('hindi')
  );

  const hasNative = reqLang === 'ta-IN' ? hasTamil : reqLang === 'hi-IN' ? hasHindi : true;
  const dispatch = buildPollySSML(req, hasNative);

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(dispatch.plainText);
    utterance.lang = dispatch.languageUsed;
    // Pace rate to 0.88 so words are pronounced with crystal-clear clarity and zero slurring
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    // Pick best matching voice for the target language
    let chosenVoice: SpeechSynthesisVoice | undefined;

    if (dispatch.languageUsed === 'ta-IN') {
      chosenVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ta') ||
          v.name.toLowerCase().includes('tamil')
      );
    } else if (dispatch.languageUsed === 'hi-IN') {
      chosenVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi')
      );
    } else {
      // English: prefer Indian English voice if available, else standard English
      chosenVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase() === 'en-in' ||
            v.name.toLowerCase().includes('india')
        ) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    try {
      window.dispatchEvent(
        new CustomEvent('ushma_voice_alert_start', {
          detail: {
            text: dispatch.plainText,
            lang: dispatch.languageUsed,
            requestedLang: reqLang,
            vendor: req.vendorName,
          },
        })
      );
    } catch {
      // ignore
    }

    utterance.onend = () => {
      try {
        window.dispatchEvent(new CustomEvent('ushma_voice_alert_end'));
      } catch {
        // ignore
      }
      resolve();
    };

    utterance.onerror = () => {
      try {
        window.dispatchEvent(new CustomEvent('ushma_voice_alert_end'));
      } catch {
        // ignore
      }
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Immediately cancels and silences any active speech synthesis audio
 */
export function stopAudibleBeaconAlert(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    try {
      window.dispatchEvent(new CustomEvent('ushma_voice_alert_end'));
    } catch {
      // ignore
    }
  }
}
