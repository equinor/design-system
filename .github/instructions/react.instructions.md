---
applyTo: 'packages/eds-core-react/src/components/next/**/*.{ts,tsx}'
---

# React Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions (file structure, code style, CSS patterns, polymorphism, testing). This file adds Copilot-specific reminders for `/next` components.

## Implementation Patterns

See [`AGENTS.md`](../../AGENTS.md) for the canonical `forwardRef` + named-export + `displayName` example. Additional Copilot reminders that aren't in AGENTS.md:

- No conditional hooks (move into separate components if needed)
- No `React` namespace import needed in modern JSX
- Helper functions in module scope, not inside the component

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
