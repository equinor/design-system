# @equinor/eds-tokens

Design tokens package — CSS variables, JSON, and JS/TS outputs consumed by EDS components and product teams.

## Build Pipeline (3 steps)

```
1. Figma → JSON         (pnpm run update-tokens)
        OR
   Config → JSON        (pnpm run generate:tokens:all-color)

2. JSON → CSS/JS        (pnpm run build:variables:color)

3. CSS → Bundle+Inject  (pnpm run _build:css)
   a. Copy index-variables.css to build/css/
   b. lightningcss bundles @imports → variables.css
   c. Elevation build injects --eds-elevation-* into variables.css :root
   d. build-dark-scope rewrites light-dark() into explicit
      [data-color-scheme="light"|"dark"] scope rules + a
      prefers-color-scheme media fallback (immune to downstream
      lightningcss polyfilling — see Pitfalls)
   e. lightningcss minifies variables.css → variables.min.css
   f. assertion check: variables.min.css must NOT contain light-dark(
      or --lightningcss-* polyfill markers
```

**Or all at once:** `pnpm run build:variables` (clean + typography + spacing + color + elevation + bundle)

### Step 1: Get token JSON files

**Option A — Sync from Figma** (requires `.env` with `PERSONAL_ACCESS_TOKEN` in `eds-tokens-sync/bin/`):
```bash
pnpm run update-tokens              # All tokens
pnpm run update-tokens:foundations   # Foundation palette + color scheme
pnpm run update-tokens:color-static # Static semantic + concept
pnpm run update-tokens:color-dynamic # Dynamic appearance + concept
```

**Option B — Generate from config** (no Figma access needed):
```bash
pnpm run generate:tokens:all-color  # All color tokens
pnpm run generate:tokens:static     # Color scheme + semantic + concept
pnpm run generate:tokens:dynamic    # Color scheme + appearance + concept
```

Both write to the same `tokens/` directory. They must stay in sync.

### Step 2: Compile to CSS/JS/JSON

```bash
pnpm run build:variables:color  # Compiles all color tokens
```

Outputs go to `build/css/color/`, `build/js/color/`, `build/json/color/`, `build/ts/color/`.

### Step 3: Bundle into final output

```bash
pnpm run _build:css
```

Bundles `@import`s from `src/css/index-variables.css` into `variables.css`, injects elevation tokens into the `:root` block, then minifies into `variables.min.css`. **The minified file is what consumers import.**

Note: The minify step reads from the already-bundled `variables.css` (not from `index-variables.css`), so any post-bundle injections are preserved.

## Pitfalls

### Why `light-dark()` is removed from published CSS
The transform in `eds-tokens-build` emits `light-dark(L, D)` in source CSS. After lightningcss bundles, the `build-dark-scope` step rewrites these into explicit `[data-color-scheme="light"|"dark"]` rules with a `prefers-color-scheme` media fallback. Reason: Vite 8 (Rolldown) and other downstream bundlers run their own lightningcss pass; without explicit `targets`, that pass polyfills `light-dark()` into a `var(--lightningcss-light, …)` pattern that resolves at the `:root` declaration site and breaks subtree-scoped dark mode. Emitting explicit scope rules instead means there is no `light-dark()` for downstream tools to polyfill incorrectly. The build asserts the final output contains no `light-dark(` literals.

### Missing step 3
Running only `build:variables:color` compiles individual CSS files but does NOT update `variables.min.css`. Tokens will exist in `build/css/color/*/` but not reach the browser. Always run `_build:css` after.

### Generate scripts overwrite Figma sync
The generate scripts write to the **same files** as the Figma sync. If you add tokens via Figma sync, you must also update the generate scripts and `token-config.json`, otherwise running `generate:tokens:all-color` will silently remove the new tokens.

### Build output is git-tracked
The `build/` directory is in `.gitignore` but files are tracked. Use `git add -f` when staging build output changes.

### Generate scripts run from compiled dist
The generate scripts in `eds-tokens-build` run from `dist/`, not `src/`. After editing a generate script, you must rebuild `eds-tokens-build` first:
```bash
cd ../eds-tokens-build && pnpm run build
```

## Key Files

- `token-config.json` — Drives generate scripts: color scheme mappings, concept color groups, Figma file IDs
- `src/css/index-variables.css` — Entry point for the CSS bundle (step 3)
- `tokens/{figmaFileKey}/` — Synced/generated JSON token files
- `build/css/variables.min.css` — Final bundled output consumers import

## Token Structure

### Color

- **Color scheme** (`🌗 Color Scheme.*.json`) — Foundation palette → semantic mapping (Accent→Moss Green, Neutral→Gray) + concept tokens (bg-disabled, bg-floating, etc.)
- **Semantic** (`Semantic.Mode 1.json`) — Per-intent tokens: Bg/Border/Text × Canvas/Surface/Fill/Subtle/Medium/Strong
- **Appearance** (`🎨 Appearance.*.json`) — Generic slot tokens per semantic intent, used with `[data-color-appearance]`
- **Concept** (`Concept.Mode 1.json`) — Cross-cutting tokens that reference color scheme (bg-floating, border-focus, bg-disabled, etc.)

### Typography

Five independent axes, each controlled by a `data-*` attribute:

- **Font family** (`🅰️ Font family.*.json`) — `data-font-family`: `header`, `ui`
- **Font size** (`🅰️ Font size.*.json`) — `data-font-size`: `xs`–`6xl` (also sets icon-size and gap)
- **Font weight** (`🅰️ Font weight.*.json`) — `data-font-weight`: `lighter`, `normal`, `bolder`
- **Line height** (`🅰️ Line height.*.json`) — `data-line-height`: `default`, `squished`
- **Tracking** (`🅰️ Tracking.*.json`) — `data-tracking`: `tight`, `normal`, `wide`, `loose`

Output: `build/css/typography/` (CSS, all five axes) and `build/ts/typography/` (TypeScript: `font-family-{ui,header}.ts` only — two self-contained matrices, one per family).

#### Why TS output is minimal

Style Dictionary cannot represent runtime mode switching (which is what `data-*` cascade gives the CSS output). A TS file for `tracking-wide`, `font-weight-normal`, `line-height-default`, or any single `font-size-md` row would have to bake one cell from the size × family matrix and silently be wrong for any other combination. The build therefore emits TS only for the two family matrices.

Each emitted file is shaped so consumers can read all five axes off a single size cell:

```ts
typography.fontFamilySize.md = {
  fontSize: 14,
  tracking:   { tight, normal, wide },
  fontWeight: { lighter, normal, bolder },
  lineHeight: { default, squished },
  iconSize: 20,         // family-independent, spliced in at build time
  gapHorizontal: 8.5,
  gapVertical: 8.5,
}
```

The nested axes are produced via `splitLeafPrefixes` on the `typescriptNestedFormat` (declared in `eds-tokens-build`). Source JSON encodes axis variants as hyphenated leaves (`font-weight-lighter`); the format splits those into two segments before nesting. CSS output is unaffected — its format uses the unsplit path for variable naming.

Variant names are derivable directly from the data:

```ts
type Weight = keyof typeof ui.fontFamilySize.md.fontWeight // 'lighter' | 'normal' | 'bolder'
```

Figma remains the single source of truth — when a Figma sync regenerates the family files, consumer types track automatically.

#### Build-time splicing of size extras

`createSpacingAndTypographyVariables.ts` runs the per-size font-size builds with `rootName`/`tsBuildPath` set, which produces 10 temporary `font-size-{xs..6xl}.ts` files. A post-step parses each for `iconSize`/`gapHorizontal`/`gapVertical` (Style Dictionary emits them with already-resolved numeric values), injects the three values into the corresponding size cell of `font-family-{ui,header}.ts`, and deletes the temporary per-size files. The injection uses a line-anchored regex over content this same script just emitted, and throws if a size cell can't be located — failures are loud rather than silent. This pragmatic choice avoids the awkwardness of cross-source aggregation in Style Dictionary's resolved-value APIs.

#### Build-order dependency

The smoke test in `src/__tests__/typography-shape.test.ts` imports from `build/ts/typography/`, so those files must exist before `pnpm run test` runs. They are committed to git (build/ is gitignored but tracked), so a fresh `pnpm install && pnpm run build` works. But `pnpm run clean` (which is `rimraf build`) removes them — after a clean, you must run `pnpm run build:variables` before `test` will succeed.

### Elevation

Two shadow levels for floating UI, synced from Figma Foundations (`Elevation` collection) and composed into `box-shadow` values during the build:

- `--eds-elevation-low` — Tooltips, menus, popovers, autocomplete lists, snackbars
- `--eds-elevation-high` — Dialogs, modals, drawers

Each level is a two-layer shadow (key + ambient) stored as decomposed primitives in Figma (offset, blur, spread, color). The build script (`build-elevation-variables` from `eds-tokens-build`) reads `Elevation.Mode 1.json` and composes them into single `box-shadow` CSS custom properties. The individual primitives are **not** exposed as CSS variables.

Elevation tokens are **not** imported via `index-variables.css` — they are injected directly into the bundled `variables.css` `:root` block during `_build:css` (step 3c). This avoids creating a duplicate `:root` selector. The minify step then reads from the injected `variables.css`.

```bash
pnpm run build:variables:elevation  # Compose elevation CSS + inject into variables.css
```

Output:
- CSS: `build/css/elevation/elevation.css` (bare properties, for reference)
- CSS: Injected into `build/css/variables.css` `:root` block
- TypeScript: `build/ts/elevation/elevation.ts` (structured object with `boxShadow` string + per-layer React Native shadow properties)
