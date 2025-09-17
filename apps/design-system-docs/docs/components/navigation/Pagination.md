---
title: Pagination
description: Divides long datasets or content into multiple pages with navigation controls.
tags: [navigation]
---

# Pagination

Pagination divides large sets of content into manageable pages and provides clear controls for navigating between them while maintaining a sense of position (page X of Y).

## When to Use

Use pagination when:

- The dataset or content list is too large to display at once.
- Users need direct access to specific page ranges.
- Server‑side loading or page-based retrieval is required.

Avoid it when:

- Only a small number of items exist (show them all instead).
- A continuous browsing pattern (infinite scroll) better supports discovery.
- Users only move sequentially (Previous/Next alone may suffice).

## Structure

- Container: Navigation wrapper (typically a `nav` element with an accessible label).
- Page list: Sequence of page items (numbers and optional ellipsis).
- Page item: Direct link/button to a specific page.
- Current page: Highlighted, non-interactive item with `aria-current="page"`.
- Previous / Next controls: Step navigation.
- Optional First / Last controls: Jump to bounds when page count is large.
- Ellipsis: Non-interactive indicator for skipped page ranges.

## Guidelines

Behavior:

- Disable Previous on the first page; disable Next on the last page.
- Do not make ellipsis focusable or interactive.
- Keep visible numeric page items concise (commonly current ±2 pages).

Content & Clarity:

- Use numeric labels only; avoid adding icons inside page numbers.
- Provide a clear accessible label (e.g., `aria-label="Pagination"` or contextual variant like `"Results pages"`).
- Maintain consistent sizing and spacing for predictable hit areas.

Usability:

- Ensure touch targets meet minimum size guidance.
- Avoid combining pagination with infinite scrolling.
- Prefer not to show First/Last controls when page count is small.

## Accessibility

To be added soon

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

If you need patterns for server-side loading, responsive collapsing, or condensed modes, reach out through our design system support channels. Contributions and feedback help us improve this component.
