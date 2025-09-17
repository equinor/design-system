---
title: Tabs
description: Switch between related content views of equal hierarchy within the same context.
tags: [navigation, segmentation]
---

# Tabs

Tabs organise related content across different views to be quickly navigated.

## When to Use

Use tabs when content sections share equal hierarchy and users need to switch quickly without changing page context. Avoid tabs for deep navigation, unrelated destinations, or long sequential workflows. (More detailed criteria to be added soon.)

## Structure

- Tab list container
- Individual tab (label, optional icon)
- Active indicator / underline
- Associated panel (one visible at a time)
- Optional embedded search (as seen in “With search” variant)
  Details on semantics and ARIA roles to be added soon.

## Guidelines

Tabs allow navigation between related content of equal importance. Each tab’s content should be clearly distinct. Layout is space-efficient and keeps users oriented.

Width options:

1. Equally divide available width (only recommended for ≤4 tabs)
2. Match widest tab for visual balance (ensure smaller layouts still show all tabs)
3. Natural / min-width per tab to conserve space

Labels: Provide clear direction; truncate only when necessary and show full text via tooltip. Active/inactive state styling details to be added soon.

Exceptions: If the Navigation Drawer is not used, tabs may appear in the Top Bar as primary navigation linking to otherwise unrelated pages (exception usage specifics to be added soon).

## Accessibility

Accessibility specifics (keyboard navigation order, arrow key behavior, focus management, aria-selected, aria-controls) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Further guidance on scrollable tab lists, overflow handling, and responsive collapsing will be added soon. Reach out if you need it sooner.
