<!-- source: https://documentation-v2.tokens.studio/integrations/gitlab-ci.html -->

# GitLab CI Integration [​](#gitlab-ci-integration)

Set up a CI/CD pipeline to sync design tokens from Tokens Studio to a GitLab repository using a release trigger.

## Prerequisites [​](#prerequisites)

-   A Tokens Studio project with tokens ready to export
-   A GitLab account with permission to create projects and pipeline trigger tokens

## Step 1: Create Your GitLab Project [​](#step-1-create-your-gitlab-project)

If you already have a repository for your design tokens, skip to [Step 2](#step-2-create-the-gitlab-ci-pipeline).

1.  Go to [gitlab.com/projects/new](https://gitlab.com/projects/new)
2.  Click **Create blank project**
3.  Fill in:
    -   **Project name** — e.g., `design-tokens` or `my-design-system`
    -   **Visibility Level** — Private or Public
    -   **Initialize repository with a README** — Check this box
4.  Click **Create project**

## Step 2: Create the GitLab CI Pipeline [​](#step-2-create-the-gitlab-ci-pipeline)

In your new project:

1.  Click the **+** button → **New file**
2.  Name it `.gitlab-ci.yml`
3.  Paste the following pipeline:

yaml

```
sync-tokens:
  stage: deploy
  image: node:20

  id_tokens:
    GITLAB_OIDC_TOKEN:
      aud: tokens-studio

  script:
    - npm install -g @tokens-studio/studio-cli

    - |
      cat > .studio.json << EOF
      {
        "\$schema": "https://tokens.studio/schema/cli",
        "dependencies": {
          "core": {
            "project": "$TOKENS_PROJECT",
            "ref": { "type": "branch", "name": "main" },
            "output": "tokens"
          }
        }
      }
      EOF

    - studio tokens pull --ci
    # The --ci flag tells the CLI to use OIDC authentication.
    # GitLab automatically provides the GITLAB_OIDC_TOKEN
    # when id_tokens is configured in the job.

    - |
      git config user.name "gitlab-ci[bot]"
      git config user.email "gitlab-ci[bot]@noreply.gitlab.com"

      git remote set-url origin "https://oauth2:${CI_JOB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"

      git add tokens/ .studio.json

      if git diff --staged --quiet; then
        echo "No changes to commit"
      else
        git commit -m "chore: sync design tokens from Studio"
        git push origin HEAD:main
      fi

  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
```

4.  Click **Commit changes**

## Step 3: Add CI/CD Variables [​](#step-3-add-ci-cd-variables)

The pipeline references `$TOKENS_PROJECT` to know which Studio project to pull from.

1.  In your GitLab project, go to **Settings → CI/CD**
2.  Expand the **Variables** section
3.  Click **Add variable**
4.  Add:
    -   **Key:** `TOKENS_PROJECT`
    -   **Value:** Your project ID from Tokens Studio (find it in the URL when viewing your project, e.g., `abc123-def456-...`)
    -   **Flags:** Uncheck "Protect variable" if you want it available on all branches
5.  Click **Add variable**

## Step 4: Create a GitLab Pipeline Trigger Token [​](#step-4-create-a-gitlab-pipeline-trigger-token)

Studio needs a trigger token to start your CI pipeline when you create a release.

1.  In your GitLab project, go to **Settings → CI/CD**
2.  Expand the **Pipeline trigger tokens** section
3.  Enter a description — e.g., `Tokens Studio Trigger`
4.  Click **Create pipeline trigger token**
5.  Copy the token immediately — you'll need it in the next step

## Step 5: Configure Studio — CI Trigger (Outbound) [​](#step-5-configure-studio-—-ci-trigger-outbound)

Set up Studio to trigger your GitLab CI pipeline when events happen in your project.

1.  Open your project in Tokens Studio
2.  Go to **Integrations** in the left sidebar
3.  Find the **CI Triggers (Outbound)** section
4.  Click **\+ Add Trigger**
5.  Select **GitLab** as the CI Provider
6.  Fill in:
    -   **Name** — e.g., `Design Tokens Repo`
    -   **GitLab URL** — `https://gitlab.com` (or your self-hosted GitLab instance URL)
    -   **Project ID** — Your GitLab project's numeric ID (find it in GitLab under **Settings → General → Project ID**)
    -   **Branch/Ref** — `main`
7.  Under **Trigger Events**, select `release.created`
8.  In the **Personal Access Token (PAT)** field, paste the pipeline trigger token you created in Step 4
9.  Click **Create Trigger**

INFO

Your token is encrypted with AES-256 and stored securely. It can only be used to trigger pipelines, never retrieved.

## Step 6: Configure Studio — OIDC Integration [​](#step-6-configure-studio-—-oidc-integration)

OIDC lets your GitLab CI pipeline authenticate to Studio without storing any secrets. GitLab provides a short-lived token automatically during each pipeline run.

1.  In your project, go to **Integrations** in the left sidebar
2.  Find the **CI Integration (Inbound)** section
3.  Click **\+ Add Integration**
4.  Select **GitLab CI** as the CI Provider
5.  Fill in:
    -   **Name** — e.g., `Design Tokens Repo`
    -   **GitLab Instance URL** — Leave empty for GitLab.com. For self-hosted GitLab (EE/CE), enter the instance URL.
    -   **Project Path** — `your-group/design-tokens` (your GitLab group/project path)
    -   **Subject Pattern** — `project_path:your-group/design-tokens:*`
        -   Replace `your-group/design-tokens` with your actual GitLab project path
        -   The `*` allows any branch or ref to authenticate
    -   **Permissions** — Check **Read** (and **Write** if you want to push tokens back to Studio)
6.  Click **Create Integration**

TIP

Configure `id_tokens` in your `.gitlab-ci.yml` with `aud: tokens-studio` to match Studio's expected audience value.

## Step 7: Test It [​](#step-7-test-it)

1.  Go to your project in Tokens Studio
2.  Create a release:
    -   Go to **Releases** in the sidebar
    -   Click **Create Release** and enter a version tag (e.g., `v1.0.0`)
3.  Studio automatically triggers your GitLab CI pipeline
4.  Check **Build → Pipelines** in your GitLab project to see the pipeline running
5.  Once it completes, your tokens will be committed to the `tokens/` directory

## Next Steps [​](#next-steps)

-   [CI/CD Pipeline Triggers](./ci-cd-triggers.html)
-   [GitHub Actions guide](./github-actions.html)