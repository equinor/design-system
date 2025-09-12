# Getting Started

The colour system works in two ways: **static** or **dynamic**. Choose one approach and use it consistently across design and development.

Using different approaches causes design and code to drift apart, making development harder. Each Figma variable has a matching code variable — keep them aligned.

**Static**:
Each semantic category (accent, neutral, info, success, warning, danger) has its own variable.

**Dynamic**:
Uses abstraction with variable mode in Figma and data attribute in code to define semantic category

## For Developers

### Static Approach

Use specific semantic variables for each colour category:

```css
.button-accent {
  background-color: var(--eds-color-bg-accent-emphasis);
  color: var(--eds-color-text-accent-strong-on-emphasis);
}
```

### Dynamic Approach

Set the semantic category using `data-color-appearance` attribute, then use abstract variables:

```html
<button data-color-appearance="success">Continue</button>
```

```css
.button {
  background: var(--eds-color-bg-emphasis);
  color: var(--eds-color-text-strong-on-emphasis);
}
```

## For Designers

### Static Approach

Each semantic category has a named variable:

- Example: `Bg/Accent/Fill/Emphasis`

### Dynamic Approach

Use abstract colour names without semantic categories:

- Example: `Bg/Fill/Emphasis`
- Select the semantic category using the **Appearance variable mode** in Figma
- This matches the `data-appearance-color` attribute that developers use in code
