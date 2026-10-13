# Contributing to Emoji Runner 🏃💨

First off, thank you for taking the time to contribute! 🎉 Contributions like yours help make **Emoji Runner** an engaging, well-crafted, and fun game for everyone.

Please take a moment to review this document to ensure a smooth and pleasant contribution experience.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Features & New Biomes](#suggesting-features--new-biomes)
   - [Code Contributions](#code-contributions)
3. [Local Development Setup](#local-development-setup)
4. [Architecture & How-To Guides](#architecture--how-to-guides)
   - [Adding a New Biome](#adding-a-new-biome)
   - [Adding a New Obstacle or Collectible](#adding-a-new-obstacle-or-collectible)
   - [Customizing Audio SFX](#customizing-audio-sfx)
5. [Code Style & Standards](#code-style--standards)
6. [Commit Message Guidelines](#commit-message-guidelines)
7. [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainer.

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the [Issues tab](https://github.com/Mavros-Lykos/EmojiRunner/issues) to verify if the issue has already been reported.

When filing a bug report, please include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Browser name and version (e.g., Chrome 120, Firefox 121, Safari 17).
- Operating System (Windows, macOS, Linux, iOS, Android).
- Screenshots or console error logs if available.

### Suggesting Features & New Biomes

We welcome ideas for new biomes, obstacles, audio tones, and gameplay power-ups!
- Open a feature request issue using the **Feature Request** template.
- Explain the concept, why it would enhance gameplay, and any proposed emoji glyphs or color palettes.

### Code Contributions

Ready to write some code? Here's how to get started:
1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Create a descriptive feature branch:
   ```bash
   git checkout -b feat/underwater-biome
   ```
4. Test your changes locally in the browser.
5. Commit and push your changes to your fork.
6. Open a Pull Request back to the main repository.

---

## Local Development Setup

Emoji Runner requires **no build tools**, **no webpack**, and **no npm dependencies**. It runs natively using browser ES modules.

Because modern browsers restrict ES module imports over the local `file://` protocol, serve the directory via any local HTTP server:

```bash
# Option 1: Python 3
python -m http.server 8000

# Option 2: Node npx serve
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

Navigate to `http://localhost:8000` in your browser.

---

## Architecture & How-To Guides

### Adding a New Biome

Biomes are defined in `js/config.js` under the `WORLDS` array:

```javascript
{
  id: 'volcano',
  name: 'Volcanic Emoji Ridge',
  banner: 'WELCOME TO VOLCANIC RIDGE!',
  unlock: 12000,                      // Distance required to unlock (in meters)
  sky: ['#3e1010', '#992211'],        // Top and bottom sky gradient
  hill: '#5c1919',                    // Distant hill color
  hill2: '#3d1212',                   // Midground hill color
  ground: '#732626',                  // Foreground ground color
  dirt: '#421414',                    // Dirt layer underneath ground
  lane: '#ff8844',                    // Pathway color
  decor: ['🌋', '🔥', '🪨', '💨', '☄️'], // Ambient background scenery
  block: '🪨',                         // World ground obstacle glyph
  ambient: 'volcano',                 // Ambient sound theme key
}
```

If adding a new sound scale for your biome, also add its note frequencies to `SCALES` in `js/audio.js`:
```javascript
volcano: [261, 311, 392, 466] // C minor pentatonic frequencies in Hz
```

### Adding a New Obstacle or Collectible

Entity types and collision characteristics are defined in `js/entities.js`:
1. Register glyph and radius in `TYPES`.
2. Add spawn weights in `spawnPattern(...)`.
3. Handle collision resolution in `takeHit(...)` or `js/game.js`.

### Customizing Audio SFX

The `AudioBus` class in `js/audio.js` synthesizes sounds using the Web Audio API without needing `.mp3` or `.wav` files:
- `this.beep(frequencyInHz, durationInSeconds, waveType, gainVolume)`
- Supported oscillator waveforms: `'sine'`, `'square'`, `'triangle'`, `'sawtooth'`.

---

## Code Style & Standards

- **Pure Vanilla JS**: Keep the codebase dependency-free.
- **ES Modules**: Use `import` and `export` statements.
- **Formatting**:
  - 2 spaces for indentation.
  - Semicolons are required.
  - Single quotes for JavaScript strings, double quotes for HTML/CSS.
- **Performance**:
  - Keep Canvas operations inside the `requestAnimationFrame` loop lean.
  - Avoid creating garbage or allocations inside per-frame update methods.
  - Use object reuse and array filtering.

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification with title and detailed description:

```bash
git commit -m "<type>(<scope>): <short summary>" -m "<detailed description of changes>"
```

### Commit Types
- `feat`: A new feature or gameplay mechanic.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `style`: Formatting, CSS adjustments, or visual polish.
- `refactor`: Code refactoring without changing functionality.
- `perf`: Performance optimizations.
- `chore`: Maintenance, metadata, or tooling changes.

---

## Submitting a Pull Request

1. Fill out the [Pull Request Template](.github/pull_request_template.md).
2. Ensure your code has no syntax errors and works properly across Chrome, Firefox, and Safari.
3. Test touch input and responsive resizing behavior.
4. Keep PRs focused on a single logical change.
5. Maintainers will review and discuss your changes. Thank you for contributing!
