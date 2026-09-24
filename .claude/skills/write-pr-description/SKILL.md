---
name: write-pr-description
description: Write or revise a pull request description (title and body) for this repository. Use whenever opening a PR, running `gh pr create` or `gh pr edit`, or when the user asks for a PR description.
---

# Write a PR description

Write a short PR description that lets a reviewer understand what changed, why, and how it was checked.

> **Canonical reference:** [`documentation/agent-instructions/PR_AND_ISSUE_WRITING.md`](../../../documentation/agent-instructions/PR_AND_ISSUE_WRITING.md). Read it before drafting. It holds the word limit, the writing restrictions, the PR rules, an example and the checklist before posting. The title format is in [`AGENTS.md`](../../../AGENTS.md) § Conventional Commits.

## Steps

1. Read the diff against the base branch (`git diff origin/main...HEAD`), the commit log (`git log origin/main..HEAD`) and the linked issue. If `$ARGUMENTS` names a PR number, read that PR with `gh pr view` instead.
2. Draft the title and body per § PR descriptions in the canonical doc, describing the final change.
3. Check the draft against § Before posting. Count the prose and cut until it is within 300 words.
4. Show the draft to the user. Run `gh pr create` or `gh pr edit` only after they approve it.
