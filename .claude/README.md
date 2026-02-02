# Claude Code Configuration - Equinor Design System

This directory contains Claude Code configuration for the EDS repository.

## Global Configuration

The `CLAUDE.md` file provides **global instructions** that Claude Code loads automatically at startup. It contains repository-wide conventions for building EDS components.

## Instruction Pipeline

Claude Code receives instructions from multiple sources, applied in this order:

```
┌─────────────────────────────────────┐
│       Claude Code Base Model        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   ~/.claude/CLAUDE.md (optional)    │  ← Personal global preferences
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        .claude/CLAUDE.md            │  ← Repository conventions
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       .claude/rules/*.md            │  ← Path-specific instructions
└─────────────────────────────────────┘
```

1. **Base model** - Claude's built-in capabilities
2. **Personal preferences** - `~/.claude/CLAUDE.md` (not in repo)
3. **Project instructions** - `.claude/CLAUDE.md` for all team members
4. **Path-scoped rules** - `.claude/rules/*.md` applied by file pattern

## Directory Structure

```
.claude/
├── README.md           # This file
├── CLAUDE.md           # Main project instructions
├── settings.json       # Shared team permissions
├── commands/           # Slash commands
│   └── new-component.md    # /new-component <Name>
└── rules/
    ├── eds-component.md    # EDS 2.0 component conventions
    ├── figma-component.md  # Figma-to-code workflow
    └── advisor.md          # Code review guidelines
```

## Settings

`settings.json` contains shared team permissions for Claude Code. This pre-approves common tools so team members don't need to manually approve each one.

**Included permissions:**
- MCP tools: Figma, Chrome DevTools
- Test commands: `pnpm test`, `npm test`, `jest`
- Git operations: `add`, `commit`, `fetch`, `checkout`, `pull`
- GitHub CLI: `gh pr view`, `gh pr checks`, `gh pr list`

**Personal overrides:** Create `settings.local.json` (gitignored) to add your own permissions without affecting the team.

## Commands

Commands are user-invokable prompts triggered with `/command-name`. They support `$ARGUMENTS` for user input.

| Command | Usage | Description |
|---------|-------|-------------|
| `/new-component` | `/new-component Button` | Scaffold a new EDS 2.0 component with all files |

## Rules

Rules are specialized instructions that can be scoped to specific file patterns using YAML frontmatter.

### Path-Scoped Rules

Rules with `paths` frontmatter are automatically loaded when working on matching files:

```markdown
---
paths:
  - "packages/eds-core-react/src/components/next/**/*.tsx"
  - "packages/eds-core-react/src/components/next/**/*.ts"
---

# EDS Component Guidelines

Instructions here apply when editing files in /next...
```

### General Rules

Rules without `paths` frontmatter provide general guidance that Claude can reference when relevant.

## Available Rules

| Rule | Scope | Description |
|------|-------|-------------|
| `eds-component.md` | `/next/**/*.tsx,ts,css` | EDS 2.0 component building conventions |
| `figma-component.md` | `**/*.figma.tsx` | Figma-to-code workflow with MCP tools |
| `advisor.md` | General | Code review and architecture guidelines |

## Using Claude Code

### View Loaded Instructions

Run `/memory` to see which instruction files are currently loaded.

### Planning Mode

Claude Code has a planning mode for complex tasks. When enabled:

- Analyzes the task before making changes
- Creates a structured implementation plan
- Useful for multi-file changes or new features
- Helps ensure all requirements are considered upfront

### MCP Integration

Some workflows use [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers. The Figma workflow expects these MCP tools if available:

| MCP Tool | Purpose |
|----------|---------|
| `figma_get_design_context` | Analyze component structure and layers |
| `figma_get_screenshot` | Get visual reference of the design |
| `figma_get_variable_defs` | Extract design tokens for each component state |

MCP servers are configured in Claude Code settings, not in this repository.

## Comparison with OpenCode

This repository also contains OpenCode configuration in `.opencode/`. Here's how the systems compare:

| Feature | OpenCode | Claude Code |
|---------|----------|-------------|
| Main instructions | `AGENTS.md` | `.claude/CLAUDE.md` |
| Specialized rules | `.opencode/agent/*.md` | `.claude/rules/*.md` |
| Agent selection | `Tab` to switch agents | Single agent with path-scoped rules |
| Sub-agent invocation | `@agent-name` in chat | Not supported |
| Tool permissions | Per-agent YAML config | Global settings or hooks |
| Planning mode | `Ctrl+L` toggle | Automatic or via `/plan` |

### Key Differences

1. **No agent switching** - Claude Code uses one agent with contextual rules instead of switchable agents
2. **Path-scoping** - Rules are applied based on file patterns, not explicit invocation
3. **No tool restrictions per rule** - All tools available; use hooks for command restrictions
4. **Simpler configuration** - Markdown files without complex YAML frontmatter

## Creating New Rules

1. Create a new `.md` file in `.claude/rules/`
2. Optionally add `paths` frontmatter to scope to specific files
3. Write instructions in markdown
4. Reference shared conventions from `CLAUDE.md` instead of duplicating

### Example: Test Runner Rule

```markdown
---
paths:
  - "packages/eds-core-react/**/*.test.tsx"
---

# Test Guidelines

When writing or modifying tests for EDS components:

- Use Jest + Testing Library + jest-axe
- Organize with describe blocks: Rendering, Accessibility, Behavior
- Query priority: getByRole > getByLabelText > getByText > getByTestId

## Commands

```bash
pnpm run test:core-react              # Run all tests
pnpm test -- --testPathPattern="Name" # Run specific test
```
```

## Relationship to Other Instruction Files

| File | Purpose | Scope |
|------|---------|-------|
| `AGENTS.md` | General AI agent guidance | All AI tools (Copilot, OpenCode, Claude) |
| `.github/copilot-instructions.md` | GitHub Copilot hub | GitHub Copilot |
| `.github/instructions/*.md` | File-pattern specific rules | GitHub Copilot (by `applyTo` pattern) |
| `.claude/CLAUDE.md` | Claude Code project instructions | Claude Code |
| `.claude/rules/*.md` | Claude Code path-scoped rules | Claude Code |

## Best Practices

1. **Keep rules focused** - Each rule should have a clear, single purpose
2. **Use path-scoping** - Apply rules only where relevant to reduce noise
3. **Reference shared docs** - Point to `CLAUDE.md` for common conventions instead of duplicating
4. **Prefer CLAUDE.md for globals** - Put repository-wide conventions in the main file
5. **Document MCP dependencies** - Note which MCP tools a workflow expects
