---
paths:
  - 'packages/eds-tokens/**'
  - 'packages/eds-core-react/src/components/next/**/*.css'
---

# Colour contrast (path-scoped delta)

> The rules live in [`AGENTS.md`](../../AGENTS.md) § Accessibility → Colour contrast. This file brings them up when you edit tokens or component CSS.

- **Two levels.** WCAG 2.1 AA is the minimum: 4.5:1 for text, 3:1 for icons and other non-text. The APCA targets are Lc 90 for body text and Lc 60 for secondary text and interactive elements, against `background.surface`. Give the ratio and the Lc, in both colour schemes and every state.
- **Check each foreground on the background it is made for.** `text.on-<level>.<tone>` and `icon.on-<level>.<tone>` go on the fill of the same level and tone; `primary`, `secondary` and `tertiary` are measured against `background.surface` only. `text.primary` on a selected fill is checked per state before use.
- **Tertiary is below the minimum in light** by design. Use it only where WCAG does not require contrast, such as disabled controls.
- **A ghost control's resting fill is the canvas colour.** `background.interactive.neutral.muted.default` resolves to `background.canvas` in both schemes, and WCAG 1.4.11 does not ask for 3:1 on it. Do not swap `muted` for `emphasis` to raise it.
- **A text field's border is below 3:1 by design.** `border.interactive.neutral.muted.*`, and `danger` in the error state, does not identify the field: its label, description, placeholder or an icon inside it does, and an error icon marks the error state. Do not swap it for `emphasis`. Flag a field that shows none of these.
- **Measure the generated tokens** with `pnpm --filter @equinor/eds-tokens run check:contrast`. It fails below the minimum and only reports pairs below their APCA target. It also checks the categorical data visualisation colours where components use them, and reports the chart goals.
