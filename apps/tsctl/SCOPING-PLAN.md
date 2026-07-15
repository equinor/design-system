# Scoping & publishing plan

How Figma **variable scopes** and **`hiddenFromPublishing`** should be set across the EDS token
project, and the work to get there. Mechanism to apply any of this: the `$extensions` support in the
sync/write layer (see `EXTENSIONS-PLAN.md`).

## Principle

**Only the semantic sets are published.** Everything else is DS-owned internal plumbing and must be
`hiddenFromPublishing: true`. Published (not hidden): **`semantic`** (colour usage layer) and
**`semantic/default`** (spacing / typography / radius usage layer). Hidden: `primitives/default`,
`density/*`, `font/default`, `input/*`, `foundation/*`, `color/*`, `scheme/*`, `concept`.

Scopes restrict which Figma properties a variable can bind to (so the picker only offers relevant
variables). Set them by token role/type even on hidden sets, for internal consistency.

## Status (2026-07-07)

- ✅ **Publish setting enforced** — branch **`hide-nonsemantic-2`** (`49824ec9-…`, off the
  post-`new-color-schema`-merge main, unmerged): the non-semantic sets set to
  `hiddenFromPublishing: true` (**491** tokens across `color/*`, `scheme/*`, `input/*`,
  `foundation/*`; the already-hidden `primitives/default`, `density/*`, `font/default` unchanged).
  `concept` is **permanently deleted** (a decision — merged out via `new-color-schema`), so it's not
  hidden, just gone. `semantic` (59 colour) + `semantic/default` remain published. Main untouched;
  review/merge in the UI. The earlier pre-merge branch `hide-non-semantic-sets` (`6c5e9908`) was
  **archived** (superseded). *(Apply summary read "0 changes" — the extensions-only verify-count
  quirk; confirmed via GET.)*
- ✅ **Colour semantic scopes applied** — branch **`scope-semantic-colors`** (`2d82ad7b…`, off main,
  unmerged): the 59 `semantic` colour tokens scoped (background/overlay/status → `FRAME_FILL,SHAPE_FILL`;
  text → `TEXT_FILL`; icon → `SHAPE_FILL`; border → `STROKE_COLOR`), all kept **published** (no hidden
  flag). Main untouched.
- ✅ **`primitives/default` scoped** (done separately).
- ⏳ **Pending (UI, human-only):** merge `hide-nonsemantic-2` **and** `scope-semantic-colors` into
  main, then **re-publish/sync to Figma** — the hidden + scope metadata only takes effect in Figma
  once merged to main and pushed. (This is why colour scales still showed as published vars: the hide
  branch isn't merged yet.)

## Current state — audit (main, 2026-07-07)

| Set | n | hidden | scoped | status |
|---|---|---|---|---|
| `semantic/default` | 54 | false (published) | ✅ all | ✅ correct |
| `semantic` (colour) | 90 | none (published) | ✗ none | published ✓; **colour scopes deferred** (below) |
| `primitives/default` | 82 | ✅ true | ✗ **none** | **gap — needs scopes** (this pass) |
| `density/comfortable\|compact\|relaxed` | 49×3 | ✅ true | ✅ all | ✅ correct |
| `font/default` | 5 | ✅ true | ✅ all | ✅ correct |
| `color/light\|dark` | 105×2 | ✗ none | ✗ none | **should be hidden** (colour follow-up) |
| `scheme/light\|dark` | 98×2 | ✗ none | ✗ none | **should be hidden** (colour follow-up) |
| `input/palette\|scale` | 7 / 34 | ✗ none | ✗ none | **should be hidden** (colour follow-up) |
| `foundation/anchor\|gaussian` | 14 / 30 | ✗ none | ✗ none | **should be hidden** (colour follow-up) |
| `concept` | 8 | ✗ none | ✗ none | colour; being removed on `new-color-schema` |

So **hiding is already done for spacing/typography** (primitives/density/font hidden, semantic/default
published). The colour generator sets are still published — a separate follow-up.

## Type → scope convention (established, from density/font/semantic-default)

| token type | scopes |
|---|---|
| `dimension` (spacing) | `WIDTH_HEIGHT`, `GAP` |
| `dimension` (corner-radius) | `CORNER_RADIUS` |
| `fontSize` | `FONT_SIZE` |
| `lineHeight` | `LINE_HEIGHT` |
| `fontWeight` / `number` (weight) | `FONT_WEIGHT` |
| `fontFamily` / `text` | `FONT_FAMILY` |

## Deferred — scope `primitives/default` (spacing & typography)

(Prepared and verified on a branch, then set aside to prioritise the publish-setting pass above.)
The only spacing/typography scope gap. 82 tokens, by type (all `dimension` here are **spacing**, not radius —
corner-radius lives in `density/*`):

- `dimension` (43, `primitives.spacing.*`) → `WIDTH_HEIGHT`, `GAP`
- `fontSize` (22, `type-scale.*.font-size`) → `FONT_SIZE`
- `lineHeight` (11, `lineheight-scale.*`) → `LINE_HEIGHT`
- `fontWeight` (4, `weight-scale.*`, `tracking-normal`) → `FONT_WEIGHT`
- `fontFamily` (2, `font-family.*`) → `FONT_FAMILY`

**Preserve `hiddenFromPublishing: true`** on every one (the API replaces the `com.figma` object, so
each write sends `{scopes, hiddenFromPublishing:true}`).

⚠️ **Anomaly to flag (not fixed here):** `primitives.type-scale.tracking-normal` is typed `fontWeight`
but semantically is letter-spacing — scoping by type gives it `FONT_WEIGHT`, likely wrong. Someone
should re-check its type; scope follows type by convention rather than guessing.

## Applied — colour semantic scope→role mapping

Applied to the 59 `semantic` colour tokens on branch `scope-semantic-colors` (see Status). The
mapping used (strict variant):

| Token group | count | Proposed scopes |
|---|---|---|
| `background.container.*`, `background.surface.*` | 24 | `FRAME_FILL`, `SHAPE_FILL` |
| `text.*` (incl. `text.status.*`) | 11 | `TEXT_FILL` |
| `icon.*` | 10 | `SHAPE_FILL` (or `+ STROKE_COLOR` for outline icons) |
| `border.*` | 7 | `STROKE_COLOR` |
| `overlay.scrim` | 1 | `FRAME_FILL`, `SHAPE_FILL` |
| `status.warning.*` | 6 | `FRAME_FILL`, `SHAPE_FILL` |

Open decisions: strict-vs-`ALL_FILLS`; icon stroke; whether to run on `new-color-schema` or after it
merges.

## Follow-ups (not in this pass)

1. ✅ **Hide the colour generator sets** — done on branch `hide-non-semantic-sets` (see Status).
2. **Scope `primitives/default`** — the deferred spacing/typography scope pass above.
3. **Colour semantic scope pass** — apply the mapping above once signed off.
4. **Merge** `hide-non-semantic-sets` (and eventually the colour/scoping branches) in the Tokens
   Studio UI — merges are human-only.
