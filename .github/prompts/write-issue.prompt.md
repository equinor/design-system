---
mode: agent
description: Write or revise a GitHub issue (title and body) from notes, screenshots or a conversation
---

# Write an issue

> **Canonical reference:** [`documentation/agent-instructions/PR_AND_ISSUE_WRITING.md`](../../documentation/agent-instructions/PR_AND_ISSUE_WRITING.md). Read it before drafting. It holds the word limit, the writing restrictions, the issue rules, an example and the checklist before posting.

Write an issue from the following input: ${input:notes}

## Steps

1. Gather the input above, plus any code or issues it points to. Check `gh issue list --search` for an existing issue on the same problem.
2. Separate what was observed from what is assumed. Ask the user about gaps instead of guessing.
3. Pick the matching template in `.github/ISSUE_TEMPLATE/`, if any, and draft per § Issues in the canonical doc.
4. Check the draft against § Before posting. Count the prose and cut until it is within 400 words.
5. Show the draft to the user. Run `gh issue create` or `gh issue edit` only after they approve it.
