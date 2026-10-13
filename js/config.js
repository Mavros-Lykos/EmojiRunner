/** Game constants, biome palettes, and helpers. */

export const CONFIG = {
  W: 960,
  H: 540,
  gravity: 2400,
  jump: -1100,
  playerX: 150,
  playerR: 34,
  maxHearts: 3,
  strikeDrop: 50,
  strikeMax: 2,
  restore: 25,
  pickupScore: 100,
  hitCooldown: 0.4,
  blendTime: 2.2,
  cycleEvery: 3000,
  baseSpeed: 260,
  speedGain: 0.016,
  milestone: 500,
  hsKey: 'emoji-runner-hs',
  sfxKey: 'emoji-runner-sfx',
};

export const WORLDS = [
  {
    id: 'meadow',
    name: 'Emoji Meadow',
    banner: 'WELCOME TO EMOJI MEADOW!',
    unlock: 0,
    sky: ['#7ecbff', '#e8f7ff'],
    hill: '#7ed957',
    hill2: '#4caf50',
    ground: '#8bc34a',
    dirt: '#689f38',
    lane: '#fff4d6',
    decor: ['🌳', '🌸', '🍄', '🌻', '🦋'],
    block: '🪵',
    ambient: 'meadow',
  },
  {
    id: 'forest',
    name: 'Enchanted Emoji Forest',
    banner: 'WELCOME TO THE ENCHANTED FOREST!',
    unlock: 1000,
    sky: ['#3d6b4f', '#d4c07a'],
    hill: '#2e5a3c',
    hill2: '#1e3d28',
    ground: '#3d6b45',
    dirt: '#2a4a30',
    lane: '#d7ccc8',
    decor: ['🌲', '🌳', '🍄', '🌿', '🦌'],
    block: '🪨',
    ambient: 'forest',
  },
  {
    id: 'candy',
    name: 'Candy Emoji Valley',
    banner: 'WELCOME TO CANDY EMOJI VALLEY!',
    unlock: 2500,
    sky: ['#ffb6e6', '#b8f0ff'],
    hill: '#ff9ec8',
    hill2: '#c77dff',
    ground: '#ffc2e0',
    dirt: '#e091c4',
    lane: '#fff',
    decor: ['🍭', '🍬', '🧁', '⭐', '☁️'],
    block: '🍩',
    ambient: 'candy',
  },
  {
    id: 'desert',
    name: 'Sunset Emoji Desert',
    banner: 'WELCOME TO THE SUNSET DESERT!',
    unlock: 5000,
    sky: ['#ff7e5f', '#feb47b'],
    hill: '#e8a87c',
    hill2: '#c38e70',
    ground: '#d4a017',
    dirt: '#b8860b',
    lane: '#ffe0b2',
    decor: ['🌵', '🏜️', '🪨', '☀️', '🦎'],
    block: '🌵',
    ambient: 'desert',
  },
  {
    id: 'night',
    name: 'Magical Emoji Night',
    banner: 'WELCOME TO MAGICAL EMOJI NIGHT!',
    unlock: 8000,
    sky: ['#0b1026', '#2a1b4a'],
    hill: '#1a1440',
    hill2: '#0d0a24',
    ground: '#161032',
    dirt: '#0a0818',
    lane: '#ede7f6',
    decor: ['🌙', '✨', '🌲', '🔮', '⭐'],
    block: '🪨',
    ambient: 'night',
  },
];

export const EMOJI = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';

/** Run lane and jump lane. Everything interactive sits on one of these. */
export function layout() {
  const ground = CONFIG.H * 0.84;
  const trackH = Math.min(128, Math.max(100, CONFIG.H * 0.16));
  const trackTop = ground - trackH;
  const runY = trackTop + trackH * 0.52;
  return {
    ground,
    trackH,
    trackTop,
    runY,
    airY: trackTop - 156,
  };
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (a) => a[(Math.random() * a.length) | 0];

export function lerpHex(a, b, t) {
  const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const h = (n) => n.toString(16).padStart(2, '0');
  return `#${h(Math.round(lerp(ar, br, t)))}${h(Math.round(lerp(ag, bg, t)))}${h(Math.round(lerp(ab, bb, t)))}`;
}

/** Biome index from distance. Cycles after the last unlock. */
export function worldIndex(distance) {
  const last = WORLDS[WORLDS.length - 1].unlock;
  if (distance < last) {
    let i = 0;
    while (i + 1 < WORLDS.length && distance >= WORLDS[i + 1].unlock) i += 1;
    return i;
  }
  return (WORLDS.length - 1 + Math.floor((distance - last) / CONFIG.cycleEvery)) % WORLDS.length;
}
