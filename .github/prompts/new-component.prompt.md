---
mode: agent
description: Scaffold a new EDS 2.0 component with all required files
---

# Create New EDS 2.0 Component

Scaffold a new EDS 2.0 component named `${input:componentName}` in `packages/eds-core-react/src/components/next/`.

> **Canonical reference:** [`documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md) — foundation data-attributes, critical patterns, file templates, common mistakes, advanced patterns, and the anti-patterns checklist. Project-wide conventions live in [`AGENTS.md`](../../AGENTS.md).

This prompt focuses on the per-component scaffolding flow. The patterns and code templates referenced below all live in the canonical doc above — read them there rather than inferring from memory.

## Workflow

1. **Ask for a Figma URL** for the component design. If provided, run the Figma MCP tools per [`AGENTS.md`](../../AGENTS.md) § Figma MCP workflow:
   - `figma_get_design_context` — component structure
   - `figma_get_screenshot` — visual reference
   - `figma_get_variable_defs` — tokens **per state** (Default, Hover, Focus, Disabled, and any other state in the design). Use the EXACT variable names returned.

2. **Check for existing components to reuse** in `packages/eds-core-react/src/components/next/index.ts`. Prefer composing `Field`, `Icon`, `Input`, `Button`, `Typography` over reinventing.

3. **If an old component exists** at `packages/eds-core-react/src/components/${input:componentName}/`, read it for behavioural awareness (keyboard nav, focus management) only — do not copy implementation. Use modern patterns: `:focus-visible`, CSS tokens, simple state.

4. **Create the component folder** with all required files using the templates in [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md#file-templates):

   ```
   ${input:componentName}/
     index.ts
     ${input:componentName}.tsx
     ${input:componentName}.types.ts
     <lowercase>.css
     ${input:componentName}.figma.tsx   (only if a Figma URL was provided)
     ${input:componentName}.test.tsx
     ${input:componentName}.stories.tsx
   ```

   Use the lowercase form for the CSS filename and class root (`eds-avatar`, not `eds-Avatar`).

5. **Wire into the package** per [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md#wiring-into-the-package):
   - Export from `next/index.ts`
   - `@import` the CSS in `next/index.css`

6. **Emit an Implementation Status Report** per [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md#implementation-status-report) — a short `## Implementation notes` section summarising what came from Figma, what was inherited, what was assumed, what was skipped, and any TODOs.

## Easy-to-miss reminders

These are the patterns most often forgotten — full rationale in the canonical doc:

- `data-color-appearance` goes on the **smallest element** that uses that colour, not the root.
- Elements with `data-color-appearance` must set a `color` (or `background-color`) using a dynamic token.
- For disabled icons that were accent when enabled: change `data-color-appearance` to `neutral` and use `--eds-color-text-disabled`. Never use `opacity` for disabled.
- `data-space-proportions` is calculated from Figma padding (horizontal vs vertical), not copied from a similar component.
- `data-baseline="center"` enables text-box-trim so component height matches Figma.
- Use EXACT `--eds-*` tokens from `figma_get_variable_defs` — never hardcode hex or pixel values.
- Never put `data-font-family` on a flex container — it sets `display: block` and breaks layout.
