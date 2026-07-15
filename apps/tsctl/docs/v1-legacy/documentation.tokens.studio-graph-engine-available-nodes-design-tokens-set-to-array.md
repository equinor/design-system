<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/set-to-array -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Token set to token array [​](#token-set-to-token-array)

### What It Does [​](#what-it-does)

The Token set to token array node converts a hierarchical token set structure into a flat array of individual tokens. It transforms nested token collections into a simple list that can be processed by nodes that expect token arrays.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token Set | A hierarchical collection of design tokens | Object | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Tokens | A flat array of all tokens from the input set | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Token set to token array node into your graph.
2.  Connect a token set object to the "Token Set" input.
3.  The node will flatten the hierarchical structure and output all tokens as a simple array.
4.  Use the resulting token array with nodes that process individual tokens.

### Tips [​](#tips)

-   This node preserves all token information including name, value, and type.
-   The resulting array contains all tokens regardless of their original nesting level.
-   Particularly useful when working with external token formats that use hierarchical structures.

### See Also [​](#see-also)

-   **Array to Set**: For converting in the opposite direction.
-   **Flatten**: For more advanced flattening operations on token arrays.

### Use Cases [​](#use-cases)

-   **Processing External Tokens**: Convert imported token sets into a format that can be processed by the graph.
-   **Token Transformation**: Prepare tokens from a nested structure for batch operations.
-   **Token Analysis**: Create a flat list of all tokens for inspection or validation.