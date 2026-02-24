---
title: Icon
---

# Icon

Icons are small visual symbols that communicate meaning at a glance. They support text labels, guide users through interactions, and add clarity to our interfaces. The Icon component is designed with care to scale automatically with typography, adapt to density modes, and meet accessibility standards out of the box.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--introduction"
  width="100%"
  height="88"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--introduction)

## When to Use

Use Icon to reinforce meaning alongside text - in buttons, form fields, status messages, and navigation. Icons help users scan interfaces faster and understand actions without reading every label.

**Avoid Icon for:**

- Purely decorative illustrations - use an image instead
- Complex graphics or logos - use a dedicated image or SVG

## Structure

The Icon component renders an SVG element with a single `data` prop from `@equinor/eds-icons`. It supports three sizing layers:

- **Explicit `size` prop** - highest priority, uses `--eds-sizing-icon-{size}` design tokens
- **Parent Typography** - inherits `--eds-typography-icon-size` from the Typography component
- **Dynamic fallback** - scales at 1.5em relative to the surrounding font size

## Guidelines

### Sizes

Use the `size` prop for explicit sizing. Each size maps to an EDS design token, ensuring consistency across our interfaces.

| Size | Spacious (default) | Comfortable (compact) |
| ---- | ------------------ | --------------------- |
| xs   | 16px               | 14px                  |
| sm   | 18px               | 16px                  |
| md   | 20px               | 18px                  |
| lg   | 24px               | 20px                  |
| xl   | 28px               | 24px                  |
| 2xl  | 32px               | 28px                  |
| 3xl  | 37px               | 32px                  |
| 4xl  | 42px               | 37px                  |
| 5xl  | 48px               | 42px                  |
| 6xl  | 56px               | 48px                  |

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--explicit-sizes"
  width="100%"
  height="136"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--explicit-sizes)

### Auto-sizing with Typography

When placed inside a Typography component, icons automatically inherit the correct size via the `--eds-typography-icon-size` CSS variable. This is the recommended approach for icons inline with text.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--auto-size-from-typography"
  width="100%"
  height="308"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--auto-size-from-typography)

### Density modes

Icons respect the `data-density` attribute for density-aware sizing. The same `size` prop renders at different pixel values depending on the density context.

- **Spacious** (default) - larger icons for more breathing room
- **Comfortable** - smaller icons for compact UIs

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--density-modes"
  width="100%"
  height="162"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--density-modes)

### Dynamic fallback

When no `size` prop or `data-font-size` is set, icons use `1.5em` for dynamic scaling. This means icons are always 1.5x the surrounding font size - a reliable fallback that works in any context.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--dynamic-fallback"
  width="100%"
  height="251"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--dynamic-fallback)

### Colour

Icons inherit `currentColor` by default, making them adapt to text colour automatically. You can also set a custom colour using the `color` prop.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--color"
  width="100%"
  height="88"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--color)

### Inline text vs flex layout

How you use Icon depends on the layout context:

| Context     | Usage                          | Why                                                             |
| ----------- | ------------------------------ | --------------------------------------------------------------- |
| Inline text | `<Icon data={save} />`         | Auto-sizes to 1.5em, negative margins for optical alignment     |
| Flex/Button | `<Icon data={save} size="md">` | Fixed size from tokens, no margins - layout controlled by flex gap |

The `size` prop removes negative margins, giving full control to your layout system.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--inline-with-text"
  width="100%"
  height="257"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--inline-with-text)

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

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-icon--accessibility"
  width="100%"
  height="197"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-icon--accessibility)

## Do's and Don'ts

:::info **Do**

- Use `title` prop when an icon is the only element conveying meaning (e.g., icon-only buttons)
- Let icons inherit size from Typography when used inline with text
- Use the `size` prop in flex layouts where you control spacing with gap
- Rely on `currentColor` for icons that should match surrounding text colour
:::

:::danger **Don't**

- Don't use icons without a `title` when there is no accompanying text to convey the meaning
- Don't set both a `size` prop and rely on Typography auto-sizing - pick one approach per icon
- Don't use custom pixel values for sizing - use the `size` prop or let tokens handle it
:::
