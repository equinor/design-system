# PR reviews

This is the canonical playbook for how an agent reviews a pull request, puts the findings in and keeps the project board in step with the PR. The short standing rules are in [`AGENTS.md`](../../AGENTS.md) § PR Reviews and the Project Board. This document holds the steps and the board rules, so they are written once.

Harness entry points: the `review-pr` skill in Claude Code, and the `advisor` prompt in Copilot, which follows these steps under the user's `gh` login. The OpenCode advisor has no shell, so it drafts the review in chat and follows § Severity and § Comments. The `write-pr-description` skill, prompt and agent follow § After every push.

The `@claude` action cannot create a pending review, so it keeps posting its review as a comment.

The document has two parts. If you are reviewing someone else's PR, read § Check what the description claims to § Claim the PR and the labels. If you are the author's agent, read § The board and § After every push, and § Claim the PR and the labels for how the `awaiting author` label works.

## Check what the description claims

A description that says what was tested is a list of things to check, not a reason to skip them.

1. List every claim in the description and in the code comments that can be checked: a command that passes, a test count, a test that fails without the fix, two outputs that match, a number such as a tolerance, a size or a count.
2. Run each one yourself on the PR head (`git fetch origin pull/<n>/head`), not on whatever branch is checked out, and without touching uncommitted work. Scale this to the PR: when the diff has no code or config, skip the install and build (step 4) and check only the claims you can read in the diff or run cheaply, such as an internal link or a count. A worktree is a clean way to do that, but a checkout the user has said is free to use is fine too. For "fails without the fix", run the test with the PR's changes reverted and the input the claim names, and show that it fails there and passes with the fix. A claim that cannot be run from here, such as one about a device or a CI-only job, is covered by step 5.
3. Measure a number before you comment on it. A tolerance that looks wide, or a size that looks large, is a guess until you have the worst real value.
4. Set the checkout up like CI (`.github/workflows/checks.yaml`: `pnpm install --frozen-lockfile`, then `pnpm run build`), or unrelated failures will look like the PR's. Compare every failure with the base before you blame the PR. Mention the Node version only when it could change a result, for example when the author names one and yours differs.
5. Write "not verified" for each claim you skipped, and give the reason. A skipped claim that the PR's correctness depends on counts as a question that needs an answer first, so recommend Comment and not Approve (§ Recommend a type). A skipped claim that does not affect correctness, such as what an external link says, is reported but does not rule out Approve.

## Severity

| Level          | Meaning                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **Blocking**   | Bug, accessibility violation (WCAG 2.1 AA), wrong API, breaking change without `!`, leaked secret |
| **Should fix** | Breaks a convention in `AGENTS.md`, missing test for new behaviour, misleading types/JSDoc        |
| **Suggestion** | A better approach exists but the current one works                                                |
| **Nit**        | Naming, wording, formatting. Prefix with `nit:`                                                   |

## Comments

Two or three sentences: the problem, then the suggestion. Collegial phrasing ("maybe:", "could we…?"). No headers or nested bullets inside a comment, no AI attribution, no emojis. Prefix with the severity where it helps.

## Recommend a type

The board moves a PR to "Needs revision" on a **Request changes** review and to "Approved" on an **Approve** review. A plain comment or a **Comment** review does not move it.

| Finding                                                                                        | Recommend                          |
| ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| Blocking (bug, accessibility violation, wrong API, breaking change without `!`, leaked secret) | Request changes                    |
| Should fix, Suggestion, or a question that needs an answer first, with nothing Blocking        | Comment                            |
| Only nits, each prefixed `nit:`                                                                | Approve, with the nits as comments |

Nits are optional and do not send the PR back. A claim you could not verify, and that the PR's correctness depends on, also rules out Approve, so recommend Comment. Reviews post under the user's account.

## Put the review in

1. Check for an existing pending review: `gh api repos/{owner}/{repo}/pulls/<n>/reviews --jq '.[] | select(.state=="PENDING") | .id'`. GitHub allows one per person. If one exists, ask before deleting it (`gh api -X DELETE repos/{owner}/{repo}/pulls/<n>/reviews/<id>`).
2. Check the head again with `gh pr view <n> --json headRefOid`. If it moved since you read the diff, read the new changes before posting.
3. With the harness's file-writing tool, write `/tmp/pr-<n>-review.json`, outside the repo:
   - `commit_id`: the head SHA.
   - No `event` field, unless the user asked you to submit (see § Submit it). Leaving it out keeps the review pending.
   - `body`: a short opener with what you ran and what you did not, plus the findings that have no line. Add the Node version when it could change a result. See § Check what the description claims. Never write "tested" for a partial run.
   - `comments`: one per finding that has a line, as `{path, line, side: "RIGHT", body}`. `line` is on the new side of the diff and must fall inside a hunk, otherwise move the finding into `body`.
4. Post it: `gh api -X POST repos/{owner}/{repo}/pulls/<n>/reviews --input /tmp/pr-<n>-review.json --jq '{id,state,html_url}'`, and check that `state` is `PENDING`, or `COMMENTED` or `CHANGES_REQUESTED` if you submitted.
5. `line` and `side` read `null` while the review is pending. That is normal.
6. The stored `body` does not survive submitting on GitHub. The "Finish your review" box opens empty, and a review submitted with the box empty goes out with no body (tested on #5835). The inline comments are kept.

## Submit it

Submit only when the user asks you to and names the type, Comment or Request changes. A submitted review is visible to everyone and notifies the author at once. Otherwise leave it pending, so the reviewer can read the inline comments on GitHub first. Never approve, except a Dependabot PR after an explicit go-ahead ([`DEPENDABOT_DUTY.md`](./DEPENDABOT_DUTY.md)). You cannot request changes on your own PR.

If nothing is posted yet when the user asks you to submit, post the review in one call: in step 3 above, add `"event": "COMMENT"` or `"event": "REQUEST_CHANGES"` to the JSON and keep the summary in `body`. The review is submitted at once and keeps its body.

If the review is already pending and the user then asks you to submit it, write the summary to `/tmp/pr-<n>-summary.md` with the harness's file-writing tool and pass it as the body, since the stored one does not survive:

```bash
gh api -X POST repos/{owner}/{repo}/pulls/<n>/reviews/<id>/events -f event=COMMENT -F body=@/tmp/pr-<n>-summary.md
```

Use `event=REQUEST_CHANGES` for Request changes.

## Reply

If the review is still pending, give the link to it, the recommended type in one line, and the count per severity. Remind the reviewer to submit it with the type they choose. Do not paste the inline comments into the chat, but do paste the `body` text in a fenced markdown block between `-----` lines, so it is clear where to start and stop copying, and tell the reviewer to paste it into the "Finish your review" box before submitting.

If you submitted it, give the link, the type you submitted and the count per severity.

## Claim the PR and the labels

- Nobody is requested as a reviewer automatically. When the user says they are reviewing a PR, add them as its reviewer (`gh pr edit <number> --add-reviewer <login>`, with their login from `gh api user --jq .login`). The reviewer list on the board then shows who has claimed the PR. The same command re-requests a reviewer who has already reviewed.
- An open Request changes outranks an approval: the PR keeps the `awaiting author` label, belongs in Needs revision, and cannot merge until the Request changes is dismissed or the same reviewer approves. The board moves the card to Approved on any approval, so the reviewer who approved moves it back to Needs revision by hand. This is the reviewer's move, not the author's agent's, so it is not in the table below.
- A workflow (`.github/workflows/pr-review-signals.yml`) assigns the author when a PR is opened, adds an `awaiting author` label when someone other than the author leaves a Comment or Request changes review, and removes it when new commits are pushed, the author re-requests review or a reviewer approves and no Request changes is still open. It skips bot and fork PRs. A reply in a review thread counts as a Comment review and a merge of `main` counts as a push, so fix the label by hand when it is wrong.

## The board

The board does not give a new PR a status, move it between draft and ready, or move it back after feedback, so the author's agent does:

| When                                                                                              | Move the card to              |
| ------------------------------------------------------------------------------------------------- | ----------------------------- |
| A PR is opened as a draft, or converted back to a draft                                           | **In Progress**               |
| A PR is opened as ready, a draft is marked ready, or review is re-requested after Request changes | **Review**                    |
| A push to an approved PR (while `main` dismisses stale approvals, even a nit fix)                 | **Review**, and re-request it |
| A push of fixes for a Request changes review (`reviewDecision` is `CHANGES_REQUESTED`)            | **Review**, and re-request it |

- Change the draft state with `gh pr ready` or `gh pr ready --undo` and move the card in the same step. A click on github.com leaves the card where it was. Name the move when you ask to open the PR, because the user's request for the action covers it.
- The board is project 1076. Get the Status option IDs with `gh project field-list 1076 --owner equinor --format json` and set the status with `gh project item-edit`. A new PR's card appears a few seconds after it opens, so tell the user if it has not appeared after a minute. Set the status, read it back, and set it again if it shows something else.
- This needs the `project` scope on the user's `gh` login (`gh auth refresh -s project`). If `gh project` fails for lack of it, ask the user to run that.
- A PR opened without an agent has no status. If its author opened it on github.com, they set the status themselves: **In Progress** for a draft, **Review** when it is ready. If it comes from someone outside the core team, whoever picks it up adds themselves as its reviewer and moves it to **Review**. Bot PRs (Dependabot, release) stay in No Status and follow their own routines.

## After every push

Go through this after every push, draft or ready change and review re-request on a PR you are the author's agent for. It is the same table as § The board, in the order to do it. Do not ask first: the user's request for the action covers the card.

In Claude Code, the hook `.claude/hooks/pr_flow_hook.js` hands you this section and the board table when you run `git push`, `gh pr create` or `gh pr ready`. On a push it also gives you the PR's approval state from before the command. It does the same with the review sections when you post a review. It only passes on the text and decides nothing. Other tools have no such hook, so follow this section without the reminder.

1. Before you push, read `gh pr view <n> --json reviewDecision,latestReviews`. A push dismisses approvals on `main`, so you need to know whether this PR is approved or has a Request changes open.
2. After the push, find the row in § The board and move the card to the status in it.
3. Re-request review from the reviewers who already reviewed when the row says so (`gh pr edit <n> --add-reviewer <login>`).
4. Read the card's status back, and set it again if it shows something else.

You do not need to remove the `awaiting author` label. The workflow in § Claim the PR and the labels removes it when new commits are pushed or review is re-requested. Fix it by hand only when it is wrong, for the cases that section names.
