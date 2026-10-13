/** Physics plus expression state machine. Hitbox stays a fixed circle. */

import { CONFIG } from './config.js';
import { effects } from './effects.js';

const HOLD = {
  run: 0,
  jump: 0,
  land: 0.18,
  excited: 0.45,
  worried: 1.15,
  startled: 1.15,
  hurt: 0.7,
  dizzy: 0.9,
  celebrate: 0.9,
  defeated: 99,
};

export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = CONFIG.playerX;
    this.y = 0;
    this.vy = 0;
    this.r = CONFIG.playerR;
    this.onGround = true;
    this.runT = 0;
    this.dustT = 0;
    this.pose = 'run';
    this.face = 'run';
    this.faceT = 0;
    this.flashT = 0;
    this.glowT = 0;
    this.warnT = 0;
    this.tilt = 0.08;
    this.sx = 1;
    this.sy = 1;
    this.lowHealth = false;
    this.dead = false;
  }

  setGround(y) {
    this.ground = y;
    if (this.onGround) this.y = y;
  }

  jump() {
    if (this.dead || !this.onGround) return false;
    this.vy = CONFIG.jump;
    this.onGround = false;
    this.pose = 'jump';
    this.sx = 0.9;
    this.sy = 1.18;
    return true;
  }

  setFace(name) {
    this.face = name;
    this.faceT = HOLD[name] || 0.4;
  }

  flash() { this.flashT = 0.18; }
  glow() { this.glowT = 0.35; }
  warn() { this.warnT = 0.8; }

  update(dt) {
    this.runT += dt;
    this.vy += CONFIG.gravity * dt;
    this.y += this.vy * dt;
    if (this.y >= this.ground) {
      if (!this.onGround && !this.dead) {
        this.pose = 'land';
        this.sx = 1.18;
        this.sy = 0.82;
        this.setFace(this.face === 'hurt' ? 'dizzy' : this.face);
      }
      this.y = this.ground;
      this.vy = 0;
      this.onGround = true;
    }

    if (this.onGround && this.pose === 'land' && this.sy > 0.98) this.pose = 'run';
    if (this.onGround && this.pose === 'jump') this.pose = 'run';

    this.sx += (1 - this.sx) * Math.min(1, dt * 10);
    this.sy += (1 - this.sy) * Math.min(1, dt * 10);
    this.tilt = this.onGround ? 0.1 : -0.12;

    if (this.faceT > 0) {
      this.faceT -= dt;
      if (this.faceT <= 0 && this.face !== 'defeated') this.face = this.onGround ? 'run' : 'jump';
    }
    if (this.flashT > 0) this.flashT -= dt;
    if (this.glowT > 0) this.glowT -= dt;
    if (this.warnT > 0) this.warnT -= dt;

    if (this.onGround && !this.dead) {
      this.dustT -= dt;
      if (this.dustT <= 0) {
        this.dustT = 0.12;
        effects.puff(this.x - 28, this.y + 10);
      }
    }
  }

  /** Visual bounce only — collision uses x/y/r. */
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.ground + this.r * 0.72, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const bounce = this.onGround && !this.dead ? Math.abs(Math.sin(this.runT * 11)) * 7 : 0;
    const face = this.dead ? 'defeated' : this.onGround ? this.face : (this.face === 'run' ? 'jump' : this.face);
    ctx.save();
    ctx.translate(this.x, this.y - bounce);
    ctx.rotate(this.tilt);
    ctx.scale(this.sx, this.sy);

    if (this.glowT > 0) {
      ctx.shadowColor = '#fff59d';
      ctx.shadowBlur = 22;
    }
    if (this.warnT > 0) {
      ctx.strokeStyle = `rgba(255,80,80,${0.4 + Math.sin(this.runT * 20) * 0.3})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, this.r + 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = this.flashT > 0 ? '#fff' : '#ffd54f';
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#f9a825';
    ctx.lineWidth = 3;
    ctx.stroke();

    this.drawFace(ctx, face);
    ctx.restore();
  }

  drawFace(ctx, face) {
    const tired = this.lowHealth && face === 'run';
    const blink = Math.sin(this.runT * 2.2) > 0.97;
    let eyeH = blink ? 0.15 : 1;
    let mx = 0;
    let mw = 16;
    let mh = 8;
    let smile = 1;

    if (face === 'jump') { eyeH = 1.35; mh = 6; mw = 12; }
    if (face === 'excited' || face === 'celebrate') { eyeH = 0.7; mw = 20; mh = 12; smile = 1.2; }
    if (face === 'worried') { eyeH = 0.55; smile = -0.6; mw = 14; }
    if (face === 'startled') { eyeH = 1.4; smile = -0.2; mw = 10; mh = 10; }
    if (face === 'hurt' || face === 'dizzy') { eyeH = 0.4; smile = -1; mx = 2; }
    if (face === 'defeated') { eyeH = 0.2; smile = -1.2; }
    if (tired) eyeH = Math.min(eyeH, 0.55);

    ctx.fillStyle = '#3e2723';
    const ey = face === 'worried' || tired ? 2 : -6;
    rounded(ctx, -14, ey, 8, 10 * eyeH, 4);
    rounded(ctx, 6, ey, 8, 10 * eyeH, 4);

    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(mx, 10, mw / 2, smile > 0 ? 0.15 : Math.PI + 0.2, smile > 0 ? Math.PI - 0.15 : -0.2);
    ctx.stroke();

    if (face === 'worried') {
      ctx.fillStyle = 'rgba(100,180,255,0.45)';
      ctx.beginPath();
      ctx.arc(-18, 12, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function rounded(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
