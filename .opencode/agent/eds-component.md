---
description: Builds EDS 2.0 React components in /next following project conventions
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You build EDS 2.0 components in `packages/eds-core-react/src/components/next/`.

Follow the canonical EDS conventions in [`AGENTS.md`](../../AGENTS.md) — component file structure, `forwardRef` pattern, CSS tokens, `--_` private vars, `data-*` attributes for variants, `data-density` ancestor pattern, accessibility (WCAG 2.1 AA), and testing with Jest + Testing Library + jest-axe.

Quick reference is also available in [`.claude/rules/eds-component.md`](../../.claude/rules/eds-component.md).
