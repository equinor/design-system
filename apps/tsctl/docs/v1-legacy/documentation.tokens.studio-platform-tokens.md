<!-- source: https://documentation.tokens.studio/platform/tokens/ -->

[Platform](/platform)

# Tokens [​](#tokens)

![](/images/Tokens%20and%20Themes.png)

The Tokens Module in Studio is where you manage and organize your design tokens. It references other existing sections of the documentation where relevant, so you can easily connect to broader workflows (for example, [Import from Tokens Studio for Figma](./../../getting-started/setting-up-studio/import-from-tokens-studio-for-figma) or [Themes](./../themes/)).

## Video walkthrough [​](#video-walkthrough)

## Page Structure [​](#page-structure)

When you open the Tokens Module in a Studio project, the layout is divided into two main parts:

1.  **Left Pane** – Displays your token sets and any organizational folders.
2.  **Right Pane** – Shows detailed views for whichever folder or set you have selected—usually referred to as the Tokens Table.

![](/images/image%20\(2\)%20\(1\).png)

You’ll also find:

-   A top bar with search capabilities and actions like Create new set, Upload tokens, or Download tokens.
-   A theme selector at the bottom of the left pane, letting you choose which theme context is active (see more in [Themes](./../themes/)).

## Navigating Sets and Folders [​](#navigating-sets-and-folders)

On the left side, you’ll see a structure consisting of Sets and Folders:

-   **Sets**: Contain actual tokens (e.g., colors, typography, spacing). You can rename, duplicate, or delete them.
-   **Folders**: Virtual groupings that help organize multiple sets. They don’t contain tokens directly but let you cluster sets logically.

INFO

#### You can rename, duplicate and delete sets and folders. When deleting a folder, you will delete all sets within. Be sure to confirm that any relationships aren't broken. [​](#you-can-rename-duplicate-and-delete-sets-and-folders.-when-deleting-a-folder-you-will-delete-all-sets-within.-be-sure-to-confirm-that-any-relationships-arent-broken.)

![](/images/image%20\(10\).png)

When clicking on a folder, you'll see a list of sub-folders and sets within. You can see a timestamp stating when it was last edited timestamp and number of tokens for each set.

## Creating a New Set [​](#creating-a-new-set)

**Step 1**

Click **New Set** in the top navigation bar.

This will open a modal window where you'll be asked to add a Name and Description (optional)

If you'd like to create a folder for the set to appear in, you can provide the folder name followed by a forward-slash. eg. `global/color`

DANGER

Avoid using spaces in your naming as references will be difficult to resolve

### Step 2: Choose a static or graph based set. [​](#step-2-choose-a-static-or-graph-based-set.)

If you're tokens are simple values that don't have complex rules for generation, a Static set is the best tool.

For complex relationships and algorithmic token generation, choose **Graph-based set.** You can learn more about creating [Graph-based sets here](./../../graph-engine/introduction).

You can learn more about the benefits of each option in [Token Sets](./token-sets)

![](/images/Create%20New%20Set.gif)

### Uploading Tokens [​](#uploading-tokens)

When creating a new set, you can directly upload tokens from JSON files.

For details on uploading tokens from Figma, see [Import from Tokens Studio for Figma](./../../getting-started/setting-up-studio/import-from-tokens-studio-for-figma) or [Import from Figma Variables](./../../getting-started/setting-up-studio/import-from-figma-variables).

## Features of the Tokens Table [​](#features-of-the-tokens-table)

Selecting a set from the left pane will switch the right side to Tokens Table view. This view is familiar to a spreadsheet, enabling quick, inline editing of values and properties.

### Table Columns [​](#table-columns)

Each row in a table displays:

-   **Token Type** – e.g., color, typography, dimension, etc.
-   **Name** – The name used to refer to the token (can include hierarchical naming conventions).
-   **Value** – the token’s raw or referenced value. eg. `{radii.none}` or `#ff00ff`
-   **Resolved Value** – the final, resolved value taking references into account. If you have set the value to refer to a token in another set, the resolved value will be the result. This may change if you use [themes](./../themes/ "mention").
-   **Description** – an optional field to clarify the token’s purpose or usage.

![](/images/image%20\(11\).png)

### Inline Editing [​](#inline-editing)

-   Enter – switches a cell into edit mode (for simpler tokens like color, dimension, number).
-   Space – opens a more detailed editor for more complex tokens (e.g., typography or shadow) where multiple attributes need configuration.

![](/images/Opening%20with%20Space%20and%20Return%20Key.gif)

### Referencing and Resolved Value [​](#referencing-and-resolved-value)

If a token’s value references another token, you’ll see a badge indicating whether the reference is valid in the **Value** column, and the resolved value displayed.

![](/images/image%20\(12\).png)

### Visualizing Token Flows [​](#visualizing-token-flows)

Each token row has a checkbox on the far left. Selecting one or more tokens enables extra actions. One notable action is **Show Token Flow**, which provides a visualization of how tokens reference each other—where a token’s value originates and which tokens depend on it.

![](/images/Token%20Flow.gif)

### Bulk Actions [​](#bulk-actions)

When you select multiple tokens (by checking rows), you can apply bulk actions such as renaming, duplicating, changing the type of token, changing the values, moving and deleting.

![](/images/image%20\(14\).png)

### Folder and File Controls [​](#folder-and-file-controls)

At the top of the Tokens Table, you’ll see breadcrumbs showing your current folder path and file (set) name.

Clicking on the pencil icon button, you can open a context menu that will allow you to rename the file (set) name in place and update the description.

Clicking on the three dots will open a context menu that , download the set as JSON, Duplicate the set and delete it entirely.

![](/images/CleanShot%202025-02-17%20at%2015.02.16.png)

### Searching Token Sets [​](#searching-token-sets)

On the top-right of the table there are tools to allow you to filter by token type

-   Filter by token type
-   Search tokens by name
-   Adjust nesting level (helpful for sets with hierarchical token naming)
-   Add Token (also available at the bottom of the table in quick-edit mode)

![](/images/CleanShot%202025-02-17%20at%2014.55.17%20\(1\).png)

### Theming Context [​](#theming-context)

At the bottom of the left panel, you can pick or create Theme Groups and Theme Options. Choosing a theme changes how references resolve across your tokens.  
To learn more about theming, see [Themes](./../themes/).

![](/images/Themes.png)

## Next Steps [​](#next-steps)

-   Import tokens from existing sources:
    -   [Import from Figma variables](./../../getting-started/setting-up-studio/import-from-figma-variables)
    -   [Import from Tokens Studio for Figma](./../../getting-started/setting-up-studio/import-from-tokens-studio-for-figma)
-   Configure or refine your themes: [Themes](https://chatgpt.com/g/platform/features/themes.md)
-   Leverage advanced references with Graph-based sets

By combining sets, folders, and robust theming, the Tokens Module provides an efficient way to organize your design tokens and keep them updated across different contexts and outputs. If you need more details on advanced usage, head to our [SDKs](./../../development/sdks) or [CLI](./../../development/cli) docs to learn about integrating tokens into your codebase.