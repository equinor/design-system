<!-- source: https://documentation-v2.tokens.studio/figma/connecting-to-figma.html -->

# Connecting Studio to Figma [​](#connecting-studio-to-figma)

Studio integrates with Figma through two plugins, each suited to different workflows:

-   **Tokens Studio for Figma** — The original plugin, ideal for token-based projects. Supports syncing tokens to and from Studio with full control over token sets, themes, and styles.
-   **[Companion by Tokens Studio](https://www.figma.com/community/plugin/1459456214393844551/companion-by-tokens-studio)** — A lightweight plugin that syncs variables between Studio and Figma. Works with both variable-based and token-based projects.

Variable project sync not yet available in the original plugin

The original **Tokens Studio for Figma** plugin currently supports syncing with **token-based projects** only. Sync with **variable-based projects** is not yet available. If your project uses Figma Variables as the source of truth, use the Companion plugin for now.

## Choosing a Plugin [​](#choosing-a-plugin)

|  | Tokens Studio for Figma | Companion by Tokens Studio |
| --- | --- | --- |
| **Best for** | Token-based projects | Variable-based projects |
| **Sync direction** | Two-way (push and pull) | Two-way (push and pull) |
| **Token sets & themes** | ✅ Full support | — |
| **Figma variables sync** | ❌ Not yet supported | ✅ Push and pull |
| **Figma styles sync** | ❌ Not yet supported | — |

## Setting Up the Original Plugin (Tokens Studio for Figma) [​](#setting-up-the-original-plugin-tokens-studio-for-figma)

### 1\. Install the Plugin [​](#_1-install-the-plugin)

1.  Open Figma
2.  Go to **Plugins → Browse plugins**
3.  Search for "Tokens Studio for Figma"
4.  Click **Install**

### 2\. Sign In and Select Your Workspace [​](#_2-sign-in-and-select-your-workspace)

Before you can sync, you need to sign in to your Studio account and select the workspace you want to work with:

1.  Open the Tokens Studio for Figma plugin in Figma
2.  Go to the **Subscription** tab
3.  Click **Sign in to Studio** and complete the authorization flow
4.  Once signed in, select your **workspace** from the dropdown

TIP

You must select a workspace in the Subscription tab before it becomes available as a sync provider in the Settings tab.

### 3\. Connect a Sync Provider [​](#_3-connect-a-sync-provider)

Once you've selected a workspace in the Subscription tab, it appears as a sync provider in the Settings tab:

1.  Go to the **Settings** tab
2.  Under **Sync providers**, find your workspace
3.  Select a **project** from the dropdown next to your workspace
4.  Click **Apply** to connect

You can also click **Add new sync provider** to connect additional workspaces or other sync sources (such as GitHub, GitLab, or a URL).

Workspaces with expired or inactive subscriptions

Workspaces with an expired plan or no active subscription will appear greyed out and cannot be selected as a sync provider. Renew your subscription to restore access.

### 4\. Select a Project [​](#_4-select-a-project)

Each workspace shows its available token-based projects in a dropdown. Select the project you want to sync with:

Once a project is connected, it shows as **Active** next to the workspace name.

### 5\. Pull Tokens [​](#_5-pull-tokens)

With a project connected, you can pull tokens from Studio into the plugin:

-   **Pull** — Fetches the latest tokens from Studio into the plugin. Your local token sets, values, and themes are updated to match what's in Studio.

INFO

Theme and reference changes are automatically pushed back to Studio when the plugin is connected. See [Syncing Variables](./syncing-variables.html) for details on how sync works.

The plugin automatically uses the **DTCG (Design Token Community Group)** format when pulling tokens from Studio.

## Setting Up the Companion Plugin [​](#setting-up-the-companion-plugin)

### 1\. Install the Plugin [​](#_1-install-the-plugin-1)

1.  Open Figma
2.  Go to **Plugins → Browse plugins**
3.  Search for "Companion by Tokens Studio"
4.  Click **Install**

Or install directly from the [Figma Community page](https://www.figma.com/community/plugin/1459456214393844551/companion-by-tokens-studio).

### 2\. Connect to Your Studio Account [​](#_2-connect-to-your-studio-account)

1.  Open the Companion plugin in Figma
2.  Click **Connect to Studio**
3.  Your browser opens to the Studio device code page with the code already filled in
4.  Make sure you are signed in to the correct Studio account in your browser
5.  Click **Connect Device**
6.  You will see **Device Connected!** in the browser. You can close this tab
7.  Go back to the Companion plugin in Figma

### 3\. Select a Project [​](#_3-select-a-project)

Once connected:

1.  Select your workspace
2.  Select the project to sync. Both token-based and variable-based projects are available
3.  Follow the steps to link your Figma file

For a detailed walkthrough of the full variable sync flow, see [Syncing Variables](./syncing-variables.html).

## How Sync Works [​](#how-sync-works)

Studio supports two source-of-truth modes, configured per project:

### Tokens as Source of Truth [​](#tokens-as-source-of-truth)

Studio tokens drive the process. Changes made in Studio are pushed to Figma:

-   Token values → Figma variable values
-   Token sets → Figma variable collections
-   Theme options → Figma variable modes

### Variables as Source of Truth [​](#variables-as-source-of-truth)

Figma variables drive the process. Changes in Figma are pulled into Studio:

-   Figma variable values → Token values
-   Figma variable collections → Token sets
-   Figma modes → Theme options

## Sync Scope [​](#sync-scope)

The following are synced between Studio and Figma:

| Studio | Figma |
| --- | --- |
| Tokens | Variables |
| Token sets | Variable collections |
| Theme options | Variable modes |

## Next Steps [​](#next-steps)

-   [Syncing variables](./syncing-variables.html)
-   [Resolving sync conflicts](./resolving-sync-conflicts.html)