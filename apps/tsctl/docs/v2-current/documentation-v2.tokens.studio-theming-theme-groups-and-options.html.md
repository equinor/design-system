<!-- source: https://documentation-v2.tokens.studio/theming/theme-groups-and-options.html -->

# Theme Groups and Options [​](#theme-groups-and-options)

Themes let you define variations of your design tokens — like light mode and dark mode, different brand palettes, or density levels.

## Concepts [​](#concepts)

### Theme Groups [​](#theme-groups)

A theme group represents a dimension of variation. For example:

-   **Color Mode** — Light, Dark
-   **Brand** — Brand A, Brand B
-   **Density** — Compact, Comfortable, Spacious

### Theme Options [​](#theme-options)

Theme options are the individual values within a group. "Light" and "Dark" are options within the "Color Mode" group.

### How It Works [​](#how-it-works)

When you create theme options, you specify which token values should change for each option. Tokens that don't have a theme-specific value use their default.

![Theme groups overview](/images/theming/themes-overview-light.png)![Theme groups overview](/images/theming/themes-overview-dark.png)

## Creating a Theme Group [​](#creating-a-theme-group)

1.  Go to the **Themes** tab in your project
2.  Click **New Theme Group**
3.  Enter a name (e.g., "Color Mode")
4.  Click **Create**

## Adding Theme Options [​](#adding-theme-options)

1.  Select a theme group
    
    ![Theme group detail](/images/theming/theme-group-detail-light.png)![Theme group detail](/images/theming/theme-group-detail-dark.png)
    
2.  Click **New Theme Option**
    
3.  Enter a name (e.g., "Light")
    
4.  Map tokens to their theme-specific values:
    
    -   Select a token set
    -   Override token values for this theme option
    
    ![Theme option detail](/images/theming/theme-option-detail-light.png)![Theme option detail](/images/theming/theme-option-detail-dark.png)
    
5.  Click **Save**
    

Repeat for each option (e.g., "Dark").

## Example: Light and Dark Mode [​](#example-light-and-dark-mode)

Given these semantic tokens:

| Token | Default (Light) | Dark Override |
| --- | --- | --- |
| `background` | `#FFFFFF` | `#1A1A2E` |
| `text.primary` | `#111827` | `#F9FAFB` |
| `text.secondary` | `#6B7280` | `#9CA3AF` |
| `surface` | `#F3F4F6` | `#2D2D44` |

In your theme setup:

1.  Create a theme group called **Color Mode**
2.  Add option **Light** (uses the default values)
3.  Add option **Dark** with overrides for each token

When tokens are resolved, Studio applies the active theme options to produce the correct values.

## Theme-Aware Exports [​](#theme-aware-exports)

When you export or resolve tokens, you can specify which theme options are active. The resolved values will reflect the combination of all active theme options.

## Next Steps [​](#next-steps)

-   [Multi-dimensional theming](./multi-dimensional-theming.html) — Combine multiple theme axes
-   [Working with theme variants](./working-with-theme-variants.html) — Practical workflows