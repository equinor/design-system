<!-- source: https://documentation-v2.tokens.studio/integrations/service-account-tokens.html -->

# Service Account Tokens [​](#service-account-tokens)

Service account tokens provide API access for automated systems and CI/CD pipelines that need to interact with Studio programmatically.

## What Are Service Account Tokens? [​](#what-are-service-account-tokens)

Service account tokens are long-lived API keys scoped to a specific project. They're designed for:

-   CI/CD pipelines that fetch tokens during builds
-   Scripts that automate token management
-   External tools that integrate with Studio's API

## Creating a Token [​](#creating-a-token)

1.  Go to **Integrations** in the left sidebar
2.  Find the **Service Account Tokens** section
3.  Click **\+ Add Token**
4.  Fill in the token details:
    -   **Token Name** — A descriptive name to identify this token (e.g., "Production API Token")
    -   **Description** — What this token is used for (optional)
    -   **Token Owner** — The user this token acts on behalf of. The token's permissions are limited to what the selected user can do.
    -   **Expiration** — How long until the token expires. Options: 7 days, 30 days (default), 90 days, 180 days, 1 year, or Never.
    -   **Permissions** — The maximum permissions for this token: **Read** (checked by default) and/or **Write**. Limited by what the selected user can do.
5.  Click **Generate Token**
6.  **Copy the token immediately** — it won't be shown again

WARNING

Store the token securely. Use your CI provider's secret management (e.g., GitHub Secrets, GitLab CI Variables).

## Using a Token [​](#using-a-token)

Include the token in your API requests:

```
Authorization: Bearer <service-account-token>
```

Or use it during OIDC token exchange for CI/CD authentication:

```
POST /api/v1/auth/service-token/validate
Authorization: Bearer <service-account-token>
```

## Managing Tokens [​](#managing-tokens)

| Action | Description |
| --- | --- |
| **Regenerate** | Create a new token value (invalidates the old one) |
| **Revoke** | Permanently disable the token |

## Security Best Practices [​](#security-best-practices)

-   **One token per integration.** Create separate tokens for each CI pipeline or service.
-   **Rotate regularly.** Regenerate tokens periodically to limit exposure.
-   **Use OIDC when possible.** OIDC tokens are short-lived and don't require secret management.
-   **Monitor usage.** Check the token's last-used timestamp to detect unused tokens.
-   **Revoke unused tokens.** If a token is no longer needed, revoke it immediately.

## Next Steps [​](#next-steps)

-   [CI/CD triggers](./ci-cd-triggers.html)
-   [Webhooks](./webhooks.html)