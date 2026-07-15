<!-- source: https://documentation-v2.tokens.studio/figma/syncing-variables.html -->

# Getting Started with Variables [​](#getting-started-with-variables)

This guide walks you through working with variables in Tokens Studio, from creating your first variable-based project to syncing variables between Studio and Figma.

INFO

This guide is for **variable-based projects**. Not sure which type you need? See [Project Types](./../getting-started/project-types.html).

## Step 1: Create a Variable-Based Project in Studio [​](#step-1-create-a-variable-based-project-in-studio)

If you already have a variable-based project, skip to [Step 2](#step-2-add-variables-in-studio).

1.  Go to [production.tokens.studio](https://production.tokens.studio) and sign in to your account
2.  Open your workspace
3.  Click **Create Project**
4.  Give your project a name
5.  Under source of truth, choose **Figma Variables**
6.  Click **Create**

You will land in your new project with the **Variables** tab in the sidebar. This is where you manage your variable collections, modes, and values.

## Step 2: Add Variables in Studio [​](#step-2-add-variables-in-studio)

Before you can sync anything to Figma, you need at least one collection with a mode and a variable.

1.  In your project, go to the **Variables** tab
2.  Click **Create Collection** and give it a name (e.g., "Colors")
3.  Your collection starts with one default mode. You can add more by clicking the **+** button in the table header (e.g., add a "Dark" mode alongside the default "Light" mode)
4.  Click **New variable** and choose a type: Color, Number, String, or Boolean
5.  Give your variable a name (e.g., "primary") and set a value for each mode

You now have variables in Studio ready to sync with Figma.

TIP

You can also start with variables in Figma and push them to an empty Studio project. See [Pushing Variables from Figma to Studio](#pushing-variables-from-figma-to-studio) below.

## Step 3: Install the Companion Plugin in Figma [​](#step-3-install-the-companion-plugin-in-figma)

The **Companion by Tokens Studio** plugin is the bridge between Studio and Figma. You only need to install it once.

1.  Open Figma
2.  Go to **Plugins → Browse plugins**
3.  Search for **Companion by Tokens Studio**
4.  Click **Install**

Or install it directly from the [Figma Community page](https://www.figma.com/community/plugin/1459456214393844551/companion-by-tokens-studio).

## Step 4: Connect the Plugin to Your Studio Account [​](#step-4-connect-the-plugin-to-your-studio-account)

1.  Open the Companion plugin in Figma (right-click the canvas → Plugins → Companion by Tokens Studio)
2.  Click **Connect to Studio**
3.  Your browser opens to the Studio device code page with the code already filled in
4.  Make sure you are signed in to the correct Studio account in your browser
5.  Click **Connect Device**
6.  You will see **Device Connected!** in the browser. You can close this tab
7.  Go back to the Companion plugin in Figma

You are now signed in to the plugin.

## Step 5: Select Your Workspace and Project [​](#step-5-select-your-workspace-and-project)

1.  The plugin shows a list of your workspaces. Select the one that contains your project
2.  You will see a list of projects in that workspace. Variable-based projects are labeled **VARIABLES** and show the number of collections and variables (e.g., "1 collection · 1 variable")
3.  Click on your variable-based project

## Step 6: Link Your Figma File [​](#step-6-link-your-figma-file)

After selecting your project, the plugin shows a **Link Your Figma File** dialog. This connects your Figma file to the Studio project so the plugin knows which file to sync with.

1.  In Figma, click **Share** in the top right corner
2.  Click **Copy link** to copy the Figma file URL
3.  Paste the link into the **Paste Figma file URL** field in the Companion plugin
4.  Click **Save**

The plugin connects to your project and shows the sync status. If everything is in sync, you will see **Up to Date** with a visual showing Studio and Figma connected.

You only need to link your Figma file once. The next time you open the plugin in this file, it will remember the connection.

## Pulling Variables from Studio to Figma [​](#pulling-variables-from-studio-to-figma)

Once connected, you can bring your Studio variables into Figma:

1.  In the Companion plugin, click the **dropdown arrow** next to **Sync with Studio**
2.  Select **Pull from Studio**
3.  Your variables are created in Figma with collections, modes, and values matching what is in Studio

After the pull, the plugin shows **Up to Date**. Open Figma's built-in variable panel to see your synced variables.

Use Pull whenever you or a teammate has made changes in Studio and you want your Figma file to reflect those changes.

## Pushing Variables from Figma to Studio [​](#pushing-variables-from-figma-to-studio)

You can also go the other direction. Create or edit variables in Figma and send them to Studio:

1.  Create or edit variables in Figma using Figma's built-in variable editor
2.  Open the Companion plugin
3.  Click the **dropdown arrow** next to **Sync with Studio**
4.  Select **Push to Studio**
5.  Your changes are sent to Studio. Refresh Studio in your browser to see them

Use Push when designers are working directly in Figma and the team needs those changes in Studio.

Starting from existing Figma variables

If you already have variables in Figma and want to bring them into Studio, create an empty variable-based project in Studio, connect the Companion plugin to it, link your Figma file, and use **Push to Studio**. Your Figma variables will appear in Studio ready to manage.

## Sync Direction [​](#sync-direction)

By default, both Studio and Figma can make changes. If you want to control which side is the source of truth for a specific collection, you can configure it in Studio:

1.  Go to your project in Studio
2.  Open the **Variables** tab
3.  Click the **three-dot menu** on a collection header
4.  Select **Sync settings**
5.  Choose a direction:
    -   **Figma is source of truth** — designers edit in Figma, the collection becomes read-only in Studio
    -   **Studio is source of truth** — the team edits in Studio, Figma reflects those changes
    -   **Two-way sync** — both sides can make changes, conflicts are shown for manual resolution
6.  Click **Save**

## Exporting Variables [​](#exporting-variables)

The Companion plugin has an **Export to CSS** button at the bottom of the sync screen. Clicking it opens the **Exports** tab of your project in Studio in your browser, where you can choose from formats like CSS Variables, TypeScript, JSON, and more. See [Exporting Variables](./exporting-variables.html) for details on each format.

## Releases [​](#releases)

When your variables are ready for your development team, you can create a release to snapshot the current state of your project. A release locks in all your variable values at that point in time, gives it a version number, and makes it available for your team to consume. Releases also trigger any connected CI/CD pipelines or webhooks, so your build process can pick up the latest variables automatically. See [Creating a Release](./../releases/creating-a-release.html) for the full walkthrough.

## CI/CD and Automation [​](#ci-cd-and-automation)

Studio can automatically trigger your CI/CD pipeline whenever a release is created. This means your development team gets updated variable files in their codebase without any manual steps. You can connect to GitHub Actions, GitLab CI, CircleCI, or Bitbucket Pipelines from the **Integrations** page in your project settings. You can also use the [Tokens Studio CLI](./../cli/overview.html) to pull and export variables from the command line, which is useful for local development or custom build scripts. See [CI/CD Pipeline Triggers](./../integrations/ci-cd-triggers.html) for setup instructions.

## Variable Types [​](#variable-types)

Studio supports the same four variable types as Figma:

| Type | Example values |
| --- | --- |
| **Color** | `#0066FF`, `rgba(0, 102, 255, 1)` |
| **Number** | `16`, `1.5`, `0` |
| **String** | `"Inter"`, `"bold"` |
| **Boolean** | `true`, `false` |

## Limits [​](#limits)

-   Maximum **5,000 variables** per collection
-   Maximum **40 modes** per collection
-   Variable names cannot contain `.` `{` or `}` characters
-   Mode names cannot exceed **40 characters**

## Next Steps [​](#next-steps)

-   [Exporting Variables](./exporting-variables.html) — Export your variables as CSS, TypeScript, JSON, and more
-   [Creating a Release](./../releases/creating-a-release.html) — Version and publish snapshots of your variables for your team to consume
-   [CI/CD Pipeline Triggers](./../integrations/ci-cd-triggers.html) — Automatically trigger your CI/CD pipeline when a release is created
-   [Tokens Studio CLI](./../cli/overview.html) — Pull and export your variables from the command line