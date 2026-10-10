/**
 * Ushma-Netra Amazon Polly Bilingual Voice Alert Engine
 * 
 * Provides production-grade bilingual (Hindi/English - hi-IN / en-IN)
 * acoustic dispatch generation with Amazon Polly SSML, plus Web Speech API
 * browser playback fallback so the audio speaks out loud immediately on demo
 * devices even when offline.
 */

export interface PollyDispatchRequest {
  vendorName: string;
  measuredWbgt: number;
  nearestKioskMeters: number;
  exhaustTemp?: number;
  kioskName?: string;
  preferredLanguage?: 'hi-IN' | 'en-IN' | 'bilingual';
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
 * Builds Amazon Polly SSML and dual-script payload
 */
export function buildPollySSML(req: PollyDispatchRequest): PollyDispatchResult {
  const wbgt = req.measuredWbgt;
  const kiosk = req.kioskName || 'Chandi Chowk Municipal Mist Station #03';
  const dist = req.nearestKioskMeters || 45;
  const vendor = req.vendorName || 'Street Vendor';

  const severity: 'CAUTION' | 'DANGER' | 'EMERGENCY' =
    wbgt >= 37.0 ? 'EMERGENCY' : wbgt >= 34.5 ? 'DANGER' : 'CAUTION';

  const plainText =
    wbgt >= 37.0
      ? `चेतावनी! आपातकालीन हीट अलर्ट। ${vendor}, वेट-बल्ब तापमान ${wbgt.toFixed(1)} डिग्री सेल्सियस पार कर चुका है। तुरंत ${dist} मीटर दूर ${kiosk} पर जाएं। Warning! Severe heat emergency. WBGT critical at ${wbgt.toFixed(1)}°C. Proceed immediately to nearest mist station.`
      : `ऊष्मा-नेत्र चेतावनी। ${vendor}, तापमान ${wbgt.toFixed(1)} डिग्री सेल्सियस है। कृपया ${dist} मीटर दूर कूलिंग कियोस्क पर जाएं और ओआरएस घोल पिएं। Ushma-Netra Advisory: High thermal stress detected. Rest and hydrate at misting shelter.`;

  const ssml = `
<speak>
  <amazon:auto-breaths>
    <prosody rate="${severity === 'EMERGENCY' ? '106%' : '100%'}" pitch="${severity === 'EMERGENCY' ? '+8%' : '0%'}">
      ${
        severity === 'EMERGENCY'
          ? `<emphasis level="strong">चेतावनी! आपातकालीन हीट अलर्ट!</emphasis> 
             <break time="250ms"/>
             ${vendor} जी, आपके कार्यस्थल पर वेट-बल्ब तापमान ${wbgt.toFixed(1)} डिग्री सेल्सियस पहुंच गया है। 
             <break time="300ms"/>
             <lang xml:lang="en-IN">Immediate heat stroke hazard detected from high-velocity AC condenser plume.</lang>
             <break time="200ms"/>
             कृपया काम रोकें और तुरंत <emphasis level="moderate">${dist} मीटर</emphasis> दूर स्थित <lang xml:lang="en-IN">${kiosk}</lang> पर पहुंचकर ओआरएस पानी पिएं।`
          : `सावधान! ${vendor} जी, वेट-बल्ब तापमान ${wbgt.toFixed(1)} डिग्री सेल्सियस है।
             <break time="200ms"/>
             <lang xml:lang="en-IN">Caution: elevated urban canyon thermal debt.</lang>
             निकटतम कूलिंग शेल्टर ${dist} मीटर की दूरी पर उपलब्ध है।`
      }
    </prosody>
  </amazon:auto-breaths>
</speak>
  `.trim();

  return {
    ssml,
    plainText,
    voiceId: 'Kajal', // Amazon Polly Neural bilingual Hindi/Indian English voice
    engine: 'neural',
    audioPromptDurationSec: severity === 'EMERGENCY' ? 8.4 : 5.8,
    warningSeverity: severity,
  };
}

/**
 * Executes audible browser playback through Web Speech API synthesis
 * with localized Hindi or Indian-accented English phonetic voicing.
 * Also plays synthesized municipal buzzer chime tone before speaking.
 */
export function playAudibleBeaconAlert(req: PollyDispatchRequest): Promise<void> {
  return new Promise((resolve) => {
    // 1. Play realistic municipal alarm chime using Web Audio API oscillator
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35); // drop to A4

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch {
      // AudioContext unavailable or restricted
    }

    // 2. Web Speech API playback
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const result = buildPollySSML(req);
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = result.plainText;
    utterance.rate = 1.02;
    utterance.pitch = req.measuredWbgt >= 37.0 ? 1.15 : 1.0;

    // Detect if a Hindi or Indian English voice exists in the browser
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = hindiVoice.lang;
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    // Trigger speech synthesis
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 400); // 400ms after initial alert chime
  });
}
