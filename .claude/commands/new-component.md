# Create New EDS 2.0 Component

Create a new EDS 2.0 component named **$ARGUMENTS** in `packages/eds-core-react/src/components/next/`.

> **Note:** CSS class names must be lowercase. For component `Avatar`, use class `eds-avatar` (not `eds-Avatar`).

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

**Check Figma Color Modes/Appearances:**

⚠️ **CRITICAL**: When Figma shows colors using dynamic modes (accent, neutral, danger, etc.), you MUST set the corresponding `data-color-appearance` attribute in the HTML!

**How to identify:**
- Look at variable names in `figma_get_variable_defs`: if you see `var(--eds-color-bg-fill-emphasis-default)` or similar **dynamic tokens** (without "accent"/"neutral" in the name)
- Check the Figma screenshot: if icons/text are in accent blue color, they're using accent mode
- Check the Figma design context: look for color appearance indicators

**Examples:**
- **Icons in accent blue** → Add `data-color-appearance="accent"` to the icon container or parent
- **Error text in red** → Add `data-color-appearance="danger"` to the text element
- **Neutral/gray elements** → Add `data-color-appearance="neutral"` or omit (neutral is often default)

**Why this matters:**
Dynamic tokens like `var(--eds-color-bg-fill-emphasis-default)` change their value based on `data-color-appearance`:
- `data-color-appearance="accent"` → token resolves to accent blue (#007079)
- `data-color-appearance="danger"` → token resolves to danger red (#c6002d)
- `data-color-appearance="neutral"` → token resolves to neutral gray

**Without the data-attribute, dynamic tokens won't work correctly and colors will be wrong!**

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

**Goal:** Build complete components from Figma, only add TODOs for complex behavioral features.

**Figma is the source of truth** - implement what you see, document what you can't.

**Workflow:**

1. **Check if old component exists**: `packages/eds-core-react/src/components/$ARGUMENTS/`

2. **If it exists, read for feature awareness** (not for copying):
   - Note behavioral patterns (keyboard nav, focus management, auto-close)
   - Note props and functionality
   - Identify patterns that may not be visible in Figma

3. **Compare with Figma and decide:**

   | Feature Type | Action |
   |--------------|--------|
   | **Visual in Figma** (clear button, loading spinner, icons) | ✅ **Implement directly** |
   | **States in Figma** (hover, focus, disabled, error) | ✅ **Implement directly** |
   | **Props from Figma** (size variants, disabled state) | ✅ **Implement directly** |
   | **Complex behavior** (keyboard nav, focus trap, positioning) | 📝 **Add TODO** if needed |
   | **Old patterns** (styled-components, portals, complex state) | ❌ **Skip** - use modern approach |
   | **Not in Figma** (extra features, legacy support) | ❌ **Skip** - can add later if needed |

4. **Only add TODO comments for:**
   - Complex behavioral features requiring careful implementation (keyboard navigation, focus management)
   - Features where implementation approach needs discussion
   - Integrations with external systems (Floating UI, Popper)

**Example - Minimal TODOs:**
```tsx
/**
 * NOTE: Complex behavioral features from old component to consider:
 * TODO: Keyboard navigation (ArrowDown/ArrowUp, Enter, Escape)
 * TODO: Focus trap when modal is open
 * TODO: Click-outside to close (if this is a modal/dropdown pattern)
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(
  function Search({ disabled, onClear, ...rest }, ref) {
    // ✅ Clear button implemented directly (visible in Figma)
    // ✅ Disabled state implemented (visible in Figma)
    // ✅ Icon positioning implemented (visible in Figma)

    const [value, setValue] = useState('')

    return (
      <div className="eds-search">
        <Icon data={search} />
        <Input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          {...rest}
        />
        {value && !disabled && (
          <Button icon onClick={() => { setValue(''); onClear?.() }}>
            <Icon data={close} />
          </Button>
        )}
      </div>
    )
  }
)
```

**Modern alternatives that simplify implementation:**

| Old Pattern | Modern Replacement | Why It's Better |
|-------------|-------------------|-----------------|
| Custom focus indicators | `:focus-visible` | Built-in, accessible, less code |
| Portal components | `position: fixed` | Native CSS, no React overhead |
| Styled-components theming | CSS tokens + data-attrs | Faster, cacheable, less JS |
| Manual event delegation | Native event listeners | Simpler, browser-optimized |
| Complex state management | Simple useState/useRef | Less code, easier to understand |

**Do NOT:**
- ❌ Add TODOs for everything from old component
- ❌ Copy old implementation patterns
- ❌ Add TODOs for features visible in Figma (just implement them!)

**DO:**
- ✅ Implement all visual features from Figma directly
- ✅ Use modern CSS/browser features to simplify
- ✅ Only add TODOs for truly complex behavioral features
- ✅ Keep components lean - features can be added later if users need them

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
- `data-space-proportions`: `'squished' | 'square' | 'stretched'`
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
        // Foundation data-attributes for dynamic token styling:
        data-color-appearance={disabled ? 'neutral' : 'accent'}  // Sets color context
        data-selectable-space="md"                               // Sets spacing scale
        data-space-proportions="squished"                        // Padding proportions
        data-font-family="ui"                                    // Font family
        data-font-size="md"                                      // Font size + icon size
        data-line-height="default"                               // Line height
        data-disabled={disabled || undefined}                    // Disabled state
        {...rest}
      />
    )
  },
)

$ARGUMENTS.displayName = '$ARGUMENTS'
```

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

### $ARGUMENTS_LOWERCASE.css (e.g., avatar.css)
Use `@layer eds-components` and data-attribute selectors (matches button.css, checkbox.css).

**Important:**
- CSS class names should be lowercase (e.g., `eds-avatar` not `eds-Avatar`)
- **CRITICAL: Use EXACT `--eds-*` tokens from `figma_get_variable_defs`** - never hardcode hex values or assume token names
- Always call `figma_get_variable_defs` for each component state and use the exact variable names returned
- **Use EDS 2.0 tokens only** - see `packages/eds-tokens/css/variables/` for available tokens

**EDS 2.0 Token Examples (correct):**
- `--eds-color-bg-fill-emphasis-default` (NOT `--eds-color-interactive-primary`)
- `--eds-color-text-subtle` (NOT `--eds-color-text-static-icons`)
- `--eds-color-border-strong` (NOT `--eds-color-text-error`)
- `--eds-selectable-space-vertical` / `--eds-selectable-space-horizontal`
- `--eds-typography-*` tokens for font sizing

**Data Attributes for Styling Modes:**
Components use data attributes to enable dynamic token-based styling:

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-variant` | Visual variant | component-specific (primary, secondary, ghost) |
| `data-selectable-space` | Spacing mode | `sm`, `md`, `lg` |
| `data-space-proportions` | Padding proportions | `squished`, `default`, `spacious` |
| `data-font-family` | Typography family | `ui`, `body` |
| `data-font-size` | Font size | `xs`, `sm`, `md`, `lg`, `xl` |
| `data-line-height` | Line height mode | `squished`, `default`, `spacious` |
| `data-color-appearance` | Color theming | `neutral`, `accent`, `warning`, `danger` |

```css
@layer eds-components {
  /* IMPORTANT: Use lowercase class name (eds-avatar, not eds-Avatar) */
  .eds-$ARGUMENTS {
    /* CRITICAL: Use EXACT --eds-* tokens from figma_get_variable_defs
     * Never hardcode hex values - always use the tokens from Figma
     * Example: background-color: var(--eds-color-bg-fill-muted-default);
     */

    /* Base styles */
    display: inline-flex;
    align-items: center;
    gap: var(--eds-typography-gap-horizontal);

    /* Dynamic color tokens - values change based on data-color-appearance
     * These specific tokens are examples - use actual tokens from Figma
     */
    background-color: var(--eds-color-bg-fill-emphasis-default);
    color: var(--eds-color-text-strong-on-emphasis);
    border: var(--eds-sizing-stroke-thin) solid var(--eds-color-border-strong);

    /* Spacing - values change based on data-selectable-space */
    padding-block: var(--eds-selectable-space-vertical);
    padding-inline: var(--eds-selectable-space-horizontal);

    /* Border radius */
    border-radius: var(--eds-spacing-border-radius-rounded);
  }

  /* State handling with pseudo-selectors */
  .eds-$ARGUMENTS:hover:not(:disabled) {
    background-color: var(--eds-color-bg-fill-emphasis-hover);
  }

  .eds-$ARGUMENTS:active:not(:disabled) {
    background-color: var(--eds-color-bg-fill-emphasis-active);
  }

  .eds-$ARGUMENTS:focus-visible {
    outline: var(--eds-sizing-stroke-thick) solid var(--eds-color-border-focus);
    outline-offset: 2px;
  }

  .eds-$ARGUMENTS[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
```

**Key CSS patterns:**
- **ALWAYS use exact tokens from `figma_get_variable_defs`** - Don't guess or copy from similar components
- **Dynamic tokens** like `--eds-color-bg-fill-emphasis-default` adapt to `data-color-appearance`
- **Spacing tokens** like `--eds-selectable-space-vertical` adapt to `data-selectable-space`
- **Use attribute selectors** for state: `[data-disabled]`, `[data-variant='primary']`
- **Avoid hardcoded values** - use tokens that respond to data-attributes

**CRITICAL: Typography `display: block` Issue**

⚠️ **`[data-font-family]` sets `display: block`** (from `typography.css`), which breaks flex layouts!

When a component has `data-font-family`, it gets `display: block` for text-box trimming. This must be overridden:

```css
.eds-your-component {
  display: flex; /* or inline-flex - MUST override the block display */
}
```

**For components with icon + text (like Button):**

Wrap children in a `<span>` to create a nested flex container:

```tsx
// TSX
<button
  data-font-family="ui"
  data-font-size="md"
  data-selectable-space="md"
>
  <span>{children}</span>  {/* Wraps Icon + text */}
</button>
```

```css
/* CSS */
.eds-component {
  display: flex;  /* Override typography block display */
  gap: var(--eds-typography-gap-horizontal);

  /* CRITICAL: Keep padding on the component element */
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
}

.eds-component > span {
  display: inline-flex;
  align-items: center;
  gap: inherit;  /* Inherits gap from parent */
  /* NO padding here - padding stays on parent element */
}
```

**⚠️ CRITICAL: Padding Placement**

**DO NOT add padding to both the element AND the span** - this causes double padding!

✅ **CORRECT: Padding on element (Button's approach - use this)**
```css
.eds-button {
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
}

.eds-button > span {
  display: inline-flex;
  gap: inherit;
  /* No padding */
}
```

❌ **WRONG: Padding on both**
```css
.eds-component {
  padding: 1rem;  /* ❌ Double padding! */
}

.eds-component > span {
  padding: 1rem;  /* ❌ Combined = 2rem total */
}
```

**Why padding stays on the element:**
1. ✅ The padding is part of the interactive/clickable area
2. ✅ Hover/focus states naturally cover the full padded area
3. ✅ Span's only job is to fix `display: block` issue (single responsibility)
4. ✅ Clearer mental model: element owns its spacing, span just fixes layout

**How this works:**
1. Parent element has `gap` and `padding` tokens
2. Child span has `display: inline-flex` to fix typography block display
3. Child span uses `gap: inherit` to use parent's gap
4. Icon and text become flex items of the span with proper spacing

See `Button/button.css` (lines 51-70, 248-252) for reference implementation.

**Token workflow:**
1. Call `figma_get_variable_defs` for the component (default, hover, focus, disabled states)
2. Copy the EXACT variable names from the response (e.g., `var(--eds-color-bg-canvas)`)
3. Use those exact tokens in your CSS - never hardcode hex values or guess token names

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
  data-variant={variant}                              // Component-specific
  data-selectable-space={selectableSpace}             // Foundation: md, lg, sm
  data-space-proportions="squished"                   // Foundation
  data-font-family="ui"                               // Foundation
  data-font-size={typographySize}                     // Foundation
  data-line-height="squished"                         // Foundation
  data-color-appearance={disabled ? 'neutral' : tone} // Foundation: accent, danger
/>
```

```css
/* button.css - Dynamic tokens respond to data-attributes */
.eds-button[data-variant='primary'] {
  background-color: var(--eds-color-bg-fill-emphasis-default);  /* Changes with data-color-appearance */
}

.eds-button:hover:not(:disabled) {
  background-color: var(--eds-color-bg-fill-emphasis-hover);    /* Also responds to data-color-appearance */
}
```

### Input (packages/eds-core-react/src/components/next/Input/)
```tsx
// Input.tsx - Container sets color context for child elements
<div
  data-color-appearance={tone}      // 'danger' when invalid, 'neutral' otherwise
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
<svg data-icon-size={size} />  // Only set if explicit size prop provided
```

```css
/* icon.css - Inherits size from parent's typography tokens */
.icon {
  font-size: var(--eds-typography-icon-size, 1.5em);  /* Inherits from parent */
  width: 1em;
  height: 1em;
}
```

## Common Mistakes & How to Fix Them

### ❌ WRONG: Missing data-color-appearance on icon
```tsx
// Icon appears in Figma as accent blue, but no data-attribute!
<button className="menu-item">
  <Icon data={settings} />
  Settings
</button>
```

```css
.menu-item {
  color: var(--eds-color-bg-fill-emphasis-default);  /* No context - will be wrong color! */
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
  color: var(--eds-color-bg-fill-emphasis-default);  /* Resolves to accent blue! */
}

.menu-item:hover {
  background: var(--eds-color-bg-fill-muted-default);  /* Resolves to neutral gray! */
}
```

---

### ❌ WRONG: Using static tokens instead of dynamic
```css
.my-component {
  background: var(--eds-color-bg-accent-fill-emphasis-default);  /* Only works for accent */
}
```

### ✅ RIGHT: Use dynamic tokens that respond to data-color-appearance
```css
.my-component {
  background: var(--eds-color-bg-fill-emphasis-default);  /* Adapts to accent/neutral/danger */
}
```

---

### ❌ WRONG: Hardcoded spacing values
```css
.my-component {
  padding: 12px 8px;  /* Breaks responsive spacing */
}
```

### ✅ RIGHT: Use foundation spacing tokens
```tsx
<div data-selectable-space="md" />
```

```css
.my-component {
  padding-block: var(--eds-selectable-space-vertical);    /* Responds to data-selectable-space */
  padding-inline: var(--eds-selectable-space-horizontal);
}
```

---

### ❌ WRONG: Not mapping props to data-attributes
```tsx
function MyComponent({ size }: { size: 'small' | 'large' }) {
  return <div>...</div>  // size prop has no effect!
}
```

### ✅ RIGHT: Map props to foundation data-attributes
```tsx
const SIZE_MAPPING = { small: 'sm', large: 'lg' } as const

function MyComponent({ size }: { size: 'small' | 'large' }) {
  return <div data-selectable-space={SIZE_MAPPING[size]}>...</div>
}
```

---

### ❌ WRONG: Adding padding to both element and span wrapper
```css
.eds-component {
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
}

.eds-component > span {
  display: inline-flex;
  gap: inherit;
  /* ❌ This adds MORE padding on top of the button's padding! */
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
}
```

### ✅ RIGHT: Keep padding on element only (Button's approach)
```css
.eds-component {
  display: flex;
  /* ✅ Padding stays on the interactive element */
  padding-block: var(--eds-selectable-space-vertical);
  padding-inline: var(--eds-selectable-space-horizontal);
  gap: var(--eds-typography-gap-horizontal);
}

.eds-component > span {
  /* Span only fixes display:block issue - no padding */
  display: inline-flex;
  align-items: center;
  gap: inherit;
}
```

**Why:** The span's job is to fix `display: block` from `[data-font-family]`, not to add spacing. Padding belongs on the element for hover/focus states.

## Anti-patterns

- Using `figma_get_design_context` alone without `figma_get_variable_defs` for each state
- **Missing `data-color-appearance` when Figma shows accent/danger/neutral colors** - Dynamic tokens won't resolve correctly
- **Missing data-attributes in TSX** - CSS tokens won't have context to apply correct values
- **Using static tokens** (e.g., `--eds-color-bg-accent-*`) instead of dynamic tokens (`--eds-color-bg-*`)
- **Hardcoding spacing values** instead of using `--eds-selectable-space-*` tokens
- **Adding padding to both element and span wrapper** - Causes double padding (keep padding on element only)
- **Not mapping component props to data-attributes** - props won't affect styling
- **Not checking Figma color modes** - Assuming all elements are neutral when they might be accent
- Copying patterns from similar components without verifying Figma design
- Adding props/features not specified in the design
- Hardcoding hex color values instead of using CSS variables
- Using EDS 1.0 tokens (e.g., `--eds-color-interactive-primary`, `--eds-color-text-error`)
- Creating custom labels/helper text instead of using Field.Label/Field.HelperMessage
- Implementing icons from scratch instead of using the Icon component
- Missing `displayName` on the component

## Additional Resources

- **Foundation documentation**: `/documentation/how-to/TOKEN_SYSTEM_GUIDE.md`
- **Dynamic color system**: `/packages/eds-tokens/instructions/colors-dynamic.md`
- **Static color system**: `/packages/eds-tokens/instructions/colors-static.md`
- **Component examples**: `packages/eds-core-react/src/components/next/Button/`, `Input/`, `Icon/`
