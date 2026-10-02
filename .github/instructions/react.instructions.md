---
applyTo: 'packages/eds-core-react/src/components/next/**/*.{ts,tsx}'
---

# React Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions (file structure, code style, `forwardRef` + `displayName` pattern, helper-fn placement, polymorphism, accessibility, testing). This file adds Copilot-specific reminders for `/next` components.

## Reminders

- No conditional hooks (extract into separate components if a hook needs to be skipped)
- No `React` namespace import needed in modern JSX

## Storybook stories

Aspirational template for every `.stories.tsx`:

- Default/primary variant
- All design variations (size, color, state)
- Interactive examples
- Props documentation
- Accessibility info
