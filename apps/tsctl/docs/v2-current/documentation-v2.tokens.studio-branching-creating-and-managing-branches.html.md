<!-- source: https://documentation-v2.tokens.studio/branching/creating-and-managing-branches.html -->

# Creating and Managing Branches [​](#creating-and-managing-branches)

## Creating a Branch [​](#creating-a-branch)

1.  Go to the **Branches** tab in your project
    
2.  Click **Create Branch**
    
    ![Branches overview](/images/branching/branches-overview-light.png)![Branches overview](/images/branching/branches-overview-dark.png)
    
3.  Enter a descriptive name (e.g., `update-color-palette`, `add-spacing-tokens`)
    
4.  Click **Create Branch** to confirm
    
    ![Create branch page](/images/branching/create-branch-page-light.png)![Create branch page](/images/branching/create-branch-page-dark.png)
    
5.  The branch is created from the current state of main
    
6.  Switch to the new branch using the branch selector
    

TIP

Use descriptive branch names that indicate what you're changing. This helps your team understand the purpose of each branch at a glance.

## Switching Branches [​](#switching-branches)

Use the branch selector in the project toolbar to switch between branches. When you switch:

![Branch selector dropdown](/images/branching/branch-selector-dropdown-light.png)![Branch selector dropdown](/images/branching/branch-selector-dropdown-dark.png)

-   The token list updates to show the selected branch's state
-   Any edits you make apply to the selected branch
-   The UI indicates which branch you're currently on

## Viewing Branch Changes [​](#viewing-branch-changes)

To see what's changed on a branch compared to main:

1.  Open the branch
    
2.  Click **View Changes** or go to the branch's event history
    
    ![Branch detail](/images/branching/branch-detail-light.png)![Branch detail](/images/branching/branch-detail-dark.png)
    
3.  You'll see a list of all token changes: creations, updates, and deletions
    
4.  Each change shows the before/after values
    

## Renaming a Branch [​](#renaming-a-branch)

1.  Open the branch settings
2.  Click **Rename**
3.  Enter the new name
4.  Click **Save**

## Archiving a Branch [​](#archiving-a-branch)

When you're done with a branch (after merging or if you abandon it):

1.  Open the branch
2.  Click **Archive**
3.  The branch moves to the archived list

Archived branches preserve their event history for auditing. You can restore an archived branch if needed.

## Restoring an Archived Branch [​](#restoring-an-archived-branch)

1.  Go to **Branches → Archived**
2.  Find the branch you want to restore
3.  Click **Restore**
4.  The branch is moved back to active branches

## Next Steps [​](#next-steps)

-   [Merging changes](./merging-changes.html)
-   [Resolving conflicts](./resolving-conflicts.html)
-   [Branch reviews](./branch-reviews.html)