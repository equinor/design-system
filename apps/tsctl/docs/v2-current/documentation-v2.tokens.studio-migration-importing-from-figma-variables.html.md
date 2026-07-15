<!-- source: https://documentation-v2.tokens.studio/migration/importing-from-figma-variables.html -->

# Importing from Figma Variables [​](#importing-from-figma-variables)

If your design system uses native Figma variables, you can bring them into Studio for centralized management using a variable-based project.

INFO

This page covers importing into a **variable-based project**. If your project uses tokens as the source of truth, the import flow and data model differ — see [Project Types](./../getting-started/project-types.html) for details.

## Prerequisites [​](#prerequisites)

-   A Figma file with variables defined
-   The **Companion by Tokens Studio** plugin installed in Figma
-   A Studio project with **Figma Variables** selected as the source of truth

## Steps [​](#steps)

### 1\. Connect Studio to Figma [​](#_1-connect-studio-to-figma)

Follow the setup in [Connecting to Figma](./../figma/connecting-to-figma.html) to authorize the Companion plugin and select your project.

### 2\. Create a Variable-Based Project [​](#_2-create-a-variable-based-project)

When creating your project, select **Figma Variables** as the source of truth. This configures Studio to work with variable collections, modes, and values — mirroring how variables work in Figma.

TIP

On the **Variables plan**, all projects are automatically set to variable-based. See [Billing and Plans](./../settings/billing-and-plans.html) for plan details.

### 3\. Sync Variables [​](#_3-sync-variables)

Open the Companion plugin in Figma and sync your variables with Studio. Studio compares the current state of your Figma variables with what's in Studio and shows a diff of changes to review before applying.

### 4\. Review in Studio [​](#_4-review-in-studio)

After the sync:

-   Variable collections are preserved as variable collections in Studio
-   Modes are preserved as modes within each collection
-   Variable values are mapped to their Studio equivalents
-   Aliases (references between variables) are preserved, including cross-collection aliases

### 5\. Configure Sync Direction [​](#_5-configure-sync-direction)

Each collection can be configured with its own sync direction:

-   **Figma Source** — Changes in Figma overwrite Studio values. Studio is read-only for synced data.
-   **Studio Source** — Changes in Studio overwrite Figma values. Figma reflects what's in Studio.
-   **Bidirectional** — Both sides can make changes. Conflicts are shown for manual resolution.

See [Syncing Variables](./../figma/syncing-variables.html) for details on managing ongoing sync.

## What Gets Imported [​](#what-gets-imported)

| Figma Concept | Studio Equivalent |
| --- | --- |
| Variable Collection | Variable collection |
| Variable | Variable |
| Mode | Mode |
| Variable alias | Variable alias |
| Color variable | Color (COLOR type) |
| Number variable | Number (FLOAT type) |
| String variable | String (STRING type) |
| Boolean variable | Boolean (BOOLEAN type) |

## Limitations [​](#limitations)

-   Figma allows a maximum of 5,000 variables per collection. Studio enforces this limit.
-   Variable names cannot contain `.`, `{`, or `}` characters
-   Up to 40 modes per collection

## Next Steps [​](#next-steps)

-   [Syncing variables](./../figma/syncing-variables.html)
-   [Project Types](./../getting-started/project-types.html)
-   [Billing and Plans](./../settings/billing-and-plans.html)