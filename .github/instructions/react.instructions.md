---
applyTo: '**/*.ts,**/*.tsx'
---

# React Guidelines

## Component Structure

**File organization (required):**

```
MyComponent/
  index.ts              # Export only
  MyComponent.tsx       # Component implementation
  MyComponent.types.ts  # Props and type definitions
  my-component.css       # Styles (vanilla CSS, BEM)
  MyComponent.test.tsx  # Unit tests (Jest + Testing Library)
  MyComponent.stories.tsx # Storybook documentation
```

**Directory naming:** PascalCase matching component name

## Implementation Patterns

**Functional components with hooks:**

```typescript
import { MyComponentProps } from './MyComponent.types';
import './my-component.css';

export const MyComponent: React.FC<MyComponentProps> = ({
  children,
  variant = 'default',
  ...props
}) => {
  return (
    <div className="my-component" {...props}>
      {children}
    </div>
  );
};
```

**Rules:**

- No conditional hooks (move into separate components if needed)
- No React import needed (no JSX pragma in modern React)
- Helper functions in module scope, not inside component
- Props types in `.types.ts` file

## Accessibility (Required)

**Every component must:**

- Have proper ARIA attributes (roles, labels, states)
- Support keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Manage focus correctly (focus trapping in modals, focus restoration)
- Follow WCAG 2.1 AA standards

## Composition & Reusability

- Components should be composable and nestable
- Avoid tightly coupled dependencies
- Export both default and named exports when appropriate
- Keep components focused and simple
- Implement error boundaries for error handling

## Storybook Stories

Every component needs `.stories.tsx` with:

- Default/primary variant
- All design variations (size, color, state)
- Interactive examples
- Props documentation
- Accessibility info
