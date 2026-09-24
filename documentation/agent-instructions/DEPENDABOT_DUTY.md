# Dependabot Duty

This is the canonical playbook for the weekly Dependabot rotation. Harness entry points (`/dependabot-duty` in Claude Code, the `dependabot-duty` prompt in Copilot, the `dependabot-duty` agent in OpenCode) all reference this guide rather than restating it.

The short human runbook lives in [`documentation/how-to/DEPENDABOT_GUIDE.md`](../how-to/DEPENDABOT_GUIDE.md). This document is the long version: what an agent should check, in which order, and what it must **not** do on its own.

Dependabot duty has three parts, and all three are part of the job:

1. **Open Dependabot PRs** — review, merge, or close.
2. **Dependabot alerts** on the repo's Security tab — vulnerabilities that did not get a PR, usually transitive dependencies that need a `pnpm.overrides` entry.
3. **Code scanning alerts** on the same tab — CodeQL findings in our own source, which are either fixed or dismissed with a reason.

Historically only the first part got done. The alerts pages are where the critical and high findings accumulate.

## Prerequisites

- `gh` CLI authenticated against `github.com`. Check with `gh auth status`.
- The token needs the `security_events` scope to read alerts. The same scope covers both the Dependabot alerts call in § Step 2 and the code scanning call in § Step 4. If either returns `403` or an empty list while the Security tab shows alerts, run `gh auth refresh -s security_events` (the user does this — it is interactive).
- A local checkout with `node_modules` installed, for the override workflow in § Step 3.

Where `gh` is not available — for instance Copilot in the IDE without a terminal, though agent mode can run one — walk the user through the checks instead and have them read the Security tab manually.

## Boundaries

This is a **report-first** workflow. The agent gathers, verifies, and recommends. The user acts.

- Never `gh pr review --approve`, `gh pr merge`, `gh pr close`, or `gh pr comment` without an explicit go-ahead for that specific PR. Batch approval ("merge all the green ones") is fine once given, but state which PRs it covers.
- Never commit, push, create a branch, or open a PR without confirmation ([`AGENTS.md`](../../AGENTS.md) § Git Workflow applies).
- Never dismiss an alert of either kind (`gh api --method PATCH … -f state=dismissed`) without a go-ahead for that specific alert. A dismissal is recorded against the person whose token ran it, and it does not reopen on its own.
- The agent builds code in two places only, both after the user has seen and approved the proposal: the override PR in § Step 3, on its own branch, and a small fix pushed to a Dependabot branch under the "CI red, real breakage" row of the decision table. Nothing else.
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

Dependabot closes its own superseded PRs, so a `--state open` listing will not show them. Nothing to do there.

### Decision table

| Situation                                     | Recommendation                                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| CI green, patch or minor, any group           | Recommend approve + squash-merge                                                                                                     |
| CI green, major                               | Read the release notes for the `.0` release (see below) before recommending anything. Check the coverage gap in the next subsection. |
| CI red, lockfile out of date on a security PR | Recommend closing as a duplicate of the passing version PR                                                                           |
| CI red, real breakage                         | Follow "When CI fails" in the runbook: flaky → recommend a rerun, easy → propose the fix, complex → recommend closing with a comment |
| Merge conflict / `BEHIND`                     | Recommend `@dependabot rebase`, or closing and letting Monday's run recreate it                                                      |

Every cell is a recommendation for the report, not an action to take. The user runs the commands.

One caveat on the "easy → propose the fix" path: pushing a commit to a Dependabot branch makes Dependabot stop updating that PR, so a later rebase or recreate has to be done by hand. Say so when proposing it, and ask before pushing.

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
gh run view --job <job-id> --log | grep -E 'pnpm --filter @equinor/|Test (Files|Suites)'
```

Three things that make the obvious grep miss everything:

- Job log lines are timestamp-prefixed, so anchoring with `^` never matches.
- The package headers are `$ pnpm --filter @equinor/<pkg> run test`, not the `> @equinor/<pkg>` you would expect from a local `pnpm run`.
- The two runners print different summaries: vitest says `Test Files`, jest says `Test Suites`. Matching only one silently drops half the packages.

The result reads as one line per package followed by its summary, which is what makes the gap visible. On a September 2026 run it lists `eds-utils`, `eds-core-react`, `eds-lab-react`, `eds-data-grid-react`, `eds-color-palette-generator` and `eds-mobile-components` — and not `eds-tokens` or `eds-tokens-build`.

If an affected package is missing from the log, run its tests locally against the PR's version before recommending a merge. Say in the report which suites CI covered and which you ran yourself.

## Step 2 — Triage Dependabot alerts

Read the open alerts, worst first:

```bash
gh api --paginate '/repos/equinor/design-system/dependabot/alerts?state=open&per_page=100' \
  --jq '.[] | "\({critical:0,high:1,medium:2,low:3}[.security_advisory.severity] // 9)\t\(.security_advisory.severity | ascii_upcase)\t\(.dependency.package.name)\t\(.dependency.manifest_path)\t\(.security_vulnerability.vulnerable_version_range)\tfix: \(.security_vulnerability.first_patched_version.identifier // "none")\t\(.security_advisory.ghsa_id)"' \
  | sort | cut -f2-
```

Three things the obvious version of this command gets wrong:

- `--paginate` is not optional. `per_page=100` on its own truncates silently, which is the worst failure mode for a sweep meant to catch what the PRs miss. The open list is short today, but the same endpoint returns six pages for `state=fixed`, so the cap is not theoretical.
- Sorting on the severity word alone is alphabetical, not severity order — it puts `LOW` above `MEDIUM`. Hence the numeric rank column, stripped again by `cut`.
- `--jq` runs **once per page**, not once over the whole result. Streaming expressions like `.[] | …` are fine; aggregates are not. `--jq length` against a six-page result prints six numbers, not their sum. Use the streaming form, or drop `--jq` and pipe the pages through `jq -s`.

Same alert often appears several times (one per manifest, one per advisory). Group by package and vulnerable range before counting.

Classify each package:

| Class                 | How to tell                                          | Action                                                                      |
| --------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------- |
| **Has a PR**          | An open Dependabot PR bumps it                       | Handled in Step 1; note the link                                            |
| **Direct dependency** | `manifest_path` is a `package.json`                  | Bump the dependency in that package; usually Dependabot already opened a PR |
| **Transitive**        | `manifest_path` is `pnpm-lock.yaml` and no PR exists | Override, see Step 3                                                        |
| **No fix**            | `first_patched_version` is `none`                    | Recommend a dismissal with a reason, see below                              |

Critical and high without a PR are fixed the same week. Medium and low are fixed when they ride along in the same override PR, otherwise dismissed with a reason.

### Alerts we are not going to fix

"Log it and move on" means dismissing the alert with a reason and a comment, the same way code scanning alerts are handled in § Step 4. The reasoning then lives on the alert rather than in a document that has to be found first.

| Reason           | When                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `tolerable_risk` | No patched version exists, or the fix is riskier than the advisory    |
| `no_bandwidth`   | Fixable, but not this week — the honest answer when the week runs out |
| `not_used`       | The vulnerable code path is not reachable from anything we ship       |
| `inaccurate`     | The advisory does not apply to how the package is used here           |
| `fix_started`    | A PR is open for it                                                   |

```bash
gh api --method PATCH /repos/equinor/design-system/dependabot/alerts/<n> \
  -f state=dismissed \
  -f dismissed_reason=tolerable_risk \
  -f dismissed_comment='<why, in one sentence>'
```

Always recommend a `dismissed_comment`. A dismissal without one tells the next person nothing, and they will re-investigate from scratch.

### Re-check what was dismissed earlier

A dismissed alert does not reopen on its own, not even when a patched version finally ships. So the sweep has to look. Read the whole parked pile in one pass, every week:

```bash
gh api --paginate '/repos/equinor/design-system/dependabot/alerts?state=dismissed&per_page=100' \
  --jq '.[] | select(.dismissed_reason == "tolerable_risk" or .dismissed_reason == "no_bandwidth")
        | "\(.security_advisory.severity | ascii_upcase)\t\(.dependency.package.name)\t\(.dismissed_reason)\tfix: \(.security_vulnerability.first_patched_version.identifier // "still none")\t#\(.number)\t\(.dismissed_comment // "(no comment)")"'
```

Read the two reasons differently, because they were parked for different causes:

- **`tolerable_risk` that now shows a fix.** This is the one that changed. It was parked because no patch existed, and now one does. Report it as a candidate for the override PR in § Step 3, with the original comment for context.
- **`tolerable_risk` that still shows `still none`.** Unchanged, and invisible unless someone looks — including if the risk grew because the package became reachable from shipped code. Worth a glance at whether the comment still describes the situation.
- **`no_bandwidth`.** These always had a fix; that is what the reason means. They are not news, so do not report them as "now fixable" — list them as still parked. A `no_bandwidth` entry surviving several sweeps is the signal: either do it or re-park it as `tolerable_risk` with an honest reason.

A pile that keeps growing, or an entry whose comment no longer matches reality, is worth raising with the team rather than re-dismissing.

## Step 3 — Fix transitive alerts with `pnpm.overrides`

The repo already uses `pnpm.overrides` in the root `package.json` for this (see PRs #5177, #5368, #5472). Follow the same shape.

### 3a. Establish what is actually installed

Find the installed version(s) and who pulls each one in. The parent tells you whether an override is safe (a `^` range in the parent) or will fight a pin.

The quick way, if the checkout is installed:

```bash
pnpm why -r <pkg> | head -40
```

It prints the chain from each workspace package down to the vulnerable version, which is more legible than counting lockfile indentation. Two caveats: the output repeats the same path many times in a large tree, so pipe it through `head` or grep for the version you care about; and it reflects what is **installed locally**, not what `main` resolves to. If the branch's lockfile differs from `main`'s, `pnpm why` is describing the branch.

The authoritative version, for what `main` actually ships:

```bash
git show origin/main:pnpm-lock.yaml > /tmp/main-lock.yaml
grep -oE "^  '?<pkg>@[0-9][^'(:]*" /tmp/main-lock.yaml | sort -u      # resolved versions
```

In the `snapshots:` section, every entry lists its dependencies two indent levels deeper; the parents of `<pkg>@<ver>` are the entries whose block contains `<pkg>: <ver>`.

### 3b. Check the fix is real for us

```bash
npm view <pkg> versions --json | tail          # does the patched version exist for this major line?
npm view <pkg>@<fix> type engines              # ESM-only? new Node floor?
```

Do **not** override when:

- The fix jumps to a version that changes module format (`"type": "module"` where the parent is CommonJS) or raises `engines.node` above what the parent supports. Example: `decode-uri-component` 0.2 → 0.5 is ESM-only while `query-string@7` (Expo) is CJS.
- The fix crosses a 0.x "major" in a build-tool chain (`esbuild` 0.27 → 0.28 under `tsup`) for a low-severity advisory. Not worth the risk; recommend dismissing it as `tolerable_risk` with the reason in the comment.
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

## Step 4 — Triage code scanning alerts

The Security tab has a second list: CodeQL findings in our own source, rather than in a dependency. These never produce a PR, so nothing surfaces them except this step.

### How it is set up

Code scanning runs through CodeQL **default setup**, not a workflow file — there is no `codeql.yml` in `.github/workflows/`, so do not go looking for one and do not propose a PR to change the configuration. It lives in the repo's Settings → Code security. Current configuration:

```bash
gh api /repos/equinor/design-system/code-scanning/default-setup
# state: configured · languages: actions, javascript, javascript-typescript, typescript
# query_suite: default · schedule: weekly
```

Two CodeQL check runs therefore appear on every PR: `CodeQL` (security queries) and `CodeQL - Code Quality`. Both are informational on the PR itself; the alerts they raise land on the Security tab.

### Read the open alerts

```bash
gh api --paginate '/repos/equinor/design-system/code-scanning/alerts?state=open&per_page=100' \
  --jq '.[] | "\(.rule.security_severity_level // .rule.severity | ascii_upcase)\t\(.rule.id)\t\(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)\t#\(.number)"'
```

`rule.security_severity_level` is the CVSS-derived level and is what the Security tab sorts on; quality rules have no such level, hence the fallback to `rule.severity`. This list is usually empty, so the step normally costs half a minute. It is still the part of the duty that was never written down anywhere.

### Decide per alert

Read the flagged line before judging. `most_recent_instance.location` gives the path and line; the alert's `html_url` shows the data-flow path CodeQL followed.

| Finding                                     | Recommendation                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Real, reachable from consumer input         | Fix it in a normal PR, referencing the rule id in the description                                      |
| Real but only in test or Storybook fixtures | Recommend dismissal with reason `used in tests`                                                        |
| CodeQL is wrong about the flow              | Recommend dismissal with reason `false positive`, and say in the comment which step of the flow breaks |
| Real, but already handled elsewhere         | Recommend dismissal with reason `mitigated`, naming the control that handles it                        |
| Real, low severity, not worth the churn     | Recommend dismissal with reason `won't fix`                                                            |

`false positive`, `won't fix`, `used in tests` and `mitigated` are the only values the API accepts for `dismissed_reason`. The dismissal goes in the report for the user to run:

```bash
gh api --method PATCH /repos/equinor/design-system/code-scanning/alerts/<n> \
  -f state=dismissed \
  -f dismissed_reason='false positive' \
  -f dismissed_comment='<why, in one sentence>'
```

`dismissed_comment` is optional to the API and mandatory for us — a dismissal without one is indistinguishable from someone clearing the list, and the next person on duty has no way to re-check the judgement. It is capped at 280 characters.

A dismissal sticks. GitHub's wording is "next time code scanning runs, the same code won't generate an alert" — so the flagged code stops being reported until it changes enough to be a different alert. Both alert types behave the same way here: nothing reopens on its own, which is why the comment carries the whole weight of the decision.

That also means the dismissed code scanning list deserves the same periodic look as the parked Dependabot alerts in § Step 2:

```bash
gh api --paginate '/repos/equinor/design-system/code-scanning/alerts?state=dismissed&per_page=100' \
  --jq '.[] | "\(.rule.security_severity_level // .rule.severity | ascii_upcase)\t\(.rule.id)\t\(.dismissed_reason)\t\(.dismissed_comment // "(no comment)")"'
```

## Step 5 — Report

Print the report to chat (or to the path the user gave). Shape:

```markdown
## Dependabot duty — <date>

### Open PRs

| PR  | Bump | Type | CI  | Recommendation |
| --- | ---- | ---- | --- | -------------- |

### Dependabot alerts without a PR

| Severity | Package | Installed | Fix | Pulled in by | Action |
| -------- | ------- | --------- | --- | ------------ | ------ |

### Code scanning alerts

| Severity | Rule | Location | Alert | Recommendation |
| -------- | ---- | -------- | ----- | -------------- |

### Parked earlier, fixable now

| Severity | Package | Dismissed as | Fix available | Alert |
| -------- | ------- | ------------ | ------------- | ----- |

### To dismiss

| Alert | What | Reason | Comment |
| ----- | ---- | ------ | ------- |

### Commands to run

gh pr review <n> --approve
gh pr merge <n> --squash
gh pr close <n> --comment "Superseded by #<m>, which includes the lockfile update."
gh api --method PATCH /repos/equinor/design-system/dependabot/alerts/<n> -f state=dismissed -f dismissed_reason=tolerable_risk -f dismissed_comment='<why>'
gh api --method PATCH /repos/equinor/design-system/code-scanning/alerts/<n> -f state=dismissed -f dismissed_reason='false positive' -f dismissed_comment='<why>'
```

Leave out the sections with nothing in them rather than printing empty tables.

Put the exact `gh` commands at the end so the person on duty can paste them. The agent does not run them without a go-ahead.

## Where the reasoning lives

There is no separate log. An alert we are not fixing gets dismissed with a reason and a comment — § Step 2 for Dependabot alerts, § Step 4 for code scanning — and that dismissal _is_ the record. It sits on the alert, it is filterable (`state=dismissed`), and the weekly re-check in § Step 2 brings anything back that has since become fixable.

If you find yourself wanting to write the reasoning down somewhere else, the dismissal comment is too short or too vague. Fix the comment.

## Follow-ups this playbook knows about

- `packages/eds-tokens` and `packages/eds-tokens-build` tests are not in the root `test` script (September 2026). Until that is fixed, run them locally for any vitest or vite major.
- `image-size` (high, via `metro` and `@docusaurus/mdx-loader`) has no patched version. Dismiss as `tolerable_risk`; the § Step 2 re-check picks it up if upstream ever patches.
