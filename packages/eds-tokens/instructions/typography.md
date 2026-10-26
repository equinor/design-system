---
applyTo: '**'
---

# Typography System

This guide introduces the EDS typography system -- how typographic properties are tokenised and consumed in CSS and TypeScript.

There are two ways to apply typography:

1. **Static, per-element tokens (preferred for EDS 2.0 components in `/next`)** -- set `font-family`, `font-size`, `font-weight` and `line-height` directly in the component CSS using semantic tokens such as `--eds-typography-label-md-font-size`. The size and family are part of the component's design; consumers do not switch them at runtime. See [Semantic typography tokens for component CSS](#semantic-typography-tokens-for-component-css).

2. **Runtime data-attribute switching** -- set `data-font-family` / `data-font-size` / `data-line-height` etc. on an element to flip the active typography axis at runtime. Useful for `elements.css` (semantic HTML defaults) and ad-hoc consumer markup, but not the default choice inside a component's own CSS. See [Runtime data-attribute switching](#runtime-data-attribute-switching).

If you are building a new component in `packages/eds-core-react/src/components/next/`, use approach 1. Approach 2 is documented for completeness and for cases where it is the right tool.

## Semantic typography tokens for component CSS

Components in `/next` use the per-role, per-size semantic tokens from the beta bundle, `@equinor/eds-tokens/next/css/variables.css`, directly in their CSS:

```css
.eds-button {
  font-family: var(--eds-font-family-ui);
  font-size: var(--eds-typography-label-md-font-size);
  font-weight: var(--eds-font-weight-medium);
  line-height: var(--eds-typography-label-md-line-height);
}
```

The token shape is `--eds-typography-{role}-{size}-{font-size,line-height}`, with one line height per size. [ADR-0027](../../../documentation/adr/0027-token-variable-architecture-typography-roles.md) defines three roles:

| Role     | Typeface | Sizes         | Use for                                                                                                                       |
| -------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `header` | Equinor  | `xs` to `4xl` | Titles                                                                                                                        |
| `label`  | Inter    | `xs` to `5xl` | Single-line functional text: buttons, navigation, table cells, form labels, captions. Most `/next` component text is `label`. |
| `body`   | Inter    | `sm` to `3xl` | Text that wraps                                                                                                               |

Family and weight have no role or size segment. The family is `--eds-font-family-ui` for `label` and `body`, and `--eds-font-family-header` for `header`. The weight is `--eds-font-weight-{normal,medium,bold}` and never changes with the size ([ADR-0029](../../../documentation/adr/0029-typography-approach-for-eds-2-web.md)): `header` is `medium` at every size, `label` uses `normal`, `medium` or `bold`, and `body` uses `normal` or `bold`.

Reach for these tokens whenever the component's typography is fixed by design, which is the common case. Do not add `data-font-*` attributes to the component's own elements for this; the tokens above already encode the size + role combination.

ADR-0029 supersedes [ADR-0018](../../../documentation/adr/0018-typography-approach-for-eds-2.md), so the size-matched weights and the inherited `--_font-weight-bolder` from ADR-0018 no longer apply.

### Legacy `ui-body` names and who declares them

Component CSS written before the beta tokens uses `--eds-typography-ui-body-*` names. The beta bundle declares none of them. They still resolve inside `/next` because two other sources declare them:

- **The 2.x bundle in `eds-tokens`**, imported as `@equinor/eds-tokens/css/variables`, declares 91 of them: `--eds-typography-ui-body-font-family`, and for every size from `xs` to `6xl` the font size, the `default` and `squished` line heights, three weights and three tracking values. `components/next/index.css` imports this bundle into the `eds-tokens-legacy` layer for as long as unmigrated components need its names.
- **`eds-core-react`** redeclares 30 of them in `packages/eds-core-react/src/components/next/Foundation/typography.css`: the font size and the two line heights for every size, on its own `round()`-based modular scale. That file is not in a layer, so inside `/next` it overrides the 2.x values of these 30 names.

The 2.x bundle declares `--eds-typography-header-*` names in the same old shape. Eight of them, the `header` font sizes from `xs` to `4xl`, have the same names as beta tokens. Where both bundles are loaded, the beta values win, because the 2.x bundle sits in the lower `eds-tokens-legacy` layer.

All of these names share the `--eds-typography-` prefix with the beta tokens, so the prefix does not tell you which package declares a name. Do not use the old names in new component CSS. To migrate existing CSS, map them like this:

| Legacy                                                                         | Beta                                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `--eds-typography-{ui-body,header}-font-family`                                | `--eds-font-family-ui` or `--eds-font-family-header`             |
| `--eds-typography-ui-body-{size}-font-size`                                    | `--eds-typography-{header,label,body}-{size}-font-size`, by role |
| `--eds-typography-{ui-body,header}-{size}-line-height-{default,squished}`      | `--eds-typography-{role}-{size}-line-height`, one per size       |
| `--eds-typography-{ui-body,header}-{size}-font-weight-{lighter,normal,bolder}` | `--eds-font-weight-{normal,medium,bold}`                         |
| `--eds-typography-{ui-body,header}-{size}-tracking-{tight,normal,wide}`        | Remove. The beta bundle has no tracking tokens.                  |

Sizes above `label` `5xl`, `header` `4xl` and `body` `3xl` have no beta equivalent. The full migration recipe for a `/next` component, including spacing and colour, is in [Migrating /next components to the beta tokens § 6](../../../documentation/agent-instructions/MIGRATING_TO_BETA_TOKENS.md#6-typography).

## Runtime data-attribute switching

Typography in EDS is also broken into five independent axes. Each axis has its own set of generic CSS variables and can be switched at runtime using a `data-*` attribute. This is the mechanism that `elements.css` and other foundation-level styles use, and it is available for ad-hoc consumer markup.

The attributes and the `--eds-typography-*` variables in this section come from the 2.x bundle, `@equinor/eds-tokens/css/variables`. The beta bundle has no runtime switching.

| Axis            | Data attribute     | Modes                                                           |
| --------------- | ------------------ | --------------------------------------------------------------- |
| **Font family** | `data-font-family` | `header`, `ui`                                                  |
| **Font size**   | `data-font-size`   | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl` |
| **Font weight** | `data-font-weight` | `lighter`, `normal`, `bolder`                                   |
| **Line height** | `data-line-height` | `default`, `squished`                                           |
| **Tracking**    | `data-tracking`    | `tight`, `normal`, `wide`, `loose`                              |

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
  fontWeight: md.fontWeight.normal, // 300 | 400 | 500
  lineHeight: md.lineHeight.default, // pixels
  letterSpacing: md.tracking.normal,
}
// { fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
//   lineHeight: 20, letterSpacing: 0 }
```

The size cell also exposes family-independent extras for chip- and button-like layouts:

```typescript
const md = ui.fontFamilySize.md
md.iconSize // matches the size axis
md.gapHorizontal // matches the size axis
md.gapVertical
```

### Deriving variant types

Variant names are encoded in the data, so consumers don't have to hand-roll axis-name lookups:

```typescript
type FontFamily = 'ui' | 'header'
type FontSize = keyof typeof ui.fontFamilySize // 'xs' | 'sm' | ... | 'sixXl'
type FontWeight = keyof typeof ui.fontFamilySize.md.fontWeight // 'lighter' | 'normal' | 'bolder'
type LineHeight = keyof typeof ui.fontFamilySize.md.lineHeight // 'default' | 'squished'
type Tracking = keyof typeof ui.fontFamilySize.md.tracking // 'tight' | 'normal' | 'wide'
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

| Format                  | Import path                                                 | Use case                                                                                         |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **CSS variables, beta** | `@equinor/eds-tokens/next/css/variables.css`                | Component styling via the `header`, `label` and `body` semantic tokens                           |
| **CSS variables, 2.x**  | `@equinor/eds-tokens/css/variables`                         | Runtime data-attribute switching, and the legacy `ui-body` names that unmigrated components read |
| **TypeScript matrix**   | `@equinor/eds-tokens/ts/typography/font-family-{ui,header}` | Direct matrix access for non-CSS consumers (RN, SSR, design tooling)                             |

## Best Practices

- **Prefer per-role semantic tokens in component CSS** -- inside `/next` components, set `font-family`, `font-size`, `font-weight` and `line-height` directly with `--eds-font-family-*`, `--eds-typography-{header,label,body}-{size}-{font-size,line-height}` and `--eds-font-weight-*` tokens; reach for `data-font-*` only for `elements.css` defaults and ad-hoc consumer markup
- **Scale together** -- Font size, icon size, and gap are designed to work as a unit
- **Combine axes freely** -- Each axis is independent; mix and match as needed
- **Test across sizes** -- Verify layouts work at all font size modes
