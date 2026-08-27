# Colour approach for EDS 2.0

- **Status:** Proposed
- **Date:** 2026-08-27
- **Decision makers:** EDS core team

## Context

EDS 2.0 replaces the hand-picked 1.x palette with an algorithmically generated colour system: OKLCH anchors, a step scale per tone, and a semantic layer that components bind to. That work has been running since early 2026 under epic [#4740](https://github.com/equinor/design-system/issues/4740): colour values ([#4742](https://github.com/equinor/design-system/issues/4742)), naming ([#4744](https://github.com/equinor/design-system/issues/4744)), the semantic restructure ([#5280](https://github.com/equinor/design-system/issues/5280)) and migration ([#5119](https://github.com/equinor/design-system/issues/5119)).

**None of it is written down as a decision.** Spacing has [ADR-0004](./0004-spacing-approach-for-eds-2.md); typography has [ADR-0005](./0005-typography-approach-for-eds-2.md) and [ADR-0007](./0007-token-variable-architecture-spacing-typography.md). Colour, the largest part of the epic, has nothing. Sixteen ADRs exist and not one covers it. The reasoning currently lives in issue comments, sync notes and an internal team doc, which means every question that has already been settled (why the scale is opaque, why the lightness inputs are hand-typed, why step 9 is the emphasis fill) gets re-litigated from scratch, and a future maintainer or code agent has nothing to check a change against.

Two triggers made this urgent:

1. The **opaque-only decision** (2026-08-26) reversed a plan that had run from the Q2 2026 OKRs through [#4741](https://github.com/equinor/design-system/issues/4741) and the [#4742](https://github.com/equinor/design-system/issues/4742) scaleexpansion. It needs a durable home, or the alpha proposal returns.
2. At the time of writing, `apps/design-system-docs/` is still on EDS 2.0 tokens and no new token documentation exists yet, so there is no other place this reasoning can go.

This ADR records the colour system as defined in **Tokens Studio, the canonical source** (state verified 2026-08-27), which the release pipeline mirrors into `packages/eds-tokens/src/tokens/`. Where the repo snapshot and Tokens Studio disagree, Tokens Studio is right. The ADR deliberately references no concrete token counts: the token set grows as roles are added, and any fixed number would go stale.

## Decision Drivers

- Contrast must be **assertable in CI**, not eyeballed: the system targets APCA Lc90 for body text and Lc60 for interactive elements, measured against `background.surface`
- Every scale value must be **derived**, not hand-designed per tone; adding a seventh tone must not be a design exercise (`docs/decisions.md` → _Algorithmic design_)
- The same token set must resolve identically in CSS, TypeScript and Figma; Figma clamps wide-gamut OKLCH to sRGB, so divergence must be **bounded and understood** rather than discovered per component
- Colour scheme switching must use the one mechanism the rest of the system uses: attribute scoping ([ADR-0013](./0013-attribute-scoped-custom-properties-not-light-dark.md))
- Renaming or inserting a scale step is a breaking change for every consumer, so the scale's shape needs to be settled before 3.0 leaves beta
- Consumers on 2.x must be able to migrate incrementally, not in one cut

## Options Considered

Three axes were genuinely contested. The remaining decisions below follow from these.

### Axis 1: Dynamic vs. static colour

Both options resolve to the same generated values; the axis is how components bind to them. It was settled by the 23 Jun 2026 "redefine, don't rebuild" decision ([#4740](https://github.com/equinor/design-system/issues/4740)) and validated by spike [#5124](https://github.com/equinor/design-system/issues/5124), which re-reviewed the Spring-2025 dynamic-vs-static user test (10 designers, 8 developers; artifacts in equinor/design-system-internal#189).

**Option A: dynamic colour.** Abstract role tokens with no tone in the name (`--eds-color-bg-fill-emphasis-default`); the semantic category is applied at runtime with a `data-color-appearance` attribute, in code via data attributes and in Figma via variable modes.

**Pros:**

- One set of role tokens serves every tone; a component recolours through an attribute switch with no per-tone CSS
- Fewer variable names for a component author to hold in their head

**Cons:**

- Static led both cohorts in the Spring-2025 user test: 6/10 developers preferred it, all six confident; designers split 5/5, but the static-preferring half were markedly more confident (4/5 vs 2/5), reviewed in [#5124](https://github.com/equinor/design-system/issues/5124)
- The reasons static won are durable, not onboarding artifacts: familiarity, visual feedback while picking a token, separation of concerns, and clean mapping to utility classes ([#5124](https://github.com/equinor/design-system/issues/5124))
- "Too granular to be powerful" in a single-brand organisation (25 Jun 2026 designer interviews, summarised in [#5124](https://github.com/equinor/design-system/issues/5124))
- Running dynamic alongside static was the documented root of the dual-source complexity; the 2025 "keep both" outcome came from reframing the test's verdict per concept, not from the data ([#5124](https://github.com/equinor/design-system/issues/5124))
- Corroborated by the 2026-06-11 design/dev sync: developers had kept dynamic "for consistency" but preferred static ([#5124](https://github.com/equinor/design-system/issues/5124))

**Option B: static semantic colour (chosen).** Tokens carry their tone in the name (`background.interactive.accent.emphasis.default`); components bind to named tones directly.

**Pros:**

- Preferred by both cohorts in testing, with high confidence and stable reasons (above)
- One colour system and one source of truth, ending the dual-library complexity
- A token name states its meaning without needing the surrounding markup's `data-color-appearance` context

**Cons:**

- A component that renders in several tones needs per-tone bindings (or a prop→token mapping) instead of one attribute switch
- More named tokens overall

### Axis 2: Opaque scale vs. alpha variants

**Option A: alpha variants.** Add translucent variants of the scale so that low-emphasis fills, disabled states and selection can compose over any surface.

**Pros:**

- One disabled value is exact on every surface
- Fewer tokens for surface-dependent states
- Absorbs small generator errors: a slightly wrong value is less visible when it is 8% opaque

**Cons:**

- A value carrying alpha has **no contrast number until the backdrop is known**, so APCA Lc90/Lc60 cannot be asserted in CI; this alone is disqualifying against driver 1
- Measured against the real canvas, matching existing opaque steps needed ~93% alphas ([#5274](https://github.com/equinor/design-system/discussions/5274)); the twins in [#5227](https://github.com/equinor/design-system/issues/5227) only landed exactly by compositing over pure white and pure black
- Composited alpha diverges between renderers once Figma clamps OKLCH to sRGB; opaque diverges once, predictably
- The defect that motivated it was misdiagnosed (see below)

**Option B: opaque only (chosen).**

**Pros / Cons:** the inverse of the above: every value is assertable, at the cost of one approximate disabled appearance per non-primary surface.

The invisible dark-mode low-emphasis fill was blamed on missing opacity support (1 Jun sync). [#5282](https://github.com/equinor/design-system/issues/5282) found the real cause: in every dark scale, step 6 resolved byte-identical to step 3, inverting any state ladder that crossed it. Repointing the affected fills to opaque steps that progress fixed it with no alpha at all.

### Axis 3: Step-numbered scale vs. semantic-named ramps

**Option A: semantic names all the way down** (`accent-fill-muted`, `accent-border-strong`) with no numeric scale.

**Pros:** self-documenting; no need to know what step 9 means.

**Cons:** the generator has no ordinal to work with; inserting a value between two existing ones has no name; the tone→role mapping gets frozen into the primitive layer where it cannot be changed per scheme.

**Option B: numbered steps + a separate semantic layer (chosen).**

**Pros:** the generator emits an ordered ladder; the semantic layer is a thin, reviewable mapping that can differ per scheme; roles can be repointed (as [#5282](https://github.com/equinor/design-system/issues/5282) did) without regenerating anything.

**Cons:** two layers to learn; `--eds-accent-9` is meaningless without the map; step numbers leak into review conversations.

## Decision

Adopt **static, algorithmically generated, opaque OKLCH colour** with a 15-step numbered scale per tone and a separate semantic mapping layer, switched by attribute scoping. In detail:

### D1: Static only; deprecate by shipping alongside

Dynamic colour (data-attribute appearance switching at the semantic-colour level) is dropped (decided 2026-06-23, validated by [#5124](https://github.com/equinor/design-system/issues/5124)). The palette generator stays internal tooling.

The 2.x palette is **not edited in place**. Because step-based naming ([#4744](https://github.com/equinor/design-system/issues/4744)) means inserting a step cascade-renames everything above it, the 3.0 scale ships next to the 2.x one and consumers migrate per component. In-place edits to a published scale are not permitted.

### D2: Generation chain

Six one-way layers, in the order declared by the project's `$metadata.json` (mirrored at `packages/eds-tokens/src/tokens/raw/$metadata.json`); the `font`, `density` and `elevation` sets sit outside this colour chain:

```
primitives → input/palette + input/scale → foundation/gaussian + foundation/anchor
           → color/{light,dark} → scheme/{light,dark} → semantic
```

Each scale value is generated, never typed:

```
set_chroma(set_lightness({input.palette.<hue>.anchor}, {input.scale.<scheme>.<n>}), …)
```

- **Hue** comes from one of seven OKLCH anchors in `input/palette.json`: `blue`, `gray`, `green`, `moss-green`, `north-sea`, `orange`, `red`
- **Lightness** comes from `input/scale.json` (see D3)
- **Chroma** follows a gaussian curve over the step index: `input.scale.gaussian.<scheme>.{mean,std-dev}`, currently mean 0.6 (light) / 0.7 (dark), std-dev 2 for both

References resolve in one direction only. A semantic token must not reference another semantic token, and no layer may reference a layer below it.

### D3: The lightness inputs are hand-set, and that is deliberate

`input/scale.json` holds 15 hand-typed lightness values per scheme. **This is not technical debt and must not be "fixed" by re-deriving the ladder from a formula.** A purely formulaic L ramp did not produce usable contrast steps; the values are tuned, and the algorithm's job is to propagate them across hues, not to invent them.

The values in Tokens Studio as of 2026-08-27:

| Scheme | 1    | 2    | 3   | 4   | 5   | 6    | 7   | 8   | 9   | 10  | 11  | 12  | 13  |
| ------ | ---- | ---- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
| light  | .98  | .94  | .91 | .87 | .82 | .77  | .72 | .62 | .52 | .47 | .42 | .37 | .32 |
| dark   | .215 | .226 | .47 | .30 | .45 | .595 | .61 | .76 | .82 | .88 | .93 | .96 | .99 |

The ladder is **deliberately not monotonic**: the dark values dip at steps 4–5 because a strictly increasing ramp cannot hold the required contrast for every role the steps serve. The invariants are narrower, and they are what [#5282](https://github.com/equinor/design-system/issues/5282) actually established: no two steps within a scale may resolve to the same value, and every state ladder built on the scale must progress visibly in one direction. Those two properties are what _Confirmation_ asserts; global ordering is not a rule.

Steps **14 and 15 are inverse-polarity**: text and icon values intended to sit _on_ an emphasis fill (light .90 / 1.00, dark .33 / .10). They are outside the ladder by design and must be excluded from any ladder assertion.

Because hand-set inputs can drift and there is no alpha left to absorb error, a generator fault is now a visible fault. Hand-set inputs are therefore only acceptable with the build-time checks in the [Confirmation](#confirmation) section of this ADR in place; without them, this decision does not stand.

### D4: Opaque only

**Every value in the colour scale is opaque, and every semantic colour token resolves to an opaque value.** Disabled, read-only and selected states use opaque steps (`background.interactive.disabled` → step 2, `border.interactive.disabled` → step 4, `text`/`icon.interactive.disabled` → step 7). There are no alpha variants of the palette.

The rule is **scoped to the scale**, not to the system. Alpha is reserved for values whose backdrop genuinely cannot be known:

- `overlay.scrim`: `#1d1d1d1a`; the only alpha value in the semantic layer
- `elevation.ambient` / `elevation.key`: shadow colours in the scheme layer, carrying `rgba(0, 0, 0, 0.12)` and `rgba(0, 0, 0, 0.2)`
- data visualisation, when it is systematised (see _Unresolved_)

Anything in the scale is matched to the background or surface it sits on. Using a scale colour over an arbitrary backdrop is outside the contract.

Accepted cost: one opaque disabled value is exact on one surface and approximate on the rest. Per-surface disabled variants were considered and rejected as more expensive to add later than to live without, given D1.

### D5: Step roles and state ladders

State progression is expressed by **moving along the scale**, never by layering a translucent overlay on a base colour (decided 25 Jun sync). The ladders, as built:

| Group                                    | default | hover | pressed |
| ---------------------------------------- | ------- | ----- | ------- |
| `background.interactive.<tone>.emphasis` | 9       | 10    | 11      |
| `background.interactive.<tone>.muted`    | 1       | 2     | 3       |
| `background.interactive.accent.selected` | 5       | 7     | 8       |
| `border.interactive.<tone>.emphasis`     | 9       | 10    | 11      |
| `border.interactive.<tone>.muted`        | 4       | 5     | 7       |
| `icon.interactive.<tone>`                | 11      | 12    | 13      |
| `text`/`icon.interactive.link`           | 8       | 9     | 10      |

Non-interactive roles: `border.non-interactive.<tone>.{muted,default,emphasis}` = **4 / 7 / 9** for all six tones. `text`/`icon` `primary` = 13, `secondary` = 8, `tertiary` = 7, `inverted` = 1. Per-context foreground roles exist per tone: `text`/`icon.on-default.<tone>` = 10, `on-muted.<tone>` = 12, `on-emphasis.<tone>` = 15. `background.canvas` = 1; `background.input` = 1; `background.{surface,dialog,floating}` = 15; `background.inverted` = 12. Only `icon` carries the per-tone interactive ladder; `text.interactive` holds `link` and `disabled` alone.

The `$description` fields in `input/scale.json` are **legacy intent labels** and no longer match this mapping (they name step 6 as `border-subtle` and step 8 as `border-strong`). This table, derived from the semantic layer, is authoritative; the descriptions should be corrected or dropped.

### D6: Semantic layer shape

The colour semantic layer lives in `packages/eds-tokens/src/tokens/raw/semantic.json`, grouped as `background.*`, `border.*`, `text.*`, `icon.*`, `overlay.*` and `data-visualization.*`. The token count is not part of the contract; the set grows as roles are added.

Interactive states live under an explicit `interactive` segment (`background.interactive.<tone>.<emphasis|muted|selected>.<default|hover|pressed>`), so that non-interactive roles (`background.canvas`, `border.non-interactive.neutral.default`) are distinguishable from stateful ones by name alone. Components bind to this layer only; binding to `scheme/*` or `color/*` is not supported.

Six tones: `accent`, `neutral`, `info`, `success`, `warning`, `danger`.

### D7: Scheme handling

Tone→hue mapping happens in the **scheme** layer, per scheme, which is what allows `neutral` to be a different hue in each:

| Tone      | light      | dark          |
| --------- | ---------- | ------------- |
| `accent`  | moss-green | moss-green    |
| `neutral` | **gray**   | **north-sea** |
| `info`    | blue       | blue          |
| `success` | green      | green         |
| `warning` | orange     | orange        |
| `danger`  | red        | red           |

In CSS this emits two equally sized blocks of scheme variables, under `[data-color-scheme="light"]` and `[data-color-scheme="dark"]`. The semantic layer is declared **once**, at `:root, [data-color-scheme]` ([#5226](https://github.com/equinor/design-system/issues/5226) / PR [#5239](https://github.com/equinor/design-system/pull/5239)), so it inherits whichever scheme is in scope instead of being duplicated per scheme.

`light-dark()` must not appear in published colour CSS; see [ADR-0013](./0013-attribute-scoped-custom-properties-not-light-dark.md) for the full reasoning and the `assert-no-light-dark.mjs` guard.

### D8: One owner per name

A token name has exactly one definition. Dotted and hyphenated names collide silently in CSS export: `border.focus` and `border-focus` both become `--eds-border-focus`, so the build must reject duplicate emitted names rather than let the last writer win ([#5221](https://github.com/equinor/design-system/issues/5221)).

The eight flat scheme-layer aliases that predated [#5280](https://github.com/equinor/design-system/issues/5280) (`bg-backdrop`, `bg-disabled`, `bg-floating`, `bg-input`, `border-disabled`, `border-focus`, `text-disabled`, `text-link`) have been removed in Tokens Studio (verified 2026-08-27); their two surviving roles are proper semantic tokens (`background.input`, `border.interactive.focus`). The repo's raw snapshot lags behind until the next release pull, so the aliases may still appear in `src/tokens/raw/`; they must not be re-added.

### D9: OKLCH is canonical; Figma's clamp is expected

Colour is **authored in OKLCH** and OKLCH is the canonical form. Figma variables clamp wide-gamut OKLCH into sRGB, so a Figma↔Tokens Studio comparison shows a stable set of apparent colour differences (a few dozen at the time of writing) that are **not changes**. They must never be written back into the token source; doing so bakes the clamp into the canonical values and the divergence compounds on the next round-trip.

### D10: Migration

2.x and 3.0 colour ship side by side. Consumers move per component, and the 2.x scale is frozen: bug fixes only, no new steps, no renames.

### Consequences

- **Good**, because contrast becomes a build-time property: every semantic pair is two known opaque values, so APCA Lc90/Lc60 can be asserted rather than reviewed by eye
- **Good**, because the reasoning behind the step ladders now has a citable home; "why is emphasis 9?" has an answer that is not a Slack thread
- **Good**, because state changes are a step move, so hover and pressed inherit the tone's chroma curve automatically and no component hand-mixes colours
- **Good**, because repointing a role (as [#5282](https://github.com/equinor/design-system/issues/5282) did) is a semantic-layer edit and regenerates nothing
- **Bad**, because one opaque disabled value cannot be exact on every surface; expect "disabled looks wrong here" reports on non-primary surfaces, and note that the surface pairing they must be judged against is not yet written down (see _Unresolved_)
- **Bad**, because hand-set lightness inputs can silently regress: the whole system's correctness rests on 30 numbers in one file, which is why the assertions below are mandatory
- **Bad**, because the scale's shape is now expensive to change: any inserted step cascade-renames, so mistakes are paid for at 3.0's major version
- **Bad**, because two of fifteen steps (6 and 14) currently ship with no semantic consumer at all, so the scale is wider than the system needs and reviewers cannot tell which steps are meaningful from the token list alone
- **Bad**, because products needing their own brand palette have no supported path under D1

### Confirmation

This section lists the automated checks that confirm the decision holds in practice: colour correctness is not reviewable by eye at this scale. They belong in the token build, as scripts in `packages/eds-tokens/scripts/` run as part of the CSS build (the same place `assert-no-light-dark.mjs` runs today). None of them exists yet; that directory currently holds only `assert-no-light-dark.mjs` alongside the generators:

1. **Ladder progression**: every state ladder in D5 resolves in one direction in lightness, with hover and pressed visibly distinct from default and no inversions; steps 14–15 excluded. The scale as a whole is not required to be monotonic (D3)
2. **No duplicate steps**: no two steps within one generated hue scale resolve to the same value (the [#5282](https://github.com/equinor/design-system/issues/5282) failure mode)
3. **No alpha in the scale**: the only permitted alpha values in generated colour CSS are `--eds-overlay-scrim` and the elevation shadow colours (`elevation.ambient`, `elevation.key`); anything else fails the build
4. **No duplicate emitted names**: reject two token paths producing one CSS custom property (D8)
5. **APCA targets**: semantic foreground roles are measured against `background.surface` (`neutral.15`, shared by `dialog` and `floating`): Lc90 for body text (`text.primary`) and Lc60 for interactive elements and secondary text. `on-emphasis` roles are measured against their tone's emphasis fill (step 9). Pairs on any other backdrop are blocked until the surface pairing is documented
6. **No `light-dark(`** in published CSS: existing guard, ADR-0013

Code review additionally checks that components bind to the semantic layer, not to `scheme/*` or `color/*`, and that no component composes a state colour from opacity.

## Unresolved

Recorded so that they are not mistaken for oversights:

- **Surface pairing is undocumented.** D4's contract says each scale colour is matched to the surface it sits on, but no written list of valid colour↔surface pairs exists. Check 5 defines `background.surface` as the reference backdrop, so it can run for on-surface and on-emphasis pairs; for every other backdrop the contract is unenforceable until the pairing is written down. Raised on [#4741](https://github.com/equinor/design-system/issues/4741) and [#5274](https://github.com/equinor/design-system/discussions/5274); no issue filed.
- **Data visualisation.** `data-visualization.*` tokens exist (categorical ramps plus a diverging and a sequential ramp), but they are hand-picked hex values passed through the layers, outside the OKLCH generator, and carry no guidance on ordering, accessibility or when alpha is appropriate. The top request from designers is a proper dataviz palette; teams are currently building their own.
- **Whether hand-set lightness inputs should be constrained.** D3 accepts them as authored values. Whether they should additionally satisfy a minimum perceptual delta between adjacent steps is open, and would turn some of today's tuning into a build failure.
- **Orphaned steps 6 and 14.** Either give them roles or drop them from the scale. Dropping them is a cascade-rename, so it has to happen before 3.0 leaves beta.
- **The second table-selection pattern**, defined in the 25 Jun sync, has never been built, so the selected-state ladder in D5 is validated against one pattern only.
- **Dark step-4 borders against canvas and surface.** With the deliberate dark-ladder dip (D3), the roles on step 4 (`border.non-interactive.<tone>.muted`, `border.interactive.<tone>.muted.default`, `border.interactive.disabled`) measure APCA Lc ≈ 0 against both `background.canvas` and `background.surface` in dark (measured 2026-08-27; they measured Lc ≈ 24 under the previous values). Whether those pairings are in scope is exactly what the missing surface-pairing list would settle; recorded here so the observation is not lost, not asserted as a defect.

## Related

- [ADR-0002: Use vanilla CSS with design tokens for EDS 2.0](./0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
- [ADR-0004: Spacing approach for EDS 2.0](./0004-spacing-approach-for-eds-2.md)
- [ADR-0005: Typography approach for EDS 2.0](./0005-typography-approach-for-eds-2.md)
- [ADR-0007: Token variable architecture (spacing & typography)](./0007-token-variable-architecture-spacing-typography.md)
- [ADR-0011: Adopt the Tokens Studio platform token pipeline](./0011-adopt-tokens-studio-platform-pipeline.md)
- [ADR-0013: Attribute-scoped custom properties, not `light-dark()`](./0013-attribute-scoped-custom-properties-not-light-dark.md)
- Epic [#4740](https://github.com/equinor/design-system/issues/4740): EDS token redefinition
- [#4963](https://github.com/equinor/design-system/issues/4963): define the token variable architecture (Figma + code ADRs); the parent task this decision record delivers on
- [#4741](https://github.com/equinor/design-system/issues/4741): alpha/opacity support (closed 2026-08-26; the opaque decision write-up)
- [#4742](https://github.com/equinor/design-system/issues/4742): colour scale values
- [#4744](https://github.com/equinor/design-system/issues/4744): colour token naming
- [#4745](https://github.com/equinor/design-system/issues/4745): token documentation
- [#5119](https://github.com/equinor/design-system/issues/5119): colour migration
- [#5124](https://github.com/equinor/design-system/issues/5124): dynamic-vs-static user-test review (validates the static-only decision)
- [#5280](https://github.com/equinor/design-system/issues/5280): semantic layer restructure
- [#5282](https://github.com/equinor/design-system/issues/5282): duplicate and inverted dark scale steps
- `packages/eds-tokens/src/tokens/raw/`: the repo mirror of the Tokens Studio project this ADR describes
