---
title: App launcher
description: Provides navigation between related applications in a suite.
tags: [navigation, multi-app]
---

# App launcher

An app launcher provides navigation for applications related to the one the user is currently viewing. It helps users move between tools while staying oriented.

## When to Use

Use when:

- Users need quick access to a defined set of related applications
- You want to keep multi‑app workflows efficient

Avoid when:

- There is only one application
- Links are unrelated or purely external

## Structure

- Container (navigation region)
- Application item (icon + label)
- Active state indicator
- (Optional) grouping / sections – To be added soon
- (Optional) overflow or expansion – To be added soon

## Guidelines

An app launcher is used to organise navigation across related applications. The current application shows as active. Each application displays a product icon and a label. Truncated labels must expose the full text via tooltip.

Do:

- Keep labels concise
- Use consistent product icons
- Indicate only one active application

Don’t:

- Overload with rarely used destinations
- Use inconsistent ordering between pages

## Accessibility

- Provide an accessible label on the navigation container (e.g. aria-label) – To be added soon
- Use aria-current for the active application – To be added soon
- Ensure truncated labels have accessible tooltips – To be added soon

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Further guidance on grouping, responsive behavior, and overflow handling to be added soon. Reach out if you need these details sooner.
