# Token Factory — Build Plan

A workshop-companion game that teaches the current state of `@equinor/eds-tokens` to the EDS team. Colour pipeline first. Typography evaluated post-workshop.

Tracks: [equinor/design-system-internal#264](https://github.com/equinor/design-system-internal/issues/264)

## Workflow

Each phase ends with three steps in order:
1. Implement.
2. Append a **Phase Log** entry below describing what was actually done — files, tech choices, anything unexpected.
3. Commit + push.

Commits use conventional commits: `feat(token-factory): <summary>`.

## Game shape (recap)

Six linear stations + a Showroom, played by one driver while the team narrates. Each station maps a programmatic concept from the real `eds-tokens` build to a tangible on-screen action.

| # | Station | Real pipeline step | What the game shows |
|---|---|---|---|
| 1 | Sync Dock | `eds-tokens-sync` writes Figma JSON to `tokens/{fileKey}/` | Crate arrives, opens, JSON dump appears |
| 2 | Reference Resolver | Style Dictionary resolves `{palette.green.700}` chains | Three card stacks, wires connect Concept → Semantic → Palette |
| 3 | Transform Bench | Naming + unit transforms (`palette.green.700` → `--eds-palette-green-700`) | Two physical levers stamp the token |
| 4 | Format Splitter | Same source → CSS / JS / TS / JSON outputs | 4-way conveyor junction |
| 5 | Bundler Press | `lightningcss` bundles `@import`s; elevation injected | Many CSS files squish into one `variables.css` |
| 6 | Dark-Scope Rewriter | `build-dark-scope` rewrites `light-dark()` → explicit `[data-color-scheme]` rules | One card in, three cards out |
| ★ | Showroom | Real `<Button>` consumes `variables.min.css`; ancestor `data-*` drives state | Toggles change `data-color-scheme`, `data-density`, `data-color-appearance`; Token Tracer wand rewinds origin |

Sabotage mode (per-station "break this step") is deferred until linear flow is solid.

---

## Art direction

### Style
8-bit pixel art, NES/Game Boy era aesthetic. Side-scrolling factory floor.

### Hard rule: world vs. content
The factory chrome is pixel art. The **tokens are real EDS values**, rendered faithfully. When a `--eds-color-bg-accent-fill-emphasis-default` card travels the conveyor, the colour chip on it is the real OKLCH-derived value at full fidelity — not pixelated, not approximated. The Showroom `<Button>` uses real EDS CSS variables and the real EDS font stack.

This separation makes the playful chrome and the educational payload visually distinct.

### Palette
[PICO-8 16-colour palette](https://pico-8.fandom.com/wiki/Palette) for the world. Recognisable, unequivocally "this is a game." Customise 1–2 entries for EDS brand tinges if needed.

### Resolution
- Logical canvas: 320 × 180.
- Rendered to viewport at integer scale (3×–6×) via `image-rendering: pixelated`.
- Clean on 1280×720 and 1920×1080 displays.

### Sprites
- Authoring tool: **Aseprite**. `.aseprite` files checked in; PNG sprite sheets exported via the Aseprite CLI in a `build:sprites` script.
- Sizes: 16×16 small props, 32×32 mascots and levers, 64×32 token cards, 16×16 background tiles.
- Animation: 6–12 fps for character cycles, 60 fps for conveyor motion.

### Typography
- World chrome: **Press Start 2P** (Google Fonts).
- Showroom button: the real EDS variable font stack via `eds-uprights-vf.css`. The reveal that "this is your design system" lands harder when the typography flips.

### Audio
- Chiptune background loop, low volume.
- 1-shot SFX per event (lever click, wire pulse, press squish, dialog blip).
- Synthesised via [ZzFX](https://github.com/KilledByAPixel/ZzFX) — no audio files committed.

### UI chrome
- Dialog boxes: hard 2px borders, 2px offset drop-shadow blocks.
- "▼ press [space]" continue prompts.
- Station-log strip pinned to bottom: typewriter effect, one line per pipeline event. Doubles as the post-workshop transcript.

---

## Technical foundation

- **Stack:** Vite + React + TypeScript. Match `apps/` convention.
- **Tokens:** `import '@equinor/eds-tokens/css/variables'` for the Showroom. Workspace linked via pnpm.
- **State:** one small zustand store for token-in-flight + factory state. No router.
- **Controls:** keyboard-first (one key advance, one key interact). Mouse optional. Driver should not hunt for buttons in front of a watching team.
- **Tests:** Vitest for pure logic (reference resolver, transform functions). No browser tests — workshop tool, not product.
- **Linting:** existing repo eslint config.

---

## Phases

Each phase is independently demonstrable. Stop, demo internally, adjust, continue.

### Phase 0 — Scaffolding
**Goal:** Pixel-art rendering pipeline works, EDS tokens consumable.
- Vite app initialised, `package.json` workspace-linked.
- Canvas at 320×180 scaled up via `image-rendering: pixelated`.
- One placeholder sprite rendering (a factory floor tile).
- "Hello, factory" in Press Start 2P.
- `@equinor/eds-tokens` imported; one real `--eds-color-*` visible on the page.

**Exit:** Empty stage proves rendering pipeline + token consumption.

### Phase 1 — Vertical slice: Reference Resolver (Station 2)
**Goal:** The hardest concept works end-to-end before investing in the rest.
- Three card stacks rendered: Palette / Semantic / Concept.
- Real EDS data populates cards (semantic JSON as source).
- Telephone-wire animation connecting Semantic → Palette source.
- Toggle: `outputReferences` on/off; cards visibly redraw.
- Librarian-bot mascot with idle animation.
- Station log records events.

**Exit:** Driver can narrate Palette → Semantic → Concept in front of the team, and the visualisation keeps up. Internal demo to Frida before continuing.

### Phase 2 — Token character + conveyor system
**Goal:** Tokens move. The factory feels alive.
- Token sprite (16×24 character with face). 4-frame walk cycle.
- Conveyor belt: scrolling tile loop, configurable speed.
- Token's carried-value state model accumulates transformations as it moves.
- Parallax: background, midground machinery silhouettes, foreground conveyor.

**Exit:** A token enters from left, walks across the stage, exits right. Stations not yet active.

### Phase 3 — Stations 1 & 3 (Sync Dock, Transform Bench)
**Goal:** Upstream of the Resolver. Token enters and gets named.
- **Sync Dock:** Figma crate slides in, opens; JSON dump in dialog box. Wall map shows which of 5 source files (emoji-labeled).
- **Transform Bench:** Two pixel levers. "Name lever" rewrites dot-path → kebab-case with `--eds-` prefix and a stamping animation. "Unit lever" toggles `px` ↔ `rem` for numeric values.

**Exit:** Stations 1 → 2 → 3 chain together.

### Phase 4 — Stations 4 & 5 (Format Splitter, Bundler Press)
**Goal:** Multi-format emit + bundle.
- **Format Splitter:** 4-way conveyor junction. Token enters once, exits as four cards (CSS, JS, TS, JSON). Each card opens to that target's syntax.
- **Bundler Press:** Small CSS file sprites accumulate; press slams with screen shake; out comes one labeled `variables.css`. Elevation envelope drops into the `:root` block visibly.

**Exit:** Stations 1–5 chain. Minified `variables.min.css` is the press output.

### Phase 5 — Station 6 (Dark-Scope Rewriter) + Showroom
**Goal:** The hardest pipeline step + the payoff.
- **Dark-Scope Rewriter:** `light-dark()` card in, three explicit rule cards out. Side panel comic-strip: "what downstream Vite 8 polyfilling would have broken."
- **Showroom:** Pedestal at stage right. A real EDS `<Button>` driven by real CSS variables. Pixel-art toggle switches change ancestor `data-color-scheme`, `data-density`, `data-color-appearance`, `data-font-size`. Button reacts live.
- **Token Tracer wand:** Click any visible property on the Showroom button → glowing arrow flies back across the factory and lands on the Sync Dock crate it originated from.

**Exit:** Full game playable start to finish. Workshop-deliverable.

### Phase 6 — Co-op live polish
**Goal:** Smooth at the front of the room.
- Keyboard-driven controls finalised.
- Pause prompts between stations with one discussion question on screen.
- Station log readable from the back of the room.
- Chiptune background + SFX wired up.
- Speedrun through whole game: 25–30 min.

**Exit:** Dress-rehearsal-ready.

### Phase 7 — Dress rehearsal + workshop
**Goal:** Validate before the full team.
- Run with Frida (deep tier) and Alex (working tier) separately.
- Adjust pacing, language, station-log copy.
- Run the actual workshop. Capture debrief questions.

**Exit:** Workshop held. Issue #264 closed with a link to the artefact.

### Phase 8 (post-workshop) — Typography transfer
**Goal:** Decide whether the factory metaphor extends to typography's 5-axis model. Not in workshop scope. Revisit after Phase 7 retro.

---

## Phase Log

Filled in as each phase completes.

### Phase 0 — Scaffolding ✓

**Stack as built:**
- Vite 8 + React 19 + TypeScript 5.9 (matching repo versions).
- `@vitejs/plugin-react` for JSX.
- Workspace name: `@equinor/token-factory`. Picked up automatically via `apps/**` in `pnpm-workspace.yaml`.
- `@equinor/eds-tokens` linked via `workspace:^`.
- `@fontsource/press-start-2p` for the pixel font (bundled, no CDN dependency).
- Dev server on port 5180 (avoids clashes with other apps).

**File structure:**
```
apps/token-factory/
├── PLAN.md
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── src/
    ├── App.tsx           # Stage with title, floor tiles, real-token card
    ├── app.css           # Pixel-scale variables, PICO-8 palette, stage layout
    ├── main.tsx          # React entry
    ├── vite-env.d.ts
    └── sprites/
        └── floor-tile.svg  # Placeholder pixel tile (replaced by Aseprite later)
```

**Pixel rendering approach:**
- Logical canvas 320 × 180. Stage rendered at `--scale: 4` (1280 × 720) using a CSS custom property `--px: calc(1px * var(--scale))` so every dimension is written in logical pixels (e.g. `calc(16 * var(--px))`).
- `image-rendering: pixelated` on body and sprite images.
- `-webkit-font-smoothing: none` to keep the pixel font crisp.
- SVG placeholder tile uses `shape-rendering="crispEdges"` and a 16×16 viewBox; renders as proper pixel art at any scale.

**World vs content separation (the hard rule from the art direction) demonstrated:**
- The pixel-art card chrome uses PICO-8 black/white/orange/purple.
- The colour swatch on the card uses `background: var(--eds-color-bg-accent-fill-emphasis-default)` — the real EDS token — with `image-rendering: auto` overriding the pixelated default, so the OKLCH-derived value renders at full fidelity.

**Verified:**
- `pnpm install` from repo root picks up the workspace.
- `pnpm --filter @equinor/token-factory build` produces a working bundle (`dist/`).
- Real EDS token (`--eds-color-bg-accent-fill-emphasis-default`) resolves and renders on screen.
- Press Start 2P loads via `@fontsource` (woff2 + woff bundled).

**Not done yet:** Visual smoke test in a browser is on the user — run `pnpm --filter @equinor/token-factory dev` and open <http://localhost:5180>.

**Branch:** `feat/token-factory-workshop`.

---

## Open decisions before Phase 0

1. **Sprite authoring tool.** Recommending Aseprite. Confirm or substitute.
2. **Pixel font.** Recommending Press Start 2P for speed. Confirm.
3. **Workshop date.** Plan assumes ~3–4 weeks to Phase 5. Tighten or relax based on the calendar invite already sent.
