/** Main loop, input, HUD, and persistence. */

import { CONFIG, layout } from './config.js';
import { audio } from './audio.js';
import { effects } from './effects.js';
import { Player } from './player.js';
import { applyResourceStrike, restoreMeters, loseHeart } from './damage.js';
import { WorldManager } from './world.js';
import { Entities } from './entities.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const player = new Player();
const world = new WorldManager();
const entities = new Entities();

const ui = {
  overlay: document.getElementById('overlay'),
  start: document.getElementById('cardStart'),
  pause: document.getElementById('cardPause'),
  over: document.getElementById('cardOver'),
  banner: document.getElementById('banner'),
  hearts: document.getElementById('hearts'),
  waterLabel: document.getElementById('waterLabel'),
  energyLabel: document.getElementById('energyLabel'),
  waterBar: document.getElementById('waterBar'),
  energyBar: document.getElementById('energyBar'),
  score: document.getElementById('score'),
  best: document.getElementById('best'),
  worldName: document.getElementById('worldName'),
  overScore: document.getElementById('overScore'),
  overBest: document.getElementById('overBest'),
  mute: document.getElementById('btnMute'),
};

const state = {
  playing: false,
  paused: false,
  over: false,
  time: 0,
  distance: 0,
  bonus: 0,
  score: 0,
  best: Number(localStorage.getItem(CONFIG.hsKey) || 0),
  hearts: CONFIG.maxHearts,
  water: 100,
  energy: 100,
  waterStrikes: 0,
  energyStrikes: 0,
  lastHit: { sad: -99, angry: -99 },
  safeT: 0,
  speed: CONFIG.baseSpeed,
  nextMile: CONFIG.milestone,
  bannerT: 0,
};

let last = 0;
let lanes = layout();
ui.best.textContent = state.best;

function resetRun() {
  state.playing = true;
  state.paused = false;
  state.over = false;
  state.time = 0;
  state.distance = 0;
  state.bonus = 0;
  state.score = 0;
  state.hearts = CONFIG.maxHearts;
  state.water = 100;
  state.energy = 100;
  state.waterStrikes = 0;
  state.energyStrikes = 0;
  state.lastHit = { sad: -99, angry: -99 };
  state.safeT = 0;
  state.speed = CONFIG.baseSpeed;
  state.nextMile = CONFIG.milestone;
  state.bannerT = 0;
  player.reset();
  player.setGround(lanes.runY);
  world.reset();
  entities.reset();
  effects.bits = [];
  effects.floats = [];
  showBanner(world.to.banner);
  setOverlay(null);
  syncHud();
}

function setOverlay(which) {
  ui.start.hidden = which !== 'start';
  ui.pause.hidden = which !== 'pause';
  ui.over.hidden = which !== 'over';
  ui.overlay.hidden = !which;
}

function showBanner(text) {
  ui.banner.hidden = false;
  ui.banner.textContent = text;
  state.bannerT = 2.4;
}

function size() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  CONFIG.W = Math.max(480, Math.round(rect.width));
  CONFIG.H = Math.max(280, Math.round(rect.height));
  canvas.width = CONFIG.W * dpr;
  canvas.height = CONFIG.H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  lanes = layout();
  player.setGround(lanes.runY);
}

function jump() {
  if (!state.playing || state.paused || state.over) return;
  if (player.jump()) audio.jump();
}

function togglePause() {
  if (!state.playing || state.over) return;
  state.paused = !state.paused;
  setOverlay(state.paused ? 'pause' : null);
}

function toggleMute() {
  audio.setEnabled(!audio.enabled);
  localStorage.setItem(CONFIG.sfxKey, audio.enabled ? '1' : '0');
  ui.mute.textContent = audio.enabled ? '♪' : '×';
}

function update(dt) {
  state.time += dt;
  state.speed = CONFIG.baseSpeed + state.distance * CONFIG.speedGain;
  state.distance += state.speed * dt * 0.32;
  state.score = Math.floor(state.distance) + state.bonus;

  if (state.score >= state.nextMile) {
    player.setFace('celebrate');
    effects.float('NICE!', player.x, player.y - 60, '#fff59d');
    state.nextMile += CONFIG.milestone;
  }

  const pal = world.update(dt, state.distance, state.speed, showBanner);
  player.lowHealth = state.hearts === 1;
  player.update(dt);
  if (state.safeT > 0) state.safeT -= dt;
  entities.update(dt, state.speed, lanes, pal, state.distance);
  effects.update(dt);

  const hit = entities.takeHit(player, state.safeT > 0);
  if (hit) onCollect(hit);

  if (state.bannerT > 0) {
    state.bannerT -= dt;
    if (state.bannerT <= 0) ui.banner.hidden = true;
  }

  if (state.over) endGame();
  syncHud(pal);
}

function onCollect(hit) {
  if (hit.type === 'sad' || hit.type === 'angry') {
    applyResourceStrike(state, player, hit.type);
    return;
  }
  if (hit.type === 'happy') {
    restoreMeters(state);
    state.bonus += CONFIG.pickupScore;
    player.setFace('excited');
    player.glow();
    effects.sparkle(hit.x, hit.y);
    effects.float(`+${CONFIG.pickupScore}`, hit.x, hit.y - 30, '#c8e6c9');
    audio.pickup();
    return;
  }
  if (hit.type === 'heart') {
    if (state.hearts < CONFIG.maxHearts) state.hearts += 1;
    state.bonus += CONFIG.pickupScore;
    player.setFace('excited');
    player.sx = 1.2;
    player.sy = 0.85;
    player.glow();
    effects.sparkle(hit.x, hit.y);
    effects.float(`+${CONFIG.pickupScore}`, hit.x, hit.y - 30, '#f8bbd0');
    audio.heart();
    return;
  }
  if (hit.type === 'block') {
    effects.float('OUCH!', player.x, player.y - 48, '#ff8a80');
    loseHeart(state, player);
  }
}

function endGame() {
  state.playing = false;
  state.over = true;
  player.dead = true;
  player.setFace('defeated');
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem(CONFIG.hsKey, String(state.best));
  }
  ui.overScore.textContent = state.score;
  ui.overBest.textContent = state.best;
  ui.best.textContent = state.best;
  setOverlay('over');
}

function syncHud(pal) {
  ui.hearts.textContent = '❤️'.repeat(state.hearts) + '🤍'.repeat(CONFIG.maxHearts - state.hearts);
  ui.waterLabel.textContent = `WATER: ${state.waterStrikes}/2`;
  ui.energyLabel.textContent = `ENERGY: ${state.energyStrikes}/2`;
  ui.waterBar.style.width = `${state.water}%`;
  ui.energyBar.style.width = `${state.energy}%`;
  ui.score.textContent = state.score;
  if (pal) ui.worldName.textContent = pal.name;
}

function draw() {
  const shake = effects.offset();
  ctx.clearRect(0, 0, CONFIG.W, CONFIG.H);
  ctx.save();
  ctx.translate(shake.x, shake.y);
  world.draw(ctx, CONFIG.H);
  entities.draw(ctx);
  player.draw(ctx);
  effects.draw(ctx);
  ctx.restore();
}

function loop(t) {
  const dt = Math.min(0.033, (t - last) / 1000 || 0);
  last = t;
  if (state.playing && !state.paused) update(dt);
  draw();
  requestAnimationFrame(loop);
}

function bind() {
  document.getElementById('btnPlay').onclick = () => { audio.unlock(); resetRun(); };
  document.getElementById('btnResume').onclick = () => togglePause();
  document.getElementById('btnRestartPause').onclick = () => resetRun();
  document.getElementById('btnAgain').onclick = () => resetRun();
  document.getElementById('btnPause').onclick = () => togglePause();
  document.getElementById('btnMute').onclick = () => { audio.unlock(); toggleMute(); };
  document.getElementById('btnJump').onclick = () => jump();
  canvas.addEventListener('pointerdown', () => jump());

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR') { audio.unlock(); resetRun(); }
    if (e.code === 'KeyM') { audio.unlock(); toggleMute(); }
  });
  window.addEventListener('resize', size);
}

audio.enabled = localStorage.getItem(CONFIG.sfxKey) !== '0';
ui.mute.textContent = audio.enabled ? '♪' : '×';
ui.best.textContent = state.best;
setOverlay('start');
size();
world.reset();
bind();
requestAnimationFrame(loop);
