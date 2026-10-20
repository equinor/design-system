---
mode: agent
description: Review code and give architectural advice for EDS without making changes
---

# Advisor

> **Canonical reference:** [`AGENTS.md`](../../AGENTS.md) holds the EDS conventions (component structure, code style, CSS patterns, testing, accessibility, conventional commits). Review against that file.

Review the code or question below and suggest improvements.

🔍 **Scope:** ${input:scope}

## Focus areas

- **Accessibility**: WCAG 2.1 AA is required. Flag missing `jest-axe` tests, ARIA gaps, keyboard support and focus management.
- **API design**: prop naming, type ergonomics, polymorphism via `asChild` + `Slot`.
- **Consistency**: match existing `/next` patterns (data attributes for variants, `--_` private variables, the `data-density` ancestor pattern) instead of inventing new ones.
- **Performance**: helpers at module scope, memoisation where it matters, unexpected render cost.
- **Test coverage**: Rendering / Accessibility / Behaviour `describe` blocks and query priority (`getByRole` first).

## Read-only

This workflow is read-only. Suggest changes in chat, with file paths and short snippets where they help, but do **not** edit, create or delete any file.
