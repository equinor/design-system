# @equinor/eds-tokens

Design tokens package — CSS variables, JSON, and JS/TS outputs consumed by EDS components and product teams.

## Build Pipeline (3 steps)

```
1. Figma → JSON       (pnpm run update-tokens)
        OR
   Config → JSON      (pnpm run generate:tokens:all-color)

2. JSON → CSS/JS      (pnpm run build:variables:color)

3. CSS → Bundle       (pnpm run _build:css)
```

**Or all at once:** `pnpm run build:variables` (clean + typography + spacing + color + bundle)

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

Bundles all `@import`s from `src/css/index-variables.css` into `build/css/variables.min.css` using lightningcss. **This is the file consumers import.**

## Pitfalls

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

Output: `build/css/typography/` (CSS) and `build/ts/typography/` (TypeScript nested objects)
