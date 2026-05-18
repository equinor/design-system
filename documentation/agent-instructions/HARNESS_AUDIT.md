# AI Harness Consistency Audit

A re-sync workflow that detects drift between AI agent configurations across the harnesses this repo supports. Run it whenever you suspect the harness configs have diverged, after big consolidation work, or before cutting a release.

Harness entry points — `/audit-harnesses` in Claude Code, the `audit-harnesses` prompt in Copilot, the `audit-harnesses` agent in OpenCode — all read this playbook rather than restating its content.

This is a **read-only** workflow. The agent must not edit, create, or delete files. The only deliverable is a single markdown report.

## Scope

**In scope** — these are the only harnesses the team currently supports. Audit them, and only them:

- **Claude Code** — `.claude/CLAUDE.md`, `.claude/rules/*.md`, `.claude/commands/*.md`, `.claude/hooks/`, `.claude/settings.json`
- **GitHub Copilot** (both CLI and IDE)
  - Copilot in general: `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.github/prompts/**/*.prompt.md`
  - Copilot CLI specifically: `.github/hooks/*.{json,js}`
- **OpenCode** — `.opencode/agent/*.md`, `.opencode/README.md`

**Out of scope** — do not audit configs for Cursor, Cline, Aider, Continue, Windsurf, Zed, Gemini CLI, Codex, or any other harness. If a stray `.cursorrules` / `.clinerules` / `.windsurfrules` / `GEMINI.md` etc. exists, note it under *Open questions* ("found a config for an out-of-scope harness — confirm intent or delete") — do not write findings against it.

**Cross-harness surfaces** (canonical, shared by all three in-scope harnesses):

- `AGENTS.md` — the canonical conventions file
- `documentation/agent-instructions/*.md` — canonical playbooks that harness commands defer to
- `documentation/how-to/TOKEN_SYSTEM_GUIDE.md`, `documentation/how-to/CLAUDE_HOOKS.md`, `documentation/how-to/FIGMA_MCP_INTEGRATION.md` — referenced cross-harness for token system, hooks, and Figma flows

## The canonical-docs pattern

The repo is set up so durable agent knowledge lives once and harness configs are thin pointers:

```
documentation/agent-instructions/<TOPIC>.md   ← single source of truth
        ▲          ▲          ▲
        │          │          │
.claude/    .github/      .opencode/        ← thin entry points,
commands/   prompts/      agent/              each ~20-50 lines,
<topic>.md  <topic>.md    <topic>.md          referencing the canonical
```

A correct harness entry point is a thin wrapper that:

1. States its purpose (one paragraph)
2. Links to its canonical doc in `documentation/agent-instructions/`
3. Lists the workflow steps with cross-references to the canonical doc's sections
4. Optionally repeats the most-forgotten reminders (acceptable redundancy)

A drifted entry point is one that:

- Inlines content that already lives in the canonical doc (Duplicate finding)
- Contradicts the canonical doc (Divergent finding)
- References paths/symbols/sections that no longer exist (Stale finding)
- Carries content found nowhere else, so the other harnesses don't get it (Parity gap finding)

## Audit Steps

### Step 1 — Inventory

List every file in scope (see § Scope) with one-line descriptions. Include `git log -1 --format='%h %ai'` for each. Files with significantly older timestamps than peers are suspicious — flag under § Freshness.

### Step 2 — Verify canonical source

Confirm `AGENTS.md` still declares itself canonical (look for an explicit statement like "this is the canonical conventions file"). Confirm each harness primary instruction file (`.claude/CLAUDE.md`, `.github/copilot-instructions.md`, the three OpenCode agents' opening sections) defers to `AGENTS.md` rather than restating content. Any harness file that doesn't defer is a finding.

### Step 3 — Content drift

For every harness-specific instruction file, classify each section/paragraph as one of:

1. **Canonical-reference** — defers to a canonical doc without restating its content. ✓
2. **Harness-specific** — legitimately about that tool's own features (hook syntax, slash-command invocation, MCP wiring, permission frontmatter, model selection). ✓
3. **Duplicate** — restates content already in `AGENTS.md` or `documentation/agent-instructions/`. Finding.
4. **Divergent** — contradicts the canonical source. Finding.
5. **Stale** — references paths, commands, files, or conventions that no longer exist. Finding.

For each finding, quote offending lines with `path:line` references.

### Step 4 — Capability parity

A developer must not lose access to a workflow by switching harnesses. Build a matrix:

| Capability (intent)          | Claude Code            | Copilot                                  | OpenCode             |
| ---------------------------- | ---------------------- | ---------------------------------------- | -------------------- |
| Scaffold new EDS 2.0 component | `/new-component`     | `new-component` prompt                   | `eds-component` agent |
| Accessibility audit          | `/accessibility-audit` | `accessibility-audit` prompt             | `accessibility-audit` agent |
| Structure component doc      | `/create-component-doc`| `structure_components_prompt`            | `component-doc` agent |
| Verify component doc         | (covered by the same)  | `verify_components_prompt`               | (covered by the same) |
| Re-sync harnesses (this audit) | `/audit-harnesses`   | `audit-harnesses` prompt                 | `audit-harnesses` agent |
| Read-only advisor            | `.claude/rules/advisor.md` (general scope) | (none) | `advisor` primary agent |

Rows are *intent*, not exact filenames. If the team adds a new workflow, the row should appear in all three harnesses (or be intentionally one-harness with the reason documented). Any gap is a finding.

### Step 5 — Path-scoped rule consistency

Check that path-scoped rules covering the same intent in different harnesses target the **same glob/path set**.

| Intent           | Claude Code (`.claude/rules/`)            | Copilot (`.github/instructions/`) |
| ---------------- | ----------------------------------------- | --------------------------------- |
| EDS 2.0 component code | `eds-component.md` paths frontmatter | `react.instructions.md` + `ts.instructions.md` + `styling.instructions.md` `applyTo` |
| Figma Code Connect files | `figma-component.md` paths           | `figma.instructions.md` `applyTo` |
| Global / markdown / TS | (none)                                 | `global-coding`, `markdown`, `ts` `applyTo` |

Mismatched globs are findings. Each rule's documented scope should also still hit real files (`find` returns results).

OpenCode has no native path-scoping mechanism — that's expected, not a finding.

### Step 6 — Safety and security parity

These controls must not vary by harness:

- **Secret-file blocking.** `.claude/settings.json` `permissions.deny` and `.claude/hooks/read_hook.js` enforce in Claude Code; `.github/hooks/block-secrets.{json,js}` enforces in Copilot CLI; `AGENTS.md` § Secrets & Credentials documents the rule for IDE Copilot and OpenCode. If any of these is missing, **Critical** finding.
- **Auto-format on edit.** `.claude/hooks/format_hook.js` and `.github/hooks/format-on-edit.{json,js}` should run equivalent eslint/stylelint --fix. `AGENTS.md` § Code Formatting documents the matrix. **Medium** if missing.
- **Git workflow rules** (no AI attribution in commits, conventional commits, branch protection). These live in `AGENTS.md` § Git Workflow + § Conventional Commits; every harness file should defer to those sections, not redefine. Divergent restatements are findings.

### Step 7 — MCP server parity

If multiple harnesses configure MCP servers (e.g. `.vscode/mcp.json` for Copilot in VS Code, personal settings for Claude / OpenCode), check that the same servers are wired with equivalent tool allow-lists. Note any harness pinning a specific model (e.g. `model: 'Claude Sonnet 4'` in a Copilot prompt's frontmatter). Stale or inconsistent pins are findings.

### Step 8 — Freshness

Check `git log -n 5 --oneline -- <file>` for each harness instruction file. Files with very stale last-touched dates while peers were recently updated are suspicious. Cross-check that recent renames in the codebase haven't left dangling references in any harness config.

## Report Format

Produce a single markdown file. Use this exact structure so reports from different harnesses are diffable.

````markdown
# AI Harness Consistency Audit — <branch name>

_Generated by:_ <harness name and version>
_Date:_ YYYY-MM-DD
_Canonical source:_ <path or "none declared">

## Executive summary

<3–5 bullet points: state of the world, top risks, recommended next action.>

## Inventory

| File | Harness | Purpose | Last modified |
| ---- | ------- | ------- | ------------- |

## Findings

### F-001 — <short title>

- **Severity:** Critical | High | Medium | Low | Info
- **Category:** Drift | Duplicate | Divergent | Stale | Parity gap | Safety gap | Freshness
- **Affected files:** `path:line`, `path:line`
- **Evidence:**
  ```
  <quoted lines>
  ```
- **Why it matters:** <one sentence>
- **Recommended fix:** <concrete edit, e.g. "delete lines 12–18 of X; replace with link to AGENTS.md §Component File Structure">

## Capability parity matrix

<from Step 4>

## Path-scoped rule comparison

<from Step 5>

## Open questions

<things the auditor could not determine without human input>
````

## Severity Rubric

- **Critical** — security/safety control missing in one harness (e.g. secret-file read not blocked).
- **High** — harnesses give materially different instructions for the same task; divergent rules; broken references that will cause an agent to fail.
- **Medium** — duplicated content that will rot; missing parity for a workflow developers actually use.
- **Low** — cosmetic drift, formatting differences, minor stale references.
- **Info** — observations worth noting but not actionable.

## Constraints

- **Read-only.** Do not edit, create, or delete files. Do not run formatters, linters, or tests. Do not commit anything.
- **Cite, don't paraphrase.** Every finding must have a `path:line` reference and a short quote.
- **No speculation.** If you are unsure whether something is a real divergence (e.g. you can't tell whether a harness surface is in use), put it in *Open questions*, not *Findings*.
- **Stay in scope.** Only audit Claude Code, GitHub Copilot, and OpenCode. Other harness configs go to *Open questions*.
- **Single output file.** Print the report to chat (or write to the path the user specifies). Do not scatter notes across multiple files.
