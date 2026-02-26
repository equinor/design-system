# Step 4: The Full Pipeline

> What `pnpm run build:variables` actually does, step by step, and how the final output reaches consumers.

---

## The one command to rule them all

```bash
pnpm run build:variables
```

This single command runs the **entire pipeline** — from token JSON files to the final bundled CSS and compiled JS/TS. Let's trace exactly what happens.

---

## The complete sequence

Here's the exact order of operations, matching the npm scripts:

```
pnpm run build:variables
    │
    ├── 1. clean
    │       Delete the entire build/ directory (fresh start)
    │
    ├── 2. build:variables:typography-and-spacing
    │   │
    │   ├── 2a. _prebuild:variables:typography-and-spacing
    │   │       Compile createSpacingAndTypographyVariables.ts with Vite
    │   │       → Output: build-generate-variables/generate-variables.js
    │   │
    │   └── 2b. node ./build-generate-variables/generate-variables.js
    │           Run the compiled script, which:
    │           - Reads ~80 typography/spacing token files
    │           - Runs Style Dictionary for each mode
    │           - Writes CSS to build/css/typography/ and build/css/spacing/
    │           - Writes TS to build/ts/typography/ and build/ts/spacing/
    │
    ├── 3. build:variables:color
    │   │
    │   ├── 3a. build-color-scheme-variables
    │   │       Reads foundation palette + color scheme JSON
    │   │       Builds light + dark CSS, merges with light-dark()
    │   │       → build/css/color/color-scheme/
    │   │       → build/js/color/color-scheme/
    │   │       → build/json/color/color-scheme/
    │   │       → build/ts/color/color-scheme/
    │   │
    │   ├── 3b. build-semantic-static-variables
    │   │       Reads semantic tokens + color scheme
    │   │       Builds static semantic CSS/JS/JSON/TS
    │   │       → build/css/color/static/
    │   │       → build/js/color/static/
    │   │       → build/json/color/static/
    │   │       → build/ts/color/static/
    │   │
    │   └── 3c. build-semantic-dynamic-variables
    │           Reads appearance tokens + concept tokens
    │           Builds dynamic appearance CSS/JS/JSON
    │           → build/css/color/dynamic/
    │           → build/js/color/dynamic/
    │           → build/json/color/dynamic/
    │
    └── 4. _build:css
        │
        ├── 4a. _prebuild:css-copy-index
        │       Copy src/css/*.css (including index-variables.css) to build/css/
        │
        ├── 4b. _build:css:variables
        │       lightningcss --bundle build/css/index-variables.css
        │       Inlines ALL @import statements into one file
        │       → build/css/variables.css
        │
        └── 4c. _build:css-min-variables
                lightningcss --minify build/css/variables.css
                → build/css/variables.min.css  ✨ THE FINAL OUTPUT ✨
```

---

## Step 4 in detail: the CSS bundling

This is the step that's most often missed or misunderstood.

### The index file

`src/css/index-variables.css` is the **entry point** for the CSS bundle. It contains `@import` statements for every generated CSS file:

```css
/* Color tokens */
@import './color/color-scheme/light-dark-color-scheme-trimmed.css';
@import './color/static/variables-trimmed.css';
@import './color/dynamic/variables-trimmed.css';

/* Typography tokens (all axes, all modes) */
@import './typography/font-family-header.css';
@import './typography/font-family-ui.css';
@import './typography/font-size-xs.css';
@import './typography/font-size-sm.css';
@import './typography/font-size-md.css';
/* ... many more ... */

/* Spacing tokens */
@import './spacing/density-spacious.css';
@import './spacing/density-comfortable.css';
/* ... many more ... */

/* Base typography styles */
@import './typography.css';
```

### What lightningcss does

[lightningcss](https://lightningcss.dev/) is a fast CSS tool. The `--bundle` flag resolves all `@import` statements and inlines them into a single file. Then `--minify` compresses it.

The result is `build/css/variables.min.css` — **one file** containing every single CSS custom property for the entire design system.

### Why this matters

If you run `build:variables:color` but forget to run `_build:css` afterward, your new tokens will exist as individual CSS files in `build/css/color/` but they won't be in `variables.min.css`. Since consumers import `variables.min.css`, they won't see the changes.

**Always finish with `_build:css`** — or just use `build:variables` which includes it automatically.

---

## What consumers actually import

### CSS (the primary way)

```css
@import '@equinor/eds-tokens/css/variables';
```

This imports `build/css/variables.min.css` — the bundled file with all tokens.

Then in your HTML, you control which modes are active via data attributes:

```html
<html data-color-scheme="light"
      data-font-family="ui"
      data-font-size="md"
      data-font-weight="normal"
      data-line-height="default"
      data-tracking="normal"
      data-density="spacious"
      data-space-proportions="squared">
```

And use the tokens in your CSS:

```css
.my-card {
  background: var(--eds-color-bg-neutral-surface);
  color: var(--eds-color-text-neutral-strong);
  padding: var(--eds-spacing-vertical) var(--eds-spacing-horizontal);
  font-size: var(--eds-typography-font-size);
}
```

### TypeScript (for type-safe access)

```typescript
import { color } from '@equinor/eds-tokens/ts/color/static'

// Fully typed, autocomplete works
color.bg.neutral.canvas      // string literal type
color.text.accent.strong     // string literal type
```

### JavaScript (for runtime access)

```javascript
const { EDS_COLOR_BG_NEUTRAL_CANVAS } = require('@equinor/eds-tokens/js/color/color-scheme')
```

### JSON (for tooling or other platforms)

```javascript
// Flat format
import tokens from '@equinor/eds-tokens/json/color/color-scheme/flat/light.json'
// { "eds-color-accent-1": "#eaf8fa", ... }

// Nested format
import tokens from '@equinor/eds-tokens/json/color/color-scheme/nested/light.json'
// { eds: { color: { accent: { 1: "#eaf8fa" } } } }
```

### Legacy JS/TS tokens

```typescript
import { tokens } from '@equinor/eds-tokens'
// Exports colors, typography, spacings, elevation, shape
// These are the older, hand-maintained token objects
```

---

## The legacy build (Rollup)

Separate from the Style Dictionary pipeline, there's a **Rollup build** that compiles the hand-maintained token objects in `src/base/`:

```
src/base/
├── colors.ts        ← Color token objects
├── typography.ts    ← Typography objects
├── spacings.ts      ← Spacing objects
├── interactions.ts  ← Focus/hover/pressed states
├── elevation.ts     ← Shadow tokens
├── shape.ts         ← Border radius tokens
└── json/            ← Source JSON for the above
```

Rollup compiles these into:
- `dist/tokens.cjs` (CommonJS)
- `dist/esm/index.mjs` (ES Module)

These are the tokens you get from `import { tokens } from '@equinor/eds-tokens'`. They're a simpler, older format that predates the Style Dictionary pipeline. Both systems coexist in the package.

---

## Common workflows

### "I changed a color in token-config.json"

```bash
cd packages/eds-tokens

# Regenerate the token JSON files
pnpm run generate:tokens:all-color

# Build the CSS/JS/TS/JSON output
pnpm run build:variables:color

# Bundle into the final CSS
pnpm run _build:css
```

Or all at once:

```bash
pnpm run generate:tokens:all-color && pnpm run build:variables
```

### "I edited a build script in eds-tokens-build"

```bash
# First, recompile the build tools
cd packages/eds-tokens-build
pnpm run build

# Then, run the build from eds-tokens
cd ../eds-tokens
pnpm run build:variables
```

### "I pulled fresh tokens from Figma"

```bash
cd packages/eds-tokens

# Pull from Figma
pnpm run update-tokens

# Rebuild everything
pnpm run build:variables
```

### "I want to do a complete clean rebuild"

```bash
cd packages/eds-tokens
pnpm run build:variables    # This already cleans build/ first
```

---

## The build/ directory and git

Here's a quirk: the `build/` directory is in `.gitignore`, but individual files inside it are **git-tracked**. This means:

- `git status` won't show new files in `build/` automatically
- You need to use `git add -f` to stage changes in `build/`
- Build output changes should be committed alongside source changes

This is intentional — consumers need the built files in the npm package, and they're checked in so CI doesn't need to rebuild them.

---

## Quick reference: all the scripts

### From eds-tokens:

| Script | What it does |
|--------|-------------|
| `build:variables` | Full pipeline: clean + typography + spacing + color + CSS bundle |
| `build:variables:color` | Just the 3 color build scripts |
| `build:variables:typography-and-spacing` | Just typography + spacing |
| `_build:css` | Bundle all CSS into variables.min.css |
| `generate:tokens:all-color` | Regenerate all color token JSON from config |
| `update-tokens` | Pull all tokens from Figma |
| `update-figma` | Push all tokens to Figma |

### From eds-tokens-build:

| Script | What it does |
|--------|-------------|
| `build` | Compile the package (tsc + vite) — **do this after editing source** |
| `test` | Run tests (vitest) |

### From eds-tokens-sync:

| Script | What it does |
|--------|-------------|
| `build` | Compile the package (tsc + vite) |

---

## Summary: the mental model

```
┌─────────────────────────────────────────────────────────────┐
│                     FIGMA (design tool)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ sync-figma-to-tokens
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              tokens/{fileKey}/*.json                         │
│              (or generate from token-config.json)            │
└──────────────────────────┬──────────────────────────────────┘
                           │ Style Dictionary + custom transforms
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              build/css/  build/js/  build/ts/  build/json/  │
│              (individual output files)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ lightningcss bundle + minify
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              build/css/variables.min.css                      │
│              (the one file consumers import)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ published as @equinor/eds-tokens
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Your app:                                        │
│              @import '@equinor/eds-tokens/css/variables'      │
│              var(--eds-color-bg-accent-canvas)                │
└─────────────────────────────────────────────────────────────┘
```

That's the complete pipeline — from Figma to your browser.

---

**Back to the beginning:** [00-intro.md](./00-intro.md) — Overview of all three packages.
