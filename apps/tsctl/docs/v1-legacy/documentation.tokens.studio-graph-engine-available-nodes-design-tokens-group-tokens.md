<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/group-tokens -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Group tokens [​](#group-tokens)

### What It Does [​](#what-it-does)

The Group tokens node adds a namespace to a token set, placing all tokens under a new group name. It creates a hierarchical structure by nesting the entire token set under the specified name.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Name | The name to use as the new group namespace | String | Yes |
| Token Set | The token set to be grouped under the new namespace | Object | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token Set | The resulting token set with all tokens grouped under the new namespace | Object |

### How to Use It [​](#how-to-use-it)

1.  Drag the Group tokens node into your graph.
2.  Connect a token set to the "Token Set" input.
3.  Set the "Name" input to the desired namespace (e.g., "colors").
4.  The node will create a new token set with all tokens nested under the specified name.

### Tips [​](#tips)

-   This node is useful for organizing tokens into logical categories.
-   You can create deeper nesting by using dot notation in the name (e.g., "theme.dark").
-   Group multiple token sets separately and then merge them to create a comprehensive token structure.

### See Also [​](#see-also)

-   **Ungroup tokens**: For removing a namespace from tokens.
-   **Array to Set**: For converting a flat array of tokens to a hierarchical structure.

### Use Cases [​](#use-cases)

-   **Token Organization**: Organize tokens into logical categories like colors, typography, or spacing.
-   **Theme Creation**: Create theme-specific token sets by grouping tokens under theme names.
-   **Token Merging**: Prepare token sets for merging by grouping them under different namespaces.