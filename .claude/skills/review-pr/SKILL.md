---
name: review-pr
description: Review a pull request and put the findings in as a pending review with inline comments that only the reviewer sees. Use whenever the user asks to review a PR, to draft review comments, or to look over PR #NNNN. Leaves the review pending unless the user asks to submit it and names the type.
---

# Review a PR

Review the PR in `$ARGUMENTS` (a number, URL or branch) and put the findings in as a **pending review**. The reviewer reads and edits it on GitHub, then submits it with the type they choose.

> **Canonical reference:** [`documentation/agent-instructions/PR_REVIEWS.md`](../../../documentation/agent-instructions/PR_REVIEWS.md). Read it before posting. It holds the severity levels, the comment rules, the steps for putting the review in and submitting it, and the reply format. The rules are in [`AGENTS.md`](../../../AGENTS.md) § PR Reviews and the Project Board. The user running this skill is the request to put the review in, so do not ask again before posting. It needs `gh api` under the user's own `gh` login, so it does not run in the `@claude` action.

## Steps

1. Take the PR from `$ARGUMENTS`, or from the current branch (`gh pr view`) if it is empty.
2. Read `gh pr view <n> --json title,body,author,baseRefName,headRefName,files,reviews,comments` and `gh pr diff <n>`, including existing reviews and the bot's. The inline comments in review threads are not in that output, so also read `gh api repos/{owner}/{repo}/pulls/<n>/comments`. Open the surrounding source when the diff alone is ambiguous.
3. Check the diff against `AGENTS.md`. For `/next` components, also check `documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md`, and check token names against `packages/eds-tokens/build/css/` instead of assuming them. When a finding depends on test, lint or build output, run it against the PR head (`git fetch origin pull/<n>/head`) and say which ref the result comes from. Take line numbers for comments from the PR head too (`git show <ref>:<path>`), because your local branch may be a different one.
4. Rank each finding by § Severity. Keep a finding only the bot raised, and leave out one that another reviewer has already raised. Before suggesting a new issue, search open and closed issues (`gh issue list --state all --search "..."`).
5. Recommend a review type from the table in `AGENTS.md`.
6. Put the review in as § Put the review in describes, submit it only if the user asked, then reply as § Reply describes.
