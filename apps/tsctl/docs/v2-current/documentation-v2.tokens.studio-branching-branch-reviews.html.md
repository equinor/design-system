<!-- source: https://documentation-v2.tokens.studio/branching/branch-reviews.html -->

# Branch Reviews [​](#branch-reviews)

Branch reviews let your team review and approve token changes before they're merged, similar to pull requests in code repositories.

## Creating a Review [​](#creating-a-review)

1.  Open the branch you want to review
    
    ![Branch detail with review options](/images/branching/branch-detail-light.png)![Branch detail with review options](/images/branching/branch-detail-dark.png)
    
2.  Click **Create Review**
    
3.  Add an optional description of the changes
    
4.  The review is created in **Draft** status
    

## Review Status [​](#review-status)

Reviews go through these states:

| Status | Description |
| --- | --- |
| **Draft** | Review created but not yet open for feedback |
| **Open** | Review is open; team members can comment and approve |
| **Merged** | Changes have been merged |
| **Closed** | Review was closed without merging |

## Reviewing Changes [​](#reviewing-changes)

As a reviewer:

1.  Open the review
2.  Click **View Changes** to see the full diff:
    -   Created tokens (with their values)
    -   Updated tokens (with before/after comparison)
    -   Deleted tokens
3.  Leave comments on specific changes or on the review as a whole
4.  Choose an action:
    -   **Approve** — You approve the changes
    -   **Request Changes** — Changes are needed before merging

## Comments [​](#comments)

You can leave comments at any point during the review:

1.  Click **Add Comment** on the review
2.  Write your feedback
3.  Comments are visible to all project members

Comments persist even after the branch is merged or deleted, providing a permanent record of the discussion.

## Approval Requirements [​](#approval-requirements)

Project settings can require approvals before merging:

-   **No approval required** — Anyone with merge permissions can merge
-   **One approval required** — At least one team member must approve
-   **Multiple approvals** — A configurable number of approvals needed

Configure approval requirements in **Project Settings → Branch Settings**.

## Merging After Review [​](#merging-after-review)

Once the review is approved:

1.  Click **Merge** on the review page
2.  Studio merges the branch into main
3.  The review status updates to **Merged**
4.  The branch is archived

## Activity Log [​](#activity-log)

Each review has an activity log showing:

-   When the review was created, opened, and closed
-   All comments and their timestamps
-   Approval and change-request actions
-   The merge event (if merged)

## Next Steps [​](#next-steps)

-   [Merging changes](./merging-changes.html)
-   [Resolving conflicts](./resolving-conflicts.html)
-   [Roles and permissions](./../team/roles-and-permissions.html)