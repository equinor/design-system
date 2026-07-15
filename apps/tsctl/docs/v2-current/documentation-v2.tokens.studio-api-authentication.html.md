<!-- source: https://documentation-v2.tokens.studio/api/authentication.html -->

# API Authentication [​](#api-authentication)

Studio's API uses JWT bearer tokens for authentication. All API requests (except public endpoints) require a valid token.

## Authentication Methods [​](#authentication-methods)

### 1\. User JWT Tokens [​](#_1-user-jwt-tokens)

For interactive applications and user-facing integrations:

#### Register [​](#register)

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "user": {
    "email": "user@example.com",
    "password": "secure-password",
    "display_name": "Jane Doe"
  }
}
```

#### Login [​](#login)

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "user": {
    "email": "user@example.com",
    "password": "secure-password"
  }
}
```

Response includes the JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### Google OAuth [​](#google-oauth)

```
POST /api/v1/auth/google/login
Content-Type: application/json

{
  "credential": "<google-id-token>"
}
```

### 2\. Service Account Tokens [​](#_2-service-account-tokens)

For CI/CD pipelines and automated systems:

Create a service account token in **Integrations → Service Account Tokens**, then use it:

```
Authorization: Bearer <service-account-token>
```

### 3\. OAuth 2.0 (Device Code Flow) [​](#_3-oauth-2-0-device-code-flow)

For plugins and CLI tools that need user authorization:

```
POST /oauth/device/code
Content-Type: application/json

{
  "client_id": "<client-id>",
  "scope": "read_tokens write_tokens"
}
```

### 4\. OIDC Token Exchange [​](#_4-oidc-token-exchange)

For CI/CD systems using OIDC:

```
POST /api/v1/auth/oidc/exchange
Content-Type: application/json

{
  "token": "<oidc-token>",
  "provider": "github"
}
```

## Token Lifecycle [​](#token-lifecycle)

| Token Type | Expiration | Refresh |
| --- | --- | --- |
| User JWT | 24 hours | Use refresh token |
| Service Account | No expiration | Regenerate manually |
| OAuth Access Token | Configurable | Use refresh token |
| OIDC Exchange | Short-lived | Re-exchange |

## Using Tokens [​](#using-tokens)

Include the token in the `Authorization` header of every request:

```
GET /api/v1/projects
Authorization: Bearer <your-token>
Content-Type: application/json
```

## Getting Current User [​](#getting-current-user)

Verify your token and get the current user's details:

```
GET /api/v1/auth/me
Authorization: Bearer <your-token>
```

## Logout [​](#logout)

Revoke a JWT token:

```
DELETE /api/v1/auth/logout
Authorization: Bearer <your-token>
```

## Next Steps [​](#next-steps)

-   [API overview](./overview.html)
-   [Service account tokens](./../integrations/service-account-tokens.html)