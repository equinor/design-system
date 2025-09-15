---
title: Toolbar
description: Groups related actions so users can apply changes or switch context efficiently.
tags: [actions, navigation, surfaces]
---

# Toolbar

We use the toolbar to gather related actions so people can apply changes or switch context efficiently. It provides a consistent home for primary and secondary commands—designed with care to support focused, predictable workflows.

## When to Use

Use it to:

- Present a small, clear set of contextual actions
- Keep common task actions visible while content updates
- Offer utilities like filters, view toggles, or search

Avoid when:

- Only one action is needed (use a single button)
- Actions belong inline with list or row items
- Actions are rarely used (use a menu or overflow)

## Structure

- Container (toolbar region)
- Leading area (title / context / navigation)
- Primary actions group
- Secondary actions group (filters, view, export)
- Optional spacer (push utilities apart)
- Overflow / more actions menu

Keep ordering consistent across similar screens. Limit visible actions to essentials.

## Guidelines

Do:

- Use short, verb‑first labels
- Group related actions with consistent spacing
- Separate destructive actions clearly
- Provide overflow on narrow widths

Don’t:

- Mix many button styles at once
- Reorder actions across pages
- Rely only on color to signal grouping

Responsive:

- Collapse secondary or low‑priority actions into overflow
- Keep the primary action visible as long as space allows

Semantics & Naming:

- Add `role="toolbar"` when grouping interactive controls
- Provide an accessible label (e.g. `aria-label="Table actions"`)

## Accessibility

- Tab: Moves focus into and out of toolbar controls
- Enter / Space: Activates focused button
- Icon‑only buttons must have `aria-label`
- Maintain required contrast for text and icons
- Return focus to the trigger after closing overflow menus

## Implementation in Figma

To be added soon

## Code Example

For implementation details and usage examples, please refer to our Storybook documentation.

## Support / Next Steps

Need a variant or found a gap? Reach out or open an issue. We improve components together to keep them consistent, accessible, and reliable.

---

Last reviewed: 2025-09-15
