<!-- source: https://documentation-v2.tokens.studio/tokens/creating-tokens.html -->

# Creating Tokens [​](#creating-tokens)

This guide covers how to create, edit, and delete tokens in Studio.

## Create a Single Token [​](#create-a-single-token)

1.  Navigate to the **Tokens** tab in your project
    
2.  Select the token set where you want to add the token (or create a new one)
    
3.  Click **New Token**
    
4.  Fill in the token details:
    
    -   **Name** — The token identifier (e.g., `blue.500`). Use dots to create nested groups.
    -   **Type** — Choose the token type (color, dimension, number, etc.)
    -   **Value** — Enter a literal value or a reference (e.g., `{primitives.colors.blue.500}`)
    -   **Description** — Optional description of what this token represents
    
    ![New token dialog](/images/tokens/new-token-dialog-light.png)![New token dialog](/images/tokens/new-token-dialog-dark.png)
    
5.  Click **Create Token**
    

## Batch Operations [​](#batch-operations)

Studio supports bulk operations for managing tokens at scale. Select multiple tokens using their checkboxes, then use the **Bulk Actions** button to apply operations in bulk.

The **Bulk Actions** dropdown provides the following options:

![Bulk actions menu](/images/tokens/bulk-actions-menu-light.png)![Bulk actions menu](/images/tokens/bulk-actions-menu-dark.png)

### Batch Create [​](#batch-create)

Create multiple tokens at once:

1.  Click **Batch Create** from the token set menu
2.  Define your tokens in the editor
3.  Review the preview
4.  Click **Create All**

### Batch Update [​](#batch-update)

Update properties across multiple tokens:

1.  Select the tokens you want to update
2.  Click **Bulk Actions** → **Batch Update**
3.  Choose which properties to change
4.  Apply the changes

### Batch Move [​](#batch-move)

Move tokens between token sets:

1.  Select the tokens to move
2.  Click **Bulk Actions** → **Batch Move**
3.  Choose the destination token set
4.  Confirm the move

### Bulk Type Change [​](#bulk-type-change)

Change the token type for multiple tokens at once. All 24 supported token types are available in the type dropdown, including semantic types like `opacity`, `fontSize`, `fontFamily`, and `space`.

1.  Select the tokens you want to retype
2.  Click **Bulk Actions** → **Change Type**
3.  Select the new type from the dropdown
4.  Review the coercion preview — Studio validates that each token's value can be converted to the new type
5.  Confirm the change

Studio preserves values where possible during type coercion. Simple values (references, strings, numbers) are kept as-is. Composite values that are incompatible with the target type are reset to defaults.

See [Token Types](./token-types.html) for the full list of supported types.

### Bulk Rename [​](#bulk-rename)

Rename multiple tokens using pattern matching:

1.  Select the tokens you want to rename
2.  Click **Bulk Actions** → **Rename**
3.  Configure the rename:
    -   **Match** — Pattern to match in the token name (optional — leave empty to replace the entire name)
    -   **Rename to** — The replacement template. Use `$&` to reference the matched text.
4.  Preview the changes
5.  Confirm the rename

Bulk rename supports regex patterns for advanced matching and replacement.

### Batch Delete [​](#batch-delete)

Delete multiple tokens:

1.  Select the tokens to delete
2.  Click **Bulk Actions** → **Batch Delete**
3.  Confirm the deletion

INFO

Deleted tokens are recorded as events. If you're working on a branch, the deletion only affects that branch until it's merged.

## Using References [​](#using-references)

To make a token reference another token, use curly brace syntax as the value:

```
{token-set-name.token-name}
```

For example, to create a semantic color that references a primitive:

-   **Name:** `primary`
-   **Type:** `color`
-   **Value:** `{primitives.colors.blue.500}`

When the referenced token changes, the referencing token's resolved value updates automatically.

## Editing Tokens [​](#editing-tokens)

1.  Click the menu icon (⋮) on the token you want to edit
    
2.  Select **Edit**
    
3.  Modify the name, value, description, or extensions
    
    ![Edit token dialog](/images/tokens/token-edit-dialog-light.png)![Edit token dialog](/images/tokens/token-edit-dialog-dark.png)
    
4.  Click **Save**
    

Each edit creates a new event in the history, so you can always see what changed and roll back if needed.

### Changing Token Types [​](#changing-token-types)

When you change a token's type (e.g., from color to dimension), Studio preserves the token's value where possible. Simple values like references (`{color.primary}`), strings (`12px`), and numbers are kept as-is. Composite values (such as shadow or typography) are reset to defaults, since the value structures are incompatible between types.

## Deleting Tokens [​](#deleting-tokens)

1.  Click the menu icon (⋮) on the token you want to delete
    
    ![Token context menu](/images/tokens/token-context-menu-light.png)![Token context menu](/images/tokens/token-context-menu-dark.png)
    
2.  Select **Delete**
    
3.  Confirm the deletion
    

On a branch, the token is only deleted on that branch. Other branches and the main branch are unaffected until you merge.

## Next Steps [​](#next-steps)

-   [Token types reference](./token-types.html) — All supported types and their value formats
-   [Token sets](./token-sets.html) — Organizing tokens into collections
-   [Importing tokens](./importing-tokens.html) — Bring in tokens from external files