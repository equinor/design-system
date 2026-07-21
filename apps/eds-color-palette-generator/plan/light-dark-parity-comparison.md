# Light / Dark Parity — Color Generator vs Figma

Comparison of the color palette generator's light and dark themes against the variables in the
Figma file [`Test` (6KTCpIisRSBfWnQBvW1poE)](https://www.figma.com/design/6KTCpIisRSBfWnQBvW1poE/Test).

**Scope:** light vs dark parity — does every token have consistent light and dark values across
the generator and Figma. **Analysis only, no source changes.**

Date: 2026-07-10.

---

## 1. Summary / verdict

The generator renders its previews from a hardcoded semantic-token map (`src/config/semanticColors.ts`)
that was generated from the Figma **"Color Map"** sections — `Color Map Light` (node `73:314`) and
`Color Map Dark` (node `73:455`). So this is effectively a **drift check** between the code and its
Figma source.

**Result:** **Light** tokens match the Figma Color Map. **Dark** now follows the **tonal-inversion
rule** — the generator's own OKLCH ramp output in dark mode (light accent fills, pure-gray neutrals),
**not** the fixed-`#206f77` Figma dark board (`132:23906`). This is the adopted standard (§4a);
applied in `semanticColors.ts` (`DARK`) and `globals.css` (page background). Remaining item:

- **3 light values Figma omits** that the code hand-fills (documented in code comments — Figma-side gap, §5).

> **Decision 2026-07-10 (current):** dark = **tonal inversion**, sourced from the generator's OKLCH
> engine. Accent emphasis `#8cd2da` (light teal, was `#206f77`), neutral canvas `#0b0b0b`, surface
> `#222222` (brighter than canvas → correct elevation), primary text `#fcfcfc`, accent-button label
> `#030303` (dark on light fill). Chosen over the board (`132:23906`) for **accessibility** (the
> board's `#206f77` fill fails WCAG 1.4.11 on dark; tonal passes at 9–12:1) and **consistency** (the
> engine already emits these values; nothing shipped constrains us). Full rationale + contrast
> numbers in §4a. Nothing is shipped — this is the rule going forward.
>
> This **supersedes** the earlier board-alignment (§4, kept for history) which set canvas `#222222`,
> surface `#1a1a1a`, accent `#206f77`, text `#e1e1e1`.

Both the code and Figma have **full light/dark parity for every token the code imports**. The
notable parity issue lives **on the Figma side**: 3 tokens are defined in the Dark map but missing
from the Light map (§5). Figma is also **internally inconsistent in dark** — the board `132:23906`
and `Color Map Dark` (`73:455`) disagree on ~20 tokens; the code now sidesteps that by following the
engine directly (§4a).

---

## 2. Method & data sources

| Side | Source |
|---|---|
| Generator light/dark | `src/config/semanticColors.ts` — `LIGHT` / `DARK` maps (50 tokens each, identical key sets) |
| Generator ramps | `src/config/config.ts` (`PALETTE_STEPS`, per-step `lightValue`/`darkValue`); seeds in `src/config/palette.ts` |
| Figma authoritative | `get_variable_defs` on `73:314` (`Color Map Light`) and `73:455` (`Color Map Dark`) |
| Figma secondary | Status Message variants `22:32/35/38/41/44`; Light/Dark instances `1:2907–2917` |

The Figma Color Map defines ~90+ color tokens (≈91 light / ≈94 dark). The code imports a curated
subset of 50 (§5).

---

## 3. Full token-by-token comparison (the 50 imported tokens)

Legend: ✅ match · 🎨 intentional deviation (documented) · ⚠️ Figma light value absent (code hand-fills)

### Neutral surfaces

| Token | Code L | Figma L | L | Code D | Figma D | D |
|---|---|---|---|---|---|---|
| `bg-neutral-canvas` | `#f5f5f5` | `#f5f5f5` | ✅ | `#141414` | `#0b0b0b` | 🎨 |
| `bg-neutral-surface` | `#ffffff` | `#ffffff` | ✅ | `#1c1c1c` | `#202223` | 🎨 |
| `bg-neutral-fill-muted-default` | `#e1e1e1` | `#e1e1e1` | ✅ | `#525c65` | `#525c65` | ✅ |
| `bg-neutral-fill-muted-hover` | `#d4d4d4` | `#d4d4d4` | ✅ | `#5d6b76` | `#5d6b76` | ✅ |
| `bg-neutral-fill-muted-active` | `#c4c4c4` | `#c4c4c4` | ✅ | `#6b7d8b` | `#6b7d8b` | ✅ |
| `bg-neutral-fill-emphasis-default` | `#636363` | `#636363` | ✅ | `#b4c7d7` | `#b4c7d7` | ✅ |
| `bg-neutral-fill-emphasis-hover` | `#525252` | `#525252` | ✅ | `#cadae7` | `#cadae7` | ✅ |
| `bg-neutral-fill-emphasis-active` | `#4d4d4d` | `#4d4d4d` | ✅ | `#deeaf4` | `#deeaf4` | ✅ |
| `bg-floating` | `#ffffff` | `#ffffff` | ✅ | `#202223` | `#202223` | ✅ |
| `bg-backdrop` | `#aeaeae` | `#aeaeae` | ✅ | `#738696` | `#738696` | ✅ |

### Accent surfaces

| Token | Code L | Figma L | L | Code D | Figma D | D |
|---|---|---|---|---|---|---|
| `bg-accent-canvas` | `#eaf8fa` | `#eaf8fa` | ✅ | `#0a0b0b` | `#0a0b0b` | ✅ |
| `bg-accent-surface` | `#f6ffff` | `#f6ffff` | ✅ | `#1e2323` | `#1e2323` | ✅ |
| `bg-accent-fill-muted-default` | `#cfe7e9` | `#cfe7e9` | ✅ | `#3c6266` | `#3c6266` | ✅ |
| `bg-accent-fill-muted-hover` | `#bbdbdf` | `#bbdbdf` | ✅ | `#3e7378` | `#3e7378` | ✅ |
| `bg-accent-fill-muted-active` | `#a2cdd2` | `#a2cdd2` | ✅ | `#41878e` | `#41878e` | ✅ |
| `bg-accent-fill-emphasis-default` | `#206f77` | *(absent)* | ⚠️ | `#8cd2da` | `#8cd2da` | ✅ |
| `bg-accent-fill-emphasis-hover` | `#205c62` | `#205c62` | ✅ | `#ace3e9` | `#ace3e9` | ✅ |
| `bg-accent-fill-emphasis-active` | `#1c5157` | *(absent)* | ⚠️ | `#c7f1f6` | `#c7f1f6` | ✅ |

### Borders

| Token | Code L | Figma L | L | Code D | Figma D | D |
|---|---|---|---|---|---|---|
| `border-accent-subtle` | `#bbdbdf` | `#bbdbdf` | ✅ | `#3c6266` | `#3c6266` | ✅ |
| `border-accent-medium` | `#7cbac1` | `#7cbac1` | ✅ | `#439199` | `#439199` | ✅ |
| `border-accent-strong` | `#21767e` | `#21767e` | ✅ | `#6ec0c9` | `#6ec0c9` | ✅ |
| `border-neutral-subtle` | `#d4d4d4` | `#d4d4d4` | ✅ | `#696969` | `#525c65` | 🎨 |
| `border-neutral-medium` | `#aeaeae` | `#aeaeae` | ✅ | `#738696` | `#738696` | ✅ |
| `border-neutral-strong` | `#696969` | `#696969` | ✅ | `#9fb4c6` | `#9fb4c6` | ✅ |
| `border-focus` | `#6fb6e9` | `#6fb6e9` | ✅ | `#2d8bc5` | `#2d8bc5` | ✅ |

### Text

| Token | Code L | Figma L | L | Code D | Figma D | D |
|---|---|---|---|---|---|---|
| `text-neutral-subtle` | `#585858` | `#585858` | ✅ | `#d6e3ee` | `#d6e3ee` | ✅ |
| `text-neutral-strong` | `#333333` | *(absent)* | ⚠️ | `#f5fdff` | `#f5fdff` | ✅ |
| `text-neutral-subtle-on-emphasis` | `#dedede` | `#dedede` | ✅ | `#333639` | `#333639` | ✅ |
| `text-neutral-strong-on-emphasis` | `#ffffff` | `#ffffff` | ✅ | `#030303` | `#030303` | ✅ |
| `text-accent-subtle` | `#1f6369` | `#1f6369` | ✅ | `#bcebf1` | `#bcebf1` | ✅ |
| `text-accent-strong` | `#141f20` | `#141f20` | ✅ | `#e6ffff` | `#e6ffff` | ✅ |
| `text-accent-subtle-on-emphasis` | `#cae4e7` | `#cae4e7` | ✅ | `#2c3839` | `#2c3839` | ✅ |
| `text-accent-strong-on-emphasis` | `#ffffff` | `#ffffff` | ✅ | `#030303` | `#030303` | ✅ |
| `text-link` | `#0070a9` | `#0070a9` | ✅ | `#5abbfb` | `#5abbfb` | ✅ |

### Concept (success / info / warning / danger)

| Token | Code L | Figma L | L | Code D | Figma D | D |
|---|---|---|---|---|---|---|
| `bg-success-fill-muted-default` | `#cfeacc` | `#cfeacc` | ✅ | `#3c673a` | `#3c673a` | ✅ |
| `bg-success-fill-emphasis-default` | `#207720` | `#207720` | ✅ | `#8cdb87` | `#8cdb87` | ✅ |
| `text-success-subtle` | `#20691f` | `#20691f` | ✅ | `#bcf2b8` | `#bcf2b8` | ✅ |
| `border-success-subtle` | `#bbe0b8` | `#bbe0b8` | ✅ | `#3c673a` | `#3c673a` | ✅ |
| `bg-info-fill-muted-default` | `#cae6fa` | `#cae6fa` | ✅ | `#33607e` | `#33607e` | ✅ |
| `bg-info-fill-emphasis-default` | `#006aa0` | `#006aa0` | ✅ | `#7dceff` | `#7dceff` | ✅ |
| `text-info-subtle` | `#015e8d` | `#015e8d` | ✅ | `#b7e8ff` | `#b7e8ff` | ✅ |
| `border-info-subtle` | `#b5daf5` | `#b5daf5` | ✅ | `#33607e` | `#33607e` | ✅ |
| `bg-warning-fill-muted-default` | `#fbdac1` | `#fbdac1` | ✅ | `#7e4e25` | `#7e4e25` | ✅ |
| `bg-warning-fill-emphasis-default` | `#9b4900` | `#9b4900` | ✅ | `#ffad63` | `#ffad63` | ✅ |
| `text-warning-subtle` | `#8a4100` | `#8a4100` | ✅ | `#ffd4aa` | `#ffd4aa` | ✅ |
| `border-warning-subtle` | `#f6caaa` | `#f6caaa` | ✅ | `#7e4e25` | `#7e4e25` | ✅ |
| `bg-danger-fill-muted-default` | `#ffd0ce` | `#ffd0ce` | ✅ | `#923a3c` | `#923a3c` | ✅ |
| `bg-danger-fill-emphasis-default` | `#bc002a` | `#bc002a` | ✅ | `#ffa3a1` | `#ffa3a1` | ✅ |
| `text-danger-subtle` | `#a50827` | `#a50827` | ✅ | `#ffd0ce` | `#ffd0ce` | ✅ |
| `border-danger-subtle` | `#ffbcba` | `#ffbcba` | ✅ | `#923a3c` | `#923a3c` | ✅ |

**Totals (vs Color Map):** the **Code** columns above capture the Color-Map baseline — light still
matches (3 absent in Figma light). **Dark has since been re-aligned to node `132:23906`** (§4), so
the Code-D column above is superseded by §4 for the neutral / accent / border / text tokens that
node defines. Concept colours and all light values are unchanged.

---

## 4. Dark tokens — the earlier board alignment (SUPERSEDED — kept for history)

> **Superseded by §4a (tonal-inversion rule).** This section documents the interim state where the
> dark map followed the Figma board `132:23906`. It no longer matches the code — kept only to explain
> the history and why the board was abandoned.

The **dark** semantic tokens follow the Figma **dark variables** at node `132:23906` (the
component / container / border / text variable set) — not the Color Map, and not the raw
"surfaces" mockup (`136:26170`, whose fills were raw hex `#141414`/`#1c1c1c` that did **not** equal
the variables). Applied in `src/config/semanticColors.ts` (`DARK`) and `src/app/globals.css` (page
background). Full mapping:

| App token (dark) | Figma variable (132:23906) | Value |
|---|---|---|
| `bg-neutral-canvas` + page bg | `background/container/canvas/default` | `#222222` |
| `bg-neutral-surface` | `background/container/card/default` | `#1a1a1a` |
| `bg-floating` | `background/container/sheet/dialog/default` | `#1a1a1a` |
| `bg-backdrop` | `misc/scrim` | `#1d1d1d` |
| `bg-neutral-fill-muted-default` | `background/surface/default/default` | `#222222` |
| `bg-neutral-fill-muted-hover` | `background/surface/default/hover` | `#171717` |
| `bg-neutral-fill-muted-active` | `background/surface/default/active` | `#171717` |
| `bg-accent-fill-emphasis-default` | `background/surface/accent/default/default` | `#206f77` |
| `bg-accent-fill-emphasis-hover` | `background/surface/accent/default/hover` | `#498288` |
| `bg-accent-fill-emphasis-active` | `background/surface/accent/default/pressed` | `#50929a` |
| `border-neutral-subtle` | `border/default` | `#696969` |
| `border-neutral-medium` | `border/hover` | `#838383` |
| `border-focus` | `border/selected` | `#daf9fc` |
| `border-accent-subtle` | `border/accent/subtle` | `#2c3536` |
| `border-accent-medium` | `border/accent/default` | `#416165` |
| `border-accent-strong` | `border/accent/strong` | `#50929a` |
| `text-neutral-strong` | `text/primary` | `#e1e1e1` |
| `text-accent-subtle` | `text/accent` → overridden | `#bcebf1` (not `#206f77` — see note) |
| `text-accent-strong-on-emphasis` | `eds-color-text-strong-on-emphasis` | `#ffffff` |

⚠️ `text-accent-subtle`: the `text/accent` variable (`#206f77`) is **unreadable** on the dark
surfaces (it made the outlined/ghost button labels near-invisible), so it is **overridden to
`#bcebf1`** (a legible light-teal). `text/accent` `#206f77` appears to be a light-surface value;
Figma's *dark* accent-text variable should be a lighter colour.

**Not defined in node 132:23906 (kept at prior Color-Map values):** neutral emphasis fills
(`bg-neutral-fill-emphasis-*`), accent canvas/surface and accent muted fills, `border-neutral-strong`,
`text-neutral-subtle`, `text-*-on-emphasis` (except accent-strong), `text-link`, and all concept
colours (success / info / warning / danger).

**Light mode is unchanged** (still Color Map) — node `132:23906` is a dark artboard; a light
variable source is needed to align light.

**Generated ramp (`config.ts`) not changed here:** it still targets dark lightness `0.19 → #141414`
(canvas) / `0.226 → #1c1c1c` (surface). The container variables are non-monotonic (canvas `#222222`
is *lighter* than card `#1a1a1a`), so the monotonic primitive gray ramp cannot reproduce them in
sequential steps — the semantic tokens above are the source of truth for the previews.

**Other dark backgrounds in the file (for reference):** Color Map canvas/surface (`#0b0b0b` /
`#202223`) and the legacy generic `background` (`#212121`) are now both outliers vs the applied
`132:23906` variables and should be reconciled in Figma.

---

## 4a. Dark source-of-truth — recommendation (accessibility + consistency)

There are **three** conflicting dark definitions in play:

| | canvas | surface | accent fill | neutral border | philosophy |
|---|---|---|---|---|---|
| **A. Board `132:23906`** (preview map follows this) | `#222222` | `#1a1a1a` | `#206f77` (dark teal, = light) | `#696969` pure gray | keep brand hex fixed across modes |
| **B. Color Map Dark `73:455`** | `#0b0b0b` | `#202223` | `#8cd2da` (light teal) | `#525c65` blue-tinted | tonal inversion (lighten accents in dark) |
| **C. Generator algorithm** (`config.ts` output) | `#0a0b0b` / `#141414` | `#1e2323` / `#1c1c1c` | `#8cd2da` | `#5b5b5b` pure gray | tonal inversion, OKLCH, pure-neutral grays |

**The generator's own OKLCH engine produces B/C, not the board (A) it previews.** The committed
snapshot (`src/cli/__snapshots__/generate-colors.test.ts.snap`) Moss-Green dark ramp equals Color
Map Dark's accent tokens exactly — `bg-accent-fill-emphasis-default #8cd2da`, `hover #ace3e9`,
`active #c7f1f6`, `text-subtle #bcebf1`, `text-strong #e6ffff`. So `semanticColors.ts DARK`
(hand-pinned to A) contradicts the algorithm that is the whole point of the tool.

**Rule (adopted & implemented 2026-07-10): dark uses the tonal-inversion approach (B / the algorithm
— light accent fills in dark), not the fixed-`#206f77` board (A).** It wins on both accessibility and
consistency, and nothing shipped constrained the choice. `semanticColors.ts DARK` and `globals.css`
now carry the algorithm's dark ramp values (neutral = Gray ramp, accent = Moss Green ramp).

**Figma sync (applied 2026-07-10):** the Test file's dark theme was updated to match, via `use_figma`
(Plugin API). Figma uses a Primitive→Theme→Semantic pipeline; the changes were:
- Primitive `Dark/Moss Green/1..15` and `Dark/Gray/1..15` set to the generator's tonal dark ramps
  (accent emphasis `Dark/Moss Green/9` `#206f77 → #8cd2da`; Gray steps 1/9/15 aligned to the ramp).
  The concept/data dark ramps (Blue/Orange/Green/Red) already matched the generator — untouched.
- Theme (Dark mode) neutral remap fixed for elevation: `Neutral/1 → Dark/Gray/1` (canvas `#0b0b0b`),
  `Neutral/2`/`Neutral/15 → Dark/Gray/2` (surfaces `#222222`), undoing the bespoke `Neutral/1↔2` swap.
- Board `132:23906`: the one raw-hardcoded default button (`#206f77`/white) + the board background
  were re-bound to their semantic tokens (`background/surface/accent/default/default`, `text/on-accent`,
  `background/container/canvas/default`) so they follow the pipeline like the rest.

**Full token-for-token reconciliation (Figma → builder, applied 2026-07-10):** after the sync above,
a live diff still showed 11 dark tokens using different ramp *steps* than the builder. Resolved by:
- Syncing `Light/Gray` + `Light/Moss Green` primitives to the generator's light ramps (mirror of dark).
- Re-pointing 11 Semantic aliases to the builder's step roles: `background/surface/default/{default,
  hover,active} → Neutral/{3,4,5}`, `border/default → Neutral/6`, `border/selected → Blue/7`,
  `border/accent/{subtle,default,strong} → Accent/{6,7,8}`, `text/primary → Neutral/13`,
  `text/accent → Accent/12`, `text/on-accent → Accent/15`.
- Fixed a Theme wiring bug: `Accent/15` light was aliased to `Moss Green/1`, corrected to `Moss Green/15`.

The 2 remaining light residuals (`text/primary`, accent-pressed) were the builder's hand-picked
values off the generator ramp. Resolved on **accessibility** grounds — both builder picks are the
better/equal WCAG choice, so they were mirrored into Figma (Theme `Neutral/13` light `#333333`,
`Accent/11` light `#1c5157`, set as raw values):
- `text/primary`: `#333333` = 12.6:1 on white vs `#1d1d1d` = 16.9:1. Both far exceed AAA (7:1); above
  ~10:1 extra contrast doesn't aid legibility and near-black-on-white raises eye-strain/halation, so
  `#333333` is the better real-world body-text value.
- accent-pressed label (white on fill): `#1c5157` = 8.9:1 vs `#20565c` = 8.2:1 — builder is higher.

**Result: dark = 18/18 AND light = 18/18 token-for-token with the builder (verified via live
`get_variable_defs` resolve pass). Figma's Semantic pipeline and the builder are fully aligned.**

Accessibility (measured WCAG contrast, sRGB relative luminance):

| check | A: fixed `#206f77` | B: light `#8cd2da` |
|---|---|---|
| button label on accent fill | white `5.83:1` (AA) | near-black **`12.1:1` (AAA)** |
| accent fill vs surface — 1.4.11 non-text needs ≥3:1 | `2.98:1` **fails** (vs `#1a1a1a`) | **`9.4:1` pass** |
| accent fill vs canvas | `2.73:1` **fails** (vs `#222222`) | **`11.6:1` pass** |

A's accent fill barely separates from the dark background and forces manual per-token overrides
(the `#bcebf1` hack in §4 exists precisely because A breaks down for accent text). B is
systematically safe with no overrides.

Consistency:
- **Elevation semantics stay coherent.** Light: elevated surface is *brighter* than canvas
  (`#ffffff` > `#f5f5f5`). B keeps that in dark (`#202223` > `#0b0b0b`). A **inverts** it — card
  `#1a1a1a` is *darker* than canvas `#222222`, the opposite of light.
- **Hue is preserved systematically.** OKLCH lightens the accent while keeping its hue, so teal
  stays teal — a principled rule that scales to all 7 seeds, versus A's hand-maintained exceptions.
- **It matches the engine**, so the preview stops lying about what the tool generates.

**Caveat (not the generator's call):** if board `132:23906` is the *already-shipped* EDS product
dark theme, that is a product constraint that outranks the ramp. In that case the finding flips to
"the shipped dark theme diverges from the generator's algorithm and from WCAG on fill contrast" —
raise with the design-system owners rather than silently keeping the override.

---

## 5. Figma's own light/dark parity gap (3 tokens dark-only)

The Figma **Light** Color Map is missing 3 tokens that its **Dark** map defines. The code
hand-fills these light values (marked "not in MCP light dump" in `semanticColors.ts`):

| Token | Figma light | Figma dark | Code light (hand-filled) |
|---|---|---|---|
| `bg-accent-fill-emphasis-default` | *(absent)* | `#8cd2da` | `#206f77` (brand) |
| `bg-accent-fill-emphasis-active` | *(absent)* | `#c7f1f6` | `#1c5157` (derived) |
| `text-neutral-strong` | *(absent)* | `#f5fdff` | `#333333` (Gray/13) |

**Recommended Figma fix:** add these three variables to `Color Map Light` (`73:314`) so the two
modes reach parity. Suggested light values = the code's hand-filled values above.

---

## 6. Coverage gap — code imports a subset (~50 of ~90+ Figma tokens)

The Figma Color Map defines the full concept ramps; `semanticColors.ts` keeps only the tokens the
previews actually use. Present in Figma (both modes) but **absent from code**:

- `bg-{success,info,warning,danger}-{canvas,surface}`
- `bg-*-fill-muted-{hover,active}` and `bg-*-fill-emphasis-{hover,active}` (concept)
- `border-*-{medium,strong}` (concept)
- `text-*-{strong,subtle-on-emphasis,strong-on-emphasis}` (concept)

This is **coverage, not parity** — for every token the code does import, both light and dark are
present and complete. Expand `semanticColors.ts` only if a preview needs one of these.

---

## 7. Parity status summary

| Layer | Light | Dark | Parity |
|---|---|---|---|
| `semanticColors.ts` (50 tokens) | ✅ all | ✅ all | Full L/D parity |
| Generated ramps (`config.ts`, 15 steps) | ✅ `lightValue` | ✅ `darkValue` | Full L/D parity; no direct Figma ramp to compare against |
| Figma "Color Map" (~90+ tokens) | ⚠️ 3 missing | ✅ all | 3 dark-only tokens (§5) |

---

## 8. Secondary — the Test file contains a second, inconsistent color set

The **Status Message** component in the same Figma file uses a simpler `text` / `background` /
`outline` + feedback vocabulary (neutral / error / warning / validation / brand) whose values do
**not** match the Color Map / EDS concept tokens.

Example (light) — Status "validation" vs Color Map "success":

| | Status Message (light) | Color Map / code (light) |
|---|---|---|
| text | `#327830` | `text-success-subtle` `#20691f` |
| background | `#f6fff5` | `bg-success-fill-muted-default` `#cfeacc` |
| outline | `#7cc278` | `border-success-subtle` `#bbe0b8` |

These feedback tokens **do** have full light+dark parity on their own — in dark they invert to
white text / dark-tinted background / light-tint outline:

| Feedback | text L→D | background L→D | outline L→D |
|---|---|---|---|
| neutral | `#333333` → `#f5f5f5` | `#f5f5f5` → `#212121` | `#cccccc` → `#999999` |
| error | `#c83c3f` → `#ffffff` | `#fff9f8` → `#562828` | `#ff7a7d` → `#fff9f8` |
| warning | `#b46428` → `#ffffff` | `#fffcf0` → `#633f22` | `#e89959` → `#fffcf0` |
| validation | `#327830` → `#ffffff` | `#f6fff5` → `#315131` | `#7cc278` → `#f6fff5` |
| brand | `#19565c` → `#fbfefe` | `#f3fbfc` → `#10383c` | `#36bbc9` → `#33b0bd` |

**Takeaway:** the Test file holds two coexisting color systems — the **Color Map** (which the
generator mirrors) and the older **Status Message** demo tokens. Only the Color Map is the
generator's source of truth; don't reconcile the generator against the Status Message set.

---

## 9. How to re-verify

- Re-run `get_variable_defs` on `73:314` and `73:455` in file `6KTCpIisRSBfWnQBvW1poE` to confirm
  the Figma values haven't moved.
- Diff §3's "Code" columns against `src/config/semanticColors.ts` `LIGHT` / `DARK` — should be 1:1
  apart from the 3 flagged deviations (§4).
- Optional visual check: `pnpm --filter eds-color-palette-generator dev`, toggle the color-scheme
  switch, and confirm the 3 intentional dark-neutral values in the live previews.
