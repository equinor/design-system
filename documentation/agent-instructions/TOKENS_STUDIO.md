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

`studio config init` creates `.studio.json`; `studio config add <alias>` adds a token source (interactively, or with `--project <uuid> --branch <name> --format <fmt> --output <dir>`). The file maps aliases to sources under a `configurations` key:

```json
{
  "$schema": "https://tokens.studio/schema/cli",
  "configurations": {
    "my-tokens": {
      "project": "4952a007-699a-4124-a043-124e80cc28d6",
      "ref": {
        "type": "branch",
        "name": "main"
      },
      "output": "src/tokens/my-tokens",
      "format": "raw"
    }
  }
}
```

- The `ref` can reference a `branch`, a `release`, or a `tag` — pin to a release for reproducible builds.
- Pull formats are `raw` (default), `dtcg`, and `css`. **There is no TypeScript pull or export format** — TS modules are generated locally by `packages/eds-tokens/scripts/generate-ts-tokens.mjs` (see § The release pipeline below).
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

Export formats on the platform: `css`, `scss`, `dtcg`, `figma`, `swift`, `android`, `compose`. Aliases: `studio pull` = `tokens pull`, `studio login`/`logout` = `auth login`/`logout`, `studio init` = `config init`. Global flags everywhere: `--json`, `--verbose`, `--host`.

### Export gotchas (hard-won, July 2026)

- **Only the CSS export evaluates the platform's colour formulas** (`set_chroma(set_lightness(...))`) into concrete values. The DTCG export keeps raw `{alias}` references and unevaluated formulas — it is a structural interchange format, NOT "resolved tokens". Plan any downstream generation accordingly.
- **Reference export configurations by ID, not name, in anything automated.** A rename in the Studio UI silently breaks name-based `studio exports run` — this happened when `EDS` was renamed to `EDS-CSS` and would have failed the next release run.
- **`naming.prefix` (css config) must not include a trailing separator.** The schema example says `'ds-'`, but the CLI appends the casing separator itself: `eds-` produces `--eds--token` (double dash); use `eds`.
- **The `dtcg` format is config-less** — `exports schema --format dtcg` returns 404 and there are no templates. Create it with just `--format dtcg --name <name>`; it inherits the project's dimension/theme-group setup.

## Safety rubric

Classify every command before running it:

- **Safe, run freely:** any `--help`, `studio info`, `auth status`, `config show`, `exports list/show/templates/schema`, `exports preview` (without `--out`), `tokens pull --dry-run`.
- **Edits or overwrites local files (fine in a clean git tree, mention it):** `tokens pull` without `--dry-run`, `exports run`/`exports preview --out`, `config init/add/remove` (edit `.studio.json` only).
- **Mutates remote state or credentials — always ask the user first:** `exports create/update/duplicate/delete`, `auth logout` (revokes and deletes stored credentials), and any push-like or write-scoped command that appears in future CLI versions. Remember the shortcut aliases (`studio logout` = `auth logout`) count too. When in doubt, treat a command as remote-mutating until `--help` proves otherwise.

## The release pipeline

`.github/workflows/tokens_studio_release.yaml` runs on every Tokens Studio release and opens/updates an automated PR (branch `tokens-studio-release`) with the full token state:

1. **Trigger:** the outbound **CI Trigger** in Studio (Integrations → CI Triggers, `eds-tokens-release`) sends a `repository_dispatch` event (type `tokens-release`) to this repo on `release.created`. It can be fired manually with its **Test** button.
2. **Auth:** the workflow authenticates back to Studio via GitHub OIDC against the inbound **CI Integration** (Integrations → CI Integration (Inbound); subject pattern `repo:equinor/design-system:ref:refs/heads/main`, read-only). The outbound trigger and the inbound integration are **separate configs** — a 403 `No matching CI integration found` from `studio ... --ci` means the _inbound_ integration is missing or misconfigured, no matter how healthy the trigger looks.
3. **Steps:** `studio tokens pull` (raw token sets → `src/tokens/<alias>/`), `studio exports run` for the two saved configurations — `EDS-CSS` (css) and `EDS-DTCG` (dtcg), referenced by ID — into `src/tokens/css/` and `src/tokens/dtcg/`, then `pnpm run generate:ts-tokens` which combines DTCG structure with evaluated CSS values into TS modules in `src/tokens/ts/` (see the script header in `packages/eds-tokens/scripts/generate-ts-tokens.mjs` for the mechanics, including CSS Color 4 gamut mapping).
4. **Output:** all three directories are committed to the release PR. They are **generated — never edit them by hand**, and they are not yet wired into the package `exports` map.

## Backup & recovery

The platform has **no undo, rollback or restore** — only a read-only version history of releases — and plugin changes push to Studio in real time. `.github/workflows/tokens_studio_backup.yaml` is the safety net for everything between releases: every hour (cron `23 * * * *`, plus manual `workflow_dispatch`) it runs `studio tokens pull` for all sources in `.studio.json` and commits changes to the orphan branch **`tokens-studio-backup`** (one directory per source alias — never merge this branch). Runs that find no changes make no commit. Auth is the same inbound CI Integration as the release pipeline — no extra setup. Failures alert via the Slack step; an hourly backup that fails silently is no safety net.

Unlike the release workflow, the backup does **not** install the pnpm workspace — it installs the CLI standalone with `npm install --prefix` outside the workspace (version resolved from the package's `devDependencies` range) and caches the install. This is the one sanctioned exception to "never install the CLI with npm": npm only fails on `workspace:` protocol deps _inside_ the workspace, and a full workspace install every hour just to obtain one binary is not worth the time.

**Recovery is manual — the CLI has no push command (only `pull`/`watch`):**

1. On the `tokens-studio-backup` branch, find the last good state: `git log --stat -- <alias>/`, then `git diff` between commits to locate when the bad change landed (hourly granularity).
2. Extract the affected token-set JSON from that commit: `git show <commit>:<alias>/<set>.json`.
3. Re-import the JSON into Tokens Studio (plugin / file upload), coordinated with the designers — never restore over in-progress work without agreeing on the target state first.
4. If the mistake also made it into a Studio release, the `tokens-studio-release` PR history holds the same data at release granularity.

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

Known state in this repo at snapshot time: CLI installed as a devDependency of `packages/eds-tokens` and approved in `onlyBuiltDependencies`. `.studio.json` lives in `packages/eds-tokens` (single source alias `eds`, project `4952a007-699a-4124-a043-124e80cc28d6`, branch `main`, format raw, output `src/tokens/raw`). Two saved export configurations on the project: `EDS-CSS` (css, id `39d37416-632b-4f04-b49b-cfaec63e3baa`, prefix `eds`, split layout, density base comfortable) and `EDS-DTCG` (dtcg, id `019463d4-9bef-4e37-9425-6de80eec87c8`). CI auth is OIDC (`id-token: write` + `--ci`) — no service token stored. Two workflows use it: `tokens_studio_release.yaml` (release-triggered, § The release pipeline) and `tokens_studio_backup.yaml` (hourly cron, § Backup & recovery).
