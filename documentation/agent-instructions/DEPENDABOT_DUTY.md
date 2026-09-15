# Dependabot Duty

This is the canonical playbook for the weekly Dependabot rotation. Harness entry points (`/dependabot-duty` in Claude Code, the `dependabot-duty` prompt in Copilot, the `dependabot-duty` agent in OpenCode) all reference this guide rather than restating it.

The short human runbook lives in [`documentation/how-to/DEPENDABOT_GUIDE.md`](../how-to/DEPENDABOT_GUIDE.md). This document is the long version: what an agent should check, in which order, and what it must **not** do on its own.

Dependabot duty has two halves, and both are part of the job:

1. **Open Dependabot PRs** — review, merge, or close.
2. **Dependabot alerts** on the repo's Security tab — vulnerabilities that did not get a PR, usually transitive dependencies that need a `pnpm.overrides` entry.

Historically only the first half got done. The alerts page is where the critical and high findings accumulate.

## Prerequisites

- `gh` CLI authenticated against `github.com`. Check with `gh auth status`.
- The token needs the `security_events` scope to read alerts. If the alerts call below returns `403` or an empty list while the Security tab shows alerts, run `gh auth refresh -s security_events` (the user does this — it is interactive).
- A local checkout with `node_modules` installed, for the override workflow in § Step 3.

Copilot in the IDE cannot run `gh`; there the agent walks the user through the checks and the user reads the Security tab manually.

## Boundaries

This is a **report-first** workflow. The agent gathers, verifies, and recommends. The user acts.

- Never `gh pr review --approve`, `gh pr merge`, `gh pr close`, or `gh pr comment` without an explicit go-ahead for that specific PR. Batch approval ("merge all the green ones") is fine once given, but state which PRs it covers.
- Never commit, push, create a branch, or open a PR without confirmation ([`AGENTS.md`](../../AGENTS.md) § Git Workflow applies).
- The only thing the agent builds is the override PR in § Step 3, on its own branch, after the user has seen the proposed override list.
- Do not run `@dependabot` commands (`rebase`, `recreate`) without asking; they trigger CI and rewrite the PR branch.

## Step 1 — Triage open PRs

List everything Dependabot has open, with CI state:

```bash
gh pr list --author app/dependabot --state open --limit 50 \
  --json number,title,createdAt,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,files
```

For each PR record: package(s), from → to version, update type (patch / minor / major, read it from the title), group (`all-dependencies`, `npm_and_yarn`, `storybook`, …), CI conclusion, files touched.

### Duplicates

Dependabot regularly opens two PRs for the same bump: a `npm_and_yarn` **security** PR from the alerts feed and a scheduled **version** PR. They are not identical:

- The security PR sometimes updates only `package.json` and not `pnpm-lock.yaml`. It then fails `setup` with `ERR_PNPM_OUTDATED_LOCKFILE`. Confirm by reading the failed job log (`gh run view --job <id> --log`), not by guessing.
- The version PR has the lockfile change and passes.

Recommend: merge the passing one, close the other with a one-line comment pointing at the merged PR. Do not try to fix the lockfile on the security PR.

Also check for PRs Dependabot has already superseded (`gh pr view <n> --json comments` shows "Superseded by #…"); those are closed automatically and need no action.

### Decision table

| Situation                                     | Recommendation                                                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| CI green, patch or minor, any group           | Approve and squash-merge                                                                                                    |
| CI green, major                               | Read the release notes for the `.0` release (see below) before recommending. Check the coverage gap in the next subsection. |
| CI red, lockfile out of date on a security PR | Close as duplicate of the passing version PR                                                                                |
| CI red, real breakage                         | Follow "When CI fails" in the runbook: flaky → rerun, easy → fix on the branch, complex → close with comment                |
| Merge conflict / `BEHIND`                     | `@dependabot rebase` (ask first) or close and let Monday's run recreate it                                                  |

Merge one PR at a time so CI runs on `main` between merges.

### Majors: release notes and coverage

For a major, fetch the breaking-changes list from the tag that started the major, not only the patch Dependabot happened to land on:

```bash
gh api repos/<owner>/<repo>/releases/tags/v<major>.0.0 --jq .body
```

Read it against **our** usage: which packages depend on it (`grep -rn '"<pkg>"' apps/*/package.json packages/*/package.json`), their config files, and whether any `@<pkg>/*` companion packages must move to the same major.

Then verify the tests that would catch a break actually ran. The root `pnpm run test` script does **not** run every package — as of September 2026, `packages/eds-tokens` and `packages/eds-tokens-build` have vitest suites that are not in the root script and therefore never run in the `Test` CI job. Check the job log:

```bash
gh pr checks <n>                         # find the Test job URL / id
gh api /repos/equinor/design-system/actions/jobs/<job-id>/logs | grep -E '^> @equinor/|Test Files'
```

If an affected package is missing from the log, run its tests locally against the PR's version before recommending a merge. Say in the report which suites CI covered and which you ran yourself.

## Step 2 — Triage alerts

Read the open alerts sorted by severity:

```bash
gh api '/repos/equinor/design-system/dependabot/alerts?state=open&per_page=100' \
  --jq '.[] | "\(.security_advisory.severity | ascii_upcase)\t\(.dependency.package.name)\t\(.dependency.manifest_path)\t\(.security_vulnerability.vulnerable_version_range)\tfix: \(.security_vulnerability.first_patched_version.identifier // "none")\t\(.security_advisory.ghsa_id)"' \
  | sort
```

Same alert often appears several times (one per manifest, one per advisory). Group by package and vulnerable range before counting.

Classify each package:

| Class                 | How to tell                                          | Action                                                                      |
| --------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------- |
| **Has a PR**          | An open Dependabot PR bumps it                       | Handled in Step 1; note the link                                            |
| **Direct dependency** | `manifest_path` is a `package.json`                  | Bump the dependency in that package; usually Dependabot already opened a PR |
| **Transitive**        | `manifest_path` is `pnpm-lock.yaml` and no PR exists | Override, see Step 3                                                        |
| **No fix**            | `first_patched_version` is `none`                    | Log it (see § Logging), no code change                                      |

Critical and high without a PR are fixed the same week. Medium and low are fixed when they ride along in the same override PR, otherwise logged.

## Step 3 — Fix transitive alerts with `pnpm.overrides`

The repo already uses `pnpm.overrides` in the root `package.json` for this (see PRs #5177, #5368, #5472). Follow the same shape.

### 3a. Establish what is actually installed

Read the lockfile on `main`, not the working branch:

```bash
git show origin/main:pnpm-lock.yaml > /tmp/main-lock.yaml
grep -oE "^  '?<pkg>@[0-9][^'(:]*" /tmp/main-lock.yaml | sort -u      # resolved versions
```

Find who pulls each vulnerable version in. In the `snapshots:` section, every entry lists its dependencies two indent levels deeper; the parents of `<pkg>@<ver>` are the entries whose block contains `<pkg>: <ver>`. Knowing the parent tells you whether the override is safe (a `^` range in the parent) or will fight a pin.

### 3b. Check the fix is real for us

```bash
npm view <pkg> versions --json | tail          # does the patched version exist for this major line?
npm view <pkg>@<fix> type engines              # ESM-only? new Node floor?
```

Do **not** override when:

- The fix jumps to a version that changes module format (`"type": "module"` where the parent is CommonJS) or raises `engines.node` above what the parent supports. Example: `decode-uri-component` 0.2 → 0.5 is ESM-only while `query-string@7` (Expo) is CJS.
- The fix crosses a 0.x "major" in a build-tool chain (`esbuild` 0.27 → 0.28 under `tsup`) for a low-severity advisory. Not worth the risk; log it.
- The alert has no patched version.

### 3c. Write the override

Edit `pnpm.overrides` in the root `package.json`:

- Raise an existing key in place rather than adding a second key for the same package.
- When several majors of a package coexist, key per major (`"js-yaml@^3"`, `"js-yaml@^4"`) so one override cannot pull a parent onto the wrong major.
- Use `>=<fix>` for a floor, or `>=<fix> <next-major` when the next major is known to break parents (`"undici": ">=8.9.0 <9"`).

### 3d. Re-resolve and verify

```bash
pnpm install --no-frozen-lockfile
git diff pnpm-lock.yaml | grep -E '^[-+]  [^ ]'      # added / removed package versions
pnpm install --frozen-lockfile                        # must pass, this is what CI runs
```

The lockfile diff must only touch the target packages and their direct resolutions. If unrelated packages moved, a range in the override is too loose; tighten it.

Re-run the resolved-versions grep from 3a against the new lockfile and put the before/after table in the report.

Local `pnpm run build:core-react` can fail in a worktree for reasons unrelated to the lockfile (duplicate `@types/react` copies). If it fails, rebuild with `main`'s lockfile in the same checkout before blaming the override; CI is the deciding test.

### 3e. Ship it

One PR, hidden commit type, no scope:

```
chore: bump pnpm overrides to resolve transitive dependabot alerts
```

PR body: a before/after table per package with severity and the parent that pulls it in, and a "deliberately left out" list with the reason for each. Commit, push, and `gh pr create` only after the user has confirmed.

## Step 4 — Report

Print the report to chat (or to the path the user gave). Shape:

```markdown
## Dependabot duty — <date>

### Open PRs

| PR  | Bump | Type | CI  | Recommendation |
| --- | ---- | ---- | --- | -------------- |

### Alerts without a PR

| Severity | Package | Installed | Fix | Pulled in by | Action |
| -------- | ------- | --------- | --- | ------------ | ------ |

### Deliberately not fixed

- <package>: <reason>

### Commands to run

gh pr review <n> --approve
gh pr merge <n> --squash
gh pr close <n> --comment "Superseded by #<m>, which includes the lockfile update."
```

Put the exact `gh` commands at the end so the person on duty can paste them. The agent does not run them without a go-ahead.

## Logging alerts that cannot be fixed

"Log it and move on" in the runbook needs a place. Comment on the open issue titled **"Dependabot alerts without a fix"** with the package, advisory id, why it cannot be fixed, and the date. If no such issue exists, ask the user before creating it. The next person on duty checks that issue before re-investigating the same alert.

## Follow-ups this playbook knows about

- `packages/eds-tokens` and `packages/eds-tokens-build` tests are not in the root `test` script (September 2026). Until that is fixed, run them locally for any vitest or vite major.
- `image-size` (high, via `metro` and `@docusaurus/mdx-loader`) has no patched version. Logged, not fixable by override.
