<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/flatten-token-sets -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Flatten Token Sets [​](#flatten-token-sets)

### What It Does [​](#what-it-does)

The Flatten Token Sets node combines multiple arrays of tokens into a single flat array, removing any duplicate tokens by name. If tokens with the same name appear in multiple input arrays, only the token from the array with higher precedence is kept.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Array of Tokens | A nested array containing multiple token arrays to be flattened | List of Lists | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Tokens | A single flattened array of tokens with duplicates removed | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Flatten Token Sets node into your graph.
2.  Connect multiple token arrays to the "Array of Tokens" input.
3.  The node will combine all tokens into a single array, removing duplicates based on token names.
4.  The resulting flat array contains unique tokens, with precedence given to tokens that appear later in the input arrays.

### Tips [​](#tips)

-   The order of input arrays matters - tokens from later arrays will override tokens with the same name from earlier arrays.
-   This node is useful for merging multiple token sets while handling conflicts.
-   Use this node when you need to merge tokens from different sources or components of a design system.

### See Also [​](#see-also)

-   **Token set to token array**: For flattening hierarchical token structures.
-   **Array to Set**: For converting a flat array back to a hierarchical structure.

### Use Cases [​](#use-cases)

-   **Token Merging**: Combine tokens from multiple sources while handling naming conflicts.
-   **Theme Construction**: Merge base tokens with theme-specific tokens, allowing theme tokens to override base tokens.
-   **Token Deduplication**: Remove duplicate tokens from multiple collections while preserving the most important ones.