---
paths:
  - 'packages/eds-core-react/src/components/next/**/*.tsx'
  - 'packages/eds-core-react/src/components/next/**/*.ts'
  - 'packages/eds-core-react/src/components/next/**/*.css'
---

# EDS 2.0 Component Guidelines (path-scoped delta)

> The full component conventions live in [`AGENTS.md`](../../AGENTS.md): file structure, `forwardRef` pattern, named exports, JSDoc'd types, `eds-`-prefixed CSS with `@layer eds-components`, `--_` pseudo-private vars, `data-*` for variants, density via ancestor, testing with Jest + Testing Library + jest-axe.

This file is intentionally short. It only highlights what's easy to forget when working in `/next`:

- **No default exports** (except `.stories.tsx`)
- **WCAG 2.1 AA** is non-negotiable — `jest-axe` test in every component
- **Use `--eds-*` design tokens** — never hardcode hex values
- **Variants and states via `data-*` attributes**, not modifier classes
- **Test queries**: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
