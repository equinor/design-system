<!-- source: https://documentation-v2.tokens.studio/theming/multi-dimensional-theming.html -->

# Multi-Dimensional Theming [​](#multi-dimensional-theming)

Studio supports multi-dimensional theming, which lets you combine independent theme axes to create complex design system variations.

## What Is Multi-Dimensional Theming? [​](#what-is-multi-dimensional-theming)

In a single-dimensional theme system, you pick one option from one group — like "Dark Mode." In a multi-dimensional system, you pick one option from each group and they combine:

| Dimension | Options |
| --- | --- |
| Color Mode | Light, Dark |
| Brand | Primary, Secondary |
| Density | Compact, Comfortable |

A specific configuration might be: **Dark × Primary × Compact** — and Studio resolves the correct token values for that combination.

## Setting It Up [​](#setting-it-up)

1.  Create multiple theme groups in the **Themes** tab:
    
    -   Color Mode (Light, Dark)
    -   Brand (Primary, Secondary)
    -   Density (Compact, Comfortable)
2.  For each theme option, override the relevant tokens:
    
    -   **Dark** overrides background colors, text colors
    -   **Secondary** overrides brand colors, accent colors
    -   **Compact** overrides spacing, padding, font sizes
3.  When resolving tokens, select one option from each group.
    

## How Resolution Works [​](#how-resolution-works)

Studio applies theme options in layer order. If multiple theme options override the same token, the last-applied option wins. You control the order by arranging your theme groups.

For most design systems, dimensions are independent — color mode affects colors, density affects spacing — so conflicts are rare.

## Use Cases [​](#use-cases)

-   **White-labeling** — Different brands with different color palettes, combined with shared light/dark modes
-   **Responsive density** — Compact layouts for desktop, comfortable for tablet, spacious for mobile
-   **Accessibility** — High-contrast mode as an additional theme dimension
-   **Regional variants** — Different typographic styles per region, combined with global color themes

## Next Steps [​](#next-steps)

-   [Theme groups and options](./theme-groups-and-options.html) — Basics of theming
-   [Working with theme variants](./working-with-theme-variants.html)