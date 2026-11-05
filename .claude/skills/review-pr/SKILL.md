---
name: review-pr
description: Review a pull request and put the findings in as a pending review with inline comments that only the reviewer sees. Use whenever the user asks to review a PR, to draft review comments, or to look over PR #NNNN. Never submits the review.
---

# Review a PR

Review the PR in `$ARGUMENTS` (a number, URL or branch) and put the findings in as a **pending review**. The reviewer reads and edits it on GitHub, then submits it with the type they choose.

> **Rules:** [`AGENTS.md`](../../../AGENTS.md) § PR Reviews and the Project Board. Never submit a review and never approve. The user running this skill is the request to put the review in, so do not ask again before posting.

## Steps

1. Take the PR from `$ARGUMENTS`, or from the current branch (`gh pr view`) if it is empty.
2. Read `gh pr view <n> --json title,body,author,baseRefName,headRefName,files,reviews,comments` and `gh pr diff <n>`, including existing reviews and the bot's. Open the surrounding source when the diff alone is ambiguous.
3. Check the diff against `AGENTS.md`. For `/next` components, also check `documentation/agent-instructions/BUILDING_EDS_2_COMPONENTS.md`, and check token names against `packages/eds-tokens/build/css/` instead of assuming them. When a finding depends on test, lint or build output, run it against the PR head (`git fetch origin pull/<n>/head`) and say which ref the result comes from. Take line numbers for comments from the PR head too (`git show <ref>:<path>`), because your local branch may be a different one.
4. Rank each finding (below). Keep a finding the bot already raised. Before suggesting a new issue, search open and closed issues (`gh issue list --state all --search "..."`).
5. Recommend a review type from the table in `AGENTS.md`.
6. Put the review in, then reply.

## Severity

| Level          | Meaning                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Blocking**   | Bug, accessibility violation (WCAG 2.1 AA), breaking change without `!`, leaked secret     |
| **Should fix** | Breaks a convention in `AGENTS.md`, missing test for new behaviour, misleading types/JSDoc |
| **Suggestion** | A better approach exists but the current one works                                         |
| **Nit**        | Naming, wording, formatting. Prefix with `nit:`                                            |

## Comments

Two or three sentences: the problem, then the suggestion. Collegial phrasing ("maybe:", "could we…?"). No headers or nested bullets inside a comment, no AI attribution, no emojis. Prefix with the severity where it helps.

## Put the review in

1. Check for an existing pending review: `gh api repos/{owner}/{repo}/pulls/<n>/reviews --jq '.[] | select(.state=="PENDING") | .id'`. GitHub allows one per person. If one exists, ask before deleting it (`gh api -X DELETE repos/{owner}/{repo}/pulls/<n>/reviews/<id>`).
2. Check the head again with `gh pr view <n> --json headRefOid`. If it moved since you read the diff, read the new changes before posting.
3. With the Write tool, write `/tmp/pr-<n>-review.json`, outside the repo:
   - `commit_id`: the head SHA.
   - No `event` field. Leaving it out keeps the review pending.
   - `body`: a short opener with what you verified, plus the findings that have no line.
   - `comments`: one per finding that has a line, as `{path, line, side: "RIGHT", body}`. `line` is on the new side of the diff and must fall inside a hunk, otherwise move the finding into `body`.
4. Post it: `gh api -X POST repos/{owner}/{repo}/pulls/<n>/reviews --input /tmp/pr-<n>-review.json --jq '{id,state,html_url}'`, and check that `state` is `PENDING`.
5. `line` and `side` read `null` while the review is pending. That is normal.
6. The stored `body` does not survive submitting. GitHub's "Finish your review" box opens empty, and a review submitted with the box empty goes out with no body (tested on #5835). The inline comments are kept.

## Reply

Give the link to the pending review, the recommended type in one line, and the count per severity. Remind the reviewer to submit it with the type they choose. Do not paste the inline comments into the chat, but do paste the `body` text, in a quote block, and tell the reviewer to paste it into the "Finish your review" box before submitting.
