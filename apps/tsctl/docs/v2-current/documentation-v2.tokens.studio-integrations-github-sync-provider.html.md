<!-- source: https://documentation-v2.tokens.studio/integrations/github-sync-provider.html -->

# GitHub Sync Provider [​](#github-sync-provider)

Early Access

The GitHub Sync Provider is currently in early access. If you'd like to try it out, please [reach out to us](https://tokens.studio/contact) to join the program.

Connect Tokens Studio to a GitHub repository so that releases automatically trigger a `repository_dispatch` event, keeping your token pipeline in sync.

## Prerequisites [​](#prerequisites)

-   A GitHub repository where you want to receive token release events
-   Permission to create Personal Access Tokens for the repository (or its owning organization)

## Create a Fine-Grained Personal Access Token [​](#create-a-fine-grained-personal-access-token)

Fine-grained PATs are the recommended approach — they limit access to specific repositories and permissions.

1.  Go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
    
2.  Fill in:
    
    -   **Token name** — anything identifying, e.g. `Tokens Studio – myorg/design-tokens`
    -   **Expiration** — 90 days is reasonable
    -   **Resource owner** — select the user or org that owns the repo. If the repo is `myorg/design-tokens`, select `myorg`. For org-owned repos, an org admin may need to approve the token after creation.
3.  Under **Repository access**, pick **Only select repositories** and add your target repository. Do not use "All repositories" unless the token needs access to everything.
    
4.  Under **Repository permissions** (scroll down):
    
    -   Set **Contents** to **Read and write**
    -   Leave everything else as default (No access)
    
    WARNING
    
    Make sure you specifically select **Contents: Read and write** — not "Administration" or "Actions". The `repository_dispatch` endpoint requires Contents write permission.
    
5.  Click **Generate token**
    
6.  Copy the token immediately (it starts with `github_pat_...`). GitHub will not show it again.
    
7.  If the repo belongs to an organization, check that the org hasn't blocked fine-grained tokens. Go to the org's **Personal access tokens** page — if your token says "Pending approval", ask the org admin to approve it.
    

## Verify the Token [​](#verify-the-token)

Before adding the token to Tokens Studio, confirm it works against your repository:

bash

```
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type":"tokens-release"}'
```

Replace `OWNER/REPO` with your repository (e.g. `myorg/design-tokens`) and `YOUR_TOKEN_HERE` with the token you just created.

| Response | Meaning |
| --- | --- |
| **204 No Content** | Token works — you're good to go |
| **404 Not Found** | Repo doesn't exist or the token can't see it. Double-check the repo name and the token's repository access list. |
| **403 Forbidden** | Token can see the repo but lacks **Contents: write** (fine-grained) or **repo** scope (classic). |
| **401 Unauthorized** | Token is invalid, expired, or malformed. |

## Add the Token to Studio [​](#add-the-token-to-studio)

1.  Go to **Integrations** in the left sidebar
2.  Select **GitHub** as the sync provider
3.  Enter your repository (e.g. `myorg/design-tokens`)
4.  Paste the Personal Access Token
5.  Save the integration

When you create a release in Studio, it will send a `repository_dispatch` event with the event type `tokens-release` to your repository. You can then use this event to trigger a [GitHub Actions workflow](./github-actions.html).

## Next Steps [​](#next-steps)

-   [GitHub Actions integration](./github-actions.html) — set up a workflow that responds to release events
-   [CI/CD Pipeline Triggers](./ci-cd-triggers.html) — configure when and how releases trigger your pipeline
-   [Service Account Tokens](./service-account-tokens.html) — alternative authentication for CI/CD