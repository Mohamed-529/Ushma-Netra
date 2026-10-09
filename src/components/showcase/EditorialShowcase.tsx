import React from 'react';
import { ArrowRight, Volume2, Shield, Heart, Activity, Check, Play, Flame, Sparkles } from 'lucide-react';

interface Props {
  onTalkToWorker: () => void;
  onExploreWorld: () => void;
  onOpenStack: () => void;
}

export const EditorialShowcase: React.FC<Props> = ({
  onTalkToWorker,
  onExploreWorld,
  onOpenStack,
}) => {
  return (
    <div className="w-full bg-[#fbf9f5] text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Header (Matching Suraksha Video at 00:00) */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold">
            <Flame className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-950 font-serif">
            Ushma-Netra
          </span>
        </div>

        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-slate-950 transition-colors">How it works</a>
          <button onClick={onOpenStack} className="hover:text-slate-950 transition-colors cursor-pointer">Stack</button>
          <a href="#on-the-cart" className="hover:text-slate-950 transition-colors">Vendor</a>
          <button
            onClick={onExploreWorld}
            className="px-4 py-2 bg-[#d9381e] hover:bg-[#b82e17] text-white rounded-full font-bold transition-all shadow-sm cursor-pointer"
          >
            Explore the world
          </button>
        </nav>
      </header>

      {/* 2. Hero Section (Matching Suraksha Video at 00:01 - 00:05) */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
            NOT SHUTTING DOWN THE CITY · AN ALLY FOR CANYON RESILIENCE
          </div>

          <div className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
            USHMA-NETRA
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-950 tracking-tight leading-[0.98] font-serif">
            Helps cities cool <br />
            <span className="text-[#d9381e]">without suffocating.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl font-light leading-relaxed">
            Ushma-Netra learns what's normal for Rameshwar — then checks in with him first. Building owners only hear when commercial AC exhaust is actually off, and only the person who can actually deflect shows up. Most days, Ushma-Netra says nothing at all. That's the point.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onTalkToWorker}
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span>Talk to Rameshwar</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={onExploreWorld}
              className="px-6 py-3.5 bg-transparent hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Explore the world
            </button>
          </div>
        </div>

        {/* Right Column: Floating Companion Card (Matching video 00:03) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-slate-900">Ushma-Netra</span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">DAY 04</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                LIVE · LoRaWAN · COMPANION · QUIET
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">WORKER</span>
                <strong className="text-slate-800">Rameshwar</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">PLACE</span>
                <strong className="text-slate-800">At cart</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ACTION</span>
                <strong className="text-slate-800">Quiet</strong>
              </div>
            </div>

            {/* Conversation Preview */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                <span className="text-[10px] font-mono text-slate-400 block">USHMA-NETRA</span>
                Good morning. Don't forget your hydration sachet after 11am today.
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-950 text-right">
                <span className="text-[10px] font-mono text-amber-600 block">RAMESHWAR</span>
                I will. Tell Suresh I'll shift to his shade if the plaza AC gets bad.
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                <span className="text-[10px] font-mono text-slate-400 block">USHMA-NETRA</span>
                I'll let Suresh know. That's all from me.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier Progression Strip (Matching Suraksha Video 00:04) */}
      <div className="border-y border-slate-200 bg-white/70 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
          <div>
            <div className="font-bold text-slate-900">T1</div>
            <div className="text-slate-500 uppercase text-[10px]">CHECK IN WITH WORKER</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">T2</div>
            <div className="text-slate-500 uppercase text-[10px]">ALERT BUILDING FACILITY</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">T3</div>
            <div className="text-slate-500 uppercase text-[10px]">ESCALATE ONLY IF NEEDED</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 uppercase text-[10px]">SCROLL THE STORY</div>
            <div className="font-bold text-[#d9381e]">↓</div>
          </div>
        </div>
      </div>

      {/* 3. "THE GAP" Section (Matching Suraksha Video 00:06) */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400">THE GAP</div>
        <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight font-serif">
          Commercial towers want comfort. <br />
          Street workers want to survive. <br />
          Both belong in the city.
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Air conditioners steal street air. Silence leaves workers fainting. Ushma-Netra sits in between: learns the alleyway's normal, talks to him first, and only then coordinates the building and municipal teams on AWS.
        </p>
      </section>

      {/* 4. "HOW IT WORKS" Section (The 6 Cards from video 00:08 - 00:13) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-2">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400">HOW IT WORKS</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-serif">
            Understand. Detect. Ask him. Then city.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="text-xs font-mono font-bold text-slate-400">01</div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Learn what's normal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ambient solar window, natural wind draft, how long the afternoon peak lasts, what the alley actually sounds like. Thirteen days of seeded micro-canyon history — lock the baseline.
            </p>
            <div className="text-[10px] font-mono text-slate-400 uppercase">ROUTINE MODEL</div>
          </div>

          {/* Card 02 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="text-xs font-mono font-bold text-slate-400">02</div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Companion, not a monitor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Good morning. Don't forget your hydration sachet. Tell Suresh about the cart spot." The Companion Agent is the only voice Rameshwar hears. The city hears nothing.
            </p>
            <div className="text-[10px] font-mono text-slate-400 uppercase">COMPANION AGENT · TIER 1</div>
          </div>

          {/* Card 03 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="text-xs font-mono font-bold text-slate-400">03</div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Notice a real deviation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              64 AC outdoor units surge to 100%. Plume exceeds 52°C. Wet Bulb Globe Temperature crosses 36.8°C. Two moderate signals or one strong one is enough. Not a binary alarm.
            </p>
            <div className="text-[10px] font-mono text-slate-400 uppercase">WATCH SIGNAL · ROUTINE MODEL</div>
          </div>

          {/* Card 04 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="text-xs font-mono font-bold text-slate-400">04</div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Ask Rameshwar first</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "You're usually fine by now — everything okay?" Investigation happens before anyone in the municipality or family is looped in. Dignity first.
            </p>
            <div className="text-[10px] font-mono text-slate-400 uppercase">INVESTIGATION AGENT · TIER 1 — ASK HIM FIRST</div>
          </div>

          {/* Card 05 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="text-xs font-mono font-bold text-slate-400">05</div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Coordinate the right party</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ushma-Netra asks building facility manager first and waits for a real reply. If no response, steps up to upward deflector mandate. A calm update, not a panic alert.
            </p>
            <div className="text-[10px] font-mono text-slate-400 uppercase">FACILITY COORDINATION AGENT · TIER 2</div>
          </div>

          {/* Card 06 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="text-xs font-mono font-bold text-slate-400">06</div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Escalate only if necessary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              MCD ward officer is contacted and Section 133 statutory notice is issued only if the building continues dumping unmitigated heat. Most days never reach Tier 3.
            </p>
            <div className="text-[10px] font-mono text-slate-400 uppercase">TIER 3 · CONFIRMATION</div>
          </div>
        </div>
      </section>

      {/* 5. "THE SPINE" Section (Matching Suraksha Video 00:14) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400">THE SPINE</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 font-serif leading-tight">
              One orchestrator. <br />
              Five specialists. <br />
              Nothing skips the tier.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Companion, Routine Model, Signal Model, Investigation, and Facility Coordination run on Strands and Bedrock. Every tool call passes a Cedar consent check. Every decision is logged for her to read. Building never gets a ping unless the orchestrator decides Tier 2.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Orchestrator</strong>
                <span className="text-[11px] text-slate-500">STRANDS · BEDROCK NOVA 1.0 PRO · TIER POLICY IN CODE</span>
              </div>
              <span className="text-slate-400 text-[10px]">Owns deviation + who may speak</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Companion Agent</strong>
                <span className="text-[11px] text-slate-500">HINDI + ENGLISH VOICE · SHIVAM TTS · POLLY KAJAL</span>
              </div>
              <span className="text-slate-400 text-[10px]">The only agent Rameshwar perceives</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Routine Model Agent</strong>
                <span className="text-[11px] text-slate-500">13 SIMULATED DAYS · LIVE TODAY</span>
              </div>
              <span className="text-slate-400 text-[10px]">What's normal for this canyon</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Watch Signal Agent</strong>
                <span className="text-[11px] text-slate-500">WBGT EDGE · 54°C JET · SENSIRION SHT40</span>
              </div>
              <span className="text-slate-400 text-[10px]">Quiet edge signals</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Investigation Agent</strong>
                <span className="text-[11px] text-slate-500">WARM CHECK-IN BEFORE MUNICIPALITY</span>
              </div>
              <span className="text-slate-400 text-[10px]">Tier 1 — ask him first</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Facility Coordination Agent</strong>
                <span className="text-[11px] text-slate-500">BUILDING MANAGER · STEP FUNCTIONS · WEB PUSH</span>
              </div>
              <span className="text-slate-400 text-[10px]">The right party, calmly</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "ON THE WRIST" Section (Matching Suraksha Video 00:19) */}
      <section id="on-the-cart" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Watch Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-72 h-72 rounded-full bg-slate-900 border-8 border-slate-700 p-4 shadow-2xl flex flex-col items-center justify-center text-center text-white">
            <div className="text-[10px] font-mono text-slate-400">GALAXY WEAR OS</div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 my-2">14:32</div>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              OK
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-2">One tap: "I'm okay"</div>
          </div>
        </div>

        {/* Text Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400">ON THE CART / ON THE WRIST</div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-950 font-serif leading-tight">
            The watch notices. <br />
            Rameshwar stays in charge.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            First movement of the day. A quiet 'I'm okay' tap. He can dismiss a nudge without talking. That agency is the product — not another surveillance camera in the alleyway.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong>First movement</strong>
              <div className="text-slate-500">Cart wheeled to street corner</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong>I'm okay</strong>
              <div className="text-slate-500">One tap, no voice needed</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong>WBGT & Temperature</strong>
              <div className="text-slate-500">Quiet thermal signals, not alarms</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong>Ushma-Netra on wrist</strong>
              <div className="text-slate-500">Companion, not an overseer</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer Strip */}
      <footer className="border-t border-slate-200 py-8 bg-white text-xs font-mono text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>USHMA-NETRA · TRACK 02 (HEAT & WATER) · AWS ENVIRONMENTAL HACKATHON</div>
          <div className="flex gap-4">
            <button onClick={onOpenStack} className="hover:text-slate-900 cursor-pointer">AWS Architecture</button>
            <button onClick={onExploreWorld} className="hover:text-slate-900 cursor-pointer">3D World Quest</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
