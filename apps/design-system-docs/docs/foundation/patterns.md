---
title: Patterns
hide_title: true
description: 'Effective design patterns help you create consistent, user-friendly interfaces by providing proven solutions to common design challenges. These patterns ensure your components work harmoniously together whilst maintaining visual structure throughout your product.'
---

## Spacing and grouping

Space tells users which elements belong together. Elements that are related should sit closer to each other than to elements that are not, so the distance between two things reflects how closely they are related. If every gap is the same size, the layout shows no grouping at all.

Use the [spacing tokens](/docs/Next/foundation/design-tokens/spacing) rather than fixed pixel values. The tokens change with density, so a layout built from them stays consistent when it moves between Compact, Comfortable and Relaxed.

### Best practices

:::info **Do**

- Use smaller spacing inside a group and larger spacing between groups
- Use the spacing tokens for every gap, padding and margin
  :::

:::danger **Don't**

- Use the same spacing everywhere, which hides how content is grouped
- Hard-code pixel values that do not follow density
  :::

## Reading patterns and layout

Understanding how users scan and read content helps you place elements effectively. Two primary reading patterns guide interface design: F-pattern and Z-pattern scanning.

The **F-shaped scanning pattern** occurs when users concentrate their attention at the top and left side of the page. Users typically read horizontally across the upper content area, then move down slightly and read across again in a shorter horizontal movement. This pattern works well for content-heavy interfaces and suggests placing primary actions and important information along the left side of your layout.

The **Z-shaped pattern** traces how users scan pages from left to right, top to bottom. Users read horizontally across the top, then move diagonally down and left, followed by another horizontal movement across to the right. This pattern suits marketing pages and simple layouts, with primary actions positioned strategically along the Z-path.

For dialogue windows and modal interfaces, place primary buttons in the bottom right corner for easy access. Position supplemental actions on the opposite side of the dialogue from the main button group to create clear visual hierarchy and prevent accidental clicks.
