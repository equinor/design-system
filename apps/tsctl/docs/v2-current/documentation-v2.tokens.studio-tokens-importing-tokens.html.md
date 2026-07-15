<!-- source: https://documentation-v2.tokens.studio/tokens/importing-tokens.html -->

# Importing Tokens [​](#importing-tokens)

Studio supports importing tokens from multiple formats, making it easy to bring in your existing design tokens.

## Supported Import Formats [​](#supported-import-formats)

| Format | Description |
| --- | --- |
| **DTCG JSON** | W3C Design Tokens Community Group format (`.json`) |
| **Tokens Studio** | Tokens Studio for Figma plugin format |
| **Figma Variables** | Import directly from a connected Figma file |

## Import from File [​](#import-from-file)

1.  Navigate to the **Tokens** tab
2.  Click **Import**
3.  Select your file or drag it into the upload area
4.  Studio will detect the format automatically
5.  Review the import preview — you'll see which tokens will be created, updated, or flagged with errors
6.  Select or deselect individual tokens as needed
7.  Click **Import** to confirm

### Import Options [​](#import-options)

During import, you can configure:

-   **Target token set** — Import into an existing set or create new ones based on the file structure
-   **Conflict resolution** — How to handle tokens that already exist (skip, overwrite, or rename)
-   **Prefix** — Add a prefix to all imported token names

### Importing Tokens with Validation Errors [​](#importing-tokens-with-validation-errors)

Studio allows you to import tokens even if they have validation errors. All tokens are selected by default during import, including ones with issues. This lets you bring in your full token set and fix problems afterwards rather than being blocked at import time.

Tokens with validation issues are marked in the import preview:

-   An error icon appears next to tokens with schema validation errors (e.g. an invalid color value)
-   A warning icon appears for tokens with non-critical issues
-   Error and warning counts are shown per token set in the sidebar

When you have tokens with errors selected, the import footer shows a count of how many tokens have errors. The tooltip reads: "These tokens will import with their current value. Fix the error in the editor after import."

After importing, broken tokens are preserved with their original values. You can edit them in the Tokens Editor to correct any issues — the values survive the import as-is and are fully editable.

### Import Report [​](#import-report)

After reviewing the import preview, you can download a report that lists all errors and warnings. The report includes the token name, set, type, the full token payload, and the specific error message. This is useful for debugging validation issues across large imports.

## Import from Figma Variables [​](#import-from-figma-variables)

If you've connected Studio to Figma:

1.  Go to the **Variables** tab
2.  Click **Sync from Figma**
3.  Select which variable collections to import
4.  Review the sync preview
5.  Confirm the import

See [Syncing Variables](./../figma/syncing-variables.html) for detailed instructions.

## Import Tips [​](#import-tips)

-   **Preserve your structure.** If your JSON file uses nested objects, Studio maps them to token names with dot-separated paths (e.g., `colors.blue.500`).
-   **Check references.** If your tokens use references (`{other.token}`), make sure the referenced tokens are also included in the import.
-   **Use branches.** Import into a branch first so you can review the changes before merging to main.

## Next Steps [​](#next-steps)

-   [Exporting tokens](./exporting-tokens.html)
-   [Syncing with Figma](./../figma/syncing-variables.html)
-   [Token types reference](./token-types.html)