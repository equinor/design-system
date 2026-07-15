<!-- source: https://documentation-v2.tokens.studio/cli/authentication.html -->

# Authentication [​](#authentication)

The CLI supports interactive login for local development and service tokens for CI/CD environments.

## Logging In [​](#logging-in)

bash

```
studio auth login
```

This opens a browser window where you authenticate with your Studio account. The CLI also displays a QR code you can scan from a mobile device.

Once authenticated, your credentials are stored securely in your operating system's keychain (macOS Keychain, Linux Secret Service, or Windows Credential Manager). If the CLI detects 1Password CLI on your system, it offers to store credentials there instead for biometric unlock.

Tokens are refreshed automatically when they're close to expiring.

## Checking Auth Status [​](#checking-auth-status)

bash

```
studio auth status
```

Shows whether you're logged in, when your token expires, and which credential storage backend is being used.

## Logging Out [​](#logging-out)

bash

```
studio auth logout
```

Revokes your token and removes stored credentials.

## CI/CD Authentication [​](#ci-cd-authentication)

In automated environments, use one of these methods instead of interactive login:

### Service Tokens [​](#service-tokens)

Set the `STUDIO_SERVICE_TOKEN` environment variable with your service account token. You can create service tokens in Studio under **Integrations → Service Account Tokens**.

bash

```
export STUDIO_SERVICE_TOKEN=your-token-here
studio tokens pull my-tokens
```

For extra security, use the `--service-token-file` flag to read the token from a file rather than an environment variable:

bash

```
studio tokens pull my-tokens --service-token-file /run/secrets/studio-token
```

### OIDC (OpenID Connect) [​](#oidc-openid-connect)

The CLI automatically detects OIDC tokens from major CI providers. No configuration needed — if the environment variables are present, the CLI uses them:

| Provider | Detected Via |
| --- | --- |
| GitHub Actions | `ACTIONS_ID_TOKEN_REQUEST_TOKEN` |
| GitLab CI | `GITLAB_OIDC_TOKEN` |
| Bitbucket Pipelines | `BITBUCKET_STEP_OIDC_TOKEN` |
| Azure Pipelines | `SYSTEM_OIDCREQUESTURI` |

## Environment Variables [​](#environment-variables)

| Variable | Description |
| --- | --- |
| `STUDIO_SERVICE_TOKEN` | Service account token for CI authentication |
| `STUDIO_API_URL` | Override the API endpoint (default: `https://api-production.tokens.studio`) |
| `STUDIO_PROXY` | HTTP proxy URL |
| `STUDIO_CA_BUNDLE` | Path to a custom CA certificate bundle |

## Next Steps [​](#next-steps)

-   [Configuration](./configuration.html) — set up your project config after logging in
-   [Service Account Tokens](./../integrations/service-account-tokens.html) — creating and managing service tokens