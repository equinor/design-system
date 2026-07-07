# Tokens Studio Pipeline

This is the canonical playbook for working with the **Tokens Studio platform** and its `studio` CLI in this repository. Harness-specific entry points (`/tokens-studio` in Claude Code, the `tokens-studio` prompt in Copilot, the `tokens-studio` agent in OpenCode) reference this file rather than restating it.

Tokens Studio (the platform at `tokens.studio`) is the successor to the Tokens Studio Figma plugin: a collaborative web platform for managing design tokens with Git-like branching, immutable releases, and a CLI for pulling tokens into codebases. EDS is adopting it as the source for a new token pipeline, replacing the legacy Figma-REST-API sync over time.

## Relationship to the legacy pipeline

The current production pipeline — bidirectional Figma REST sync (`packages/eds-tokens-sync`) plus Style Dictionary generation and build (`packages/eds-tokens-build` → `packages/eds-tokens`) — is documented in [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../how-to/TOKEN_SYSTEM_GUIDE.md); read that guide for its details rather than restating them here. The Tokens Studio pipeline replaces the **sync source** (Figma REST → Studio platform). The generation/build stages are being reworked separately. Do not assume the legacy sync scripts, file-key configuration, or JSON layout apply to Studio-pulled tokens — they are different systems that coexist during the migration.

## Platform concepts

- **Organization → Project → Branch/Release.** An organization (e.g. "Equinor Design System") contains projects; each project has a permanent `main` branch (the approved source of truth) plus short-lived work branches.
- **Branching** is Git-like and event-sourced: branches isolate token changes, go through branch reviews, and merge back to `main`. Everything token-related is branch-aware (tokens, token sets, theme groups, variable collections).
- **Releases** are immutable snapshots of a branch's resolved tokens, named with semantic versions. Releases trigger webhooks/CI integrations. Pinning a pipeline to a release (rather than a branch head) gives reproducible builds.
- **Token format** follows the W3C DTCG (Design Token Community Group) interchange format; the platform can also emit raw token-set JSON and CSS variables.

## CLI setup in this repo

The CLI is `@tokens-studio/studio-cli` (binary name `studio`), installed as a **devDependency of `packages/eds-tokens`** — never a runtime dependency, and never installed with `npm` (this is a pnpm workspace; `npm install` fails on `workspace:` protocol deps).

- Run it from `packages/eds-tokens` via `pnpm exec studio <command>` (the binary is not on the global PATH). Package scripts get `node_modules/.bin` automatically, so `package.json` scripts can call `studio` directly.
- The package downloads its binary in a postinstall script. pnpm 10 blocks build scripts by default, so the package must be listed under `onlyBuiltDependencies` in the repo-root `pnpm-workspace.yaml`. If the binary is missing ("Studio CLI binary not found"), check that list, then `pnpm rebuild @tokens-studio/studio-cli`.

## Authentication

- **Interactive (local dev):** `studio auth login` — device flow (browser + QR code). Credentials are stored in the OS keychain (macOS Keychain / Linux Secret Service / Windows Credential Manager; 1Password CLI if detected). This is interactive — the user runs it themselves, not the agent. `studio auth status` shows login state and token expiry; `studio auth logout` revokes and removes credentials.
- **CI:** service account tokens (long-lived, project-scoped, read and/or write, created under Integrations → Service Account Tokens in the platform) via the `STUDIO_SERVICE_TOKEN` environment variable or `--service-token-file <path>`. The `--ci` flag forces CI auth and disables interactive prompts. OIDC is auto-detected in GitHub Actions, GitLab CI, Bitbucket Pipelines, and Azure Pipelines — prefer OIDC over long-lived tokens where possible. Treat service tokens as secrets per `AGENTS.md` § Secrets & Credentials.
- Other environment variables: `STUDIO_API_URL` (API override), `STUDIO_PROXY`, `STUDIO_CA_BUNDLE`.

## Configuration (`.studio.json`)

`studio config init` creates `.studio.json`; `studio config add <alias>` adds a token source (interactively, or with `--project <uuid> --branch <name> --format <fmt> --output <dir>`). The file maps aliases to sources:

```json
{
  "sources": {
    "my-tokens": {
      "project": "proj_abc123",
      "branch": "main",
      "output": "src/tokens/my-tokens"
    }
  }
}
```

- Sources can reference a `branch`, a `release`, or a `tag` — pin to a release for reproducible builds.
- Pull formats are `raw` (default), `dtcg`, and `css`. **There is no TypeScript pull format** — pull raw/DTCG JSON and generate TS locally, as the existing Style Dictionary build does for `build/ts/*`.
- `studio config show` displays the config; `studio config remove <alias>` (alias `rm`) removes a source from `.studio.json`. It does **not** delete already-pulled token files — clean those up manually.
- `.studio.json` is meant to be committed for team consistency.

## Command overview

| Command                                           | What it does                                                                                                                                                                                                                                                          |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `studio info`                                     | CLI version, configuration, and auth status                                                                                                                                                                                                                           |
| `studio tokens pull [alias]`                      | Download token-set `.json` files plus `$themes.json` and `$metadata.json` to the source's output dir. No alias = pull all sources. Flags: `--dry-run`, `--force`, `--partial` (changed files only), `--file` (one file), `--locked` (exact lockfile versions), `--ci` |
| `studio tokens watch [alias]`                     | WebSocket watch — auto-pulls when tokens change remotely                                                                                                                                                                                                              |
| `studio exports list / show / templates / schema` | Inspect saved export configurations, preset templates, and the JSON schema per format (`--format css` etc.)                                                                                                                                                           |
| `studio exports preview <name-or-id>`             | Render an export without saving anything (`--out` to write files, omit for a summary; `--config-file` to override)                                                                                                                                                    |
| `studio exports create`                           | Create a saved export configuration — `--format` and `--name` required; `--template`, `--config-file` optional                                                                                                                                                        |
| `studio exports update <name-or-id>`              | Modify a saved configuration: `--name` (rename), `--template`, `--config-file` (replaces the config wholesale), `--clear-config`. The format cannot be changed — create a new configuration instead                                                                   |
| `studio exports duplicate <name-or-id>`           | Clone a configuration; its only flag is `--new-name` (defaults to `<source> (copy)`)                                                                                                                                                                                  |
| `studio exports run <name-or-id> --out <dir>`     | Run a saved export configuration and write the output                                                                                                                                                                                                                 |
| `studio exports delete <name-or-id>`              | Delete a saved export configuration (`--force` skips the confirmation prompt) — **destructive, remote**                                                                                                                                                               |

Export formats on the platform: CSS Variables, DTCG JSON, Raw JSON, and Figma Variables. Aliases: `studio pull` = `tokens pull`, `studio login`/`logout` = `auth login`/`logout`, `studio init` = `config init`. Global flags everywhere: `--json`, `--verbose`, `--host`.

## Safety rubric

Classify every command before running it:

- **Safe, run freely:** any `--help`, `studio info`, `auth status`, `config show`, `exports list/show/templates/schema`, `exports preview` (without `--out`), `tokens pull --dry-run`.
- **Edits or overwrites local files (fine in a clean git tree, mention it):** `tokens pull` without `--dry-run`, `exports run`/`exports preview --out`, `config init/add/remove` (edit `.studio.json` only).
- **Mutates remote state or credentials — always ask the user first:** `exports create/update/duplicate/delete`, `auth logout` (revokes and deletes stored credentials), and any push-like or write-scoped command that appears in future CLI versions. Remember the shortcut aliases (`studio logout` = `auth logout`) count too. When in doubt, treat a command as remote-mutating until `--help` proves otherwise.

## Staying current

The CLI and platform are young and move fast (v0.1.x as of the snapshot below). **Never answer Tokens Studio questions from memory alone.** In order of authority:

1. **The installed CLI is ground truth for commands.** Run `pnpm exec studio <command> --help` from `packages/eds-tokens` before asserting flags or behaviour. Help output is safe to run at any depth.
2. **The current docs site** is `https://documentation-v2.tokens.studio/` — fetch the relevant page when a question goes beyond the CLI surface. Key pages: `/cli/overview.html`, `/cli/authentication.html`, `/cli/configuration.html`, `/cli/pulling-tokens.html`, `/branching/how-branching-works.html`, `/releases/creating-a-release.html`, `/tokens/exporting-tokens.html`, `/integrations/service-account-tokens.html`, `/integrations/ci-cd-triggers.html`.
   ⚠️ `https://documentation.tokens.studio/` is the **legacy** docs site (old `tokensstudio` CLI, `.tokensstudio.json` config) — do not mix the two.
3. **Version check:** `npm view @tokens-studio/studio-cli dist-tags` shows `latest` and `rc`. Compare against the installed version (`studio --version`). If the installed version is newer than the snapshot below, regenerate the snapshot from `--help` output.

## Snapshot (July 2026, studio-cli 0.1.7)

Regenerate this section when the installed CLI version changes — run `studio --help` and the subcommand helps, and update the command table above if anything moved.

```
studio
├── auth        login | logout | status
├── config      init | add | remove | show
├── tokens      pull | watch          (alias: t; shortcut: studio pull)
├── exports     list | show | create | update | delete | duplicate
│               templates | schema | preview | run
├── info
├── completion
├── init / login / logout / pull      (shortcuts)
└── flags       --host --json --no-color --verbose
```

Known state in this repo at snapshot time: CLI installed as a devDependency of `packages/eds-tokens` and approved in `onlyBuiltDependencies`; no `.studio.json` committed yet.
