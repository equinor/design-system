# Step 2: Token Structure

> Understanding what the token files look like and how the color hierarchy, typography, and spacing systems are organized.

---

## Why do we need a hierarchy?

Imagine you're building a button. You could hardcode the background color:

```css
.button { background: #007079; }
```

But what happens when:
- You need a dark mode? You'd have to change every hardcoded color.
- Designers change the brand color? Find-and-replace across the whole codebase.
- A component needs to adapt to different themes? Impossible with hardcoded values.

The solution is **layered tokens** — each layer adds meaning on top of the previous one. The button doesn't say "I'm `#007079`", it says "I'm the accent fill color" — and the system figures out what that means based on the current theme and mode.

---

## The Color Hierarchy (5 Levels)

This is the heart of the EDS token system. Colors flow through 5 levels, from raw values to meaningful names:

```
Level 1: Foundation Palette      "Moss Green shade 5 is #007079"
    │
    ▼
Level 2: Color Scheme            "Accent means Moss Green"
    │
    ▼
Level 3: Semantic Tokens         "Accent fill-emphasis background = Accent.6"
    │
    ▼
Level 4: Appearance Tokens       "The component's fill = the active intent's fill"
    │
    ▼
Level 5: Concept Tokens          "Disabled background = Neutral.3"
```

Let's walk through each level.

---

### Level 1: Foundation Palette

**What:** Raw hex colors organized by color family and shade number.

**Files:** `Color Light.Mode 1.json`, `Color Dark.Mode 1.json`

**Location:** `tokens/GnovDpL3UV6X51Ot7Kv6Im/`

```
Light                          Dark
├── Moss Green                 ├── Moss Green
│   ├── 1: #eaf8fa             │   ├── 1: #002c33
│   ├── 2: #f6ffff             │   ├── 2: #113e44
│   ├── 3: #cfe7e9             │   ├── 3: #003f47
│   ├── ...                    │   ├── ...
│   └── 8: #003f47             │   └── 8: #f6ffff
├── Gray                       ├── North Sea
│   ├── 1: #f7f7f7             │   ├── 1: #1a1a1a
│   └── ...                    │   └── ...
├── Blue                       ├── Blue
├── Red                        ├── Red
├── Green                      ├── Green
└── Orange                     └── Orange
```

**Key idea:** These are just colors. They have no meaning yet — "Moss Green 5" doesn't tell you *what* it's used for. Notice that shade numbers are inverted between light and dark: shade 1 is lightest in light mode, darkest in dark mode.

---

### Level 2: Color Scheme

**What:** Maps **intents** (like Accent, Neutral, Info) to palette colors. This is where meaning starts.

**Files:** `🌗 Color scheme.Light.json`, `🌗 Color scheme.Dark.json`

**Location:** `tokens/GnovDpL3UV6X51Ot7Kv6Im/`

The mapping is defined in `token-config.json`:

```json
{
  "colorSchemeConfig": {
    "Accent":  { "Light": "Moss Green", "Dark": "Moss Green" },
    "Neutral": { "Light": "Gray",       "Dark": "North sea" },
    "Info":    { "Light": "Blue",       "Dark": "Blue" },
    "Success": { "Light": "Green",      "Dark": "Green" },
    "Warning": { "Light": "Orange",     "Dark": "Orange" },
    "Danger":  { "Light": "Red",        "Dark": "Red" }
  }
}
```

**What this means in practice:**

```
"Accent" in Light mode  → uses "Moss Green" shades
"Accent" in Dark mode   → also uses "Moss Green" shades (but dark variants)
"Neutral" in Light mode → uses "Gray" shades
"Neutral" in Dark mode  → uses "North sea" shades  (different palette!)
```

So when you reference `{Accent.5}`, the system looks up which palette family "Accent" maps to (Moss Green), then grabs shade 5 from that family.

This level also includes **concept tokens** — special cross-cutting colors:

```json
{
  "bg-floating":     { "Light": "{Light.Gray.2}",  "Dark": "{Dark.North sea.2}" },
  "bg-backdrop":     { "Light": "{Light.Gray.7}",  "Dark": "{Dark.North sea.7}" },
  "border-focus":    { "Light": "{Light.Blue.7}",  "Dark": "{Dark.Blue.7}" },
  "text-link":       { "Light": "{Light.Blue.8}",  "Dark": "{Dark.Blue.8}" },
  "bg-disabled":     { "Light": "{Neutral.3}",     "Dark": "{Neutral.3}" },
  "text-disabled":   { "Light": "{Neutral.7}",     "Dark": "{Neutral.7}" }
}
```

These reference either the foundation palette directly (`{Light.Gray.2}`) or the color scheme (`{Neutral.3}`).

---

### Level 3: Semantic Tokens

**What:** The main tokens components use. They combine **area** (Bg/Border/Text) + **intent** (Accent/Neutral/Info/...) + **variant** (Canvas/Surface/Fill/...).

**File:** `Semantic.Mode 1.json`

**Location:** `tokens/OWxw2XogDLUt1aCvcDFXPw/`

The structure looks like this:

```
Bg (backgrounds)
├── Neutral
│   ├── Canvas         → {Neutral.1}    (page background)
│   ├── Surface        → {Neutral.2}    (card background)
│   ├── Fill Muted
│   │   ├── Default    → {Neutral.3}    (subtle fill)
│   │   ├── Hover      → {Neutral.4}    (subtle fill on hover)
│   │   └── Active     → {Neutral.5}    (subtle fill when pressed)
│   └── Fill Emphasis
│       ├── Default    → {Neutral.6}    (strong fill)
│       ├── Hover      → {Neutral.7}    (strong fill on hover)
│       └── Active     → {Neutral.8}    (strong fill when pressed)
├── Accent
│   ├── Canvas         → {Accent.1}
│   ├── Surface        → {Accent.2}
│   └── ... (same structure)
├── Info, Success, Warning, Danger
│   └── ... (same structure for each)

Border (borders)
├── Neutral
│   ├── Subtle         → {Neutral.5}
│   ├── Medium         → {Neutral.6}
│   └── Strong         → {Neutral.8}
├── Accent, Info, etc.

Text (text colors)
├── Neutral
│   ├── Subtle         → {Neutral.6}
│   ├── Medium         → {Neutral.7}
│   └── Strong         → {Neutral.8}
├── Accent, Info, etc.
```

**This becomes CSS variables like:**

```css
--eds-color-bg-neutral-canvas
--eds-color-bg-accent-fill-emphasis-hover
--eds-color-border-info-medium
--eds-color-text-danger-strong
```

**The naming pattern is:** `--eds-color-{area}-{intent}-{variant}`

---

### Level 4: Appearance Tokens (Dynamic)

**What:** Generic "slot" tokens that components use when they need to support multiple color intents dynamically via `data-color-appearance`.

**Files:** `🎨 Appearance.Accent.json`, `🎨 Appearance.Neutral.json`, etc.

**Location:** `tokens/nyPaQ3QnI1UAcxKW4a0d2c/`

Instead of referencing a specific intent like `--eds-color-bg-accent-fill-emphasis`, a component uses a generic slot:

```css
/* Generic - works with any appearance */
background: var(--eds-color-bg-fill-emphasis);
```

Then the appearance is set via a data attribute:

```html
<button data-color-appearance="accent">Accent button</button>
<button data-color-appearance="danger">Danger button</button>
```

The appearance token files define what values each slot gets for each intent. So `Appearance.Accent.json` maps the generic slots to accent colors, `Appearance.Danger.json` maps them to danger colors, etc.

---

### Level 5: Concept Tokens

**What:** Cross-cutting tokens that don't fit neatly into the intent system. Things like disabled states, focus rings, and special backgrounds.

**Files:** `Concept.Mode 1.json` (in both static and dynamic directories)

**Location:** `tokens/OWxw2XogDLUt1aCvcDFXPw/` and `tokens/nyPaQ3QnI1UAcxKW4a0d2c/`

```
Concept tokens:
├── Bg
│   ├── Floating       → floating panels, tooltips
│   ├── Backdrop       → overlay backgrounds
│   ├── Input          → input field backgrounds
│   └── Disabled       → disabled element backgrounds
├── Border
│   ├── Focus          → focus ring color
│   └── Disabled       → disabled element borders
└── Text
    ├── Link           → hyperlink color
    └── Disabled       → disabled text color
```

These are defined in `token-config.json` under `conceptColorGroups` and reference either the color scheme or the foundation palette directly.

---

## Typography (5 Independent Axes)

Typography in EDS isn't a single "font size" — it's 5 **independent axes** that can be mixed and matched using `data-*` attributes:

### The 5 axes

| Axis | Attribute | Values | What it controls |
|------|-----------|--------|-----------------|
| Font Family | `data-font-family` | `header`, `ui` | Which font face |
| Font Size | `data-font-size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`...`6xl` | How big |
| Font Weight | `data-font-weight` | `lighter`, `normal`, `bolder` | How thick |
| Line Height | `data-line-height` | `default`, `squished` | Vertical spacing between lines |
| Tracking | `data-tracking` | `tight`, `normal`, `wide`, `loose` | Letter spacing |

### How it works in HTML

```html
<!-- A heading: large, bold, header font -->
<h1 data-font-family="header"
    data-font-size="3xl"
    data-font-weight="bolder">
  Welcome
</h1>

<!-- Body text: medium, normal weight, UI font -->
<p data-font-family="ui"
   data-font-size="md"
   data-font-weight="normal">
  Some content here.
</p>
```

### The TypographyNext component

In practice, you won't set these `data-*` attributes by hand. The EDS React library provides a `TypographyNext` component (in `packages/eds-core-react/src/components/Typography/Typography.new.tsx`) that handles this for you. It accepts props like `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and `tracking`, and maps them to the corresponding `data-*` attributes on the rendered element. This is the bridge between the React component API and the token-driven CSS system described above.

### The token files

Each axis has multiple mode files. For example, Font Size has 10 files:

```
🅰️ Font size.XS.json    → values when data-font-size="xs"
🅰️ Font size.SM.json    → values when data-font-size="sm"
🅰️ Font size.MD.json    → values when data-font-size="md"
🅰️ Font size.LG.json    → values when data-font-size="lg"
... up to 6XL
```

Each file sets the same CSS variable names but with different values:

```
Font size.MD.json → --eds-typography-font-size: 1rem (16px)
Font size.LG.json → --eds-typography-font-size: 1.125rem (18px)
```

Font size files also control **icon size** and **gap** — so when text gets bigger, icons and spacing scale proportionally.

### Why 5 axes instead of predefined type styles?

Traditional systems define styles like "heading-large" or "body-small". The EDS approach is more flexible — you can combine any font family with any size with any weight. This means fewer tokens and more combinations.

---

## Spacing

Spacing follows a similar multi-axis approach:

### Density

Controls the overall spacing "tightness":

| Mode | Attribute | Feel |
|------|-----------|------|
| Spacious | `data-density="spacious"` | More breathing room (default) |
| Comfortable | `data-density="comfortable"` | Tighter, more compact |

### Space Proportions

Controls padding ratios:

| Mode | Attribute | Shape |
|------|-----------|-------|
| Squared | `data-space-proportions="squared"` | Equal padding all sides (default) |
| Squished | `data-space-proportions="squished"` | Less vertical, more horizontal |
| Stretched | `data-space-proportions="stretched"` | More vertical, less horizontal |

### Selectable Space

Component-level spacing override (XS through XL):

```html
<div data-selectable-space="sm">Compact spacing</div>
<div data-selectable-space="xl">Generous spacing</div>
```

### Generic Gaps

For layout spacing between elements:

```html
<div data-horizontal-gap="md" data-vertical-gap="lg">
  <!-- Children spaced with medium horizontal, large vertical gaps -->
</div>
```

Available sizes: `none`, `4xs`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

---

## The token-config.json file

This is the **master configuration** that drives all the generate scripts. It lives at `packages/eds-tokens/token-config.json`.

Key sections:

```json
{
  "figmaProjectFoundationId": "GnovDpL3UV6X51Ot7Kv6Im",
  "figmaProjectStaticId": "OWxw2XogDLUt1aCvcDFXPw",
  "figmaProjectDynamicId": "nyPaQ3QnI1UAcxKW4a0d2c",
  "variablePrefix": "eds",

  "colorSchemeConfig": {
    "Accent": { "Light": "Moss Green", "Dark": "Moss Green" },
    "Neutral": { "Light": "Gray", "Dark": "North sea" },
    ...
  },

  "conceptColorGroups": {
    "bg-floating": { "Light": "{Light.Gray.2}", "Dark": "{Dark.North sea.2}" },
    "border-focus": { "Light": "{Light.Blue.7}", "Dark": "{Dark.Blue.7}" },
    ...
  }
}
```

- `figmaProject*Id` — The Figma file keys for sync
- `variablePrefix` — Used as `--eds-` in CSS output
- `colorSchemeConfig` — Intent → palette family mapping
- `conceptColorGroups` — Cross-cutting concept token definitions

---

## The generate scripts

Some tokens can be **generated** from config instead of pulled from Figma. This is useful because:

1. You don't need Figma access to rebuild tokens
2. The config is version-controlled and reviewable
3. It's the source of truth for the color hierarchy mappings

There are 4 generate scripts (all in `eds-tokens-build`):

| Script | What it creates | Input |
|--------|----------------|-------|
| `generate-color-scheme-tokens` | `🌗 Color scheme.Light/Dark.json` | Foundation palette + `colorSchemeConfig` |
| `generate-semantic-tokens` | `Semantic.Mode 1.json` | Color scheme + `colorSchemeConfig` |
| `generate-dynamic-appearance-tokens` | `🎨 Appearance.*.json` | Color scheme + `colorSchemeConfig` |
| `generate-concept-tokens` | `Concept.Mode 1.json` | `conceptColorGroups` config |

Run them from `eds-tokens`:

```bash
pnpm run generate:tokens:all-color   # Run all 4 scripts

# Or individually:
pnpm run generate:tokens:color-scheme
pnpm run generate:tokens:static      # color scheme + semantic + concept
pnpm run generate:tokens:dynamic     # color scheme + appearance + concept
```

---

## Summary: How it all connects

```
Foundation Palette (raw hex colors)
    │
    │  colorSchemeConfig maps intent → palette family
    ▼
Color Scheme (Accent=Moss Green, Neutral=Gray, etc.)
    │
    │  Semantic tokens reference color scheme by intent+shade
    ▼
Semantic Tokens (--eds-color-bg-accent-canvas, etc.)
    │
    │  Appearance tokens map generic slots to specific intents
    ▼
Appearance Tokens (dynamic via [data-color-appearance])
    │
    │  Concept tokens reference scheme or palette for special cases
    ▼
Concept Tokens (disabled, focus, floating, links)
```

Each level can change independently:
- Want to rebrand? Change the Foundation Palette.
- Want Accent to use Blue instead of Green? Change `colorSchemeConfig`.
- Want to add a new semantic variant? Update the generate script.
- Want a new concept like "bg-skeleton"? Add it to `conceptColorGroups`.

---

**Next up:** [03-style-dictionary-build.md](./03-style-dictionary-build.md) — How the JSON token files get transformed into CSS, JavaScript, TypeScript, and JSON outputs.
