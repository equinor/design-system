<!-- source: https://documentation-v2.tokens.studio/theming/working-with-theme-variants.html -->

# Working with Theme Variants [​](#working-with-theme-variants)

This guide covers practical workflows for managing themes in Studio.

## Previewing Theme Variants [​](#previewing-theme-variants)

You can preview how your tokens look under different theme configurations directly in Studio:

1.  Go to the **Tokens** tab
2.  Use the theme selector in the toolbar to choose active theme options
3.  The token list updates to show the resolved values for that theme combination
4.  Switch between themes to compare values

## Mapping Tokens to Themes [​](#mapping-tokens-to-themes)

When you create a theme option, you define which tokens change:

1.  Open the theme option editor
2.  Select a token set to configure
3.  For each token that should change in this theme, set the override value
4.  Tokens without an override inherit their default value

### Best Practice: Keep Primitives Constant [​](#best-practice-keep-primitives-constant)

A common pattern is to only theme your semantic tokens, not your primitives:

-   **Primitives** (e.g., `blue.500 = #3B82F6`) — Same across all themes
-   **Semantic** (e.g., `primary = {blue.500}`) — Varies by theme

This way, your primitive palette is stable and your semantic layer handles all the theming logic.

## Themes and Figma [​](#themes-and-figma)

When syncing with Figma, theme options map to Figma variable modes:

| Studio | Figma |
| --- | --- |
| Theme Group | Variable Collection |
| Theme Option | Mode |

Each theme option becomes a mode in the corresponding Figma variable collection. See [Syncing Variables](./../figma/syncing-variables.html) for details.

## Themes and Exports [​](#themes-and-exports)

When creating a release or fetching tokens via the API, specify which theme options are active to get the correct resolved values:

```
GET /api/v1/projects/:id/resolved_tokens?theme_options[]=light&theme_options[]=brand-a
```

## Tips [​](#tips)

-   **Start simple.** Begin with one theme group (e.g., Color Mode) and expand to multi-dimensional theming as your system matures.
-   **Name clearly.** Use descriptive names for theme groups and options so your team understands what each one controls.
-   **Test combinations.** If you have multiple theme dimensions, test that all combinations produce sensible results.

## Next Steps [​](#next-steps)

-   [Theme groups and options](./theme-groups-and-options.html)
-   [Multi-dimensional theming](./multi-dimensional-theming.html)
-   [Syncing with Figma](./../figma/syncing-variables.html)