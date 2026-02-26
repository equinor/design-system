---
applyTo: '**'
---

# Dynamic Color Approach

The dynamic approach uses abstraction with variable modes in Figma and data attributes in code to define the semantic category at runtime. The same component can work with different semantic meanings without changing code.

:::tip

See [colors.md](./colors.md) for core color system concepts.

:::

## Concept

Variables use abstract role names (background, text, border) without specifying the semantic category. The semantic category is applied using the `data-color-appearance` attribute.

## Naming Pattern

Dynamic variable names follow this pattern:

```
--eds-color-[role]-[priority]-[state]
```

**Examples:**

- `--eds-color-bg-fill-emphasis-default`
- `--eds-color-text-strong-on-emphasis`
- `--eds-color-border-subtle`

Note: No semantic category (accent, neutral, etc.) in the variable name itself.

## CSS Variables

### Import

```css
@import '@equinor/eds-tokens/css/variables';
```

### Setting Appearance

Use the `data-color-appearance` attribute to set the semantic category:

```html
<!-- Accent appearance -->
<button data-color-appearance="accent">Primary</button>

<!-- Neutral appearance (default) -->
<button data-color-appearance="neutral">Secondary</button>

<!-- Success appearance -->
<button data-color-appearance="success">Confirm</button>

<!-- Warning appearance -->
<button data-color-appearance="warning">Caution</button>

<!-- Danger appearance -->
<button data-color-appearance="danger">Delete</button>

<!-- Info appearance -->
<button data-color-appearance="info">Info</button>
```

### Usage

Use abstract role variables in your CSS:

```css
.button {
  background-color: var(--eds-color-bg-fill-emphasis-default);
  color: var(--eds-color-text-strong-on-emphasis);
  border: 1px solid var(--eds-color-border-strong);
}

.button:hover {
  background-color: var(--eds-color-bg-fill-emphasis-hover);
}

.button:active {
  background-color: var(--eds-color-bg-fill-emphasis-active);
}
```

Now the same component works with any appearance:

```html
<!-- All use the same CSS class but different appearances -->
<button class="button" data-color-appearance="accent">Primary</button>
<button class="button" data-color-appearance="neutral">Secondary</button>
<button class="button" data-color-appearance="success">Success</button>
```

## Appearance Values

Use one of these values for the `data-color-appearance` attribute:

- `neutral` (default) -- Base and supporting colors
- `accent` -- Brand and highlight colors
- `success` -- Positive or confirming feedback
- `info` -- Communication and neutral messages
- `warning` -- Cautionary states
- `danger` -- Destructive or error states

## JavaScript Tokens (Flat)

The dynamic color tokens are available as flat ES6 exports with `SCREAMING_SNAKE_CASE` constants. These resolve to the concrete color values for each appearance.

### Import

```typescript
import {
  BG_FILL_EMPHASIS_DEFAULT,
  TEXT_STRONG_ON_EMPHASIS,
  BORDER_STRONG,
} from '@equinor/eds-tokens/js/color/dynamic/accent'
```

Each appearance has its own file:

- `@equinor/eds-tokens/js/color/dynamic/accent`
- `@equinor/eds-tokens/js/color/dynamic/neutral`
- `@equinor/eds-tokens/js/color/dynamic/success`
- `@equinor/eds-tokens/js/color/dynamic/info`
- `@equinor/eds-tokens/js/color/dynamic/warning`
- `@equinor/eds-tokens/js/color/dynamic/danger`

:::note

The dynamic approach does **not** include a nested TypeScript format. Dynamic tokens are designed to be resolved at runtime via CSS variables and the `data-color-appearance` attribute. Use the CSS variables for dynamic usage and the JS constants when you need resolved values for a specific appearance.

:::

## Best Practices

- **Use abstraction** -- Write CSS once, reuse with different appearances
- **Set appearance semantically** -- Use the attribute based on context, not styling needs
- **Keep appearance stable** -- Don't change appearances based on hover/active states
- **Test all appearances** -- Verify your component works with all appearance values
- **Document requirements** -- Make clear which appearances work with your component
- **Never mix approaches** -- Use dynamic consistently, don't mix with static
