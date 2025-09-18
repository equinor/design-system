---
title: Top bar
description: Persistent header displaying global navigation, context, and utility actions.
tags: [navigation, layout, header]
---

# Top bar

The top bar (header) provides persistent global navigation, context (title/subtitle), and key utility actions available across the product.

## When to Use

Use the top bar when:

- Users need consistent access to primary navigation and utilities.
- The product spans multiple views requiring a persistent title or context.
- Global actions (profile, accessibility, notifications) must remain always visible.

Avoid it when:

- A simple single-view tool has only one or two actions (a lightweight layout may suffice).
- Navigation is purely contextual or scoped to a panel (consider in-surface controls instead).

## Structure

- Container: Full-width, fixed (non-scrolling) region.
- Leading area: Product/app title (optional subtitle) and primary navigation trigger (e.g. app launcher or drawer toggle).
- Center area (optional): Tabs, search, or contextual controls (menus, filter affordances) — further rules to be added.
- Actions area (right): Fullscreen, notifications, accessibility (mandatory), user profile (mandatory).
- Overflow / responsive behavior: To be added soon.

## Guidelines

- Keep global utilities consistent in order and presence.
- Use a single navigation entry point (avoid multiple competing triggers).
- Restrict center area content to navigation or high-frequency contextual tools.
- Avoid placing page-specific destructive or narrow-scope actions in the top bar.
- Maintain visual hierarchy: title/subtitle should read clearly at typical view widths.
- Responsive collapse, density adjustments, and overflow menu behavior: To be added soon.

Do:

- Keep the action set focused on global utilities.
- Provide accessible names for all icon actions.
- Maintain a stable order across routes.

Don’t:

- Overload with rarely used page-specific commands.
- Reorder actions contextually.
- Duplicate navigation patterns.

### Standard actions (right side)

- Fullscreen: Toggles immersive mode.
- Notifications: Opens a menu showing recent updates.
- Accessibility: Opens options (e.g. light/dark mode, font size). Mandatory.
- User profile: Opens account / sign-out menu. Mandatory.

## Accessibility

To be added soon

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

If you need guidance on responsive collapse, theming variants, density modes, or integration with navigation drawers, reach out through our design system support channels. Additional accessibility details will be added soon.
