---
title: Slider
description: Adjusts a numeric value or range along a continuous or stepped track.
tags: [input, control]
---

# Slider

Sliders allow users to adjust predefined values.

## When to Use

Use for quick adjustment of a numeric value or range when fine-grained precision is not critical. Avoid when exact values are required (use a text field or stepper). (Detailed criteria to be added soon.)

## Structure

- Track (continuous or stepped)
- Thumb (single) or thumbs (range)
- Optional ticks / marks – To be added soon
- Value label / tooltip – To be added soon
- Min/max labels – To be added soon

## Guidelines

Displays current value along a bar; updates apply immediately. Range sliders allow selecting min and max bounds. Provide visible min/max context. Additional guidance on snapping, keyboard step, and vertical orientation to be added soon.

Do:

- Provide numeric alternative where precision matters
- Ensure adequate thumb size for touch

Don’t:

- Use extremely small increments demanding fine motor control
- Hide current value entirely (value presentation guidance to be added soon)

## Accessibility

Accessibility specifics (ARIA roles, aria-valuenow/aria-valuemin/aria-valuemax, keyboard arrow/page/home-end behavior) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on dual-thumb overlap handling, tooltips, and reduced motion preferences will be added soon. Reach out if needed earlier.
