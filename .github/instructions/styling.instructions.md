---
applyTo: 'packages/eds-core-react/src/components/next/**/*.css'
---

# Styling Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions — vanilla CSS, one `.css` per component, `eds-`-prefixed root class with nesting, `data-*` attributes for variants, `@layer eds-components`, `--_` pseudo-private custom properties, `data-density` ancestor pattern, dynamic tokens, the modular type scale, and `@supports` progressive enhancement.

## Reminders

- Use `--eds-*` CSS custom properties from `@equinor/eds-tokens`; never hardcode colors or sizes
- Avoid inline `style={{}}` on production components (Story files may use it for layout demos)
