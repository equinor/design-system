# Adopt the Tokens Studio platform as the source and pipeline for design tokens

- **Status:** Accepted
- **Date:** 2026-07-20
- **Decision makers:** Frida Erdal, EDS Core Team

## Context

The production token pipeline is a bidirectional Figma REST sync (`packages/eds-tokens-sync`) plus a local Style Dictionary build (`packages/eds-tokens-build` → `packages/eds-tokens`). It is custom code against undocumented Figma internals, and the designers are reworking the token architecture in the **Tokens Studio platform** (`tokens.studio`), whose colour formulas (`set_chroma(set_lightness(...))`) the legacy toolchain cannot evaluate at all.

A decision was needed on how tokens flow from the design tool into this repository for the reworked token system: which system is the source of truth, what triggers an update, how CI authenticates, and what lands in the repo.

Two platform properties shaped the design:

- **Releases are immutable, semver-named snapshots** that can fire CI triggers — a natural, reproducible pipeline anchor.
- **The platform has no undo, rollback or restore** — only a read-only version history of releases — and plugin changes push to Studio in real time, so a designer mistake propagates immediately and everything between releases is unprotected.

## Decision Drivers

- Retire the custom Figma-REST sync and its maintenance burden
- Token updates must be reproducible and reviewable, not ad-hoc syncs
- No long-lived secrets in CI
- The platform is the only thing that can evaluate its own colour formulas — outputs must come from its exports (see [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md))
- Recoverability: designer mistakes must be recoverable at finer granularity than releases
- The legacy pipeline must keep owning the published artifacts until the rework graduates (coexistence, not big-bang)

## Options Considered

### Option 1: Keep the Figma REST sync, pointed at the reworked Figma variables

Continue with `eds-tokens-sync` + Style Dictionary against the new token architecture.

**Pros:**

- No new platform dependency; familiar tooling

**Cons:**

- The reworked architecture is authored in Tokens Studio; Figma variables are a downstream projection of it
- Style Dictionary cannot evaluate the platform's colour formulas
- Keeps the custom sync code alive indefinitely

### Option 2: Manual exports from Tokens Studio committed by hand

Designers or developers export from the Studio UI and open PRs.

**Pros:**

- No CI integration to build or authenticate

**Cons:**

- Manual, error-prone, and unversioned between exports
- No guarantee the committed state matches a platform release
- Scales with people instead of automation

### Option 3: Release-triggered CI pipeline against the platform (chosen)

Tokens Studio's outbound CI trigger fires a GitHub workflow on every release; the workflow pulls and exports via the `studio` CLI and opens a PR.

**Pros:**

- Every update is anchored to an immutable release and lands as a reviewable PR
- OIDC auth — no stored service tokens
- Platform exports are the single evaluation of formulas (ADR-0008 builds on this)

**Cons:**

- Depends on a young platform and CLI (v0.1.x) that move fast
- `repository_dispatch` only triggers workflows on the default branch

## Decision

**Adopt the Tokens Studio platform as the source of truth for the reworked tokens, with a release-triggered, OIDC-authenticated CI pipeline that lands platform output as PRs** — and an hourly git backup to cover the platform's lack of undo.

The release pipeline (`.github/workflows/tokens_studio_release.yaml`):

1. **Trigger:** the outbound CI Trigger in Studio sends a `repository_dispatch` event (type `tokens-release`) on `release.created`.
2. **Auth:** the workflow authenticates back to Studio with **GitHub OIDC** against the inbound CI Integration (subject pattern `repo:equinor/design-system:ref:refs/heads/main`, read-only). No service tokens are stored; the outbound trigger and the inbound integration are deliberately separate configs.
3. **Steps:** `studio tokens pull` (raw token sets), `studio exports run` for the saved CSS and DTCG configurations — **referenced by ID, not name**, so UI renames cannot break the run — and the local TS codegen (ADR-0008).
4. **Output:** generated `src/tokens/{raw,css,dtcg,ts}` committed to an automated PR. Generated output is never edited by hand and is not yet wired into the package `exports` map — the legacy Style Dictionary build keeps owning the published artifacts until graduation.

**Backup (`tokens_studio_backup.yaml`):** because the platform has no undo and plugin edits push in real time, an hourly cron pulls all configured sources and commits changes to the **orphan branch `tokens-studio-backup`** — one directory per source alias, no commit when nothing changed, Slack alert on failure. The branch is never merged; it exists purely as an hourly-granularity recovery history. Recovery is manual (the CLI has no push command): locate the last good state on the branch, extract the token-set JSON, and re-import it in Tokens Studio in coordination with the designers. The backup installs the CLI standalone with `npm --prefix` outside the pnpm workspace instead of installing the whole monorepo — the one sanctioned exception to "never install the CLI with npm" — cutting warm runs from ~2 min to ~20–30 s.

### Consequences

- Good, because token updates are reproducible (anchored to immutable releases) and reviewed (they land as PRs, not direct commits)
- Good, because CI holds no long-lived secrets — OIDC subjects are validated by the platform
- Good, because designer mistakes are recoverable at hourly granularity via the orphan branch, not just at release granularity
- Good, because aliases and output paths live in `.studio.json`, so both workflows are rename-proof without workflow edits
- Bad, because the pipeline depends on a fast-moving v0.1.x platform/CLI — saved export configurations, formats, and flags can change under us (mitigated by the "staying current" rules in `TOKENS_STUDIO.md`)
- Bad, because `repository_dispatch` only fires on the default branch, so pipeline changes cannot be end-to-end tested before merge
- Bad, because PRs created with the built-in `GITHUB_TOKEN` get no CI runs (same limitation as the legacy Figma sync; a GitHub App token is a possible upgrade)
- Bad, because recovery from backup is a manual re-import — the CLI is pull-only — and removed source aliases must be cleaned up on the backup branch by hand

### Confirmation

Every Tokens Studio release must produce a green `tokens_studio_release.yaml` run and an updated `tokens-studio-release` PR; the hourly backup alerts to Slack on failure. Both workflows read their sources from `.studio.json`, which is committed and reviewed.

## Related

- [ADR-0008](./0008-generate-ts-tokens-from-studio-exports.md) — TS codegen on top of this pipeline's exports
- [ADR-0007](./0007-token-variable-architecture-spacing-typography.md) — the token variable architecture being authored in Tokens Studio
- [`documentation/agent-instructions/TOKENS_STUDIO.md`](../agent-instructions/TOKENS_STUDIO.md) — operational playbook (pipeline, backup & recovery, CLI)
- [`documentation/how-to/TOKEN_SYSTEM_GUIDE.md`](../how-to/TOKEN_SYSTEM_GUIDE.md) — the legacy pipeline this replaces
- Issues [#5108](https://github.com/equinor/design-system/issues/5108) (pipeline), [#5154](https://github.com/equinor/design-system/issues/5154) (backup)
- PRs [#5151](https://github.com/equinor/design-system/pull/5151), [#5153](https://github.com/equinor/design-system/pull/5153), [#5155](https://github.com/equinor/design-system/pull/5155), [#5160](https://github.com/equinor/design-system/pull/5160), [#5166](https://github.com/equinor/design-system/pull/5166), [#5175](https://github.com/equinor/design-system/pull/5175), [#5176](https://github.com/equinor/design-system/pull/5176)
