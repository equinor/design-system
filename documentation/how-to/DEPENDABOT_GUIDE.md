# Dependabot Duty Runbook

How to handle Dependabot duty in this repo. The job is the **open Dependabot PRs**, plus everything on the **Security tab** that did not get a PR: Dependabot alerts for dependencies, and code scanning alerts for our own source. Most PRs take under 5 minutes; the Security tab is the part that tends to get skipped.

An AI agent can do the sweep for you and hand back a report with the commands to run: `/dependabot-duty` in Claude Code, the `dependabot-duty` prompt in Copilot, the `dependabot-duty` agent in OpenCode. The long-form playbook they follow is [`documentation/agent-instructions/DEPENDABOT_DUTY.md`](../agent-instructions/DEPENDABOT_DUTY.md).

## When do they arrive?

Dependabot opens PRs every **Monday at 05:00 UTC** (07:00 Oslo time). Expect up to ~5 new PRs per week, grouped by category (see below). Security PRs (`npm_and_yarn` group) can arrive any day.

## The 4-step process

Steps 1-3 are per PR. Step 4 is once a week, whether or not there were any PRs.

### 1. Open the PR and check CI status

Go to the PR on GitHub. Three checks must pass:

| Check | What it does |
|---|---|
| **PR Title Check** | Validates conventional commit format — always passes for dependabot |
| **Checks** (build/test/lint/types) | Builds all packages, runs tests, lints, and typechecks |
| **React 18 compatibility** | Same as above but with React 18 — only runs if `packages/` changed |

- ✅ **All green?** → Go to step 2
- ❌ **CI failed?** → Go to "When CI fails" below

### 2. Quick review — what changed?

Check the **Files changed** tab. Dependabot PRs only touch `package.json` and `pnpm-lock.yaml` files. You're looking for:

- **Is it a minor/patch bump?** → Almost always safe. Just verify CI passes.
- **Is it a major bump?** → Read the changelog link in the PR description. Look for breaking changes that could affect us. Also check that the tests for the affected packages actually ran in the `Test` job — the root `pnpm run test` script does not cover every package (as of September 2026, `eds-tokens` and `eds-tokens-build` are missing). Run those locally if needed.
- **Two PRs for the same bump?** → Dependabot often opens a `npm_and_yarn` security PR and a regular version PR for the same package. The security PR sometimes lacks the `pnpm-lock.yaml` change and fails `setup` with `ERR_PNPM_OUTDATED_LOCKFILE`. Merge the one with the lockfile, close the other with a comment pointing at it.

#### PR categories (from our dependabot config)

| Group | What's included | Update type |
|---|---|---|
| `all-dependencies` | Everything not in a specific group | Minor + patch only |
| `all-actions` | GitHub Actions | All versions |
| `storybook` | @storybook/* | Major only |
| `react` | react, react-dom, @types/react* | Major only |
| `react-aria` | @react-aria/*, @react-stately/* | Major only |
| `eslint` | eslint, @typescript-eslint/* | Major only |
| `testing` | jest, @testing-library/* | Major only |
| `rollup` | rollup, @rollup/* | Major only |
| `tanstack` | @tanstack/* | Major only |

**The `all-dependencies` group** (minor/patch only) is the most common and safest — if CI is green, it's good to merge.

### 3. Approve and merge

1. Leave an approving review (or just click **Approve**)
2. Click **Squash and merge**
3. Done!

No need to check out the branch locally. No need to test manually. CI covers build + test + lint + types + React 18 compat.

### 4. Check the Security tab

Two lists, both weekly:

- [Dependabot alerts](https://github.com/orgs/equinor/security/alerts/dependabot?q=is%3Aopen+team%3Aeds-core+sort%3Aseverity+repo%3Adesign-system), sorted by severity. Anything **critical or high without a matching PR** is fixed the same week. See "Dependabot alerts (no PR)" below.
- [Code scanning alerts](https://github.com/equinor/design-system/security/code-scanning?query=is%3Aopen) — CodeQL findings in our own source. Usually empty. See "Code scanning alerts" below.

The duty is not done until this step is done. Merging the PRs alone leaves the alerts that Dependabot cannot auto-fix sitting there.

## When CI fails

This happens sometimes, especially on major bumps. Here's what to do:

### Build failure

Click the failed check → look at the build log. Common causes:

- **Breaking API change** in the dependency → the PR needs code changes
- **Peer dependency conflict** → might need to bump related packages together

### Test failure

Click the failed check → find which test failed. Ask yourself:

- Is this a real breakage from the dependency update?
- Or is it a flaky test? (Re-run the job once to check)

### Type errors

Often happens with `@types/*` bumps or major framework upgrades. Check the TypeScript errors in the log.

### What to do about failures

| Scenario | Action |
|---|---|
| Flaky test | Re-run the failed job (button in GitHub Actions) |
| Real breakage, easy fix | Check out the branch, fix it, push, let CI re-run |
| Real breakage, complex fix | Comment on the PR explaining the issue, and close it. We'll handle the upgrade separately. |
| Security update that fails CI | Prioritize fixing it — tag the team in Slack |

### How to check out a dependabot branch locally

```bash
git fetch origin
git checkout dependabot/npm_and_yarn/the-branch-name
pnpm install
pnpm run build
pnpm run test:core-react
```

## Security updates (npm_and_yarn group)

These come from `dependabot alerts` and may arrive outside the Monday schedule. They bump vulnerable transitive dependencies. **Prioritize these** — they fix known vulnerabilities.

You can recognize them by the group name `npm_and_yarn` in the PR title or by the "security" label.

## Dependabot alerts (no PR)

Not all vulnerabilities auto-create a PR. Most of the leftovers are **transitive** dependencies (the alert's manifest is `pnpm-lock.yaml`, not a `package.json`), which Dependabot cannot bump on its own.

- **High/critical with no PR?** Fix it the same week, in its own PR, with a review before merging to main.
- **Low/moderate with no PR?** Fix it if it rides along in the same override PR, otherwise dismiss it with a reason (see below).
- **No patched version exists?** Dismiss it with a reason and a comment saying why.

### Fixing a transitive alert

The repo uses `pnpm.overrides` in the root `package.json` for this (examples: #5177, #5368, #5472). The short version:

1. Find the installed version(s) and which package pulls each one in, using `main`'s `pnpm-lock.yaml`.
2. Check the patched version exists for that major line and does not change module format (ESM-only) or Node floor in a way the parent cannot take.
3. Add or raise the override. Key per major when several coexist (`"js-yaml@^3"`, `"js-yaml@^4"`); use `>=<fix>` or `>=<fix> <next-major`.
4. `pnpm install --no-frozen-lockfile`, then check the lockfile diff only touches the target packages, then `pnpm install --frozen-lockfile` must pass.
5. One PR: `chore: bump pnpm overrides to resolve transitive dependabot alerts`, with a before/after table and a "deliberately left out" list.

Full procedure with commands: [`DEPENDABOT_DUTY.md` § Step 3](../agent-instructions/DEPENDABOT_DUTY.md#step-3--fix-transitive-alerts-with-pnpmoverrides).

## Code scanning alerts

CodeQL scans our own source on every PR and weekly, and raises alerts on the [code scanning page](https://github.com/equinor/design-system/security/code-scanning?query=is%3Aopen). It is set up through GitHub's default setup, so there is no workflow file to edit — the configuration lives in the repo's Settings → Code security.

The list is usually empty. When something is on it:

- **Real problem?** Fix it in a normal PR and reference the rule id (`js/…`) in the description.
- **Not a real problem?** Dismiss it with a reason and a one-line comment saying why. The comment is optional to GitHub and required by us — a dismissal without one is useless to the next person.

Commands and the per-alert decision table: [`DEPENDABOT_DUTY.md` § Step 4](../agent-instructions/DEPENDABOT_DUTY.md#step-4--triage-code-scanning-alerts).

## Alerts we are not going to fix

There is no separate log to keep. Dismiss the alert with a reason and a comment, and that is the record — it stays on the alert, where the next person will actually see it. Anyone with write access can dismiss, so the whole rotation can do this.

GitHub offers a fixed set of reasons, and the two alert types have different sets. Pick from the dropdown on the alert, or see [`DEPENDABOT_DUTY.md` § Step 2](../agent-instructions/DEPENDABOT_DUTY.md#step-2--triage-dependabot-alerts) for what each one means and when to use it.

Write a real comment either way. A reason on its own means the next person redoes your investigation from scratch.

One catch, and it applies to both alert types: a dismissal is permanent. A Dependabot alert does not reopen when a patch finally ships, and GitHub's own wording for code scanning is that "the same code won't generate an alert" on later runs. So nothing brings a dismissed alert back except someone looking.

The weekly sweep therefore re-reads the dismissed lists: anything parked as *tolerable risk* or *no bandwidth* that has since become fixable, plus a plain list of what is still parked so the pile stays visible. The agent does this automatically. By hand, filter the alerts page on dismissed and skim it.

## FAQ

**Q: Can I just approve without reviewing?**
A: If CI is green and it's a minor/patch `all-dependencies` bump — yes. For major bumps, at least read the changelog link.

**Q: What if there are merge conflicts?**
A: Close the PR. Dependabot will automatically recreate it with a fresh branch on the next scheduled run (Monday). You can also comment `@dependabot rebase` to trigger an immediate rebase.

**Q: Can I batch-merge several dependabot PRs?**
A: Yes, but merge them one at a time (not simultaneously) so CI runs on each merge to main. Start with the smallest/safest ones.

**Q: A PR has been open for weeks. What do I do?**
A: Check why. If CI fails, see "When CI fails". If it just needs a review, review and merge it. If it's a problematic major upgrade, close it with a comment explaining why.

**Q: Who should handle these?**
A: Everyone on the team, on a weekly rotation (the Monday Slack reminder names who). We aim to clear the queue, PRs and alerts, within the week they arrive.

**Q: Can I let an AI agent do the sweep?**
A: Yes. `/dependabot-duty` (Claude Code), the `dependabot-duty` prompt (Copilot) or agent (OpenCode) triages the PRs and both alert lists, and hands back a report with the `gh` commands to run. It does not approve, merge, close or dismiss anything itself; you do, after reading the report.
