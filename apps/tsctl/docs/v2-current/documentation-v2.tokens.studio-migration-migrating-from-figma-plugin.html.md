<!-- source: https://documentation-v2.tokens.studio/migration/migrating-from-figma-plugin.html -->

# Migrating from Tokens Studio for Figma [​](#migrating-from-tokens-studio-for-figma)

If you've been using the **Tokens Studio for Figma** plugin (formerly Figma Tokens) to manage design tokens directly in Figma, this guide helps you move your tokens into Studio for a more robust workflow.

## Why Migrate? [​](#why-migrate)

The Figma plugin is great for getting started with design tokens, but Studio offers:

-   **Centralized management** — One place for all your tokens, not locked inside Figma files
-   **Branching and version control** — Work on changes safely with Git-like branches
-   **Team collaboration** — Reviews, approvals, and role-based access
-   **CI/CD integration** — Automate your token-to-code pipeline
-   **Multi-project support** — Manage tokens across multiple products and brands

## Migration Steps [​](#migration-steps)

### Step 1: Export from the Figma Plugin [​](#step-1-export-from-the-figma-plugin)

1.  Open your Figma file with the Tokens Studio plugin
2.  Go to **Settings → Export**
3.  Export your tokens as JSON (Tokens Studio format)
4.  Save the file

### Step 2: Create a Studio Project [​](#step-2-create-a-studio-project)

1.  Sign up or log in to Studio
2.  Create a workspace (if you haven't already)
3.  Create a new project
4.  Set the source of truth based on your preferred workflow:
    -   **Tokens** if you want Studio to be the primary source
    -   **Variables** if you want to continue managing tokens primarily in Figma

### Step 3: Import Your Tokens [​](#step-3-import-your-tokens)

1.  Go to the **Tokens** tab
2.  Click **Import**
3.  Upload your exported JSON file
4.  Studio detects the Tokens Studio format automatically
5.  Review the import preview:
    -   Token sets will be created based on your plugin's set structure
    -   Token values, types, and references are preserved
    -   Theme configuration is imported
6.  Confirm the import

### Step 4: Review and Organize [​](#step-4-review-and-organize)

After import, review your tokens:

-   Check that all token sets are organized correctly
-   Verify that references (`{token.name}`) resolve correctly
-   Review theme groups and options if you had themes configured

### Step 5: Set Up Figma Sync [​](#step-5-set-up-figma-sync)

You can connect Studio back to Figma using either plugin:

**Option A: Continue with the original plugin**

If you prefer to keep using the Tokens Studio for Figma plugin, you can now sync it directly with Studio:

1.  In the plugin, go to the **Subscription** tab and sign in to your Studio account
2.  Select your **workspace** from the dropdown
3.  Go to the **Settings** tab — your workspace appears as a sync provider
4.  Select your **project** from the dropdown
5.  Pull tokens from Studio into the plugin

**Option B: Switch to the Companion plugin**

For variable-based projects or a streamlined sync experience:

1.  Install the Companion by Tokens Studio plugin in Figma
2.  Sign in to your Studio account
3.  Connect to your project
4.  Sync your tokens as Figma variables

See [Connecting to Figma](./../figma/connecting-to-figma.html) for detailed setup instructions for both plugins.

### Step 6: Update Your Team's Workflow [​](#step-6-update-your-team-s-workflow)

Share the new workflow with your team:

-   Designers use Figma + the Companion plugin for visual work
-   Token changes are managed in Studio (or synced from Figma)
-   Changes go through branch reviews before going live
-   Releases trigger automated code updates

## What Transfers [​](#what-transfers)

| Plugin Concept | Studio Equivalent |
| --- | --- |
| Token sets | Token sets |
| Tokens (all types) | Tokens (DTCG-compatible) |
| Token references | Token references |
| Themes | Theme groups and options |
| JSON file storage | Studio's event-sourced database |

## What Changes [​](#what-changes)

| Before (Plugin) | After (Studio) |
| --- | --- |
| Tokens stored in Figma file | Tokens stored in Studio, synced to Figma |
| Manual JSON export | Automated releases with CI/CD |
| No version control | Git-like branching and merging |
| Single user editing | Team collaboration with reviews |
| Plugin-specific format | W3C DTCG standard |

## Next Steps [​](#next-steps)

-   [Quick Start guide](./../getting-started/quick-start.html)
-   [Connecting to Figma](./../figma/connecting-to-figma.html)
-   [How branching works](./../branching/how-branching-works.html)