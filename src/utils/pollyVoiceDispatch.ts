/**
 * Ushma-Netra Amazon Polly Trilingual Voice Alert Engine (Tamil, English, Hindi)
 *
 * Provides production-grade trilingual (ta-IN / en-IN / hi-IN)
 * acoustic dispatch generation with Amazon Polly SSML, plus Web Speech API
 * browser playback so the audio speaks out loud immediately in AirPods or speakers.
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
}

/**
 * Builds Amazon Polly SSML and localized payload for Tamil, English, or Hindi
 */
export function buildPollySSML(req: PollyDispatchRequest): PollyDispatchResult {
  const wbgt = req.measuredWbgt;
  const kiosk = req.kioskName || 'T. Nagar Municipal Mist Station #02';
  const dist = req.nearestKioskMeters || 35;
  const vendor = req.vendorName || 'Street Vendor';
  const lang = req.preferredLanguage || 'ta-IN';

  const severity: 'CAUTION' | 'DANGER' | 'EMERGENCY' =
    wbgt >= 37.0 ? 'EMERGENCY' : wbgt >= 34.5 ? 'DANGER' : 'CAUTION';

  let plainText = '';
  if (lang === 'ta-IN') {
    plainText = `எச்சரிக்கை! உஷ்மா நேத்ரா வெப்ப அலர்ட். ${vendor}, வெட்-பல்ப் வெப்பநிலை ${wbgt.toFixed(1)} டிகிரி செல்சியஸை தாண்டியுள்ளது. உடனடியாக ${dist} மீட்டர் தூரத்தில் உள்ள குளிர் நீராவி மையத்திற்கு செல்லவும்.`;
  } else if (lang === 'en-IN') {
    plainText = `Warning! Ushma-Netra heat emergency. ${vendor}, wet-bulb temperature has crossed ${wbgt.toFixed(1)} degrees Celsius. Please move ${dist} meters to ${kiosk} for cooling mist and hydration.`;
  } else {
    plainText = `चेतावनी! आपातकालीन हीट अलर्ट। ${vendor}, वेट-बल्ब तापमान ${wbgt.toFixed(1)} डिग्री सेल्सियस पार कर चुका है। तुरंत ${dist} मीटर दूर ${kiosk} पर जाएं।`;
  }

  const ssml = `
<speak>
  <amazon:auto-breaths>
    <prosody rate="${severity === 'EMERGENCY' ? '104%' : '100%'}" pitch="${severity === 'EMERGENCY' ? '+6%' : '0%'}">
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
    audioPromptDurationSec: severity === 'EMERGENCY' ? 8.4 : 5.8,
    warningSeverity: severity,
  };
}

/**
 * Executes audible browser playback through Web Speech API synthesis
 * with localized Tamil (ta-IN), Indian English (en-IN), or Hindi (hi-IN) voice.
 * Also plays synthesized municipal chime tone before speaking in AirPods.
 */
export function playAudibleBeaconAlert(req: PollyDispatchRequest): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch {
      // AudioContext unavailable
    }

    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const result = buildPollySSML(req);
    const targetLang =
      req.preferredLanguage === 'ta-IN'
        ? 'ta-IN'
        : req.preferredLanguage === 'en-IN'
        ? 'en-IN'
        : 'hi-IN';

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = result.plainText;
    utterance.lang = targetLang;
    utterance.rate = 1.0;
    utterance.pitch = req.measuredWbgt >= 37.0 ? 1.1 : 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.slice(0, 2))) ||
      voices.find((v) => v.lang.includes('IN'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
