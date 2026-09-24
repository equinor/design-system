# Writing PR descriptions and issues

This is the canonical playbook for writing the body of a pull request or a GitHub issue in this repository. The harness entry points (the `write-pr-description` and `write-issue` skills in Claude Code, the matching prompts in Copilot, and the matching agents in OpenCode) all defer to this file.

PR and issue descriptions written with AI assistance have tended to come out too long. Reviewers get tired of reading and stop, so the description no longer tells them what they need. The rules below are concrete so that they can be checked against a draft.

PR titles follow the conventional commits format in [`AGENTS.md`](../../AGENTS.md) § Conventional Commits.

## Length

| Body | Maximum |
| ---- | ------- |
| PR description | 300 words |
| Issue | 400 words |

Count the prose only. Tables, code blocks, reproduction steps and link lists do not count towards the limit.

A small PR needs one or two paragraphs. Add headings only when they help a reviewer assess a larger change. If a description cannot fit within the limit, the change is probably too large for one PR: split it, or move the background into the linked issue or an ADR and link to it.

## Writing restrictions

These apply to both PRs and issues.

- **State the claim directly.** Do not build contrasts for emphasis, such as "This isn't about X, it's about Y" or "not just X, but Y". Use a contrast only when two options are both on the table.
- **No em dashes.** Use a comma, parentheses, a colon or a new sentence.
- **Prefer verbs to nominalisations.** Write "The Menu closes when focus leaves it", not "Closure of the Menu upon focus loss is now implemented".
- **Write full sentences.** Lists are fine for steps, findings and comparisons, but prose should not be a string of fragments.
- **Explain effects instead of rating them.** "Improves maintainability", "cleaner" or "more robust" say nothing on their own. Say what now works differently, or what a maintainer no longer has to do.
- **No rhetorical questions, hype words or closing summaries.** The last paragraph should add information, not repeat the body.
- **Name the actors.** Say which component, prop, token or user group is affected. Repeat the noun where a pronoun would leave the subject unclear.
- **Use tables or lists for findings and comparisons**, not paragraphs of prose.
- **Use British English**, as in the rest of the documentation ("colour", "behaviour").
- **No tool attribution lines**, in line with § Git Workflow in `AGENTS.md`.

## PR descriptions

**Purpose:** let a reviewer understand what changed, why it changed, and how it was checked.

Before drafting, read the diff against the base branch (`git diff origin/main...HEAD`), the commit log (`git log origin/main..HEAD`) and the linked issue. Describe the final state of the change and scale the detail to how complex that change is.

1. Start with the behaviour that changed and the reason for changing it.
2. Link the issue the PR resolves (`Resolves #1234`) instead of restating it.
3. Mention testing that was performed, including relevant limitations, such as "Checked in Chrome only". Do not list checks that were not run.
4. Include migration steps or compatibility risks when the change introduces them.
5. If the repository adds a PR template, follow it and keep each section short.

Leave out:

- the chronology of the coding session and approaches that were abandoned
- file inventories and anything else the diff already shows
- claims about benefits without the mechanism behind them

**Example**

> **Title:** `fix: hide the DatePicker clear button when the field is empty`
>
> The DatePicker now shows its clear button only when a date is selected. Previously, the button stayed visible in an empty field even though there was nothing to clear.
>
> Added tests for the empty, selected and cleared states. The DatePicker tests pass.

## Issues

**Purpose:** explain a problem or proposed change clearly enough for someone to investigate it or decide what to do next.

An issue is often written from rough notes, screenshots or a conversation. Keep what was observed separate from what is assumed, and do not fill missing information with guesses. If something is unknown, say so, or ask the person you are writing for.

1. Search the existing issues first. If one already covers the problem, add to it instead of opening a new one.
2. Give the issue a title that names the affected component and the problem or requested change.
3. Start with what happens, who encounters it and what the consequence is, as far as that is known.
4. Describe the expected behaviour or the outcome you want.
5. For bugs, include reproduction steps when they are available.
6. Add technical context only when it helps someone investigate or implement the change.
7. Treat a suspected cause as a hypothesis. Keep a proposed solution open unless a decision has already been made, and say where it was made.
8. Add acceptance criteria when they describe an observable outcome. Do not repeat the description as a checklist.

When one of the templates in `.github/ISSUE_TEMPLATE/` applies (bug, feature request, generic), use its sections. Replace the placeholder text instead of keeping it, and drop a section that has nothing to say. The title rule in step 2 applies even when a template suggests another format, such as the user-story title in the generic template.

**Example**

> **Title:** DatePicker placeholder colour differs from TextField
>
> The DatePicker uses a different colour for its date-format placeholder than TextField uses for placeholder text. This makes the fields look inconsistent when they appear in the same form.
>
> The DatePicker placeholder should use the same text colour token as TextField. Check both components in light and dark mode.

## Before posting

- The prose is within the word limit.
- Every statement about testing matches something that was run.
- No sentence restates the diff or the linked issue.
- The last paragraph adds information instead of summarising.
- The draft passes § Writing restrictions.
- The user has seen the draft and approved it. Creating a PR or an issue publishes it, so ask first, as § Git Workflow in `AGENTS.md` requires.
