---
applyTo: '**'
---

# Typography System

This guide introduces the EDS typography system -- how typographic properties are tokenised, controlled via data attributes, and consumed in CSS and TypeScript.

## Core Concepts

Typography in EDS is broken into five independent axes. Each axis has its own set of CSS variables and can be switched at runtime using a `data-*` attribute.

| Axis | Data attribute | Modes |
|------|---------------|-------|
| **Font family** | `data-font-family` | `header`, `ui` |
| **Font size** | `data-font-size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl` |
| **Font weight** | `data-font-weight` | `lighter`, `normal`, `bolder` |
| **Line height** | `data-line-height` | `default`, `squished` |
| **Tracking** | `data-tracking` | `tight`, `normal`, `wide`, `loose` |

### How It Works

Each axis resolves to a single active CSS variable:

- `--eds-typography-font-family`
- `--eds-typography-font-size`
- `--eds-typography-font-weight`
- `--eds-typography-line-height`
- `--eds-typography-tracking`

The data attributes switch which underlying mode is mapped to these variables. Font size also sets companion variables for icon sizing and gap spacing that scale with the text.

## CSS Variables

### Import

```css
@import '@equinor/eds-tokens/css/variables';
```

### Usage

Apply data attributes to set the typographic context, then use the CSS variables in your styles:

```html
<div data-font-family="ui" data-font-size="md" data-font-weight="normal">
  <p>Body text using UI font at medium size</p>
</div>
```

```css
.text {
  font-family: var(--eds-typography-font-family);
  font-size: calc(var(--eds-typography-font-size) * 1px);
  font-weight: var(--eds-typography-font-weight);
  line-height: calc(var(--eds-typography-line-height) * 1px);
  letter-spacing: calc(var(--eds-typography-tracking) * 1px);
}
```

### Companion Variables

When `data-font-size` is set, additional variables are resolved automatically:

```css
.icon-next-to-text {
  /* Icon size and gap scale with font size */
  width: calc(var(--eds-typography-icon-size) * 1px);
  gap: calc(var(--eds-typography-gap-horizontal) * 1px);
}
```

### Switching Modes

Change typographic properties by updating data attributes -- no CSS changes needed:

```html
<!-- Heading context -->
<h2 data-font-family="header" data-font-size="2xl" data-font-weight="bolder">
  Section Title
</h2>

<!-- Body context -->
<p data-font-family="ui" data-font-size="md" data-font-weight="normal">
  Paragraph text
</p>

<!-- Caption context -->
<small data-font-family="ui" data-font-size="xs" data-tracking="wide">
  Caption
</small>
```

## TypeScript Tokens

Typography tokens are available as nested TypeScript objects with `as const` for type safety.

### Import

```typescript
import { typography } from '@equinor/eds-tokens/ts/typography/font-size-md'
import { typography } from '@equinor/eds-tokens/ts/typography/font-family-header'
import { typography } from '@equinor/eds-tokens/ts/typography/font-weight-normal'
import { typography } from '@equinor/eds-tokens/ts/typography/line-height-default'
import { typography } from '@equinor/eds-tokens/ts/typography/tracking-tight'
```

### Available Files

Each mode of each axis has its own file:

| Axis | Files |
|------|-------|
| Font family | `font-family-header`, `font-family-ui` |
| Font size | `font-size-xs`, `font-size-sm`, `font-size-md`, `font-size-lg`, `font-size-xl`, `font-size-2xl`, `font-size-3xl`, `font-size-4xl`, `font-size-5xl`, `font-size-6xl` |
| Font weight | `font-weight-lighter`, `font-weight-normal`, `font-weight-bolder` |
| Line height | `line-height-default`, `line-height-squished` |
| Tracking | `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-loose` |

### Usage

```typescript
import { typography } from '@equinor/eds-tokens/ts/typography/font-size-md'

// Font size files contain resolved values for that size
typography.typography['font-size']        // '16'
typography.typography['line-height-default'] // '20'
typography.typography['font-weight-normal'] // '400'
```

```typescript
import { typography } from '@equinor/eds-tokens/ts/typography/font-family-header'

// Font family files contain the family and all size-specific values
typography.typography['font-family']      // 'Equinor'
typography['font-family-size'].md['font-size'] // '16'
```

### Naming Conversion

CSS variable segments map to TypeScript object keys:

| CSS variable | TypeScript path |
|---|---|
| `--eds-typography-font-size` | `typography.typography['font-size']` |
| `--eds-typography-font-weight` | `typography.typography['font-weight']` |
| `--eds-typography-tracking` | `typography.typography.tracking` |

## Output Formats

| Format | Import path | Use case |
|--------|-------------|----------|
| **CSS variables** | `@equinor/eds-tokens/css/variables` | Standard web styling via data attributes |
| **TypeScript (nested)** | `@equinor/eds-tokens/ts/typography/*` | Type-safe access with autocomplete |

## Best Practices

- **Use data attributes** -- Let the token system resolve the right values rather than hardcoding
- **Scale together** -- Font size, icon size, and gap are designed to work as a unit
- **Combine axes freely** -- Each axis is independent; mix and match as needed
- **Test across sizes** -- Verify layouts work at all font size modes
