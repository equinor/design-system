---
title: Button
description: Triggers an immediate action or event on user interaction.
tags: [input, action]
---

# Button

Buttons allow users to take action with a single click or tap.

## When to Use

Use a button for initiating an action in the current context. Avoid when navigation is the primary intent (use a link). (Detailed decision matrix to be added soon.)

## Structure

- Container (variant: contained, outlined, ghost)
- Label text
- Optional leading icon
- Optional trailing icon
- Optional full-width layout – To be added soon

## Guidelines

Variants: primary, secondary, danger across contained, outlined, ghost. Icons must have a direct relationship to the action. Provide clear, concise labels (verb-first where appropriate). Guidance on hierarchy (primary vs secondary placement) to be added soon.

Do:

- Use one primary button per view region
- Keep labels short (≤3 words where possible)

Don’t:

- Pair unrelated iconography
- Stack multiple danger buttons together

## Accessibility

Accessibility specifics (focus states, disabled semantics, aria-pressed for toggle patterns, high contrast adaptations) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on grouping, responsive sizing, and destructive confirmation patterns will be added soon. Reach out if needed sooner.
