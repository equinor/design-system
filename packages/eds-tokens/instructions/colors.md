---
applyTo: '**'
---

# Color System Introduction

This guide introduces the <abbr title="Equinor Design System">EDS</abbr> color system -- semantic meaning, token categories, and how to choose the right approach for your project.

## Core Concepts

The <abbr title="Equinor Design System">EDS</abbr> color system is built on **semantic meaning**, not visual appearance. You choose colors based on **function and role** in the interface, not on how they look.

### Semantic Categories

All colors belong to one of six semantic categories that reflect their purpose:

- **Accent** -- Brand and highlight colors
- **Neutral** -- Base and supporting colors
- **Info** -- Communication and neutral messages
- **Success** -- Positive or confirming feedback
- **Warning** -- Cautionary states
- **Danger** -- Destructive or error states

### Color Roles

Within each semantic category, colors serve specific roles:

- **Background (`bg`)** -- Surface and canvas layers
  - `surface` -- Placed on canvas to create depth in layouts
  - `canvas` -- Main application background
  - `fill-muted` -- Subtle backgrounds for interactive elements
  - `fill-emphasis` -- Bold backgrounds for prominent interactive elements

- **Border** -- Separators and outlines
  - `subtle` -- Light separators and dividers
  - `medium` -- Standard borders and controls
  - `strong` -- Emphasis or interactive elements

- **Text** -- Content and readability
  - `strong` -- Primary text in the application
  - `subtle` -- Secondary text and less important content
  - `strong-on-emphasis` -- Text on emphasis backgrounds
  - `subtle-on-emphasis` -- Secondary text on emphasis backgrounds

### Concept Colors

Global colors that sit outside the semantic scales for special cases:

- `bg-floating` -- Floating elements like tooltips and menus
- `bg-backdrop` -- Overlay layer behind modals
- `bg-input` -- Input fields and forms
- `border-focus` -- Focus rings for accessibility
- `text-link` -- Default link color

## Two Approaches: Static vs. Dynamic

The <abbr title="Equinor Design System">EDS</abbr> color system offers two approaches. Both use the same color values and accessibility logic but differ in how you apply and manage them.

:::warning

**Choose one approach and use it consistently** across design and development. Mixing approaches causes design and code to drift apart, making development harder. Each Figma variable has a matching code variable -- keep them aligned.

:::

### Static Approach

Each semantic category has its own complete set of variables.

- **When to use:** Fixed semantic meanings throughout your interface
- **Example:** All primary buttons always use `accent` colors
- **More info:** See [colors-static.md](./colors-static.md)

### Dynamic Approach

Uses abstraction with variable modes in Figma and data attributes in code to define semantic category at runtime.

- **When to use:** Need to change semantic meaning without updating components
- **Example:** Same button component can switch from `accent` to `neutral` context
- **More info:** See [colors-dynamic.md](./colors-dynamic.md)

## Accessibility

All color combinations have been evaluated using the **<abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>** contrast algorithm:

**Key principle:** Always pair text colors with their intended background tokens. They have been carefully tested together.

## Color Schemes

The color system automatically adapts to light and dark color schemes using the `data-color-scheme` attribute:

```html
<!-- Light theme (default) -->
<html data-color-scheme="light"></html>

<!-- Dark theme -->
<html data-color-scheme="dark"></html>
```

Or with custom selectors:

```css
.light {
  color-scheme: light;
}
.dark {
  color-scheme: dark;
}
```

Both the static and dynamic libraries support light and dark modes automatically.

## Installation

```bash
pnpm add @equinor/eds-tokens
```

## Output Formats

The color tokens are available in multiple formats:

| Format | Import path | Use case |
|--------|-------------|----------|
| **CSS variables** | `@equinor/eds-tokens/css/variables` | Standard web styling |
| **TypeScript (nested)** | `@equinor/eds-tokens/ts/color/static/*` | Type-safe access with autocomplete |
| **JavaScript (flat)** | `@equinor/eds-tokens/js/color/static/*` | CSS-in-JS, utilities |
| **JSON** | `@equinor/eds-tokens/json/color/*` | Tooling, custom transforms |

See the static and dynamic guides for format-specific usage examples.

## Next Steps

Choose your approach and refer to the specific guide:

- **Static Approach:** See [colors-static.md](./colors-static.md)
- **Dynamic Approach:** See [colors-dynamic.md](./colors-dynamic.md)
