---
title: Divider
sidebar_position: 2
---

# Divider

A divider is a thin horizontal line that brings clarity to layout by grouping and separating content. Designed with care, dividers should be noticeable but never compete for attention - they help establish rhythm and hierarchy across our interfaces.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-surface-divider--introduction"
  width="100%"
  height="245"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-surface-divider--introduction)

## When to Use

Use a divider to group related content or separate sections of a layout when white space alone is not enough to communicate the structure.

- Use dividers occasionally, to create groupings rather than separate individual items
- Dividers should be noticeable in a layout, but not clashing
- Dividers should only be used if elements can't be split using white space
- Dividers can help establish rhythm and hierarchy

**Avoid dividers for:**

- Decorating layouts where white space already creates clear separation
- Splitting every individual item in a list - reserve them for meaningful groupings

## Accessibility

Dividers follow the [WAI-ARIA separator pattern](https://www.w3.org/TR/2017/REC-wai-aria-1.1-20171214/#separator) and render as a non-interactive `<hr>` element with `role="separator"`.

- Use the divider as a decorative separator between groups of related content - it communicates structure visually without becoming an interactive element
- Keep enough contrast between the divider and its background so the separation reads clearly, while staying subtle enough to avoid clashing with surrounding content
- Do not rely on dividers alone to convey grouping for assistive technology - structure content with appropriate landmarks, headings, or list semantics

## Figma

### Components

- **Divider [EDS]**: A thin horizontal line using the subtle border colour token

### Using the Divider in Figma

1. In Figma, go to the **Assets Panel** and search for **Divider**
2. Drag the component into your frame
3. Resize the divider horizontally to match the width of the container it separates

The divider uses the `--eds-color-border-subtle` token, so it adapts automatically to the active theme mode set on the containing frame.

## Do's and Don'ts

:::info **Do**

- Use dividers to group related content into meaningful sections
- Let the surrounding layout control the divider's width - the component fills its container by default
- Keep dividers consistent across similar layouts to reinforce rhythm and hierarchy
  :::

:::danger **Don't**

- Place a divider between every item in a list - white space is usually enough
- Use dividers as decoration where they add visual noise without clarifying structure
- Override the subtle border colour with a stronger tone - dividers should support content, not compete with it
  :::
