<!-- source: https://documentation-v2.tokens.studio/getting-started/project-types.html -->

# Project Types: Tokens vs. Variables [​](#project-types-tokens-vs-variables)

When you create a new project in Studio, you choose a **source of truth** that determines how your project manages design decisions. This is a fundamental choice that shapes the entire project experience.

![Project dashboard showing token organization](/images/getting-started/project-dashboard-light.png)![Project dashboard showing token organization](/images/getting-started/project-dashboard-dark.png)

**Jump to a guide:**

-   [Getting Started with Variables](/figma/syncing-variables.html) — Full walkthrough of creating your project, connecting the Companion plugin, and syncing with Figma
-   [Exporting Variables](/figma/exporting-variables.html) — Export your variables to CSS, TypeScript, JSON, and more
-   [Your First Project](/getting-started/your-first-project.html) — Walkthrough of creating either project type

## Two Approaches [​](#two-approaches)

Studio supports two project types:

### Token-Based Projects (Default) [​](#token-based-projects-default)

Token-based projects use Studio's own **design token** format as the source of truth. This is the traditional Studio workflow and gives you access to the full feature set:

-   **Token management** — Create and organize tokens using the W3C DTCG specification
-   **Token sets** — Group tokens into logical sets for different purposes
-   **Theme groups** — Build multi-dimensional themes by combining token sets
-   **Branching** — Work on changes in isolation with Git-like branching and reviews
-   **Magic Generators** — Define generators for transforming and outputting tokens
-   **Releases** — Version and publish your tokens for consumption
-   **Figma sync** — Push tokens to Figma as variables and styles

Choose this if your design system is managed primarily in Studio and you want full control over token structure, theming, and code output.

### Variable-Based Projects [​](#variable-based-projects)

Variable-based projects use **Figma Variables** as the source of truth. The project UI is streamlined around managing variable collections, modes, and values — mirroring how variables work in Figma.

-   **Variable collections** — Organize variables into collections (like Figma's variable collections)
-   **Modes** — Define modes within each collection (e.g., Light, Dark, Compact), up to 40 modes per collection
-   **Variable types** — Support for Color, Number (Float), String, and Boolean variables
-   **Variable aliases** — Reference other variables to create relationships, including across collections
-   **Code syntax** — Define platform-specific names (`WEB`, `ANDROID`, `IOS`) for each variable
-   **Figma sync** — Bi-directional sync with configurable direction per collection
-   **Exports** — Configure platform-specific output formats (CSS, JSON, etc.)
-   **Releases** — Version and publish snapshots of your variable state

Choose this if your team primarily works in Figma and wants Studio to enhance the Figma Variables workflow with collaboration, versioning, and sync features.

## Choosing During Project Creation [​](#choosing-during-project-creation)

You select the project type when creating a new project during onboarding. The default is **Token-based**.

TIP

The source of truth is set at project creation and determines the project's core workflow. Consider your team's primary workflow before choosing.

Variables plan

If your workspace is on the **Variables plan**, your projects are automatically set to variable-based. The source of truth selector is not shown during project creation — all projects use Figma Variables as the source of truth. See [Billing and Plans](./../settings/billing-and-plans.html) for details on plan differences.

## Feature Comparison [​](#feature-comparison)

| Feature | Token-Based | Variable-Based |
| --- | --- | --- |
| Token management | ✅ | — |
| Token sets | ✅ | — |
| Variable collections & modes | — | ✅ |
| Theme groups | ✅ | — |
| Multi-dimensional theming | ✅ | — |
| Branching & reviews | ✅ | — |
| Magic Generators | ✅ | — |
| Releases | ✅ | ✅ |
| Exports | ✅ | ✅ |
| Figma Variables sync | ✅ (push) | ✅ (bi-directional) |
| Figma Styles sync | ✅ | — |
| CI/CD triggers | ✅ | ✅ |
| Webhooks | ✅ | ✅ |
| Team collaboration | ✅ | ✅ |

## Sync Directions (Variable-Based) [​](#sync-directions-variable-based)

Variable-based projects let you configure the sync direction for each collection independently:

-   **Figma Source** — Changes in Figma overwrite Studio values. Studio is read-only for synced data.
-   **Studio Source** — Changes in Studio overwrite Figma values. Figma reflects what's in Studio.
-   **Bidirectional** — Both sides can make changes. Conflicts are shown for manual resolution.

Each collection also tracks its **sync status** — synced, pending, conflict, or error — so you always know where things stand.

## Variables Structure [​](#variables-structure)

In a variable-based project, your data is organized hierarchically:

-   Project
    -   Colors
        -   Modes: Light, Dark
        -   primary Color → #0066FF / #3388FF
        -   background Color → #FFFFFF / #1A1A1A
        -   on-primary Color → #FFFFFF / #000000
    -   Spacing
        -   Modes: Default, Compact
        -   spacing-sm Float → 8 / 4
        -   spacing-md Float → 16 / 8
        -   spacing-lg Float → 24 / 16

Each variable can hold a **literal value** (a color, number, string, or boolean) or an **alias** that references another variable — just like in Figma. Aliases can reference variables in other collections (cross-collection aliases).

## Publishing Visibility [​](#publishing-visibility)

Individual variables have a **Hide from publishing** checkbox that controls whether they appear when the file is published as a Figma library. This lets you keep internal or work-in-progress variables out of your published library without deleting them. This setting syncs bidirectionally with Figma.

## Variable Scopes [​](#variable-scopes)

Variables can be scoped to control where they apply in Figma:

-   **Color variables** — All scopes, all fills, frame fill, shape fill, text fill, stroke color, effect color
-   **Number variables** — All scopes, corner radius, text content, width/height, gap, stroke, opacity, effect, font weight, font size, line height, letter spacing, paragraph spacing, paragraph indent
-   **String variables** — All scopes, text content, font family, font style, font variations
-   **Boolean variables** — All scopes

## Variable Naming [​](#variable-naming)

Variable names cannot contain the characters `.` `{` or `}`. These characters are reserved and will be rejected if included in a variable name.

## Next Steps [​](#next-steps)

-   For plan details and pricing, see [Billing and Plans](/settings/billing-and-plans.html).