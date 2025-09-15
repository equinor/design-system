# Getting Started

The colour system works in two ways: **static** or **dynamic**. Choose one approach and use it consistently across design and development.

Using different approaches causes design and code to drift apart, making development harder. Each Figma variable has a matching code variable — keep them aligned.

**Static**:
Each semantic category (accent, neutral, info, success, warning, danger) has its own variable.

**Dynamic**:
Uses abstraction with variable mode in Figma and data attribute in code to define semantic category

**Note:** The variable mode in Figma and data attribute in code are foundational colour tools. They don't replace component properties or variants. Continue creating component variants using component properties as usual — these colour tools work alongside your existing component structure.

## For Developers

### Static Approach

Install the EDS tokens package and import the static colour variables:

```bash
pnpm install @equinor/eds-tokens
```

```css
@import '@equinor/eds-tokens/css/variables-static';
```

Use specific semantic variables:

```css
.button-accent {
  background-color: var(--eds-color-bg-accent-emphasis);
  color: var(--eds-color-text-accent-strong-on-emphasis);
}
```

### Dynamic Approach

Install the EDS tokens package and import the dynamic colour variables:

```bash
pnpm install @equinor/eds-tokens
```

```css
@import '@equinor/eds-tokens/css/variables-dynamic';
```

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

### Colour Scheme Detection

By default, the colour system detects light and dark colour schemes using the `data-color-scheme` attribute:

```html
<!-- Light theme (default) -->
<html data-color-scheme="light"></html>
<!-- Dark theme -->
<html data-color-scheme="dark"></html>
```

**Custom selectors**: Extend this by defining your own selectors. For example, use `.light` and `.dark` classes:

```css
/* Override default colour scheme detection */
.light {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}
```

Then use classes instead of data attributes:

```html
<!-- Light theme -->
<html class="light"></html>
<!-- Dark theme -->
<html class="dark"></html>
```

## For Designers

### Static Approach

Add the **EDS Colours (static)** library to your Figma file to access static colour variables.

Each semantic category has a named variable:

- Example: `Bg/Accent/Fill/Emphasis`

### Dynamic Approach

Add the **EDS Colours (dynamic)** library to your Figma file to access dynamic colour variables.

Use abstract colour names without semantic categories:

- Example: `Bg/Fill/Emphasis`
- Select the semantic category using the **Appearance variable mode** in Figma
- This matches the `data-appearance-color` attribute that developers use in code
