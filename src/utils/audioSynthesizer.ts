// Web Audio API pure synthesizer for ambient air conditioner hum and thermal wind
// Completely self-contained: zero external network assets, runs locally in browser

class ThermalAudioEngine {
  private ctx: AudioContext | null = null;
  private compressorOsc1: OscillatorNode | null = null;
  private compressorOsc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 1.2);
      this.masterGain.connect(this.ctx.destination);

      // Low frequency hum (AC compressor motor 52Hz + 104Hz harmonic)
      this.compressorOsc1 = this.ctx.createOscillator();
      this.compressorOsc1.type = 'sawtooth';
      this.compressorOsc1.frequency.setValueAtTime(52, now); // ~50Hz line frequency AC motor

      const compFilter = this.ctx.createBiquadFilter();
      compFilter.type = 'lowpass';
      compFilter.frequency.setValueAtTime(140, now);

      const compGain = this.ctx.createGain();
      compGain.gain.setValueAtTime(0.35, now);

      this.compressorOsc1.connect(compFilter);
      compFilter.connect(compGain);
      compGain.connect(this.masterGain);
      this.compressorOsc1.start();

      // Second harmonic sub-drone
      this.compressorOsc2 = this.ctx.createOscillator();
      this.compressorOsc2.type = 'sine';
      this.compressorOsc2.frequency.setValueAtTime(104, now);
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.15, now);
      this.compressorOsc2.connect(osc2Gain);
      osc2Gain.connect(this.masterGain);
      this.compressorOsc2.start();

      // Atmospheric thermal wind / fan hiss (filtered white noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setValueAtTime(420, now);
      this.filterNode.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      this.noiseNode.start();

      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio synthesis unavailable or blocked:', e);
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain) {
      this.isPlaying = false;
      return;
    }
    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      try {
        this.compressorOsc1?.stop();
        this.compressorOsc2?.stop();
        this.noiseNode?.stop();
        this.compressorOsc1?.disconnect();
        this.compressorOsc2?.disconnect();
        this.noiseNode?.disconnect();
      } catch {
        // already stopped
      }
      this.isPlaying = false;
    }, 900);
  }

  public playSpikeAlert() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.45);
    } catch {
      // Audio not permitted
    }
  }
}

export const soundEngine = new ThermalAudioEngine();
