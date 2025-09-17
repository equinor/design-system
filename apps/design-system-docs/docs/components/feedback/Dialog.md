---
title: Dialog
description: Modal surface that interrupts workflow to present critical information or required decisions.
tags: [feedback, modal, blocking]
---

# Dialog

Dialogs display critical notifications and required actions.

## When to Use

Use for urgent decisions, critical confirmations, or destructive actions. Avoid for low/medium priority messaging (use banner or snackbar). (Priority mapping details to be added soon.)

## Structure

- Overlay (scrim behind)
- Container
- Title (optional if clear from content)
- Content body (message, form, etc.)
- Action area (primary + optional secondary; never more than 2 actions)
  Scrolling behavior (fixed header/footer with scrollable body) to be added soon.

## Guidelines

Blocks underlying interaction until user responds. Keep content concise; minimize scrolling. Actions must relate directly to the message. Use sparingly due to high interruption level.

Do:

- Provide a clear primary action
- Use specific destructive action labels (e.g., Delete, not OK) – To be added soon

Don’t:

- Add tertiary actions in footer
- Use for non-critical status updates

## Accessibility

Accessibility specifics (focus trapping, aria-modal, initial focus strategy, escape key handling) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on responsive sizing, stacking modals prevention, and form validation inside dialogs will be added soon. Reach out if needed sooner.
