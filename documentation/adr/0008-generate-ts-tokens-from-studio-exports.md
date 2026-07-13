# Generate TypeScript tokens by combining the Tokens Studio DTCG and CSS exports

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

The new Tokens Studio pipeline replaces the legacy Figma-REST + Style Dictionary token build. The platform exports CSS, SCSS, DTCG, Figma, Swift, Android, and Compose — but **no TypeScript format**. `equinor/design-system-mobile` (React Native) consumes TypeScript token modules (semantic colours per colour scheme, typography, spacing per density), so the pipeline must produce a TS surface.

Two platform behaviours constrain the solution:

- The **DTCG export preserves `{alias}` references and unevaluated colour formulas** (`set_chroma(set_lightness(...))`). It is a structural interchange format, not resolved values.
- The **CSS export is the only format that runs the platform's formula engine**, producing concrete `oklch()` values, joined across files by plain `var(--eds-*)` chains.

## Decision Drivers

- No Style Dictionary — the legacy build is being retired
- React Native-compatible values: hex colours (no `oklch()`), unitless numbers
- Must not reimplement the platform's colour formula engine
- Runs unattended in CI (release-triggered, no CI on the resulting PR) — failures must be loud, never silently wrong output
- TS values must be identical to what CSS consumers get

## Options Considered

### Option 1: Style Dictionary on the pulled raw token sets

Keep the legacy tooling, pointed at the Studio-pulled JSON.

**Pros:**

- Familiar tooling, existing formats

**Cons:**

- The raw token sets contain unevaluated colour formulas Style Dictionary cannot compute
- Keeps alive the dependency the new pipeline exists to remove

### Option 2: Resolve the DTCG export in our own codegen

Dereference `{alias}` chains and evaluate formulas locally.

**Pros:**

- Single input, pure DTCG

**Cons:**

- Requires reimplementing Tokens Studio's colour engine (`set_chroma`, `set_lightness`, gaussian scales) — a moving target we would have to keep bug-compatible

### Option 3: Parse the CSS export alone

The CSS output has evaluated values; derive the TS structure from the custom property names.

**Pros:**

- Single input, values already evaluated

**Cons:**

- Flattened kebab-case names make tree reconstruction ambiguous (`corner-radius-rounded-outer` → `cornerRadius.roundedOuter` or `cornerRadius.rounded.outer`?)
- No `$type` metadata to drive value conversion

### Option 4: The platform's resolved-tokens REST API

`GET /api/v1/projects/:id/resolved_tokens` returns computed values.

**Pros:**

- Purpose-built for CI consumption

**Cons:**

- Not exposed through the `studio` CLI — would need separate HTTP client and auth plumbing alongside the existing OIDC CLI flow

## Decision

**Combine both exports** (`scripts/generate-ts-tokens.mjs` in `packages/eds-tokens`, zero dependencies): the DTCG export supplies the token tree and `$type` metadata; for every leaf the script derives the CSS custom property name, dereferences the `var()` chain in the right dimension context (colour scheme × density), and converts values — `oklch()` to hex via CSS Color 4 §13.2 gamut mapping (chroma bisection, verified identical to lightningcss for every colour in the export), `px` to unitless numbers. Modules whose resolved values differ per colour scheme are split into per-scheme files automatically. Unknown `$type`s, broken `var()` chains, and unsupported value syntax fail the build.

This satisfies the drivers: no Style Dictionary, no reimplemented formula engine (the platform evaluates; we only convert), RN-ready values guaranteed identical to the CSS output, and loud failures for the unattended run.

### Consequences

- Good, because token values cannot drift between the CSS and TS outputs — they share one evaluation
- Good, because the script has no dependencies and no coupling to retired tooling
- Good, because per-scheme splitting is data-driven — new divergent dimensions surface automatically
- Bad, because the codegen is pinned to the saved export configurations' shape (file layout, `eds` prefix, kebab casing) — changing those in Studio requires a matching script change
- Bad, because the value parser accepts only today's CSS syntax; new value forms from the platform fail the release run until the converter learns them (intentionally loud, but requires a fix before tokens flow again)
- Bad, because the gamut-mapping code must track the CSS Color 4 algorithm to stay bit-identical with browsers

### Confirmation

The release workflow (`tokens_studio_release.yaml`) runs the script on every Tokens Studio release; any deviation fails the run and alerts via the Slack step. Generated modules were verified with `tsc --noEmit --strict`, Prettier, and a lightningcss cross-check of all colour conversions.

## Related

- [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md) — pipeline documentation
- [ADR-0007](./0007-token-variable-architecture-spacing-typography.md) — token variable architecture (Figma structure)
- Issues [#5164](https://github.com/equinor/design-system/issues/5164), [#5108](https://github.com/equinor/design-system/issues/5108); PR [#5166](https://github.com/equinor/design-system/pull/5166)
