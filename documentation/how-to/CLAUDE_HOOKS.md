# Claude Code Hooks

Hooks are shell commands that run in response to Claude Code events. They can block actions, validate inputs, or add context. Hooks are configured in `.claude/settings.json` and scripts live in `.claude/hooks/`.

## How Hooks Work

1. Claude triggers an event (e.g., about to read a file)
2. Matching hooks receive event data as JSON on **stdin**
3. The hook runs and returns an **exit code**:

| Exit Code | Meaning            | Effect                                        |
| --------- | ------------------ | --------------------------------------------- |
| `0`       | Success            | Action proceeds normally                      |
| `2`       | Block              | Action is prevented, stderr shown to Claude   |
| Other     | Non-blocking error | Action proceeds, stderr shown in verbose mode |

## Current Hooks (in this repo)

| Hook             | Event         | Matcher                                             | Purpose                                        |
| ---------------- | ------------- | --------------------------------------------------- | ---------------------------------------------- |
| `read_hook.js`   | `PreToolUse`  | `Read\|Grep\|Glob\|Bash\|Edit\|Write\|NotebookEdit` | Blocks access to `.env` and other secret files |
| `format_hook.js` | `PostToolUse` | `Edit\|Write`                                       | Runs ESLint+Prettier auto-fix on edited files  |

## Configuration

Hooks are defined in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Grep|Glob|Bash",
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

- **Event** (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, etc.) — when the hook fires
- **Matcher** — regex to filter by tool name (e.g., `Bash`, `Read|Write`, `mcp__.*`)
- **`$CLAUDE_PROJECT_DIR`** — environment variable pointing to the project root, use this for reliable paths

## Available Hook Events

| Event                | Fires when                 | Can block?      |
| -------------------- | -------------------------- | --------------- |
| `PreToolUse`         | Before a tool executes     | Yes             |
| `PostToolUse`        | After a tool succeeds      | No              |
| `PostToolUseFailure` | After a tool fails         | No              |
| `UserPromptSubmit`   | User sends a prompt        | Yes             |
| `Stop`               | Claude finishes responding | Yes (continues) |
| `SessionStart`       | Session begins             | No              |
| `SessionEnd`         | Session ends               | No              |
| `Notification`       | Notification is sent       | No              |
| `PreCompact`         | Before context compaction  | No              |

## Creating a Custom Hook

1. Create a script in `.claude/hooks/` (JS, Bash, Python, etc.)
2. Read JSON from stdin to get event data
3. Return the appropriate exit code

### Example: Block writing to protected paths

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

## Hook Input Format

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

## Tips

- Use `"$CLAUDE_PROJECT_DIR"` (quoted) in commands to handle paths with spaces
- Test hooks by asking Claude to perform the action you want to block
- Use `/hooks` in Claude Code to manage hooks interactively
- Use `.claude/settings.local.json` for personal hooks that shouldn't be shared with the team
- Use `~/.claude/settings.json` for global hooks that apply across all projects
