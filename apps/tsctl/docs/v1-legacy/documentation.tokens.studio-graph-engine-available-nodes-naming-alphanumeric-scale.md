<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/naming/alphanumeric-scale -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Naming](/graph-engine/available-nodes/naming)

# Alphanumeric Scale [​](#alphanumeric-scale)

### What It Does [​](#what-it-does)

The Alphanumeric Scale node generates combined letter-number identifiers (like A1, B2, C3) based on provided indices. It's useful for creating hierarchical naming systems with both alphabetic and numeric components.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Letter Index | Letter index (0 = A, 1 = B, etc.) | Number | Yes |
| Number Index | Number index (0 = 1, 1 = 2, etc.) | Number | Yes |
| Uppercase | Output letter in uppercase (true) or lowercase (false) | Boolean | No |
| Prefix | Optional text to add before the alphanumeric value | String | No |
| Suffix | Optional text to add after the alphanumeric value | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The generated alphanumeric value with optional prefix and suffix | String |

![](/images/CleanShot%202025-04-03%20at%2022.19.06@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Alphanumeric Scale node into your graph.
2.  Connect numbers to the "Letter Index" (for e.g., 0 for A) and "Number Index" inputs (for e.g., 0 for 1), or set them directly.
3.  Configure optional inputs like case preference and prefix/suffix text.
4.  The node will output a combined letter-number identifier (like "A1", "b2", etc.).

![](/images/CleanShot%202025-04-03%20at%2022.20.11@2x.png)

### Tips [​](#tips)

-   Letter indices are clamped to the English alphabet range (0-25).
-   Number indices automatically have 1 added (so index 0 produces "1").
-   Combine with Count nodes to generate sequential alphanumeric identifiers.

### See Also [​](#see-also)

-   [**Alphabetic Scale**](./alphabetic-scale): For generating only alphabetic identifiers.
-   [**Numeric Scale**](./numeric-scale): For generating only numeric identifiers.

### Use Cases [​](#use-cases)

-   **Grid Systems**: Create cell identifiers for design grids (A1, A2, B1, B2).
-   **Variant Naming**: Organize component variants with hierarchical identifiers.
-   **Section Numbering**: Create section identifiers for design documentation.