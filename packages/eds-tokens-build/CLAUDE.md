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
| `build-color-scheme-variables` | Color scheme JSON | `build/css/color/color-scheme/`, JS, JSON |
| `build-semantic-static-variables` | Semantic + color scheme JSON | `build/css/color/static/`, JS, JSON |
| `build-semantic-dynamic-variables` | Appearance JSON | `build/css/color/dynamic/`, JS, JSON |

## Key Source Files

- `src/scripts/generate-*.ts` — Token generation scripts
- `src/scripts/build-*.ts` — CSS/JS compilation scripts
- `src/scripts/utils.ts` — Shared utilities (`buildToken`, `varName`, `loadTokenConfig`, etc.)

## Testing

```bash
pnpm run test      # vitest watch
pnpm run test:run  # vitest single run
```
