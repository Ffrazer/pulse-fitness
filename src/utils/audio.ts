/**
 * Web Audio API synthesizer for workout timer beeps and reminder alarms
 * Works offline, no external audio file dependencies
 */
class SoundService {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Short tick for countdown (3, 2, 1)
   */
  public playTick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Celebratory chime when rest timer completes or set is done
   */
  public playTimerFinish() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const startTime = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.1);

        gain.gain.setValueAtTime(0.2, startTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + idx * 0.1);
        osc.stop(startTime + idx * 0.1 + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Alarm sound for scheduled workout reminder
   */
  public playReminderAlert() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const startTime = this.ctx.currentTime;
      const beeps = [880, 880, 1174.66]; // A5, A5, D6

      beeps.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.18);

        gain.gain.setValueAtTime(0.25, startTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.18 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + idx * 0.18);
        osc.stop(startTime + idx * 0.18 + 0.15);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundService();
