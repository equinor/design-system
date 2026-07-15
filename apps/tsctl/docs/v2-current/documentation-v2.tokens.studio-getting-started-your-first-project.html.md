<!-- source: https://documentation-v2.tokens.studio/getting-started/your-first-project.html -->

# Your First Project [​](#your-first-project)

Projects are where your design tokens live. Each project has its own tokens, branches, themes, and releases.

## Create a Project [​](#create-a-project)

1.  From your workspace dashboard, click **Create Project**
    
2.  Enter a project name and optional description
    
3.  Choose a color and emoji to help identify the project
    
4.  Select the **Source of Truth**:
    
    -   **Tokens** — Studio tokens are the primary source; Figma variables are synced from Studio
    -   **Variables** — Figma variables are the primary source; Studio manages the sync
5.  Click **Create Project**
    
    ![Create project page](/images/getting-started/create-project-dialog-light.png)![Create project page](/images/getting-started/create-project-dialog-dark.png)
    

Choosing a project type

This is an important choice that shapes your entire project experience. Token-based projects give you the full Studio feature set (theming, branching, Magic Generators, releases). Variable-based projects are streamlined for teams working primarily with Figma Variables. See [Project Types: Tokens vs. Variables](./project-types.html) for a detailed comparison.

Your project is created and ready for you to start working.

## Understanding the Project Dashboard [​](#understanding-the-project-dashboard)

When you open a project, the left sidebar gives you access to:

-   **Dashboard** — Project overview, system health, and recent activity
-   **Tokens** — Browse and edit your design tokens, organized by token sets
-   **Themes** — Configure theme groups and options for multi-dimensional theming
-   **Documentation** — Auto-generated documentation for your token system
-   **Assets** — Manage uploaded files and images
-   **AI Assistant** — Chat with the AI to create, update, and review tokens
-   **Generate** — Create tokens from schemas using Magic Generators
-   **Brand** — Define your brand voice, personas, and run evaluations
-   **Schema Marketplace** — Browse and install community generator schemas
-   **Exports** — Configure platform-specific output formats (CSS, JSON, etc.)
-   **Branches** — View and manage branches; create new ones for isolated work
-   **Releases** — View release history and create new releases

Under **SETTINGS**, you'll find Project Settings, Members, AI Settings, and Integrations.

![Project dashboard](/images/getting-started/project-dashboard-light.png)![Project dashboard](/images/getting-started/project-dashboard-dark.png)

## Add Your First Tokens [​](#add-your-first-tokens)

### Manually [​](#manually)

1.  Navigate to **Tokens** in the sidebar
2.  Click **New Token Set** to create a set (e.g., "colors", "spacing")
3.  Inside the token set, click **New Token**
4.  Choose a token type (color, dimension, text, number, etc.)
5.  Enter a name and value
6.  Click **Create Token**

### Import from a File [​](#import-from-a-file)

If you already have tokens in DTCG JSON format or another supported format:

1.  Navigate to **Tokens** in the sidebar
2.  Click **Import**
3.  Upload your token file
4.  Review the import preview
5.  Confirm the import

See [Importing Tokens](./../tokens/importing-tokens.html) for supported formats and options.

### Import from Figma [​](#import-from-figma)

If your tokens live in Figma as variables:

1.  Connect Studio to your Figma file (see [Connecting to Figma](./../figma/connecting-to-figma.html))
2.  Use the sync feature to pull variables into Studio
3.  Review and confirm the imported variables

## Project Settings [​](#project-settings)

Under **SETTINGS** in the sidebar, you can configure:

-   **Project Settings** — Name, slug, description, base permission, and source of truth
-   **Members** — Add workspace members and assign project-specific roles
-   **AI Settings** — Configure the AI Assistant for this project
-   **Integrations** — Set up CI/CD triggers, service account tokens, and webhooks

Your project's brand settings are available from **Brand** in the left sidebar, which includes Definition, Test run, Personas, Eval, and Analytics.

## Next Steps [​](#next-steps)

-   [Learn about token types and how to create them](./../tokens/creating-tokens.html)
-   [Set up theming for your project](./../theming/theme-groups-and-options.html)
-   [Connect your project to Figma](./../figma/connecting-to-figma.html)
-   [Follow the Quick Start guide](./quick-start.html) for a complete walkthrough