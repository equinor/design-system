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
| 2 | Reference Resolver | Style Dictionary resolves `{palette.green.700}` chains | Palette as the foundation; Semantic and Concept as parallel consumer namespaces; each row traces one consumer token back to its Palette source via a wire |
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

> ⚠️ This phase shipped with a modeling error — Concept and Semantic ended up as two cards for the same conceptual token, only differing in the CSS-variable prefix. See **Phase 1.5** below for the corrected model.

### Phase 1.5 — Reference Resolver correction
**Goal:** Fix the misleading three-stacked-layers model. The team's real taxonomy is:

```
                    Palette
                  (raw hex values)
                  ↑              ↑
            Semantic           Concept
         (per-intent)     (cross-cutting)
       Bg.Neutral.Canvas     bg-floating
       Border.Accent.Medium  border-focus
       Text.Warning.Strong   text-link
```

Semantic and Concept are **parallel consumer-facing namespaces**, both referencing Palette directly. They do not chain to each other. Components consume one or the other, never Palette.

**What changes in code:**
- `src/data/chains.ts` becomes a list of consumer tokens, each tagged with a category (`semantic` | `concept`) and a single reference back to a Palette source.
- Add at least two Semantic examples sourced from `Semantic.Mode 1.json` (e.g. `Bg.Neutral.Canvas → {Neutral.1}`, `Border.Accent.Medium → {Accent.7}`) with the actual hex values pulled from `Color Light.Mode 1.json`.
- Keep the three existing Concept examples (`bg-floating`, `border-focus`, `text-link`).
- Resolver layout shifts from three columns to **two columns + a category badge**: each row is `[CATEGORY] consumer-token — wire — palette-token (hex)`.
- A small **legend panel** sits next to the librarian showing the Palette-with-two-children diagram, so the parallel-namespaces relationship is on-screen without being narrated only.
- The librarian's one-liner copy updates to explain Semantic vs Concept as "two ways to name the same Palette underneath."
- The `outputReferences` toggle behaviour is unchanged — still flattens references to hex across every card.

**What stays:**
- Stage size, station chrome, wire animation, station log, mascot.
- Hover-to-trace interaction; only the data and the column count change.

**Exit:** A driver standing in front of the team can say "look — Semantic is one naming system, Concept is another, and both point back to the same Palette" while hovering rows of two different categories, and the visualization makes the parallel relationship obvious without further explanation.

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

### Phase 1 — Reference Resolver (Station 2) ✓

**Stage resize.** The 320×180 logical canvas from Phase 0 was too cramped for three card rows + log strip + mascot. Bumped to **360×220** logical. Still firmly 8-bit; integer-scales cleanly. This is now the canonical stage size for the rest of the build.

**Data — the three-layer model encoded.**
- Hand-curated three chains in `src/data/chains.ts` with real values verified against the source JSON files in `packages/eds-tokens/tokens/`.
- Chains: `bg-floating` (Light.Gray.2 = `#ffffff`), `border-focus` (Light.Blue.7 = `#6fb6e9`), `text-link` (Light.Blue.8 = `#0070a9`).
- The real pipeline has more than three layers (Concept → Color-scheme alias → Raw palette → primitives). For pedagogy we collapse it to the team's three-name vocabulary: **Palette / Semantic / Concept**. This matches `team-assistant/decisions.md:259-263`.
- Live JSON loading deferred — curated TS data keeps the vertical slice tight. Loading the actual JSON (paths contain emoji filenames) can land later if needed.

**Components.**
```
src/components/
├── Card.tsx               — single token card with layer tag, title, value, swatch
├── Wire.tsx               — pixel-art horizontal connector (bolt-line-bolt)
├── ReferenceResolver.tsx  — Station 2 orchestration: chains, toggle, log
├── LibrarianBot.tsx       — inline-SVG pixel mascot, 2-frame blink (CSS-free)
└── StationLog.tsx         — typewriter log strip (22ms char interval)
```

**The toggle (`outputReferences`):**
- ON: each card shows the reference it resolves to (`{bg-floating}`, `{Light.Gray.2}`, `#ffffff`). Wires are visible, pulsing when a chain is hovered.
- OFF: every card collapses to the flattened hex. Same value across the row. This is what Style Dictionary's flattened output looks like.
- Each toggle change logs to the station log: `> outputReferences = true/false`.

**Hover behaviour as the in-game "trace" tool:**
- Hovering a chain highlights all three cards (yellow border + drop-shadow), activates the wires, and writes a resolve line to the log: `> resolve --eds-color-bg-floating → {bg-floating} → {Light.Gray.2} = #ffffff`.
- No driver clicking needed — the team narrates as the driver moves the cursor.

**World vs content rule preserved.** Card chrome, wires, layer labels, log, mascot — all pixel-art PICO-8 palette. The swatch on each card uses the real EDS hex with `image-rendering: auto` so the OKLCH-derived colour renders at full fidelity (the educational payload).

**Librarian mascot placeholder.**
- Inline SVG with `shape-rendering="crispEdges"` so it scales as proper pixel art.
- 24×32 logical pixels. Body, head, antenna with yellow bulb, two-pixel eyes (open / blink), small purple book under the arm, two feet.
- Blink driven by React state on a 2.6s interval. To be replaced by an Aseprite asset later — the SVG is a clear placeholder, not pretending to be the final art.

**Station log.**
- Typewriter effect on the newest line (`steps(2)` caret blink).
- Holds the 3 most-recent lines; older fade to dark grey.
- Boots with two seed lines so the strip never looks empty.

**Phase 0 dust.** `src/sprites/floor-tile.svg` retained for Phase 2 (conveyor reuse). Phase 0 stage demo (title + floor strip + lonely card) removed — Phase 1 is a clean replacement.

**Verified:**
- `pnpm --filter @equinor/token-factory build` passes (22 modules, ~196 kB JS, ~103 kB CSS pre-gzip — CSS is mostly the EDS variables bundle).
- TypeScript strict mode clean.

**Smoke test on the driver:** `pnpm --filter @equinor/token-factory dev` → <http://localhost:5180>. Hover each chain row, toggle outputReferences, watch the station log narrate.

**⚠️ Known modeling error in this build.** The Concept and Semantic cards in each row represent the same conceptual token expressed twice in the pipeline (Concept file is mostly a thin pass-through that adds the `--eds-color-` prefix to a token already defined in the Color-scheme file). The team's real taxonomy has Semantic and Concept as **parallel** consumer-facing namespaces, both referencing Palette directly — not a single three-layer chain. Phase 1.5 corrects this.

### Phase 1.5 — Reference Resolver correction ✓

**Data — `chains.ts` rewritten.**
- New shape: each chain is `{ category, consumer, palette, trace }`. The `consumer` is one Semantic or Concept token; the `palette` is the raw hex it ultimately resolves to; `trace` is the full hop list (for station-log narration).
- Four chains, two per category (semantic, concept). Trimmed from six because six rows × 34 logical px overflow the 220-logical-px stage body. Pedagogy reads cleaner at four anyway.
- Real values sourced from `Semantic.Mode 1.json`, `🌗 Color scheme.Light.json`, `Color Light.Mode 1.json`:
  - `[semantic]` Bg.Neutral.Canvas → Neutral.1 → Light.Gray.1 (`#f5f5f5`)
  - `[semantic]` Text.Warning.Strong → Warning.13 → Light.Orange.13 (`#27190e`)
  - `[concept]` bg-floating → Light.Gray.2 (`#ffffff`)
  - `[concept]` border-focus → Light.Blue.7 (`#6fb6e9`)
- Chain depth differs by category (Semantic: 2 hops, Concept: 1 hop). The card layout collapses to two cards (consumer + palette) for visual consistency; the **station log narrates the full hop list** so the depth difference is visible: `> resolve --eds-color-bg-neutral-canvas :: Bg.Neutral.Canvas → Neutral.1 → Light.Gray.1 → #f5f5f5`.

**Layout — two columns + category badge.**
- Removed the third (middle) card column from Phase 1.
- Added `.category-badge` on the left of each row: 40 logical px wide, blue-on-dark-blue for Semantic, yellow-on-purple for Concept. Pixel border + drop shadow consistent with the card chrome.
- Row gap bumped from 0 to 3 logical px so the badge breathes from the consumer card.

**Librarian copy updated.** From the old "card-catalogue" framing to: "semantic + concept both point at palette. two naming systems, one foundation." (references mode) / "alias chains resolved. every consumer knows its final hex." (flat mode). The diagram-in-bubble idea from the proposal was held back — current text + visible badge already carry the message; if the team still doesn't get it during dress rehearsal, add the diagram then.

**Unchanged.** Stage size (360×220), station header, toggle, wire animation, station log, mascot sprite + blink, hover-to-trace interaction. Only the data shape, column count, and badge are new.

**Files touched.**
- `src/data/chains.ts` — full rewrite (Chain shape + 4 entries).
- `src/components/ReferenceResolver.tsx` — full rewrite (badge render, two cards per row, hop-list narration).
- `src/app.css` — `.chain` gap adjusted; `.category-badge`, `.badge-semantic`, `.badge-concept` added.

**Layout bugs caught and fixed via Chrome DevTools verification:**
1. **Stage didn't scale responsively.** `--px` was hardcoded to 4px; on smaller viewports the 1440×880 stage clipped. Rewrote as `min(4px, calc((100vw - 16px) / 360), calc((100vh - 16px) / 220))` so the stage stays within the viewport at any size.
2. **CSS Grid `1fr` was acting as `minmax(auto, 1fr)`** — i.e. it expanded to fit a chain row's intrinsic min-content (≈840 physical px). The body grid overflowed the stage by ~170px and pushed the librarian + toggle off-screen. Fixed by switching both `.station` and `.station-body` to `grid-template-columns: minmax(0, 1fr) [auto]` so the chains column actually respects the stage width.
3. **Librarian column width drifted** when the saying changed between modes. Locked `.librarian { width: calc(72 * var(--px)); flex-shrink: 0 }` and `.librarian-bubble { width: 100%; box-sizing: border-box; word-break: break-word }` so the bubble wraps within a fixed column instead of pushing the chains.
4. **Toggle width changed** by a few pixels between `ON` (2 chars) and `OFF` (3 chars), causing the row to nudge. Locked `.toggle { min-width: calc(120 * var(--px)); flex-shrink: 0 }`.

Verified in browser via Chrome DevTools: clicking the toggle produces `deltaToggleX: 0`, `deltaLibX: 0` (no layout shift). Confirmed at 1800×1125 viewport with the full UI visible inside the stage.

**Verified.** `pnpm --filter @equinor/token-factory build` passes, TypeScript clean.

### Phase 2 — Token character + conveyor system ✓

**Scope decision.** The user asked to keep Station 2 light-weight and start Phase 2 without the proposed A/B/C additions (light/dark scheme switcher, palette-driven cascade, anti-pattern card). Those return in a later iteration once the full factory exists.

**Scene swap.** `App.tsx` now mounts `<Factory />` instead of `<ReferenceResolver />`. Phase 1.5's Resolver code stays in `src/components/` untouched — future phases will re-mount it as one of several stations on the conveyor.

**New components.**
```
src/components/
├── Factory.tsx     — top-level scene: machinery silhouettes + conveyor + token
├── Conveyor.tsx    — scrolling row of floor tiles
├── Token.tsx       — 16×24 walking character, 4-frame cycle @ 8fps
└── (Phase 1.5 components preserved)
```

**Token state model.** `src/data/inFlightToken.ts` introduces an `InFlightToken` type with `initial`, `current`, and `history` fields. Phase 2 doesn't mutate it visually yet — it stands up the shape that future stations (Phase 3+) will mutate as the token passes through. One sample token (`samplePalette`) seeded for future use.

**Visual layout (logical pixels, on the 360×220 stage):**
- Sky: y=0 to ~150, dark-blue stage default
- Machinery silhouettes: positioned absolutely at the conveyor's top edge — 2 pipes + 3 towers in `#0a112a` (slightly darker than stage bg, reads as distant structure)
- Conveyor belt: bottom 16 px, scrolling tile row over a black underlay with a 1-px gray top border
- Walking token: positioned at `bottom: 14 logical px` so feet rest on the belt surface

**Animations (both CSS, no JS RAF).**
- `conveyor-roll` — translates the conveyor by exactly one tile (-16 logical px) per 1.2 s, loops seamlessly.
- `walk-across` — translates the token wrapper from `-20` to `380` logical px over 8 s, loops infinite. Crosses the full stage with offstage buffers either side.
- Walk cycle (inside Token.tsx) — React `setInterval` at 125 ms cycles `frame` through 0/1/2/3. Frames 1 and 3 lift opposite feet by 1 logical px and bob the head/body 1 px. Frames 0 and 2 are neutral. Classic 4-frame stride.

**Sprite design (Token.tsx).** Inline SVG, viewBox 0 0 16 24, `shapeRendering="crispEdges"`. PICO-8 palette: yellow body (`#ffec27`, evokes the coin/token motif from the metaphor), orange band, light-gray head + arms, dark-blue eyes/mouth/feet, dark-gray legs. Token is deliberately blank (no insignia, no prefix lapel) — Phase 3+ will dress it up at each station.

**Verified in Chrome.**
- Conveyor transform sampling shows mid-animation values (e.g. `translateX(-15.55px)`) — animation running.
- Token wrapper transform mid-walk (e.g. `translateX(1498px)`) — animation running.
- Walk frame state observed switching (left foot Y=20, right Y=21 on frame 3) — cycle alive.
- No overflow: `stage.scrollWidth === clientWidth === 1440` at 1800×1125 viewport.
- No console errors.

**Verified.** `pnpm --filter @equinor/token-factory build` passes, TypeScript clean.

**Deferred to Phase 2.5 (or later) — explicit non-goals for Phase 2:**
- Parallax depth (multi-layer machinery scrolling at different speeds).
- Walk-cycle sync to translation (currently the token "marches in place" while sliding).
- Sound (chiptune background + step SFX).
- Token state model integration into a UI panel.
- Aseprite-authored sprites (placeholder SVG character holds the slot).

### Phase 3 — Sync Dock + Transform Bench, scenes chained ✓

**Scope.** Lightweight first cut of Stations 1 and 3, with a scene-router that chains all three stations together via keyboard navigation. Reference Resolver (Phase 1.5) re-enters as one of four scenes.

**New: scene state machine.**
- `src/components/Stage.tsx` owns the `Scene` type (`'idle' | 'sync' | 'reference' | 'transform'`) and routes to the right component.
- Keyboard: `Space` or `→` advances to next scene; `←` goes back. Cycles indefinitely.
- A persistent `.nav-hint` in the bottom-right of the stage shows `[ space ] <next-label>` so the driver knows the control at all times.
- `App.tsx` mounts `<Stage />`; `Factory.tsx` is now the `idle` scene only (its routing logic moved to Stage).

**Station 1 — Sync Dock (`src/components/SyncDock.tsx`).**
- Pixel-art wooden crate sprite (`Crate.tsx`, 48×40 logical px) with open/closed states. Click to toggle. Open state shows tokens leaking out.
- Crate label `🌗 Color scheme.Light` + source line `eds-tokens-sync :: figma → tokens/`.
- JSON dialog box with a tabbed `.JSON` corner title (purple), showing a real-shape snippet of `bg-floating` (type, value, com.figma codeSyntax). Snippet is collapsed to `· · ·` until the crate is opened.
- "Five source files" wall map listing all 5 sources as pixel cards; Color scheme is highlighted yellow to indicate the active file.
- Station log seeds with two lines; opening the crate appends three more narrating the parse.

**Station 3 — Transform Bench (`src/components/TransformBench.tsx`).**
- Two clickable pixel-art levers (`Lever.tsx`, 20×40 logical px) with up/down states. Red knob, light-gray shaft, dark-gray base, purple pivot.
- Two transform rows, each `[IN card] → [lever] → [OUT card]`:
  - Name lever: `Light.Gray.2` → `--eds-color-light-gray-2` (kebab-case + `--eds-color-` prefix).
  - Unit lever: `16` → `1rem` (numeric / 16 root font-size).
- OUT cards animate a brief stamp-bounce (`scale 1 → 1.08 → 1` over 220ms with `steps(2)`) when the corresponding lever flips, and pick up a yellow border + orange shadow.
- Station log appends a `>` narration line on each transform.

**Transform logic** lives next to the component (`applyNameTransform`, `applyUnitTransform`) — small pure functions, no shared library yet. Will graduate to a shared transforms module once more stations need them.

**Verified in Chrome via DevTools** (full keyboard walk through all four scenes):
- Idle: token walks, conveyor scrolls, nav hint reads "ENTER SYNC DOCK".
- Sync Dock: crate closed by default; clicking opens it, JSON renders, log narrates parse.
- Reference Resolver: layout identical to Phase 1.5 (re-mounted unmodified), nav hint reads "TRANSFORM BENCH".
- Transform Bench: levers pull individually, both rows stamp, log narrates each transform.
- Back to idle on next press; loop closes.
- No console errors.

**Verified.** `pnpm --filter @equinor/token-factory build` passes, TypeScript clean.

**Explicit non-goals for Phase 3 (deferred):**
- Scene transitions / camera pans (current cuts are hard cuts).
- Token "carrying state" between scenes (each scene is self-contained; the InFlightToken state model from Phase 2 is still unwired).
- Driver clicking to drive levers + space-to-advance interaction tension (currently both work but they don't gate progression).
- More transform examples (only one of each lever shown).

### Phase 4 — Format Splitter + Bundler Press ✓

**Scope.** Stations 4 and 5 land as two new scenes appended to the Stage state machine. Six scenes total now: `idle → sync → reference → transform → format → bundle → idle`. Driver still navigates via `Space` / `←` / `→`.

**Station 4 — Format Splitter (`src/components/FormatSplitter.tsx`).**
- Three-column layout: source card on the left, pixel-art `Manifold` on the middle (1-in / 4-out pipe with horizontal spine + 4 branches, 24×80 logical px), 2×2 grid of output cards on the right.
- Source token is the just-transformed `--eds-color-bg-floating = #ffffff` (the value coming out of Transform Bench).
- Four output cards, one per target: `CSS`, `JS`, `TS`, `JSON`. Each has a coloured format badge (purple / green / blue / orange) and a 2-line snippet showing the syntax variant of the same source value.
- Station log (4 lines, static) narrates the source-to-targets fanout.
- The real package's nuance — CSS keeps `var()` references while JSON-flat flattens — is *not* modeled in this lightweight cut. Worth a workshop talking point.

**Station 5 — Bundler Press (`src/components/BundlerPress.tsx`).**
- Three-column layout: imports list (left), pixel-art press machine (anvil shaft + head + base, ~60×~50 logical px), bundled output card (right).
- Three discrete phases: `idle → slammed → final`. The toggle button in the station header advances them: `SLAM` → `DROP ELEVATION` → `DONE`.
- On slam: imports animate out (`transform: translateX + scale(0.1) + opacity 0` with staggered `transition-delay`), the anvil drops (`translateY(20px)`), the whole body screen-shakes for 280ms (`steps(4)`), and the bundled `variables.css` output card appears showing a real-shape `:root` block.
- On drop-elevation: a yellow `--eds-elevation-low: 0 1px 2px …` line slides into the `:root` (`elevation-drop` keyframe, 360ms, `steps(4)`), the bundle title updates to `variables.min.css`, and the log appends the minify line.
- Station log seeds with 2 lines, appends 2 per slam, 3 per drop.

**Stage routing updated.** `src/components/Stage.tsx` now includes `'format'` and `'bundle'` in the `Scene` union, `ORDER` array, and `NEXT_LABEL` map. Six conditional renders below the header.

**Verified in Chrome via DevTools** (full walk through six scenes):
- Format Splitter: source card, manifold, four format cards visible with correctly-coloured badges. Output snippets clip at the card edge (overflow hidden) — pedagogy still reads.
- Bundler Press idle: 6 import files listed, press anvil up, no output yet.
- Bundler Press slammed: files transition out, anvil drops, `variables.css` :root block appears.
- Bundler Press final: yellow `--eds-elevation-low` line in :root, bundle title flips to `variables.min.css`, button label `DONE`, button disabled.
- No console errors.

**Verified.** `pnpm --filter @equinor/token-factory build` passes, TypeScript clean. Bundle JS now ~213 kB (61.7 kB gzip), CSS ~114 kB (21.5 kB gzip) — comfortable for a workshop tool.

**Explicit non-goals for Phase 4 (deferred):**
- Output snippet wrapping (some snippets clip the card width — fix by either widening cards or trimming snippets in a later pass).
- CSS-keeps-references vs JSON-flat distinction (one of the more interesting build details, left as a workshop talking point).
- Sound on slam / drop (chiptune SFX still TBD).
- Token in-flight state threading (still unwired — each scene self-contained).

### Phase 4.1 — Format Splitter source correction ✓

**Caught by review.** The original Phase 4 Format Splitter used `--eds-color-bg-floating` as its source, but that name *is* the CSS-target output — the splitter was effectively claiming "CSS form fans out into CSS / JS / TS / JSON," which hides the point that each target applies its OWN name transform.

**Fix.** Source card now shows the abstract JSON path `bg-floating` (no prefix, no kebab) with the resolved `#ffffff` value. Each output card legitimately applies its target's own naming convention:
- CSS → `--eds-color-bg-floating: #ffffff;` (kebab + `--eds-color-` prefix)
- JS / TS → `BG_FLOATING` (SCREAMING_SNAKE constant)
- JSON → `"bg-floating"` (preserves source path verbatim)

Station log updated to make the relationship explicit: `> each target applies its own name transform`. Component comment block also rewritten to call out the per-target name transforms.

**Carry-over caveat.** Transform Bench still demonstrates a CSS-specific name transform (`Light.Gray.2 → --eds-color-light-gray-2`). That's defensible as *one example* of what a transform does, but the workshop should call out that other targets (JS, TS) apply different name transforms — Style Dictionary's transform chain is target-specific, not universal. Leaving Transform Bench as-is for now; revisit if the workshop feedback says the conflation is misleading.

### Phase 4.2 — Three corrections from review ✓

Three issues caught when the user pushed back, fixed together.

**1. Token name discrepancy between Stations 3 and 4.**
- Station 3 (Transform Bench) was using `Light.Gray.2` (palette path) as its color example.
- Station 4 (Format Splitter) was using `bg-floating` (concept path).
- Driver POV: the token name flipped mid-pipeline, reading as if Station 4 went backwards.
- **Fix:** Station 3's color example now uses `bg-floating` → `--eds-color-bg-floating`. The same token name carries from Sync Dock (Station 1) all the way through Bundler Press (Station 5). The Phase 4.1 "carry-over caveat" above is superseded.

**2. The TS output in Format Splitter was wrong.**
- Phase 4.1 dropped the TS card after I claimed EDS doesn't ship TS for colors.
- The user pointed at `packages/eds-tokens/build/ts/color/` — EDS does ship color TS, and the shape is a **nested camelCase object tree** on a single `color` export, not flat `export const NAME` constants.
- The TS rework that landed for mobile (PR #4915) was the typography matrix work — color TS was already shipping in this shape.
- **Fix:** TS card restored with the accurate shape:
  ```ts
  color = {
    bg: {
      floating: '#ffffff'
    }
  }
  ```
- Verified against `build/ts/color/color-scheme/light-semantic.ts`, `build/js/color/color-scheme/light-semantic.js`, `build/json/color/color-scheme/{flat,nested}/light-semantic.json`. CSS, JS, TS, JSON cards now all map to real EDS output.
- Comment block in `FormatSplitter.tsx` updated with the verified shape list.

**3. "DROP ELEVATION" was cryptic.**
- The label sounded like "discard elevation" instead of "add elevation tokens to the bundle."
- The real build step: elevation tokens are composed at build time from primitive shadow values (offset / blur / spread / color in Figma) and injected directly into the bundled `variables.css` `:root` block — they're NOT `@import`ed, because doing so would create a duplicate `:root` selector. (Per `packages/eds-tokens/CLAUDE.md`.)
- **Fix:** Button label renamed `DROP ELEVATION` → `INJECT ELEVATION`. Station log rewritten to explain the *why* of this distinct phase:
  ```
  > elevation tokens composed from primitives at build time
  > NOT @imported — injected post-bundle to avoid a duplicate :root
  > minified :: variables.min.css :: 20 kb gzip
  ```
- `injectElevation` is now the handler name in `BundlerPress.tsx`.

**Verified in Chrome via DevTools end-to-end:** Transform Bench shows `bg-floating → --eds-color-bg-floating`; Format Splitter source is `bg-floating` with the four target shapes all distinct; Bundler Press button text walks through `SLAM → INJECT ELEVATION → DONE` with the new narration in the log. No console errors.

### Phase 5 — Dark-Scope Rewriter + Showroom ✓

**Stage state machine extended to eight scenes.** New scenes: `darkScope` and `showroom`. Full chain: `idle → sync → reference → transform → format → bundle → darkScope → showroom → idle`.

**Station 6 — Dark-Scope Rewriter (`DarkScopeRewriter.tsx`).**
- Three-column horizontal layout: IN card (purple shadow) showing source CSS with `light-dark(#fff, #202223)`, arrow, OUT card (yellow border + orange shadow) showing the rewritten output (`:root`, `[data-color-scheme="light"]`, `[data-color-scheme="dark"]`, and `@media (prefers-color-scheme: dark)` rules), then a "why this exists" side panel.
- Side panel explains the real reason: downstream bundlers (Vite 8 + Rolldown, esbuild legacy targets) polyfill `light-dark()` into a `var()` pattern that resolves at `:root` and breaks subtree dark mode. Emitting explicit rules is immune.
- Snippets clip slightly at card right edges due to Press Start 2P width — readable enough for workshop.

**Showroom (the payoff scene, `Showroom.tsx`).**
- The pixel-art aesthetic deliberately breaks here: a real EDS-style button rendered with real EDS variables and real EDS font stack on a clean light/dark "pedestal" surface. This is the "this is your design system" reveal.
- Three pixel-art segmented controls: `scheme` (light/dark), `appearance` (neutral/accent/info/success/warning/danger), `density` (comfortable/spacious). Each toggle sets a `data-*` attribute on the stage ancestor; the button reacts via the published CSS cascade.
- Button appearance variants verified working — danger turns red, success turns green, warning yellow, accent teal, etc.
- Density toggle bumps padding and font size to demonstrate spacious mode.

**Real finding worth a workshop talking point — and the reason for a Showroom CSS tweak.**
While verifying the Showroom in Chrome, dark mode wasn't visually toggling. Tracing in DevTools:
- `--eds-color-bg-neutral-canvas` is declared *only* at `:root, [data-color-scheme=light]` as `var(--eds-color-neutral-1)`.
- `--eds-color-neutral-1` *does* have direct light/dark scope rules (`#f5f5f5` / `#0b0b0b`).
- But CSS custom properties inherit their **computed** value, so `--eds-color-bg-neutral-canvas` resolves the `var()` at `:root` (where neutral-1 is light) and inherits the resolved hex downstream. Setting `data-color-scheme="dark"` on a subtree updates neutral-1 there, but the already-computed bg-neutral-canvas doesn't re-resolve.
- **Net effect:** subtree dark-mode toggling does *not* propagate to Semantic tokens that chain through scheme aliases via `var()`. It only works for Concept tokens that have direct light/dark scope declarations (like `--eds-color-bg-floating`).
- **Workshop call-out:** this is a real EDS published-CSS quirk. The dark-scope rewriter station shows the *theoretical* model; the Showroom shows where it works (Concept tokens) and implicitly where it doesn't (Semantic chain). Worth raising in the debrief.

**Showroom adjustment to keep the demo landing:**
- Stage background now uses `var(--eds-color-bg-floating)` instead of `var(--eds-color-bg-neutral-canvas)` so subtree dark mode visibly takes effect. CSS comment in `app.css` explains why.

**Verified in Chrome via DevTools end-to-end through all eight scenes:**
- Dark-Scope: layout reads, IN/OUT cards show the rewrite, why panel reads.
- Showroom: scheme toggle flips pedestal between white and dark gray. Appearance toggle visibly changes the button colour (red, green, yellow, etc.). Density toggle visible (button padding grows in spacious). Station log narrates the data-* state on every toggle.
- No console errors.

**Verified.** `pnpm --filter @equinor/token-factory build` passes; TypeScript strict clean. Bundle ~217 kB JS / 22 kB CSS gzip.

**Explicit non-goals for Phase 5 (deferred):**
- **Token Tracer wand** — clicking a Showroom pixel and watching an arrow fly back across all stations to the originating Sync Dock crate. This is the most ambitious interaction in the PLAN. Deferring to a Phase 5.5 so the core flow ships first.
- More dramatic dark-mode demo (would need either root-scoped toggling or a token list that all redeclare at dark scope).
- Real `@equinor/eds-core-react` Button component (currently a CSS-only re-creation using the published variables — close enough for the workshop, and avoids pulling in another workspace dep just for the payoff scene).
- Animated transitions between scenes (still hard cuts).

---

## Open decisions before Phase 0

1. **Sprite authoring tool.** Recommending Aseprite. Confirm or substitute.
2. **Pixel font.** Recommending Press Start 2P for speed. Confirm.
3. **Workshop date.** Plan assumes ~3–4 weeks to Phase 5. Tighten or relax based on the calendar invite already sent.
