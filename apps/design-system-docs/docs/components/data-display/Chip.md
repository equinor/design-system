---
title: Chip
description: Compact element representing an input, attribute, action, or filter state.
tags: [data-display, selection, filters]
---

# Chip

Chips, also known as tags or badges, represent discrete information.

## When to Use

Use chips for lightweight selections, filters, user-generated inputs, or contextual actions. Avoid when a button, toggle, or checkbox expresses the intent more clearly. (More detailed criteria to be added soon.)

## Structure

- Container (pill shape)
- Label text
- Optional leading icon – To be added soon
- Optional trailing icon / dismiss / action affordance – To be added soon
- State styling (default, selected, disabled, focus) – To be added soon

## Guidelines

Chips allow users to make selections, perform an action, input or display attributes, filter content, and complete tasks. They can originate from free text or predefined options.

Do:

- Keep labels short
- Provide clear hover/focus and selected states
- Use tooltips if truncating content (if ever) – To be added soon

Don’t:

- Overload with multiple icons
- Use as a replacement for primary navigation

## Examples

Choice chip: At least two predefined options; indicates a single selected value.
Filter chip: Multiple predefined keywords; multiple can be selected or unselected.
Action chip: Triggers contextual actions; not removable but may appear dynamically.

## Accessibility

Accessibility specifics (role usage, keyboard selection, aria-pressed vs checkbox semantics for filter chips) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on density, overflow handling, removable vs non-removable semantics, and icon usage will be added soon. Reach out if you need it earlier.
