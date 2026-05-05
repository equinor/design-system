---
paths:
  - 'packages/eds-core-react/src/components/next/**/*.figma.tsx'
---

# Figma-to-Code Component Guidelines (Claude Code)

> See [`AGENTS.md`](../../AGENTS.md) — **Figma-to-Code Workflow** section — for the universal conventions (sub-component prefixes, critical rules, Code Connect example, anti-patterns).
>
> This file adds the Claude-Code-specific MCP workflow that Copilot does not have access to.

## MCP Workflow

When the Figma MCP server is available:

1. **Analyze structure**: Call `figma_get_design_context` with the Figma URL to understand the component layers
2. **See the design**: Call `figma_get_screenshot` for visual reference
3. **Extract tokens for EACH state**: Call `figma_get_variable_defs` for:
   - Default
   - Hover
   - Focus
   - Disabled
   - Error (and any other states visible in the design)

**Do not skip step 3 per state.** A single `figma_get_variable_defs` call on the default state will miss state-specific tokens (especially `data-color-appearance` on disabled icons).

## Anti-patterns (MCP-specific)

- Calling `figma_get_design_context` alone without `figma_get_variable_defs` for each state
- Reusing tokens extracted for a different state
- Generating Code Connect from intuition instead of from the actual MCP response
