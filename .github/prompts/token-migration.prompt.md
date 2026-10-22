---
mode: agent
description: Migrate a /next component from the legacy 2.x tokens to the beta tokens (colour, spacing, typography)
---

# Migrate a /next Component to the Beta Tokens

> **Canonical reference:** [`documentation/agent-instructions/MIGRATING_TO_BETA_TOKENS.md`](../../documentation/agent-instructions/MIGRATING_TO_BETA_TOKENS.md): preconditions, inventory, Figma per state, the mapping per domain, tone slots, local data attribute renames, missing tokens, verification and the PR.

Migrate the following `/next` component to the beta tokens, following the canonical doc above: ${input:component}

## Steps

1. Find the component's sub-issue under #5119 and any existing branch or PR. Continue an existing one rather than starting over.
2. Make the inventory and read the Figma bindings for every state before editing. Present the mapping and any missing tokens to the user before the first edit.
3. Grep every token name in the beta bundle on `origin/main` before using it. If a token is missing, do not bridge it: report it and keep the PR in draft.
4. Ask the user before creating a branch, committing, pushing or opening a PR.
