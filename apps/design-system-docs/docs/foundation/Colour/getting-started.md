# Getting Started

Our color system can be used in two ways: **static** or **dynamic**. Designers and developers must agree on the same approach. The Figma variable has a matching variable in code, and if different approaches are used, the design and implementation will drift apart—making development hard.

## Approaches

### Static

- The semantic category (accent, neutral, info, success, warning, danger) has its own variable.

### Dynamic

- Uses an **abstraction** with variable modes in Figma and data attributes in code to define the semantic category.

---

## For Developers

### Static

```css
/* Example: static semantic variables */
.button-accent {
  background-color: var(--eds-color-bg-accent-emphasis);
  color: var(--eds-color-text-accent-strong-on-emphasis);
}
```

### Dynamic

```html
<button data-color-appearance="success">Continue</button>
```

```css
/* Example: dynamic semantic variables */
.button {
  background: var(--eds-color-bg-emphasis);
  color: var(--eds-color-text-strong-on-emphasis);
}
```

---

## For Designers

### Static

- Each semantic category has a **named variable** e.g. `Bg/Accent/Fill/Emphasis`.

### Dynamic

- The colour name is an abstraction excluding the semantic category e.g. `Bg/Fill/Emphasis`.
- Use the Appearance **variable mode** in Figma to select the semantic category. This corresponds to developers setting the `data-appearance-color` attribute in code.

---
