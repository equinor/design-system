# Step 3: Style Dictionary Build

> How JSON token files get transformed into CSS custom properties, JavaScript objects, TypeScript types, and JSON outputs.

---

## What is Style Dictionary?

[Style Dictionary](https://amzn.github.io/style-dictionary/) is an open-source tool by Amazon that transforms design tokens from one format to another. Think of it like a compiler for design tokens:

```
Input:  JSON token files (from Figma sync or generate scripts)
    │
    │   Style Dictionary processes them with:
    │   • Transforms (modify values, e.g. px → rem)
    │   • Formats (output structure, e.g. CSS variables, TS objects)
    │   • Filters (include/exclude certain tokens)
    │
    ▼
Output: CSS, JavaScript, TypeScript, JSON files
```

EDS uses **Style Dictionary v5.3.0** with several custom transforms and formats built in `eds-tokens-build`.

---

## The build scripts

There are **3 color build scripts** that handle different parts of the color system, plus a **typography/spacing build** that's handled differently.

### Color builds (in eds-tokens-build)

| Script | Input | What it produces |
|--------|-------|-----------------|
| `build-color-scheme-variables` | Color scheme JSON + Foundation palette | CSS with `light-dark()`, JS, JSON, TS |
| `build-semantic-static-variables` | Semantic JSON + Color scheme | CSS, JS, JSON, TS for static semantic tokens |
| `build-semantic-dynamic-variables` | Appearance JSON + Concept JSON | CSS, JS, JSON for dynamic appearance tokens |

### Typography & spacing build (in eds-tokens)

The typography and spacing build lives in `eds-tokens` itself, in a file called `createSpacingAndTypographyVariables.ts`. It also uses Style Dictionary but with its own configuration.

---

## How a build script works (let's trace one)

Let's follow `build-color-scheme-variables` step by step. This is the simplest one to understand.

### Step 1: Load the token files

```typescript
// It reads the foundation palette and color scheme files:
const lightFoundation = 'tokens/GnovDpL3.../Color Light.Mode 1.json'
const darkFoundation  = 'tokens/GnovDpL3.../Color Dark.Mode 1.json'
const lightScheme     = 'tokens/GnovDpL3.../🌗 Color scheme.Light.json'
const darkScheme      = 'tokens/GnovDpL3.../🌗 Color scheme.Dark.json'
```

### Step 2: Configure Style Dictionary

```typescript
// The _extend() helper creates a Style Dictionary instance with:
_extend({
  source: [lightScheme],           // Token files to process
  include: [lightFoundation],      // Additional files for reference resolution
  buildPath: 'color/color-scheme/',
  prefix: 'eds-color',             // CSS variable prefix
  selector: '[data-color-scheme="light"]',  // CSS selector to wrap in
  outputReferences: false,         // Resolve references to actual values
  rootName: 'colorScheme',         // Name for TypeScript export
})
```

### Step 3: Style Dictionary processes the tokens

For each token, it:

1. **Resolves references** — `"{Neutral.1}"` becomes the actual hex value
2. **Applies transforms** — Converts values based on rules
3. **Filters** — Includes/excludes tokens based on path

### Step 4: Outputs to multiple formats

The `_extend()` helper configures **4 output platforms** simultaneously:

```
build/
├── css/color/color-scheme/
│   └── light-color-scheme-trimmed.css     ← CSS custom properties
├── js/color/color-scheme/
│   ├── light-color-scheme.js              ← JavaScript ES6 exports
│   └── light-color-scheme.d.ts            ← TypeScript declarations
├── json/color/color-scheme/
│   ├── flat/light-color-scheme.json       ← Flat key-value JSON
│   └── nested/light-color-scheme.json     ← Nested object JSON
└── ts/color/color-scheme/
    └── light-color-scheme.ts              ← Nested TypeScript objects
```

### Step 5: Merge light + dark with light-dark()

After building light and dark separately, the script merges them using `mergeLightDarkFoundation()`:

```css
/* Before merge (two separate files): */

/* light: */  --eds-color-accent-1: #eaf8fa;
/* dark:  */  --eds-color-accent-1: #002c33;

/* After merge (one file): */
:root {
  --eds-color-accent-1: light-dark(#eaf8fa, #002c33);
}
```

The CSS `light-dark()` function automatically picks the right value based on the user's color scheme preference!

---

## The _extend() helper (the core utility)

Almost all build scripts use the `_extend()` function from `eds-tokens-build/src/utils/index.ts`. It's the main interface for configuring Style Dictionary. Here's what it does:

```typescript
_extend({
  source: [...],        // Token JSON files to compile
  include: [...],       // Additional files for resolving references
  fileName: 'output',   // Base name for output files
  buildPath: 'color/',  // Subdirectory under build/
  prefix: 'eds-color',  // CSS variable prefix (--eds-color-*)
  selector: ':root',    // CSS selector to wrap variables in
  filter: (token) => boolean,     // Which tokens to include
  outputReferences: true/false,   // Keep refs as var() or resolve to values
  transforms: [...],    // Custom transform names to apply
  rootName: 'color',    // Export name for TypeScript nested format
})
```

It creates a `new StyleDictionary({...})` with 4 platforms configured:

| Platform | Output format | Example output |
|----------|--------------|----------------|
| `css` | `css/variables` | `--eds-color-bg-accent-canvas: #eaf8fa;` |
| `ts` | `javascript/es6` + `typescript/es6-declarations` | `export const EDS_COLOR_BG_ACCENT_CANVAS = "#eaf8fa";` |
| `json` | `json/flat` + `json/nested` | `{ "eds-color-bg-accent-canvas": "#eaf8fa" }` |
| `tsNested` | Custom `typescript/nested` | `export const color = { bg: { accent: { canvas: "#eaf8fa" } } } as const` |

The `tsNested` platform is only added when `rootName` is provided.

---

## Custom transforms

Transforms modify token values during the build. EDS has several custom ones:

### `lightDark` — CSS light-dark() function

Used for foundation palette tokens that have both light and dark variants.

```
Input:  token with light: "#eaf8fa" and dark: "#002c33"
Output: "light-dark(#eaf8fa, #002c33)"
```

This lets a single CSS variable work in both color schemes.

### `pxToRem` — Pixel to rem conversion

Converts numeric pixel values to rem units (using 16px base).

```
Input:  16 (a font-size token)
Output: "1rem"

Input:  20 (a line-height token)
Output: "1.25rem"
```

Only applies to tokens whose names include: `font`, `size`, `line-height`, `sizing`, or `spacing`.

### `fontQuote` — Font family quoting

Wraps font family names in double quotes for CSS compatibility.

```
Input:  Equinor
Output: "Equinor"
```

### `pxFormatted` — Formatted pixel values

For tracking (letter-spacing) tokens that need px output with proper decimal handling.

```
Input:  0.5
Output: "0.5px"

Input:  0
Output: "0px"
```

### `pxTransform` — Generic pixel transform

For all other numeric tokens, converts to px format.

```
Input:  24
Output: "24px"
```

---

## Custom format: typescriptNestedFormat

This is the most important custom format. It converts flat tokens into **nested TypeScript objects** with camelCase keys.

### What it does

```
Input tokens (flat):
  Bg/Neutral/Canvas = "#ffffff"
  Bg/Neutral/Surface = "#f7f7f7"
  Bg/Accent/Fill Emphasis/Default = "#007079"

Output TypeScript (nested):
  export const color = {
    bg: {
      neutral: {
        canvas: "#ffffff",
        surface: "#f7f7f7",
      },
      accent: {
        fillEmphasis: {
          default: "#007079",
        },
      },
    },
  } as const
```

### Why it matters

This gives consumers **type-safe access** to tokens:

```typescript
import { color } from '@equinor/eds-tokens/ts/color/static'

// Type-safe, autocomplete works!
color.bg.neutral.canvas  // "#ffffff"
color.bg.accent.fillEmphasis.default  // "#007079"
```

The `as const` assertion means TypeScript knows the exact string values, not just `string`.

---

## The filter: includeTokenFilter

Not every token in the JSON files should end up in the output. The `includeTokenFilter` excludes tokens that are:

- **Documentation** — Figma-only labels
- **padding-centred** / **padding-baselined** — Figma layout helpers
- **cap-height** / **cap-rounded** — Font metric internals
- **container** — Internal spacing calculations

These are useful in Figma but meaningless in code.

---

## Typography & spacing build

This works differently from the color builds. Instead of using CLI scripts from `eds-tokens-build`, the typography and spacing build lives directly in `eds-tokens` in a file called `createSpacingAndTypographyVariables.ts`.

### Why is it different?

Typography and spacing tokens have a unique challenge: **each axis produces CSS that targets a different `data-*` attribute selector**. For example:

```css
/* Font size MD */
[data-font-size="md"] {
  --eds-typography-font-size: 1rem;
  --eds-typography-line-height-default: 1.5rem;
}

/* Font size LG */
[data-font-size="lg"] {
  --eds-typography-font-size: 1.125rem;
  --eds-typography-line-height-default: 1.688rem;
}

/* Density Spacious */
[data-density="spacious"] {
  --eds-spacing-base: 0.5rem;
}

/* Density Comfortable */
[data-density="comfortable"] {
  --eds-spacing-base: 0.375rem;
}
```

### The process

1. **Reads all typography/spacing token files** from `tokens/FQQqyumcpPQoiFRCjdS9GM/`
2. **For each mode file** (e.g., `🅰️ Font size.MD.json`), creates a Style Dictionary instance
3. **Applies transforms** — `pxToRem`, `fontQuote`, `pxFormatted`, `includeTokenFilter`
4. **Outputs CSS** with the appropriate `[data-*]` selector
5. **Also outputs TypeScript** using `typescriptNestedFormat` for typed access

Output goes to:

```
build/css/typography/     ← CSS files per axis per mode
build/css/spacing/        ← CSS files per spacing dimension
build/ts/typography/      ← TypeScript nested objects
build/ts/spacing/         ← TypeScript nested objects
```

At runtime, the generated CSS is activated via `data-*` attribute selectors. The `TypographyNext` React component (in `packages/eds-core-react/src/components/Typography/`) is what sets these attributes, connecting the component API to the token-driven CSS output produced here.

---

## Putting it all together: the build output

After all build scripts run, the `build/` directory looks like:

```
build/
├── css/
│   ├── color/
│   │   ├── color-scheme/
│   │   │   ├── light-dark-color-scheme-trimmed.css   ← Foundation palette
│   │   │   ├── light-dark-color-scheme-verbose.css   ← With var() refs
│   │   │   └── ...
│   │   ├── static/
│   │   │   └── variables-trimmed.css                 ← Semantic tokens
│   │   └── dynamic/
│   │       └── variables-trimmed.css                 ← Appearance tokens
│   ├── typography/
│   │   ├── font-size-md.css
│   │   ├── font-size-lg.css
│   │   ├── font-weight-normal.css
│   │   └── ...
│   ├── spacing/
│   │   ├── density-spacious.css
│   │   ├── density-comfortable.css
│   │   └── ...
│   └── variables.min.css   ← THE FINAL BUNDLE (next step!)
│
├── js/color/               ← JavaScript exports
├── json/color/             ← Flat + nested JSON
└── ts/
    ├── color/              ← Nested TypeScript objects
    ├── typography/         ← Nested TypeScript objects
    └── spacing/            ← Nested TypeScript objects
```

---

## Important: eds-tokens-build must be compiled first!

The build scripts in `eds-tokens-build` run from `dist/`, not `src/`. If you edit a script's source code, you **must rebuild** before the changes take effect:

```bash
cd packages/eds-tokens-build
pnpm run build    # tsc && vite build
```

Then go back to `eds-tokens` and run the build:

```bash
cd packages/eds-tokens
pnpm run build:variables:color
```

Forgetting to rebuild `eds-tokens-build` is a common source of "why aren't my changes working?" confusion.

---

## Quick reference

| What you want | Command (from eds-tokens) |
|--------------|--------------------------|
| Build all color variables | `pnpm run build:variables:color` |
| Build typography + spacing | `pnpm run build:variables:typography-and-spacing` |
| Build everything | `pnpm run build:variables` |
| Rebuild eds-tokens-build after edits | `cd ../eds-tokens-build && pnpm run build` |

---

**Next up:** [04-full-pipeline.md](./04-full-pipeline.md) — The complete pipeline from start to finish, and what `pnpm run build:variables` actually does step by step.
