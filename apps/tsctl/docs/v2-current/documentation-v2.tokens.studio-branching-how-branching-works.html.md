<!-- source: https://documentation-v2.tokens.studio/branching/how-branching-works.html -->

# How Branching Works [​](#how-branching-works)

Studio uses a Git-like branching model to let you work on token changes in isolation before applying them to your main set of tokens.

## Why Branches? [​](#why-branches)

Without branches, every token change immediately affects your entire team. Branches let you:

-   **Experiment safely** — Try out changes without affecting production tokens
-   **Review before merging** — Get team approval before changes go live
-   **Work in parallel** — Multiple team members can work on different changes simultaneously
-   **Track history** — See exactly what changed on each branch

![Branches tab showing active branches](/images/branching/branches-overview-light.png)![Branches tab showing active branches](/images/branching/branches-overview-dark.png)

## The Main Branch [​](#the-main-branch)

Every project has a **main** branch. This is the source of truth — the current, approved state of your tokens. All other branches are based on main.

You can't delete the main branch. It always exists and represents the canonical state of your project.

## How It Works Under the Hood [​](#how-it-works-under-the-hood)

Studio uses event sourcing for branching. Here's what that means:

1.  When you create a branch, Studio records the point in time (the specific event) where the branch was created
2.  Changes on the branch create new events that are scoped to that branch
3.  Other branches don't see these events
4.  When you merge, the branch's events are applied to the target branch

This is similar to Git, but instead of file diffs, Studio tracks token-level changes (creation, updates, deletions).

## Branch Lifecycle [​](#branch-lifecycle)

![Branch lifecycle: create from main, make changes, review, then merge back](/images/diagrams/branch-lifecycle-light.svg)![Branch lifecycle: create from main, make changes, review, then merge back](/images/diagrams/branch-lifecycle-dark.svg)

1.  **Create** — Branch from main (or another branch)
2.  **Edit** — Make token changes on the branch
3.  **Review** — Create a branch review for team approval
4.  **Merge** — Apply the branch's changes to main
5.  **Archive** — The branch is archived after merge (or manually)

## What's Branch-Aware? [​](#what-s-branch-aware)

Everything token-related in Studio is branch-aware:

-   Tokens and token sets
-   Theme groups and options
-   Magic Generators and their outputs
-   Variable collections and variables

When you switch branches, the entire token view updates to show that branch's state.

## Next Steps [​](#next-steps)

-   [Creating and managing branches](./creating-and-managing-branches.html)
-   [Merging changes](./merging-changes.html)
-   [Resolving conflicts](./resolving-conflicts.html)
-   [Branch reviews](./branch-reviews.html)