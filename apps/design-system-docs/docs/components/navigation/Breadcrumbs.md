# Breadcrumbs

Breadcrumbs show the navigational path to users, letting them move up the hierarchy of a site or app. They help people understand where they are and how to return to previous levels.

## When to Use

Use breadcrumbs whenever you have a multi‑level hierarchy that benefits from an explicit “back‑to” trail—such as e‑commerce categories, nested settings pages, or documentation trees.

## Structure

- **Placement** – Always in the upper‑left corner of the page, directly below any top‑bar elements (e.g., logo or main navigation).
- **Length** – If a path is too long for one line, choose one of three options:
  - **Auto‑collapse** – Show only the first and last items; use `…` to indicate omitted middle levels. Clicking the ellipses expands the full list.
  - **Expanded breadcrumbs** – Wrap the trail onto two or more lines while keeping all items visible.
  - **Truncation** – Shorten long labels to fit the available width, ending with an ellipsis (`…`). A tooltip appears on hover (or long‑press) to reveal the full label.

## Guidelines

- Every breadcrumb link must be clickable and lead to a real page.
- Keep the first and current/last items visible in auto‑collapsed mode.
- Use `…` consistently for collapsed or truncated text.
- When expanded, allow keyboard navigation: tab through each breadcrumb, then press **Enter** or **Space** to activate it.

## Accessibility

- Provide clear focus states so keyboard users can see which item is active.
- Include tooltips on hover/long‑press for truncated labels so screen reader and sighted users get the full text.

## Implementation in Figma

1. Open the **Assets Panel** and search for “breadcrumbs.”
2. Drag the component onto your frame.
3. In the **Design Panel**, choose the desired variant (auto‑collapsed, expanded, or truncated).
