---
name: write-issue
description: Write or revise a GitHub issue (title and body) for this repository from notes, screenshots or a conversation. Use whenever opening an issue, running `gh issue create` or `gh issue edit`, or when the user asks for an issue to be written.
---

# Write an issue

Explain a problem or proposed change clearly enough for someone to investigate it or decide what to do next.

> **Canonical reference:** [`documentation/agent-instructions/PR_AND_ISSUE_WRITING.md`](../../../documentation/agent-instructions/PR_AND_ISSUE_WRITING.md). Read it before drafting. It holds the word limit, the writing restrictions, the issue rules, an example and the checklist before posting.

## Steps

1. Gather the input: the notes, screenshots or conversation in `$ARGUMENTS`, plus any code or issues they point to. Check `gh issue list --search` for an existing issue on the same problem.
2. Separate what was observed from what is assumed. Ask the user about gaps instead of guessing.
3. Pick the matching template in `.github/ISSUE_TEMPLATE/`, if any, and draft per § Issues in the canonical doc.
4. Check the draft against § Before posting. Count the prose and cut until it is within 400 words.
5. Show the draft to the user. Run `gh issue create` or `gh issue edit` only after they approve it.
