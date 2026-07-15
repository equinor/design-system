<!-- source: https://documentation-v2.tokens.studio/integrations/webhooks.html -->

# Webhooks [​](#webhooks)

Webhooks let Studio notify your services when events happen in your project, such as when tokens are released or change sets are merged.

INFO

Webhooks are available for both token-based and variable-based projects. See [Project Types](./../getting-started/project-types.html) for details on the differences between project types.

## Setting Up a Webhook [​](#setting-up-a-webhook)

1.  Go to **Integrations** in the left sidebar
2.  Find the **Webhooks** section
3.  Click **\+ Add Webhook**
4.  Fill in the required fields:
    -   **Name** — A name to identify this webhook (e.g., "Production Token Sync")
    -   **Endpoint URL** — The URL that will receive webhook events (must be a valid HTTPS URL)
    -   **Description** — What this webhook is used for (optional)
    -   **Events** — Select which events should trigger this webhook (searchable checklist)
5.  Click **Create Webhook**

WARNING

Studio generates a signing secret for your webhook. Store it securely — you'll need it to verify incoming requests.

## Webhook Events [​](#webhook-events)

Studio groups events into categories. You can select individual events or entire categories.

### Releases (3) [​](#releases-3)

| Event | Description |
| --- | --- |
| `release.created` | A new release was published |
| `release.deleted` | A release was deleted |
| `release.updated` | A release was updated (e.g., notes changed) |

### Change Sets (4) [​](#change-sets-4)

| Event | Description |
| --- | --- |
| `change_set.created` | A new change set was created |
| `change_set.published` | A change set was published for review |
| `change_set.merged` | A change set was merged into main |
| `change_set.rejected` | A change set was rejected |

## Payload Format [​](#payload-format)

Webhooks deliver a JSON payload via HTTP POST. Here's an example of a `release.created` event:

json

```
{
  "event": "release.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "project": {
    "id": "uuid",
    "name": "Design System"
  },
  "data": {
    "release_id": "uuid",
    "version": "1.2.0",
    "released_by": "user@example.com"
  }
}
```

## Signature Verification [​](#signature-verification)

Every webhook request includes an HMAC-SHA256 signature in the headers. Verify it using your webhook's signing secret to ensure the request came from Studio:

```
X-Webhook-Signature: sha256=<hash>
```

## Delivery Management [​](#delivery-management)

Studio tracks every webhook delivery:

1.  Go to **Webhooks → Deliveries**
2.  See the status of each delivery (success, failed, pending)
3.  View the request and response details
4.  **Retry** failed deliveries manually
5.  **Cancel** pending deliveries

## Circuit Breaker [​](#circuit-breaker)

If a webhook endpoint consistently fails, Studio automatically disables it (circuit breaker pattern). This prevents flooding a broken endpoint with requests.

To re-enable:

1.  Go to the webhook settings
2.  Fix the underlying issue with your endpoint
3.  Click **Activate** to re-enable the webhook
4.  Send a **Ping** to test the connection

## Webhook Management [​](#webhook-management)

| Action | Description |
| --- | --- |
| **Activate** | Enable a deactivated webhook |
| **Deactivate** | Temporarily disable without deleting |
| **Ping** | Send a test payload to verify the endpoint |
| **Regenerate Secret** | Create a new signing secret (invalidates the old one) |

## Next Steps [​](#next-steps)

-   [CI/CD triggers](./ci-cd-triggers.html)
-   [Service account tokens](./service-account-tokens.html)