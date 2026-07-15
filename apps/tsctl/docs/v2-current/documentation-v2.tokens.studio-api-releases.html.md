<!-- source: https://documentation-v2.tokens.studio/api/releases.html -->

# Releases API [​](#releases-api)

Manage token releases programmatically.

## List Releases [​](#list-releases)

```
GET /api/v1/projects/:project_id/releases
```

Returns all releases for the project in reverse chronological order.

## Get a Release [​](#get-a-release)

```
GET /api/v1/projects/:project_id/releases/:release_id
```

Returns the release details including the full set of resolved tokens at the time of release.

## Create a Release [​](#create-a-release)

```
POST /api/v1/projects/:project_id/releases
Content-Type: application/json

{
  "release": {
    "version": "1.2.0",
    "change_set_id": "<branch-uuid>"
  }
}
```

Creates a new release from the specified branch. This:

1.  Snapshots all resolved tokens on the branch
2.  Records the release with the version number
3.  Triggers any configured webhooks and CI/CD triggers

## Response [​](#response)

json

```
{
  "id": "<uuid>",
  "version": "1.2.0",
  "project_id": "<uuid>",
  "change_set_id": "<uuid>",
  "released_by": {
    "id": "<uuid>",
    "display_name": "Jane Doe",
    "email": "jane@example.com"
  },
  "released_at": "2025-01-15T10:30:00Z",
  "created_at": "2025-01-15T10:30:00Z"
}
```

## Next Steps [​](#next-steps)

-   [Tokens API](./tokens.html)
-   [Webhooks API](./webhooks.html)
-   [Branches API](./branches.html)