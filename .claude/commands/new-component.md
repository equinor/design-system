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

## Check for Existing EDS 2.0 Components to Reuse

**Before implementing**, check `packages/eds-core-react/src/components/next/index.ts` for existing components that can be composed:

- **Field** - Field.Label, Field.Description, Field.HelperMessage for form fields
- **Icon** - For icons (use `@equinor/eds-icons` data)
- **Input** - For text input elements
- **Button** - For action buttons
- **Typography** - TypographyNext for text styling

**Always prefer composing existing components over creating new elements from scratch.**

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
```typescript
import type { HTMLAttributes } from 'react'

export type $ARGUMENTSProps = {
  /** Description of prop */
  variant?: 'primary' | 'secondary'
} & HTMLAttributes<HTMLDivElement>
```

### $ARGUMENTS.tsx
Use the forwardRef pattern with named function (matches Button, Checkbox, Input).

**Note:** Do NOT import CSS in the component file. CSS is imported globally via `index.css`.

```typescript
import { forwardRef } from 'react'
import type { $ARGUMENTSProps } from './$ARGUMENTS.types'

export const $ARGUMENTS = forwardRef<HTMLDivElement, $ARGUMENTSProps>(
  function $ARGUMENTS({ className, variant = 'primary', ...rest }, ref) {
    const classes = ['eds-$ARGUMENTS', className].filter(Boolean).join(' ')
    // ^ IMPORTANT: Use lowercase (eds-avatar, not eds-Avatar)

    return (
      <div
        ref={ref}
        className={classes}
        data-variant={variant}
        {...rest}
      />
    )
  },
)

$ARGUMENTS.displayName = '$ARGUMENTS'
```

### $ARGUMENTS_LOWERCASE.css (e.g., avatar.css)
Use `@layer eds-components` and data-attribute selectors (matches button.css, checkbox.css).

**Important:**
- CSS class names should be lowercase (e.g., `eds-avatar` not `eds-Avatar`)
- Use EXACT `--eds-*` tokens from Figma - never hardcode hex values
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
    /* Use --eds-* design tokens from figma_get_variable_defs */
    /* Example: background-color: var(--eds-color-bg-fill-muted-default); */
  }

  /* Use data-attribute selectors for variants */
  .eds-$ARGUMENTS[data-variant='primary'] {
    /* Variant styles using --eds-color-* tokens */
  }

  /* Spacing controlled by data-selectable-space */
  .eds-$ARGUMENTS[data-selectable-space='md'] {
    padding-block: var(--eds-selectable-space-vertical);
    padding-inline: var(--eds-selectable-space-horizontal);
  }

  /* Color appearance mode */
  .eds-$ARGUMENTS[data-color-appearance='accent'] {
    /* Uses accent color tokens */
  }
}
```

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

## Anti-patterns

- Using `figma_get_design_context` alone without `figma_get_variable_defs` for each state
- Copying patterns from similar components without verifying Figma design
- Adding props/features not specified in the design
- Hardcoding hex color values instead of using CSS variables
- Using EDS 1.0 tokens (e.g., `--eds-color-interactive-primary`, `--eds-color-text-error`)
- Creating custom labels/helper text instead of using Field.Label/Field.HelperMessage
- Implementing icons from scratch instead of using the Icon component
- Missing `displayName` on the component
