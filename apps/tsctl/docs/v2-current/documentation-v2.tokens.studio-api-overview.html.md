<!-- source: https://documentation-v2.tokens.studio/api/overview.html -->

# API Overview [​](#api-overview)

Studio provides a RESTful JSON API for managing all aspects of your design token workflow programmatically.

## Base URL [​](#base-url)

```
https://api.tokens.studio/api/v1
```

## Request Format [​](#request-format)

All requests use JSON:

```
Content-Type: application/json
Authorization: Bearer <your-token>
```

## Response Format [​](#response-format)

Responses are JSON. Successful responses return the resource or collection:

json

```
{
  "id": "uuid",
  "name": "My Project",
  "created_at": "2025-01-15T10:30:00Z"
}
```

Error responses include a message:

json

```
{
  "error": "Not found",
  "message": "Project with ID 'xyz' does not exist"
}
```

## HTTP Status Codes [​](#http-status-codes)

| Code | Meaning |
| --- | --- |
| `200` | Success |
| `201` | Created |
| `204` | No content (successful deletion) |
| `400` | Bad request (invalid parameters) |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not found |
| `422` | Unprocessable entity (validation error) |
| `429` | Rate limited |
| `500` | Internal server error |

## API Resources [​](#api-resources)

### Core Resources [​](#core-resources)

| Resource | Description | Docs |
| --- | --- | --- |
| **Workspaces** | Top-level containers | — |
| **Projects** | Token projects | — |
| **Tokens** | Design tokens | [Tokens API](./tokens.html) |
| **Token Sets** | Token collections | [Token Sets API](./token-sets.html) |
| **Branches** | Change sets / branches | [Branches API](./branches.html) |
| **Releases** | Token snapshots | [Releases API](./releases.html) |

### Figma Integration [​](#figma-integration)

| Resource | Description | Docs |
| --- | --- | --- |
| **Variable Collections** | Figma variable collections | [Variables API](./variables.html) |
| **Variables** | Figma variables | [Variables API](./variables.html) |
| **Styles** | Figma styles | — |

### Collaboration [​](#collaboration)

| Resource | Description | Docs |
| --- | --- | --- |
| **Branch Reviews** | Review and approval workflows | — |
| **Theme Groups** | Theme dimensions | — |
| **Theme Options** | Theme variants | — |

### Integrations [​](#integrations)

| Resource | Description | Docs |
| --- | --- | --- |
| **Webhooks** | Outbound event notifications | [Webhooks API](./webhooks.html) |
| **CI Integrations** | CI/CD provider connections | — |
| **CI Triggers** | Pipeline trigger rules | — |
| **Service Account Tokens** | API keys for automation | — |

### Advanced [​](#advanced)

| Resource | Description |
| --- | --- |
| **Magic Generator Schemas** | Generator templates |
| **Magic Generators** | Token generation instances |
| **Assets** | File uploads and management |

## Pagination [​](#pagination)

List endpoints return paginated results. Use standard pagination parameters:

```
GET /api/v1/projects?page=2&per_page=25
```

## Rate Limiting [​](#rate-limiting)

The API enforces rate limits. When exceeded, you'll receive a `429` response with a `Retry-After` header indicating when to retry.

## Next Steps [​](#next-steps)

-   [Authentication](./authentication.html)
-   [Tokens API](./tokens.html)
-   [Branches API](./branches.html)