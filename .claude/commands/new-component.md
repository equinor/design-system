# Create New EDS 2.0 Component

Create a new EDS 2.0 component named **$ARGUMENTS** in `packages/eds-core-react/src/components/next/`.

> **Note:** CSS class names must be lowercase. For component `Avatar`, use class `eds-avatar` (not `eds-Avatar`).

## Contents

1. [Figma Design Integration](#figma-design-integration)
2. [Check for Existing Components](#check-for-existing-components)
3. [Implementation Instructions](#instructions)
4. [Key Patterns](#key-patterns)
5. [Real-World Examples](#real-world-examples)
6. [Common Mistakes](#common-mistakes--how-to-fix-them)
7. [Advanced Patterns](#advanced-patterns)
8. [Anti-patterns](#anti-patterns)

## Figma Design Integration

**Before creating the component**, ask the user for a Figma URL to the component design.

If a Figma URL is provided, use these MCP tools to extract the design:

1. **Get design context**: Call `figma_get_design_context` with the Figma URL to understand the component structure
2. **Get screenshot**: Call `figma_get_screenshot` to see the visual design
3. **Extract tokens for EACH state**: Call `figma_get_variable_defs` for:
   - Default state
   - Hover state
   - Focus state
   - Disabled state
   - Any other states visible in the design

**Critical:** Use the EXACT variable names from `figma_get_variable_defs`. Never assume tokens based on semantics or copy from similar components without verifying.

> **⚠️ CRITICAL - Check Figma Color Modes:** When Figma shows colors using accent/danger/neutral modes (e.g., accent blue icons, red error text), you MUST set `data-color-appearance` on those specific elements. Without this attribute, dynamic tokens won't resolve to the correct colors. See detailed guidance in the [TSX section](#argumentstsx) below.

## Check for Existing Components

### 1. **Check EDS 2.0 Components to Reuse**

Check `packages/eds-core-react/src/components/next/index.ts` for existing components that can be composed:

- **Field** - Field.Label, Field.Description, Field.HelperMessage for form fields
- **Icon** - For icons (use `@equinor/eds-icons` data)
- **Input** - For text input elements
- **Button** - For action buttons
- **Typography** - TypographyNext for text styling

**Always prefer composing existing components over creating new elements from scratch.**

### 2. **Smart Feature Parity (If Old Component Exists)**

**Goal:** Implement everything visible in Figma. Only add TODOs for complex behavioral features not shown in designs.

**Key Principles:**
- **Figma is the source of truth** for all visual features and states
- **Old component is only for behavioral awareness** (keyboard nav, focus management)
- Use modern patterns (`:focus-visible`, CSS tokens, simple state)

**Workflow:**

1. **Check if old component exists**: `packages/eds-core-react/src/components/$ARGUMENTS/`
2. **Read for behavioral patterns only** - Don't copy implementation
3. **Implement all visual features from Figma directly**
4. **Add TODO only for complex behaviors** not visible in Figma (keyboard navigation, focus trap, positioning libraries)

**Decision Guide:**
- ✅ Visible in Figma (icons, states, variants) → **Implement directly**
- 📝 Complex behavior not in Figma (keyboard nav, focus trap) → **Add TODO if needed**
- ❌ Old patterns (styled-components, portals) → **Skip, use modern approach**

**Modern Alternatives:**
- Custom focus indicators → `:focus-visible`
- Portal components → `position: fixed`
- Styled-components → CSS tokens + data-attrs
- Complex state → Simple `useState`/`useRef`

## Instructions

1. **Create the component folder** with all required files:

```
$ARGUMENTS/
  index.ts
  $ARGUMENTS.tsx
  $ARGUMENTS.types.ts
  $ARGUMENTS_LOWERCASE.css   (e.g., avatar.css for Avatar component)
  $ARGUMENTS.figma.tsx       (Figma Code Connect - if Figma URL provided)
  $ARGUMENTS.test.tsx
  $ARGUMENTS.stories.tsx
```

> **Note:** The CSS filename must be lowercase (e.g., `avatar.css` for `Avatar`, `button.css` for `Button`).

2. **Use these exact patterns from the codebase:**

### index.ts

```typescript
export { $ARGUMENTS } from './$ARGUMENTS'
export type { $ARGUMENTSProps } from './$ARGUMENTS.types'
```

### $ARGUMENTS.types.ts

**Foundation Data-Attribute Values** (from `/documentation/how-to/TOKEN_SYSTEM_GUIDE.md`):

- `data-color-appearance`: `'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'`
- `data-selectable-space`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`
- `data-space-proportions`: `'squished' | 'squared' | 'stretched'`
- `data-font-size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'`
- `data-font-family`: `'ui' | 'header'`
- `data-line-height`: `'squished' | 'default' | 'spacious'`

Use foundation values directly unless the component needs custom variants (like Button's 'primary' | 'secondary' | 'ghost').

```typescript
import type { HTMLAttributes } from 'react'

/**
 * Component props
 *
 * Most components should use foundation data-attribute values directly.
 * Only define component-specific types if needed (e.g., ButtonVariant for Button).
 */
export type $ARGUMENTSProps = {
  /** Disabled state */
  disabled?: boolean
  // Add component-specific props here
} & HTMLAttributes<HTMLDivElement>
```

### $ARGUMENTS.tsx

Use the forwardRef pattern with named function (matches Button, Checkbox, Input).

**Critical**: Set foundation data-attributes to enable dynamic token styling. The CSS tokens like `--eds-color-bg-fill-emphasis-default` change their values based on these attributes.

**Note:** Do NOT import CSS in the component file. CSS is imported globally via `index.css`.

```typescript
import { forwardRef } from 'react'
import type { $ARGUMENTSProps } from './$ARGUMENTS.types'

export const $ARGUMENTS = forwardRef<HTMLDivElement, $ARGUMENTSProps>(
  function $ARGUMENTS({ className, disabled, ...rest }, ref) {
    const classes = ['eds-$ARGUMENTS', className].filter(Boolean).join(' ')
    // ^ IMPORTANT: Use lowercase (eds-avatar, not eds-Avatar)

    return (
      <div
        ref={ref}
        className={classes}
        // ⚠️ ALWAYS verify in Figma, NEVER copy from other components
        data-color-appearance={/* from Figma — ⚠️ check BOTH default AND disabled state, often changes to 'neutral' */}
        data-selectable-space={/* from Figma */}
        data-space-proportions={/* from Figma */}
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

$ARGUMENTS.displayName = '$ARGUMENTS'
```

> **⚠️ CRITICAL - Icons with disabled state:** If your component has icons with accent/danger color, you MUST change `data-color-appearance` when disabled. Check Figma's disabled state to see if icons change color:
> ```tsx
> {icon && (
>   <span
>     className="my-component__icon"
>     data-color-appearance={disabled ? 'neutral' : 'accent'}
>   >
>     {icon}
>   </span>
> )}
> ```
> Then in CSS, set the disabled color from Figma:
> ```css
> .my-component__icon {
>   color: var(--eds-color-bg-fill-emphasis-default);
> }
> .my-component[data-disabled] .my-component__icon {
>   color: var(--eds-color-border-medium); /* From Figma disabled state */
> }
> ```

**When to use each data-attribute:**

1. **Interactive components** (buttons, inputs, selects): Add `data-color-appearance`, `data-selectable-space`, `data-space-proportions`
2. **Text/typography**: Add `data-font-size`, `data-font-family`, `data-line-height`
3. **State-based**: Add `data-disabled`, `data-invalid`, `data-readonly` conditionally
4. **Custom variants**: Only add `data-variant` if the component has visual variants like Button (primary/secondary/ghost)
5. **Color modes**: Add `data-color-appearance="accent"` to elements using accent colors in Figma, `data-color-appearance="danger"` for error states, etc.

**CRITICAL - Color Appearance Attribute:**

⚠️ Check Figma for color modes! Apply `data-color-appearance` to **specific elements** that use that color, not the whole component:

```tsx
// ✅ CORRECT: Only icon is accent in Figma
<button>
  <span data-color-appearance="accent">
    <Icon data={settings} />
  </span>
  Settings
</button>

// ❌ WRONG: Entire button gets accent (hover will be accent too!)
<button data-color-appearance="accent">
  <Icon data={settings} />
  Settings
</button>

// ✅ CORRECT: Error text is red in Figma
<div>
  <span data-color-appearance="danger">
    Error: Invalid input
  </span>
</div>
```

**Key principle**: Apply `data-color-appearance` to the **smallest element** that needs that color. This ensures:

- Hover states stay neutral (gray) while icons stay accent (blue)
- Only the specific element uses that color mode
- Dynamic tokens resolve correctly for each element

**Without `data-color-appearance`, dynamic tokens won't resolve to the correct color!**

> **⚠️ CRITICAL:** Never copy data-attributes from similar components. Always verify from Figma:
>
> **`data-space-proportions`** - Calculate from Figma padding tokens:
> - Compare `--eds-selectable-space-horizontal` vs `--eds-selectable-space-vertical`
> - If horizontal = vertical (e.g., 16px = 16px) → `"squared"`
> - If horizontal > vertical (e.g., 24px > 16px) → `"stretched"`
> - If horizontal < vertical (e.g., 12px < 16px) → `"squished"`
>
> Example from `figma_get_variable_defs`:
> ```json
> {
>   "var(--eds-selectable-space-horizontal)": "16",
>   "var(--eds-selectable-space-vertical)": "16"
> }
> ```
> → 16 = 16, so use `data-space-proportions="squared"`
>
> **`data-line-height`** - Check line-height mode (squished/default/spacious)
>
> **`data-selectable-space`** - Check padding size (sm=8px, md=16px, lg=24px)

### $ARGUMENTS_LOWERCASE.css (e.g., avatar.css)

Use `@layer eds-components` and data-attribute selectors (matches button.css, checkbox.css).

**Important:**

- CSS class names should be lowercase (e.g., `eds-avatar` not `eds-Avatar`)
- **CRITICAL: Use EXACT `--eds-*` tokens from `figma_get_variable_defs`** - never hardcode hex values or assume token names
- Always call `figma_get_variable_defs` for each component state and use the exact variable names returned
- **If it's not in `figma_get_variable_defs`, don't hardcode it.** Layout dimensions (width, height, x, y) from Figma are for positioning instances, not CSS requirements.
- **Use EDS 2.0 tokens only** - see `packages/eds-tokens/css/variables/` for available tokens

**EDS 2.0 Token Examples (correct):**

- `--eds-color-bg-fill-emphasis-default` (NOT `--eds-color-interactive-primary`)
- `--eds-color-text-subtle` (NOT `--eds-color-text-static-icons`)
- `--eds-color-border-strong` (NOT `--eds-color-text-error`)
- `--eds-selectable-space-vertical` / `--eds-selectable-space-horizontal`
- `--eds-typography-*` tokens for font sizing

**Data Attributes for Styling Modes:**
Components use data attributes to enable dynamic token-based styling:

| Attribute                | Purpose             | Values                                         |
| ------------------------ | ------------------- | ---------------------------------------------- |
| `data-variant`           | Visual variant      | component-specific (primary, secondary, ghost) |
| `data-selectable-space`  | Spacing mode        | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`            |
| `data-space-proportions` | Padding proportions | `squished`, `squared`, `stretched`             |
| `data-baseline`          | Text baseline trim  | `center`, `grid`                               |
| `data-font-family`       | Typography family   | `ui`, `body`                                   |
| `data-font-size`         | Font size           | `xs`, `sm`, `md`, `lg`, `xl`                   |
| `data-line-height`       | Line height mode    | `squished`, `default`, `spacious`              |
| `data-color-appearance`  | Color theming       | `neutral`, `accent`, `warning`, `danger`       |

**CSS Comments:**
Keep minimal. Only comment: complex calculations, layout tricks, deviations from expected behavior, or TODO notes. Skip obvious headers and self-explanatory properties.

**Hiding Browser Default UI:**
Before finalizing, check if the component uses any native HTML elements that have built-in browser UI (e.g. buttons, arrows, indicators). Then check Figma — if the design provides a custom replacement, hide the native one and comment why. If Figma doesn't address it, prefer keeping native functionality for accessibility.

**Example CSS Template:**

```css
@layer eds-components {
  .eds-$ARGUMENTS {
    /* Use EXACT tokens from figma_get_variable_defs - NO hardcoded values! */
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

  .eds-$ARGUMENTS:hover:not(:disabled) {
    background-color: var(--eds-color-bg-fill-emphasis-hover);
  }

  /* Focus ring example — always verify stroke width, color, and gap background in Figma.
     outline is used for border above, so box-shadow is used for the focus ring instead. */
  .eds-$ARGUMENTS:focus-visible {
    box-shadow:
      0 0 0 var(--eds-sizing-stroke-thin) var(--eds-color-bg-canvas),
      0 0 0 calc(var(--eds-sizing-stroke-thin) * 2) var(--eds-color-border-focus);
  }

  .eds-$ARGUMENTS[data-disabled] {
    cursor: not-allowed;
  }

  /* CRITICAL: Elements with data-color-appearance MUST have color property */
  .eds-$ARGUMENTS__icon {
    display: flex;
    color: var(--eds-color-bg-fill-emphasis-default); /* Dynamic token responds to data-color-appearance */
  }
}
```

> **Note:** This is a simplified template. Always use exact tokens from Figma, keep comments minimal (only non-obvious things), and **NEVER use hardcoded pixel values** (like `2px`, `8px`) - use tokens or calc() expressions.

**Key CSS patterns:**

- **ALWAYS use exact tokens from `figma_get_variable_defs`** - Don't guess or copy from similar components
- **NO hardcoded pixel values** - Never `height: 44px` or `gap: 8px` - use tokens or let padding + text-box-trim create natural height
- **Elements with `data-color-appearance` MUST have `color` property** - Set `color: var(--eds-color-bg-fill-emphasis-default)` so dynamic token responds to the attribute
- **Dynamic tokens** like `--eds-color-bg-fill-emphasis-default` adapt to `data-color-appearance` (accent/neutral/danger)
- **Spacing tokens** like `--eds-selectable-space-vertical` adapt to `data-selectable-space` (sm/md/lg)
- **Use attribute selectors** for state: `[data-disabled]`, `[data-variant='primary']`
- **Use calc() for computed values** - Example: `outline-offset: calc(-1 * var(--eds-sizing-stroke-thin))`
- **Check Figma for shadows** - EDS 2.0 has NO shadow tokens; only add `box-shadow` if visible in Figma screenshot

> **Advanced Topics:** For outline borders with box-shadow focus, typography display:block issues, and text-box-trim patterns, see the [Advanced Patterns](#advanced-patterns) section at the end. For most components, start simple and refer to existing component implementations (Button, Input, Icon).

### $ARGUMENTS.figma.tsx (Figma Code Connect)

Only create this file if a Figma URL was provided.

```typescript
import figma from '@figma/code-connect'
import { $ARGUMENTS } from '.'

figma.connect($ARGUMENTS, 'FIGMA_URL_HERE', {
  props: {
    // Map Figma properties to component props
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: ({ variant, disabled }) => (
    <$ARGUMENTS variant={variant} disabled={disabled} />
  ),
})
```

### $ARGUMENTS.test.tsx

Use describe blocks matching Button.test.tsx structure:

```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { $ARGUMENTS } from '.'

describe('$ARGUMENTS (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<$ARGUMENTS data-testid="eds-$ARGUMENTS" />)
      expect(screen.getByTestId('eds-$ARGUMENTS')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<$ARGUMENTS data-testid="eds-$ARGUMENTS" className="custom" />)
      // IMPORTANT: Use lowercase class name (eds-avatar, not eds-Avatar)
      expect(screen.getByTestId('eds-$ARGUMENTS')).toHaveClass('eds-$ARGUMENTS', 'custom')
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<$ARGUMENTS ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('spreads additional props', () => {
      render(<$ARGUMENTS data-testid="test" data-custom="value" />)
      expect(screen.getByTestId('test')).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<$ARGUMENTS data-testid="eds-$ARGUMENTS" />)
      expect(screen.getByTestId('eds-$ARGUMENTS')).toHaveAttribute('data-variant', 'primary')
    })

    it('renders secondary variant', () => {
      render(<$ARGUMENTS data-testid="eds-$ARGUMENTS" variant="secondary" />)
      expect(screen.getByTestId('eds-$ARGUMENTS')).toHaveAttribute('data-variant', 'secondary')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<$ARGUMENTS />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
```

### $ARGUMENTS.stories.tsx

```typescript
import type { Meta, StoryFn } from '@storybook/react-vite'
import { $ARGUMENTS, type $ARGUMENTSProps } from '.'

const meta: Meta<typeof $ARGUMENTS> = {
  title: 'EDS 2.0 (beta)/$ARGUMENTS',
  component: $ARGUMENTS,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { $ARGUMENTS } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<$ARGUMENTSProps> = (args) => {
  return <$ARGUMENTS {...args} />
}
```

3. **Export from next/index.ts** - Add to `packages/eds-core-react/src/components/next/index.ts`:

```typescript
export { $ARGUMENTS } from './$ARGUMENTS'
export type { $ARGUMENTSProps } from './$ARGUMENTS'
```

4. **Import CSS in next/index.css** - Add to `packages/eds-core-react/src/components/next/index.css`:

```css
@import './$ARGUMENTS/$ARGUMENTS_LOWERCASE.css';
```

> **Example:** For `Avatar` component: `@import './Avatar/avatar.css';`

## Key Patterns

- **forwardRef**: All /next components use forwardRef with named function
- **displayName**: Always add `ComponentName.displayName = 'ComponentName'` after component definition
- **Data attributes**: Use `data-*` for styling variants and modes (see CSS section for attribute list)
- **CSS layer**: Always wrap in `@layer eds-components { }`
- **EDS 2.0 Tokens**: Use `--eds-*` CSS custom properties from Figma or `packages/eds-tokens/css/variables/`
- **Dynamic tokens**: Prefer dynamic tokens (e.g., `--eds-selectable-space-vertical`) over static values
- **Class naming**: Lowercase with `eds-` prefix (e.g., `eds-button`, `eds-avatar`)
- **No default exports**: Only use named exports (except story meta)
- **Composition**: Reuse existing /next components (Field, Icon, Input, Button) instead of creating from scratch

## Real-World Examples

See how existing components use data-attributes and dynamic tokens:

### Button (packages/eds-core-react/src/components/next/Button/)

```tsx
// Button.tsx - Sets multiple foundation data-attributes
<button
  data-variant={variant} // Component-specific
  data-selectable-space={selectableSpace} // Foundation: md, lg, sm
  data-space-proportions="squished" // Foundation
  data-font-family="ui" // Foundation
  data-font-size={typographySize} // Foundation
  data-line-height="squished" // Foundation
  data-color-appearance={disabled ? 'neutral' : tone} // Foundation: accent, danger
/>
```

```css
/* button.css - Dynamic tokens respond to data-attributes */
.eds-button[data-variant='primary'] {
  background-color: var(
    --eds-color-bg-fill-emphasis-default
  ); /* Changes with data-color-appearance */
}

.eds-button:hover:not(:disabled) {
  background-color: var(
    --eds-color-bg-fill-emphasis-hover
  ); /* Also responds to data-color-appearance */
}
```

### Input (packages/eds-core-react/src/components/next/Input/)

```tsx
// Input.tsx - Container sets color context for child elements
<div
  data-color-appearance={tone} // 'danger' when invalid, 'neutral' otherwise
  data-font-size="md"
  data-selectable-space="sm"
  data-space-proportions="squished"
>
  <input data-font-family="ui" data-font-size="md" />
</div>
```

### Icon (packages/eds-core-react/src/components/next/Icon/)

```tsx
// Icon.tsx - Size inherits from parent's data-font-size
<svg data-icon-size={size} /> // Only set if explicit size prop provided
```

```css
/* icon.css - Inherits size from parent's typography tokens */
.icon {
  font-size: var(--eds-typography-icon-size, 1.5em); /* Inherits from parent */
  width: 1em;
  height: 1em;
}
```

## Common Mistakes & How to Fix Them

### Color & Dynamic Tokens

#### ❌ WRONG: Missing data-color-appearance on icon

```tsx
// Icon appears in Figma as accent blue, but no data-attribute!
<button className="menu-item">
  <Icon data={settings} />
  Settings
</button>
```

```css
.menu-item {
  color: var(
    --eds-color-bg-fill-emphasis-default
  ); /* No context - will be wrong color! */
}
```

### ❌ WRONG: data-color-appearance on entire button

```tsx
// Entire button becomes accent - hover will be accent too!
<button className="menu-item" data-color-appearance="accent">
  <Icon data={settings} />
  Settings
</button>
```

### ✅ RIGHT: data-color-appearance only on icon wrapper

```tsx
// Only icon is accent in Figma, hover stays neutral
<button className="menu-item">
  <span data-color-appearance="accent">
    <Icon data={settings} />
  </span>
  Settings
</button>
```

```css
.menu-item span {
  color: var(
    --eds-color-bg-fill-emphasis-default
  ); /* Resolves to accent blue! */
}

.menu-item:hover {
  background: var(
    --eds-color-bg-fill-muted-default
  ); /* Resolves to neutral gray! */
}
```

#### ❌ WRONG: Using static tokens instead of dynamic

```css
.my-component {
  background: var(
    --eds-color-bg-accent-fill-emphasis-default
  ); /* Only works for accent */
}
```

### ✅ RIGHT: Use dynamic tokens that respond to data-color-appearance

```css
.my-component {
  background: var(
    --eds-color-bg-fill-emphasis-default
  ); /* Adapts to accent/neutral/danger */
}
```

### Spacing & Layout

#### ❌ WRONG: Hardcoded spacing values

```css
.my-component {
  padding: 12px 8px; /* Breaks responsive spacing */
}
```

### ✅ RIGHT: Use foundation spacing tokens

```tsx
<div data-selectable-space="md" />
```

```css
.my-component {
  padding-block: var(
    --eds-selectable-space-vertical
  ); /* Responds to data-selectable-space */
  padding-inline: var(--eds-selectable-space-horizontal);
}
```

#### ❌ WRONG: Not mapping props to data-attributes

```tsx
function MyComponent({ size }: { size: 'small' | 'large' }) {
  return <div>...</div> // size prop has no effect!
}
```

### ✅ RIGHT: Map props to foundation data-attributes

```tsx
const SIZE_MAPPING = { small: 'sm', large: 'lg' } as const

function MyComponent({ size }: { size: 'small' | 'large' }) {
  return <div data-selectable-space={SIZE_MAPPING[size]}>...</div>
}
```

### State Management

#### ❌ WRONG: Using opacity for disabled state

```css
.my-component[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5; /* ❌ Improvising! Check Figma for actual tokens */
}
```

**Problem:** `opacity` affects everything (background, borders, text). Figma specifies exact color tokens for disabled text/icons.

### ✅ RIGHT: Use Figma's disabled color tokens

```tsx
// If icon uses accent color when enabled, change to neutral when disabled
{icon && (
  <span
    className="my-component__icon"
    data-color-appearance={disabled ? 'neutral' : 'accent'}
  >
    {icon}
  </span>
)}
```

```css
.my-component[data-disabled] {
  cursor: not-allowed;
}

.my-component[data-disabled] .my-component__text {
  /* TODO: Replace with dedicated disabled token when available */
  color: var(--eds-color-border-medium); /* ✅ From Figma disabled state */
}

.my-component[data-disabled] .my-component__icon {
  /* Change data-color-appearance to neutral, then set specific disabled color */
  /* TODO: Replace with dedicated disabled token when available */
  color: var(--eds-color-border-medium); /* ✅ Same disabled color for icons */
}
```

**How to find:** Check `figma_get_variable_defs` for the disabled state, or inspect disabled variant in `get_design_context`. Look for text/icon colors in disabled state.

**Pattern for accent icons:** If icons are accent when enabled, change `data-color-appearance` from `"accent"` to `"neutral"` when disabled, then set specific `--eds-color-border-medium` in CSS.

### Typography & Height

#### ❌ WRONG: Missing data-baseline causing height mismatch

**Problem:** Figma shows component height as 44px, but code renders 52px. Text uses full line-height (20px) instead of trimmed cap height (~12px).

```tsx
// Missing data-baseline attribute!
<span
  data-font-family="ui"
  data-font-size="md"
  data-line-height="default"
>
  Menu Item
</span>
```

**Height calculation WITHOUT text-box-trim:**
- Padding: 16px top + 20px line-height + 16px bottom = 52px ❌

### ✅ RIGHT: Add data-baseline to match Figma's baseline trimming

```tsx
<span
  data-font-family="ui"
  data-font-size="md"
  data-line-height="default"
  data-baseline="center"  // ✅ Enables text-box-trim
>
  Menu Item
</span>
```

**Height calculation WITH text-box-trim:**
- Padding: 16px top + ~12px trimmed text + 16px bottom = 44px ✅ (or 43.99px)

**Why:** Figma applies baseline trimming (shown as "Baseline adjust top/bottom" in variables). `data-baseline="center"` or `"grid"` enables `text-box: trim-both ex alphabetic`, removing extra line-height spacing so text occupies only its cap/x-height.

**When to use:**
- **`data-baseline="center"`**: Interactive elements (buttons, menu items) - optically centered text
- **`data-baseline="grid"`**: Body text aligned to 4px baseline grid
- **No data-baseline**: Full line-height box (rare in EDS 2.0)

**Fix sub-pixel rounding (43.99px → 44px):**

If pixel-perfect height is required, add `min-height` to ensure exact 44px while keeping padding:

```css
.my-component {
  min-height: var(--eds-sizing-selectable-lg); /* 44px minimum - fixes 43.99px */
  padding-block: var(--eds-selectable-space-vertical); /* Keep padding */
  padding-inline: var(--eds-selectable-space-horizontal);
  display: flex;
  align-items: center;
}
```

This approach:
- ✅ Ensures exact 44px minimum (fixes sub-pixel rounding)
- ✅ Keeps proper padding spacing
- ✅ Still grows naturally for multi-line content

**Default approach:** Use `padding-block` with `data-baseline`. The 0.01px difference is typically negligible.

**See:** Checkbox (`checkbox.css`) for fixed height pattern, `/packages/eds-tokens/build/css/typography.css` for text-box-trim implementation.

## Advanced Patterns

These patterns are for specific edge cases. Most components won't need them - refer to existing implementations first (Button, Input, Icon).

### Outline Border + Box-Shadow Focus Pattern

**When to use:** Interactive components (Input, TextField) that need exact height matching (36px, 44px) without border affecting box model.

**Pattern:** Use `outline` with negative offset for border, then `box-shadow` for focus ring.

```css
.my-component {
  /* Border using outline (doesn't affect height calculation) */
  outline: var(--eds-sizing-stroke-thin) solid var(--eds-color-border-subtle);
  outline-offset: calc(-1 * var(--eds-sizing-stroke-thin));
  border-radius: var(--eds-spacing-border-radius-rounded);
}

.my-component:hover {
  outline-color: var(--eds-color-border-strong);
}

.my-component:focus-within {
  outline-color: var(--eds-color-border-strong);
  /* Use box-shadow for focus ring since outline is used for border */
  box-shadow:
    0 0 0 var(--eds-sizing-stroke-thin) var(--eds-color-bg-canvas),
    0 0 0 calc(var(--eds-sizing-stroke-thin) * 2) var(--eds-color-border-focus);
}
```

**See:** `Input/input.css` for working example.

### Typography `display: block` Issue

**Problem:** `[data-font-family]` sets `display: block`, which breaks flex layouts.

**Solution:** Only put `data-font-family` on text elements, not containers.

```tsx
// Container handles layout, NO data-font-family
<div
  data-color-appearance={tone}
  data-font-size="md"
  data-selectable-space="md"
>
  {/* Text element gets data-font-family */}
  <input data-font-family="ui" data-font-size="md" />
</div>
```

**See:** `Button/Button.tsx` and `Input/Input.tsx` for examples.

### Text-Box-Trim for Exact Heights

**When to use:** Component has strict height requirement (44px button, 36px input) and text needs optical centering.

**Pattern:** Add `data-baseline="center"` to text elements to enable text-box-trim.

```tsx
<span
  data-font-family="ui"
  data-font-size="md"
  data-line-height="default"
  data-baseline="center"  // Trims line-height to cap height
>
  Menu Item
</span>
```

**Optional fixed height approach:**

```css
.my-component {
  height: var(--eds-sizing-selectable-lg); /* 44px */
  display: flex;
  align-items: center;
  padding-inline: var(--eds-selectable-space-horizontal);
}
```

**See:** `Checkbox/checkbox.css` for fixed height example, `/packages/eds-tokens/build/css/typography.css` for text-box-trim implementation.

## Anti-patterns

- Using `figma_get_design_context` alone without `figma_get_variable_defs` for each state
- **Using `opacity` for disabled states** - Use exact color tokens from Figma (e.g., `--eds-color-border-medium`)
- **Missing `data-baseline`** on text spans - Height won't match Figma (no text-box-trim)
- **Missing `data-color-appearance`** when Figma shows accent/danger colors - Dynamic tokens won't resolve correctly
- **Missing data-attributes in TSX** - CSS tokens need context to apply correct values
- **Using static tokens** (`--eds-color-bg-accent-*`) instead of dynamic tokens (`--eds-color-bg-*`)
- **Hardcoding values** - Use tokens: `--eds-selectable-space-*`, `--eds-typography-gap-horizontal`, etc.
- **Putting `data-font-family` on flex containers** - Only on text elements to avoid `display: block` issues
- Copying patterns without verifying Figma design
- Using EDS 1.0 tokens (`--eds-color-interactive-primary`, `--eds-color-text-error`)
- Implementing from scratch instead of reusing Field.Label, Icon, Input, Button components

## Additional Resources

- **Foundation documentation**: `/documentation/how-to/TOKEN_SYSTEM_GUIDE.md`
- **Dynamic color system**: `/packages/eds-tokens/instructions/colors-dynamic.md`
- **Static color system**: `/packages/eds-tokens/instructions/colors-static.md`
- **Component examples**: `packages/eds-core-react/src/components/next/Button/`, `Input/`, `Icon/`
