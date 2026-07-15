<!-- source: https://documentation-v2.tokens.studio/api/variables.html -->

# Variables API [​](#variables-api)

Manage Figma variable collections and variables programmatically.

## Variable Collections [​](#variable-collections)

### List Collections [​](#list-collections)

```
GET /api/v1/projects/:project_id/variable_collections
```

### Create a Collection [​](#create-a-collection)

```
POST /api/v1/projects/:project_id/variable_collections
Content-Type: application/json

{
  "variable_collection": {
    "name": "Colors",
    "figma_collection_id": "VariableCollectionId:123:456"
  }
}
```

### Update a Collection [​](#update-a-collection)

```
PATCH /api/v1/projects/:project_id/variable_collections/:id
```

### Delete a Collection [​](#delete-a-collection)

```
DELETE /api/v1/projects/:project_id/variable_collections/:id
```

### List Collection Modes [​](#list-collection-modes)

```
GET /api/v1/projects/:project_id/variable_collections/:id/modes
```

### Create a Mode [​](#create-a-mode)

```
POST /api/v1/projects/:project_id/variable_collections/:id/modes
Content-Type: application/json

{
  "mode": {
    "name": "Dark"
  }
}
```

## Variables [​](#variables)

### List Variables [​](#list-variables)

```
GET /api/v1/projects/:project_id/variables
```

### Create a Variable [​](#create-a-variable)

```
POST /api/v1/projects/:project_id/variables
Content-Type: application/json

{
  "variable": {
    "name": "primary-color",
    "variable_type": "COLOR",
    "collection_id": "<collection-uuid>",
    "values_by_mode": {
      "default": { "r": 59, "g": 130, "b": 246, "a": 1 },
      "dark": { "r": 96, "g": 165, "b": 250, "a": 1 }
    }
  }
}
```

### Update a Variable [​](#update-a-variable)

```
PATCH /api/v1/projects/:project_id/variables/:id
```

### Delete a Variable [​](#delete-a-variable)

```
DELETE /api/v1/projects/:project_id/variables/:id
```

### Bulk Create Variables [​](#bulk-create-variables)

```
POST /api/v1/projects/:project_id/variables/bulk
Content-Type: application/json

{
  "variables": [...]
}
```

## Variable Types [​](#variable-types)

| Type | Description | Value Format |
| --- | --- | --- |
| `COLOR` | RGBA color | `{ "r": 0-255, "g": 0-255, "b": 0-255, "a": 0-1 }` |
| `FLOAT` | Numeric value | `16.0` |
| `STRING` | Text value | `"Inter"` |
| `BOOLEAN` | True/false | `true` or `false` |

## Figma Sync [​](#figma-sync)

### Trigger Sync [​](#trigger-sync)

```
POST /api/v1/projects/:project_id/figma_sync
```

### Sync Status [​](#sync-status)

```
GET /api/v1/projects/:project_id/figma_sync/status
```

### Sync Diff [​](#sync-diff)

```
GET /api/v1/projects/:project_id/figma_sync/diff
```

### Sync Logs [​](#sync-logs)

```
GET /api/v1/projects/:project_id/figma_sync/logs
```

### Confirm Sync [​](#confirm-sync)

```
POST /api/v1/projects/:project_id/figma_sync/confirm
```

### Resolve Sync Conflicts [​](#resolve-sync-conflicts)

```
POST /api/v1/projects/:project_id/figma_sync/resolve
```

## Next Steps [​](#next-steps)

-   [Tokens API](./tokens.html)
-   [Syncing variables](./../figma/syncing-variables.html)