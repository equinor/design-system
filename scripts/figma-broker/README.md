# Figma Icon Broker

A standalone script that extracts SVG icons from the EDS Icons Figma file and outputs them in multiple formats for use in the Equinor Design System.

## Overview

The icon broker automates the process of syncing icons from Figma to the codebase. It:

1. Fetches the Figma file structure via the Figma API (or uses cached data)
2. Parses the file to find all icon components on the "System Icons" page
3. Requests SVG renders for each icon from Figma's image API
4. Optimizes SVGs using SVGO (removes fills, preserves viewBox, etc.)
5. Outputs icons in three formats:
   - Individual SVG files in `assets/icons/system-icons/{group}/`
   - JSON metadata file for Storybook
   - TypeScript exports for the `@equinor/eds-icons` package

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- Edit access to the [EDS Assets Figma file](https://www.figma.com/design/BQjYMxdSdgRkdhKTDDU7L4KU/Assets)

### Configuration

1. **Generate a Figma Personal Access Token:**
   - Go to Figma → Account Settings → Personal Access Tokens
   - Generate a new token with read access

2. **Create `.env` file:**

   ```sh
   cd scripts/figma-broker
   echo "FIGMA_TOKEN=your_token_here" > .env
   ```

   Or use `PERSONAL_ACCESS_TOKEN` as the variable name.

3. **Install dependencies:**

   ```sh
   pnpm install --filter=./scripts/figma-broker
   ```

## Usage

Run from the repository root:

```sh
pnpm icons [options]
```

### Command Line Options

| Flag             | Description                                             |
| ---------------- | ------------------------------------------------------- |
| _(none)_         | Use cached Figma file (fastest)                         |
| `--force`        | Force fresh fetch from Figma API (ignores cache)        |
| `--only <icons>` | Update only specific icons (comma-separated, no spaces) |
| `--debug`        | Enable verbose debug logging                            |
| `--dry-run`      | Preview changes without writing any files               |

### Examples

```sh
# Basic usage - uses cached Figma data
pnpm icons

# Force refresh from Figma API
pnpm icons --force

# Update only specific icons
pnpm icons --only jacket
pnpm icons --only jacket,monopile,wind_turbine

# Combine force with partial update
pnpm icons --force --only jacket,monopile

# Preview what would happen without writing files
pnpm icons --dry-run --only jacket

# Full debug output
pnpm icons --debug

# Debug + dry-run + partial update
pnpm icons --debug --dry-run --only jacket,monopile
```

### Icon Name Filtering (`--only`)

The `--only` flag accepts comma-separated icon names. **Do not use spaces after commas.**

Names are matched using **partial, case-insensitive** matching against both:

- **Original Figma name** (with spaces): `"substation onshore"`, `"arrow up"`
- **Converted snake_case name**: `substation_onshore`, `arrow_up`

| Example                       | Matches                                            |
| ----------------------------- | -------------------------------------------------- |
| `--only jacket`               | Icons containing "jacket"                          |
| `--only "substation onshore"` | Using Figma name (quote for spaces)                |
| `--only substation_onshore`   | Using snake_case name                              |
| `--only substation`           | Partial match -- all icons containing "substation" |
| `--only jacket,monopile`      | Multiple icons                                     |

> **Note:** `--only` works for both updating existing icons and adding new ones. New icons that don't yet exist in `data.ts` or `system-icons.json` will be appended automatically.

## Output Files

The script generates three types of output:

### 1. SVG Files

Individual optimized SVG files organized by category:

```
assets/icons/system-icons/
├── navigation/
│   ├── home.svg
│   ├── arrow_up.svg
│   └── ...
├── energy/
│   ├── jacket.svg
│   ├── monopile.svg
│   └── ...
└── ...
```

### 2. Storybook JSON

Metadata file for Storybook icon documentation:

```
packages/eds-core-react/stories/assets/icons/system-icons.json
```

Contains an array of icon objects with name, SVG content, dimensions, and path data.

### 3. TypeScript Exports

Named exports for the `@equinor/eds-icons` package:

```
packages/eds-icons/src/data.ts
```

Generated code:

```typescript
import type { IconData } from './types'

export const home: IconData = {
  name: 'home',
  prefix: 'eds',
  height: '24',
  width: '24',
  svgPathData: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
}

export const arrow_up: IconData = { ... }
```

## How It Works

### Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        pnpm icons                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Parse CLI arguments (--force, --only, --debug, --dry-run)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Load Figma file (from cache or API if --force)              │
│     Cache location: scripts/figma-broker/raw/{fileId}.json      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Parse file structure to find icons                          │
│     - Looks for "System Icons" page                             │
│     - Extracts COMPONENT and COMPONENT_SET nodes                │
│     - For component sets, uses "default" variant (24px)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Apply --only filter (if specified)                          │
│     - Matches against original Figma name OR snake_case name    │
│     - Partial, case-insensitive matching                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Fetch SVG URLs from Figma Image API                         │
│     - Requests renders for all icon node IDs                    │
│     - Waits 5 seconds for Figma to generate SVGs                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Download and optimize each SVG                              │
│     - Download from temporary S3 URLs                           │
│     - Optimize with SVGO (remove fills, preserve viewBox)       │
│     - Extract path data for TypeScript exports                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Write output files                                          │
│     - Full export: Replace all files                            │
│     - Partial (--only): Merge with existing files               │
└─────────────────────────────────────────────────────────────────┘
```

### Figma File Structure

The script expects this structure in the Figma file:

```
Document
├── Page: "System Icons"
│   ├── Frame: "Navigation"
│   │   ├── COMPONENT: "home"
│   │   └── COMPONENT_SET: "arrow up"
│   │       ├── COMPONENT: "size=default"  ← Used (24px)
│   │       └── COMPONENT: "size=small"    ← Ignored
│   ├── Frame: "Energy"
│   │   ├── COMPONENT: "jacket"
│   │   └── ...
│   └── ...
├── Page: "Product Icons"  ← Ignored
└── Page: "🚧 WIP"         ← Ignored (work in progress)
```

### Name Conversion

Figma names are converted to snake_case for code compatibility:

| Figma Name     | Converted Name                      |
| -------------- | ----------------------------------- |
| `Arrow-Up`     | `arrow_up`                          |
| `3D Rotate`    | `d_rotate` (leading number removed) |
| `Add + Remove` | `add_remove`                        |
| `UI/Settings`  | `ui__settings`                      |

## Debug Mode

Enable with `--debug` to see detailed logging:

```sh
pnpm icons --debug --only jacket
```

### Example Debug Output

```
[DEBUG] Token: ✓ loaded (45 chars, starts with "figd_ZyU8...")
[DEBUG] File ID: BQjYMxdSdgRkdhKTDDU7L4KU
[DEBUG] Force refresh: false
[DEBUG] Only icons: jacket
[DEBUG] Dry run: false
[DEBUG] Cache path: /Users/.../scripts/figma-broker/raw/BQjYMxdSdgRkdhKTDDU7L4KU.json
[DEBUG] Cache: HIT (age: 45 minutes)
📂 Using cached Figma file
🔍 Parsing icons from Figma file...
[DEBUG] Parsing: Found 5 pages
[DEBUG] Parsing: Skipping page "🚧 WIP" (WIP)
[DEBUG] Parsing: Page "System Icons" has 45 components, 312 component sets
   Filtering to: jacket
[DEBUG] Filter: Matched 1/357 icons
[DEBUG]   - jacket (Energy)
   Found 1 icons in 1 groups
🔗 Fetching SVG URLs from Figma...
[DEBUG] API: GET /v1/images/... (1 icons)
[DEBUG] API: Response 200 OK
[DEBUG] fetchFigmaImageUrls: 0.82s
   Waiting for Figma to generate SVGs...
⬇️  Downloading and optimizing 1 SVGs...
   Processing 1/1: jacket
   ✓ Processed 1 icons
💾 Writing output files...
[DEBUG] Write: /Users/.../assets/icons/system-icons/energy/jacket.svg
   Wrote 1 SVGs to assets/icons/system-icons/
   Updated 1 icons in stories/assets/icons/system-icons.json
   Updated 1 icons in packages/eds-icons/src/data.ts
[DEBUG] writeFiles: 0.02s

✅ Done! Icons exported successfully.
[DEBUG] total: 6.45s
```

## Dry Run Mode

Preview changes without writing files:

```sh
pnpm icons --dry-run --only jacket
```

Output:

```
🔍 DRY RUN - No files will be written
🎨 Figma Icon Broker
====================
📂 Using cached Figma file
🔍 Parsing icons from Figma file...
   Filtering to: jacket
   Found 1 icons in 1 groups
🔗 Fetching SVG URLs from Figma...
   Waiting for Figma to generate SVGs...
⬇️  Downloading and optimizing 1 SVGs...
   ✓ Processed 1 icons
💾 Writing output files...
[DRY-RUN] Would write: /Users/.../assets/icons/system-icons/energy/jacket.svg
   Would write 1 SVGs to assets/icons/system-icons/
[DRY-RUN] Would update: /Users/.../stories/assets/icons/system-icons.json
   Would update 1 icons in stories/assets/icons/system-icons.json
[DRY-RUN] Would update: /Users/.../packages/eds-icons/src/data.ts
   Would update 1 icons in packages/eds-icons/src/data.ts

✅ Done! Icons exported successfully.
```

## Caching

The script caches the Figma file structure to speed up repeated runs:

- **Cache location:** `scripts/figma-broker/raw/{fileId}.json`
- **Default behavior:** Use cache if it exists
- **Force refresh:** Use `--force` to fetch fresh data

The cache is useful because:

1. The Figma file is large (several MB) and slow to fetch
2. Reduces API calls during development/testing
3. Allows offline development with cached data

### Cache vs Force -- When to Use Each

#### Use Cache (default, no flags)

```sh
pnpm icons
```

**When:**

- You're developing/testing the script itself
- You want to regenerate output files without hitting the Figma API
- The icons in Figma haven't changed since last fetch
- You want faster execution (~2-5 seconds vs ~30+ seconds)

**What happens:**

- Reads the Figma file structure from `raw/{fileId}.json`
- Still fetches fresh SVG renders from Figma's image API
- Useful when you're tweaking output formats or debugging

#### Use `--force`

```sh
pnpm icons --force
```

**When:**

- Icons have been **added, removed, or renamed** in Figma
- Icon **grouping/frames** have changed in Figma
- You want a **completely fresh sync** with Figma
- First time running after a long period

**What happens:**

- Fetches the entire Figma file structure from the API (~30+ seconds for large files)
- Overwrites the local cache
- Then fetches fresh SVG renders

#### Summary Table

| Scenario                          | Command                      |
| --------------------------------- | ---------------------------- |
| Icon **paths/vectors** changed    | `pnpm icons` (cache is fine) |
| Icon **added or removed**         | `pnpm icons --force`         |
| Icon **renamed**                  | `pnpm icons --force`         |
| Icon **moved to different group** | `pnpm icons --force`         |
| Testing script changes locally    | `pnpm icons`                 |
| Weekly/monthly full sync          | `pnpm icons --force`         |
| Update specific icon only         | `pnpm icons --only jacket`   |

#### The Key Distinction

- **Cache** = Figma file **structure** (what icons exist, their names, IDs, groups)
- **Fresh fetch** = SVG **content** (the actual vector paths)

The SVG content is always fetched fresh from Figma's image API. But the script needs to **know the icon exists first** (from the file structure) before it can request the SVG.

**Even when using cache**, the script still:

1. Fetches fresh SVG renders from Figma's image API
2. Regenerates all output files (`data.ts`, `system-icons.json`, SVG files)
3. Updates with the latest visual changes to existing icons

This means:

- ✅ Visual changes to existing icons work **without** `--force` (SVGs re-fetched, outputs regenerated)
- ❌ New icons, renamed icons, or removed icons require `--force` (structure change)

:::note

The cache only stores the **file structure** (component names, IDs, hierarchy). The actual **SVG content** is always fetched fresh from Figma's image API, so visual changes to icons will be picked up even without `--force`.

:::

:::tip

When testing locally, use the cache. Only use `--force` when you need to pull new icons from Figma.

:::

## Troubleshooting

### "FIGMA_TOKEN required" Error

Make sure your `.env` file exists and contains a valid token:

```sh
cat scripts/figma-broker/.env
# Should output: FIGMA_TOKEN=figd_...
```

### "No icons found matching the filter" Error

Your `--only` filter didn't match any icons. Try:

- Using `--debug` to see what icons are available
- Using a partial match: `--only sub` instead of `--only substation_onshore`
- Checking the exact name in Figma

### API Rate Limits

If you're getting 429 errors, wait a few minutes and try again. The script processes icons sequentially to avoid rate limits.

### SVGs Not Updating

1. Make sure you're using `--force` to get fresh data from Figma
2. Check that the icon was actually changed in Figma
3. Verify the icon is on the "System Icons" page (not WIP or Product Icons)

## Related Files

- [`icons.js`](./icons.js) -- Main script with full documentation
- [`packages/eds-icons/src/data.ts`](../../packages/eds-icons/src/data.ts) -- Generated TypeScript exports
- [`packages/eds-icons/src/types.ts`](../../packages/eds-icons/src/types.ts) -- IconData type definition
- [`assets/icons/system-icons/`](../../assets/icons/system-icons/) -- Generated SVG files
