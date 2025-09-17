---
title: Tooltip
description: Provides brief contextual help or labels on hover, focus, or long press.
tags: [information, assistive]
---

# Tooltip

Tooltips show when hovered, focused, or long-pressed and display a short label or description.

## When to Use

Use to clarify an icon, control, or truncated text without adding permanent on-screen noise. Avoid for critical information or actions required to complete a task. (More detailed criteria to be added soon.)

## Structure

- Trigger element
- Tooltip container
- Text content (single concise line preferred)
- Pointer / caret (optional) – To be added soon
  Positioning variants (top, right, bottom, left) – To be added soon

## Guidelines

Tooltips disappear when hover ends, focus moves, or long press is released. Keep content short (target ≤80 characters, ideally single line). They should point or clearly relate to the triggering element.

Do:

- Use for clarification, not discovery of essential features
- Ensure sufficient contrast

Don’t:

- Place interactive elements inside tooltips
- Depend on tooltip content for required instructions

## Accessibility

Accessibility specifics (aria-describedby usage, focus management, touch delay, motion/exit timing) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on delayed appearance, dismissal timing, and multi-line wrapping will be added soon. Reach out if needed earlier.
