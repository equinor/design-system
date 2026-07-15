<!-- source: https://documentation-v2.tokens.studio/integrations/ci-cd-triggers.html -->

# CI/CD Pipeline Triggers [​](#ci-cd-pipeline-triggers)

Studio can trigger your CI/CD pipelines automatically when events happen in your project, and your CI/CD pipelines can authenticate with Studio to fetch tokens during builds. Both are configured from the **Integrations** page.

INFO

CI/CD triggers and integrations are available for both token-based and variable-based projects. See [Project Types](./../getting-started/project-types.html) for details on the differences between project types.

## CI Triggers (Outbound) [​](#ci-triggers-outbound)

CI Triggers automatically start your CI/CD pipeline when events happen in Studio (e.g. a release is created). Studio calls your provider API to kick off the pipeline run.

### Supported Providers [​](#supported-providers)

| Provider | Status |
| --- | --- |
| **GitHub** | Supported |
| **GitLab** | Supported |
| **Azure DevOps** | Supported |
| **Bitbucket** | Supported |
| **CircleCI** | Supported |

### Creating a Trigger [​](#creating-a-trigger)

1.  Go to **Integrations** in the left sidebar
2.  Find the **CI Triggers (Outbound)** section
3.  Click **\+ Add Trigger**
4.  Select your **CI Provider**
5.  Fill in the connection details (fields vary by provider). For GitHub:
    -   **Name** — A name for this trigger (e.g., "Production Deploy")
    -   **Owner (user or org)** — Your GitHub username or organization
    -   **Repository** — The repository name
    -   **Event Type** — The `repository_dispatch` event type sent to GitHub (default: `tokens-release`). Your workflow listens for this value.
6.  Select **Trigger Events** — Choose which Studio events should trigger the pipeline (e.g., `release.created`)
7.  Enter your **Personal Access Token (PAT)** — A token from your CI provider used to authenticate pipeline triggers. Your token is encrypted with AES-256 and stored securely.
8.  Click **Create Trigger**

### Managing Triggers [​](#managing-triggers)

Each trigger has controls to:

| Action | Description |
| --- | --- |
| **Test** | Send a test event to verify the pipeline runs |
| **Enable/Disable** | Toggle the trigger on or off |

## CI Integration (Inbound) [​](#ci-integration-inbound)

CI Integrations let your CI pipeline authenticate with Studio using OIDC. Your pipeline can then securely fetch resolved tokens during builds without storing long-lived secrets.

### Supported Providers [​](#supported-providers-1)

| Provider | Status |
| --- | --- |
| **GitHub Actions** | Supported |
| **GitLab CI** | Supported |
| **Azure Pipelines** | Supported |
| **Bitbucket Pipelines** | Supported |

### Creating an Integration [​](#creating-an-integration)

1.  Go to **Integrations** in the left sidebar
2.  Find the **CI Integration (Inbound)** section
3.  Click **\+ Add Integration**
4.  Select your **CI Provider**
5.  Fill in the connection details (fields vary by provider). For GitHub Actions:
    -   **Name** — A name for this integration (e.g., "My CI Integration")
    -   **GitHub Instance URL** — Leave empty for GitHub.com (SaaS). For GitHub Enterprise Server, enter the instance URL.
    -   **Repository** — Your GitHub repository in `owner/repo` format. The subject pattern controls which workflows can authenticate.
    -   **Subject Pattern** — Controls which CI workflows can authenticate. Use `*` as wildcard (e.g., `repo:owner/repo:*`).
    -   **Permissions** — **Read** (checked by default) and/or **Write**
6.  Click **Create Integration**

### How OIDC Works [​](#how-oidc-works)

OIDC (OpenID Connect) is the authentication method used by CI Integrations. It doesn't require storing any API keys:

1.  Your CI provider issues a short-lived OIDC token during each workflow run
2.  The workflow presents this token to Studio
3.  Studio validates the token against the integration's subject pattern
4.  If valid, Studio issues a scoped access token for the pipeline to use

No long-lived secrets to manage or rotate.

## Next Steps [​](#next-steps)

-   [Webhooks](./webhooks.html)
-   [Service account tokens](./service-account-tokens.html)
-   [GitHub Actions guide](./github-actions.html)
-   [GitLab CI guide](./gitlab-ci.html)