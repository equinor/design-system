<!-- source: https://documentation-v2.tokens.studio/figma/two-way-sync.html -->

# Two-Way Sync [​](#two-way-sync)

When the Tokens Studio for Figma plugin is connected to Tokens Studio, it keeps your token data in sync with the platform in real time. Changes you make in the Figma plugin are automatically pushed back to Tokens Studio, and changes made on the platform are pulled into Figma when the plugin loads.

INFO

Two-way sync requires a connection between the Figma plugin and Tokens Studio. See [Connecting to Figma](./connecting-to-figma.html) for setup instructions.

## Pulling from Tokens Studio to Figma [​](#pulling-from-tokens-studio-to-figma)

When you open the plugin or switch branches, it fetches the latest token data from Tokens Studio, including:

-   **Token sets and tokens** — values, types, descriptions, and Figma-specific extensions (`com.figma.scopes`, `com.figma.codeSyntax`, etc.)
-   **Themes** — selected token sets, theme groups, and any Figma style or variable references already stored on the server

This means your Figma file always starts from the canonical source of truth in Tokens Studio.

## Pushing from Figma to Tokens Studio [​](#pushing-from-figma-to-tokens-studio)

Changes you make in the plugin are automatically written back to Tokens Studio without needing a manual push. The following actions trigger a sync:

| Action in Figma | What gets synced |
| --- | --- |
| Save or rename a theme | Theme name, group, and selected token sets |
| Assign a style to a theme | `$figmaStyleReferences` on the theme |
| Assign a variable to a theme | `$figmaVariableReferences` on the theme |
| Rename a style or variable reference | Updated reference keys on the theme |
| Disconnect a style from a theme | Reference removed from the theme |
| Disconnect a variable from a theme | Reference removed from the theme |
| Delete a theme | Theme removed from Tokens Studio |
| Export variables to Figma | Figma collection and mode IDs stored on the theme |
| Rename token aliases | Updated token values pushed to the affected token sets |

## Things to Know [​](#things-to-know)

-   **Read-only JSON editor** — When connected to Tokens Studio, the raw JSON editor in the plugin is read-only. Token edits should be made through the Tokens Studio web app or via the token form in the plugin.
-   **Load from file disabled** — The "Load from file" option is disabled when connected to Tokens Studio, keeping the server as the single source of truth.
-   **New themes** — When you create a theme in the plugin, it is immediately created on the server so your team sees it right away.
-   **No manual push needed** — Theme and reference changes are pushed automatically. You only need to use the manual push for bulk token set changes.

## Next Steps [​](#next-steps)

-   [Connecting to Figma](./connecting-to-figma.html) — Set up the plugin and connect to your project
-   [Syncing Variables](./syncing-variables.html) — Understand the variable sync flow
-   [Resolving Sync Conflicts](./resolving-sync-conflicts.html) — Handle conflicts between Studio and Figma