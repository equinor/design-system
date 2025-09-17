---
title: Table
description: Presents structured data for comparison across rows and columns.
tags: [data-display, tabular]
---

Tables display data in a structured format.

## When to Use

Use for presenting structured datasets requiring scanning or comparison. Consider the data grid component for large datasets with advanced features. (More detailed selection criteria to be added soon.)

## Structure

- Caption (describes entire table)
- Header row (column labels, optional sort icons, units)
- Data rows (cells: text, numbers, icons, inputs)
- Optional footer / summary – To be added soon
- Optional row selection controls – To be added soon

## Guidelines

Use for minimal to moderate interaction (basic sorting, scanning). Let users compare information efficiently. Provide concise headers; truncate with tooltip if necessary. Align numeric data consistently (left or right). Use monospaced numeric cells for improved comparison.

Caption: Describes whole content; supports navigation and understanding.
Header: Communicates column meaning; may include icons and units.
Cell: May include icons, links, inputs, numbers, monospaced variants.

Colour usage:

- Text+static icons/Default: non-interactive icons
- Interactive Primary/Resting: interactive icons (e.g. checkboxes)
- Interactive/Disabled/Text: disabled non-interactive
- Interactive/Disabled/Fill: disabled interactive icons

Avoid overly long labels; keep to the point (≤3 words). Additional guidance on responsive collapse, column hiding, and density modes to be added soon.

## Accessibility

Accessibility specifics (scope attributes, header associations, sorting announcements, row selection semantics) to be added soon.

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

Guidance on sticky headers, virtual scrolling, and inline editing patterns will be added soon. Reach out if needed sooner.
