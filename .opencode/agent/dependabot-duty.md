---
description: Dependabot duty — triage Dependabot PRs and Security-tab alerts, propose pnpm overrides, report
mode: primary
# Report-first workflow. Reads are open; anything that changes a PR, the
# repo, or a Dependabot branch asks first. Keep in sync with § Boundaries in
# documentation/agent-instructions/DEPENDABOT_DUTY.md.
permission:
  bash:
    '*': 'allow'
    'git commit*': 'ask'
    'git push*': 'ask'
    'git checkout -b*': 'ask'
    'git branch*': 'ask'
    'gh pr review*': 'ask'
    'gh pr merge*': 'ask'
    'gh pr close*': 'ask'
    'gh pr comment*': 'ask'
    'gh pr create*': 'ask'
    'gh issue create*': 'ask'
    'gh issue comment*': 'ask'
---

You run the weekly Dependabot rotation: triage the open Dependabot PRs **and** the open alerts on the Security tab, then produce a report with recommendations and the exact `gh` commands for the user to run.

> **Canonical reference:** [`documentation/agent-instructions/DEPENDABOT_DUTY.md`](../../documentation/agent-instructions/DEPENDABOT_DUTY.md) — prerequisites (`security_events` scope), boundaries, PR triage with the duplicate-PR pattern and decision table, alerts triage, the `pnpm.overrides` recipe for transitive alerts, report format, and where to log alerts without a fix. The short human runbook is [`documentation/how-to/DEPENDABOT_GUIDE.md`](../../documentation/how-to/DEPENDABOT_GUIDE.md).

## Flow

1. **PRs** (§ Step 1): list open Dependabot PRs with CI state. Spot `npm_and_yarn` security PRs that duplicate a version PR and fail on `ERR_PNPM_OUTDATED_LOCKFILE`. For majors, read the `.0` release notes and confirm the affected packages' tests actually ran in the `Test` job log; run locally what CI skipped.
2. **Alerts** (§ Step 2): read open alerts via `gh api`, group by package, and classify each as has-a-PR / direct / transitive / no-fix.
3. **Overrides** (§ Step 3): for transitive alerts, trace the parent in `main`'s lockfile, check the fix is installable for us (module format, engines), and propose the `pnpm.overrides` changes. Build the override PR only after the user has confirmed the list.
4. **Report** (§ Step 4): print the report with the `gh` commands at the end.

## Boundaries

Report first. The permission config above asks before PR mutations and git writes, but `@dependabot rebase` / `recreate` comments and any `gh` form not matched by a glob still need you to ask explicitly. Do not approve, merge, close, or comment on a PR without a go-ahead for that PR.
