# Use attribute-scoped custom properties, not `light-dark()`, for colour-scheme switching in token CSS

- **Status:** Accepted
- **Date:** 2026-07-20
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

EDS publishes design tokens as CSS custom properties, and colour tokens
carry different values per colour scheme. There are two mainstream ways to
express that in published CSS:

1. **`light-dark(lightValue, darkValue)`** — one declaration per token;
   the browser picks the value from the element's `color-scheme` property.
2. **Attribute-scoped rules** — the token list declared once per scheme,
   under `[data-color-scheme="light"]` and `[data-color-scheme="dark"]`.

The original 2.x token build (from #3447, 2024) emitted `light-dark()`.
In April 2026 this caused a production regression (#4863): consumers
bundling with Vite 8 (Rolldown + lightningcss) re-process the published
CSS, and without explicit `targets` lightningcss polyfills `light-dark()`
into a `var(--lightningcss-light, …)` pattern that resolves at the `:root`
declaration site — silently breaking subtree-scoped dark mode
(`data-color-scheme="dark"` on a wrapper). The fix (#4864) rewrote the
published 2.x output into explicit attribute-scoped rules and added an
assertion (`assert-no-light-dark.mjs`) that no `light-dark(` literal ships.

The Tokens Studio pipeline that produces the 3.0 output emits
attribute-scoped rules by construction — `light-dark()` never appears
(verified: zero occurrences across `src/tokens/`). This ADR records that
as the deliberate, permanent choice rather than an accident of tooling, so
the duplication of dark declarations is not "modernized" back into
`light-dark()` by a future maintainer or code agent.

## Decision Drivers

- Published CSS is re-processed by arbitrary downstream bundlers we do not
  configure; robustness against every pipeline matters more than source
  elegance
- [ADR-0004](./0004-component-conventions-for-eds-2.md): theming is
  attribute-driven (`data-color-scheme`, `data-density`) set once at root
  by the consumer
- One switching mechanism should serve every token axis, not just colour

## Options Considered

### Option 1: `light-dark()`

**Pros:** one declaration per token (no duplicated lists); follows the
`color-scheme` property natively.

**Cons:** proven downstream-polyfill hazard — the #4863 regression class
exists in any consumer bundler that runs lightningcss without targets;
accepts **only `<color>` values**, so density, spacing, and typography
modes need attribute scoping anyway, giving the system two switching
mechanisms; requires managing the `color-scheme` property alongside the
attribute.

### Option 2: `@media (prefers-color-scheme)` only

**Cons (rejected):** hands the scheme choice to the OS instead of the
app; no subtree overrides; contradicts ADR-0004's explicit-attribute
convention.

### Option 3: Attribute-scoped custom properties (chosen)

**Pros:** plain attribute selectors and `var()` chains — baseline CSS no
bundler, minifier, or postcss preset transforms; subtree scoping follows
from custom-property inheritance for free; the same mechanism already
carries density (and every other mode axis); the pattern used by mature
design systems (Primer, Radix Themes, Shoelace, Tailwind's class
strategy).

**Cons:** the token list is duplicated per scheme (generated output, no
maintenance cost; gzip absorbs it); switching requires setting a DOM
attribute rather than being automatic.

## Decision

**Option 3.** Token CSS expresses colour schemes exclusively as
attribute-scoped custom-property blocks. `light-dark()` must not appear in
published CSS — in 2.x it is rewritten away by `build-dark-scope` and
guarded by `assert-no-light-dark.mjs`; in the 3.0 pipeline it is absent by
construction, and the bundle step (ADR-0010) should reuse the same
assertion as a cheap regression guard.

### Consequences

- Good, because the published CSS is robust against any downstream CSS
  pipeline, however configured — the #4863 bug class cannot recur
- Good, because colour scheme, density, and future mode axes all switch
  through one mechanism (ADR-0004)
- Bad, because dark declarations are duplicated per scope in the output —
  accepted as a generated-output cost, invisible after gzip
- Consumers switch schemes by setting the attribute; apps that set it
  client-side only should do so in an inline `<head>` script (or
  server-side) to avoid a light flash before hydration — a setup-docs
  requirement, common to every attribute/class-based theming system
- Revisit only if the `light-dark()` tooling ecosystem matures **and** a
  need appears that attribute scoping cannot cover; neither holds today

## Related

- [ADR-0004](./0004-component-conventions-for-eds-2.md) — the
  attribute-driven theming convention this implements
- ADR-0010 (proposed) — the 3.0 bundled CSS entry that inherits this
  behaviour unchanged
- Issue [#4863](https://github.com/equinor/design-system/issues/4863) /
  PR [#4864](https://github.com/equinor/design-system/pull/4864) — the
  regression and the 2.x rewrite
- `packages/eds-tokens/scripts/assert-no-light-dark.mjs` — the guard
- `packages/eds-tokens-build/src/scripts/build-dark-scope.ts` — the 2.x
  rewrite implementation
