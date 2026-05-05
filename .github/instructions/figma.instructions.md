---
applyTo: '**'
---

# Figma Component Creation

> The canonical Figma-to-code workflow lives in [`AGENTS.md`](../../AGENTS.md) — sub-component prefixes (`⌘` / `.` / `↳`), critical rules (exact variable names, no hex values, all states), and the Code Connect `figma.nestedProps()` example.

This file is intentionally short — it lists only the Copilot-facing checklist.

## Checklist

- [ ] Figma design specifications documented
- [ ] Component implements only what's designed
- [ ] All states (default, hover, focus, disabled, error) verified against Figma
- [ ] Storybook story includes all design variations
- [ ] Tests cover interaction and edge cases
- [ ] CSS follows component conventions (eds-prefixed root class, nesting, data attributes)
