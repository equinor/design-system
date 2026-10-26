---
title: Icon
hide_title: true
description: 'Icons are small visual symbols that communicate meaning at a glance. They support text labels, guide users through interactions, and add clarity to our interfaces. The Icon component is designed with care to scale automatically with typography, adapt to density modes, and meet accessibility standards out of the box.'
---

<StoryCanvas of="Icon/Introduction" showLink />

## When to Use

Use Icon to reinforce meaning alongside text - in buttons, form fields, status messages, and navigation. Icons help users scan interfaces faster and understand actions without reading every label.

**Avoid Icon for:**

- Purely decorative illustrations - use an image instead
- Complex graphics or logos - use a dedicated image or SVG

## Structure

The Icon component renders an SVG element with a single `data` prop from `@equinor/eds-icons`. It is sized in one of three ways:

- **Next to text** - without a `size` prop, the icon is as tall as the line it sits in
- **Explicit `size` prop** - a fixed size from the spacing scale, for standalone icons
- **Inside a component** - components such as Button and Chip set the icon size themselves, and the `size` prop has no effect

## Guidelines

### Sizes

Use the `size` prop for standalone icons. Each size uses the spacing token one step above its name, so the sizes follow the density set on a parent element.

| Size | Token         | Comfortable (default) |
| ---- | ------------- | --------------------- |
| xs   | `spacing-sm`  | 12px                  |
| sm   | `spacing-md`  | 16px                  |
| md   | `spacing-lg`  | 20px                  |
| lg   | `spacing-xl`  | 24px                  |
| xl   | `spacing-2xl` | 28px                  |
| 2xl  | `spacing-3xl` | 32px                  |
| 3xl  | `spacing-4xl` | 40px                  |
| 4xl  | `spacing-5xl` | 48px                  |
| 5xl  | `spacing-6xl` | 64px                  |
| 6xl  | `spacing-7xl` | 80px                  |

<StoryCanvas of="Icon/ExplicitSizes" showLink />

### Icons next to text

Without a `size` prop, the icon is as tall as the line of text it sits in, so it scales with the text size and density. It needs no extra margins to sit on the line. This is the recommended approach for icons inline with text.

<StoryCanvas of="Icon/InlineWithText" showLink />

### Density

Set `data-density` on a parent element to `compact`, `comfortable` or `relaxed`. Icons next to text follow the line height, and explicit sizes follow the spacing scale, so both change with the density.

<StoryCanvas of="Icon/Densities" showLink />

### Color

Icons inherit `currentColor` by default, making them adapt to text color automatically. You can also set a custom color using the `color` prop.

<StoryCanvas of="Icon/Color" showLink />

## Usage in Figma

There is no dedicated Icon component in Figma. Instead, icons are imported directly from the **Assets** panel.

**Standalone icons** — Import the icon from Assets and place it directly in your design. The icon size is controlled by the asset itself.

**Inline with Typography** — When placing an icon inline with text, wrap it in a container like "Leading Icon Item". This container applies negative padding to optically align the icon with the text baseline — matching how the code component behaves with negative margins for inline icons.

The container exposes variables for controlling size and negative padding:

| Variable                              | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `Selectable/Icon size`                | Controls the icon dimensions                         |
| `Selectable/Icon container padding ↕︎` | Negative vertical padding for optical alignment      |
| `Selectable/Icon container padding ↔︎` | Negative horizontal padding (square containers only) |

**Which padding variables to use depends on the container shape:**

- **Rectangular containers** (e.g., a button with text) — Only vertical padding (`↕︎`) is needed. Horizontal spacing is handled by the parent layout's gap.
- **Square containers** (e.g., an icon-only button) — Both vertical (`↕︎`) and horizontal (`↔︎`) padding are needed, set to the same value, since the icon fills the container in both directions.

## Accessibility

Icons follow WCAG 2.1 AA guidelines with two distinct modes:

**Decorative icons** (no `title` prop)

- Rendered with `aria-hidden="true"`
- Hidden from screen readers entirely
- Use when the icon is accompanied by visible text that conveys the same meaning

**Semantic icons** (with `title` prop)

- Rendered with `role="img"` and `aria-labelledby`
- Announced by screen readers using the title text
- Use when the icon conveys meaning that is not available through surrounding text

<StoryCanvas of="Icon/Accessibility" showLink />

## Do's and Don'ts

:::info **Do**

- Use `title` prop when an icon is the only element conveying meaning (e.g., icon-only buttons)
- Leave out the `size` prop for icons inline with text, so they follow the line height
- Use the `size` prop in flex layouts where you control spacing with gap
- Rely on `currentColor` for icons that should match surrounding text color
  :::

:::danger **Don't**

- Don't use icons without a `title` when there is no accompanying text to convey the meaning
- Don't set the `size` prop on an icon inside a component such as Button or Chip. The component sets the icon size, so the prop has no effect
- Don't use custom pixel values for sizing - use the `size` prop or let tokens handle it
  :::
