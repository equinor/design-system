<!-- source: https://documentation-v2.tokens.studio/api/branches.html -->

# Branches API [​](#branches-api)

Manage branches (change sets) programmatically.

## List Branches [​](#list-branches)

```
GET /api/v1/projects/:project_id/branches
```

## Get a Branch [​](#get-a-branch)

```
GET /api/v1/projects/:project_id/branches/:branch_id
```

## Create a Branch [​](#create-a-branch)

```
POST /api/v1/projects/:project_id/branches
Content-Type: application/json

{
  "branch": {
    "name": "update-color-palette"
  }
}
```

Creates a new branch from the current state of the main branch.

## Rename a Branch [​](#rename-a-branch)

```
PATCH /api/v1/projects/:project_id/branches/:branch_id
Content-Type: application/json

{
  "branch": {
    "name": "new-branch-name"
  }
}
```

## Merge a Branch [​](#merge-a-branch)

```
POST /api/v1/projects/:project_id/branches/:branch_id/merge
```

Merges the branch into its parent (main). Returns an error if there are unresolved conflicts.

## Merge Preview [​](#merge-preview)

```
GET /api/v1/projects/:project_id/branches/:branch_id/merge-preview
```

Returns a preview of what will change when the branch is merged.

## Conflict Details [​](#conflict-details)

```
GET /api/v1/projects/:project_id/branches/:branch_id/conflict-details
```

Returns details about any merge conflicts between the branch and its target.

## Archive a Branch [​](#archive-a-branch)

```
POST /api/v1/projects/:project_id/branches/:branch_id/archive
```

## Restore an Archived Branch [​](#restore-an-archived-branch)

```
POST /api/v1/projects/:project_id/branches/:branch_id/restore
```

## Branch Events [​](#branch-events)

```
GET /api/v1/projects/:project_id/branches/:branch_id/events
```

Returns all events (token changes) on this branch.

## Branch History [​](#branch-history)

```
GET /api/v1/projects/:project_id/branches/:branch_id/history
```

Returns the change history for the branch.

## Merge History [​](#merge-history)

```
GET /api/v1/projects/:project_id/branches/:branch_id/merge-history
```

Returns the merge history for the branch.

## Branch Review Endpoints [​](#branch-review-endpoints)

```
GET    /api/v1/projects/:id/branches/:id/review
POST   /api/v1/projects/:id/branches/:id/review
PATCH  /api/v1/projects/:id/branches/:id/review
GET    /api/v1/projects/:id/branches/:id/review/changes
GET    /api/v1/projects/:id/branches/:id/review/activity
POST   /api/v1/projects/:id/branches/:id/review/approve
POST   /api/v1/projects/:id/branches/:id/review/request-changes
GET    /api/v1/projects/:id/branches/:id/review/comments
POST   /api/v1/projects/:id/branches/:id/review/comments
```

## Next Steps [​](#next-steps)

-   [Tokens API](./tokens.html)
-   [Releases API](./releases.html)