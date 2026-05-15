---
description: Builds EDS 2.0 React components in /next following project conventions
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You build EDS 2.0 components in `packages/eds-core-react/src/components/next/`.

> **Canonical reference:** [`documentation/how-to/BUILDING_EDS_2_COMPONENTS.md`](../../documentation/how-to/BUILDING_EDS_2_COMPONENTS.md) — foundation data-attributes, critical patterns, file templates, common mistakes, advanced patterns, and the anti-patterns checklist. Project-wide conventions live in [`AGENTS.md`](../../AGENTS.md).

When invoked to create a new component, follow this flow:

1. **Ask for a Figma URL.** If provided, run `figma_get_design_context`, `figma_get_screenshot`, and `figma_get_variable_defs` **per state** (Default, Hover, Focus, Disabled, etc.). Use the EXACT variable names returned.

2. **Check for existing components to reuse** in `packages/eds-core-react/src/components/next/index.ts` — prefer composing `Field`, `Icon`, `Input`, `Button`, `Typography`.

3. **If an old component exists** at `packages/eds-core-react/src/components/<name>/`, read it for behavioural awareness only — do not copy implementation. Use modern patterns (`:focus-visible`, CSS tokens, simple state).

4. **Scaffold the component folder** using the templates in [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/how-to/BUILDING_EDS_2_COMPONENTS.md#file-templates): `index.ts`, `<Name>.tsx`, `<Name>.types.ts`, `<lowercase>.css`, `<Name>.figma.tsx` (only if Figma URL), `<Name>.test.tsx`, `<Name>.stories.tsx`. CSS filename and class root must be lowercase.

5. **Wire into the package** per [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/how-to/BUILDING_EDS_2_COMPONENTS.md#wiring-into-the-package): export from `next/index.ts`, `@import` the CSS in `next/index.css`.

6. **Emit an Implementation Status Report** per [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/how-to/BUILDING_EDS_2_COMPONENTS.md#implementation-status-report).

Easy-to-miss reminders (full rationale in the canonical doc):

- `data-color-appearance` on the smallest element, not the root; elements with it must set a `color`/`background-color` using a dynamic token.
- For disabled icons: change `data-color-appearance` to `neutral` and use `--eds-color-text-disabled`. Never `opacity`.
- `data-space-proportions` is calculated from Figma padding, never copied.
- `data-baseline="center"` enables text-box-trim so height matches Figma.
- Use EXACT `--eds-*` tokens from `figma_get_variable_defs` — no hardcoded hex or px.
- `data-font-family` on a flex container sets `display: block` and breaks layout.
