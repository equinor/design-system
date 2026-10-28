---
title: Icon
hide_title: true
description: 'Icons are small visual symbols that communicate meaning at a glance. They support text labels, guide users through interactions, and add clarity to our interfaces. The Icon component is designed with care to adapt to density modes and meet accessibility standards out of the box.'
---

<StoryCanvas of="Icon/Introduction" showLink />

## When to Use

Use Icon to reinforce meaning alongside text - in buttons, form fields, status messages, and navigation. Icons help users scan interfaces faster and understand actions without reading every label.

**Avoid Icon for:**

- Purely decorative illustrations - use an image instead
- Complex graphics or logos - use a dedicated image or SVG

## Structure

The Icon component renders an SVG element with a single `data` prop from `@equinor/eds-icons`. It is sized in one of three ways:

- **Default** - without a `size` prop, the icon is `spacing-xl` (24px at Comfortable), the icon size used in the EDS Assets Figma file
- **Explicit `size` prop** - the spacing token of the same name, so `size="md"` is `spacing-md`
- **Inside a component** - components such as Button and Chip set the icon size themselves, and the `size` prop has no effect

## Guidelines

### Sizes

Each size is the spacing token of the same name, so the size you set in code is the variable bound in Figma. An icon without `size` is the same as `size="xl"`. The sizes follow the density set on a parent element.

| Size | Token         | Comfortable (default) |
| ---- | ------------- | --------------------- |
| sm   | `spacing-sm`  | 12px                  |
| md   | `spacing-md`  | 16px                  |
| lg   | `spacing-lg`  | 20px                  |
| xl   | `spacing-xl`  | 24px                  |
| 2xl  | `spacing-2xl` | 28px                  |
| 3xl  | `spacing-3xl` | 32px                  |
| 4xl  | `spacing-4xl` | 40px                  |
| 5xl  | `spacing-5xl` | 48px                  |
| 6xl  | `spacing-6xl` | 64px                  |
| 7xl  | `spacing-7xl` | 80px                  |

<StoryCanvas of="Icon/ExplicitSizes" showLink />

### Icons next to text

The icon size does not follow the size of the surrounding text. Next to smaller text, set `size` to the spacing token the design uses, for example `md` next to small labels. An inline icon is centred on the text.

<StoryCanvas of="Icon/InlineWithText" showLink />

### Density

Set `data-density` on a parent element to `compact`, `comfortable` or `relaxed`. Every icon size, including the default, follows the spacing scale and changes with the density.

<StoryCanvas of="Icon/Densities" showLink />

### Colour

Icons take the colour of the surrounding text by default, so an icon next to a label always matches it. When an icon needs a colour of its own, use one of the semantic icon colour tokens instead of a fixed colour value, so the icon still adapts to light and dark mode.

<StoryCanvas of="Icon/Color" showLink />

## Accessibility

Icons follow WCAG 2.1 AA guidelines with two distinct modes:

**Decorative icons** (no `title` prop)

- Hidden from screen readers entirely
- Use when the icon is accompanied by visible text that conveys the same meaning

**Semantic icons** (with `title` prop)

- Exposed as an image and announced by screen readers using the title text
- Use when the icon conveys meaning that is not available through surrounding text

<StoryCanvas of="Icon/DecorativeAndSemantic" showLink />

## Figma

There is no dedicated Icon component in Figma. Icons are imported directly from the **Assets** panel, where they are `spacing-xl` (24px at Comfortable), the same as an Icon without `size` in code.

To use another size, bind the icon's width and height to a spacing variable. The variable name is the `size` in code: an icon bound to `spacing-md` is `size="md"`. The icon size does not follow the size of the text next to it.

## Do's and Don'ts

:::info **Do**

- Use the `title` prop when a standalone icon is the only element conveying meaning
- Give an icon-only button its accessible name on the button, and keep the icon decorative
- Use the `size` that matches the spacing variable bound in Figma
  :::

:::danger **Don't**

- Don't give the icon in an icon-only button a `title` as well, or screen readers read the name twice
- Don't set the `size` prop on an icon inside a component such as Button or Chip. The component sets the icon size, so the prop has no effect
- Don't use custom pixel values for sizing - use the `size` prop or let tokens handle it
  :::
