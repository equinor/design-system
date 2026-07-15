<!-- source: https://documentation-v2.tokens.studio/branching/merging-changes.html -->

# Merging Changes [​](#merging-changes)

When your branch changes are ready, merge them into the main branch to make them live.

## Before You Merge [​](#before-you-merge)

Before merging, it's good practice to:

1.  **Review the changes** — Use the merge preview to see exactly what will change
    
    ![Branch detail with merge options](/images/branching/branch-detail-light.png)![Branch detail with merge options](/images/branching/branch-detail-dark.png)
    
2.  **Check for conflicts** — Studio will detect if the same tokens were modified on both branches
    
3.  **Get approval** — If your project requires branch reviews, make sure the review is approved
    

## Merge Preview [​](#merge-preview)

The merge preview shows you what will happen when you merge:

1.  Open your branch
2.  Click **Merge Preview**
3.  You'll see:
    -   **Created** — New tokens that will be added to main
    -   **Updated** — Tokens that will be modified on main
    -   **Deleted** — Tokens that will be removed from main
    -   **Conflicts** — Tokens that were changed on both your branch and main

Review the preview carefully before proceeding.

## Performing the Merge [​](#performing-the-merge)

If there are no conflicts:

1.  Click **Merge**
2.  Studio applies all branch events to the main branch
3.  The branch is automatically archived

If there are conflicts, you'll need to resolve them first. See [Resolving Conflicts](./resolving-conflicts.html).

## Merge History [​](#merge-history)

After a merge, you can view the merge history:

1.  Go to the merged branch (in the archived list)
2.  Click **Merge History**
3.  See the full record of what was merged, when, and by whom

## What Happens During a Merge [​](#what-happens-during-a-merge)

Under the hood, Studio:

1.  Identifies all events on the branch that were created after the branch point
2.  Checks for conflicts with events on the target branch
3.  If no conflicts (or all resolved), replays the branch events on the target
4.  Archives the source branch
5.  Triggers any configured webhooks or CI pipelines (if merging to main)

## Next Steps [​](#next-steps)

-   [Resolving conflicts](./resolving-conflicts.html)
-   [Branch reviews](./branch-reviews.html)
-   [Creating a release](./../releases/creating-a-release.html)