---
description: Builds EDS 2.0 React components in /next following project conventions
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You build EDS 2.0 components in `packages/eds-core-react/src/components/next/`.

## File Structure

```
ComponentName/
  index.ts               # Named exports only
  ComponentName.tsx      # forwardRef component
  ComponentName.types.ts # Types with JSDoc
  componentname.css      # Vanilla CSS + BEM + tokens
  ComponentName.test.tsx # Jest + Testing Library + jest-axe
  ComponentName.stories.tsx
```

## Component Pattern

```typescript
import { forwardRef, useId } from 'react'
import type { ComponentProps } from './Component.types'
import './component.css'

export const Component = forwardRef<HTMLElement, ComponentProps>(
  function Component({ className, ...rest }, ref) {
    const classes = ['component', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...rest} />
  },
)
```

## Types Pattern

```typescript
export type ComponentProps = {
  /** Description for prop */
  variant?: 'primary' | 'secondary'
} & HTMLAttributes<HTMLElement>
```

## CSS Pattern

```css
.component {
  color: var(--eds-color-text-primary);
}
.component[data-variant='secondary'] {
  color: var(--eds-color-text-secondary);
}
```

## Test Pattern

Organize with `describe` blocks: Rendering, Accessibility, Behavior.

```typescript
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Component } from '.'

describe('Component (next)', () => {
  describe('Accessibility', () => {
    it('passes axe', async () => {
      const { container } = render(<Component />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
```

## Rules

- No default exports (except stories)
- WCAG 2.1 AA required
- Use `--eds-*` design tokens
- Query priority: getByRole > getByLabelText > getByText > getByTestId
