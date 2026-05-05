---
applyTo: '**'
---

# Styling Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions. This file adds CSS-specific guidance for Copilot.

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

### Pseudo-private custom properties

Define component-scoped variables with a `--_` prefix at the component root. Use these variables for all properties. In variants and states, **override only the variable — never the property directly**.

```css
/* CORRECT */
.eds-button {
  --_color: var(--eds-color-text-strong-on-emphasis);
  --_bg-color: var(--eds-color-bg-fill-emphasis-default);
  color: var(--_color);
  background-color: var(--_bg-color);
}
.eds-button[data-variant='ghost']:disabled {
  --_color: var(--eds-color-text-disabled); /* override the variable */
}

/* WRONG */
.eds-button[data-variant='ghost']:disabled {
  color: var(
    --eds-color-text-disabled
  ); /* never override the property directly */
}
```

### Density via ancestor attribute

Density variants are applied by setting `data-density` on an ancestor element. Component CSS selects against this ancestor:

```css
[data-density='comfortable'] .eds-button[data-selectable-space='md'] {
  --_min-height: 1.5rem;
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
