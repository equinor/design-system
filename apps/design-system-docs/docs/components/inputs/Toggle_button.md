---
title: Toggle button
description: Exclusive set of related options presented as segmented buttons.
tags: [input, selection]
---

# Toggle button

Toggle buttons allow users to select one of multiple related options.

## When to Use

Use for switching between mutually exclusive, closely related states (e.g., view modes). Avoid when options are independent (use checkboxes) or hierarchical (use tabs if content changes significantly). (Detailed comparison matrix to be added soon.)

## Structure

- Container / group
- Individual toggle segment (text or icon)
- Selected state styling
- Optional icon-only or text-only modes
- Optional multi-select variant – To be added soon

## Guidelines

Icons must directly reflect their action. Only one option active at a time (exclusive selection). Selecting a new segment deselects the previous one. Provide clear spacing and visual grouping. Additional density, size, and wrapping guidance to be added soon.

Do:

- Keep label or icon meaning obvious
- Maintain consistent width or allow natural width based on context

Don’t:

- Mix unrelated action types in one group
- Use ambiguous icons without labels (unless universally recognized)

## Accessibility

Accessibility specifics (aria role group, aria-pressed for segments vs radiogroup pattern) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on keyboard arrow navigation, wrapping behavior, and multi-select adaptation will be added soon. Reach out if needed earlier.
