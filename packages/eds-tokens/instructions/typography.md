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
  font-size: var(--eds-typography-font-size);
  font-weight: var(--eds-typography-font-weight);
  line-height: var(--eds-typography-line-height);
  letter-spacing: var(--eds-typography-tracking);
}
```

### Companion Variables

When `data-font-size` is set, additional variables are resolved automatically:

```css
.icon-next-to-text {
  /* Icon size and gap scale with font size */
  width: var(--eds-typography-icon-size);
  gap: var(--eds-typography-gap-horizontal);
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

## Using Typography in TypeScript / JavaScript

The CSS cascade is what composes the five axes into a final style. Targets without a cascade -- React Native, server-side rendering, design tooling, plain JS -- need a runtime helper to do the same job.

### `composeTextStyle` (recommended)

```typescript
import { composeTextStyle } from '@equinor/eds-tokens'

const style = composeTextStyle({
  fontFamily: 'ui',     // 'ui' | 'header'
  fontSize: 'md',        // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  fontWeight: 'normal',  // 'lighter' | 'normal' | 'bolder' (default 'normal')
  lineHeight: 'default', // 'default' | 'squished' (default 'default')
  tracking: 'normal',    // 'tight' | 'normal' | 'wide' | 'loose' (default 'normal')
})
// { fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
//   lineHeight: 20, letterSpacing: 0 }
```

For React Native, request the RN-shaped output (string `fontWeight`):

```typescript
const style = composeTextStyle({
  fontFamily: 'ui',
  fontSize: 'md',
  format: 'react-native',
})
// fontWeight is '400' (string) instead of 400 (number)
```

To also get the size-axis extras (`iconSize`, `gapHorizontal`, `gapVertical`), pass `includeSizeExtras: true`. These values scale with `fontSize` and are family-independent.

### Raw TypeScript token files

For consumers that need direct access to the underlying data, two file groups are emitted:

| File group | Contents |
|---|---|
| `@equinor/eds-tokens/ts/typography/font-family-{ui,header}` | Full size matrix per family (font-size, line-height, tracking, weight per size) |
| `@equinor/eds-tokens/ts/typography/size-extras` | Family-independent size-axis extras (`iconSize`, `gapHorizontal`, `gapVertical`) keyed by `fontSize` |

The other axes (`font-weight-*`, `line-height-*`, `tracking-*`) and the per-size files (`font-size-{xs..6xl}`) intentionally do **not** ship as TypeScript. Their values depend on the active mode of another axis at runtime, so a static TypeScript export cannot represent them without silently picking one cell of the matrix. Use `composeTextStyle` instead.

## Output Formats

| Format | Import path | Use case |
|--------|-------------|----------|
| **CSS variables** | `@equinor/eds-tokens/css/variables` | Standard web styling via data attributes |
| **TypeScript helper** | `@equinor/eds-tokens` (`composeTextStyle`) | Resolved styles for non-CSS consumers (RN, SSR, design tooling) |
| **TypeScript matrix** | `@equinor/eds-tokens/ts/typography/font-family-*` and `/size-extras` | Direct matrix access when the helper is not enough |

## Best Practices

- **Use data attributes** -- Let the token system resolve the right values rather than hardcoding
- **Scale together** -- Font size, icon size, and gap are designed to work as a unit
- **Combine axes freely** -- Each axis is independent; mix and match as needed
- **Test across sizes** -- Verify layouts work at all font size modes
