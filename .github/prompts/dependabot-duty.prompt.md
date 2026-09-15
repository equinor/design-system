---
mode: agent
description: Weekly Dependabot rotation — triage open Dependabot PRs and Security-tab alerts, propose overrides, report
---

# Dependabot Duty

Run the weekly Dependabot rotation: triage the open Dependabot PRs **and** the open alerts on the Security tab, then produce a report with recommendations and the exact `gh` commands to run. Narrow the scope with `${input:scope}` (`prs`, `alerts`, a PR number, or a package name); if empty, do both halves.

> **Canonical reference:** [`documentation/agent-instructions/DEPENDABOT_DUTY.md`](../../documentation/agent-instructions/DEPENDABOT_DUTY.md) — prerequisites (`security_events` scope), boundaries, PR triage with the duplicate-PR pattern and decision table, alerts triage, the `pnpm.overrides` recipe for transitive alerts, report format, and where to log alerts without a fix. The short human runbook is [`documentation/how-to/DEPENDABOT_GUIDE.md`](../../documentation/how-to/DEPENDABOT_GUIDE.md).

## Workflow

1. **PRs** (§ Step 1): list open Dependabot PRs with CI state. Spot `npm_and_yarn` security PRs that duplicate a version PR and fail on `ERR_PNPM_OUTDATED_LOCKFILE`. For majors, read the `.0` release notes and confirm the affected packages' tests actually ran in the `Test` job log; run locally what CI skipped.
2. **Alerts** (§ Step 2): read open alerts via `gh api`, group by package, and classify each as has-a-PR / direct / transitive / no-fix. In the IDE without `gh`, ask the user to read the Security tab and paste the list.
3. **Overrides** (§ Step 3): for transitive alerts, trace the parent in `main`'s lockfile, check the fix is installable for us (module format, engines), and propose the `pnpm.overrides` changes. Build the override PR only after the user has confirmed the list.
4. **Report** (§ Step 4): print the report with the `gh` commands at the end.

## Boundaries

Report first. Do not approve, merge, close, or comment on PRs, and do not commit, push, branch, or open a PR, without an explicit go-ahead for that action. Do not send `@dependabot` commands without asking.
