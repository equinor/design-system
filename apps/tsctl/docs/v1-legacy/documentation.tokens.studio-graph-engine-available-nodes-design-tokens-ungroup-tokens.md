<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/ungroup-tokens -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Ungroup tokens [​](#ungroup-tokens)

### What It Does [​](#what-it-does)

The Ungroup tokens node extracts a subset of tokens from a hierarchical token set by removing a specified namespace. It allows you to access tokens from a deeper level in the hierarchy and bring them up to a higher level.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Name | The name of the group to extract (using dot notation for nested groups) | String | Yes |
| Token Set | The hierarchical token set containing the group to extract | Object | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token Set | The extracted subset of tokens from the specified group | Object |

### How to Use It [​](#how-to-use-it)

1.  Drag the Ungroup tokens node into your graph.
2.  Connect a token set to the "Token Set" input.
3.  Set the "Name" input to the path of the group you want to extract (e.g., "colors.primary").
4.  The node will extract the specified group and output it as a new token set.

### Tips [​](#tips)

-   Use dot notation (e.g., "colors.primary") to access deeply nested groups.
-   The node will throw an error if the specified group cannot be found in the token set.
-   This node is useful for isolating specific categories of tokens for focused processing.

### See Also [​](#see-also)

-   **Group**: For grouping tokens into a new namespace.
-   **Token set to token array**: For flattening an entire token set.

### Use Cases [​](#use-cases)

-   **Token Subset Processing**: Extract a specific category of tokens (like colors or typography) for specialized operations.
-   **Token Focus**: Isolate a set of related tokens to apply transformations specifically to them.
-   **Token Navigation**: Navigate through a complex token hierarchy to access specific subsets.