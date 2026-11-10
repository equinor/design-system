# PR reviews

This is the canonical playbook for how an agent reviews a pull request and puts the findings in. The rules for who may submit a review, and how a review moves a card on the project board, are in [`AGENTS.md`](../../AGENTS.md) § PR Reviews and the Project Board. This document holds the steps.

Harness entry points: the `review-pr` skill in Claude Code, and the `advisor` prompt in Copilot, which follows these steps under the user's `gh` login. The OpenCode advisor has no shell, so it drafts the review in chat and follows § Severity and § Comments.

## Severity

| Level          | Meaning                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **Blocking**   | Bug, accessibility violation (WCAG 2.1 AA), wrong API, breaking change without `!`, leaked secret |
| **Should fix** | Breaks a convention in `AGENTS.md`, missing test for new behaviour, misleading types/JSDoc        |
| **Suggestion** | A better approach exists but the current one works                                                |
| **Nit**        | Naming, wording, formatting. Prefix with `nit:`                                                   |

## Comments

Two or three sentences: the problem, then the suggestion. Collegial phrasing ("maybe:", "could we…?"). No headers or nested bullets inside a comment, no AI attribution, no emojis. Prefix with the severity where it helps.

## Put the review in

1. Check for an existing pending review: `gh api repos/{owner}/{repo}/pulls/<n>/reviews --jq '.[] | select(.state=="PENDING") | .id'`. GitHub allows one per person. If one exists, ask before deleting it (`gh api -X DELETE repos/{owner}/{repo}/pulls/<n>/reviews/<id>`).
2. Check the head again with `gh pr view <n> --json headRefOid`. If it moved since you read the diff, read the new changes before posting.
3. With the harness's file-writing tool, write `/tmp/pr-<n>-review.json`, outside the repo:
   - `commit_id`: the head SHA.
   - No `event` field, unless the user asked you to submit (see § Submit it). Leaving it out keeps the review pending.
   - `body`: a short opener with what you verified, plus the findings that have no line.
   - `comments`: one per finding that has a line, as `{path, line, side: "RIGHT", body}`. `line` is on the new side of the diff and must fall inside a hunk, otherwise move the finding into `body`.
4. Post it: `gh api -X POST repos/{owner}/{repo}/pulls/<n>/reviews --input /tmp/pr-<n>-review.json --jq '{id,state,html_url}'`, and check that `state` is `PENDING`, or the type you submitted.
5. `line` and `side` read `null` while the review is pending. That is normal.
6. The stored `body` does not survive submitting on GitHub. The "Finish your review" box opens empty, and a review submitted with the box empty goes out with no body (tested on #5835). The inline comments are kept.

## Submit it

Submit only when the user asks you to and names the type, Comment or Request changes. A submitted review cannot be edited or withdrawn, so otherwise leave it pending, so that the reviewer can read the inline comments on GitHub first. Never approve, except a Dependabot PR after an explicit go-ahead ([`DEPENDABOT_DUTY.md`](./DEPENDABOT_DUTY.md)). You cannot request changes on your own PR.

If the user asked you to submit before you started, post the review in one call: in step 3 above, add `"event": "COMMENT"` or `"event": "REQUEST_CHANGES"` to the JSON and keep the summary in `body`. The review is submitted at once and keeps its body.

If the review is already pending and the user then asks you to submit it, write the summary to `/tmp/pr-<n>-summary.md` with the harness's file-writing tool and pass it as the body, since the stored one does not survive:

```bash
gh api -X POST repos/{owner}/{repo}/pulls/<n>/reviews/<id>/events -f event=COMMENT -F body=@/tmp/pr-<n>-summary.md
```

Use `event=REQUEST_CHANGES` for Request changes.

## Reply

If the review is still pending, give the link to it, the recommended type in one line, and the count per severity. Remind the reviewer to submit it with the type they choose. Do not paste the inline comments into the chat, but do paste the `body` text, in a fenced markdown block, and tell the reviewer to paste it into the "Finish your review" box before submitting.

If you submitted it, give the link, the type you submitted and the count per severity.
