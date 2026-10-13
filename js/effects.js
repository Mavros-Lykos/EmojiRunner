/** Particles, floating text, and screen shake. */

export const effects = {
  bits: [],
  floats: [],
  shake: 0,

  spawn(x, y, n, color, speed = 90) {
    for (let i = 0; i < n; i += 1) {
      this.bits.push({
        x, y,
        vx: (Math.random() - 0.5) * speed,
        vy: -Math.random() * speed,
        life: 0.5 + Math.random() * 0.4,
        t: 0,
        r: 2 + Math.random() * 3,
        color,
        glyph: '',
      });
    }
  },

  puff(x, y) {
    this.bits.push({
      x, y, vx: -40, vy: -10, life: 0.35, t: 0, r: 6, color: 'rgba(80,60,40,0.35)', glyph: '',
    });
  },

  sparkle(x, y) {
    const glyphs = ['✨', '💕', '★'];
    for (let i = 0; i < 6; i += 1) {
      this.bits.push({
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 40,
        vy: -30 - Math.random() * 40,
        life: 0.6,
        t: 0,
        r: 10,
        color: '#fff',
        glyph: glyphs[i % glyphs.length],
      });
    }
  },

  float(text, x, y, color = '#fff') {
    this.floats.push({ text, x, y, t: 0, life: 1, color });
  },

  bump(n = 8) { this.shake = Math.max(this.shake, n); },

  update(dt) {
    this.shake *= 0.86;
    if (this.shake < 0.2) this.shake = 0;
    this.bits = this.bits.filter((p) => {
      p.t += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt;
      return p.t < p.life;
    });
    this.floats = this.floats.filter((f) => {
      f.t += dt;
      f.y -= 42 * dt;
      return f.t < f.life;
    });
  },

  draw(ctx) {
    for (const p of this.bits) {
      const a = 1 - p.t / p.life;
      ctx.globalAlpha = a;
      if (p.glyph) {
        ctx.font = '14px serif';
        ctx.fillText(p.glyph, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.font = '700 18px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    for (const f of this.floats) {
      ctx.globalAlpha = 1 - f.t / f.life;
      ctx.fillStyle = '#000';
      ctx.fillText(f.text, f.x + 1, f.y + 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  },

  offset() {
    if (!this.shake) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shake,
      y: (Math.random() - 0.5) * this.shake,
    };
  },
};
