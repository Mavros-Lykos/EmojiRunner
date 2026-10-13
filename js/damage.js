/**
 * Centralized two-strike damage.
 * Sad → water, angry → energy. Counters never mix.
 * Restores may refill bars but must not clear strike counts.
 */
import { CONFIG } from './config.js';
import { audio } from './audio.js';
import { effects } from './effects.js';

export function applyResourceStrike(state, player, kind) {
  const now = state.time;
  if (now - state.lastHit[kind] < CONFIG.hitCooldown) return;
  state.lastHit[kind] = now;

  const isSad = kind === 'sad';
  const res = isSad ? 'water' : 'energy';
  const hits = isSad ? 'waterStrikes' : 'energyStrikes';
  const label = isSad ? 'WATER' : 'ENERGY';

  state[res] = Math.max(0, state[res] - CONFIG.strikeDrop);
  state[hits] += 1;
  const n = state[hits];

  effects.float(`${label} STRIKE ${n}/${CONFIG.strikeMax}!`, player.x, player.y - 50, isSad ? '#81d4fa' : '#ffcc80');
  effects.spawn(player.x, player.y, 8, isSad ? '#4fc3f7' : '#ff8a65');
  player.flash();
  player.warn();
  player.setFace(isSad ? 'worried' : 'startled');
  audio.strike();
  state.safeT = 0.7;
  pulseHud(isSad ? 'waterChip' : 'energyChip');

  // Completing strike: one heart, then reset that resource only.
  if (n >= CONFIG.strikeMax || state[res] <= 0) {
    state[res] = 0;
    loseHeart(state, player);
    state[res] = 100;
    state[hits] = 0;
  }
}

export function restoreMeters(state, amount = CONFIG.restore) {
  state.water = Math.min(100, state.water + amount);
  state.energy = Math.min(100, state.energy + amount);
}

export function loseHeart(state, player) {
  player.setFace('hurt');
  player.flash();
  effects.bump(12);
  audio.hurt();
  state.safeT = 0.85;
  if (state.hearts <= 0) {
    state.over = true;
    return;
  }
  state.hearts -= 1;
  player.setFace('dizzy');
  if (state.hearts <= 0) {
    state.over = true;
    player.dead = true;
    player.setFace('defeated');
    audio.over();
  }
}

function pulseHud(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('warn');
  void el.offsetWidth;
  el.classList.add('warn');
}
