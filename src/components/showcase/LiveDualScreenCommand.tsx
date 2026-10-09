import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Phone, AlertTriangle, ShieldCheck, Check, RotateCcw, Play, ArrowRight, User, Heart, Activity } from 'lucide-react';

interface Props {
  onBackToMain?: () => void;
}

export const LiveDualScreenCommand: React.FC<Props> = ({ onBackToMain }) => {
  const [activeSession, setActiveSession] = useState<boolean>(true);
  const [watchState, setWatchState] = useState<'idle' | 'listening' | 'sos' | 'confirmed'>('idle');
  const [isFallSimulated, setIsFallSimulated] = useState<boolean>(false);
  const [phoneRinging, setPhoneRinging] = useState<boolean>(false);
  const [phoneConfirmed, setPhoneConfirmed] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste Rameshwar ji, aap kaise ho aaj? Pichle do ghante mein padosi building ke AC exhaust se garmi zyada lag rahi hai?',
      time: '14:30:12',
    },
    {
      sender: 'user',
      text: 'Haan, thoda aaram chahiye. 54 degree ki garam hawa seedhe thele par aa rahi hai.',
      time: '14:30:28',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [chips, setChips] = useState([
    { label: 'Water Drunk', checked: true },
    { label: 'ORS Sachet', checked: true },
    { label: 'Shade Taken', checked: false },
    { label: 'Rest Active', checked: false },
  ]);

  // Play audio speech synthesis
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const handleWatchCheckIn = () => {
    setWatchState('listening');
    speakText('Namaste Rameshwar ji, aap kaise ho aaj? Pichle do ghante mein aaram mila?');
    setTimeout(() => {
      setTranscript((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Namaste Rameshwar ji, aap kaise ho aaj? Pichle do ghante mein aaram mila?',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 800);
  };

  const handleUserReply = (reply: string) => {
    setWatchState('idle');
    setTranscript((prev) => [
      ...prev,
      {
        sender: 'user',
        text: reply,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setTimeout(() => {
      const botResponse = 'Achha, paani peene ka man hai? Shaded misting canopy 15 meter aage hai.';
      setTranscript((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      speakText(botResponse);
    }, 1200);
  };

  // Simulate Fall & Extreme Heat Lethality
  const handleDropWatchAndFall = () => {
    setIsFallSimulated(true);
    setWatchState('sos');
    setPhoneRinging(true);
    setPhoneConfirmed(false);

    setTranscript((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: 'Are you okay? Rameshwar ji, can you get up?',
        time: new Date().toLocaleTimeString(),
      },
      {
        sender: 'user',
        text: 'Mein... mein uth nahi paa raha hoon. Bohot chakkar aa raha hai.',
        time: new Date().toLocaleTimeString(),
      },
      {
        sender: 'bot',
        text: 'Building security aur Suresh ko bata diya hai. MCD emergency handoff text message bhej diya hai. Thik hai na? Main yahin aapke saath hoon.',
        time: new Date().toLocaleTimeString(),
      },
    ]);

    speakText(
      'Ushma emergency alert. Rameshwar Pal, Laxmi Nagar. Severe heat exhaustion from commercial AC exhaust with inability to stand. Please go to them now. Press 1 now to confirm you are on your way.'
    );
  };

  const handlePress1OnPhone = () => {
    setPhoneRinging(false);
    setPhoneConfirmed(true);
    setWatchState('confirmed');
    speakText('Confirmation received. Suresh is on his way to the alleyway.');
  };

  const handleReset = () => {
    setIsFallSimulated(false);
    setWatchState('idle');
    setPhoneRinging(false);
    setPhoneConfirmed(false);
    setTranscript([
      {
        sender: 'bot',
        text: 'Namaste Rameshwar ji, aap kaise ho aaj? Pichle do ghante mein garmi zyada lag rahi hai?',
        time: '14:30:12',
      },
      {
        sender: 'user',
        text: 'Haan, thoda aaram chahiye, exhaust bohot tez chal raha hai.',
        time: '14:30:28',
      },
    ]);
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen text-slate-900 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              REAL-TIME DUAL-DEVICE VERIFICATION DEMO
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif">
              Live Command Center & Galaxy Wear OS Watch
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Showcase
              </button>
            )}
          </div>
        </div>

        {/* The Dual Device Layout (Exact split from the winning video) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Web Command Center (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-6">
            {/* Command Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-700">
                    RAMESHWAR PAL · 52 (LAXMI NAGAR, WARD 84)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Day 4 · Acute AC Exhaust Heat Hazard: 54°C Canyon Blast
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-semibold">
                  MUNICIPAL WARD DASHBOARD
                </span>
              </div>
            </div>

            {/* Checklist Chips */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const next = [...chips];
                    next[idx].checked = !next[idx].checked;
                    setChips(next);
                  }}
                  className={`px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    chip.checked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <Check className={`w-3 h-3 ${chip.checked ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Live Chat / Transcript Area */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[300px] max-h-[360px] overflow-y-auto space-y-3">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center border-b border-slate-200 pb-1">
                {isFallSimulated ? 'EMERGENCY TRIAGE ACTIVE · LIVE TRANSCRIPT' : 'VOICE CHECK-IN STREAM'}
              </div>

              {transcript.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                    {msg.sender === 'user' ? 'RAMESHWAR (VENDOR)' : 'USHMA-NETRA (ALLY)'} · {msg.time}
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-100 text-amber-950 rounded-br-xs border border-amber-200'
                        : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Escalation Progress Bar (When Fall / Heat Stroke Occurs) */}
            {isFallSimulated && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    AUTONOMOUS ESCALATION PROGRESS
                  </span>
                  <span className="text-red-700 font-bold">
                    {phoneConfirmed ? 'HANDOFF CONFIRMED' : 'WAITING FOR 1ST RESPONDER'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-white border border-amber-200">
                    <div className="text-slate-500">NEIGHBOUR (SURESH)</div>
                    <div className={`font-bold ${phoneConfirmed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {phoneConfirmed ? '✓ CONFIRMED (1)' : 'NOTIFIED (CALLING)'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-amber-200">
                    <div className="text-slate-500">BUILDING SECURITY</div>
                    <div className="font-bold text-emerald-700">✓ TEXT SENT</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-amber-200">
                    <div className="text-slate-500">DAUGHTER (PRIYA)</div>
                    <div className="font-bold text-emerald-700">✓ SMS PUSH</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-amber-200">
                    <div className="text-slate-500">WARD HEALTH OFFICER</div>
                    <div className="font-bold text-emerald-700">✓ QUEUED</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Speak Chips for Presenter */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500">Speak as Rameshwar:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleUserReply('Haan, garmi bohot lag rahi hai, chakkar aa raha hai.')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                >
                  "Haan, chakkar aa raha hai..."
                </button>
                <button
                  onClick={() => handleUserReply('Mein abhi thode paani ki dukan par jaa raha hoon.')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                >
                  "Paani peene jaa raha hoon..."
                </button>
                <button
                  onClick={handleDropWatchAndFall}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate 54°C Collapse / Drop Watch</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Galaxy Wear OS Smartwatch Dial + Handheld Phone (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            {/* The Smartwatch Enclosure */}
            <div className="relative w-80 h-80 rounded-full bg-slate-900 border-8 border-slate-700 p-4 shadow-2xl flex items-center justify-center">
              {/* Watch Outer Ring / Bezel */}
              <div className="absolute inset-2 rounded-full border border-slate-800" />

              {/* Watch Display Face */}
              <div
                className={`w-full h-full rounded-full transition-all duration-500 flex flex-col items-center justify-center p-6 text-center text-white ${
                  watchState === 'sos'
                    ? 'bg-red-700 shadow-[0_0_40px_rgba(239,68,68,0.8)]'
                    : watchState === 'confirmed'
                    ? 'bg-emerald-700 shadow-[0_0_40px_rgba(16,185,129,0.8)]'
                    : 'bg-slate-950'
                }`}
              >
                {/* Watch Status */}
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                  {watchState === 'sos'
                    ? 'SOS · AC HEAT BLOWOUT'
                    : watchState === 'confirmed'
                    ? 'HELP ON THE WAY'
                    : 'USHMA-NETRA (ALLY)'}
                </div>

                {watchState === 'sos' ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-black font-mono tracking-tight animate-pulse text-white">
                      FALL DETECTED
                    </div>
                    <div className="text-xs font-mono text-red-200">
                      48.4°C Canyon Blast · Inability to stand
                    </div>
                    <div className="text-[10px] font-mono text-white/80 bg-red-900/60 px-3 py-1 rounded-full">
                      Escalating to Neighbour & Ward Guard
                    </div>
                  </div>
                ) : watchState === 'confirmed' ? (
                  <div className="space-y-2">
                    <ShieldCheck className="w-10 h-10 text-white mx-auto" />
                    <div className="text-lg font-black font-mono">SURESH IS ON WAY</div>
                    <div className="text-xs text-emerald-200">Stay in current position</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-3xl font-extrabold font-mono text-amber-400">
                      {watchState === 'listening' ? 'LISTENING...' : '14:32'}
                    </div>

                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleWatchCheckIn}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
                      >
                        Check in
                      </button>
                      <button
                        onClick={() => handleUserReply('Haan, thoda aaram mila.')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-full border border-slate-700 transition-all cursor-pointer"
                      >
                        Talk now
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      Wet Bulb: 36.8°C (Extreme)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Handheld Phone Call Simulator (Twilio / Polly IVR Call with Press 1) */}
            {phoneRinging && (
              <div className="w-80 bg-slate-900 border-2 border-amber-500 rounded-3xl p-5 shadow-2xl text-white space-y-4 animate-bounce duration-1000">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-emerald-400">INCOMING EMERGENCY CALL</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Twilio / Polly</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-sm font-bold text-white">Ushma-Netra Emergency Dispatch</div>
                  <div className="text-[11px] text-slate-400 font-mono">+91 11-2244-NETRA</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-mono">
                  "Rameshwar Pal, Laxmi Nagar. Severe heat exhaustion from commercial AC exhaust with inability to stand. Press 1 now to confirm you are on your way."
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <button
                    onClick={handlePress1OnPhone}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-lg cursor-pointer"
                  >
                    1
                  </button>
                  <button className="p-3 bg-slate-800 text-slate-400 rounded-xl text-lg">2</button>
                  <button className="p-3 bg-slate-800 text-slate-400 rounded-xl text-lg">3</button>
                </div>

                <div className="text-center text-[10px] font-mono text-amber-300 animate-pulse">
                  👉 Click button [1] to confirm 1st Responder Handoff
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
