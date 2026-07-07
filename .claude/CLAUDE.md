# Claude Code — Equinor Design System

> **The canonical conventions for this repository live in [`AGENTS.md`](../AGENTS.md).**
> Read that file for component structure, code style, CSS patterns, testing, accessibility, and conventional commits.
>
> This file holds only Claude-Code-specific configuration that doesn't belong in `AGENTS.md`.

@../AGENTS.md

## Path-Scoped Rules

Claude Code automatically loads rules in `.claude/rules/` when working on matching files:

| Rule                 | Scope                                                           | Purpose                                         |
| -------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| `eds-component.md`   | `packages/eds-core-react/src/components/next/**/*.{tsx,ts,css}` | EDS 2.0 component conventions (short reference) |
| `figma-component.md` | `packages/eds-core-react/src/components/next/**/*.figma.tsx`    | Figma-to-code workflow with MCP tools           |
| `advisor.md`         | General                                                         | Read-only code review guidelines                |

The path-scoped rules are intentionally short — they reference [`AGENTS.md`](../AGENTS.md) rather than duplicating it.

## Slash Commands

User-invokable prompts triggered with `/command-name`.

| Command                 | Usage                                 | Description                                              |
| ----------------------- | ------------------------------------- | -------------------------------------------------------- |
| `/new-component`        | `/new-component Button`               | Scaffold a new EDS 2.0 component with all required files |
| `/create-component-doc` | `/create-component-doc <raw content>` | Restructure raw content into component documentation     |
| `/tokens-studio`        | `/tokens-studio <task>`               | Tokens Studio platform / studio CLI pipeline assistant   |

## Hooks

Configured in `.claude/settings.json`. Scripts live in `.claude/hooks/`.

| Hook             | Event         | Matcher                                             | Purpose                                        |
| ---------------- | ------------- | --------------------------------------------------- | ---------------------------------------------- |
| `read_hook.js`   | `PreToolUse`  | `Read\|Grep\|Glob\|Bash\|Edit\|Write\|NotebookEdit` | Blocks access to `.env` and other secret files |
| `format_hook.js` | `PostToolUse` | `Edit\|Write`                                       | Runs ESLint+Prettier auto-fix on edited files  |

See [`.claude/README.md`](./README.md) for hook authoring details.

## Settings

- `.claude/settings.json` — shared, checked into the repo (permission denies, hooks)
- `.claude/settings.local.json` — personal, gitignored (per-developer overrides)

## Git Workflow

See the **Git Workflow** section in [`AGENTS.md`](../AGENTS.md) — the rules apply to Claude Code as well.
