# Getting Started

The colour system works in two ways: **static** or **dynamic**. Choose one approach and use it consistently across design and development.

Using different approaches causes design and code to drift apart, making development harder. Each Figma variable has a matching code variable — keep them aligned.

**Static**:
Each semantic category (accent, neutral, info, success, warning, danger) has its own variable.

**Dynamic**:
Uses abstraction with variable mode in Figma and data attribute in code to define semantic category

**Note:** The variable mode in Figma and data attribute in code are foundational colour tools. They don't replace component properties or variants. Continue creating component variants using component properties as usual — these colour tools work alongside your existing component structure.

## For Developers

Install the EDS tokens package:

```bash
pnpm install @equinor/eds-tokens
```

### Static Approach

Import the static variables:

```css
@import '@equinor/eds-tokens/css/variables-static';
```

Use specific semantic variables:

```css
.button-primary {
  background-color: var(--eds-color-bg-accent-emphasis);
  color: var(--eds-color-text-accent-strong-on-emphasis);
}
```

### Dynamic Approach

Import the dynamic variables:

```css
@import '@equinor/eds-tokens/css/variables-dynamic';
```

Set the semantic category using the `data-color-appearance` attribute with any of these values:

- `neutral` (default)
- `accent`
- `success`
- `info`
- `warning`
- `danger`

```html
<button data-color-appearance="accent">Continue</button>
```

Use abstract variables:

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

You can use the EDS colour system in Figma with either **static** or **dynamic** variables. Both options are available as shared libraries — just make sure you and your developers agree on which approach to use. 


### Static Approach

Add the **EDS Colours (static)** library to your Figma file to access static variables. These variables are organised by semantic category, so you always see the category name in the variable itself.

**Example: Primary button (static)** 
- **Background:** `Bg/Accent/Fill Emphasis/Default`
- **Text:** `Text/Accent/Strong on Emphasis`



 ![Primary button colours](/img/primarybutton-bg.png) 

<p class="image-caption">The primary button uses the accent colour for its background and a strong contrasting text colour for accessibility.</p>





### Dynamic Approach

Add the **EDS Colours (dynamic)** library to your Figma file. Dynamic variables use abstract role names(Background, Text, Border). You then set the appearance separately in Figma. 

**Example: Primary button (dynamic)**

1. Select your button in Figma.
2. Apply the variables:
  - **Background:** `Bg/Fill/Emphasis`
  - **Text:** `Text/Strong on Emphasis`
3. Open the **Appearance menu** and choose `Accent`.

**Changing appearance in Figma**
The power of the dynamic approach is that you can change the appearance without touching the roles.

**How to change appearance:**


