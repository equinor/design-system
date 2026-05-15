# Building EDS 2.0 Components

This is the canonical reference for the patterns that go into an EDS 2.0 component. Harness-specific scaffolding commands (`/new-component` in Claude Code, the `new-component` prompt in Copilot, the `eds-component` sub-agent in OpenCode) read this guide rather than restating its content.

For the project-wide conventions (file structure, code style, CSS layering, testing, accessibility, conventional commits), see [`AGENTS.md`](../../AGENTS.md). This guide adds the component-building specifics that are not covered there.

## Table of Contents

- [Foundation Data-Attribute Reference](#foundation-data-attribute-reference)
- [Critical Patterns](#critical-patterns)
  - [`data-color-appearance` applies to the smallest element](#data-color-appearance-applies-to-the-smallest-element)
  - [`data-space-proportions` is calculated from Figma padding](#data-space-proportions-is-calculated-from-figma-padding)
  - [Elements with `data-color-appearance` must set a `color` property](#elements-with-data-color-appearance-must-set-a-color-property)
  - [Disabled state uses disabled tokens, never opacity](#disabled-state-uses-disabled-tokens-never-opacity)
  - [`data-baseline` enables text-box-trim for exact height](#data-baseline-enables-text-box-trim-for-exact-height)
- [File Templates](#file-templates)
  - [`index.ts`](#indexts)
  - [`ComponentName.types.ts`](#componentnametypests)
  - [`ComponentName.tsx`](#componentnametsx)
  - [`componentname.css`](#componentnamecss)
  - [`ComponentName.figma.tsx`](#componentnamefigmatsx)
  - [`ComponentName.test.tsx`](#componentnametesttsx)
  - [`ComponentName.stories.tsx`](#componentnamestoriestsx)
  - [Wiring into the package](#wiring-into-the-package)
- [Real-World References](#real-world-references)
- [Common Mistakes](#common-mistakes)
  - [Color and dynamic tokens](#color-and-dynamic-tokens)
  - [Spacing and layout](#spacing-and-layout)
  - [State management](#state-management)
  - [Typography and height](#typography-and-height)
- [Advanced Patterns](#advanced-patterns)
  - [Outline border + box-shadow focus](#outline-border--box-shadow-focus)
  - [`data-font-family` and `display: block`](#data-font-family-and-display-block)
  - [Text-box-trim for exact heights](#text-box-trim-for-exact-heights)
- [Anti-patterns Checklist](#anti-patterns-checklist)
- [Implementation Status Report](#implementation-status-report)

## Foundation Data-Attribute Reference

Foundation `data-*` attributes drive the dynamic token system. Components should set these directly from values in the Figma design — do not invent new attribute values.

| Attribute                | Purpose             | Valid values                                                    |
| ------------------------ | ------------------- | --------------------------------------------------------------- |
| `data-color-appearance`  | Color theming       | `neutral`, `accent`, `info`, `success`, `warning`, `danger`     |
| `data-selectable-space`  | Spacing scale       | `xs`, `sm`, `md`, `lg`, `xl`                                    |
| `data-space-proportions` | Padding proportions | `squished`, `squared`, `stretched`                              |
| `data-baseline`          | Text baseline trim  | `center`, `grid`                                                |
| `data-font-family`       | Typography family   | `ui`, `header`                                                  |
| `data-font-size`         | Font size           | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl` |
| `data-line-height`       | Line height mode    | `squished`, `default`                                           |
| `data-variant`           | Component-specific  | e.g. `primary`, `secondary`, `ghost` — only when the component  |
|                          |                     | has a visual variant axis like Button                           |

Foundation values are reused across components. Component-specific custom types (like `ButtonVariant`) should only be introduced when the design has a visual variant axis not covered by foundation attributes.

See also [`TOKEN_SYSTEM_GUIDE.md`](./TOKEN_SYSTEM_GUIDE.md) for the underlying token system.

## Critical Patterns

### `data-color-appearance` applies to the smallest element

Apply `data-color-appearance` to the **smallest element** that needs that color, not the component root. Otherwise hover/focus states will inherit the appearance and look wrong.

```tsx
// ✅ CORRECT: only the icon is accent in Figma
<button>
  <span data-color-appearance="accent">
    <Icon data={settings} />
  </span>
  Settings
</button>

// ❌ WRONG: the whole button gets accent — hover will be accent too
<button data-color-appearance="accent">
  <Icon data={settings} />
  Settings
</button>
```

Why it works: dynamic tokens like `--eds-color-bg-fill-emphasis-default` resolve against the nearest ancestor's `data-color-appearance`. Scoping it to the icon span means the button background can still resolve neutrally on hover.

Without `data-color-appearance`, dynamic tokens won't resolve to the correct color.

### `data-space-proportions` is calculated from Figma padding

Compare horizontal vs vertical padding tokens from `figma_get_variable_defs`:

- horizontal = vertical → `squared`
- horizontal > vertical → `stretched`
- horizontal < vertical → `squished`

Example from `figma_get_variable_defs`:

```json
{
  "var(--eds-selectable-space-horizontal)": "16",
  "var(--eds-selectable-space-vertical)": "16"
}
```

→ 16 = 16, so use `data-space-proportions="squared"`.

Never copy this attribute from a similar component without verifying — designs differ.

### Elements with `data-color-appearance` must set a `color` property

A `data-color-appearance` attribute alone has no effect — the element also needs a `color` (or background-color) declaration using a dynamic token, so the token has somewhere to resolve.

```css
/* ✅ CORRECT: dynamic token responds to data-color-appearance */
.eds-component .icon {
  display: flex;
  color: var(--eds-color-bg-fill-emphasis-default);
}
```

### Disabled state uses disabled tokens, never opacity

```css
/* ❌ WRONG: opacity dims everything (text, borders, background) at once */
.eds-component[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
```

Figma specifies exact disabled color tokens. Use them.

```tsx
// If icon is accent when enabled, change to neutral when disabled
{
  icon && (
    <span
      className="eds-component__icon"
      data-color-appearance={disabled ? 'neutral' : 'accent'}
    >
      {icon}
    </span>
  )
}
```

```css
.eds-component[data-disabled] {
  cursor: not-allowed;
}

.eds-component[data-disabled] .eds-component__text {
  color: var(--eds-color-text-disabled);
}

.eds-component[data-disabled] .eds-component__icon {
  color: var(--eds-color-text-disabled);
}
```

How to find the tokens: check `figma_get_variable_defs` for the disabled state, or inspect the disabled variant in `get_design_context`. Look for `bg-disabled`, `border-disabled`, and `text-disabled` tokens.

### `data-baseline` enables text-box-trim for exact height

Without `data-baseline`, the text element uses full line-height — so a component Figma shows as 44 px tall will render taller in code:

```
Padding 16 px top + line-height 20 px + padding 16 px bottom = 52 px ❌
```

Adding `data-baseline="center"` (or `"grid"`) enables `text-box: trim-both ex alphabetic`, which strips line-height overhead so the text occupies only its cap/x-height:

```
Padding 16 px top + trimmed text ~12 px + padding 16 px bottom = 44 px ✓
```

```tsx
<span
  data-font-family="ui"
  data-font-size="md"
  data-line-height="default"
  data-baseline="center"
>
  Menu Item
</span>
```

When to use which:

- `data-baseline="center"` — interactive elements (buttons, menu items): optically centred text
- `data-baseline="grid"` — body text aligned to the 4 px baseline grid
- no `data-baseline` — full line-height box (rare in EDS 2.0)

Sub-pixel rounding (43.99 px → 44 px): if pixel-perfect height matters, add `min-height` while keeping the padding-driven layout:

```css
.eds-component {
  min-height: var(--eds-sizing-selectable-lg);
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
  display: flex;
  align-items: center;
}
```

See `Checkbox/checkbox.css` for a fixed-height example, and `packages/eds-tokens/build/css/typography.css` for the text-box-trim implementation.

## File Templates

These templates are starting points — replace example tokens with the exact ones from `figma_get_variable_defs`. Throughout, `ComponentName` stands for the new component's name (e.g. `Avatar`); the CSS file uses the lowercase form (`avatar.css`).

### `index.ts`

```typescript
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName.types'
```

### `ComponentName.types.ts`

```typescript
import type { HTMLAttributes } from 'react'

/**
 * ComponentName props.
 *
 * Most components use foundation data-attribute values directly.
 * Only define component-specific types if needed (e.g. ButtonVariant for Button).
 */
export type ComponentNameProps = {
  /** Disabled state */
  disabled?: boolean
  // Add component-specific props here
} & HTMLAttributes<HTMLDivElement>
```

Use foundation `data-*` values directly (see [the reference table](#foundation-data-attribute-reference)) unless the component has a true variant axis like Button's `primary | secondary | ghost`.

### `ComponentName.tsx`

Use the forwardRef pattern with a named function (matches Button, Checkbox, Input). Set foundation `data-*` attributes from the Figma design. **Do not import CSS in the component file** — CSS is imported globally via `next/index.css`.

```typescript
import { forwardRef } from 'react'
import type { ComponentNameProps } from './ComponentName.types'

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  function ComponentName({ className, disabled, ...rest }, ref) {
    const classes = ['eds-componentname', className].filter(Boolean).join(' ')
    // lowercase class name: eds-avatar, not eds-Avatar

    return (
      <div
        ref={ref}
        className={classes}
        // Verify each attribute in Figma. See § Critical Patterns above.
        data-color-appearance={/* from Figma — check default AND disabled states */}
        data-selectable-space={/* from Figma */}
        data-space-proportions={/* horizontal vs vertical padding */}
        data-baseline={/* from Figma */}
        data-font-family={/* from Figma */}
        data-font-size={/* from Figma */}
        data-line-height={/* from Figma */}
        data-disabled={disabled || undefined}
        {...rest}
      />
    )
  },
)

ComponentName.displayName = 'ComponentName'
```

### `componentname.css`

Use `@layer eds-components` and data-attribute selectors. Use EXACT `--eds-*` tokens from `figma_get_variable_defs` — never hardcode hex or pixel values.

```css
@layer eds-components {
  .eds-componentname {
    display: inline-flex;
    align-items: center;
    gap: var(--eds-typography-gap-horizontal);

    background-color: var(--eds-color-bg-fill-emphasis-default);
    color: var(--eds-color-text-strong-on-emphasis);
    outline: var(--eds-sizing-stroke-thin) solid var(--eds-color-border-strong);
    outline-offset: calc(-1 * var(--eds-sizing-stroke-thin));
    border-radius: var(--eds-spacing-border-radius-rounded);

    padding-block: var(--eds-selectable-space-vertical);
    padding-inline: var(--eds-selectable-space-horizontal);
  }

  .eds-componentname:hover:not(:disabled) {
    background-color: var(--eds-color-bg-fill-emphasis-hover);
  }

  .eds-componentname:focus-visible {
    box-shadow:
      0 0 0 var(--eds-sizing-stroke-thin) var(--eds-color-bg-canvas),
      0 0 0 calc(var(--eds-sizing-stroke-thin) * 2)
        var(--eds-color-border-focus);
  }

  .eds-componentname[data-disabled] {
    cursor: not-allowed;
  }

  & .icon {
    display: flex;
    /* Dynamic token responds to data-color-appearance — must be set */
    color: var(--eds-color-bg-fill-emphasis-default);
  }
}
```

### `ComponentName.figma.tsx`

Only create this file if a Figma URL was provided.

```typescript
import figma from '@figma/code-connect'
import { ComponentName } from '.'

figma.connect(ComponentName, 'FIGMA_URL_HERE', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: ({ variant, disabled }) => (
    <ComponentName variant={variant} disabled={disabled} />
  ),
})
```

### `ComponentName.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { ComponentName } from '.'

describe('ComponentName (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ComponentName data-testid="eds-componentname" />)
      expect(screen.getByTestId('eds-componentname')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<ComponentName data-testid="eds-componentname" className="custom" />)
      expect(screen.getByTestId('eds-componentname')).toHaveClass(
        'eds-componentname',
        'custom',
      )
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<ComponentName ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('spreads additional props', () => {
      render(<ComponentName data-testid="test" data-custom="value" />)
      expect(screen.getByTestId('test')).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
```

### `ComponentName.stories.tsx`

```typescript
import type { Meta, StoryFn } from '@storybook/react-vite'
import { ComponentName, type ComponentNameProps } from '.'

const meta: Meta<typeof ComponentName> = {
  title: 'EDS 2.0 (beta)/ComponentName',
  component: ComponentName,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** — this component is under active development.

\`\`\`tsx
import { ComponentName } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<ComponentNameProps> = (args) => {
  return <ComponentName {...args} />
}
```

### Wiring into the package

Add the component to `packages/eds-core-react/src/components/next/index.ts`:

```typescript
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

Add the CSS to `packages/eds-core-react/src/components/next/index.css`:

```css
@import './ComponentName/componentname.css';
```

## Real-World References

Read the source — it's the reference, not a snapshot in this file.

- `packages/eds-core-react/src/components/next/Button/` — variants, color-appearance disabled fallback, full foundation attributes
- `packages/eds-core-react/src/components/next/Input/` — container sets the color context for children
- `packages/eds-core-react/src/components/next/Icon/` — size inheritance via parent's `data-font-size`

## Common Mistakes

### Color and dynamic tokens

**Missing `data-color-appearance` on an icon that's accent in Figma.** The icon renders with no color context, so the dynamic token resolves to whatever the parent provides (likely wrong).

**`data-color-appearance` placed on the whole button.** Hover/focus states inherit the appearance and the button reads as accent everywhere, not just on the icon. Move the attribute to the icon span.

**Using static tokens instead of dynamic ones.**

```css
/* ❌ Only works for the accent theme */
.eds-component {
  background: var(--eds-color-bg-accent-fill-emphasis-default);
}

/* ✅ Adapts to data-color-appearance */
.eds-component {
  background: var(--eds-color-bg-fill-emphasis-default);
}
```

### Spacing and layout

**Hardcoded pixel values.**

```css
/* ❌ Breaks density/spacing modes */
.eds-component {
  padding: 12px 8px;
}

/* ✅ Foundation token responds to data-selectable-space */
.eds-component {
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
}
```

**Component props not mapped to foundation `data-*` attributes.**

```tsx
// ❌ size prop has no effect
function MyComponent({ size }: { size: 'small' | 'large' }) {
  return <div>…</div>
}

// ✅ map to the foundation scale
const SIZE_MAPPING = { small: 'sm', large: 'lg' } as const

function MyComponent({ size }: { size: 'small' | 'large' }) {
  return <div data-selectable-space={SIZE_MAPPING[size]}>…</div>
}
```

### State management

See [Disabled state uses disabled tokens, never opacity](#disabled-state-uses-disabled-tokens-never-opacity) above. Opacity is the most common anti-pattern for disabled.

### Typography and height

See [`data-baseline` enables text-box-trim for exact height](#data-baseline-enables-text-box-trim-for-exact-height). Missing `data-baseline` is the most common cause of a component rendering taller than the Figma frame.

## Advanced Patterns

These patterns cover specific edge cases. Most components don't need them — read Button/Input/Icon first.

### Outline border + box-shadow focus

When a component needs exact height matching (36 px, 44 px) without the border affecting the box model, use `outline` with a negative offset for the border, and `box-shadow` for the focus ring.

```css
.eds-component {
  outline: var(--eds-sizing-stroke-thin) solid var(--eds-color-border-subtle);
  outline-offset: calc(-1 * var(--eds-sizing-stroke-thin));
  border-radius: var(--eds-spacing-border-radius-rounded);
}

.eds-component:hover {
  outline-color: var(--eds-color-border-strong);
}

.eds-component:focus-within {
  outline-color: var(--eds-color-border-strong);
  /* outline is already in use for the border, so the focus ring uses box-shadow */
  box-shadow:
    0 0 0 var(--eds-sizing-stroke-thin) var(--eds-color-bg-canvas),
    0 0 0 calc(var(--eds-sizing-stroke-thin) * 2) var(--eds-color-border-focus);
}
```

See `Input/input.css` for a working example.

### `data-font-family` and `display: block`

The `[data-font-family]` selector sets `display: block`, which breaks flex layouts. Put `data-font-family` only on text elements, not on flex containers.

```tsx
// Container handles layout — no data-font-family
<div
  data-color-appearance={tone}
  data-font-size="md"
  data-selectable-space="md"
>
  {/* Text element gets data-font-family */}
  <input data-font-family="ui" data-font-size="md" />
</div>
```

See `Button/Button.tsx` and `Input/Input.tsx` for examples.

### Text-box-trim for exact heights

Same mechanism as [`data-baseline`](#data-baseline-enables-text-box-trim-for-exact-height). The fixed-height variant is:

```css
.eds-component {
  height: var(--eds-sizing-selectable-lg);
  display: flex;
  align-items: center;
  padding-inline: var(--eds-selectable-space-horizontal);
}
```

See `Checkbox/checkbox.css` and `packages/eds-tokens/build/css/typography.css`.

## Anti-patterns Checklist

A quick checklist to scan before considering a component done:

- Calling `figma_get_design_context` alone without `figma_get_variable_defs` for each state
- Using `opacity` for disabled states instead of `--eds-color-text-disabled` / `--eds-color-border-disabled`
- Missing `data-baseline` on text spans — height won't match Figma
- Missing `data-color-appearance` when Figma shows accent/danger colours — dynamic tokens won't resolve
- Missing data-attributes in TSX — CSS tokens have no context to apply correct values
- Static colour tokens (`--eds-color-bg-accent-*`) instead of dynamic (`--eds-color-bg-*`)
- Hardcoded pixel values instead of `--eds-selectable-space-*` / `--eds-typography-gap-horizontal`
- `data-font-family` on a flex container (breaks layout via `display: block`)
- Copying data-attribute values from a similar component without verifying Figma
- EDS 1.0 tokens (`--eds-color-interactive-primary`, `--eds-color-text-error`)
- Re-implementing from scratch instead of composing `Field.Label`, `Icon`, `Input`, `Button`

## Implementation Status Report

After creating all files, the agent should output a short `## Implementation notes` section. Only include categories that apply:

- **✅ From Figma** — key things verified and implemented from the Figma design
- **⚠️ Inherited, not in Figma** — behaviour or UI that comes from a base component (e.g. `Input`, `Field`) but isn't shown in this component's Figma frame. Flag so the reviewer can decide whether it stays or is suppressed
- **🔍 Assumptions** — decisions made without Figma confirmation (guessed tokens, icons, behaviour from old component)
- **❓ Not implemented** — Figma states or features that were skipped or only partially handled
- **🚧 TODOs** — known gaps needing follow-up
