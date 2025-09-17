---
title: Sidebar
description: Provides a persistent, single-level navigation space with optional collapse.
tags: [navigation]
---

# Sidebar

The sidebar provides a persistent area for single‑level primary navigation. It helps users access core destinations from anywhere in the application and can optionally collapse to save horizontal space.

## When to Use

Use the sidebar when:

- You have more than three primary destinations that must remain globally accessible.
- Persistent wayfinding is important for productivity and orientation.
- Optional collapse/expand improves content focus while retaining quick access.

Avoid it when:

- You have fewer than three destinations (use a simpler header or tabs).
- The navigation is secondary or contextual.
- Multi-level hierarchical navigation is required (a different pattern may be more suitable).

## Structure

- Container: Vertical navigation region (typically `nav` with an accessible label).
- Navigation list: Single level of destinations.
- Item: Icon + (optional) label text when expanded; icon only when collapsed.
- Collapse/expand control (optional): Toggles between full and compact states.
- Tooltip (collapsed mode): Reveals the destination label on hover/focus.

## Guidelines

- Keep it permanently visible; use collapse for space efficiency—not full hide.
- In collapsed mode show only icons; always provide a tooltip for clarity.
- Height should span the full viewport and not scroll—overflow destinations should be reconsidered.
- Limit to primary destinations; avoid placing secondary or contextual links here.
- Use clear, distinct icons that directly represent destinations.
- Maintain consistent ordering; do not reorder dynamically.

## Accessibility

To be added soon

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

If you need guidance on multi-level navigation, responsive adaptation, or keyboard interaction patterns, reach out through our design system support channels. Additional accessibility notes will be added soon.
