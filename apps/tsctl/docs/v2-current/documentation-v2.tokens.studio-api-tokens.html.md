<!-- source: https://documentation-v2.tokens.studio/api/tokens.html -->

# Tokens API [​](#tokens-api)

Manage design tokens programmatically.

## List Tokens [​](#list-tokens)

```
GET /api/v1/projects/:project_id/tokens
```

Query parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `change_set_id` | UUID | Branch to read from (defaults to main) |

## Get a Token [​](#get-a-token)

```
GET /api/v1/projects/:project_id/tokens/:token_id
```

## Create a Token [​](#create-a-token)

```
POST /api/v1/projects/:project_id/tokens
Content-Type: application/json

{
  "token": {
    "name": "blue.500",
    "type": "color",
    "value": "#3B82F6",
    "description": "Primary blue",
    "token_set_id": "<token-set-uuid>"
  }
}
```

## Update a Token [​](#update-a-token)

```
PATCH /api/v1/projects/:project_id/tokens/:token_id
Content-Type: application/json

{
  "token": {
    "value": "#2563EB"
  }
}
```

## Delete a Token [​](#delete-a-token)

```
DELETE /api/v1/projects/:project_id/tokens/:token_id
```

## Batch Create [​](#batch-create)

Create multiple tokens in one request:

```
POST /api/v1/projects/:project_id/tokens/batch_create
Content-Type: application/json

{
  "tokens": [
    {
      "name": "blue.400",
      "type": "color",
      "value": "#60A5FA",
      "token_set_id": "<token-set-uuid>"
    },
    {
      "name": "blue.600",
      "type": "color",
      "value": "#2563EB",
      "token_set_id": "<token-set-uuid>"
    }
  ]
}
```

## Batch Update [​](#batch-update)

Update multiple tokens:

```
POST /api/v1/projects/:project_id/tokens/batch_update
Content-Type: application/json

{
  "tokens": [
    { "id": "<token-uuid>", "value": "#new-value" },
    { "id": "<token-uuid>", "description": "Updated description" }
  ]
}
```

## Batch Move [​](#batch-move)

Move tokens between token sets:

```
POST /api/v1/projects/:project_id/tokens/batch_move
Content-Type: application/json

{
  "token_ids": ["<uuid>", "<uuid>"],
  "target_token_set_id": "<token-set-uuid>"
}
```

## Batch Delete [​](#batch-delete)

Delete multiple tokens:

```
POST /api/v1/projects/:project_id/tokens/batch_delete
Content-Type: application/json

{
  "token_ids": ["<uuid>", "<uuid>"]
}
```

## Import Tokens [​](#import-tokens)

Import tokens from a file:

```
POST /api/v1/projects/:project_id/tokens/import
Content-Type: multipart/form-data

file: <token-file>
format: dtcg
```

## Get Resolved Tokens [​](#get-resolved-tokens)

Fetch all tokens with their resolved (computed) values:

```
GET /api/v1/projects/:project_id/resolved_tokens
```

Query parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `change_set_id` | UUID | Branch to resolve from |
| `theme_options[]` | Array | Active theme option IDs |

## Next Steps [​](#next-steps)

-   [Token Sets API](./token-sets.html)
-   [Branches API](./branches.html)
-   [Authentication](./authentication.html)