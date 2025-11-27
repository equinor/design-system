---
applyTo: '**'
---

# Styling Guidelines

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

**Classes:** BEM format with block as component name

```css
.text-input {
  /* block */
}
.text-input__label {
  /* element */
}
.text-input__input {
  /* element */
}
.text-input--disabled {
  /* modifier */
}
.text-input--error {
  /* modifier */
}
```

## Patterns

**CSS Variables (from EDS tokens):**

```css
.text-input {
  color: var(--eds-color-text-strong);
  background: var(--eds-color-bg-input);
  border: 1px solid var(--eds-color-border-medium);
}
```

**Responsive Design:**

```css
.button {
  padding: 0.5rem 1rem;
}

@media (min-width: 768px) {
  .button {
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
<div className="button"></div>
```

## Best Practices

- Single responsibility per CSS file
- Reuse tokens instead of hardcoding colors/sizes
- Test responsive breakpoints
- Ensure theme compatibility (light/dark modes)
