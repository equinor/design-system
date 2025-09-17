---
title: Popover
description: Floating contextual layer for supplemental information or lightweight actions.
tags: [overlay, contextual]
---

# Popover

A popover is a floating card that provides more information or actions on hover or click.

## When to Use

Use for lightweight, contextual supplemental content or small action groups. Avoid for critical decisions (use Dialog) or large structured content (use Side sheet or dedicated page). (More detailed criteria to be added soon.)

## Structure

- Trigger element
- Popover container
- Content area (text, actions)
- Caret / pointer (directional indicator)
- Optional close button (required if no other interactive element)
  Size constraints (max width 560px, max height 80% viewport) retained from source.

## Guidelines

Popovers provide supplemental content not suited to the primary layout. Always include a directional caret pointing to the trigger area. Dismiss via close icon, ESC, outside click, selecting an action, or opening another popover. If no actions are present the close icon must be the first focusable element. Caret direction supports all sides. Additional spacing, animation, and stacking guidance to be added soon.

Do:

- Keep content concise
- Ensure trigger remains visible while popover is open

Don’t:

- Nest multiple popovers excessively
- Use for persistent content

## Accessibility

Accessibility specifics (focus trap vs non-trap behavior, aria-expanded on trigger, aria-controls linkage, escape handling, pointer target area) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on animation tokens, positioning collisions, and responsive behavior will be added soon. Reach out if needed earlier.
