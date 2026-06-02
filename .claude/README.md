# Claude Code Configuration — Equinor Design System

Claude Code reads this directory automatically. The shared EDS conventions live in [`AGENTS.md`](../AGENTS.md); this directory holds Claude-Code-specific configuration.

## Directory Structure

```
.claude/
├── README.md           # This file
├── CLAUDE.md           # Claude-specific entry point (points to AGENTS.md)
├── settings.json       # Shared settings (permission denies, hooks)
├── settings.local.json # Personal settings (gitignored)
├── commands/           # Slash commands (/new-component, /create-component-doc)
├── hooks/              # Hook scripts (read_hook.js, format_hook.js)
└── rules/              # Path-scoped rules
```

## Instruction Pipeline

```
~/.claude/CLAUDE.md      → personal global preferences (optional, not in repo)
        ↓
AGENTS.md                → canonical EDS conventions (project root)
        ↓
.claude/CLAUDE.md        → Claude-specific config + pointer to AGENTS.md
        ↓
.claude/rules/*.md       → path-scoped rules (loaded automatically)
```

## Path-Scoped Rules

Rules are loaded automatically based on YAML frontmatter `paths`:

| Rule | Scope | Description |
|------|-------|-------------|
| `eds-component.md` | `/next/**/*.{tsx,ts,css}` | EDS 2.0 component conventions (short reference) |
| `figma-component.md` | `/next/**/*.figma.tsx` | Figma-to-code workflow with MCP tools |
| `advisor.md` | General | Read-only code review and architecture guidance |

The path-scoped rules are intentionally short and reference [`AGENTS.md`](../AGENTS.md) for shared conventions.

## Slash Commands

Commands are user-invokable prompts triggered with `/command-name`.

| Command | Usage | Description |
|---------|-------|-------------|
| `/new-component` | `/new-component Button` | Scaffold a new EDS 2.0 component with all files |
| `/create-component-doc` | `/create-component-doc <raw content>` | Restructure raw content into component documentation |

## Hooks

Hooks are shell commands that run in response to Claude Code events.

| Hook | Event | Purpose |
|------|-------|---------|
| `read_hook.js` | `PreToolUse` | Blocks access to `.env` and other secret files |
| `format_hook.js` | `PostToolUse` | Runs ESLint+Prettier auto-fix on edited files |

For hook authoring, configuration, and the full event reference, see [`documentation/how-to/CLAUDE_HOOKS.md`](../documentation/how-to/CLAUDE_HOOKS.md).

## Settings

- `.claude/settings.json` — shared, checked into the repo (permission denies, hooks)
- `.claude/settings.local.json` — personal, gitignored (per-developer overrides)

## MCP Integration

The Figma workflow expects these MCP tools if available:

| MCP Tool | Purpose |
|----------|---------|
| `figma_get_design_context` | Analyze component structure and layers |
| `figma_get_screenshot` | Get visual reference of the design |
| `figma_get_variable_defs` | Extract design tokens for each component state |

MCP servers are configured in personal Claude Code settings, not in this repository.

## Best Practices

- Put repository-wide conventions in [`AGENTS.md`](../AGENTS.md), not here
- Keep path-scoped rules short — they should reference `AGENTS.md` for shared content
- Use `.claude/settings.local.json` for personal hooks that shouldn't be shared
