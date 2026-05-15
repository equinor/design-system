# GitHub Copilot — Equinor Design System

> **The canonical conventions for this repository live in [`AGENTS.md`](../AGENTS.md).**
> Read that file first for the shared conventions (component structure, code style, CSS patterns, testing, accessibility, conventional commits).

## Packages

- **`@equinor/eds-core-react`** — Main React component library (most development happens here)
- **`@equinor/eds-tokens`** — Design tokens, CSS variables, and theming
- **`@equinor/eds-icons`** — Icon library
- **`@equinor/eds-lab-react`** — Experimental/WIP components
- **`@equinor/eds-data-grid-react`** — Data grid component

## Path-Scoped Instructions

Copilot automatically applies file-pattern instructions from `.github/instructions/` based on each file's `applyTo` frontmatter. These add details on top of `AGENTS.md` for specific contexts:

- [Global standards](./instructions/global-coding.instructions.md) — Lint/format commands, naming reference
- [TypeScript](./instructions/ts.instructions.md) — Type patterns and Testing Library priorities
- [React](./instructions/react.instructions.md) — File organisation, `forwardRef` pattern, accessibility
- [Styling](./instructions/styling.instructions.md) — CSS conventions, `--_` private vars, `data-density`
- [Figma](./instructions/figma.instructions.md) — Design-to-code workflow
- [Markdown](./instructions/markdown.instructions.md) — Documentation format

For color systems: see `packages/eds-tokens/instructions/colors.md`.

## Hooks (Copilot CLI)

`.github/hooks/block-secrets.{json,js}` registers a `preToolUse` hook that denies tool calls reading `.env*`, `id_rsa*`, `*.pem`, `*.key`, `credentials.json`, `secrets.json`, or anything under `secrets/`. The hook runs automatically for everyone using the Copilot CLI in this repo. IDE Copilot does not execute the hook — see `AGENTS.md` § Secrets & Credentials for the cross-harness rule.
