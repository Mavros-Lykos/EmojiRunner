/** Spawn, move, collide. One entity never triggers twice. */

import { CONFIG, EMOJI, pick, clamp } from './config.js';

const TYPES = {
  sad: { glyph: '😢', r: 28, ring: '#1565c0' },
  angry: { glyph: '😡', r: 28, ring: '#e65100' },
  happy: { glyph: '😊', r: 28, ring: '#2e7d32' },
  heart: { glyph: '💖', r: 26, ring: '#c2185b' },
  block: { glyph: '🪵', r: 26, ring: '#5d4037' },
};

export class Entities {
  constructor() {
    this.list = [];
    this.timer = 0.8;
  }

  reset() {
    this.list = [];
    this.timer = 0.8;
  }

  update(dt, speed, lanes, pal, distance) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.spawnPattern(lanes, pal, distance, speed);
      const air = 2 * Math.abs(CONFIG.jump) / CONFIG.gravity;
      const minGap = air * speed * 0.9 + 80;
      const extra = clamp(180 - distance * 0.01, 40, 180);
      this.timer = (minGap + extra) / speed;
    }

    for (const e of this.list) e.x -= speed * dt;
    this.list = this.list.filter((e) => !e.dead && e.x > -60);
  }

  spawnPattern(lanes, pal, distance, speed) {
    const x = CONFIG.W + 50;
    const world = pal.id;
    const hard = distance > 2500;
    const roll = Math.random();
    const y = () => (Math.random() < 0.62 ? lanes.runY : lanes.airY);

    if (distance < 1000) {
      if (roll < 0.42) this.add('happy', x, y(), pal);
      else if (roll < 0.55) this.add('heart', x, y(), pal);
      else if (roll < 0.88) this.add(pick(['sad', 'angry']), x, y(), pal);
      else this.add('block', x, lanes.runY, pal);
    } else if (roll < 0.22) this.add('happy', x, y(), pal);
    else if (roll < 0.32) this.add('heart', x, y(), pal);
    else if (roll < 0.52) this.add(pick(['sad', 'angry']), x, y(), pal);
    else if (roll < 0.7) this.add('block', x, lanes.runY, pal);
    else {
      this.add('block', x, lanes.runY, pal);
      const gap = 110 + speed * 0.12;
      this.add(hard ? pick(['sad', 'angry', 'happy']) : 'happy', x + gap, lanes.airY, pal);
    }

    if (world === 'candy' && Math.random() < 0.35) this.add('happy', x + 150, lanes.airY, pal);
    if (world === 'night' && Math.random() < 0.25) this.add('heart', x + 120, lanes.airY, pal);
  }

  add(type, x, y, pal) {
    const t = TYPES[type];
    this.list.push({
      type,
      x,
      y,
      r: t.r,
      glyph: type === 'block' ? pal.block : t.glyph,
      dead: false,
      neon: pal.id === 'night' && type !== 'block',
    });
  }

  /** First overlapping live entity. Hurts pass through during i-frames. */
  takeHit(player, skipHurt) {
    for (const e of this.list) {
      if (e.dead) continue;
      const hurt = e.type === 'sad' || e.type === 'angry' || e.type === 'block';
      if (skipHurt && hurt) continue;
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      const rad = player.r * 0.78 + e.r * 0.8;
      if (dx * dx + dy * dy < rad * rad) {
        e.dead = true;
        return e;
      }
    }
    return null;
  }

  draw(ctx) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const e of this.list) {
      const ring = TYPES[e.type].ring;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = e.neon ? '#b388ff' : ring;
      ctx.stroke();
      ctx.font = `40px ${EMOJI}`;
      ctx.fillText(e.glyph, e.x, e.y + 2);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}
