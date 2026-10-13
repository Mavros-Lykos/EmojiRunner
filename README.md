<div align="center">

# 🏃💨 Emoji Runner

**An ultra-smooth, zero-dependency endless runner built with pure Vanilla HTML5 Canvas, modern ES6 modules, and Web Audio API synthesis.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Audio-WebAudio_API-00bcd4)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[🕹️ **Play Live Online**](https://mavros-lykos.github.io/EmojiRunner/) • [📖 Documentation](#table-of-contents) • [✨ Features](#-key-features) • [🚀 Quick Start](#-quick-start) • [🤝 Contributing](CONTRIBUTING.md)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Gameplay & Mechanics](#-gameplay--mechanics)
  - [Two-Strike Resource Depletion](#two-strike-resource-depletion)
  - [Biomes & World Progression](#biomes--world-progression)
  - [Collectibles & Hazards](#collectibles--hazards)
- [Controls](#-controls)
- [Audio Architecture](#-audio-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [License](#-license)

---

## 🌟 Overview

**Emoji Runner** is a lightweight, high-performance endless runner that runs directly in any modern browser without external engines, bundle steps, or heavy libraries. 

Control an expressive emoji avatar dashing across procedurally generated landscapes. Dodge emotional hazards, collect smile multipliers and health crystals, manage independent hydration and energy meters, and listen to dynamically generated arpeggios synthesized in real-time through the Web Audio API.

---

## ✨ Key Features

- **⚡ Zero External Dependencies**: Built 100% with standard web standards: HTML5 Canvas, CSS3, and ES Modules. No bundlers or build steps required.
- **🎨 5 Dynamic Biomes**: Seamless continuous color interpolation, custom horizon hills, and procedural foliage.
- **❤️ Strategic Two-Strike Health System**: Unlike generic one-hit runners, Emoji Runner features independent Water and Energy meters with distinct strike mechanics.
- **🎭 Expressive Avatar**: Dynamic facial rendering that responds in real-time to jumping, landing squashes, warnings, hurt states, and milestones.
- **🎵 Synthesized Web Audio API Bus**: 100% procedural sound effects and biome-keyed arpeggios that adjust frequencies based on the current world without needing external audio files.
- **📱 Fully Responsive**: Fluid scaling across desktop, tablet, and mobile screens with on-screen jump touch controls.
- **💾 LocalStorage Persistence**: Automatically tracks personal best high scores and sound mute preferences across sessions.

---

## 🎮 Gameplay & Mechanics

### Two-Strike Resource Depletion

The HUD displays **Water** (💧) and **Energy** (⚡) meters alongside your **Hearts** (💖).

```
   [ 💖 💖 💖 ]  HUD Status
  ┌──────────────────────────────────────────────┐
  │ 💧 WATER:  0/2 STRIKES   [████████████] 100% │
  │ ⚡ ENERGY: 0/2 STRIKES   [████████████] 100% │
  └──────────────────────────────────────────────┘
```

1. **Sad Hazard (😢)**: Inflicts a **Water Strike**, dropping the water meter by 50%.
2. **Angry Hazard (😡)**: Inflicts an **Energy Strike**, dropping the energy meter by 50%.
3. **Independent Counters**: Taking a water strike does not advance your energy strike counter.
4. **Heart Loss (💖 - 1)**: Accumulating **2 strikes on either resource** (or completely depleting the meter) causes you to lose 1 heart. That specific meter then recharges to full.
5. **Invulnerability Window**: Taking damage triggers momentary invulnerability frames (i-frames) with avatar flashing.

---

### Biomes & World Progression

As your runner travels further, the world smoothly blends colors, backgrounds, and hazards:

| Biome | Unlock Distance | Sky & Horizon | Ground & Lanes | Ambient Decor |
|---|---|---|---|---|
| **🌸 Emoji Meadow** | `0m` | Sky Blue (`#7ecbff`) | Meadow Green | 🌳 Trees, 🌸 Blossoms, 🍄 Mushrooms, 🦋 Butterflies |
| **🌲 Enchanted Forest** | `1,000m` | Deep Moss (`#3d6b4f`) | Forest Spruce | 🌲 Conifers, 🍄 Shrooms, 🌿 Ferns, 🦌 Wildlife |
| **🍭 Candy Valley** | `2,500m` | Pastel Pink (`#ffb6e6`) | Bubblegum Violet | 🍭 Lollipops, 🍬 Sweets, 🧁 Cupcakes, ⭐ Stars |
| **🏜️ Sunset Desert** | `5,000m` | Solar Amber (`#ff7e5f`) | Golden Dunes | 🌵 Cacti, 🏜️ Dunes, 🪨 Rocks, ☀️ Scorching Sun |
| **🌙 Magical Night** | `8,000m` | Midnight Indigo (`#0b1026`) | Neon Starlight | 🌙 Crescent Moon, ✨ Sparkles, 🔮 Orbs |

---

### Collectibles & Hazards

| Glyph | Type | Effect |
|---|---|---|
| 😊 **Happy Face** | Pickup | Grants **+100 bonus score** and restores **+25%** to both Water & Energy |
| 💖 **Heart Crystal** | Pickup | Restores **+1 lost Heart** (up to max 3) |
| 😢 **Sad Face** | Hazard | Causes a **Water Strike** & triggers visual HUD alert |
| 😡 **Angry Face** | Hazard | Causes an **Energy Strike** & triggers visual HUD alert |
| 🪵 / 🪨 / 🍩 / 🌵 | Obstacle | Physical barrier; blocks movement and inflicts immediate heart loss |

---

## 🕹️ Controls

| Action | Desktop / Keyboard | Mobile / Touch | Mouse |
|---|---|---|---|
| **Jump** | <kbd>Space</kbd> / <kbd>Arrow Up</kbd> / <kbd>W</kbd> | Tap on-screen **Jump** button / Canvas | Click canvas |
| **Pause / Resume** | <kbd>P</kbd> / <kbd>Esc</kbd> | Tap **II** button | Click **II** button |
| **Toggle Audio** | <kbd>M</kbd> | Tap **♪** button | Click **♪** button |
| **Restart Game** | <kbd>Space</kbd> (on Game Over) | Tap **Play Again** | Click **Play Again** |

---

## 🔊 Audio Architecture

Emoji Runner relies entirely on the browser's native `AudioContext` interface:
- **No external MP3 or WAV downloads**: Zero network payload for audio assets.
- **Synthesized Waveforms**: Uses custom square, sine, triangle, and sawtooth oscillators.
- **Dynamic Biome Arpeggios**: Continuously loops scale arpeggios that shift pitch scales based on the active biome (Meadow: C Major, Forest: G Major, Candy: D Major, Desert: F Major, Night: E Minor).
- **Auto-Unlock**: Audio starts seamlessly upon the player's first user interaction in compliance with browser autoplay policies.

---

## 📂 Project Structure

```
EmojiRunner/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md         # Template for reporting game glitches
│   │   └── feature_request.md    # Template for requesting biomes & features
│   ├── workflows/
│   │   └── deploy.yml            # GitHub Actions deployment to GitHub Pages
│   └── pull_request_template.md  # Checklist for pull requests
├── js/
│   ├── audio.js                  # Web Audio oscillator bus & arpeggios
│   ├── config.js                 # Constants, world palettes & layout metrics
│   ├── damage.js                 # Strike calculation & heart deduction
│   ├── effects.js                # Particles, screen shake & floating popups
│   ├── entities.js               # Entity spawner, collision checks & pooling
│   ├── game.js                   # Main game loop, HUD bindings & state
│   ├── player.js                 # Emoji physics, animations & expressions
│   └── world.js                  # Parallax layers & procedural biomes
├── .gitignore                    # Version control ignore definitions
├── CODE_OF_CONDUCT.md            # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md               # Guidelines for contributing & development
├── LICENSE                       # MIT License
├── README.md                     # Project documentation
├── index.html                    # Main game viewport & HUD markup
└── style.css                     # Responsive styling & arcade typography
```

---

## 🚀 Quick Start

Because Emoji Runner uses standard ES modules, it should be served over HTTP rather than opened as a local `file://` URI.

### Method 1: Python (Built-in)
```bash
# Clone the repository
git clone https://github.com/Mavros-Lykos/EmojiRunner.git
cd EmojiRunner

# Launch local HTTP server (Python 3)
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Method 2: Node.js / NPX
```bash
npx serve .
```

### Method 3: VS Code Live Server
1. Open the project folder in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) guide for full details on:
- Setting up the local development environment
- Adding new biomes, obstacles, or emojis
- Code style and commit standards
- Submitting pull requests

---

## 📜 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all. Please review our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more details.

---

<div align="center">
  Crafted with ❤️ and emojis by <a href="https://github.com/Mavros-Lykos">Mavros-Lykos</a>
</div>
