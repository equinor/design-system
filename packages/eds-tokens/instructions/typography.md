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

The CSS cascade is what composes the five axes into a final style. Targets without a cascade -- React Native, server-side rendering, design tooling, plain JS -- read the family matrix directly and pick the variant they want.

### Direct token import

Two files are emitted, one per font family. Each is a fully resolved matrix keyed by size, with nested axes inside each size cell:

```typescript
import { typography as ui } from '@equinor/eds-tokens/ts/typography/font-family-ui'
import { typography as header } from '@equinor/eds-tokens/ts/typography/font-family-header'

const md = ui.fontFamilySize.md

const style = {
  fontFamily: ui.typography.fontFamily,
  fontSize: md.fontSize,
  fontWeight: md.fontWeight.normal,    // 300 | 400 | 500
  lineHeight: md.lineHeight.default,   // pixels
  letterSpacing: md.tracking.normal,
}
// { fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
//   lineHeight: 20, letterSpacing: 0 }
```

The size cell also exposes family-independent extras for chip- and button-like layouts:

```typescript
const md = ui.fontFamilySize.md
md.iconSize       // matches the size axis
md.gapHorizontal  // matches the size axis
md.gapVertical
```

### Deriving variant types

Variant names are encoded in the data, so consumers don't have to hand-roll axis-name lookups:

```typescript
type FontFamily   = 'ui' | 'header'
type FontSize     = keyof typeof ui.fontFamilySize           // 'xs' | 'sm' | ... | 'sixXl'
type FontWeight   = keyof typeof ui.fontFamilySize.md.fontWeight   // 'lighter' | 'normal' | 'bolder'
type LineHeight   = keyof typeof ui.fontFamilySize.md.lineHeight   // 'default' | 'squished'
type Tracking     = keyof typeof ui.fontFamilySize.md.tracking     // 'tight' | 'normal' | 'wide'
```

### React Native

Pass `String(...)` over the weight when handing it to `<Text style>` (RN expects string fontWeight):

```typescript
import { Text, StyleSheet } from 'react-native'
import { typography as ui } from '@equinor/eds-tokens/ts/typography/font-family-ui'

const md = ui.fontFamilySize.md

const styles = StyleSheet.create({
  body: {
    fontFamily: ui.typography.fontFamily,
    fontSize: md.fontSize,
    fontWeight: String(md.fontWeight.normal) as '400',
    lineHeight: md.lineHeight.default,
    letterSpacing: md.tracking.normal,
  },
})
```

### What's not exported

The other axis files (`font-weight-*`, `line-height-*`, `tracking-*`) and the per-size files (`font-size-{xs..6xl}`) intentionally do **not** ship as TypeScript. Their values depend on the active mode of another axis at runtime, so a static TypeScript export cannot represent them without silently picking one cell of the matrix. The two family files are the only TS surface — everything you need to compose a style lives on a single size cell within them.

## Output Formats

| Format | Import path | Use case |
|--------|-------------|----------|
| **CSS variables** | `@equinor/eds-tokens/css/variables` | Standard web styling via data attributes |
| **TypeScript matrix** | `@equinor/eds-tokens/ts/typography/font-family-{ui,header}` | Direct matrix access for non-CSS consumers (RN, SSR, design tooling) |

## Best Practices

- **Use data attributes** -- Let the token system resolve the right values rather than hardcoding
- **Scale together** -- Font size, icon size, and gap are designed to work as a unit
- **Combine axes freely** -- Each axis is independent; mix and match as needed
- **Test across sizes** -- Verify layouts work at all font size modes
