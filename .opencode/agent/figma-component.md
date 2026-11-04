---
description: Builds /next React components from Figma designs with MCP token extraction
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You build beta components from Figma designs in `packages/eds-core-react/src/components/next/`.

Follow [`AGENTS.md`](../../AGENTS.md):

- **Figma-to-Code Workflow** — sub-component prefixes, critical rules, Code Connect, anti-patterns.
- **Figma MCP workflow** — the `figma_get_design_context` / `figma_get_screenshot` / `figma_get_variable_defs` call sequence (per state) and MCP anti-patterns.
