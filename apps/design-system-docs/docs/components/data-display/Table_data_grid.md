---
title: Table data grid
---

# Table data grid

Table data grids present large, information‑dense datasets in an interactive, scrollable grid. They help users explore, compare, and act on structured data efficiently while maintaining clarity and alignment.

## When to Use

Use the table data grid when:

- You need to display many rows and/or many columns.
- Users must sort, scan, compare, or interact with multiple data types in place.
- Columns may include mixed content (icons, numbers, inputs, actions).
- Truncation, tooltips, or responsive column handling are required.

Avoid it when:

- The dataset is small and simple—consider a basic table instead.
- A visual chart communicates trends more effectively.
- Content is primarily unstructured text.

## Structure

Typical parts of a table data grid include:

- Header row: Column labels (optionally with units), sorting icons, and alignment rules.
- Body rows: Cells containing text, numbers, icons, links, inputs, or custom content.
- Cell variants: Standard text, numeric (optionally monospaced), interactive elements.
- Supporting behaviors (if implemented): Sorting, selection, resizing, and truncation with tooltip.

## Guidelines

- Keep column labels concise (ideally ≤ 3 words).
- Provide a tooltip when a label or cell value is truncated.
- Left-align text labels; numeric columns may be left or right aligned—be consistent.
- Use monospaced numeric style for columns containing only numbers to improve vertical scan.
- Use consistent spacing so header content (label, icon, unit) aligns visually with cell content below.
- Distinguish interactive vs. static icons using the appropriate token colors.
- Do not overload a single row with too many interactive elements—prioritize primary actions.

Color usage:

- `Text+static icons/Default` for non‑interactive icons.
- `Interactive Primary/Resting` for interactive icons (e.g., checkboxes) in active state.
- `Interactive/Disabled/Text` for disabled, non‑interactive icons.
- `Interactive/Disabled/Fill` for disabled interactive icons.

## Accessibility

To be added soon

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support

If you have questions, suggestions, or need help adopting the table data grid, reach out through our design system support channels. We welcome feedback to keep improving the experience.
