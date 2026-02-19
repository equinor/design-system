# Step 1: Figma Sync

> How design tokens travel from Figma into your codebase — and back again.

---

## The idea in plain English

Designers use Figma to define things like colors, font sizes, and spacing values. These aren't just visual — they're stored as **Figma Variables**, which are basically named values like:

- `Moss Green / 1` = `#eaf8fa`
- `Font size / MD` = `16`
- `Density / Spacious / Gap` = `8`

We need these values in our code. That's where `eds-tokens-sync` comes in — it's a bridge between Figma and our codebase. It can:

- **Pull** variables from Figma and save them as JSON files
- **Push** local JSON changes back to Figma

Think of it like `git pull` and `git push`, but for design tokens instead of code.

---

## Before you start: authentication

Figma's API requires a Personal Access Token. Here's how to set it up:

1. Go to Figma → Settings → Personal Access Tokens
2. Create a new token
3. Create a file at `packages/eds-tokens-sync/bin/.env`:

```
PERSONAL_ACCESS_TOKEN=figd_your_token_here
```

There's an `.env.example` file showing the format. The actual `.env` is gitignored, so you'll never accidentally commit your token.

---

## Pulling tokens from Figma

To pull (download) tokens from Figma, you run commands from the `eds-tokens` package (not from eds-tokens-sync):

```bash
# Pull everything from all 5 Figma files:
pnpm run update-tokens

# Or pull specific categories:
pnpm run update-tokens:foundations    # Base colors (palette)
pnpm run update-tokens:color-static  # Semantic + concept colors
pnpm run update-tokens:color-dynamic # Appearance + concept colors
```

### What happens behind the scenes?

Let's trace what `update-tokens` actually does:

```
You run: pnpm run update-tokens
    │
    ▼
Calls: sync-figma-to-tokens --file-key GnovDpL3UV6X51Ot7Kv6Im --token-dir ./tokens
    │
    ▼
The script:
  1. Reads the file key from the command line args
  2. Calls Figma's REST API: GET /v1/files/{fileKey}/variables/local
  3. Figma responds with ALL variable collections and their values
  4. The script converts each collection+mode into a separate JSON file
  5. Writes the files to: tokens/{fileKey}/{CollectionName}.{ModeName}.json
    │
    ▼
Result: A bunch of JSON files appear in your tokens/ directory!
```

---

## Understanding Figma's organization

Before we look at the output, it helps to understand how Figma organizes variables:

### Collections
A **collection** is a group of related variables. Think of it like a folder.
- "Color Light" — all the light mode palette colors
- "🅰️ Font size" — all font size values
- "💎 Density" — spacing density values

### Modes
Each collection can have multiple **modes** — these are variations of the same variables.
- The "Color Light" collection has just one mode: "Mode 1"
- The "🌗 Color scheme" collection has two modes: "Light" and "Dark"
- The "🅰️ Font size" collection has many modes: "XS", "SM", "MD", "LG", etc.

### Variable groups
Within a collection, variables can be organized into **groups** using `/` separators:
- `Bg/Neutral/Canvas` is in the group `Bg > Neutral`
- `Light/Moss Green/1` is in the group `Light > Moss Green`

### How this maps to files

Each collection + mode combination becomes one JSON file:

```
{Collection Name}.{Mode Name}.json
```

Examples:
- `Color Light.Mode 1.json` — "Color Light" collection, its only mode
- `🌗 Color scheme.Light.json` — Color scheme, Light mode
- `🌗 Color scheme.Dark.json` — Color scheme, Dark mode
- `🅰️ Font size.MD.json` — Font size collection, MD mode
- `🅰️ Font size.XL.json` — Font size collection, XL mode
- `💎 Density.Spacious.json` — Density, Spacious mode

The `/` group separators in variable names become **nested JSON keys**.

---

## The 5 Figma files

The EDS design system is split across 5 separate Figma files (each with its own file key). These are defined in `eds-tokens/token-config.json`:

### 1. Foundations (`GnovDpL3UV6X51Ot7Kv6Im`)

The base color palette. Raw hex colors organized by color family and shade number.

Contains:
- `Color Light.Mode 1.json` — Light palette (Moss Green, Gray, Blue, Red, etc.)
- `Color Dark.Mode 1.json` — Dark palette
- `🌗 Color scheme.Light.json` — Maps intents to palette colors (light)
- `🌗 Color scheme.Dark.json` — Maps intents to palette colors (dark)

### 2. Static (`OWxw2XogDLUt1aCvcDFXPw`)

Semantic color tokens that reference the color scheme. These have meaningful names like "background neutral canvas" instead of raw colors.

Contains:
- `Semantic.Mode 1.json` — All semantic color tokens
- `Concept.Mode 1.json` — Cross-cutting tokens (disabled states, focus, links)

### 3. Dynamic (`nyPaQ3QnI1UAcxKW4a0d2c`)

Dynamic appearance tokens used for theming components. When a component has `data-color-appearance="accent"`, these tokens activate.

Contains:
- `🎨 Appearance.Accent.json`
- `🎨 Appearance.Neutral.json`
- `🎨 Appearance.Info.json`
- `🎨 Appearance.Success.json`
- `🎨 Appearance.Warning.json`
- `🎨 Appearance.Danger.json`
- `Concept.Mode 1.json`

### 4. Spacing primitives (`cpNchKjiIM19dPqTxE0fqg`)

The raw spacing scale values.

Contains:
- `👾 Primitives.Value.json` — Base spacing values
- `⛔️ Figma.Value.json` — Figma-only internal values

### 5. Spacing & typography modes (`FQQqyumcpPQoiFRCjdS9GM`)

The biggest file — ~80+ JSON files covering every combination of:
- Density (Spacious, Comfortable)
- Font family, size, weight, line height, tracking
- Horizontal/vertical gaps and spaces
- Space proportions, selectable space, container space

---

## What the JSON files look like

Let's look at some real examples from the codebase.

### Example 1: Foundation palette

**File:** `tokens/GnovDpL3UV6X51Ot7Kv6Im/Color Light.Mode 1.json`

```json
{
  "Light": {
    "Moss Green": {
      "1": {
        "$type": "color",
        "$value": "#eaf8fa",
        "$extensions": {
          "com.figma": {
            "hiddenFromPublishing": false,
            "scopes": ["ALL_SCOPES"],
            "codeSyntax": {}
          }
        }
      },
      "2": {
        "$type": "color",
        "$value": "#f6ffff"
      }
    },
    "Gray": {
      "1": { "$type": "color", "$value": "#f7f7f7" },
      "2": { "$type": "color", "$value": "#ffffff" }
    }
  }
}
```

**What you're seeing:**
- The nesting (`Light > Moss Green > 1`) matches the Figma group structure
- `$type: "color"` tells us this is a color token
- `$value: "#eaf8fa"` is the actual hex color
- `$extensions.com.figma` is Figma metadata (scopes, publishing settings, etc.)

### Example 2: Semantic tokens (with references!)

**File:** `tokens/OWxw2XogDLUt1aCvcDFXPw/Semantic.Mode 1.json`

```json
{
  "Bg": {
    "Neutral": {
      "Canvas": {
        "$type": "color",
        "$value": "{Neutral.1}",
        "$extensions": {
          "com.figma": {
            "codeSyntax": {
              "WEB": "var(--eds-color-bg-neutral-canvas)"
            }
          }
        }
      },
      "Surface": {
        "$type": "color",
        "$value": "{Neutral.2}"
      }
    }
  }
}
```

**The big difference here:** Notice `$value` is `"{Neutral.1}"` instead of a hex color. The curly braces mean it's a **reference** — it points to another token. During the build step (step 3), this reference gets resolved to an actual CSS variable: `var(--eds-color-neutral-1)`.

This is the core idea of the token hierarchy — higher-level tokens **reference** lower-level ones instead of hardcoding values.

### Example 3: Typography

**File:** `tokens/FQQqyumcpPQoiFRCjdS9GM/🅰️ Font size.MD.json`

```json
{
  "typography": {
    "font-size": {
      "$type": "number",
      "$value": "{font-family-size.md.font-size}"
    },
    "line-height-default": {
      "$type": "number",
      "$value": "{font-family-size.md.line-height-default}"
    }
  }
}
```

Typography tokens use `$type: "number"` and reference primitive values. These numbers get converted to `rem` units during the build step.

---

## Pushing tokens back to Figma

When you modify token JSON files locally (or after running generate scripts), you can push them back to Figma:

```bash
pnpm run update-figma
```

This does the reverse process:

1. Reads JSON files from `tokens/{fileKey}/`
2. Flattens nested keys back to Figma variable names:
   - `{ "Bg": { "Neutral": { "Canvas": ... } } }` → `Bg/Neutral/Canvas`
3. Resolves `"{Neutral.1}"` references to Figma variable IDs
4. Compares with what's already in Figma (only sends differences)
5. POSTs to Figma's API to create or update variables

---

## The source code (for the curious)

The sync package lives at `packages/eds-tokens-sync/`. Here's what's inside:

```
eds-tokens-sync/
├── bin/
│   ├── sync-figma-to-tokens.js    ← CLI entry point (thin wrapper)
│   ├── sync-tokens-to-figma.js    ← CLI entry point (thin wrapper)
│   └── .env                        ← Your Figma token (gitignored)
├── src/
│   ├── api/
│   │   └── figma_api.ts            ← Figma REST API client
│   ├── utils/
│   │   ├── token_export.ts         ← Figma response → JSON files
│   │   ├── token_import.ts         ← JSON files → Figma payload
│   │   ├── color.ts                ← Color format utilities
│   │   └── utils.ts                ← General helpers
│   └── scripts/
│       ├── sync_figma_to_tokens.ts ← Pull orchestration
│       └── sync_tokens_to_figma.ts ← Push orchestration
└── dist/                            ← Compiled output (bin/ imports from here)
```

The `bin/` scripts are just thin wrappers:

```js
#!/usr/bin/env node
import { run } from '../dist/sync_figma_to_tokens.js'
await run()
```

If you edit anything in `src/`, you need to rebuild:

```bash
cd packages/eds-tokens-sync
pnpm run build    # tsc && vite build
```

---

## Watch out: sync and generate write to the same place!

This is the most important thing to remember from this step:

Both **Figma sync** (this step) and **generate scripts** (next step) write to the exact same `tokens/` directory. If you pull fresh tokens from Figma and then run `generate:tokens:all-color`, the generated versions will **overwrite** the synced versions.

They should produce the same result if `token-config.json` is up to date. But if you added new tokens in Figma, you need to:

1. Sync from Figma first
2. Update `token-config.json` with the new tokens
3. Update the generate scripts if needed
4. Then run generate to verify the output matches

---

## Quick reference

| What you want | Command |
|--------------|---------|
| Pull all tokens from Figma | `pnpm run update-tokens` |
| Pull just colors | `pnpm run update-tokens:foundations` |
| Push local changes to Figma | `pnpm run update-figma` |
| Where tokens are saved | `packages/eds-tokens/tokens/{fileKey}/` |
| Where the Figma token goes | `packages/eds-tokens-sync/bin/.env` |

---

**Next up:** [02-token-structure.md](./02-token-structure.md) — Understanding the token hierarchy and how colors, typography, and spacing are organized.
