---
title: Selection controls
description: Checkbox, radio, and switch inputs for making choices and setting states.
tags: [input, selection]
---

# Selection controls

Selection controls allow users to select options, make decisions, and set preferences.

## When to Use

Use checkboxes for independent multi-selection, radios for mutually exclusive single selection, and switches for immediate on/off state changes. Avoid mixing patterns in a single logical group. (Detailed usage matrix to be added soon.)

## Structure

- Control (checkbox / radio / switch)
- Label text (clickable region)
- Optional helper / description – To be added soon
- Optional group legend (fieldset) – To be added soon

## Guidelines

Controls must be clearly visible; selected state should be more prominent. Every control has an associated label with a click/tap target encompassing control + label. Additional spacing, grouping, and density guidance to be added soon.

Do:

- Use a fieldset + legend for grouped radios (accessibility)
- Provide clear default state

Don’t:

- Use switches for form submissions requiring confirmation
- Present a single radio on its own (use a checkbox instead)

## Accessibility

Accessibility specifics (fieldset/legend usage, aria-checked for custom styling, focus ring visibility, switch role semantics) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on error messaging, nested groups, and indeterminate checkbox state will be added soon. Reach out if needed earlier.
