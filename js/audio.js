/** Tiny Web Audio SFX + biome arpeggio. Starts on first user gesture. */

const SCALES = {
  meadow: [523, 659, 784, 988],
  forest: [392, 494, 587, 740],
  candy: [587, 740, 880, 1175],
  desert: [349, 440, 523, 659],
  night: [330, 415, 494, 622],
};

class AudioBus {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.musicTimer = 0;
    this.step = 0;
    this.worldId = 'meadow';
  }

  unlock() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on && this.ctx && this.ctx.state === 'running') this.ctx.suspend();
    else if (on && this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  beep(freq, dur = 0.12, type = 'square', gain = 0.06) {
    if (!this.enabled || !this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + dur);
  }

  jump() { this.beep(520, 0.1, 'triangle', 0.05); }
  pickup() { this.beep(880, 0.1); this.beep(1320, 0.14); }
  heart() { this.beep(660, 0.12); this.beep(990, 0.18); }
  strike() { this.beep(220, 0.16, 'sawtooth', 0.05); }
  hurt() { this.beep(140, 0.28, 'sawtooth', 0.07); }
  banner() { this.beep(523, 0.12); this.beep(784, 0.2); }
  over() { this.beep(180, 0.4, 'triangle', 0.07); }

  /** Soft looping notes that change with biome. */
  tick(dt, worldId) {
    this.worldId = worldId;
    if (!this.enabled || !this.ctx) return;
    this.musicTimer -= dt;
    if (this.musicTimer > 0) return;
    this.musicTimer = 0.42;
    const scale = SCALES[worldId] || SCALES.meadow;
    this.beep(scale[this.step % scale.length], 0.18, 'sine', 0.018);
    this.step += 1;
  }
}

export const audio = new AudioBus();
