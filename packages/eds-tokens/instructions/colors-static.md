---
applyTo: '**'
---

# Colour tokens in CSS and TypeScript

Every 3.x colour token carries its tone in its name, so a component binds to the tone it needs directly. This is the only colour approach in 3.x: the 2.x dynamic approach, with `data-color-appearance`, was dropped ([ADR-0016](https://github.com/equinor/design-system/blob/main/documentation/adr/0016-colour-approach-for-eds-2.md) D1).

> See [colors.md](./colors.md) for how to choose a token, which foreground goes on which background, and the contrast rules.

## One name in Figma, CSS and TypeScript

| Where      | How it is written                                 |
| ---------- | ------------------------------------------------- |
| Figma      | `background.non-interactive.accent.muted`         |
| CSS        | `--eds-background-non-interactive-accent-muted`   |
| TypeScript | `semantic.background.nonInteractive.accent.muted` |

CSS is `--eds-` followed by the dotted name, with hyphens for the dots. TypeScript uses the dotted name with each segment in camelCase. If the pattern and the [token reference](https://eds.equinor.com/docs/Next/foundation/colour/reference/) ever disagree, the reference is right.

## CSS variables

### Import

Import the bundle once in the application:

```css
@import '@equinor/eds-tokens/next/css/variables.css';
```

The bundle holds the semantic colours for light and dark, inside `@layer eds-tokens`, so an unlayered `:root { --eds-…: … }` in the application overrides a token.

### Usage

```css
.button-primary {
  background-color: var(--eds-background-interactive-accent-emphasis-default);
  color: var(--eds-text-on-emphasis-accent);
}

.alert-warning {
  background-color: var(--eds-background-non-interactive-warning-muted);
  color: var(--eds-text-on-muted-warning);
  border-left: 4px solid var(--eds-border-non-interactive-warning-emphasis);
}

.card {
  background-color: var(--eds-background-surface);
  color: var(--eds-text-primary);
}
```

### Interactive states

Interactive levels come with a `default`, `hover` and `pressed` token. Use all three:

```css
.button-primary {
  background-color: var(--eds-background-interactive-accent-emphasis-default);
  color: var(--eds-text-on-emphasis-accent);

  &:hover {
    background-color: var(--eds-background-interactive-accent-emphasis-hover);
  }

  &:active {
    background-color: var(--eds-background-interactive-accent-emphasis-pressed);
  }
}
```

The foreground for an emphasis fill, `text.on-emphasis.<tone>`, is the same token in every state; check its contrast against all three fills.

## TypeScript tokens

The tokens also ship as TypeScript objects for places a CSS custom property cannot reach, such as a chart library, a canvas, an email template or React Native. The values are hex, generated from the same source as the CSS.

### Import

```typescript
import { semantic } from '@equinor/eds-tokens/next/ts/semantic/light'

semantic.background.interactive.accent.emphasis.default // '#21767e'
```

Each module is imported directly; there is no barrel. The modules are raw `.ts`, so they need a TypeScript-aware consumer. The objects are `as const`, and each module also exports its type (`Semantic`), so a name that does not exist is a compile error.

### Colour scheme

In TypeScript there is no attribute to switch the scheme. `semantic/light` and `semantic/dark` are separate objects, and you choose which one to use:

```typescript
import { semantic as light } from '@equinor/eds-tokens/next/ts/semantic/light'
import { semantic as dark } from '@equinor/eds-tokens/next/ts/semantic/dark'

const tokens = prefersDark ? dark : light
```

Prefer CSS custom properties wherever they work.

### Naming conversion

| CSS variable                                       | TypeScript path                                       |
| -------------------------------------------------- | ----------------------------------------------------- |
| `--eds-background-canvas`                          | `semantic.background.canvas`                          |
| `--eds-background-interactive-neutral-muted-hover` | `semantic.background.interactive.neutral.muted.hover` |
| `--eds-background-non-interactive-danger-emphasis` | `semantic.background.nonInteractive.danger.emphasis`  |
| `--eds-text-on-emphasis-success`                   | `semantic.text.onEmphasis.success`                    |
| `--eds-border-interactive-focus`                   | `semantic.border.interactive.focus`                   |

From `next/ts/`, import `semantic` only. The other modules hold the layers it is resolved from and can change in any release.

## Best practices

- **Bind to the semantic names.** Never use the numbered palette (`--eds-accent-9`) or a copied hex value; neither follows the colour scheme.
- **Pair by the background.** Take the foreground named after the fill's level and tone, or `text.primary` and its siblings on the surface and the canvas (see [colors.md](./colors.md#foreground-pairing)).
- **Check contrast in both schemes and every state.** WCAG 2.1 AA is the minimum; the APCA targets are what EDS aims for. Report both the ratio and the Lc.
- **Do not mix in 2.x names.** The `--eds-color-*` names in `@equinor/eds-tokens/css/variables` are frozen 2.x tokens.
