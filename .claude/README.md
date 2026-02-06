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
├── settings.json       # Project settings (hooks, permissions)
├── commands/           # Slash commands
│   └── new-component.md    # /new-component <Name>
├── hooks/              # Custom hook scripts
│   └── read_hook.js        # Blocks reading of .env files
└── rules/
    ├── eds-component.md    # EDS 2.0 component conventions
    ├── figma-component.md  # Figma-to-code workflow
    └── advisor.md          # Code review guidelines
```

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

## Hooks

Hooks are shell commands that run in response to Claude Code events. They can block actions, validate inputs, or add context. Hooks are configured in `settings.json` and scripts live in `.claude/hooks/`.

### How Hooks Work

1. Claude triggers an event (e.g., about to read a file)
2. Matching hooks receive event data as JSON on **stdin**
3. The hook runs and returns an **exit code**:

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| `0` | Success | Action proceeds normally |
| `2` | Block | Action is prevented, stderr shown to Claude |
| Other | Non-blocking error | Action proceeds, stderr shown in verbose mode |

### Current Hooks

| Hook | Event | Matcher | Purpose |
|------|-------|---------|---------|
| `read_hook.js` | `PreToolUse` | `Read\|Grep` | Blocks reading `.env` files to protect secrets |

### Configuration

Hooks are defined in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Grep",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/read_hook.js"
          }
        ]
      }
    ]
  }
}
```

- **Event** (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, etc.) - when the hook fires
- **Matcher** - regex to filter by tool name (e.g., `Bash`, `Read|Write`, `mcp__.*`)
- **`$CLAUDE_PROJECT_DIR`** - environment variable pointing to the project root, use this for reliable paths

### Available Hook Events

| Event | Fires when | Can block? |
|-------|-----------|------------|
| `PreToolUse` | Before a tool executes | Yes |
| `PostToolUse` | After a tool succeeds | No |
| `PostToolUseFailure` | After a tool fails | No |
| `UserPromptSubmit` | User sends a prompt | Yes |
| `Stop` | Claude finishes responding | Yes (continues) |
| `SessionStart` | Session begins | No |
| `SessionEnd` | Session ends | No |
| `Notification` | Notification is sent | No |
| `PreCompact` | Before context compaction | No |

### Creating a Custom Hook

1. Create a script in `.claude/hooks/` (JS, Bash, Python, etc.)
2. Read JSON from stdin to get event data
3. Return the appropriate exit code

#### Example: Block writing to protected paths

```javascript
// .claude/hooks/protect_paths.js
async function main() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  const { tool_input } = JSON.parse(Buffer.concat(chunks).toString())
  const filePath = tool_input?.file_path || ''

  const protectedPaths = ['.env', 'package-lock.json', '.github/workflows']
  if (protectedPaths.some((p) => filePath.includes(p))) {
    console.error(`Blocked: ${filePath} is a protected path`)
    process.exit(2)
  }
}

main()
```

Then add it to `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect_paths.js"
          }
        ]
      }
    ]
  }
}
```

### Hook Input Format

Hooks receive JSON on stdin with these common fields:

```json
{
  "session_id": "abc123",
  "hook_event_name": "PreToolUse",
  "tool_name": "Read",
  "tool_input": {
    "file_path": "/path/to/file"
  }
}
```

The `tool_input` shape depends on the tool being called (e.g., `file_path` for Read, `command` for Bash).

### Tips

- Use `"$CLAUDE_PROJECT_DIR"` (quoted) in commands to handle paths with spaces
- Test hooks by asking Claude to perform the action you want to block
- Use `/hooks` in Claude Code to manage hooks interactively
- Use `.claude/settings.local.json` for personal hooks that shouldn't be shared with the team
- Use `~/.claude/settings.json` for global hooks that apply across all projects

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
