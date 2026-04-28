# @equinor/eds-tokens-build

Build tools and generate scripts for EDS design tokens. Provides CLI binaries consumed by `eds-tokens`.

## Scripts run from compiled dist

All CLI binaries point to `dist/scripts/*.js`. After editing any source file, you **must rebuild** before the changes take effect:

```bash
pnpm run build   # tsc && vite build
```

If you skip this, `eds-tokens` will still run the old compiled version and your changes won't apply.

## Generate Scripts

These generate token JSON files in `eds-tokens/tokens/` from `eds-tokens/token-config.json`:

| Script | Writes | Config key |
|---|---|---|
| `generate-color-scheme-tokens` | `🌗 Color Scheme.{Light,Dark}.json` | `colorSchemeConfig` + `conceptColorGroups` |
| `generate-semantic-tokens` | `Semantic.Mode 1.json` | `colorSchemeConfig` |
| `generate-dynamic-appearance-tokens` | `🎨 Appearance.*.json` | `colorSchemeConfig` |
| `generate-concept-tokens` | `Concept.Mode 1.json` (static + dynamic) | `conceptColorGroups` |

### Adding new tokens

When adding new token categories (like disabled states):

1. Add entries to `token-config.json` (in `eds-tokens`) if they're concept-level (`conceptColorGroups`) or scheme-level (`colorSchemeConfig`)
2. Update the relevant generate script(s) in `src/scripts/`
3. Rebuild this package: `pnpm run build`
4. Run the generate script from `eds-tokens` to verify output matches Figma sync
5. If output differs from Figma only in `codeSyntax.WEB` values, the generated version is likely correct (Figma sometimes assigns wrong WEB variable names)

## Build Scripts

These compile token JSON into CSS/JS/JSON output:

| Script | Input | Output |
|---|---|---|
| `build-color-scheme-variables` | Color scheme JSON | `build/css/color/color-scheme/`, JS, JSON, TS |
| `build-semantic-static-variables` | Semantic + color scheme JSON | `build/css/color/static/`, JS, JSON, TS |
| `build-semantic-dynamic-variables` | Appearance JSON | `build/css/color/dynamic/`, JS, JSON |
| `build-elevation-variables` | Elevation JSON from Foundations | `build/css/elevation/elevation.css`, `build/ts/elevation/elevation.ts` |
| `build-dark-scope` | Bundled `variables.css` | Rewrites in place |

The `build-dark-scope` step runs as part of `_build:css` in `eds-tokens` between `build-elevation-variables` and the final `lightningcss --minify`. It scans the bundled `variables.css` for `--name: light-dark(L, D);` declarations, replaces each with `--name: L;` in place, and appends three new blocks: `[data-color-scheme="light"]` (with light values), `[data-color-scheme="dark"]` (with dark values), and `@media (prefers-color-scheme: dark) :root:not([data-color-scheme="light"])` (with dark values, for system dark mode opt-in). The published `variables.min.css` contains no `light-dark()` literals — this is asserted at build time. See `eds-tokens/CLAUDE.md` for the rationale.

**Regex limitation:** the `light-dark()` argument matcher in `build-dark-scope.ts` allows only one level of nested parens (sufficient for `var(--ref)`). Doubly-nested fallbacks like `var(--a, var(--b))` would not match, and those tokens would silently retain their `light-dark()` form — re-introducing the original polyfill bug. If token values get more complex, update the regex (and tests) accordingly.

The elevation build is different from color builds — it does **not** use Style Dictionary. It reads decomposed shadow primitives (offset, blur, spread, color) from `Elevation.Mode 1.json` and composes them into:
- Two `box-shadow` CSS custom properties (`--eds-elevation-low`, `--eds-elevation-high`) injected into the bundled `variables.css` `:root` block (not via `@import`, to avoid duplicate `:root` selectors)
- A TypeScript export with `boxShadow` string + per-layer React Native shadow properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`)

The individual primitives are not exposed as CSS variables. The elevation build runs inside `_build:css` — after lightningcss bundles but before it minifies — so both `variables.css` and `variables.min.css` contain the elevation tokens.

Typography and spacing builds are handled in `eds-tokens` via `createSpacingAndTypographyVariables.ts`, which also uses the `typescriptNestedFormat` from this package to produce `build/ts/typography/` output.

## Shared Formats

- `typescriptNestedFormat` (`src/format/typescriptNested.ts`) — Custom Style Dictionary format that outputs `export const <rootName> = { ... } as const` with camelCase keys. Used by color build scripts (via the `_extend` utility) and typography builds (via `buildCssDictionary` in `eds-tokens`).

## Key Source Files

- `src/scripts/generate-*.ts` — Token generation scripts
- `src/scripts/build-*.ts` — CSS/JS compilation scripts
- `src/scripts/utils.ts` — Shared utilities (`buildToken`, `varName`, `loadTokenConfig`, etc.)
- `src/format/typescriptNested.ts` — Nested TypeScript output format

## Testing

```bash
pnpm run test      # vitest watch
pnpm run test:run  # vitest single run
```
