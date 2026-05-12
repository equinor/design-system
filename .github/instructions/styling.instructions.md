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

## Naming Conventions

**Files:** Component name in lowercase with hyphens

```
TextInput.tsx → text-input.css
DataGrid.tsx → data-grid.css
```

**Classes:** One `eds-`-prefixed root class per component. Internal elements use simple names scoped by CSS nesting. Variants and state via data attributes.

```css
@layer eds-components {
  .eds-text-input {
    /* Root — eds-prefixed */

    & .label {
      /* Internal element — simple name, scoped by nesting */
    }

    &[data-disabled] {
      /* State via data attribute */
    }

    &[data-variant='error'] {
      /* Variant via data attribute */
    }
  }
}
```

## Patterns

**CSS Variables (from EDS tokens):**

```css
@layer eds-components {
  .eds-text-input {
    color: var(--eds-color-text-strong);
    background: var(--eds-color-bg-input);
    border: 1px solid var(--eds-color-border-medium);
  }
}
```

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
