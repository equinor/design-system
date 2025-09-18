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

Add the **EDS Colours (static)** library to your Figma file to use static variables. These variables are grouped by semantic category, making it easy to find the right option for your design.

**Example: Primary button (static)**
1. Select your button in Figma.
2. Apply these variables:
  - Background: `Bg/Accent/Fill Emphasis/Default`
  - Text: `Text/Accent/Strong on Emphasis`

![Primary button colours](/img/primary-button-bg.png)
<p class="image-caption">The primary button uses Bg/Accent/Fill Emphasis/Default for its background and Text/Accent/Strong on Emphasis for its text colour.</p>



 ![Primary button colours](/img/primary-button-bg.png) 

<p class="image-caption">The primary button uses the accent colour for its background and a strong contrasting text colour for accessibility.</p>





### Dynamic Approach

Add the **EDS Colours (dynamic)** library to your Figma file to use dynamic variables. These variables use abstract role names, such as Background, Text, and Border. Set the appearance separately in Figma to match your needs.

**Example: Primary button (dynamic)**

1. Select your button in Figma.
2. Apply these variables:
  - Background: `Bg/Fill/Emphasis`
  - Text: `Text/Strong on Emphasis`
3. Open the Appearance menu and choose `Accent`.

![Primary button colours](/img/primary-button-bg.png)
<p class="image-caption">The primary button uses Bg/Fill/Emphasis for its background and Text/Strong on Emphasis for its text colour.</p>

You can change the button’s appearance at any time without updating the roles.

**To change appearance:**
1. Select the button.
2. In the Variables panel, open the Appearance dropdown.
3. Choose Neutral, Accent, Info, Success, Warning, or Danger.

![Primary button appearance dropdown](/img/primary-button-appearance.png)
<p class="image-caption">Change the appearance using the dropdown in the Variables panel.</p>




### Light and Dark Colour Scheme

Both static and dynamic variables work across light and dark modes. Switch between them in the **Variables panel**, and your button updates automatically.

### Stay Aligned with Developers

Every Figma variable has a matching code variable. This means the button you design is the button developers implement — as long as you both use the same approach.



