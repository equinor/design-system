<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/naming/hierarchy-level -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Naming](/graph-engine/available-nodes/naming)

# Hierarchy Level [​](#hierarchy-level)

### What It Does [​](#what-it-does)

The Hierarchy Level node generates hierarchical level names (primary, secondary, tertiary, etc.) based on an index value. It provides semantic naming for items in a hierarchical structure.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Index | Level index (0 = primary, 1 = secondary, etc.) | Number | Yes |
| Prefix | Optional text to add before the level name | String | No |
| Suffix | Optional text to add after the level name | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The generated hierarchy level name with optional prefix and suffix | String |

![](/images/CleanShot%202025-04-03%20at%2023.07.22@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Hierarchy Level node into your graph.
2.  Connect a number to the "Index" input or set it directly (0-9).
3.  Optionally add prefix and suffix text if needed.
4.  The node will output the corresponding hierarchy level name (like "primary", "secondary", "tertiary").

![](/images/CleanShot%202025-04-03%20at%2023.08.54@2x.png)

### Tips [​](#tips)

-   The index is clamped between 0-9, supporting up to 10 hierarchy levels.
-   Use these semantic names instead of numbers when creating hierarchical design systems.

### See Also [​](#see-also)

-   [**T-shirt Size**:](./t-shirt-size) For generating scale-based naming (XS, S, M, L, XL).
-   [**Numeric Scale**:](./numeric-scale) For generating numeric sequences.

### Use Cases [​](#use-cases)

-   **Button Hierarchy**: Define semantic levels for buttons (primary, secondary, tertiary).
-   **Typography System**: Create named heading levels beyond h1-h6 nomenclature.
-   **Color Importance**: Define a semantic color system based on hierarchical importance.