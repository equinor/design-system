---
applyTo: '**'
---

# Static Color Approach

The static approach uses a complete set of variables for each semantic category. Each variable explicitly specifies the semantic category in its name.

> See [colors.md](./colors.md) for the core color system concepts.

## Concept

In the static approach, each semantic category (accent, neutral, info, success, warning, danger) has its own variables. You choose the specific variable you need based on the semantic meaning required.

## Naming Pattern

Static variable names follow this pattern:

```
--eds-color-[role]-[semantic category]-[priority]-[state]
```

> **Note:** The `[state]` suffix (e.g., `-default`, `-hover`, `-active`) is only present for certain roles, such as background fill. For text and border variables, the state is typically omitted.

- `--eds-color-bg-accent-fill-emphasis-default` -- Accent semantic category (background fill, with default state)
- `--eds-color-bg-neutral-fill-muted-default` -- Neutral semantic category (background fill, with default state)
- `--eds-color-border-danger-medium` -- Danger semantic category (border, no state)
- `--eds-color-text-success-strong` -- Success semantic category (text, no state)

## CSS Variables

### Import

```css
@import '@equinor/eds-tokens/css/variables';
```

### Usage

Use specific semantic variables in your styles:

```css
.button-primary {
  background-color: var(--eds-color-bg-accent-fill-emphasis-default);
  color: var(--eds-color-text-accent-strong-on-emphasis);
  border: 1px solid var(--eds-color-border-accent-strong);
}

.alert-warning {
  background-color: var(--eds-color-bg-warning-fill-emphasis);
  color: var(--eds-color-text-warning-strong-on-emphasis);
  border-left: 4px solid var(--eds-color-border-warning-strong);
}
```

### Interactive States

Background fill-muted and fill-emphasis include state variants for hover and active:

```css
.button {
  background-color: var(--eds-color-bg-accent-fill-emphasis-default);
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--eds-color-bg-accent-fill-emphasis-hover);
}

.button:active {
  background-color: var(--eds-color-bg-accent-fill-emphasis-active);
}
```

## TypeScript Tokens

The static color tokens are also available as a nested TypeScript object with full type safety and autocomplete. The object mirrors the CSS variable hierarchy using camelCase keys and `as const` for literal type inference.

### Import

```typescript
import { color } from '@equinor/eds-tokens/ts/color/static/semantic'
```

### Usage

Access tokens through dot notation with full autocomplete:

```typescript
// Background tokens
color.bg.accent.canvas          // resolved color value
color.bg.neutral.surface
color.bg.accent.fillMuted.default
color.bg.accent.fillMuted.hover

// Text tokens
color.text.accent.strong
color.text.neutral.subtleOnEmphasis

// Border tokens
color.border.danger.medium
color.border.accent.strong
```

### Example: Styled components / CSS-in-JS

```typescript
import { color } from '@equinor/eds-tokens/ts/color/static/semantic'

const styles = {
  backgroundColor: color.bg.accent.fillEmphasis.default,
  color: color.text.accent.strongOnEmphasis,
  borderColor: color.border.accent.strong,
}
```

### Example: Runtime token lookup

```typescript
import { color } from '@equinor/eds-tokens/ts/color/static/semantic'

// Type-safe access to semantic categories
const categories = ['accent', 'neutral', 'danger'] as const

for (const cat of categories) {
  console.log(color.bg[cat].canvas)
}
```

### Naming Conversion

CSS variable segments are converted to camelCase:

| CSS variable | TypeScript path |
|---|---|
| `--eds-color-bg-accent-canvas` | `color.bg.accent.canvas` |
| `--eds-color-bg-neutral-fill-muted-default` | `color.bg.neutral.fillMuted.default` |
| `--eds-color-text-success-strong-on-emphasis` | `color.text.success.strongOnEmphasis` |
| `--eds-color-border-danger-medium` | `color.border.danger.medium` |

## JavaScript Tokens (Flat)

A flat ES6 export with `SCREAMING_SNAKE_CASE` constants is also available:

```typescript
import {
  BG_ACCENT_CANVAS,
  TEXT_NEUTRAL_STRONG,
  BORDER_DANGER_MEDIUM,
} from '@equinor/eds-tokens/js/color/static/semantic'
```

## Best Practices

- **Be explicit** -- Choose the specific semantic category your element needs
- **Pair carefully** -- Always use matching text and background variables for contrast
- **Never mix approaches** -- Use static consistently, don't mix with dynamic
- **Test contrast** -- Verify all color combinations meet accessibility standards
