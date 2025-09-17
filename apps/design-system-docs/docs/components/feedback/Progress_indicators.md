---
title: Progress indicators
description: Visual feedback showing loading status or ongoing processing, determinate or indeterminate.
tags: [feedback, loading, progress]
---

# Progress indicators

Progress indicators are animated helpers that indicate waiting time as content loads.

## When to Use

Use when an operation takes noticeable time. Use determinate when progress can be quantified; indeterminate when duration cannot be predicted. Avoid for near-instant actions. (Additional threshold guidance to be added soon.)

## Structure

- Track / container (linear, circular, dots, star)
- Indicator fill / animation
- Optional label / percentage – To be added soon
- Optional helper text – To be added soon

## Guidelines

Determinate shows portion complete; indeterminate conveys ongoing processing without remaining time. Choose variant by context (specific variant placement details to be added soon).

Variant intent:

- Linear: Emphasize area or section-level loading (e.g., page body, footer region, inline component)
- Circular: Compact placeholder usage (icons, empty states) for short waits
- Dots: Subtle inline or lightweight loading contexts – details to be added soon
- Star: Splash screens / branded waiting only

Do:

- Switch from indeterminate to determinate once total progress known
- Provide nearby context if animation may exceed a few seconds

Don’t:

- Loop indeterminate endlessly without fallback messaging
- Use multiple different indicator styles simultaneously in one view

## Accessibility

Accessibility specifics (aria-valuenow / aria-valuemax for determinate, role="status" / polite live regions, reduced motion considerations) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on adaptive transitions, skeleton vs progress indicator selection, and motion reduction strategies will be added soon. Reach out if needed earlier.
