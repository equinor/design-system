# Audit AI Harness Consistency

Run a read-only consistency audit across the AI agent configurations in this repo to detect drift between harnesses.

> **Canonical reference:** [`documentation/agent-instructions/HARNESS_AUDIT.md`](../../documentation/agent-instructions/HARNESS_AUDIT.md) — explicit scope (Claude Code, Copilot, OpenCode), the canonical-docs pattern, the eight audit steps, finding classification, severity rubric, and report format.

## Workflow

1. Read the canonical playbook above. The scope, the surfaces in play, and the report shape all live there.
2. Walk through the eight audit steps in order: Inventory → Verify canonical source → Content drift → Capability parity → Path-scoped rules → Safety/security → MCP servers → Freshness.
3. Write the report inline (one markdown file). Do **not** edit, create, or delete any other file — this is a read-only workflow.

## Output destination

If **$ARGUMENTS** contains a path, write the report there. Otherwise print it directly to chat.
