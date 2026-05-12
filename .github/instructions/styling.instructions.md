---
applyTo: 'packages/eds-core-react/src/components/next/**/*.css'
---

# Styling Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions — `--_` pseudo-private custom properties, `data-density` ancestor pattern, `@layer eds-components`, the modular type scale, and `@supports` progressive enhancement. This file adds Copilot-specific CSS reminders for `/next`.

## Tech Stack

- **Use:** Vanilla CSS only
- **Avoid:** CSS-in-JS (styled-components, emotion), Tailwind inline classes
- **Variables:** CSS custom properties from `@equinor/eds-tokens`
- **Responsive:** Mobile-first approach with media queries

## Naming, classes, and `@layer eds-components`

See [`AGENTS.md`](../../AGENTS.md) for file naming, the `eds-`-prefixed root class with nested simple names, `data-*` attributes for variants, and the `@layer eds-components` wrapper.

## Patterns

**Responsive Design:**

```css
.eds-button {
  padding: 0.5rem 1rem;
}

@media (min-width: 768px) {
  .eds-button {
    padding: 0.75rem 1.5rem;
  }
}
```

**Avoid:**

```jsx
// ❌ No inline styles
<div style={{ color: 'red' }}>

// ❌ No CSS-in-JS
const StyledDiv = styled.div`...`;

// ✅ Use CSS class
<div className="button">
```

## Best Practices

- Single responsibility per CSS file
- Reuse tokens instead of hardcoding colors/sizes
- Test responsive breakpoints
- Ensure theme compatibility (light/dark modes)
