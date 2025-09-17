---
title: Snackbar
description: Low-priority brief notification that auto-dismisses after a short duration.
tags: [feedback, notification]
---

# Snackbar

Snackbars provide brief temporary non-interrupting notifications at the bottom of the screen.

### Simple

- Snackbars appear without warning, and do not require user interaction.
- When multiple snackbar updates are necessary, they should appear one at a time.

### With action

A snackbar can contain a single action, a single text button that lets users take action on a process performed by the app.

## Guidelines

Snackbars provide an update on a process that has or will be performed. Snackbars deliver low priority information while  deliver medium priority and  deliver high priority. Snackbars appear centered at the bottom of the screen and disappear without user interaction. On wider screens they are left-aligned. Snackbars appear on-screen between 5-10 seconds before dismissing themselves, so keep text short.

Snackbars can have one action. This action should not be "Close " or "Dismiss" since snackbars disappear automatically. Actions such as "Undo" or "Retry" are acceptable. Snackbars can wrap up to two lines of text on smaller screens.

# Snackbar

Snackbars provide brief temporary non-interrupting notifications.

## When to Use

Use for low-priority, ephemeral updates that require minimal or no user intervention. Avoid for messages needing persistent visibility (use banner) or blocking confirmation (use dialog). (Priority mapping details to be added soon.)

## Structure

- Container (bottom placement)
- Message text (1–2 lines)
- Optional single action button
  Placement variants (center vs left-aligned on wide screens) to be added soon.

## Guidelines

Appear near bottom, auto-dismiss after 5–10 seconds. Only one snackbar visible at a time. Single action allowed (avoid generic Close/Dismiss; use undo-style verbs). Wrap to two lines maximum on small screens. Additional stacking and queuing guidance to be added soon.

Do:

- Keep text concise and scannable
- Use action verbs for the single action

Don’t:

- Provide multiple competing actions
- Use for critical errors

## Accessibility

Accessibility specifics (aria-live politeness level, focus handling when action present, announcing dismissal) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on queuing strategy, theming variants, and reduced-motion behavior will be added soon. Reach out if needed sooner.
