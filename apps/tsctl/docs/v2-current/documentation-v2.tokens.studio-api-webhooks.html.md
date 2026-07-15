<!-- source: https://documentation-v2.tokens.studio/api/webhooks.html -->

# Webhooks API [​](#webhooks-api)

Manage webhook endpoints and deliveries programmatically.

## List Webhooks [​](#list-webhooks)

```
GET /api/v1/projects/:project_id/webhooks
```

## Get a Webhook [​](#get-a-webhook)

```
GET /api/v1/projects/:project_id/webhooks/:webhook_id
```

## Create a Webhook [​](#create-a-webhook)

```
POST /api/v1/projects/:project_id/webhooks
Content-Type: application/json

{
  "webhook": {
    "url": "https://your-server.com/webhooks/studio"
  }
}
```

Returns the webhook with its signing secret.

## Update a Webhook [​](#update-a-webhook)

```
PATCH /api/v1/projects/:project_id/webhooks/:webhook_id
Content-Type: application/json

{
  "webhook": {
    "url": "https://new-url.com/webhooks/studio"
  }
}
```

## Delete a Webhook [​](#delete-a-webhook)

```
DELETE /api/v1/projects/:project_id/webhooks/:webhook_id
```

## Activate / Deactivate [​](#activate-deactivate)

```
POST /api/v1/projects/:project_id/webhooks/:webhook_id/activate
POST /api/v1/projects/:project_id/webhooks/:webhook_id/deactivate
```

## Ping (Test) [​](#ping-test)

Send a test payload to the webhook endpoint:

```
POST /api/v1/projects/:project_id/webhooks/:webhook_id/ping
```

## Regenerate Secret [​](#regenerate-secret)

```
POST /api/v1/projects/:project_id/webhooks/:webhook_id/regenerate_secret
```

Generates a new signing secret. The old secret immediately becomes invalid.

## Deliveries [​](#deliveries)

### List Deliveries [​](#list-deliveries)

```
GET /api/v1/projects/:project_id/webhooks/:webhook_id/deliveries
```

### Get Delivery Details [​](#get-delivery-details)

```
GET /api/v1/projects/:project_id/webhooks/:webhook_id/deliveries/:delivery_id
```

### Retry a Failed Delivery [​](#retry-a-failed-delivery)

```
POST /api/v1/projects/:project_id/webhooks/:webhook_id/deliveries/:delivery_id/retry
```

### Cancel a Pending Delivery [​](#cancel-a-pending-delivery)

```
POST /api/v1/projects/:project_id/webhooks/:webhook_id/deliveries/:delivery_id/cancel
```

## Webhook Event Catalog [​](#webhook-event-catalog)

Get the list of all available webhook events:

```
GET /api/v1/webhook_events
```

This public endpoint (no authentication required) returns the catalog of events your webhook can subscribe to.

## Next Steps [​](#next-steps)

-   [Webhooks guide](./../integrations/webhooks.html)
-   [CI/CD triggers](./../integrations/ci-cd-triggers.html)
-   [API overview](./overview.html)