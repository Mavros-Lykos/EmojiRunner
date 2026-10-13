/** Biome progression, palette blends, parallax scenery, intro banners. */

import { CONFIG, WORLDS, EMOJI, layout, lerpHex, rand, pick, worldIndex } from './config.js';
import { audio } from './audio.js';

export class WorldManager {
  constructor() {
    this.idx = 0;
    this.from = WORLDS[0];
    this.to = WORLDS[0];
    this.blend = 1;
    this.scroll = [0, 0, 0, 0];
    this.decor = [];
    this.ambient = [];
    this.bannerAt = -1;
  }

  reset() {
    this.idx = 0;
    this.from = WORLDS[0];
    this.to = WORLDS[0];
    this.blend = 1;
    this.scroll = [0, 0, 0, 0];
    this.decor = [];
    this.ambient = [];
    this.bannerAt = -1;
    this.seedDecor(true);
  }

  palette() {
    const a = this.from;
    const b = this.to;
    const t = this.blend;
    return {
      sky0: lerpHex(a.sky[0], b.sky[0], t),
      sky1: lerpHex(a.sky[1], b.sky[1], t),
      hill: lerpHex(a.hill, b.hill, t),
      hill2: lerpHex(a.hill2, b.hill2, t),
      ground: lerpHex(a.ground, b.ground, t),
      dirt: lerpHex(a.dirt, b.dirt, t),
      lane: lerpHex(a.lane, b.lane, t),
      id: b.id,
      name: b.name,
      block: b.block,
      decor: b.decor,
    };
  }

  update(dt, distance, speed, showBanner) {
    const next = worldIndex(distance);
    if (next !== this.idx) {
      this.from = this.paletteAsWorld();
      this.to = WORLDS[next];
      this.idx = next;
      this.blend = 0;
      this.ambient = [];
      showBanner(this.to.banner);
      audio.banner();
    }
    if (this.blend < 1) this.blend = Math.min(1, this.blend + dt / CONFIG.blendTime);

    const pal = this.palette();
    const rates = [0.15, 0.35, 0.6, 1];
    for (let i = 0; i < 4; i += 1) this.scroll[i] += speed * rates[i] * dt;

    this.decor = this.decor.filter((d) => {
      d.x -= speed * d.par * dt;
      return d.x > -80;
    });
    this.ambient = this.ambient.filter((d) => {
      d.x -= speed * d.par * dt;
      d.phase += dt;
      d.y = d.base + Math.sin(d.phase) * 10;
      return d.x > -40;
    });

    if (this.decor.length < 10) this.addDecor(pal, CONFIG.W + rand(40, 180));
    if (this.ambient.length < 5) this.addAmbient(pal);

    audio.tick(dt, pal.id);
    return pal;
  }

  paletteAsWorld() {
    const p = this.palette();
    return {
      ...this.to,
      sky: [p.sky0, p.sky1],
      hill: p.hill,
      hill2: p.hill2,
      ground: p.ground,
      dirt: p.dirt,
      lane: p.lane,
    };
  }

  seedDecor(full) {
    const pal = this.palette();
    this.decor = [];
    this.ambient = [];
    const n = full ? 14 : 6;
    for (let i = 0; i < n; i += 1) this.addDecor(pal, rand(0, CONFIG.W));
  }

  addDecor(pal, x) {
    this.decor.push({
      emoji: pick(pal.decor),
      x,
      yOff: rand(0, 36),
      s: rand(0.85, 1.15),
      par: pick([0.35, 0.6, 0.85]),
      a: this.blend < 1 ? 0 : 1,
    });
  }

  addAmbient(pal) {
    const glyphs = {
      meadow: ['🐦', '🦋'],
      forest: ['🍃', '✨'],
      candy: ['⭐', '💫'],
      desert: ['·', '✦'],
      night: ['✨', '🌟'],
    };
    this.ambient.push({
      emoji: pick(glyphs[pal.id] || ['✨']),
      x: CONFIG.W + this.ambient.length * 200 + rand(0, 80),
      base: rand(36, Math.max(70, layout().airY - 36)),
      y: 0,
      phase: rand(0, 6),
      par: 0.25,
      wobble: rand(8, 24),
      s: rand(0.7, 1.2),
    });
  }

  draw(ctx, h) {
    const pal = this.palette();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, pal.sky0);
    g.addColorStop(1, pal.sky1);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CONFIG.W, h);

    const lane = layout();
    this.drawHills(ctx, lane.trackTop - 78, pal.hill2, this.scroll[1], 20);
    this.drawHills(ctx, lane.trackTop - 28, pal.hill, this.scroll[2], 12);

    ctx.font = `28px ${EMOJI}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (const d of this.decor) {
      d.a = Math.min(0.85, d.a + 0.02);
      ctx.globalAlpha = d.a;
      ctx.save();
      ctx.translate(d.x, lane.trackTop - 8 - d.yOff);
      ctx.scale(d.s, d.s);
      ctx.fillText(d.emoji, 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 0.9;
    ctx.font = `20px ${EMOJI}`;
    ctx.textBaseline = 'middle';
    for (const a of this.ambient) ctx.fillText(a.emoji, a.x, a.y);
    ctx.globalAlpha = 1;

    if (pal.id === 'forest') this.drawBeams(ctx, lane.trackTop);
    if (pal.id === 'desert') this.drawShimmer(ctx, lane.trackTop);
    if (pal.id === 'night') this.drawStars(ctx);

    this.drawTrack(ctx, pal, lane, h);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  /** Opaque path so scenery never sits in the play lane. */
  drawTrack(ctx, pal, lane, h) {
    ctx.fillStyle = pal.ground;
    ctx.fillRect(0, lane.ground, CONFIG.W, h);
    ctx.fillStyle = pal.dirt;
    ctx.fillRect(0, lane.trackTop - 8, CONFIG.W, lane.trackH + 16);
    ctx.fillStyle = pal.lane;
    ctx.fillRect(0, lane.trackTop, CONFIG.W, lane.trackH);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(0, lane.trackTop, CONFIG.W, 5);
    ctx.fillRect(0, lane.ground - 5, CONFIG.W, 5);

    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    const mid = lane.trackTop + lane.trackH * 0.5;
    const off = this.scroll[3] % 56;
    for (let x = -off; x < CONFIG.W; x += 56) ctx.fillRect(x, mid - 3, 26, 6);

    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.setLineDash([14, 16]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, lane.airY);
    ctx.lineTo(CONFIG.W, lane.airY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawHills(ctx, y, color, scroll, amp) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, CONFIG.H);
    for (let x = 0; x <= CONFIG.W; x += 8) {
      const yy = y + Math.sin((x + scroll) * 0.012) * amp;
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(CONFIG.W, CONFIG.H);
    ctx.fill();
  }

  drawBeams(ctx, groundY) {
    ctx.fillStyle = 'rgba(255,236,160,0.08)';
    for (let i = 0; i < 4; i += 1) {
      const x = ((this.scroll[0] * 0.2 + i * 220) % (CONFIG.W + 120)) - 40;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 70, 0);
      ctx.lineTo(x + 40, groundY);
      ctx.lineTo(x - 20, groundY);
      ctx.fill();
    }
  }

  drawShimmer(ctx, groundY) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#fff8e1';
    for (let i = 0; i < 6; i += 1) {
      const y = groundY - 30 + Math.sin(this.scroll[0] * 0.02 + i) * 6;
      ctx.fillRect(0, y + i * 4, CONFIG.W, 2);
    }
    ctx.restore();
  }

  drawStars(ctx) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 97 + this.scroll[0] * 0.05) % CONFIG.W;
      const y = (i * 37) % 180;
      ctx.globalAlpha = 0.4 + Math.sin(this.scroll[0] * 0.01 + i) * 0.3;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
  }
}
