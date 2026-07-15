<!-- source: https://documentation-v2.tokens.studio/figma/exporting-variables.html -->

# Exporting Variables [​](#exporting-variables)

Once your variables are synced between Studio and Figma, you can export them into code-ready formats for your development team.

INFO

This guide is for **variable-based projects**. If your project uses tokens as the source of truth, see [Exporting Tokens](./../tokens/exporting-tokens.html) instead.

## Getting to the Exports Tab [​](#getting-to-the-exports-tab)

There are two ways to reach the Exports tab for your project:

1.  **From the Companion plugin in Figma** — Click the **Export to CSS** button at the bottom of the sync screen. This opens the Exports tab in Studio in your browser.
2.  **Directly in Studio** — Open your project and click **Exports** in the left sidebar.

## Available Export Formats [​](#available-export-formats)

The Exports tab shows the formats you can use, split into two groups.

### Create New [​](#create-new)

These formats have full configuration options. When you click on one, you can name your export, adjust settings, and see a live preview of the output before saving.

**CSS Variables** — Generates CSS custom properties from your variables. Each mode in your collection becomes a separate CSS file (e.g., Dark.css, Light.css). Variables are scoped using data attributes or CSS classes depending on your configuration. You can configure:

-   **Color Space** — Choose the output color format (as-authored, hex, rgb, hsl, oklch, oklab, p3)
-   **Default Strategy** — How modes are scoped in the output (data-attribute or class)
-   **Naming** — Set a prefix for variable names, choose a casing convention (kebab, camel, etc.), and customize the separator
-   **Layers** — Enable CSS cascade layers and set a layer prefix
-   **Root Selector** — The CSS selector wrapping the output (defaults to `:root`)
-   **Minify** — Minify the generated CSS
-   **Source Comments** — Add source references as CSS comments
-   **Files** — Choose the file layout (split or combined) and set the base file name

**TypeScript** — Generates TypeScript type unions and value maps from your variables. You can configure:

-   **Color Space** — Choose the output color format (hex, rgb, etc.)
-   **Naming** — Set the const casing (e.g., camelCase) and key casing (e.g., as-authored)
-   **Type Style** — How types are generated (e.g., literal-union)
-   **Value Map** — Output format for the value map (e.g., record)
-   **Output Strategy** — How files are organized (e.g., per-type)
-   **Include Descriptions** — Include variable descriptions in the output
-   **Numeric Keys** — Handle numeric key formatting
-   **Collections** — Select which collections to include in the export

### Other Exports [​](#other-exports)

These formats generate output immediately with no configuration needed. Click on one to see the output and download it.

**Raw JSON** — Exports your variables as simple JSON files organized by collection and mode. Each mode gets its own file with variable names and hex values. Also includes a Configuration folder with `$themes.json` and `$metadata.json` files for use with custom tooling.

**DTCG JSON** — Exports in the W3C Design Token Community Group format. Files are organized by collection and mode. Each variable includes `$type`, `$value` (with color channels and color space), following the DTCG specification.

**Figma Variables** — Exports a Figma-compatible JSON file containing your collections, modes, variables, types, scopes, and values. Shows an export summary with the number of collections, variables, and permutations before the output.

## Previewing and Downloading [​](#previewing-and-downloading)

All formats show a file tree on the left and a code preview on the right. You can browse the generated files to see exactly what the output looks like. Use the buttons in the top right to:

-   **Download** — Download the currently selected file
-   **Download All** — Download all generated files as a bundle

For CSS Variables and TypeScript exports, the preview updates in real time as you change configuration options, so you can see the effect of each setting before saving.

## Next Steps [​](#next-steps)

-   [Syncing Variables](./syncing-variables.html) — Set up the connection between Studio and Figma
-   [Creating a Release](./../releases/creating-a-release.html) — Version and publish snapshots of your variables for your team to consume
-   [CI/CD Pipeline Triggers](./../integrations/ci-cd-triggers.html) — Automatically trigger your CI/CD pipeline when a release is created
-   [Tokens Studio CLI](./../cli/overview.html) — Pull and export your variables from the command line