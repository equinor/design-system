<!-- source: https://documentation-v2.tokens.studio/getting-started/quick-start.html -->

# Quick Start Guide [​](#quick-start-guide)

This guide walks you through Studio end-to-end: from creating your first project to shipping tokens to your codebase.

**Time to complete:** ~15 minutes

## Step 1: Create Your Project [​](#step-1-create-your-project)

1.  Sign in to Studio and select your workspace
    
2.  Click **Create Project**
    
    ![Workspace overview with project list](/images/getting-started/workspace-overview-light.png)![Workspace overview with project list](/images/getting-started/workspace-overview-dark.png)
    
3.  Name your project (e.g., "Design System")
    
4.  Set the source of truth to **Tokens**
    
5.  Click **Create Project**
    
    ![Create project dialog](/images/getting-started/create-project-dialog-light.png)![Create project dialog](/images/getting-started/create-project-dialog-dark.png)
    

## Step 2: Create Token Sets [​](#step-2-create-token-sets)

Token sets group related tokens together. A typical setup might include:

1.  Go to the **Tokens** tab
2.  Click the **+** button next to **Token Sets** in the sidebar
3.  Create the following token sets:
    -   `primitives/colors` — Your raw color palette
    -   `primitives/spacing` — Base spacing values
    -   `primitives/typography` — Font families, sizes, weights
    -   `semantic/colors` — Contextual colors (e.g., background, text, primary)

## Step 3: Add Tokens [​](#step-3-add-tokens)

Inside each token set, add your tokens:

1.  Click **New Token**
    
2.  Set the name (e.g., `blue.500`)
    
3.  Set the type (e.g., `color`)
    
4.  Set the value (e.g., `#3B82F6`)
    
5.  Click **Create Token**
    
    ![Create token dialog](/images/tokens/create-token-dialog-light.png)![Create token dialog](/images/tokens/create-token-dialog-dark.png)
    

TIP

Use references to create semantic tokens. For example, set `semantic/colors → primary` to reference `{primitives/colors.blue.500}`.

## Step 4: Set Up Themes [​](#step-4-set-up-themes)

If your design system supports multiple themes (e.g., light/dark mode):

1.  Go to the **Themes** tab
2.  Click **New Theme Group** (e.g., "Color Mode")
3.  Add theme options: "Light" and "Dark"
4.  Map your semantic tokens to different values per theme option

## Step 5: Connect Figma [​](#step-5-connect-figma)

Sync your tokens with Figma to keep design and development aligned:

1.  Install the **Companion by Tokens Studio** plugin in Figma
2.  Open the plugin and sign in to your Studio account
3.  Authorize the connection using the Device Code flow
4.  Select the project to sync
5.  Choose which token sets to sync as Figma variables

## Step 6: Create a Branch [​](#step-6-create-a-branch)

Before making changes in a shared project, create a branch:

1.  Go to the **Branches** tab
    
2.  Click **Create Branch**
    
    ![Branches overview](/images/branching/branches-overview-light.png)![Branches overview](/images/branching/branches-overview-dark.png)
    
3.  Name your branch (e.g., "update-color-palette")
    
4.  Make your token changes on this branch
    

## Step 7: Review and Merge [​](#step-7-review-and-merge)

When your changes are ready:

1.  Open your branch
2.  Click **Create Review** to start a branch review
3.  Your team can review the changes, leave comments, and approve
4.  Once approved, click **Merge** to apply changes to the main branch

## Step 8: Create a Release [​](#step-8-create-a-release)

Ship your tokens to your codebase:

1.  Go to the **Releases** tab
    
2.  Click **New Release**
    
    ![Releases overview](/images/releases/releases-overview-light.png)![Releases overview](/images/releases/releases-overview-dark.png)
    
3.  Enter a version number (e.g., `1.0.0`)
    
4.  Review the tokens included in this release
    
5.  Click **Release**
    

If you've set up webhooks or CI/CD triggers, they'll fire automatically.

## Step 9: Set Up CI/CD (Optional) [​](#step-9-set-up-ci-cd-optional)

Automate your token pipeline:

### Webhooks [​](#webhooks)

1.  Go to **Project Settings → Webhooks**
2.  Add a webhook URL that receives release events
3.  Studio sends a POST request with the release payload when tokens are published

### GitHub Actions / GitLab CI [​](#github-actions-gitlab-ci)

1.  Go to **Project Settings → CI Triggers**
2.  Set up a trigger for your repository
3.  Choose OIDC authentication (recommended) or service account tokens
4.  Studio triggers your pipeline when a release is created

## What's Next? [​](#what-s-next)

You've got the basics down. Here's where to go deeper:

-   [Token types reference](./../tokens/token-types.html) — All supported token types and their formats
-   [Multi-dimensional theming](./../theming/multi-dimensional-theming.html) — Advanced theme configurations
-   [Magic Generators](./../tokenscript/what-is-tokenscript.html) — Automate token generation with code
-   [API reference](./../api/overview.html) — Build custom integrations with the Studio API