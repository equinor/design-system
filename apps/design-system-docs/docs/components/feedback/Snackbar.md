---
title: Snackbar
description: Low-priority brief notification that auto-dismisses after a short duration.
tags: [feedback, notification]
---

# Snackbar

Snackbars provide brief, non-interruptive notifications. They appear near the bottom of the screen, give lightweight feedback, and disappear automatically after a short duration.

## When to Use

Use a snackbar when:

- You need to inform the user that a background or quick action completed.
- An optional reversible action (e.g. Undo) is available for a few seconds.
- The message is low priority and should not block the workflow.

Avoid it when:

- The information must persist until dismissed (use a banner).
- The user must make a decision before continuing (use a dialog).
- Multiple complex actions are required (consider a different pattern).

## Structure

- Container: Positioned near bottom (center; left-aligned on wide layouts if specified).
- Message text: One concise sentence (wraps to max two lines on small screens).
- Optional single action: Text button for a contextual reversal or follow-up (Undo, Retry).

## Guidelines

- Show only one snackbar at a time; queue additional messages.
- Keep text short and scannable; avoid technical jargon.
- Auto-dismiss after 5–10 seconds; do not require manual close.
- Do not label the action Close/Dismiss (they auto-dismiss anyway).
- Limit to a single action button; avoid stacking choices.
- Allow up to two lines on narrow screens; otherwise keep to one line.
- Align consistently across breakpoints (center vs left alignment) — detailed responsive rules to be added soon.

Do:

- Use action verbs (Undo, Retry)
- Provide clear, immediate feedback

Don’t:

- Use for critical errors or blocking states
- Stack multiple snackbars simultaneously

## Accessibility

To be added soon

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

If you need guidance on queuing strategy, theming variants, or reduced-motion behavior, reach out through our design system support channels. Additional accessibility details will be added soon.
