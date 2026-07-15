<!-- source: https://documentation-v2.tokens.studio/integrations/github-actions.html -->

# GitHub Actions Integration [​](#github-actions-integration)

Set up a CI/CD pipeline to sync design tokens from Tokens Studio to a GitHub repository using a release trigger.

## Prerequisites [​](#prerequisites)

-   A Tokens Studio project with tokens ready to export
-   A GitHub account with permission to create repositories and Personal Access Tokens

## Step 1: Create Your GitHub Repository [​](#step-1-create-your-github-repository)

If you already have a repository for your design tokens, skip to [Step 2](#step-2-create-the-github-actions-workflow).

1.  Go to [github.com/new](https://github.com/new)
2.  Fill in:
    -   **Repository name** — e.g., `design-tokens` or `my-design-system`
    -   **Visibility** — Public or Private
    -   **Initialize** — Check "Add a README file"
3.  Click **Create repository**

## Step 2: Create the GitHub Actions Workflow [​](#step-2-create-the-github-actions-workflow)

In your repository:

1.  Click **Add file** → **Create new file**
2.  Name it `.github/workflows/sync-tokens.yml`
3.  Paste the following workflow:

yaml

```
name: Sync Design Tokens

on:
  repository_dispatch:
    types: [tokens-release]
  workflow_dispatch:

permissions:
  id-token: write   # Required for OIDC authentication
  contents: write   # Required to commit token files

jobs:
  sync-tokens:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Tokens Studio CLI
        run: npm install -g @tokens-studio/studio-cli

      - name: Create config file
        run: |
          cat > .studio.json << 'EOF'
          {
            "$schema": "https://tokens.studio/schema/cli",
            "dependencies": {
              "core": {
                "project": "${{ vars.TOKENS_PROJECT }}",
                "ref": { "type": "branch", "name": "main" },
                "output": "tokens"
              }
            }
          }
          EOF

      - name: Pull tokens from Studio
        run: studio tokens pull --ci
        # The --ci flag uses OIDC authentication automatically.
        # GitHub provides ACTIONS_ID_TOKEN_REQUEST_TOKEN and
        # ACTIONS_ID_TOKEN_REQUEST_URL when id-token: write is set.

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          git add tokens/ .studio.json

          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "chore: sync design tokens from Studio"
            git push
          fi
```

4.  Click **Commit changes**

## Step 3: Add Repository Variables [​](#step-3-add-repository-variables)

The workflow references `vars.TOKENS_PROJECT` to know which Studio project to pull from.

1.  In your repository, go to **Settings → Secrets and variables → Actions**
2.  Click the **Variables** tab
3.  Click **New repository variable**
4.  Add:
    -   **Name:** `TOKENS_PROJECT`
    -   **Value:** Your project ID from Tokens Studio (find it in the URL when viewing your project, e.g., `abc123-def456-...`)
5.  Click **Add variable**

## Step 4: Create a GitHub Personal Access Token [​](#step-4-create-a-github-personal-access-token)

Studio needs a token to send the `repository_dispatch` event that triggers your workflow.

1.  Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2.  Click **Generate new token → Fine-grained token** (recommended)
3.  Fill in:
    -   **Token name:** `Tokens Studio Trigger`
    -   **Expiration:** Choose based on your needs
    -   **Repository access:** Select "Only select repositories" → choose your token repository
    -   **Permissions:** Set **Contents** to **Read and write**
4.  Click **Generate token**
5.  Copy the token immediately — you won't see it again

## Step 5: Configure Studio — CI Trigger (Outbound) [​](#step-5-configure-studio-—-ci-trigger-outbound)

Set up Studio to trigger your GitHub Actions workflow when events happen in your project.

1.  Open your project in Tokens Studio
2.  Go to **Integrations** in the left sidebar
3.  Find the **CI Triggers (Outbound)** section
4.  Click **\+ Add Trigger**
5.  Select **GitHub** as the CI Provider
6.  Fill in:
    -   **Name:** e.g., `Design Tokens Repo`
    -   **Owner (user or org):** Your GitHub username or organization
    -   **Repository:** The repo name you created (e.g., `design-tokens`)
    -   **Event Type:** `tokens-release` (this matches the workflow trigger)
7.  Under **Trigger Events**, select `release.created`
8.  In the **Personal Access Token (PAT)** field, paste the token you created in Step 4
9.  Click **Create Trigger**

INFO

Your token is encrypted with AES-256 and stored securely. It can only be used to trigger pipelines, never retrieved.

## Step 6: Configure Studio — OIDC Integration [​](#step-6-configure-studio-—-oidc-integration)

OIDC lets your GitHub Actions workflow authenticate to Studio without storing any secrets. GitHub provides a short-lived token automatically during each workflow run.

1.  In your project, go to **Integrations** in the left sidebar
2.  Find the **CI Integration (Inbound)** section
3.  Click **\+ Add Integration**
4.  Select **GitHub Actions** as the CI Provider
5.  Fill in:
    -   **Name:** e.g., `Design Tokens Repo`
    -   **Repository:** `your-username/design-tokens` (owner/repo format)
    -   **Subject Pattern:** `repo:your-username/design-tokens:*`
        -   Replace `your-username` with your GitHub username or organization
        -   The `*` allows any branch or ref to authenticate
    -   **Permissions:** Check **Read** (and **Write** if you want to push tokens back to Studio)
6.  Click **Create Integration**

## Step 7: Test It [​](#step-7-test-it)

1.  Go to your project in Tokens Studio
2.  Create a release:
    -   Go to **Releases** in the sidebar
    -   Click **Create Release** and enter a version tag (e.g., `v1.0.0`)
3.  Studio automatically triggers your GitHub Action
4.  Check the **Actions** tab in your GitHub repository to see the workflow running
5.  Once it completes, your tokens will be committed to the `tokens/` directory

## Next Steps [​](#next-steps)

-   [CI/CD Pipeline Triggers](./ci-cd-triggers.html)
-   [GitLab CI guide](./gitlab-ci.html)