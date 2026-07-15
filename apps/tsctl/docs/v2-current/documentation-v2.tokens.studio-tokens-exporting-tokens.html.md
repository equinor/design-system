<!-- source: https://documentation-v2.tokens.studio/tokens/exporting-tokens.html -->

# Exporting Tokens [​](#exporting-tokens)

Studio provides multiple ways to get your tokens out and into your codebase or design tools. The **Exports** page lets you configure platform-specific output formats directly in the browser, while releases and the API give you programmatic access for CI/CD workflows.

## Resolved Tokens [​](#resolved-tokens)

When you export tokens, Studio resolves all references and produces the final computed values. For example:

```
primary → {blue.500} → #3B82F6
```

The export will contain `#3B82F6` as the value for `primary`.

### Multi-Theme Exports [​](#multi-theme-exports)

When your project uses multiple themes, Studio exports all theme variants. Each theme option produces its own set of resolved values, ensuring that token overrides and token set ordering are applied correctly across all dimensions.

## Export Formats [​](#export-formats)

Studio supports several built-in export formats, each tailored to a specific platform or workflow. You can configure these from the **Exports** tab in your project.

![Exports overview](/images/figma/exports-overview-light.png)![Exports overview](/images/figma/exports-overview-dark.png)

### CSS Variables [​](#css-variables)

CSS custom properties with multi-theme support, cascade layers, and framework presets.

### DTCG JSON [​](#dtcg-json)

W3C Design Token Community Group JSON interchange format.

### Raw JSON [​](#raw-json)

Raw token sets and themes for custom tooling.

### Figma Variables [​](#figma-variables)

Figma Variable collections with modes and aliases.

## Export Configuration [​](#export-configuration)

When you select an export format, Studio shows format-specific configuration options and a live preview of the generated output.

![Export CSS detail](/images/figma/export-css-detail-light.png)![Export CSS detail](/images/figma/export-css-detail-dark.png)

### CSS Variables Options [​](#css-variables-options)

When configuring the CSS Variables export:

-   **Color Space** — The color space for exported values (e.g., `as-authored`)
-   **Default Strategy** — How theme variants are scoped in the output (e.g., `data-attribute`)
-   **Prefix** — A prefix added to all CSS custom property names (e.g., `ds` produces `--ds-color-primary`)
-   **Casing** — The naming convention for variable names (e.g., `kebab`)
-   **Separator** — The character used to separate token name segments
-   **Layers** — Enable CSS cascade layers for the output
-   **Root Selector** — The CSS selector wrapping the output (defaults to `:root`)
-   **Minify** — Minify the generated CSS output
-   **Source Comments** — Include source token references as CSS comments
-   **Theme Groups** — Select which theme groups to include in the export

### Output Preview [​](#output-preview)

Each export format shows a file tree on the left and a code preview on the right. You can browse the generated files and download individual files or the entire output.

-   **Download** — Download the currently selected file
-   **Download All** — Download all generated files as a bundle

## Export via CLI [​](#export-via-cli)

The Tokens Studio CLI supports exporting tokens directly from the command line. The CLI uses a unified export pipeline that matches the browser-based export formats. You can discover available export formats and use preview flags to access formats still in development.

See the [CLI documentation](./../cli/overview.html) for setup and usage instructions.

## Export via Releases [​](#export-via-releases)

The primary way to trigger exports in a CI/CD workflow is through [releases](./../releases/creating-a-release.html). When you create a release:

1.  Go to the **Releases** tab
    
    ![Releases tab](/images/releases/releases-tab-light.png)![Releases tab](/images/releases/releases-tab-dark.png)
    
2.  Studio snapshots all tokens on the selected branch
    
3.  Studio resolves all references and theme values
    
4.  Any configured [webhooks](./../integrations/webhooks.html) or [CI/CD pipelines](./../integrations/ci-cd-triggers.html) are triggered
    

Your CI/CD pipeline can then fetch the resolved tokens via the API and transform them using tools like Style Dictionary.

## Export via API [​](#export-via-api)

Use the API to fetch resolved tokens programmatically:

```
GET /api/v1/projects/:project_id/resolved_tokens
```

This returns all tokens with their resolved values for the specified branch and theme configuration.

See the [API Reference](./../api/tokens.html) for full details.

## Export to Figma [​](#export-to-figma)

Studio syncs tokens to Figma as variables and styles:

-   **Variables** — Token values are pushed to Figma variable collections
-   **Styles** — Paint, text, effect, and grid styles can be synced

See [Figma Integration](./../figma/connecting-to-figma.html) for setup instructions.

## Next Steps [​](#next-steps)

-   [Creating a release](./../releases/creating-a-release.html)
-   [Working with themes](./../theming/working-with-theme-variants.html)
-   [Webhooks](./../integrations/webhooks.html)
-   [CI/CD triggers](./../integrations/ci-cd-triggers.html)
-   [API reference](./../api/overview.html)