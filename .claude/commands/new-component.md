# Create New EDS 2.0 Component

Create a new EDS 2.0 component named **$ARGUMENTS** in `packages/eds-core-react/src/components/next/`.

> **Note:** CSS class names must be lowercase. For component `Avatar`, use class `eds-avatar` (not `eds-Avatar`).

## Instructions

1. **Create the component folder** with all required files:

```
$ARGUMENTS/
  index.ts
  $ARGUMENTS.tsx
  $ARGUMENTS.types.ts
  $ARGUMENTS.css         (lowercase filename)
  $ARGUMENTS.test.tsx
  $ARGUMENTS.stories.tsx
```

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
Use the forwardRef pattern with named function (matches Button, Checkbox, Input):

```typescript
import { forwardRef } from 'react'
import type { $ARGUMENTSProps } from './$ARGUMENTS.types'
import './$ARGUMENTS.css'

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
```

### $ARGUMENTS.css (lowercase filename)
Use `@layer eds-components` and data-attribute selectors (matches button.css, checkbox.css).

**Important:** CSS class names should be lowercase (e.g., `eds-avatar` not `eds-Avatar`).

```css
@layer eds-components {
  /* IMPORTANT: Use lowercase class name (eds-avatar, not eds-Avatar) */
  .eds-$ARGUMENTS {
    /* Use --eds-* design tokens */
  }

  .eds-$ARGUMENTS[data-variant='primary'] {
    /* Variant styles */
  }

  .eds-$ARGUMENTS[data-variant='secondary'] {
    /* Variant styles */
  }
}
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
**Beta Component** - This component is under active development.

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
@import './$ARGUMENTS/$ARGUMENTS.css';
```

## Key Patterns

- **forwardRef**: All /next components use forwardRef with named function
- **Data attributes**: Use `data-*` for styling variants instead of CSS class modifiers
- **CSS layer**: Always wrap in `@layer eds-components { }`
- **Tokens**: Use `--eds-*` CSS custom properties, never hardcode values
- **Class naming**: Lowercase with `eds-` prefix (e.g., `eds-button`, `eds-avatar`)
- **No default exports**: Only use named exports (except story meta)
