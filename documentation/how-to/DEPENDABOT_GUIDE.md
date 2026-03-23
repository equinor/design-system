# Dependabot PR Runbook

How to handle dependabot PRs in this repo. It's quick — most take under 5 minutes.

## When do they arrive?

Dependabot opens PRs every **Monday at 05:00 UTC** (07:00 Oslo time). Expect up to ~5 new PRs per week, grouped by category (see below).

## The 3-step process

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
- **Is it a major bump?** → Read the changelog link in the PR description. Look for breaking changes that could affect us.

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
A: Everyone on the team. We aim to clear the queue within the week they arrive.
