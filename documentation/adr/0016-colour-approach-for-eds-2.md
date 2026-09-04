# Colour approach for EDS 2.0

- **Status:** Proposed
- **Date:** 2026-08-27
- **Decision makers:** EDS core team

## Context

EDS 2.0 replaces the hand-picked 1.x palette with an algorithmically generated colour system: OKLCH anchors, a step scale per tone, and a semantic layer that components bind to. That work has been running since early 2026 under epic [#4740](https://github.com/equinor/design-system/issues/4740): colour values ([#4742](https://github.com/equinor/design-system/issues/4742)), naming ([#4744](https://github.com/equinor/design-system/issues/4744)), the semantic restructure ([#5280](https://github.com/equinor/design-system/pull/5280)) and migration ([#5119](https://github.com/equinor/design-system/issues/5119)).

**None of it is written down as a decision.** Spacing has [ADR-0004](./0004-spacing-approach-for-eds-2.md); typography has [ADR-0005](./0005-typography-approach-for-eds-2.md) and [ADR-0007](./0007-token-variable-architecture-spacing-typography.md). Colour, the largest part of the epic, has nothing: no ADR in this directory covers it. The reasoning currently lives in issue comments, sync notes and an internal team doc, which means every question that has already been settled (why the scale is opaque, why the lightness inputs are hand-typed, why step 9 is the emphasis fill) gets re-litigated from scratch, and a future maintainer or code agent has nothing to check a change against.

Two triggers made this urgent:

1. The **opaque-only decision** (2026-08-26) reversed a plan that had run from the Q2 2026 OKRs through [#4741](https://github.com/equinor/design-system/issues/4741) and the [#4742](https://github.com/equinor/design-system/issues/4742) scale expansion. It needs a durable home, or the alpha proposal returns.
2. At the time of writing, `apps/design-system-docs/` still consumes `@equinor/eds-tokens` 2.x (2.3.2) and no new token documentation exists yet, so there is no other place this reasoning can go.

Two version numbers run through this document and they count different things. **EDS 2.0** is the design-system generation this colour system belongs to; **2.x** and **3.0** are majors of the `@equinor/eds-tokens` package, where 2.x carries the currently published palette and 3.0 will carry the scale described here. A file being "on 2.x tokens" is therefore not a contradiction of this ADR's title.

This ADR records the colour system as defined in **Tokens Studio, the canonical source** (state verified 2026-08-27), which the release pipeline mirrors into `packages/eds-tokens/src/tokens/`. Where the repo snapshot and Tokens Studio disagree, Tokens Studio is right. The ADR deliberately references no concrete token counts: the token set grows as roles are added, and any fixed number would go stale.

## Decision Drivers

- Contrast must be **assertable in CI**, not eyeballed: the system targets APCA Lc90 for body text and Lc60 for interactive elements, measured against `background.surface`
- Colour must be **generated, not hand-designed per tone**: one set of inputs propagates across every hue, so a tone is a mapping rather than a design exercise. Note the precise scope — the propagation is algorithmic, the inputs are not. Per scheme, 105 values (7 hues × 15 steps) are generated from 24 hand-set numbers (15 lightness values, 7 OKLCH anchors, 2 gaussian parameters); the `data-visualization` ramps are hand-picked hex outside the generator entirely, and the semantic layer is an authored mapping throughout. See the team decisions log, [`docs/architecture-decisions/decisions.md`](https://github.com/equinor/design-system-internal/blob/main/docs/architecture-decisions/decisions.md) in equinor/design-system-internal → _Algorithmic design_ and its _Exception: base input values are hand-set_
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
- Measured against the real canvas, matching existing opaque steps needed ~93% alphas ([#5274](https://github.com/equinor/design-system/discussions/5274)); the twins in PR [#5227](https://github.com/equinor/design-system/pull/5227) only landed exactly by compositing over pure white and pure black
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

Five one-way layers, in the order declared by Tokens Studio's `$metadata.json`:

```
input/palette + input/scale → foundation/gaussian + foundation/anchor
    → color/{light,dark} → scheme/{light,dark} → semantic
```

`primitives/default` is first in `tokenSetOrder` but holds no colour at all (font families, line-height scale, spacing), so the colour chain begins at `input/*`. The `font` and `density` sets are likewise outside it. `elevation/default` carries shadow geometry and is outside the chain too — the shadow *colours* it composes with live in the scheme layer (see D4). Note that the repo mirror's `$metadata.json` has no `elevation` entry at all; Studio's does, and Studio is canonical (see Context).

Each scale value is generated, never typed:

```
set_chroma(set_lightness({input.palette.<hue>.anchor}, {input.scale.<scheme>.<n>}), …)
```

- **Hue** comes from one of seven OKLCH anchors in `input/palette.json`: `blue`, `gray`, `green`, `moss-green`, `north-sea`, `orange`, `red`
- **Lightness** comes from `input/scale.json` (see D3)
- **Chroma** follows a gaussian curve over the step index: `input.scale.gaussian.<scheme>.{mean,std-dev}`, currently mean 0.6 (light) / 0.7 (dark), std-dev 2 for both

References resolve in one direction only. A semantic token must not reference another semantic token, and no layer may reference a layer below it.

### D3: The lightness inputs are hand-set, and that is deliberate

`input/scale.json` holds 15 hand-typed lightness values per scheme. **This is not technical debt and must not be "fixed" by re-deriving the ladder from a formula.** They are authored values, and the reason is recorded in the team decisions log ([`docs/architecture-decisions/decisions.md`](https://github.com/equinor/design-system-internal/blob/main/docs/architecture-decisions/decisions.md) in equinor/design-system-internal → _Exception: base input values are hand-set_): when the scale was expanded to cover the states the system needs — hover, pressed, selected, and the muted/emphasis ladders — generating the base values proved wrong on two counts. Inserting a step into a generated scale shifts every colour's position and cascade-renames the scale (active → hover, hover → default, …), breaking every consumer; and the generated values at the inserted positions did not produce usable state ladders. So the base values are picked to make the ladders work, and everything downstream of them stays generated. The algorithm's job is to propagate the authored values across hues, not to invent them.

The values in Tokens Studio as of 2026-08-27:

| Scheme | 1    | 2    | 3   | 4   | 5   | 6    | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14† | 15† |
| ------ | ---- | ---- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | ---- | ---- |
| light  | .98  | .94  | .91 | .87 | .82 | .77  | .72 | .62 | .52 | .47 | .42 | .37 | .32 | .90  | 1.00 |
| dark   | .215 | .226 | .47 | .30 | .45 | .595 | .61 | .76 | .82 | .88 | .93 | .96 | .99 | .33  | .10  |

† Steps 14 and 15 are inverse-polarity and sit outside the ladder; see below.

The ladder is **deliberately not monotonic**: the dark values dip at steps 4–5 because a strictly increasing ramp cannot hold the required contrast for every role the steps serve. The invariants are narrower, and they are what [#5282](https://github.com/equinor/design-system/issues/5282) actually established: no two steps within a scale may resolve to the same value, and every state ladder built on the scale must progress visibly in one direction. Those two properties are what _Confirmation_ asserts; global ordering is not a rule.

This **supersedes the sanity check proposed in the team decisions log**, which asks for "strict monotonicity and duplicate detection per scheme" with steps 13–15 as the exception. Both halves of that are now wrong against the live values: strict monotonicity fails at dark 3 → 4 (.47 → .30), the deliberate dip above, and step 13 is not an exception at all (dark .96 → .99 continues the ramp) — it is 14 and 15 that invert. Duplicate detection carries over unchanged as Confirmation check 2.

Steps **14 and 15 are inverse-polarity**: their lightness runs against the direction of steps 1–13 (light .90 / 1.00, dark .33 / .10). Step 14 has no semantic consumer today (see _Unresolved_). Step 15 serves two roles at once: the `text`/`icon.on-emphasis.<tone>` values that sit _on_ an emphasis fill, and — via `neutral.15` — `background.{surface,dialog,floating}`, the panel surface sitting above `background.canvas` (step 1). That is not a contradiction but the point of the inverse polarity: it makes the panel lighter than the canvas in light and darker in dark. Both steps are outside the ladder by design and must be excluded from any ladder assertion.

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

| Group                                     | default    | hover      | pressed    |
| ----------------------------------------- | ---------- | ---------- | ---------- |
| `background.interactive.<tone>.emphasis`  | 9          | 10         | 11         |
| `background.interactive.<tone>.muted`     | 1          | 2          | 3          |
| `background.interactive.accent.selected`  | 5          | 7          | 8          |
| `background.interactive.neutral.selected` | `accent` 3 | `accent` 4 | `accent` 5 |
| `border.interactive.<tone>.emphasis`      | 9          | 10         | 11         |
| `border.interactive.<tone>.muted`         | 4          | 5          | 7          |
| `icon.interactive.<tone>`\*               | 11         | 12         | 13         |
| `text`/`icon`/`border.interactive.link`   | `info` 8   | `info` 9   | `info` 10  |

Roles with no state ladder:

- `background.non-interactive.<tone>.{muted,default,emphasis}` = **1 / 3 / 9**, and `border.non-interactive.<tone>.{muted,default,emphasis}` = **4 / 7 / 9**, both for all six tones
- `text`/`icon`: `primary` = 13, `secondary` = 8, `tertiary` = 7, `inverted` = 1
- Per-context foregrounds, per tone: `text`/`icon.on-default.<tone>` = 10, `on-muted.<tone>` = 12, `on-emphasis.<tone>` = 15
- Surfaces: `background.canvas` = `neutral.1`, `background.input` = `neutral.1`, `background.{surface,dialog,floating}` = `neutral.15`, `background.inverted` = `neutral.12`, `background.backdrop` = `neutral.7`
- Stateless roles under `interactive`: `background.interactive.disabled` = `neutral.2`, `background.interactive.read-only` = `neutral.2`, `border.interactive.disabled` = `neutral.4`, `text`/`icon.interactive.disabled` = `neutral.7`, `border.interactive.focus` = `info.7`, `border.interactive.selected-indicator` = `accent.13`

\* `icon.interactive.<tone>` is the one per-tone pattern that is **not** defined for all six tones: `accent`, `info`, `success`, `warning` and `danger` exist, `neutral` does not (verified 2026-08-27). Every other per-tone role group in this table and the list below is complete at six. See _Unresolved_.

Only `icon` carries the per-tone interactive ladder; `text.interactive` holds `link` and `disabled` alone.

One entry above is a deliberate exception and not a naming slip: **`background.interactive.neutral.selected` resolves to `accent.*`**, so a `neutral`-named role is not neutral, and it runs a different ladder (3 / 4 / 5) from `background.interactive.accent.selected` (5 / 7 / 8). Both were authored for the table-selection work and neither is derived from the other; see _Unresolved_.

The `$description` fields in `input/scale.json` are **legacy intent labels** and no longer match this mapping (they name step 6 as `border-subtle` and step 8 as `border-strong`). This table, derived from the semantic layer, is authoritative; the descriptions should be corrected or dropped.

### D6: Semantic layer shape

The colour semantic layer lives in `packages/eds-tokens/src/tokens/raw/semantic.json`, grouped as `background.*`, `border.*`, `text.*`, `icon.*`, `overlay.*` and `data-visualization.*`. The token count is not part of the contract; the set grows as roles are added.

Interactive states live under an explicit `interactive` segment (`background.interactive.<tone>.<emphasis|muted|selected>.<default|hover|pressed>`), so that non-interactive roles (`background.canvas`, `border.non-interactive.neutral.default`) are distinguishable from stateful ones by name alone. Some roles under `interactive` carry no ladder at all (`disabled`, `read-only`, `focus`, `selected-indicator`): the segment marks that a role belongs to an interactive element, not that it has states. Components bind to this layer only; binding to `scheme/*` or `color/*` is not supported.

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

The eight flat scheme-layer aliases that predated PR [#5280](https://github.com/equinor/design-system/pull/5280) (`bg-backdrop`, `bg-disabled`, `bg-floating`, `bg-input`, `border-disabled`, `border-focus`, `text-disabled`, `text-link`) have been removed in Tokens Studio (verified 2026-08-27). **No role was dropped**: all eight exist as proper semantic tokens (`background.backdrop`, `background.interactive.disabled`, `background.floating`, `background.input`, `border.interactive.disabled`, `border.interactive.focus`, `text.interactive.disabled`, `text.interactive.link.*`); only the flat names went. The repo's raw snapshot lags behind until the next release pull, so the aliases may still appear in `src/tokens/raw/`; they must not be re-added.

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

This section lists the automated checks that confirm the decision holds in practice: colour correctness is not reviewable by eye at this scale. They belong in the token build, as scripts in `packages/eds-tokens/scripts/` run as part of the CSS build (the same place `assert-no-light-dark.mjs` runs today). None of them exists yet: `assert-no-light-dark.mjs` is the only assertion in that directory, the rest being build and scope tooling.

1. **Ladder progression**: every state ladder in D5 resolves in one direction in lightness, with hover and pressed visibly distinct from default and no inversions; steps 14–15 excluded. The scale as a whole is not required to be monotonic (D3)
2. **No duplicate steps**: no two steps within one generated hue scale resolve to the same value (the [#5282](https://github.com/equinor/design-system/issues/5282) failure mode)
3. **No alpha in the scale**: the only permitted alpha values in generated colour CSS are `--eds-overlay-scrim` and the elevation shadow colours (`elevation.ambient`, `elevation.key`); anything else fails the build
4. **No duplicate emitted names**: reject two token paths producing one CSS custom property (D8)
5. **APCA targets**: "foreground role" here means `text.*` and `icon.*` only. Those are measured against `background.surface` (`neutral.15`, shared by `dialog` and `floating`): Lc90 for body text (`text.primary`) and Lc60 for interactive elements and secondary text. `on-emphasis` roles are measured against their tone's emphasis fill (step 9). **`border.*` is deliberately out of scope for this check**: borders are not text, APCA has no agreed target for them, and the dark step-4 roles would fail at Lc 0 on the day the check landed (see _Unresolved_) — which would convert an open question into a red build rather than settle it. Border contrast comes into scope once the surface-pairing list exists. Pairs on any other backdrop are likewise blocked until then
6. **No `light-dark(`** in published CSS: existing guard, ADR-0013

Code review additionally checks that components bind to the semantic layer, not to `scheme/*` or `color/*`, and that no component composes a state colour from opacity.

## Unresolved

Recorded so that they are not mistaken for oversights:

- **Surface pairing is undocumented.** D4's contract says each scale colour is matched to the surface it sits on, but no written list of valid colour↔surface pairs exists. Check 5 defines `background.surface` as the reference backdrop, so it can run for on-surface and on-emphasis pairs; for every other backdrop the contract is unenforceable until the pairing is written down. Raised on [#4741](https://github.com/equinor/design-system/issues/4741) and [#5274](https://github.com/equinor/design-system/discussions/5274); no issue filed.
- **Data visualisation.** 66 `data-visualization.*` tokens exist per scheme — ten categorical ramps of five, one diverging ramp of nine, one sequential ramp of seven — but they are hand-picked hex passed through the layers, outside the OKLCH generator, and carry no guidance on ordering, accessibility or when alpha is appropriate. They are also **scheme-specific and largely inverted**: 56 of the 66 values differ between light and dark, and each categorical ramp runs light-to-dark in one scheme and dark-to-light in the other, so a series index does not mean the same lightness in both. Nothing records whether that inversion is intended or how a consumer should order a series across schemes. A proper dataviz palette has been asked for repeatedly and teams are building their own in the meantime; no issue tracks it.
- **Whether hand-set lightness inputs should be constrained.** D3 accepts them as authored values. The team decisions log records the review comment that opened this — the base values are "manually defined without constraints… a potential risk for the consistency of the system" — and two proposals against it: constrain them, or hide them from consumers. **The second is already done**: all 15 lightness steps and all 7 palette anchors carry `hiddenFromPublishing: true`, so none of them is exposed as a Figma variable. What stays open is the first: whether adjacent steps must satisfy a minimum perceptual delta, which would turn some of today's tuning into a build failure.
- **Orphaned steps 6 and 14.** Either give them roles or drop them from the scale. Dropping them is a cascade-rename, so it has to happen before 3.0 leaves beta.
- **`icon.interactive.neutral` does not exist.** The interactive icon ladder is defined for five tones and skips `neutral`, while every other per-tone group covers all six (D5). Whether that is an omission or a deliberate choice — a neutral interactive icon arguably being `icon.primary` or `icon.secondary` instead — has not been decided, so a component needing one has no token to bind to.
- **The second table-selection pattern**, defined in the 25 Jun sync, has never been built. The two selection ladders D5 records — `background.interactive.accent.selected` at 5 / 7 / 8 and `background.interactive.neutral.selected` at `accent` 3 / 4 / 5 — were both authored for the first pattern, so neither is validated against the second, and whether both should survive is open.
- **Dark step-4 borders against canvas and surface.** With the deliberate dark-ladder dip (D3), the roles on step 4 (`border.non-interactive.<tone>.muted`, `border.interactive.<tone>.muted.default`, `border.interactive.disabled`) measure **APCA Lc 0** against both `background.canvas` and `background.surface` in dark, and that is true for **all six tones**, not just `neutral` — step 4's chroma is low enough in every hue that the gaussian curve cannot separate it from the canvas. To reproduce: resolve the dark `neutral` (north-sea) scale to sRGB — canvas `neutral.1` = `#191a1a` (L .215), surface `neutral.15` = `#030303` (L .10), border `neutral.4` = `#2c2e30` (L .30) — then take APCA-W3 `Lc(text, background)` with the border as the text term. The result is exactly 0, not merely small: both pairs land under APCA's 0.1 low-contrast clamp, which floors the output to zero. Under the previous lightness inputs (dark 1 / 4 / 5 = .19 / .52 / .58) the same two pairs measured Lc −23.7 and −24.4. Dark is the outlier: the same roles in light measure Lc 17–23 against canvas and 21–27 against surface across the six tones — low, but not nil. Whether these pairings are in scope is exactly what the missing surface-pairing list would settle; recorded here so the observation is not lost, not asserted as a defect.

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
- PR [#5280](https://github.com/equinor/design-system/pull/5280) (merged 2026-08-05): the Tokens Studio release sync that landed the semantic layer restructure and removed the flat scheme-layer aliases
- [#5282](https://github.com/equinor/design-system/issues/5282): duplicate and inverted dark scale steps
- `packages/eds-tokens/src/tokens/raw/`: the repo mirror of the Tokens Studio project this ADR describes
