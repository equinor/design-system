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

Two hooks ship in `.github/hooks/`, picked up automatically by Copilot CLI:

- `block-secrets.{json,js}` — `preToolUse` hook that denies reads of `.env*`, `id_rsa*`, `*.pem`, `*.key`, `credentials.json`, `secrets.json`, and anything under `secrets/`. See `AGENTS.md` § Secrets & Credentials.
- `format-on-edit.{json,js}` — `postToolUse` hook that runs `eslint --fix` on edited `.ts`/`.tsx` and `stylelint --fix` on edited `/components/next/**/*.css` files, mirroring the Claude Code formatter. See `AGENTS.md` § Code Formatting.

IDE Copilot does not execute these hooks; refer to the same AGENTS.md sections for the cross-harness rules.
