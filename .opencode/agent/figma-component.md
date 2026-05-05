---
description: Builds EDS 2.0 React components from Figma designs with MCP token extraction
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You build EDS 2.0 components from Figma designs in `packages/eds-core-react/src/components/next/`.

- For the universal Figma-to-code conventions (sub-component prefixes, critical rules, Code Connect, anti-patterns), follow [`AGENTS.md`](../../AGENTS.md) — **Figma-to-Code Workflow** section.
- For the MCP token-extraction workflow (`figma_get_design_context` / `figma_get_screenshot` / `figma_get_variable_defs` per state), follow [`.claude/rules/figma-component.md`](../../.claude/rules/figma-component.md).
