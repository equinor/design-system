---
title: Card
description: A flexible container that groups related content and links to deeper detail.
tags: [content, layout, surfaces]
---

# Card

Cards present a focused snapshot of a single subject and invite deeper exploration. We use them to group related content, highlight key information, and provide an accessible entry point into more detailed pages or flows.

## When to Use

Use a card when you need to:

- Group related content (asset summary, document, person, dataset)
- Provide a scannable preview with a clear navigation target
- Combine media and text meaningfully
- Display a collection in a grid or masonry layout

Avoid cards when:

- A plain text link or list row is enough
- The layout is purely tabular (use a table pattern)
- Content is navigational chrome (use navigation components)
- The content mimics a full page (simplify or restructure)

## Structure

Common optional blocks (top → bottom):

- Media (image / illustration / chart / thumbnail)
- Eyebrow or meta label (category, status)
- Title (primary clickable heading or link)
- Supporting text (short description)
- Metadata list (attributes, KPIs, tags)
- Divider (separate content vs. actions—use sparingly)
- Supplemental actions (buttons, icon buttons, overflow menu)
- Secondary content (chips, progress, expandable details)

Keep the primary interactive target clear. Avoid multiple competing navigation targets inside the same card unless hierarchy is obvious.

## Guidelines

Do:

- Keep titles concise and scannable
- Use consistent vertical spacing tokens
- Provide alt text or empty alt for decorative media
- Place secondary actions consistently (usually bottom or grouped)
- Limit actions to those that reinforce the card’s purpose

Don’t:

- Overcrowd with long paragraphs
- Duplicate the same link multiple times
- Use decorative media that adds no meaning
- Mix more than one primary action style

Responsive:

- Stack media above text on narrow screens
- Collapse metadata into an inline list or overflow menu
- Maintain consistent grid gaps and alignment

Semantics & Naming:

- Use `article` for standalone content or `li` within lists
- Ensure only one interactive heading per card
- Avoid nesting focusable elements inside a single large link

## Accessibility

- Landmark semantics: `article` or list semantics for collections
- Images: meaningful `alt` text or empty alt if decorative
- Avoid making the entire card a link if it contains buttons—prefer linking the title
- Maintain visible focus states for all interactive elements
- Do not rely on hover to reveal critical information
- Provide accessible names for action groups (aria-label on button groups or menus)

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support / Next Steps

Need another variant or block? Reach out or open an issue. We improve the card pattern together so it stays purposeful, accessible, and consistent.
