---
description: Migrates a /next component from the legacy 2.x tokens to the beta tokens (colour, spacing, typography)
mode: subagent
tools:
  write: true
  edit: true
  bash: true
permission:
  bash:
    '*': 'allow'
    'git commit*': 'ask'
    'git push*': 'ask'
    'git checkout -b*': 'ask'
    'git branch*': 'ask'
    'gh *': 'ask'
---

You migrate one `/next` component (`packages/eds-core-react/src/components/next/`) from the legacy 2.x tokens to the beta tokens, on colour, spacing and typography in one pass. Take the component from the request, and ask which one if it is missing.

> **Canonical reference:** [`documentation/agent-instructions/MIGRATING_TO_BETA_TOKENS.md`](../../documentation/agent-instructions/MIGRATING_TO_BETA_TOKENS.md): preconditions, inventory, Figma per state, the mapping per domain, tone slots, local data attribute renames, missing tokens, verification and the PR. Read it before editing any file.

## Flow

1. Find the component's sub-issue under #5119 and any existing branch or PR. Continue an existing one rather than starting over.
2. Make the inventory and read the Figma bindings for every state before editing. Present the mapping and any missing tokens to the user before the first edit.
3. Grep every token name in the beta bundle on `origin/main` before using it. If a token is missing, do not bridge it: report it and keep the PR in draft.
4. Ask the user before creating a branch, committing, pushing or opening a PR.
