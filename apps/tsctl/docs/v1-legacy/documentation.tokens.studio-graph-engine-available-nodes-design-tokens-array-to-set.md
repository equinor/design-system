<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/array-to-set -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Array of Tokens to Set [​](#array-of-tokens-to-set)

### What It Does [​](#what-it-does)

The Array of Tokens to Set node converts a flat array of tokens into a hierarchical token set structure. It transforms a simple list of tokens into a nested object structure, organizing tokens based on their names.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Tokens | A flat array of design tokens | List | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token Set | A hierarchical collection of tokens organized by their names | Object |

### How to Use It [​](#how-to-use-it)

1.  Drag the Array of Tokens to Set node into your graph.
2.  Connect an array of tokens to the "Tokens" input.
3.  The node will organize the tokens into a hierarchical structure based on the name properties of each token.
4.  Use the resulting token set with nodes that require structured token collections.

### Tips [​](#tips)

-   Token names with periods or slashes (e.g., `colors.primary` or `colors/primary`) will be converted into nested objects in the resulting set.
-   This node is useful for preparing tokens for export to file formats that expect a hierarchical structure.
-   All token metadata is preserved during the conversion process.

### See Also [​](#see-also)

-   **Token set to token array**: For converting in the opposite direction.
-   **Group**: For more customizable grouping operations on token arrays.

### Use Cases [​](#use-cases)

-   **Token Export Preparation**: Convert a processed list of tokens back into a structured format for export.
-   **Token Organization**: Automatically organize a flat list of tokens into a logical hierarchy.
-   **Token Structure Rebuilding**: Restore hierarchical structure to tokens that have been flattened for processing.