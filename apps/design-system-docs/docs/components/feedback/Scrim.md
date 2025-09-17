---
title: Scrim
description: Translucent overlay that dims underlying UI to emphasize a foreground surface.
tags: [feedback, overlay]
---

# Scrim

A scrim is a temporary visual effect that fades the general interface while allowing focus on an overlay.

## When to Use

Use with modal or elevated overlay components (dialog, elevated navigation, side sheet) to direct attention. Avoid standalone use without a foreground surface. (Component pairing guidance to be added soon.)

## Structure

- Full-viewport backdrop layer
- Optional blur / tint variant – To be added soon
- Foreground surface (paired component) sits above

## Guidelines

Always paired with an overlay. Clicking the scrim or pressing ESC closes the foreground surface (unless a blocking state). Focus moves appropriately afterward. Additional opacity tokens and theming variants to be added soon.

Do:

- Ensure sufficient contrast for foreground content
- Prevent interaction with background while active

Don’t:

- Stack multiple scrims
- Use without a dismissal path

## Accessibility

Accessibility specifics (aria-hidden for background, focus return strategy, escape handling exceptions) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on motion transitions, blur vs tint criteria, and non-dismissable (blocking) cases will be added soon. Reach out if needed earlier.
