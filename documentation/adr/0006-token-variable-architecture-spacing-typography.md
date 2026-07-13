# Token variable architecture (typography & spacing) for the redefined token system

- **Status:** Proposed
- **Date:** 2026-06-26 (revised 2026-07-01 — mode-free semantic consumption layer)
- **Decision makers:** EDS core team (design + engineering)

## Context

This ADR defines the **variable structure** for the redefined EDS token system's **typography, spacing, corner-radius, and density** — the primitive, mode-bearing _mapping_, and mode-free _semantic_ variable layers plus the text-style layer on top. **Tokens Studio is the canonical source of truth; the Figma variables and text styles are synced _from_ Tokens Studio, not authored in Figma.** The mapping (density/font) sets alias down to primitives, and the **mode-free semantic set** — flat 1:1 aliases into density/font, the publish boundary — is the only layer consumers touch, with a **text-style layer** on top (`ui/*`, `ui/bolder/*`, `header/*`, `body/*`) binding the semantic vars. Primitives are the true single source of truth. Two things are deliberately **out of scope**:

- **Colour.** The colour collection's variable structure and state-naming live in a separate track (#4742 / #4744) and will get **their own ADR**. This document does not decide the colour collection; the typography/spacing structure here does not depend on the colour outcome.
- **The code / output layer** (Tokens Studio export, build pipeline, CSS + TS shape) — still firming, to be captured in its own ADR once the first export cycle has run.

This is a foundational sub-task of the colour & token epic (#4740): typography/spacing/corner-radius (#5107) and density (#4743) build on the shape defined here. The type scale and primitive value layer are the foundation this structure sits on.

## Decision — Figma variable structure

Three layers with a single, downward reference direction, plus a Figma text-style layer on top. The **semantic layer is mode-free and is the only layer consumers — design _and_ code — touch**; all mode behaviour lives in the mode-bearing _mapping_ collections beneath it, which are hidden from publishing. This supersedes the earlier two-layer draft in which the mode-bearing `Density` collection was itself the "semantic" layer consumed directly. Decided in the 1 Jul 2026 Marco Krenn session: a consumption layer must be **mode-independent**, or restructuring it forces consumer refactors and it cannot participate cleanly in both the density and colour mode axes at once (the colour layer already works this way).

```
  ┌─────────────────────────────────────────────────────────────────┐
  │ Figma text-style layer   (header/* · ui/* · body/* + bolder)      │
  │   bind SEMANTIC font-size · line-height · family · weight          │
  └───────────────┬───────────────────────────────────────────────────┘
                  │ one-way ▼
  ┌───────────────┴───────────────────────────────────────────────────┐
  │ SEMANTIC  (single "default" mode — MODE-FREE, PUBLISHED)           │
  │   spacing/{none,4xs…3xl}                                           │
  │   corner-radius/{none,rounded,rounded-outer,pill}                  │
  │   typography/{ui,header}/{size}/{font-size,line-height}            │
  │   font-family/{ui,heading} · font-weight/{lighter,normal,bolder}   │
  │   colour/*   (separate track)                                      │
  │   — flat 1:1 aliases, no logic —                                   │
  └───────────────┬───────────────────────────────────────────────────┘
                  │ one-way ▼   (alias into mapping layers)
  ┌───────────────┴───────────────────────────────────────────────────┐
  │ MAPPING (mode-bearing, HIDDEN — never consumed directly)           │
  │   Density  [modes: Compact · Comfortable · Relaxed]                │
  │     density/{spacing,corner-radius,typography}/…   ← step-shift    │
  │   Font     [single mode]   font-family/… · weight/…                │
  │   Colour   [light · dark]  colour/…   (separate track)             │
  └───────────────┬───────────────────────────────────────────────────┘
                  │ one-way ▼   (each group → primitives only)
  ┌───────────────┴───────────────────────────────────────────────────┐
  │ PRIMITIVE (raw values, no modes)                                   │
  │   spacing · type-scale (inter,equinor) · line-height · weight       │
  │   font-family                                                       │
  └─────────────────────────────────────────────────────────────────────┘
```

1. **Three layers, one-way references.** Primitive (raw values) → mapping (mode-bearing) → semantic (mode-free) → text-style/components. No sibling, cross-collection, semantic→semantic, or mapping→mapping references.

2. **The semantic layer is a flat 1:1 alias layer with no logic.** Each semantic token aliases exactly one mapping token (or, for a value that must not vary, a primitive directly). All density step-shifting and colour light/dark resolution happens in the mapping collections and resolves through the mode set on the **consuming surface** — the semantic token itself carries no mode. This is the same mechanic the colour layer already uses.

3. **Semantic is the only published, consumable layer** — together with the text styles. Primitives, Density, Colour, and Font mapping collections are all **hidden from publishing**; nobody consumes a mode-bearing variable directly. Because the whole set (spacing, corner-radius, typography incl. font-size/line-height/weight/family, and colour) is mirrored here, **code consumes every token from one uniform layer** — e.g. `--eds-typography-ui-md-font-size` and `--eds-font-weight-bolder` sit alongside `--eds-spacing-md` and the colour tokens. In Figma, designers still consume typography through **text styles** (the ergonomic object), which bind semantic variables.

4. **Mapping collections (mode-bearing, hidden):**
   - **Density** [`Compact` · `Comfortable` · `Relaxed`] — `density/spacing/*`, `density/corner-radius/*`, `density/typography/{ui,header}/{size}/{font-size,line-height}`. The only density-bearing collection; density is **set once** per surface. It works by **step-shifting** which primitive each token references — `Compact` = one step down, `Comfortable` = base, `Relaxed` = one step up — clamped at the scale ends, applied uniformly to font-size, line-height, spacing, and corner-radius. Its three domain groups never reference each other; each aliases only primitives (e.g. `corner-radius` aliases spacing **primitives**, not `spacing/*`). `Relaxed` is canonical: the 23 Jun two-mode "compact/comfortable" plan was superseded when `Relaxed` (originally the mobile POC density) was reintroduced.
   - **Font** [single mode] — `font-family/{ui,heading}`, `weight/{lighter,normal,bolder}`. Mode-less.
   - **Colour** [`light` · `dark`] — separate track (#4742 / #4744, own ADR); it slots into this same mapping → semantic pattern.

5. **Primitive layer is the single source of truth:** spacing scale, type scale (`inter` + `equinor`), line-height scale, weight scale (300/400/500), and font families. No modes.

6. **Body typography is not a token.** `body/*` text styles reuse the semantic `typography/ui/*` font-size tokens (so body tracks density) and set line-height to a literal **150%**. The rule `body = ui sizes × 1.5` lives at the text-style/CSS layer, not the variable set (#5107). The body set is **`sm` · `md` · `lg`** (decided 1 Jul 2026) — the reading range, with `md` as the default; display sizes get no body style.
   - **The 150% is a readability choice, not a WCAG requirement.** No success criterion mandates a default 1.5 body leading. The one binding rule — **SC 1.4.12 Text Spacing (AA)** — is _override-resilience_: components must not clip or lose functionality when a _user_ forces line-height to 1.5× (and paragraph/letter/word spacing to 2× / 0.12× / 0.16× the font size). That is a component/CSS concern owned by the repad work (#5119) — no token value here satisfies or decides it. (SC 1.4.8's 1.5 leading is Level AAA and merely "mechanism available"; our default happens to align with it.)

7. **Weight is an orthogonal axis composed at the text-style layer — never a per-step typography var.** The semantic `typography/{ui,header}/{size}` groups carry only `font-size` and `line-height`; they are partial by design (the size ramp). Each text style composes semantic vars: `{size ramp} × font-weight/{lighter,normal,bolder} × font-family`.
   - **Header weight varies by step** (`xs`/`sm` → `font-weight/normal`, `md`→`4xl` → `font-weight/bolder`). This variation lives in the **header text-style bindings**, not in tokens — there is no per-step header weight var.
   - **"Bolder" is composition, not a parallel group.** The `ui/bolder/*` text styles are the ui size ramp × `font-weight/bolder`; no separate `ui-bolder` variable group exists, and adding one (or per-step weight vars) is the anti-pattern this rule forbids.

### Naming

- **Primitives:** `primitives/<domain>/<step|key>`. **Spacing** (and corner-radius, which aliases spacing) uses the rem-relative hundredths convention — `name = round(px / 16 × 100)`, ties resolving **down** (`12.5→12`, `37.5→37`); e.g. spacing `100 = 16px`, `25 = 4px`. **The type scale uses a separate 100-step index** — `type-scale/{inter,equinor}/{100…1100}`, where the number is the scale step (not a px-derived name) and values are rounded to whole px (e.g. `type-scale/inter/500 = 16px`, the base).
- **Mapping layers are namespaced by where they live** — `density/…`, `font/…`, `colour/…` — so a reference makes its source (and whether it's density-dependent) obvious.
- **Semantic:** `<domain>/<tier>`, **lowercase and hyphenated** everywhere (`4xs…3xl`, `rounded-outer`), so names map cleanly to both CSS custom properties and nested TS keys.
- The primitive line-height group is `line-height`, one `default` value per step (no `squished`). `corner-radius/pill` is a raw literal (`999`) — there is no `primitives/radius/*` group; the other `corner-radius/*` tiers alias spacing primitives.

## Code: token output & pipeline — out of scope (separate ADR)

The code / output layer — Tokens Studio export (equinor/design-system-internal#158), build pipeline (#5108), and the CSS + TypeScript output shape — consumes the Figma variable structure above but is **not decided here**. The direction is still firming (Tokens Studio exploration #4800; Marco Krenn sessions), and recording it now would overstate its maturity. It will be captured in its own ADR once the first CSS/TS export cycle has run. One ownership boundary is already clear and worth stating: **design owns the Figma variable structure (primitive + semantic) and the text-style layer; code / Tokens Studio owns the export, the build pipeline, and the ratio-based values that are deliberately not variables** (notably body `1.5` leading).

## Related decisions this structure assumes

These were settled in the 23 Jun decision meeting and 25 Jun sync and shape the variable set, even though they are tracked in sibling issues rather than decided here:

- **Text-trim is removed.** Line-height stops being distorted by text-trim; this removes a variable type and shifts component padding (the "repad" work in #5119). It also unblocks web and mobile sharing one typography set (#5123).
- **Colour is a separate track.** The colour collection's shape and state-naming rework (#4742 / #4744) are decided outside this ADR; the typography/spacing structure here does not depend on the colour outcome.
- **CSS utility classes** (e.g. a `text-xs` utility) are a **post-v1 nice-to-have**, not part of the initial output.
- **Release strategy: beta-first, stable not this year.** Tokens ship into a beta under the current beta naming (not "3.0 beta") and iterate; the stable major follows once verified against components.
- **Consumer migration is still an open risk** (#5121 spike) — the architecture is settled, the migration path for existing UI-kit consumers is not.

## Consequences

- **Code consumes one uniform semantic surface.** Spacing, corner-radius, full typography (size / line-height / weight / family), and colour all export from the same published layer; type tokens are directly consumable by dev, not locked behind Figma text styles.
- **Duplication is intentional.** Every consumable token exists once in a mapping collection and once as a semantic alias — "stupid routing" that buys refactor-safety and a clean publish boundary.
- **Open risk — Tokens Studio → Figma sync not yet proven.** The model relies on a mode-free semantic token aliasing a mode-bearing collection surviving the sync from Tokens Studio (canonical) into Figma variables without producing orphaned / `?` states. Marco flagged such states in cross-_file_ setups; this is single-file cross-_collection_, expected to be safe.
- The mapping collections have no structural guard against group→group references; the one-way / primitives-only rule is upheld by review and ideally a pipeline lint.
- Establishes the shared mental model the rest of #4740 builds on.

## References

- Epic — _Refine the EDS Colour & Token System_ (#4740)
- This ADR's issue — _Define the Token Variable Architecture_ (#4963)
- Tokens Studio — _Equinor Design System_ project (canonical source of truth): `primitives/default` (primitive), `density/{compact,comfortable,relaxed}` + `font/default` (mapping), and the mode-free `semantic/default` set. Figma variables and text styles are synced from here (_EDS Redefined Foundation_, `mZ7SefYcGCfiT1XYbaEbi7`).
- Marco Krenn session (1 Jul 2026) — mode-free semantic layer decision
- ADR 0005 — Typography approach for EDS 2.0
- Typography/spacing/corner-radius redefinition (#5107); density rename (#4743)
- Colour (out of scope) — colour token values (#4742), state-naming (#4744) — separate track, own ADR to follow
- Code output & pipeline — Tokens Studio (equinor/design-system-internal#158), pipeline rebuild (#5108) — to be captured in a separate ADR
