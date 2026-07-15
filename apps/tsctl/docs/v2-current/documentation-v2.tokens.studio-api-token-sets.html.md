<!-- source: https://documentation-v2.tokens.studio/api/token-sets.html -->

# Token Sets API [​](#token-sets-api)

Manage token set collections programmatically.

## List Token Sets [​](#list-token-sets)

```
GET /api/v1/projects/:project_id/token_sets
```

## Get a Token Set [​](#get-a-token-set)

```
GET /api/v1/projects/:project_id/token_sets/:token_set_id
```

## Create a Token Set [​](#create-a-token-set)

```
POST /api/v1/projects/:project_id/token_sets
Content-Type: application/json

{
  "token_set": {
    "name": "primitives/colors"
  }
}
```

## Update a Token Set [​](#update-a-token-set)

```
PATCH /api/v1/projects/:project_id/token_sets/:token_set_id
Content-Type: application/json

{
  "token_set": {
    "name": "primitives/updated-colors"
  }
}
```

## Delete a Token Set [​](#delete-a-token-set)

```
DELETE /api/v1/projects/:project_id/token_sets/:token_set_id
```

WARNING

Deleting a token set also deletes all tokens within it.

## List Linked Generators [​](#list-linked-generators)

```
GET /api/v1/projects/:project_id/token_sets/:token_set_id/generators
```

## Link a Generator [​](#link-a-generator)

```
POST /api/v1/projects/:project_id/token_sets/:token_set_id/generators/link
Content-Type: application/json

{
  "generator_id": "<generator-uuid>"
}
```

## Unlink a Generator [​](#unlink-a-generator)

```
DELETE /api/v1/projects/:project_id/token_sets/:token_set_id/generators/:generator_id
```

## Next Steps [​](#next-steps)

-   [Tokens API](./tokens.html)
-   [Branches API](./branches.html)