---
title: Breadcrumbs
description: Show the navigational path and let users move up the hierarchy.
tags: [navigation, hierarchy]
---

# Breadcrumbs

Breadcrumbs show the navigational path to users allowing them to navigate up the hierarchy.

## When to Use

Use when pages are nested and users may need to move upward quickly. Avoid when the structure is flat. (More detailed criteria to be added soon.)

## Structure

- Container
- List of ancestor links
- Separator
- Current / last item (not a link)
- Optional ellipsis item for collapsed middle segments
  Details on markup to be added soon.

## Guidelines

All links in breadcrumbs are clickable and must resolve to a page. Placement: upper-left area below primary header (exact placement text missing – to be added soon).

Depth handling options:

- Auto-collapse: Use ellipses (...) for middle pages; first and last remain visible. Clicking ellipses expands.
- Expanded: Can wrap to multiple lines when space is limited.
- Truncation: Long labels may truncate; show ellipsis and reveal full label via tooltip on hover/long press.

Do's and don'ts to be added soon.

## Accessibility

Accessibility specifics (roles, aria attributes, keyboard behavior) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Additional guidance on collapse behaviors, responsive wrapping, and accessibility will be added soon. Reach out if you need this sooner.
