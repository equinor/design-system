---
mode: agent
description: Write or revise a short PR description (title and body) for this repository
---

# Write a PR description

> **Canonical reference:** [`documentation/agent-instructions/PR_AND_ISSUE_WRITING.md`](../../documentation/agent-instructions/PR_AND_ISSUE_WRITING.md). Read it before drafting. It holds the word limit, the writing restrictions, the PR rules, an example and the checklist before posting. The title format is in [`AGENTS.md`](../../AGENTS.md) § Conventional Commits.

Write a PR description for the current branch, or for this PR if one is given: ${input:pr}

## Steps

1. Read the diff against the base branch (`git diff main...HEAD`), the commit log (`git log main..HEAD`) and the linked issue. If a PR number is given, read that PR with `gh pr view` instead.
2. Draft the title and body per § PR descriptions in the canonical doc, describing the final change.
3. Check the draft against § Before posting. Count the prose and cut until it is within 300 words.
4. Show the draft to the user. Run `gh pr create` or `gh pr edit` only after they approve it.
