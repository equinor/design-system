---
applyTo: 'packages/eds-core-react/src/components/next/**/*.{ts,tsx}'
---

# React Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions (file structure, code style, CSS patterns, polymorphism, testing). This file adds Copilot-specific reminders for `/next` components.

## Implementation Patterns

**Components with `forwardRef` and named exports:**

```typescript
import { forwardRef } from 'react'
import type { MyComponentProps } from './MyComponent.types'
import './my-component.css'

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  function MyComponent(
    { children, variant = 'default', className, ...rest },
    ref,
  ) {
    const classes = ['eds-my-component', className].filter(Boolean).join(' ')
    return (
      <div ref={ref} className={classes} data-variant={variant} {...rest}>
        {children}
      </div>
    )
  },
)
```

**Rules:**

- Use `forwardRef` so consumers can attach refs to the underlying element
- Named exports only — no default exports (except `.stories.tsx` files)
- No conditional hooks (move into separate components if needed)
- No `React` namespace import needed in modern JSX
- Helper functions in module scope, not inside component
- Props types in `.types.ts` file with JSDoc
- Variants and boolean states via `data-*` attributes, not modifier classes
- Polymorphic components (Link, Button, etc.) support `asChild` via the shared `Slot` utility — see `packages/eds-core-react/src/components/next/Slot/`

## Accessibility (Required)

**Every component must:**

- Have proper ARIA attributes (roles, labels, states)
- Support keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Manage focus correctly (focus trapping in modals, focus restoration)
- Follow WCAG 2.1 AA standards

## Composition & Reusability

- Components should be composable and nestable
- Avoid tightly coupled dependencies
- Use named exports only
- Keep components focused and simple
- Implement error boundaries for error handling

## Storybook Stories

Every component needs `.stories.tsx` with:

- Default/primary variant
- All design variations (size, color, state)
- Interactive examples
- Props documentation
- Accessibility info
