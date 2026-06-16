# Token Factory — Build Plan

A workshop-companion **story-game** that teaches how `@equinor/eds-tokens` is built and consumed. Follows a single colour token's journey from Figma to a real EDS Button. Jewellery-factory metaphor, 8-bit aesthetic, narrator-driven.

Tracks: [equinor/design-system-internal#264](https://github.com/equinor/design-system-internal/issues/264)

> **Note on the rebuild.** An earlier version of this app (Phases 0–5.5, branch history through commit `a2b2d1b42`) was built as a state-machine — 9 jumpable station scenes. After review, the user's verdict was that it was a slideshow, not a game. The whole thing is being retired in favour of one continuous story. Sprite-level components from the first build are reused; everything scene-level is being replaced. See "Lessons from the first build" at the end for what carries forward.

---

## Workshop context

- **Audience:** ~10 EDS team members, mixed roles — designers (Alex), web engineers (Camilla, Frida), mobile engineers (Chibuzor, Haakon), strategic (Mikael, Lavinia, Hjalmar, Elsa).
- **Goal:** the team understands today's eds-tokens pipeline well enough to make informed decisions about changing it.
- **Format:** co-op live. One driver, the rest narrate and discuss.
- **Lane covered:** 🟪 Color Scheme (Concept) — `bg-floating` as the example token. Other lanes (Semantic Static, Semantic Dynamic, Spacing, Typography) get the same template later as separate stories.

---

## The story — 10 scenes

The viewer follows one token (`Bg.Floating`) from Figma to a rendered EDS Button. Scene 0 is a centred LibrarianBot welcome; the protagonist arrives in Scene 1.

| # | Scene | Visual core | What it teaches |
|---|---|---|---|
| 0 | **Intro** | LibrarianBot centred on stage, scaled up, with a single bubble. No other scene chrome. | Frames the workshop — "follow a design token from Figma to a component." Sets keyboard controls. |
| 1 | **The Goods Terminal** | Lorry with Figma logo pulls up to `eds-tokens-sync`. Five conveyor belts visible behind the dock (one per Figma file: static / foundations / dynamic / spacing primitives / design tokens). Worker reads our crate's label and sorts it onto the Static belt. | Sync = REST API. Lanes = Figma files. Routing happens at sync time, not build time. |
| 2 | **Inside the Factory** | Camera follows the crate inward on the belt. Machinery silhouettes. Worker walks alongside. The Static crate carries Semantic.Mode 1.json + Concept.Mode 1.json. | Continuity bridge. Introduces Bg.Floating and clarifies that one crate (one Figma file) holds many tokens — we follow one. |
| 3 | **The Crack** | Crate stops under the slam press. SLAM. Crate splits open, glowing geode inside. | Build station is where refinement starts; protagonist named ("Bg.Floating in his raw JSON form"). |
| 4 | **The Reveal** | Geode lifted to centre. Three concentric stones (concept / scheme / palette) with the "three-layered geode" label. | "Tokens are layered." Sets up the alias-chain teach. |
| 5 | **The Peel** *(extra-deliberate pacing)* | Each stone peeled in turn. Narrator names + locates each: outer = `Bg.Floating` in `Static / Concept.Mode 1.json`; middle = `bg-floating` in `Foundations / 🌗 Color scheme.Light.json` (the swap point); core = `Light.Gray.2` in `Foundations / Color Light.Mode 1.json` (`#ffffff`). Then the build stamp attaches `--eds-color-bg-floating`. | The 3-layer alias chain across two Figma files + the build-emitted CSS variable name. |
| 6 | **The Cutting** | Inner jewel + dark counterpart fused on cutter's bench. Two facets, one gemstone. | `light-dark()` declarations — light + dark are one token with two values. |
| 7 | **The Tray** | Gemstone placed in a tray of concept-colour gemstones. Narrator names the file output: `color-scheme.css` (concepts alongside scheme aliases + palette they resolve through). | Lane output as a CSS file — what reaches `variables.css`. |
| 8 | **The Packaging** | Tray meets four sibling materials (cords / clasps / chains / lacquer) from the four other Figma-file lanes (spacing primitives / foundations · elevation / design tokens · typography / dynamic · appearance). Inspector re-declares the same token under four selector scopes (`:root` fallback, `[data-color-scheme=light]`, `[data-color-scheme=dark]`, `@media (prefers-color-scheme: dark)`). Box sealed as `variables.css`. | lightningcss bundle + `build-dark-scope` rewrite — same variable name resolved by four scopes for browsers without `light-dark()` native support. |
| 9 | **The Jeweller** | Box arrives at "EDS Product Team." Jeweller assembles jewellery from the five materials (gemstone + cord + clasp + chain + lacquer). **Pixel-art assembly fades into a real EDS `<Button>` rendered with real CSS variables and real font stack.** | The whole pipeline serves the design system. Emotional bookend. |

**~30 narrator beats. ~4–5 min runtime at hybrid pace.**

### Locked design decisions (from one-at-a-time sparring)

1. **Replace, not augment** — the previous 9-scene state machine is retired entirely.
2. **Lane sorted at the dock** — routing happens at sync time, not at build time. The cracking later just reveals the geode, it doesn't route it.
3. **Dark-Scope Rewriter = packaging inspector** — narratively folded into Scene 8 as a "compatibility polish" beat.
4. **3-layer model = nested stones** — split across two scenes (Reveal + Peel) with extra-deliberate pacing because the analogy is easy to lose track of.
5. **5 lanes glimpsed at the dock only** — no parallel-lanes scene. Sibling lanes resurface implicitly at the packaging bench (cords/clasps/chains).
6. **One crate = one token** — single-protagonist narrative. We don't visualise "this is one of 87."
7. **Hybrid pacing** — narrator lines auto-type within a scene with short pauses; driver presses space to advance scenes or skip mid-typing.
8. **Drift hotspot deferred** — separate "Drift Alley" story later, same template, counterfeit-crate protagonist.
9. **Sprite-level reuse only** — keep `Crate`, `LibrarianBot`, `Token`, `Lever`, `floor-tile.svg`, slam-press anvil, `StationLog`. Delete all scene-level components and rebuild.
10. **End with real-component reveal** — pixel-art necklace dissolves into a real EDS `<Button>`.

---

## Art direction

### Style
8-bit pixel art, NES/Game Boy era. Side-scrolling factory floor with vertical and depth elements (geodes, gemstones, cutting bench, shipping crate).

### Hard rule: world vs. content
- The **factory world** (chrome, machines, characters, crates, lorries, the boxed kit) is pixel art using a constrained palette.
- The **tokens / gemstones** display the real EDS colour values at full OKLCH fidelity — no pixelation, no approximation. When the geode is cracked, the inner core's hex is whatever `--eds-color-bg-floating` actually resolves to.
- The **final reveal** in Scene 9 deliberately breaks the pixel-art aesthetic — the Button uses the real EDS font stack and real CSS variables, with `image-rendering: auto`. That tonal shift IS the "this is your design system" payoff.

### Palette
[PICO-8 16-colour palette](https://pico-8.fandom.com/wiki/Palette) for the world chrome. Customise 1–2 entries for jewellery-relevant accents (gem cyan, jewel gold).

### Resolution
- Logical canvas: 320 × 180 (or 360 × 220 — confirm during scaffold).
- Rendered at integer scale via `image-rendering: pixelated`. Capped at 4× physical.
- Responsive: `--px: min(4px, calc((100vw - 16px) / 360), calc((100vh - 16px) / 220))`.

### Sprites
- Authoring: **Aseprite** for new sprites (geode, gemstone, necklace, lorry, jeweller). Existing sprite components stay inline-SVG for now; new sprites can also be inline-SVG if it's faster.
- Sizes: 16×16 small props, 32×32 mascots/levers, 48×40 crate, 64×32 token cards, 16×16 background tiles.
- Animation: 6–12 fps for character cycles, 60 fps for conveyor scroll.

### Typography
- World chrome: **Press Start 2P** (Google Fonts) via `@fontsource`.
- Scene 9 Button reveal: the real EDS variable font stack (Inter / Equinor uprights).

### Narrator UI
- Character: existing `LibrarianBot.tsx`, **resized 24×32 → 18×24 logical**, repositioned to **top-right** of stage.
- Speech bubble: `StationLog`-style typewriter, positioned below the bot. Auto-types each line, holds ~2 s after complete, then next line types in. Driver presses space to skip mid-typing or advance to next scene.
- Tone: warm, plain-language, no jargon unless introduced in the same beat.

### Audio (deferred)
ZzFX-synthesised SFX for slam, cutting, sealing, fade-to-real-button — TBD in polish phase.

---

## Technical foundation

- **Stack:** Vite 8 + React 19 + TypeScript 5.9, matching the rest of `apps/`.
- **Tokens consumption:** `@equinor/eds-tokens` linked via `workspace:^`; `@import '@equinor/eds-tokens/css/variables'` in the entry CSS.
- **Pixel font:** `@fontsource/press-start-2p`, bundled.
- **State:** local `useState` in `Story.tsx`. No router. No global store needed for 9 linear scenes.
- **Pacing:** keyboard-first (`Space` advances scenes, `←/→` for prev/next, optional `Esc` to restart). Mouse optional.
- **Tests:** none required for the workshop tool. Vitest configured if we add pure logic later.

---

## Workflow

Per established cadence with the user:
1. **Implement** a logical chunk.
2. **Append** what was done to the **Phase Log** section below (technical decisions, file paths, anything unexpected).
3. **Commit + push.** Pre-authorised at chunk boundaries.

Commit format: `feat(token-factory): <chunk summary>`. Conventional commits. Never AI attribution.

---

## Build phases

### Phase A — Demolition
**Goal:** clean slate at the scene level, sprite-level components preserved.

**Delete:**
- Scene components: `SyncDock.tsx`, `Factory.tsx`, `FactoryMap.tsx`, `ReferenceResolver.tsx`, `TransformBench.tsx`, `FormatSplitter.tsx`, `BundlerPress.tsx`, `DarkScopeRewriter.tsx`, `Showroom.tsx`, `Stage.tsx`, `LaneBadge.tsx`
- Card/Wire/Conveyor (rebuilding per scene): `Card.tsx`, `Wire.tsx`, `Conveyor.tsx`
- Data: `data/chains.ts`, `data/lanes.ts`, `data/inFlightToken.ts`
- `App.tsx` will be rewritten to mount `Story.tsx`.

**Keep (sprite + utility level):**
- `Crate.tsx`, `LibrarianBot.tsx`, `Token.tsx`, `Lever.tsx`, `StationLog.tsx`, `floor-tile.svg`, the slam-press internals (extracted later).

**Exit:** project builds (will be a placeholder), TypeScript clean.

### Phase B — Story scaffold
**Goal:** narrator + scene routing, no scenes yet.

- New `Story.tsx` — owns scene index (0–8), keyboard handler (space advances, ←/→ for nav, Esc to restart).
- `App.tsx` — minimal, mounts `<Story />` inside `.viewport > .stage`.
- Narrator overlay component using resized `LibrarianBot` top-right + `StationLog`-as-bubble below.
- `data/script.ts` — narrator beats per scene as a structured `{ scene: number, lines: string[] }[]`.
- Keyboard pacing: `space` advances scenes; if mid-typing, skips to end of current line.

**Exit:** boot loads, narrator visible top-right, placeholder text per scene, space advances through 9 empty scenes.

### Phase C — Scene 9 first (the payoff)
**Goal:** validate the end-state and sprite reuse before building the rest. If the necklace-to-Button reveal doesn't land, the whole story falls.

- New `Necklace.tsx` sprite — assembling animation (3 frames: gemstone alone, +cord, +clasp).
- New `Jeweller.tsx` scene — workshop with assembly bench.
- Reveal beat — pixel-art necklace fades or hard-cuts into real `<button class="showroom-button">Save changes</button>` styled with `var(--eds-color-bg-accent-fill-emphasis-default)` etc.
- Narrator beats finalised for Scene 9 ("here are the jewellers — your team", "what they make is your design system").

**Exit:** Scene 9 plays in isolation. Real `<Button>` renders correctly with real EDS variables.

### Phase D — Scenes 1–8 in story order
Build each scene as one commit. ~8 commits in this phase.

For each scene:
1. New `scenes/<SceneName>.tsx` component.
2. Hook up narrator beats from `data/script.ts`.
3. Smoke-test the transition from the previous scene.
4. Commit + push.

Order:
- D.1 — Scene 1: Dock (lorry, 5 belts, sorting).
- D.2 — Scene 2: Inside (camera follows crate inward).
- D.3 — Scene 3: Crack (extract `SlamPress.tsx` here).
- D.4 — Scene 4: Reveal (new `Geode.tsx` — closed, cracked, three-stones states).
- D.5 — Scene 5: Peel (slow, narrator-heavy). ✓
- D.6 — Scene 6: Cutting (new `Gemstone.tsx` — two-facet light/dark fusion + `light-dark()` declaration card). ✓
- D.7 — Scene 7: Tray (collection of gemstones in `color-scheme.css` label). ✓
- D.8 — Scene 8: Packaging (bundle + dark-scope inspector polish). ✓

### Phase E — Polish
- Audio (ZzFX SFX for SLAM, cutting, sealing, fade).
- Tighten narrator copy from end-to-end playthrough.
- Smoke-test in Chrome at multiple viewport sizes via DevTools MCP.
- Run by Frida (deep tier) and Alex (working tier) before workshop.

### Phase F — Workshop
- Run the actual workshop.
- Capture debrief notes for the Drift Alley follow-up story.

---

## Open decisions before Phase A

1. **Stage size — 320×180 or 360×220?** Phase 0 picked 320×180; Phase 1.5 bumped to 360×220 to fit Station 2. The story has more room per scene (no card grids), so 320×180 might be cleaner. Decide at scaffold.
2. **Inline-SVG vs PNG sprites for new pieces?** Existing sprites are inline-SVG. Aseprite PNGs would be more authentic 8-bit but require Aseprite or external authoring. Recommend stay inline-SVG until the polish phase.
3. **Branch — stay on `feat/token-factory-workshop` or fresh branch?** The retired build's history is on this branch. Recommend stay — keeps the lessons-learned commits attached. Final PR description will explain the pivot.

---

## Lessons from the first build

The earlier Phase 0–5.5 build (commits up to `a2b2d1b42`) shipped 9 station scenes with a scene-router. Three things to carry forward into the rebuild:

1. **The lane awareness work was right; the structure was wrong.** The Phase 5.5 Factory Map and lane-aware corrections nailed the pedagogy. The state-machine wrapper around it was the part the user objected to — not the lane model itself. The new story bakes lane awareness into the dock scene without a separate map.
2. **Pedagogical corrections compounded.** Five rounds of review (Phases 1.5, 4.1, 4.2, 5.5, 5.5b) caught modeling errors I had baked in confidently: Concept ≠ Semantic-stack-layer, Format Splitter source ≠ CSS form, TS for colors does exist as nested objects, "DROP ELEVATION" reads as discard, map needs three explicit stages. Every correction came from the user reading the rendered output, not the code. **Render and verify each scene in Chrome via DevTools MCP before declaring it done.** Don't trust internal review.
3. **The Showroom's `<button>` reveal worked; the rest was over-engineered.** The single best beat in the first build was the pixel-to-real-Button shift in the Showroom. Scene 9 is built around that exact mechanism. Everything else from the old game is replaceable.

---

## Phase log

Filled in as each chunk completes. The pre-rebuild history (Phases 0 through 5.5b) is in git history; not duplicated here.

### Phase A — Demolition ✓

- Deleted 14 scene-level components + 3 data files.
- Kept the 5 sprite components (`Crate`, `LibrarianBot`, `Token`, `Lever`, `StationLog`) + `floor-tile.svg`.
- `App.tsx` rewritten as a boot placeholder.
- `app.css` stripped from ~1000 station-specific lines down to PICO palette + responsive `--px` + viewport/stage layout + the five kept sprite classes.
- Bundle ↓14% (220 → 191 kB JS, 122 → 101 kB CSS gzip).
- Commit `f1daa81c8`.

### Phase B — Story scaffold ✓

- New `Story.tsx` orchestrator owns `sceneIdx` (0..8) and `skipTick`. Keyboard handler: `Space` = skip line / advance line, `→` = next scene, `←` = prev scene, `Esc` = restart.
- New `Narrator.tsx` overlay component. Renders the resized `LibrarianBot` (24×32 → 18×24 via a `.narrator .librarian-sprite` override, top-right of stage) plus an auto-typing bubble. Types at ~28 ms/char, holds 1400 ms after a line completes, auto-advances to the next line. Skip-tick from `Story` completes a mid-typing line instantly or jumps to the next line if already complete.
- New `data/script.ts` with all 9 scenes structured as `{ id, title, lines[] }`. Lines are plain-language narrator beats (~30 across the script). Locked from the sparring; will tighten in Phase E.
- Temporary placeholder scene component shows `scene N / 9 :: <title>` + "scene visuals land in phase c+". Replaced one-by-one in Phase D.
- `App.tsx` mounts `<Story />`.
- Persistent keyboard hint pinned bottom-centre: `[ space ] SKIP / NEXT LINE · [ → ] NEXT SCENE`.

Verified in Chrome via DevTools: boot loads on Scene 1, narrator auto-types beat 1, hold, auto-advances to beat 2, caret blinking. No console errors.

Next: **Phase C — Scene 9 first.** Build the Jeweller scene including the pixel-art-to-real-Button reveal so the end-state is validated before scenes 1–8 build out.

### Phase C — Scene 9 (Jeweller, the payoff) ✓

Built the bookend first so the end-state is validated before the rest. The pixel-to-real-`<Button>` reveal is the strongest emotional beat in the whole story — if it doesn't land, scenes 1–8 have no destination.

**New:**
- `Necklace.tsx` — 48×40 logical pixel-art sprite with 4 states (`none` / `gem` / `cord` / `full`). Gemstone is a faceted teal jewel; cord is a grey strand looping around the top; clasp is a small metal piece. Inline-SVG, `shape-rendering="crispEdges"`.
- `Jeweller.tsx` — Scene 9 component. Shop sign top, simple silhouette interior, jeweller character (kept `Token` sprite), workbench surface, and the display zone where the necklace assembles and then dissolves into the real Button.
- Beat-driven state machine: beat 0 = empty bench; beat 1 = three component tags appear (gem / cord / clasp); beat 2 = sub-timed assembly (gem at +0ms, +cord at +700ms, +clasp at +1500ms); beat 3 = `revealing` phase (necklace fades out over 600ms); beat 4+ = `revealed` (real `<Button>` visible).

**Modified:**
- `Narrator.tsx` — added `onBeatChange(idx)` callback. Emits whenever `lineIdx` changes so the active scene can drive visuals in lock-step with the narration.
- `Story.tsx` — hoisted `activeBeatIdx` state, resets it when `sceneIdx` changes, passes it down to whichever scene is rendering. Routes `scene.id === 'jeweller'` to `<Jeweller />`, all other ids still fall through to the Phase B placeholder.
- `app.css` — added the Jeweller layout, shop sign, interior silhouettes, workbench, component tags, necklace sprite styles, fade-out transition, and the `.real-button-display` reveal with `animation: button-reveal 600ms steps(3, end)`. The `.showroom-button` rule explicitly sets `image-rendering: auto` to override the global pixelated rule — the visual cue that the world has shifted to "real."

**Verified in Chrome via DevTools:**
- Pressed ArrowRight ×8 to jump straight to Scene 9. Shop sign, jeweller, bench rendered cleanly.
- Pressed Space repeatedly to walk through narrator beats 0→4. Component tags showed at beat 1; necklace sub-timing landed (gem → cord → full); reveal triggered on beat 3; real `<Button>` with teal accent + Inter font sat on the bench at beat 4.
- The real `<Button>` resolves `var(--eds-color-bg-accent-fill-emphasis-default)` correctly — that's the entire eds-tokens pipeline working in production right inside the workshop game.

**Known polish items for Phase E (deliberately not fixed now):**
- Workshop interior reads sparse — walls and windows are dark blue silhouettes that don't feel grounded. A real Aseprite background would help.
- Jeweller character is the existing Token sprite — could use a colour variant to read as "different person from the factory worker."
- Necklace-to-Button transition is a fade; could become a "shatter" or "dissolve" for more drama.
- The bench-components tags at beat 1 feel pedagogical rather than narrative — could be replaced with mini-sprites of each component appearing one at a time.

Phase C exit criteria met: Scene 9 plays in isolation, real `<Button>` renders correctly with real EDS variables. Time to build Scenes 1–8.

### Phase D.1 — Scene 1 (The Dock) — first draft, awaiting review

**Scope.** Lorry with Figma logo parked at the goods terminal. Five conveyor belts visible. Worker between lorry and belts. Beat-driven state machine: terminal sign pulses at beat 1, crate appears on lorry at beat 2, belts brighten/dim at beat 3, crate animates onto the Color Scheme belt at beat 4.

**New components.**
- `Lorry.tsx` — 80×40 logical pixel-art lorry. Cargo + cab + window + 3 wheels + headlight. Figma logo on the cargo panel as 4 stacked coloured squares (orange/purple/green/blue).
- `Dock.tsx` — Scene 1 component. Terminal sign top, lorry-spot bottom-left, dock worker (Token sprite), belt-stack right side with 5 lane rows (color-scheme + 4 siblings). Crate-in-transit element with keyframe animation.

**Modified.**
- `Story.tsx` — added `Dock` import and route for `scene.id === 'dock'`. Updated `isReady` helper.
- `app.css` — added `.dock-scene`, `.terminal-sign` + pulse keyframe, `.lorry-spot` + `.lorry-sprite`, `.crate-on-lorry` + `.crate-label`, `.dock-worker`, `.belt-stack` + `.belt-rail` + active/sibling states, `.crate-in-transit` + `crate-sort` keyframe.

**Known issues in this draft (awaiting evaluation):**
1. **"FIGMA" text on lorry cargo only reads "FIE"** — manual pixel-rect letter drawing is incomplete. Letters need to be redone or replaced with the actual Figma wordmark in another way (image asset, or simplified inline-SVG path).
2. **Crate-sort animation lands on the wrong belt** — keyframes target `translate(260px, -15px)` which ends up at the Spacing belt level, not Color Scheme. Y translation needs to be significantly more negative (~-110px) to land on the top belt.
3. **Mid-scene sparseness** — large empty space between the lorry (bottom-left) and the belt stack (right). Could add machinery silhouettes or compress horizontally.
4. **Crate-on-lorry visibility** — beat 2 should show the crate sitting on the lorry's cargo bed. Position needs verification (current `top: -30 * var(--px)` may be off).

**Verified in Chrome:** scene routes correctly, narrator drives beat state, belts highlight at beat 3, crate animates at beat 4 (but to wrong position).

Pausing here for review before continuing to Scene 2 (Inside the Factory).

### Phase D.1b — Scene 1 redesigned per user mockup

User provided a target mockup showing a more grounded composition than my first cut: lane labels stacked top-left as a *destination indicator* (not five parallel physical belts), one horizontal conveyor running the full stage width at the bottom, a factory building with stepped silhouette + gate on the right, and the crate sliding horizontally along the belt with a pause at the worker for inspection before passing through the gate into the building.

**New components:**
- `Building.tsx` — pixel-art factory silhouette with stepped roof (three tiers, each progressively taller toward the right), chimney on tallest tier, one small blue window per roof level. Base wall + 3 stepped roof rectangles, dark grey colour, fills the right edge of the stage.
- `Gate.tsx` — sliding gate with two halves (top half slides up, bottom half slides down) when `open` prop is true. Inline-SVG planks rendered with `preserveAspectRatio="none"` so they stretch to fit the frame.

**Restructured `Dock.tsx`:**
- Lane labels moved from right-side rails to a vertical stack at top-left. They no longer have arrows pointing into separate physical belts — they're a *destination indicator*. Color Scheme bright when `activeBeatIdx >= 3`, siblings dim to 20%.
- One horizontal conveyor belt at the bottom of the stage, running full width with `repeating-linear-gradient` stripes that scroll via `belt-scroll` animation.
- Lorry repositioned to sit on the belt at the left end.
- Worker repositioned to stand on the belt in the middle.
- Factory building anchored bottom-right; gate-frame at its base where the belt enters.
- Crate has two positioning modes: `dock-crate-on-lorry` (visible during beats 2–3, sits on top of the lorry's cargo with a "color scheme" label), and `dock-crate-journey` (visible during beat 4+, slides via state-class transforms).

**Crate journey state machine:**
- `idle` — pre-beat-4, crate hidden.
- `sliding-1` — `translateX(60px)` over 1200ms (lorry → just before worker). Triggered at beat 4.
- `inspecting` — `translateX(140px)`, paused at worker. After 1400ms.
- `sliding-2` — `translateX(280px)` over 1200ms (worker → gate). After 2400ms.
- `entering` — `translateX(298px)`, gate is open. After 3600ms.
- `inside` — `translateX(305px)`, opacity 0, crate disappeared into building. After 4400ms.

The `Gate.open` prop is `journey === 'entering' || journey === 'inside'` — gate slides open just as the crate arrives, closes once it's inside.

**Verified in Chrome:** layout matches the mockup. All elements render at correct positions. Crate visible sliding mid-journey during beat 4 (transition timing works). Lane indicator highlights at beat 3. Gate opens for the crate.

**Known carry-over bugs not yet fixed:**
1. **"FIE" still showing on lorry cargo** instead of "FIGMA". Manual pixel-rect letters incomplete. Three replacement options proposed (pixel-rect redo, SVG `<text>` element, or drop the wordmark).
2. **Beat-4 crate has no "color scheme" label** — only the on-lorry crate (beats 2–3) shows the label. Could carry it along.
3. **Crate doesn't visibly "pause" at worker** — the state transition happens but the worker doesn't react. Could add a brief worker animation (pause to read) or a thought bubble.

### Phase D.2 — Scene 2 (Inside the Factory) ✓

Parallax-scrolling interior bridge. Belt continues from Scene 1 but scrolls in opposite direction (leftward) under a stationary crate, suggesting the camera is travelling with the crate deeper into the factory. Background machinery silhouettes scroll at half-speed for depth. Two-tile flex container shifted at 200% width with `translateX(-50%)` animation gave a seamless loop after an initial visible snap-back was fixed (commit `938e18856`). Narrator introduces `bg-floating` by name. Commits: `7919aadf1`, `938e18856`.

### Phase D.3 — Scene 3 (The Crack) ✓

Slam-press station. Static (non-animated) belt under the press rig — earlier draft had the belt continuing to scroll which broke the "we've stopped" feel; replaced with a still-belt sprite per user direction. SLAM keyframe on the press head. Crate splits open on impact, glowing geode revealed inside. Also introduced `SceneHeader` here — a shared top bar showing package name (left, blue) + scene title (centre, yellow stars). Commit: `a01617999`, then `1da72662c` for the SceneHeader extraction and belt fix.

### Phase D.4 — Scene 4 (The Reveal) ✓

Geode lifted out of the cracked crate to centre stage. `NestedStones.tsx` introduced as a reusable nested-circle sprite. Originally rendered three concentric stones (concept/semantic/palette per the early "alias chain" model). Narrator names the layered structure but holds detail until Scene 5 (Peel). Label reads "two-layered geode" — was three-layered initially, corrected when the build-emitted var name was separated from Figma-source layers (see Phase D.5 corrections). Commit: `0252d52df`.

### Phase D.5 — Scene 5 (The Peel) ✓

The pedagogical anchor scene. Replanned twice mid-implementation as user corrections compounded:
- **First correction:** the `--eds-color-bg-floating` CSS variable name is emitted by the *build* package, not part of the Figma source — so it's not a third layer of the geode. Reduced stones to two (outer = Figma source name `Bg.Floating`, inner = actual value `#ffffff` resolved via `Light.Gray.2`).
- **Second correction:** narration "the geode is now shippable as CSS" was an overclaim. The build-time stamp only attaches the var *name*; cutting + packaging still has to happen. Narration adjusted to "the geode now carries its CSS variable name. it still needs cutting and packaging."
- **Third correction:** redundant `@equinor/eds-tokens-build` text inside the stamp hammer head was removed — the SceneHeader already labels the package, the hammer should read as a tool. Final state: `6047325ba` → `e00084d70` → `46d34a26d` → `ad1b9a523` → `4a17472bc`. The redesign added a stamp-press sprite that lowers on beat 3, slams on beat 4 to attach the CSS-name sticker.

Beat machine: 0 intro / 1 outer-layer info / 2 inner-core info / 3 stamp lowers / 4 SLAM + sticker drops / 5 holds. Sticker drops from above (`top: calc(18 * var(--px))`) to rest on top of the geode — earlier version had it landing in mid-air, fixed with the lower top value.

### Phase D.6 — Scene 6 (The Cutting) ✓

`light-dark()` introduction. New `Gemstone.tsx` sprite — 36×36 logical px, top half (light value) + yellow seam (`#ffec27` over `#ffa300`) + bottom half (dark value). 5-beat state machine: two raw values on the bench (light + dark hex swatches with labels) → fusion animation (`cutting-pair.is-fusing`) → single two-facet gemstone with yellow glow → CSS declaration card showing `--eds-color-bg-floating: light-dark(#ffffff, #202223);` with per-token colour coding (yellow prop, blue fn, white/grey hex spans). Commit: `386c9bbaa`.

### Phase D.7 — Scene 7 (The Tray) ✓

Lane output as a file: the just-cut gemstone joins a tray of six concept-colour gemstones (`bg-default`, `bg-subtle`, `bg-floating` (hero), `text-default`, `text-subtle`, `border-default`). `Gemstone` extended to accept a `colors` prop so each slot renders its own light/dark facets; `HERO_GEM` exported as a shared constant. 2 beats: beat 0 = hero hovers above its empty (dashed-yellow) slot; beat 1 = drops in + `color-scheme.css` file label appears below. Commit: `44e9fd2cd`.

### Phase D.8 — Scene 8 (The Packaging) ✓ (with two corrections)

Most complex scene. Other-lane bins on the left rail (cords/spacing, clasps/density, chains/typography with new pixel sprites), shipping box in the centre with the hero gem inside, three-rail grid layout. 7-beat state machine through bins pulsing → inspector arrives → focus on two-facet cut → polish-the-output → code-card → box-sealed.

**First-draft error caught by user (commit `1db2b663a` fix):** I had invented `--eds-color-bg-floating-light` and `--eds-color-bg-floating-dark` suffixed variables and framed the build-dark-scope step as "three explicit faces — light, dark, and a fallback." User checked the built CSS and found no such variables. The actual `build-dark-scope` behaviour, per `packages/eds-tokens-build/CLAUDE.md`: it replaces `--name: light-dark(L, D)` with `--name: L` at `:root`, then appends three additional scope blocks (`[data-color-scheme=light]`, `[data-color-scheme=dark]`, and `@media (prefers-color-scheme: dark) :root:not([data-color-scheme=light])`) — same variable name, four resolved values via selector scopes. Replaced the three-face split with a 2×2 grid of "scope tiles" (selector header, solid swatch, hex value, note) and updated narrator copy: was *"the inspector adds three explicit faces — light, dark, and a fallback"*, now *"the inspector re-declares the same token under four selector scopes — one variable, four resolved values."*

**Second-draft error (commit `92449b4d5` fix):** stamp said `variables.min.css` but `build-dark-scope` writes to `variables.css` in-place; the `.min.css` is a downstream `lightningcss --minify` pass that adds no narrative value. Renamed the stamp on both Scene 8 sealed-box and Scene 9 arrived-box, updated narrator to "Box sealed. Labelled variables.css."

Also extracted `CordSprite`, `ClaspSprite`, `ChainSprite` into a shared `LaneSprites.tsx` so Scene 9 can reuse the same sprites for visual continuity.

### Phase D.9b — Scene 9 (The Jeweller) rebuilt for Scene 8 coherence ✓

Original Phase C build (commit `d803fce07`) used a teal-jewel `Necklace.tsx` and a grey-strand cord that bore no resemblance to the bg-floating gemstone or the purple cord sprite established by Scene 8. User feedback: "scene 9 needs better visuals, its not coherent with the elements in scene 8 anymore."

Rewrote `Jeweller.tsx`:
- Beat 0: the sealed `variables.css` box from Scene 8 sits on the bench (recognisable from Scene 8 — same orange border, dark-purple body, yellow lid, rotated yellow stamp; smaller scale than Scene 8's centre-stage box).
- Beat 1: the four lane materials (Gemstone, CordSprite, ClaspSprite, ChainSprite — each with `label` + source package badge) appear on the bench.
- Beat 2: materials converge (per-item staggered `jeweller-converge` keyframe, 100ms delay per item).
- Beat 3: yellow flash transition (`jeweller-flash` keyframe).
- Beat 4: real EDS `<Button>` (the original Phase C reveal mechanism preserved verbatim — `image-rendering: auto`, real Inter font stack, real `var(--eds-color-bg-accent-fill-emphasis-default)`).

`Necklace.tsx` is no longer imported but kept in-tree for reference.

Commit covered both the Scene 8 build-dark-scope fix and the Scene 9 rebuild together: `1db2b663a`.

---

### Phase D summary

All 9 scenes wired end-to-end. Visual vocabulary is now consistent from dock through jeweller. Sprite-level components shared across scenes:
- `Gemstone` (Scenes 6, 7, 8, 9) with the `colors` prop for tray variants
- `CordSprite` / `ClaspSprite` / `ChainSprite` (Scenes 8, 9) via `LaneSprites.tsx`
- `SceneHeader` (every scene from D.3 onward) — consistent package-label + title bar
- `NestedStones` (Scenes 4, 5)

**Next: Phase E — Polish.** Audio (ZzFX), narrator copy pass end-to-end, multi-viewport smoke tests, internal review with Frida + Alex.

### Phase D.10 — Pipeline accuracy audit + corrections ✓

User asked for a thorough verification of the story against the actual pipeline because earlier sessions had baked in confident assumptions. Read `eds-tokens-sync/CLAUDE.md`, `eds-tokens-build/CLAUDE.md`, `eds-tokens/CLAUDE.md`, the build-dark-scope source, all token JSON files for `bg-floating`, and the published `variables.css` + package.json exports map.

**Verified correct against the codebase:** `light-dark(#ffffff, #202223)` is the literal authored form in `color-scheme.css` (verified by grep); `#ffffff` resolves from `Light.Gray.2`; `#202223` resolves from `Dark.North sea.2`; `color-scheme.css` is the per-lane file output; sync uses Figma REST API; build-dark-scope produces the four selector contexts shown in Scene 8.

**Discrepancies found and fixed (this phase):**

- **Scene 5 — alias chain was three layers, not two** (commit `9a07f6e0a`). My earlier two-stone reduction was based on a confused framing where I had labelled the build-emitted CSS var name as the third stone. The actual chain is `Concept.Mode 1.json` → `🌗 Color scheme.Light.json` → `Color Light.Mode 1.json`, and the middle layer (the *scheme* alias) is the swap point that makes light/dark theming work — exactly the layer that was missing. Restored NestedStones to three concentric stones, extended Peel to 8 beats, rewrote the narrator copy to teach the *why* of three layers (swap the middle = change the colour without touching product code or palette).
- **Scene 8 — sibling-lane mapping wrong** (this commit). `clasps from density` mixed up a sub-axis (density is a variant of spacing) with a top-level lane. The actual top-level lanes in `build/css/` are color, spacing, typography, elevation. Fixed to `clasps from elevation`.

- **Scenes 1+2+5 — wrong lane for the protagonist** (commits `67821c16c`, `ddf75c669`). Bg.Floating's identity lives in `Concept.Mode 1.json`, which is a collection *inside* the **Static** Figma file — not a standalone "concept" lane. The Dock was previously highlighting "color scheme" (and briefly "concept") as the active lane; both were inaccurate. Fixed by rebuilding the Dock LANES around the five actual Figma files from `eds-tokens-sync/CLAUDE.md`: **static** (active — protagonist's home), foundations, dynamic, spacing primitives, design tokens. Scenes 2 + 5 updated to surface the Static / Foundations split (the alias chain crosses two Figma files).
- **All scenes — terminology consistency pass** (this commit). Once Scene 1's lane vocabulary settled on Figma-file names, every downstream scene had to be brought in line:
  - Scene 3: protagonist now named explicitly in the geode reveal ("Bg.Floating in his raw JSON form") so the audience attaches the name they heard in Scene 2 to the visible jewel.
  - Scene 6: dark-mode line capitalised to "Bg.Floating" and now names the source file (`🌗 Color scheme.Dark.json → Dark.North sea.2`), matching the Foundations-file framing introduced in Scene 5.
  - Scene 8: sibling-lane narration switched from token-category names ("spacing / elevation / typography") to Figma-file names ("spacing primitives / foundations · elevation / design tokens · typography"). Packaging.tsx bin labels updated to match.
  - Scene 9: Jeweller.tsx material `pkg` labels rewritten to match Scene 1's lanes (`static` for the gemstone since that's the protagonist's home; `spacing primitives` / `foundations` / `design tokens` for the others).

**Discrepancies surfaced but left as deliberate workshop simplifications:**

- **Scene 8/9 stamp `variables.css`.** `package.json` actually exports `./build/css/variables.min.css` for both `./css/variables` and `./css/variables.css` import paths, so consumers always receive the minified file. The workshop ends Scene 8 one step earlier (on the file `build-dark-scope` writes) per the locked decision to skip the minify step. This is a knowing simplification, not an error — record it here so a future reader doesn't `fix` it back.
- **Scene 8 polish reason.** Narration "browsers without light-dark() still need to know which value to use" is shorthand for the deeper motivation per `eds-tokens/CLAUDE.md`: downstream lightningcss polyfills `light-dark()` *incorrectly* — its polyfill resolves at `:root` and breaks subtree-scoped dark mode (when a child element opts into a different scheme than the page root). The simpler framing is workshop-appropriate; the deeper reason is in `eds-tokens/CLAUDE.md` § Pitfalls for anyone digging deeper.
- **Scene 7 tray vs file.** Tray visual = the protagonist's *concept* gemstones; the actual `color-scheme.css` file *also* contains the lowercase scheme aliases and palette tokens our concepts resolve through. Narration acknowledges this without forcing the visual to show all of it.

**Audit lesson** (added to "Lessons from the first build"): when modelling the pipeline, *read the source code*, don't reason from the narration. I had previously invented `--eds-color-bg-floating-light/-dark` suffixed variables and a "fallback" framing — both untrue. Verify each pipeline claim against the actual file output before encoding it as a narrator beat. Also: lanes at the sync stage are Figma files, not token categories. The two don't 1:1 map.

### Phase D.11 — Driver UX: space advances scene at end of beat ✓

Previously a space press on the last fully-typed line did nothing — driver had to switch hands to ArrowRight. Added an `onAdvancePastEnd` callback to `Narrator.tsx` and wired it to `Story.tsx`'s existing scene-advance action. Skip flow is now: complete mid-typing → advance line within scene → at end of last line, advance to next scene. Commit `a837dea6e`.

### Phase D.12 — Scene 8 + 9 match Scene 1's lane count ✓

Scene 1 shows 5 Figma-file lanes (static + 4 others). Scene 8's shipping bench previously displayed only 3 sibling bins (cords/clasps/chains), so the "four other lanes" narration didn't line up with the visual — and the **dynamic** lane was missing entirely. User caught this directly.

Fixed by adding a fourth material:
- New `LacquerSprite` (16×16, small pink/purple vial with cap, highlight, shadow) added to `LaneSprites.tsx` — represents the Dynamic lane (appearance variants applied via `data-color-appearance`).
- `Packaging.tsx` LANES grew to four bins: cords / clasps / chains / lacquer, mapped to spacing primitives / foundations (elevation) / design tokens (typography) / dynamic (appearance).
- `Jeweller.tsx` MATERIALS grew to five (gemstone for Static + the four sibling materials) so Scene 9's assembly mirrors what Scene 8 shipped.
- Scene 8 narration extended to name the fourth bin: *"Lacquer from dynamic (appearance)."*
- Scene 9 narration extended to mention lacquer alongside the other materials.

### Phase D.13 — Scene 0 intro ✓

User asked for a welcome scene before the dock. The LibrarianBot (otherwise pinned top-right as the in-scene narrator) takes centre stage with a scaled-up speech bubble, and three lines of intro text sit the audience down before the story begins.

- New `intro` scene prepended to `SCRIPT` in `data/script.ts`. Three driver-paced lines:
  - *Welcome to the Token Factory.*
  - *A short story about how a design token travels from Figma to the components your team ships.*
  - *Press [space] to advance. Press [→] to jump scenes.*
- `Narrator.tsx` gained a `centered` prop. When true, the wrapper applies an `.is-centered` modifier class that absolute-positions the bot + bubble dead centre, swaps the layout to column, scales the LibrarianBot sprite up (24×32 → 36×48 logical), enlarges the bubble font and padding, and points the bubble tail upward at the bot above it.
- `Story.tsx` passes `centered={scene.id === 'intro'}` and adds `'intro'` to the `isReady` set so the placeholder scene doesn't render under the centred bot.
- `app.css` carries the centred variant rules right after the default `.narrator-caret` block, scoped via `.narrator.is-centered`.

The intro scene has no other visual chrome — the centred narrator is the whole scene. From here, pressing space three times (or hitting `→` once) lands on the existing Scene 1 Dock. Total scene count is now 10.

---

## Phase G — Multi-lane architecture

Today's app is locked to one lane (`static` — the Bg.Floating story). Phase G generalises the runtime so the existing five Figma-file lanes (`static`, `foundations`, `dynamic`, `spacing primitives`, `design tokens`) can each carry their own scene sequence, with the **Dock as the diegetic branch point**: at beat 3 of the dock scene, the lane labels become clickable; clicking one swaps the protagonist crate's label and re-routes the downstream story into that lane's arc.

No hub scene — the branch is in the world, not a menu.

### State model

```ts
type Route =
  | { kind: 'prologue'; sceneIdx: number }   // 0 = intro, 1 = dock (shared)
  | { kind: 'lane'; laneId: LaneId; sceneIdx: number }

const [route, setRoute] = useState<Route>({ kind: 'prologue', sceneIdx: 0 })
const [selectedLaneId, setSelectedLaneId] = useState<LaneId>('static')
```

Intro + Dock are shared prologue scenes — never duplicated per lane. Each lane owns only its post-Dock arc.

### Lane shape

```ts
type Lane = {
  id: LaneId
  label: string              // shown in indicator + on crate sticker
  accent: string             // PICO swatch for theming
  status: 'ready' | 'scaffold' | 'locked'
  scenes: Array<{ id: SceneId; title: string; lines: string[] }>
}
```

- `static` → ready; today's 8 post-Dock scenes (Inside → Jeweller)
- one placeholder lane → scaffold; ~4 generic placeholder scenes, lane-id deliberately uncommitted
- remaining lanes → locked; rendered dim in the indicator, not clickable

### Scene registry

`Story.tsx`'s if-chain is replaced by `SCENES: Record<SceneId, FC<SceneProps>>`. Adding a lane = drop new scene components, register, reference from a lane's `scenes` array. `useLane()` context hook gives scenes access to the active lane (for label, accent, future content).

### CSS strategy

- `app.css` (2629-line monolith) is dissolved into:
  - `styles/base.css` — viewport, stage, palette, `--px`, `@layer` order, shared keyframes
  - `styles/chrome.css` — narrator, scene-placeholder, scene-header-bar, story-hint
  - Per-sprite CSS colocated next to each component
  - Per-scene CSS colocated next to each scene
- Layer order declared once: `@layer tf-base, tf-sprites, tf-chrome, tf-scenes;`
- Lane accent via `data-lane` on `.stage` + `--_lane-accent` custom property (G.4)

### Migration phases

| Phase | What ships | Risk |
|---|---|---|
| **G.0** | File reorg + CSS split — `components/` → `sprites/` + `chrome/` + `scenes/{dock,static}/`. `app.css` dissolved into base + chrome + per-component files, all wrapped in `@layer`. **No behaviour change.** | Low — pure structural refactor |
| **G.1** | Scene registry + lane data — introduce `LANES`, `SCENES`, `LaneContext`. Move existing `SCRIPT` into `STATIC_LANE.scenes` (minus prologue). `Story.tsx` switches to registry lookup. | Low |
| **G.2** | Route state + Dock branch UI — add `Route` + `selectedLaneId`. Lane indicator becomes clickable at beat ≥3. Crate sticker + worker reaction read from selected lane. Narrator line 3 rewritten to invite click. | Medium — first behaviour change |
| **G.3** | Scaffold a placeholder lane — one extra lane in `LANES` (id TBD), `status: 'scaffold'`, scenes route to a generic `PlaceholderScene` component. Proves end-to-end branching without committing pedagogy for any specific Figma-file lane. | Low |
| **G.4** | Lane theming via `data-lane` + `--_lane-accent`. Locked lanes get a "soon" badge. | Low |

### Sequencing
Phase E (polish) and F (workshop) remain the deadline-bearing items. Phase G after F is the safe sequence; G can land before E if there's runway, but the workshop can ship on the existing single-lane structure.

---

## Phase log (cont.)

### Phase G.0 — File reorg + CSS split ✓

Pure structural refactor. **No behavioural change.** Build + Chrome smoke confirmed identical to pre-G.0.

**Directory moves (`git mv`):**
- `src/components/Story.tsx` `Narrator.tsx` `SceneHeader.tsx` → `src/chrome/`
- `src/components/{Crate,Gemstone,LaneSprites,NestedStones,LibrarianBot,Lorry,Building,Gate,Lever,Token,StationLog,Necklace,Geode}.tsx` → `src/sprites/`
- `src/components/Dock.tsx` → `src/scenes/dock/Dock.tsx`
- `src/components/{Inside,Crack,Reveal,Peel,Cutting,Tray,Packaging,Jeweller}.tsx` → `src/scenes/static/`
- `src/components/` removed

**CSS split (was: one 2629-line `app.css`):**
- `src/styles/base.css` — font + EDS imports, PICO palette, stage dims, `--px`, reset, viewport, stage, **`@layer tf-base, tf-sprites, tf-chrome, tf-scenes;` order declaration**, plus three globally-needed keyframes (`caret-blink`, `belt-scroll`, `peel-info-pop`) and the shared `.belt-strip` utility (used by dock + inside + crack).
- `src/styles/chrome.css` — narrator (default + `is-centered`), scene-placeholder, scene-header-bar, story-hint, boot-placeholder. All inside `@layer tf-chrome`.
- 12 colocated sprite CSS files under `src/sprites/` — each TSX imports its `.css` neighbour. All inside `@layer tf-sprites`.
- 9 colocated scene CSS files under `src/scenes/{dock,static}/` — each scene TSX imports its `.css` neighbour. All inside `@layer tf-scenes`.

**Top-level CSS loading:** `main.tsx` imports only `styles/base.css` + `styles/chrome.css`. Sprite + scene CSS flow in transitively via their TSX imports — Vite bundles everything to a single `index.*.css` per build.

**Verified:**
- `pnpm tsc --noEmit` clean.
- `pnpm vite build` clean — 59 modules transformed (was 39), CSS bundle 139.29 kB gzip 24.89 kB (was 140.49 kB / 25.00 kB). Tiny reduction from collapsing the old top-level comments.
- Chrome dev playthrough confirms identical visuals on intro / dock / inside / crack / reveal / cutting. No console errors beyond a benign favicon 404.

**Carried forward into G.1+:** the `@layer` order declaration is in place but no scene/sprite CSS yet depends on layer precedence — purely future-proofing. The shared `.belt-strip` rule + cross-scene keyframes (`peel-info-pop`, `caret-blink`) sit in `base.css` because they're used by multiple scenes/sprites; this is the only structural "smell" — if it grows, hoist to a dedicated `shared.css`.

### Phase G.1 — Scene registry + lane data ✓

Introduces the data model that G.2 will route over. **No behavioural change** — the flat sequence of 10 scenes still plays in the same order.

**New data layer:**
- `src/data/lanes/types.ts` — `Lane`, `LaneId` (5-Figma-file union), `SceneId`, `SceneRef`, `NarratorMode`. SceneId is the union of registered scene ids; LaneId is the union of the five Figma files.
- `src/data/lanes/prologue.ts` — `PROLOGUE: SceneRef[]` = the two shared pre-branch scenes (intro + dock). Intro carries `narrator: 'centered'` so the rendering policy lives in data, not a hardcoded string check.
- `src/data/lanes/static.ts` — `STATIC_LANE: Lane` with the 8 post-dock scenes (inside → jeweller) moved verbatim from the old `SCRIPT`.
- `src/data/lanes/index.ts` — re-exports + `LANES: Partial<Record<LaneId, Lane>>` (only `static` is filled in; the other four lane ids exist in the type but aren't populated yet).
- `src/data/sceneRegistry.ts` — `SCENES: Record<SceneId, FC<SceneProps>>`. Each scene id resolves to its component. Adding a new scene = drop component + add one line here.

**New chrome:**
- `src/chrome/LaneContext.ts` — `createContext<Lane>(STATIC_LANE)` + `useLane()` hook. Story.tsx provides; no scene consumes yet (G.2 wires the dock to it).
- `src/scenes/intro/Intro.tsx` — returns `null`. Exists so the registry resolves `intro` uniformly; the centred narrator carries the whole scene.

**Story.tsx rewrite:**
- The hardcoded if-chain (`{scene.id === 'dock' && <Dock />} {scene.id === 'inside' && <Inside />} ...`) is replaced by `const Scene = SCENES[scene.id]; <Scene activeBeatIdx={...} />`. Adding scenes no longer requires editing Story.
- `SCRIPT` consumption replaced with `[...PROLOGUE, ...STATIC_LANE.scenes]` (memoised). Same 10-scene flat sequence as before.
- Narrator's `centered` prop now reads `scene.narrator === 'centered'` instead of `scene.id === 'intro'`. Per-scene narrator config is data, not hardcoded.
- Story wrapped in `<LaneContext.Provider value={STATIC_LANE}>`. Default is Static; G.2 changes this when the user selects a different lane at the dock.

**Removed:** `src/data/script.ts` (its contents are now in lane data). The "phase b scaffold" hint label inside Story.tsx is gone — every scene is now backed by a real component.

**Verified:** tsc + vite build clean (59 modules, no diff in module count). Chrome smoke shows intro + dock identical to G.0.

### Phase G.2 — Route state + Dock branch UI ✓

First user-visible behaviour change in Phase G. The dock is now a diegetic branch point: at beat ≥3 the lane indicator rows become buttons, and clicking a different lane swaps the selected lane (crate sticker + worker bubble update). Story routing is now lane-aware.

**Story.tsx rewrite — route state:**
- Replaced the single `sceneIdx` with `Route = { kind: 'prologue', sceneIdx } | { kind: 'lane', laneId, sceneIdx }`. Default `{ kind: 'prologue', sceneIdx: 0 }`.
- Added `selectedLaneId: LaneId` state, default `'static'`. Lifted via a new `LaneSelectionContext`.
- `advance` traversal:
  - Inside prologue: increment until last, then jump to `{ kind: 'lane', laneId: selectedLaneId, sceneIdx: 0 }`. If the selected lane has no scenes (locked), loop back to intro instead.
  - Inside a lane: increment until last, then loop to `prologue/0`.
- `back` traversal symmetric: prologue/0 wraps back to the selected lane's last scene; lane/0 steps back to dock (last prologue scene).
- `Esc` restarts to `prologue/0`. Keyboard handler otherwise unchanged.
- Story now provides two contexts: `LaneContext` (current lane, read-only) and `LaneSelectionContext` ({ selectedLaneId, setSelectedLaneId }).

**LaneContext.ts — split into two contexts:**
- `LaneContext` already existed — still carries the active `Lane` object.
- New `LaneSelectionContext` exposes the read+write pair so the Dock can call `setSelectedLaneId(id)` without prop-drilling. Two contexts (not one) so read-only consumers don't re-render when the setter identity changes.

**LANES registry — all 5 lanes populated:**
- G.1 shipped LANES as `Partial<Record<LaneId, Lane>>` with only `static` filled in. G.2 promotes it to a full `Record<LaneId, Lane>` and adds locked placeholder entries for `foundations`, `dynamic`, `spacing-primitives`, `design-tokens`. Each has `status: 'locked'` and empty `scenes: []`. The Dock iterates `Object.values(LANES)` for display order.
- G.3 will promote one of the locked entries to `status: 'scaffold'` with placeholder scenes.

**Dock.tsx rewrite:**
- Deleted the local hardcoded LANES constant — now reads from the central registry via `Object.values(LANES)`.
- Lane rows are `<button>` elements. At beat ≥3, rows where `status !== 'locked' && id !== selectedLaneId` become `is-clickable` (cursor:pointer, hover state, focus-visible outline). Clicking calls `setSelectedLaneId(lane.id)`.
- Active row determined by `lane.id === selectedLaneId`, not hardcoded `'static'`.
- Locked rows render with `is-locked` class — extra-dim, arrow replaced by `·`, `aria-label` reads "coming soon".
- Crate travel label + worker reaction bubble read `LANES[selectedLaneId].label` so they update reactively if the driver switches lanes during the dock.
- Lane swatch background now reads `var(${lane.accent})` from the registry — no longer hardcoded per-lane.

**Narrator copy:** dock beat 2 rewritten to invite click ("Our crate is labelled 'static'. Click another lane label to follow that one instead."), beats 3–5 made lane-agnostic ("matching belt" not "static belt").

**CSS:** dock.css updates `.lane-row` to reset native `<button>` look (font-family/color inherit, text-align:left, no default border). New `.is-clickable` modifier with cursor:pointer + hover + focus-visible states. `.is-locked` dims further. Highlighted-sibling opacity bumped 0.2 → 0.35 so unselected ready lanes read as available.

**G.2 caveat:** with only `static` ready, no lane is currently clickable — locked lanes ignore the click, current lane ignores it (`!isActive` guard). The UI affordance is in place; G.3 will make the click meaningful by promoting one lane to `'scaffold'`.

**Verified:** tsc + build clean (59 → 60 modules with the new Intro.tsx + LaneContext extension). Chrome smoke: intro → dock → scene 3 reaches "five Figma files" beat with STATIC highlighted + other 4 dim. ArrowRight from dock advances into `lane(static)/inside` correctly via the route reducer.

### Phase G.3 — Scaffold a placeholder lane ✓

Architecturally proves the multi-lane runtime end-to-end. A second lane (Foundations) now appears as clickable at the Dock; selecting it routes the post-dock story through a generic `PlaceholderScene` component.

**New scene:**
- `src/scenes/placeholder/PlaceholderScene.tsx` + `placeholder.css` — generic, lane-agnostic scene. Pulls the active lane via `useLane()` for label + accent, reads `scene.title` + computes its own index within the lane for the "SCENE 1/4" badge. SceneHeader pkg reads `lane · {laneId}` so the centre title doesn't collide with a long package name. Card body renders a dashed-line "scene content tbd" hint inside a pixel-art card whose border + stripe paint with the lane's accent.

**Registry + props change:**
- `SceneProps` gains `scene: SceneRef`. Existing scenes don't destructure it; PlaceholderScene needs it to read title and locate itself in the active lane.
- `Story.tsx` passes `scene` alongside `activeBeatIdx` to every scene render.
- `SceneId` union gains `'placeholder'`. `SCENES['placeholder'] = PlaceholderScene`. One component, many scene-ref instances — adding more placeholder scenes is a data-only change.

**New lane data:**
- `src/data/lanes/foundations.ts` — `FOUNDATIONS_LANE` with `status: 'scaffold'` and 4 scene refs all pointing to id `'placeholder'`. Generic narrator copy that does *not* reference the lane by name (lane labels are surfaced visually, not in narration, so the same lines work for any future scaffold lane).
  - Scene titles: "the loading bay" / "the assembly line" / "the packing station" / "the courier" — story-shaped but lane-agnostic.
- `data/lanes/index.ts` — replaces the G.2 locked placeholder for `foundations` with the real `FOUNDATIONS_LANE` import.

**Lane status mapping after G.3:** static → ready · foundations → scaffold (clickable at Dock, routes to 4 placeholder scenes) · dynamic / spacing-primitives / design-tokens → locked (rendered dim, not clickable).

**Verified end-to-end in Chrome:**
- Dock beat ≥3: FOUNDATIONS row brighter than the three locked rows.
- Click FOUNDATIONS → active styling moves from STATIC to FOUNDATIONS, crate sticker updates to "FOUNDATIONS" reactively, worker bubble (when reached) reads "✓ foundations".
- ArrowRight past dock → routes into `lane(foundations)/0`, PlaceholderScene renders "THE LOADING BAY" with "LANE · foundations" + "SCENE 1 / 4 · scene content tbd".

**Bug fixed mid-G.3:** first PlaceholderScene render used `@equinor/eds-tokens · foundations` as the SceneHeader pkg, which was long enough to collide with the centred title. Shortened to `lane · {laneId}`.

### Phase G.4 — Lane theming + locked badge ✓

Final Phase G chunk. Chrome that should tint per-lane now reads `var(--_lane-accent)`. Locked rows in the Dock indicator gain a "soon" badge so the affordance is unambiguous.

**`data-lane` attribute on the stage:**
- App.tsx no longer renders the `.stage` div directly — it just renders `.viewport > Story`. Story.tsx now owns the `<div className="stage" data-lane={selectedLaneId}>` wrapper. This was the minimum change needed to surface `selectedLaneId` as a CSS-readable attribute without a `display: contents` workaround.
- `styles/base.css` adds five `.stage[data-lane='X']` selectors that set `--_lane-accent` to the lane's PICO swatch (`--pico-dark-purple` for static, `--pico-lavender` for foundations, etc.). Adding a new lane = one CSS line.

**Chrome reading `--_lane-accent`:**
- `chrome.css` — `.scene-header-bar` `border-bottom` now `var(--_lane-accent, var(--pico-dark-purple))`. Falls back to dark-purple so Static visuals stay identical.
- `dock.css` — `.crate-travel-label` `background` same change. The sticker sitting on the crate recolours reactively when the driver switches lanes at the dock.
- `placeholder.css` — `.placeholder-card` `border` + `.placeholder-card-stripe` `background` read `--_lane-accent` (with `--pico-dark-gray` fallback). PlaceholderScene.tsx dropped its inline `style={{ borderColor: ..., background: ... }}` — no more JS-driven theming.

**Locked-lane soon badge:**
- Dock.tsx — locked rows render `<span className="lane-soon-badge">soon</span>` in place of the `→` arrow. Clickable rows still get the arrow.
- `dock.css` — `.lane-soon-badge` is a tiny outlined dark-grey pill, deliberately understated so it reads as a status rather than a primary call to action.

**Verified:** tsc + build clean. Chrome smoke confirms locked rows display the "soon" badge inside the dock indicator, FOUNDATIONS row stays clickable, soon-badge styling is subdued and readable at 360×220 logical / 4× physical scaling. Lane switch repaints `--_lane-accent` consumers (scene header bar bottom border + crate sticker background + placeholder card border/stripe).

**Known pre-existing issue surfaced during G.4 click testing:** clicking a different lane at the Dock causes Story.tsx's `advance` callback to get a new identity (it depends on `selectedLaneId` via useCallback). Narrator's `useEffect(..., [lines, lineIdx, typed])` doesn't reset — but the route-reset effect doesn't fire either, so the visible reset to beat 0 is actually a re-render artefact of the typewriter restarting `typed` due to dependency churn elsewhere. Not a G.4 bug; not blocking the workshop. Notes for future polish: stabilise `advance` with a ref, or move the "lane selection" out of state that the keyboard handler reads. Deferred — Phase E or post-workshop.

---

### Phase G summary

Multi-lane architecture complete. Token Factory is no longer locked to one scene sequence — the Dock is now a diegetic branch point that routes the post-dock story through any number of lanes, with no hub scene needed.

**What shipped (G.0 → G.4):**
- File layout split: `chrome/` + `sprites/` + `scenes/{intro,dock,static,placeholder}/`. Original `components/` flat dir gone.
- CSS split: `styles/base.css` + `styles/chrome.css` + colocated per-component CSS. `@layer tf-base, tf-sprites, tf-chrome, tf-scenes` order declared.
- Data layer: `data/lanes/{types,prologue,static,foundations,index}.ts` + `data/sceneRegistry.ts`.
- Chrome layer: `chrome/Story.tsx` (route-aware), `chrome/Narrator.tsx` (unchanged), `chrome/SceneHeader.tsx` (unchanged), `chrome/LaneContext.ts` (Lane + LaneSelection contexts).
- Scenes: `scenes/intro/Intro.tsx` (returns null), `scenes/placeholder/PlaceholderScene.tsx` (generic, reusable across scaffold lanes).
- 1 placeholder lane (Foundations) demonstrates branching end-to-end; other 3 lanes remain `locked`.
- Lane theming via `data-lane` + `--_lane-accent`.

**Adding a new lane (foundations → real story, or promoting any locked lane):**
1. Replace the lane entry in `data/lanes/index.ts` (or create a new `data/lanes/<lane>.ts` file).
2. Set `status: 'ready'`. Each scene's `id` must match a key in `SCENES`.
3. For brand-new scene components: drop them in `scenes/<lane>/`, register them in `data/sceneRegistry.ts`, add the id to the `SceneId` union in `data/lanes/types.ts`.
4. That's it — Dock will pick up the new lane via its `Object.values(LANES)` iteration; theming via `data-lane` picks up the accent automatically.

No scene-level CSS forking required. Sprite components reused across lanes. Shared keyframes (`belt-scroll`, `peel-info-pop`, `caret-blink`) declared once in `base.css`.

**Phases E + F (polish + workshop)** continue against this multi-lane structure. The Static lane's 8 scenes are unchanged; the workshop can ship as-is, with Phase G's branching available but exercised only by demo/curiosity.

### Phase G.5 — Lane name correction (audit fix) ✓

Caught during a casual audit prompted by the question *"is design tokens typography?"* — the fifth lane was misnamed in the codebase, and the Scene 8 narration both undersold the file's contents and mislabelled it.

**The bug.** Phase D.10's pipeline audit (commits `67821c16c`, `ddf75c669`) settled the dock LANES around "the five actual Figma files from eds-tokens-sync/CLAUDE.md" but used `design tokens` for the fifth slot. Re-reading `eds-tokens-sync/CLAUDE.md` and grepping `packages/eds-tokens/tokens/FQQqyumcpPQoiFRCjdS9GM/` shows:

| Per sync docs | Per actual JSON contents |
|---|---|
| **Spacing modes** — "Spacing density variants" | Border radius, Box, Container space, Density, **Font family / size / weight / baseline / tracking / line height**, Horizontal + Vertical gap, Horizontal + Vertical space, Icon size, Page space, Selectable space, Size, Space proportions, Stroke |

So the fifth lane is actually the Figma file named **Spacing modes**, not "design tokens." Typography axes *do* live inside it (under `🅰️ Font *`), but so do roughly a dozen other modal axes. Calling the lane "design tokens" was wrong on the file name; saying "chains from design tokens (typography)" was wrong on both the file name AND under-counting what's inside it.

**Fixes (this commit):**
- `data/lanes/types.ts` — `LaneId` union: `'design-tokens'` → `'spacing-modes'`, with a comment explaining the misleading Figma file name.
- `data/lanes/index.ts` — registry key + `id` + `label` updated to `'spacing modes'`.
- `styles/base.css` — `[data-lane='design-tokens']` selector updated to `[data-lane='spacing-modes']`.
- `data/lanes/static.ts` — Scene 8 packaging beat updated: *"Chains from design tokens (typography)"* → *"Chains from spacing modes (typography, density, radius)"* so the parenthetical reflects the file's actual scope.
- `scenes/static/Packaging.tsx` — bin label `pkg: 'design tokens · typography'` → `'spacing modes · typography'`. Header comment updated to reflect the corrected lane name.
- `scenes/static/Jeweller.tsx` — chain material `pkg: 'design tokens'` → `'spacing modes'`.

**Not fixed (deliberate):** the Spacing modes Figma file's name is itself misleading (it contains far more than spacing modes), but renaming a Figma file is out of scope here. The lane label matches what the sync sees; the parenthetical does the work of communicating actual contents to the workshop audience.

**Audit lesson #2** (filed alongside Phase D.10's lesson about reading source code instead of reasoning from narration): *the workshop's lane vocabulary is locked to whatever Figma file names happen to exist — they are not always accurate descriptions of their contents.* Future audits should grep `packages/eds-tokens/tokens/<fileKey>/` directly rather than trust the sync doc's `Contents` column, which itself was apparently approximate.

**Verified:** tsc clean, build clean, no remaining `design.tokens|design tokens` references in src/. Phase G architecture unaffected — only data labels changed.

### Phase G.6 — Lane names verified against actual Figma files ✓

Caught immediately after G.5 — the previous fix used `eds-tokens-sync/CLAUDE.md`'s `Contents` column again as a source of truth, and that column was *also* wrong on the file name (it said "Spacing modes" but the file is actually called "🅰️ EDS Spacing & Typography tokens"). The user supplied the real names of all five Figma files by opening each one.

**Real Figma file names → lane id mapping:**

| File key | Real Figma name | Lane id (G.6) | Dock label |
|---|---|---|---|
| `OWxw2XogDLUt1aCvcDFXPw` | 🎨 EDS Colours (static) | `colours-static` | `colours · static` |
| `GnovDpL3UV6X51Ot7Kv6Im` | EDS Foundations (Internal) | `foundations` | `foundations` |
| `nyPaQ3QnI1UAcxKW4a0d2c` | 🎨 EDS Colours (dynamic) | `colours-dynamic` | `colours · dynamic` |
| `cpNchKjiIM19dPqTxE0fqg` | 🅰️ Spacing & Typography Primitives | `st-primitives` | `s&t primitives` |
| `FQQqyumcpPQoiFRCjdS9GM` | 🅰️ EDS Spacing & Typography tokens | `st-tokens` | `s&t tokens` |

**What this means narratively:**
- The "Static" lane was never just "static" — it's the *Colours (static)* file. Phase D.10's "static" naming dropped the "colours" half.
- The "Dynamic" lane was never just "dynamic" — it's the *Colours (dynamic)* file. Same drop.
- Spacing primitives is also typography primitives — the two files are siblings (🅰️ Primitives and 🅰️ tokens) that together cover spacing + typography.

**Changes (this commit, all in `src/`):**
- `data/lanes/types.ts` — `LaneId` union becomes `'colours-static' | 'foundations' | 'colours-dynamic' | 'st-primitives' | 'st-tokens'`. Comment table at the top of the file lists each id alongside its real Figma file name so future readers don't need to re-derive.
- `data/lanes/static.ts` — `STATIC_LANE.id` → `'colours-static'`, `.label` → `'colours · static'`. Narrator copy:
  - Scene 2 / Inside beat 1: "The Static crate carries…" → "Our crate carries…" (the dock already established what's in the crate; no need to re-name the file).
  - Scene 5 / Peel outer-ring line: "(Static file)" → "(in the colours-static Figma file)".
  - Scene 8 / Packaging four-bin line: "Cords from spacing primitives … Chains from spacing modes (typography, density, radius). Lacquer from dynamic (appearance)." → "Cords from spacing & typography primitives … Chains from spacing & typography tokens (font axes, density, radius). Lacquer from colours · dynamic (appearance)."
- `data/lanes/index.ts` — `LANES` keys and locked-stub `id`/`label`/`accent` fields rewritten for all four non-Static entries.
- `data/lanes/prologue.ts` — dock beat 2: "Our crate is labelled 'static'" → "Our crate is labelled 'colours · static'".
- `data/lanes/foundations.ts` — placeholder narration "Same scene-ref shape as the Static lane" → "Same scene-ref shape as the colours-static lane".
- `chrome/Story.tsx` — default `selectedLaneId` → `'colours-static'`.
- `chrome/LaneContext.ts` — context default `selectedLaneId` → `'colours-static'`.
- `scenes/dock/Dock.tsx` — fallback `selectedLabel` constant → `'colours · static'`.
- `scenes/static/Packaging.tsx` — bin pkg labels updated: cords → `'s&t primitives'`, chains → `'s&t tokens · typography'`, lacquer → `'colours · dynamic'`. Header comment corrected.
- `scenes/static/Jeweller.tsx` — five material pkg labels updated (gem → `'colours · static'`, cord → `'s&t primitives'`, chain → `'s&t tokens'`, lacquer → `'colours · dynamic'`; clasp stays `'foundations'`).
- `scenes/static/Peel.tsx` — outer-ring `LAYER_BY_BEAT[1].file` → `'Colours (static) / Concept.Mode 1.json'`.
- `styles/base.css` — `[data-lane=…]` selectors rewritten for the five new ids.

**Folder names unchanged.** `scenes/static/` stays — it's the folder for "scenes consumed by the protagonist lane" regardless of what that lane is called. Renaming directories has more churn than value.

**Audit lesson #3:** the sync doc's `Contents` column is approximate twice over — it misnames at least two of the five files, and the names it does use don't reflect what's actually inside them. **Authoritative source is the Figma file's own title** (visible in the file header, or in the URL's title segment). For any future lane work, open each Figma file directly and copy the title — do not trust `eds-tokens-sync/CLAUDE.md`'s table.

**Verified:** tsc + build clean. Grep confirms no remaining `'static'` / `'spacing-modes'` / `'spacing-primitives'` / `'dynamic'` lane-id references in `src/`.

---

## Phase H — Typography lane (foundry frame)

The second real lane. Promotes `st-tokens` (🅰️ EDS Spacing & Typography tokens) from a locked stub to a full story that teaches the **typography** pipeline. Protagonist: `ui-body / md` → `--eds-typography-ui-body-md-font-size`.

### Locked frame decision: the foundry, not the gem hall

Colour and typography reach their value by **opposite means**, and that contrast is the lesson. Reusing the gemstone metaphor for both would flatten it (user direction: "using same frame of reference can be confusing"). So:

- **Gem Hall (colours-static)** — geology. A geode is cracked; the value is *already inside*; you peel a 3-ring alias chain to *find* it; two facets fuse for light/dark. Organic, mineral, purple.
- **Machine Shop / Foundry (st-tokens)** — engineering. There's no value yet; a blank billet is *milled to spec* from one master gauge, by formula, then ground to the baseline. Mechanical, calibrated, steel-grey.

The geode stays untouched in colour. Typography gets its own visual identity (steel palette via the existing G.4 `data-lane` → `--_lane-accent` mechanism; `st-tokens` already maps to `--pico-light-gray`). The two wings only meet at **Assembly**, where colour's gem drops into the milled typographic seat — justifying two frames: they're different production lines that converge into one component.

The foundry frame also hands us accurate vocabulary for free: **point size** = the body of a cast sort, **leading** = the metal between lines (line-height), **baseline** = the rail the sorts sit on.

### The contrast spine (the pedagogical takeaway)

| | Colour — Gem Hall | Typography — Machine Shop |
|---|---|---|
| Origin | cracked from a geode | raw billet, milled from a master gauge |
| Value arrives | already inside; peel to find it | doesn't exist yet; cut to spec by formula |
| Resolution model | alias chain (3 rings) | geometric scale (`base × 2^(n/5)`) |
| Process verbs | reveal · peel · facet | measure · mill · calibrate |
| The "mode" twist | light ↔ dark, `light-dark()` | density dial — one base, whole rack rescales |
| Finishing polish | re-declare under 4 scopes (build-dark-scope) | grind to the baseline grid (text-box trim) |
| Material feel | organic, mineral, glowing | metal, calibrated, matte |
| At assembly | the gem | the seat + rail the gem sits in |

### Accuracy notes (verified against source — D.10/G.5/G.6 discipline)

- The app imports only `@equinor/eds-tokens/css/variables`, which ships **static per-density** typography values (`--eds-typography-ui-body-md-font-size: .875rem` spacious / `.75rem` comfortable). The `pow(2, n/5)` modular-scale formula lives in the component-library foundation (`eds-core-react/.../Foundation/typography.css`) the app does **not** load. So the foundry depicts the **eds-tokens build output** (what actually ships); the formula is taught as the *shape* of the scale, not claimed as a runtime artefact of this output. This resolves the "which layer does the cutting" fork — it's the build.
- `md` = `base × 2^(-1/5)` ≈ 14px at the 16px spacious base; ≈ 12px at the 14px comfortable base. Line-height md squished = 16px (snapped to the 4px grid). Verified in `variables.css`.
- Typography spans **two** Figma files: `st-primitives` (raw type-scale steps + font-family primitives `Inter`/`Equinor`) and `st-tokens` (the role tokens `ui-body.md` that alias the primitives). The protagonist's role token lives in `st-tokens` — its lane home — and resolves through `st-primitives`, mirroring how colour's concept token resolves through Foundations.

### 10-scene beat sheet (foundry frame)

Scenes 0–1 (intro + dock) are shared prologue. The dock palette flips to steel when `st-tokens` is selected. The 8 post-dock scenes:

| # | Scene | Was (colour) | Visual core | Teaches |
|---|---|---|---|---|
| 2 | inside the foundry | inside | belt routes the crate to the machine shop, not the gem hall | the token spans two s&t Figma files; protagonist `ui-body/md` |
| 3 | the billet | crack | crate opens → a dull **blank billet**, not a glowing geode | the value doesn't exist yet — it gets machined (deliberate anticlimax vs colour) |
| 4 | the master gauge | reveal | master measure + a milled **rack** of 10 sizes at fixed ratios | the modular scale: sizes are `base × 2^(n/5)`, not a typed list |
| 5 | milling to spec | peel | mill cuts md (14px, snapped 0.5px) + the seat/leading (16px, 4px grid); build engraves the var name | md's exact cut, line-height derivation, the part-number stamp |
| 6 | the density dial | cutting | one dial; turn spacious→comfortable, the whole rack re-mills live | the density cascade — typography's light/dark equivalent (HERO scene) |
| 7 | the rack | tray | md joins the full range + the Equinor header row; interchangeable facets | lane output as the typography CSS; per-role family + axes |
| 8 | final inspection | packaging | rack meets the other lanes; surface-plate grind to the baseline | baseline trimming (`text-box: trim-both`); seal → variables.css |
| 9 | assembly | jeweller | gem drops into the milled seat → real `<Button>` + **live density toggle** | the two wings converge; the whole component resizes from one measure |

### Sprite plan

- **Reuse:** Crate, Dock/belt, LibrarianBot, StationLog, SceneHeader, Narrator, LaneSprites, real `<Button>`.
- **Borrowed at assembly only:** `Gemstone` — explicitly colour's contribution.
- **New:** `Billet` (3) · `MasterGauge` + reference plate (4,5) · `Mill`/step-cutter (4,5,6) · `GaugeRack` (4,6,7) · `Micrometer` (5) · `DensityDial` (6,9) · `SurfacePlate`/baseline jig + grid (8) · `MetalSort` (the milled size block, engraved — inlined in Assembly for H.1, extracted later).
- **Retired for this lane:** `Geode`, `NestedStones`, the light-dark two-facet cut.

### Migration sub-phases

| Phase | Ships |
|---|---|
| **H.0** | Plan locked + `st-tokens` lane data (full narrator script, foundry frame), registered. Unbuilt scenes route through `placeholder`. Routes end-to-end. |
| **H.1** | Assembly scene (payoff first) — gem-in-seat → real `<Button>` + live density toggle. Validated in Chrome. |
| **H.2** | Inside (foundry) + Billet (the anticlimax). |
| **H.3** | Master Gauge + `GaugeRack` sprite. |
| **H.4** | Milling to Spec + `MetalSort`/`Mill` sprites. |
| **H.5** | Density Dial (hero scene, deliberate pacing). |
| **H.6** | Rack + Final Inspection (baseline grid). |
| **H.7** | Flip lane to `ready`; end-to-end narrator tighten; multi-viewport smoke. |

---

## Phase log (cont.)

### Phase H.0 — Plan locked + typography lane scaffold ✓

- Wrote the Phase H plan above (frame decision, contrast spine, beat sheet, sprite plan, sub-phases) so the locked foundry decision is recorded alongside the colour lane's locked decisions.
- New `data/lanes/typography.ts` — `TYPOGRAPHY_LANE` (id `st-tokens`, status `scaffold`, steel accent). Full 8-scene narrator script in the foundry voice; 9 lane-map stages reusing existing `StageViz` keys (foundry-specific icons are a polish item). Header comment records the static-per-density vs foundation-formula accuracy note.
- `data/lanes/index.ts` — replaced the locked `st-tokens` stub with `TYPOGRAPHY_LANE`.
- `data/lanes/types.ts` — added `'assembly'` to the `SceneId` union. The other 7 scenes route through `'placeholder'` until their components land (H.2–H.6).
- **Verified:** `pnpm build` clean (73 modules, was 59). Chrome: dock shows `s&t tokens` as "Switch to s&t tokens" (clickable scaffold lane); selecting it routes the post-dock story through the typography placeholders + the real Assembly.

### Phase H.1 — Assembly scene (payoff, built first) ✓

Built the bookend first to validate the end-state before scenes 2–8 (mirrors the colour lane's Phase C).

- New `scenes/typography/Assembly.tsx` + `assembly.css`. Beat machine: 0 sealed `variables.css` box (steel, distinct from colour's purple box) → 1 gem + milled `MetalSort` converge → 2 flash → real `<Button>` reveal → 3+ **live density oscillation**.
- The real `<Button>` text uses the real typography tokens (`--eds-typography-ui-body-md-font-size` / `-line-height-squished` / `-font-weight-bolder`, `--eds-typography-ui-body-font-family` → Inter) and the colour fill token (`--eds-color-bg-accent-fill-emphasis-default`). `image-rendering: auto` + anti-aliasing break the pixel aesthetic deliberately.
- **Live density toggle** = typography's light/dark moment. A `data-density` attribute on the render wrapper oscillates spacious↔comfortable on an interval; eds-tokens ships static per-density values, so the button visibly resizes (14px ↔ 12px) — genuine shipped behaviour, with a `font-size` transition for smoothness.
- The `MetalSort` (steel block, `md` engraved, bevelled top + dark foot) is inlined in Assembly for now; extracted to a sprite when Milling/Rack land.
- **Bug found + fixed in Chrome:** first render showed an empty bench — `.assembly-stage` used `position: relative` + a grid `1fr` track, but `.scene-header-bar` is `position: absolute` (out of flow), so the track collapsed to zero height. Fixed by positioning `.assembly-stage` absolutely below the 16px header (`top: 20px`), mirroring `.jeweller-stage`.
- **Verified in Chrome:** intro → dock → select s&t tokens → advance to Assembly. Real teal Button with Inter font renders on the steel bench; density tag + button size cycle COMFORTABLE↔SPACIOUS live. No console errors (benign favicon 404 only).

### Phase H.2 — Inside the Foundry + The Billet ✓

First two real foundry scenes, replacing placeholders 0 and 1.

- New `scenes/typography/FoundryInside.tsx` + `foundry-inside.css`. The shared belt + `Crate` sprite route into a MACHINE SHOP wing — steel machinery silhouettes scroll past (two-tile `foundry-scroll` loop) instead of the gem hall. Crate carries the lane-accent "s&t tokens" label; a "part: ui-body / md" tag pops at beat 1. Not a reuse of the colours-static `Inside` (which hardcodes colour labels) — kept separate so the colour scene is untouched.
- New `scenes/typography/Billet.tsx` + `billet.css`. The crate cracks under the press (SLAM at beat 1) and opens to a **dull, speckled grey billet** — no glow, a "?" face, tagged "no dimensions yet". The visual anticlimax vs colour's glowing geode IS the teach: typography's value doesn't exist yet, it gets machined.
- Wired: `SceneId` gains `'foundry-inside'` + `'billet'`; registered in `sceneRegistry`; lane refs 0 and 1 repointed off `placeholder`.
- **Verified in Chrome:** build clean. Lane select → INSIDE THE FOUNDRY shows MACHINE SHOP sign + steel rigs + s&t tokens crate; → THE BILLET shows the split crate halves with the blank billet between them. No console errors.

### Phase H.3 — The Master Gauge + GaugeRack sprite ✓

The modular-scale teach, replacing colour's three-ring Reveal.

- New `sprites/GaugeRack.tsx` + `gaugeRack.css` — the type scale as a rack of milled steel blocks, heights ∝ `2^(n/5)` (xs..6xl). Props: `highlight` (glow one block), `animate` (staggered mill-out), `scale` (shrink the whole rack — used by the density dial in H.5). Reusable across H.3/H.5.
- New `scenes/typography/MasterGauge.tsx` + `master-gauge.css` — an orange BASE rod on the reference plate; the rack mills out at beat 1; md highlights at beat 2 alongside a formula card `size = base × 2^(n/5)` / `md = base × 2^(-1/5) ≈ 14px`. Teaches: sizes are one curve from one base, not ten hand-typed values.
- Wired: `SceneId` gains `'master-gauge'`; registered; lane ref 2 repointed.
- **Verified in Chrome:** build clean. Scene shows the BASE rod + the 10-block ladder with md glowing yellow + the formula card. No console errors.

### Phase H.4 — Milling to Spec + MetalSort sprite ✓

The size-cut teach, replacing colour's Peel + name-stamp.

- Extracted `sprites/MetalSort.tsx` + `metalSort.css` from Assembly's inline block (the "extract later" note from H.1). `Assembly.tsx` now imports it; the duplicated `.metal-sort` rules were removed from `assembly.css`.
- New `scenes/typography/Milling.tsx` + `milling.css`. 4 beats: blank billet on the mill bed → mill cuts (sort + "font-size: 14px") → seat cut (a blue dashed line-box around the sort + "line-height: 16px · leading · 4px grid") → build engraves the `--eds-typography-ui-body-md-font-size` sticker. Added an intro narration line so the 4 visual beats align with the script.
- Wired: `SceneId` gains `'milling'`; registered; lane ref 3 repointed.
- **Verified in Chrome:** build clean. Scene shows the cutter, the md sort in its leading line-box, both callouts, and the engraved sticker. No console errors. (Polish note for H.7: the long sticker grazes the narrator bubble — shorten or reposition.)

### Phase H.5 — The Density Dial (hero scene) ✓

Typography's equivalent of colour's light/dark twist — the standout beat.

- New `scenes/typography/DensityDial.tsx` + `density-dial.css`. A 3-stop dial (SPACIOUS / COMFORTABLE / RELAXED) with a sliding knob; a MASTER readout (16px ↔ 14px); the `GaugeRack` (reused with the `scale` prop); and an md readout (14px ↔ 12px). Beats: dial at spacious → turns to comfortable (master drops) → **live oscillation** of the whole rack re-milling (md 14↔12, every bar rescaling) → hold. One dial, the entire system follows.
- Wired: `SceneId` gains `'density-dial'`; registered; lane ref 4 repointed.
- **Verified in Chrome:** build clean. Dial knob slides between stops; MASTER + md readouts and the full rack rescale live between 16/14px (spacious) and 14/12px (comfortable). No console errors.

### Phase H.6 — The Rack + Final Inspection ✓

The last two scenes — every post-dock scene is now real.

- New `scenes/typography/Rack.tsx` + `rack.css` — the type ramp as lane output (colour's Tray). A shelf with the ui-body row (Inter, steel sorts) and the header row (Equinor, brass-tinted sorts), md the orange hero; facet chips (weights / tracking / line-height ×2); a "typography CSS · --eds-typography-*" file plate.
- New `scenes/typography/Inspection.tsx` + `inspection.css` — baseline trimming (colour's Packaging). Other-lane materials converge (reusing `Gemstone` + `LaneSprites`); the md sort grinds down onto a 4px baseline grid on the surface plate (`text-box: trim-both` callout); then a sealed steel `variables.css` box.
- Wired: `SceneId` gains `'rack'` + `'inspection'`; registered; lane refs 5 and 6 repointed. No more `placeholder` refs in the typography lane.
- **Verified in Chrome:** build clean. The Rack shows both typeface rows + facets + file plate; Inspection shows the lane convergence, the sort seating on the baseline grid, and the trim callout. No console errors.

### Phase H.7 — Ready + polish + multi-viewport smoke ✓

- Flipped `TYPOGRAPHY_LANE.status` `scaffold` → `ready`. The dock now shows `s&t tokens` as a full ready lane (no "soon" badge), alongside colours-static.
- Polish: moved the Milling part-number sticker from top-centre to low-centre so the long `--eds-typography-ui-body-md-font-size` string clears the top-right narrator bubble (the H.4 note).
- **Verified in Chrome:** build clean. Lane-map (`m`) renders the S&T TOKENS pipeline snake (figma → sync → json → billet → scale → mill → css → bundle → fit) with the active stage highlighted. At a reduced viewport (820×560) the stage scales down via `--px` with no clipping. All 8 post-dock scenes were individually rendered and confirmed during H.1–H.6 with no console errors (benign favicon 404 only).

---

### Phase H summary

Second real lane complete. The Token Factory now has two fully playable stories: the **colours-static** gem hall and the **st-tokens** foundry. Selecting `s&t tokens` at the dock flips the wing palette to steel and routes the post-dock story through 8 machine-shop scenes:

inside the foundry → the billet → the master gauge → milling to spec → the density dial → the rack → final inspection → assembly.

**What shipped (H.0 → H.7):**
- `data/lanes/typography.ts` (`TYPOGRAPHY_LANE`, ready) + registry/types wiring; no placeholder refs remain.
- 8 scene components under `scenes/typography/` + colocated CSS.
- New sprites: `GaugeRack` (the modular scale), `MetalSort` (the milled type-sort, also adopted by Assembly).
- The frame contrast is legible: colour *finds* a buried value (geode/peel/light-dark); typography *mills* one from a base (gauge/formula/density dial). The two wings converge only at Assembly, where the gem drops into the milled seat and a real `<Button>` renders with a live density toggle.

**Deferred / future polish (non-blocking):**
- Lane-map viz icons are reused from the colour set (e.g. SCALE shows the concentric "layers" icon, MILL the "cut" icon). Foundry-specific `StageViz` icons would sharpen the map.
- The known pre-existing lane-switch narrator-reset artefact (logged in G.4) still applies; not specific to typography.
- The G.4 caveat about `advance` identity churn is unchanged.

### Phase H.8 — Half-pixel accuracy correction ✓

User caught a confidently-wrong detail (the D.10/G.5/G.6 failure mode again): the Milling narration claimed sizes are "snapped to the nearest half-pixel so it stays crisp", implying whole, crisp pixels. Verified against source — the font-size rounding step in the foundation formula is `round(..., 0.03125rem)` = a **0.5px grid**, so font-sizes routinely land on half-pixels (spacious: xs 10.5, xl 18.5, 3xl 24.5). `md` = 14px is whole only by coincidence; half-pixels are not "crisp". Line-heights are the ones on a whole-pixel 4px grid.

- Narration fixed (commit `8bd6e9f81`): "…that lands on 14 pixels — sizes round to a half-pixel grid, so plenty come out fractional, like xs at 10.5."
- Visual fixed (this commit): the Milling FONT-SIZE callout gains a "0.5px grid · halves ok" note, mirroring the LINE-HEIGHT callout's "leading · 4px grid". Both grids are now visible and contrasted in-scene.
- **Verified in Chrome:** the two callouts render side by side with their distinct grids.
