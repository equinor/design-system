---
title: Text field
description: Captures user textual input in single or multi-line form.
tags: [input, form]
---

# Text field

A text field lets users enter, interact and edit content, typically in forms and dialogs.

## When to Use

Use for freeform textual input. Use single-line for short entries; multi-line (textarea) for longer content. Avoid when discrete options suffice (use select, radio, or autocomplete). (More detailed criteria to be added soon.)

## Structure

- Container (state: default, focus, error, disabled)
- Label (external or placeholder) – To be added soon
- Input area (single or multi-line)
- Optional leading icon
- Optional trailing icon / action (clear, reveal, etc.) – To be added soon
- Optional unit / suffix text
- Helper or error text region

## Guidelines

Single-line vs multi-line usage based on expected length. Units and placeholder icons may appear with maintained spacing. Provide clear labels (avoid relying solely on placeholder). Additional guidance on character limits, validation timing, and masking to be added soon.

Do:

- Pair errors with clear helper text
- Maintain consistent vertical spacing across form fields

Don’t:

- Use placeholder as sole label
- Overload with multiple trailing actions

## Accessibility

Accessibility specifics (label association, aria-describedby for helper/error, input type semantics, invalid state handling) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on inline validation, password reveal toggles, and multi-line resizing behavior will be added soon. Reach out if needed earlier.
