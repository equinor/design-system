---
title: Banner
description: Medium-priority notification with optional actions, shown at top of content area.
tags: [feedback, notification]
---

# Banner

Banners display important notifications and related optional actions.

## When to Use

Use for medium‑priority notifications that may require acknowledgement or an optional action. Avoid for transient low-priority updates (use snackbar) or blocking/high-priority alerts (use dialog). (Priority mapping details to be added soon.)

## Structure

- Container (full-width within main content area)
- Icon (optional)
- Message text
- Primary action (optional)
- Secondary / dismiss action (optional)
  Placement and responsive stacking rules to be added soon.

## Guidelines

Communicate a change or error; require an action to dismiss when appropriate. May be fixed or scroll with content. Should span 100% of main content width but not overlap persistent side surfaces. Alternative names (alert bar, inline alert) to be added soon.

Do:

- Keep message concise
- Provide clear action wording

Don’t:

- Use for frequent, low-noise updates
- Stack excessive banners (handling guidance to be added soon)

## Accessibility

Accessibility specifics (role="alert" vs role="status" usage, focus management when injected, dismiss button labeling) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on stacking, auto-dismiss patterns, and theming variants will be added soon. Reach out if needed sooner.
