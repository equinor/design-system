# OpenCode Agents - Equinor Design System

This directory contains custom AI agent configurations for OpenCode in the EDS repository.

## Global Configuration

The root `AGENTS.md` file provides **global instructions** for all AI coding tools (OpenCode, Claude Code, Cursor, GitHub Copilot). It contains repository-wide conventions that apply regardless of which agent or tool is used.

The `.opencode/` directory contains **OpenCode-specific** agent definitions that build on top of the global instructions.

## Planning Mode

OpenCode has a **planning mode** that can be toggled with `Ctrl+L` (or `Cmd+L` on Mac). When enabled:

- The agent analyzes the task before making changes
- Creates a structured plan with steps
- Useful for complex, multi-file changes
- Helps ensure all requirements are considered upfront

Use planning mode for larger features or refactors. Skip it for quick fixes or simple changes.

## Instruction Pipeline

OpenCode agents receive instructions from multiple sources, applied in this order:

```
┌─────────────────────────────────────┐
│         OpenCode Base Model         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│            AGENTS.md                │  ← Repository conventions
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│     .opencode/agent/<name>.md       │  ← Agent-specific behavior
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   .github/instructions/*.md         │  ← File-pattern instructions
└─────────────────────────────────────┘
```

1. **Global instructions** - Built into OpenCode (base capabilities)
2. **AGENTS.md** - Repository-level guidance for all AI tools
3. **Agent-specific instructions** - `.opencode/agent/*.md` files define agent behavior
4. **GitHub instructions** - `.github/instructions/*.md` applied by file pattern (e.g., `*.tsx` files get React instructions)

## Agent Types

### Primary Agents

Primary agents are selectable by the user and run as the main conversation agent.

| Agent | Description | Tools |
|-------|-------------|-------|
| `build` | Development agent with EDS conventions | All (asks for git commit/push/branch) |
| `advisor` | Read-only architectural advice and code reviews | Read-only (no write/edit/bash) |

### Sub-Agents

Sub-agents are invoked by primary agents to perform specialized tasks. They cannot be selected directly, but must be mentioned in chat.

| Agent | Description | Tools |
|-------|-------------|-------|
| `eds-component` | Builds EDS 2.0 React components following conventions | write, edit, bash |
| `figma-component` | Builds components from Figma designs with MCP token extraction | write, edit, bash |

## Agent Configuration

Each agent is defined in a markdown file in `.opencode/agent/` with YAML frontmatter:

```markdown
---
description: Short description shown in agent picker
mode: primary | subagent
tools:
  write: true | false
  edit: true | false
  bash: true | false
permission:
  bash:
    '*': 'allow' | 'ask' | 'deny'
    'git commit*': 'ask'
---

Agent-specific instructions go here...
```

### Frontmatter Options

| Field | Description |
|-------|-------------|
| `description` | Shown in the agent picker UI |
| `mode` | `primary` (user-selectable) or `subagent` (invoked programmatically) |
| `tools` | Enable/disable tool access (write, edit, bash) |
| `permission.bash` | Fine-grained bash command permissions with glob patterns |

### Permission Patterns

Control which bash commands require user approval:

```yaml
permission:
  bash:
    '*': 'allow'           # Allow all commands by default
    'git commit*': 'ask'   # Ask before committing
    'git push*': 'ask'     # Ask before pushing
    'git checkout -b*': 'ask'  # Ask before creating branches
    'rm -rf*': 'deny'      # Never allow destructive commands
```

## Using Agents

### Selecting a Primary Agent

Press `Tab` to cycle through available primary agents. The current agent is shown in the input area.

### Invoking Sub-Agents

Sub-agents are specialized agents that handle specific tasks. Mention them with `@` to invoke:

```
@figma-component build the Button component from this Figma link
```

```
@eds-component create a new Tooltip component
```

When a sub-agent is invoked:
1. It receives the task with its specialized instructions
2. Executes with its configured tools
3. Returns results back to the conversation

## MCP Integration

Some agents use [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers to access external tools. The `figma-component` agent uses Figma MCP tools:

| MCP Tool | Purpose |
|----------|---------|
| `figma_get_design_context` | Analyze component structure and layers |
| `figma_get_screenshot` | Get visual reference of the design |
| `figma_get_variable_defs` | Extract design tokens for each component state |

### MCP Workflow Example

```
1. figma_get_design_context → Understand component structure
2. figma_get_screenshot → Visual reference
3. figma_get_variable_defs (Default state) → Base tokens
4. figma_get_variable_defs (Hover state) → Hover tokens
5. figma_get_variable_defs (Focus state) → Focus tokens
6. figma_get_variable_defs (Disabled state) → Disabled tokens
```

MCP servers are configured globally in OpenCode settings, not in this repository.

## Creating New Agents

1. Create a new file in `.opencode/agent/` with a `.md` extension
2. Add YAML frontmatter with required fields
3. Write agent-specific instructions in markdown
4. Reference `AGENTS.md` for shared conventions

### Example: Test Runner Agent

```markdown
---
description: Writes and runs tests for EDS components
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You write tests for EDS components in `packages/eds-core-react/src/components/next/`.

## Test Structure

- Use Jest + Testing Library + jest-axe
- Organize with describe blocks: Rendering, Accessibility, Behavior
- Query priority: getByRole > getByLabelText > getByText > getByTestId

## Commands

\`\`\`bash
pnpm run test:core-react              # Run all tests
pnpm test -- --testPathPattern="Name" # Run specific test
\`\`\`

Refer to AGENTS.md for full conventions.
```

## Relationship to Other Instruction Files

| File | Purpose | Scope |
|------|---------|-------|
| `AGENTS.md` | General AI agent guidance | All AI tools (Copilot, OpenCode, Claude) |
| `.github/copilot-instructions.md` | GitHub Copilot hub | GitHub Copilot |
| `.github/instructions/*.md` | File-pattern specific rules | GitHub Copilot (by `applyTo` pattern) |
| `.opencode/agent/*.md` | OpenCode agent definitions | OpenCode only |

## Directory Structure

```
.opencode/
├── README.md           # This file
├── agent/
│   ├── build.md        # Primary: Development agent
│   ├── advisor.md      # Primary: Read-only advisor
│   ├── eds-component.md    # Sub-agent: Component builder
│   └── figma-component.md  # Sub-agent: Figma-to-code
```

## Best Practices

1. **Keep agents focused** - Each agent should have a clear, single responsibility
2. **Use sub-agents for specialization** - Complex workflows delegate to specialized sub-agents
3. **Reference shared docs** - Point to `AGENTS.md` for common conventions instead of duplicating
4. **Minimize permissions** - Only enable tools the agent actually needs
5. **Be specific about MCP tools** - Document which MCP tools an agent expects to use
