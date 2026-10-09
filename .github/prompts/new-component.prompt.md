---
mode: agent
description: Scaffold a new EDS component for web or mobile, with all required files
---

# Create New EDS Component

Scaffold a new EDS component named `${input:componentName}`. The platform is `${input:platform:web or mobile}`. If it is empty, ask which one: web or mobile.

> **Canonical references:** web components follow [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md) (foundation data-attributes, file templates, common mistakes, anti-patterns checklist). Mobile components follow [`BUILDING_EDS_MOBILE_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_MOBILE_COMPONENTS.md). Project-wide conventions live in [`AGENTS.md`](../../AGENTS.md). Read the doc for the chosen platform before writing any file.

This prompt holds the flow the two platforms share. The patterns and code templates live in the canonical docs, so read them there rather than inferring from memory.

## Workflow

1. **Choose the platform**, or ask: web (`packages/eds-core-react/src/components/next/`) or mobile (`packages/eds-mobile-components/src/components/`).

2. **Ask for a Figma URL** for the component design. The design is shared by both platforms. If provided, run the Figma MCP tools per [`AGENTS.md`](../../AGENTS.md) § Figma MCP workflow:
   - `figma_get_design_context` — component structure
   - `figma_get_screenshot` — visual reference
   - `figma_get_variable_defs` — tokens **per state** (Default, Hover, Focus, Disabled, and any other state in the design). Use the EXACT variable names returned.

3. **Check what already exists.**
   - Web: [`documentation/AI-COMPONENT-INDEX.md`](../../documentation/AI-COMPONENT-INDEX.md) lists every existing `/next` component with its props and sub-components (generated, CI-verified). Confirm the component doesn't already exist, and prefer composing `Field`, `Icon`, `Input`, `Button`, `Typography` over reinventing. The source of truth is `packages/eds-core-react/src/components/next/index.ts`.
   - Mobile: [`documentation/MOBILE_COMPONENT_SCOPE.md`](../../documentation/MOBILE_COMPONENT_SCOPE.md) lists the components mobile excludes or renames. Then look in `packages/eds-mobile-components/src/components/` and build from what is there. Read the web component's API too, and mirror it where it makes sense for React Native.

4. **If an old component exists** (on web at `packages/eds-core-react/src/components/${input:componentName}/`, on mobile as a folder that `tsconfig.json` still excludes), read it for behavioural awareness (keyboard nav, focus management) only, and rebuild from the Figma design instead of editing it. Use modern patterns: web `:focus-visible`, CSS tokens and simple state, mobile tokens through `EDSStyleSheet`.

5. **Create the component folder** using the file templates in the canonical doc for the platform:
   - Web: `index.ts`, `${input:componentName}.tsx`, `${input:componentName}.types.ts`, `<lowercase>.css`, `${input:componentName}.figma.tsx` (only if a Figma URL was provided), `${input:componentName}.test.tsx`, `${input:componentName}.stories.tsx`, `${input:componentName}.docs.md`. Use the lowercase form for the CSS filename and class root (`eds-avatar`, not `eds-Avatar`).
   - Mobile: `index.ts`, `${input:componentName}.tsx`, `${input:componentName}.types.ts`, `${input:componentName}.test.tsx`, `${input:componentName}.stories.tsx`, `${input:componentName}.docs.md`.

6. **Wire into the package.**
   - Web, per [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md#wiring-into-the-package): export from `next/index.ts`, and `@import` the CSS in `next/index.css`.
   - Mobile, per [`BUILDING_EDS_MOBILE_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_MOBILE_COMPONENTS.md#wiring): export from `src/index.ts`, add a demo screen in `apps/mobile-storybook`, and add its `componentRegistry` entry. If the component was excluded as unmigrated, remove it from the exclusion lists in `tsconfig.json`, `eslint.config.js` and `jest.config.cjs`.

7. **Write the docs** per [`STORYBOOK_DOC_STYLE.md`](../../documentation/agent-instructions/STORYBOOK_DOC_STYLE.md): the stories file and `${input:componentName}.docs.md` on each platform, then run `pnpm run generate:component-docs ${input:componentName}`. Never write the beta callout or import snippet in the stories file. The Summary is written once, in the web file, and shown above both tabs. The generator builds a mobile page only for a component that also has a web sidecar. If there is none yet, or the component has no web counterpart, skip the generator and list the missing docs under TODOs in the status report (mobile-only support is tracked in #5626).

8. **Emit an Implementation Status Report** per [`BUILDING_EDS_2_COMPONENTS.md`](../../documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md#implementation-status-report) — a short `## Implementation notes` section summarising what came from Figma, what was inherited, what was assumed, what was skipped, and any TODOs.

## Easy-to-miss reminders

These are the patterns most often forgotten. The full rationale is in the canonical docs.

**If web:**

- `data-color-appearance` goes on the **smallest element** that uses that colour, not the root.
- Elements with `data-color-appearance` must set a `color` (or `background-color`) using a dynamic token.
- For disabled icons that were accent when enabled: change `data-color-appearance` to `neutral` and use `--eds-color-text-disabled`. Never use `opacity` for disabled.
- `data-space-proportions` is calculated from Figma padding (horizontal vs vertical), not copied from a similar component.
- `data-baseline="center"` enables text-box-trim so component height matches Figma.
- Use EXACT `--eds-*` tokens from `figma_get_variable_defs` — never hardcode hex or pixel values.
- Never put `data-font-family` on a flex container — it sets `display: block` and breaks layout.

**If mobile:**

- Style through `EDSStyleSheet.create` and `useStyles` with tokens, and never hardcode colours or sizes.
- Merge the caller's `style` after the component's own, and never replace it.
- A press is the Figma hover state. Use `Pressable`, not `PressableHighlight`.
- Keep touch targets at least 44 by 44 points.
- Every exported component needs a demo screen and a registry entry, or CI fails.
