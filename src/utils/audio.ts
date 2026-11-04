/**
 * Gentle Web Audio Synthesizer for Soothely AI.
 * Creates meditative tones and ambient sounds without external audio assets.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private isAmbientPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Warm meditative bell chime (432Hz tuning style)
   */
  public playWarmChime(frequency = 528) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      // Warm harmonic overtone
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(frequency * 1.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      overtoneGain.gain.setValueAtTime(0.001, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(ctx.destination);
      overtoneGain.connect(ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 2.5);
      overtone.stop(now + 2.5);
    } catch {
      // Audio might be blocked until user gesture, safely ignore
    }
  }

  /**
   * Subtle soft pop for completing a task or check-in
   */
  public playSoftCompletion() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // ignore
    }
  }

  /**
   * Toggle ambient soothing drone
   */
  public toggleAmbientSound(type: 'calm_drone' | 'rain' = 'calm_drone'): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient(type);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  private startAmbient(type: 'calm_drone' | 'rain') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      this.stopAmbient();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
      this.ambientGain.connect(ctx.destination);

      if (type === 'calm_drone') {
        // Binaural soothing harmonic chord (F chord warm pads)
        const freqs = [174, 261.63, 392, 523.25];
        this.ambientOscillators = freqs.map((f) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 400;

          osc.type = 'sine';
          osc.frequency.value = f;
          osc.connect(filter);
          filter.connect(this.ambientGain!);
          osc.start();
          return osc;
        });
      } else {
        // Gentle pink noise rain simulation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        noise.connect(filter);
        filter.connect(this.ambientGain);
        noise.start();
        this.ambientOscillators = [noise];
      }

      this.isAmbientPlaying = true;
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        this.ambientOscillators = [];
        this.isAmbientPlaying = false;
      }, 550);
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundManager = new AudioSynthesizer();
