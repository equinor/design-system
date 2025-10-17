---
applyTo: '**'
---

# Static Color Approach

The static approach uses a complete set of variables for each semantic category. Each variable explicitly specifies the semantic category in its name.

> See [colors.md](./colors.md) for the core color system concepts.

## Concept

In the static approach, each semantic category (accent, neutral, info, success, warning, danger) has its own variables. You choose the specific variable you need based on the semantic meaning required.

## Naming Pattern

Static variable names follow this pattern:

```
--eds-color-[role]-[semantic category]-[priority]-[state]
```

> **Note:** The `[state]` suffix (e.g., `-default`, `-hover`, `-active`) is only present for certain roles, such as background fill. For text and border variables, the state is typically omitted.

- `--eds-color-bg-accent-fill-emphasis-default` -- Accent semantic category (background fill, with default state)
- `--eds-color-bg-neutral-fill-muted-default` -- Neutral semantic category (background fill, with default state)
- `--eds-color-border-danger-medium` -- Danger semantic category (border, no state)
- `--eds-color-text-success-strong` -- Success semantic category (text, no state)

## CSS Variables

### Import

```css
@import '@equinor/eds-tokens/css/variables';
```

### Usage

Use specific semantic variables in your styles:

```css
.button-primary {
  background-color: var(--eds-color-bg-accent-fill-emphasis-default);
  color: var(--eds-color-text-accent-strong-on-emphasis);
  border: 1px solid var(--eds-color-border-accent-strong);
}

.alert-warning {
  background-color: var(--eds-color-bg-warning-fill-emphasis);
  color: var(--eds-color-text-warning-strong-on-emphasis);
  border-left: 4px solid var(--eds-color-border-warning-strong);
}
```

### Interactive States

Background fill-muted and fill-emphasis include state variants for hover and active:

```css
.button {
  background-color: var(--eds-color-bg-accent-fill-emphasis-default);
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--eds-color-bg-accent-fill-emphasis-hover);
}

.button:active {
  background-color: var(--eds-color-bg-accent-fill-emphasis-active);
}
```

## Best Practices

- **Be explicit** -- Choose the specific semantic category your element needs
- **Pair carefully** -- Always use matching text and background variables for contrast
- **Never mix approaches** -- Use static consistently, don't mix with dynamic
- **Test contrast** -- Verify all color combinations meet accessibility standards
