<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/name-tokens -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Name tokens [​](#name-tokens)

### What It Does [​](#what-it-does)

The Name tokens node renames a collection of tokens sequentially by their index position. It automatically assigns names in multiples of 100 (100, 200, 300, etc.) based on each token's position in the array.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Tokens | The collection of tokens to rename | List | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Tokens | The renamed tokens with sequential names | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Name tokens node into your graph.
2.  Connect a list of tokens to the "Tokens" input.
3.  The output will be the same tokens but with names set to "100", "200", "300", etc. based on their position.
4.  Use these renamed tokens in other nodes that require named tokens.

### Tips [​](#tips)

-   This node overwrites any existing names in the tokens.
-   The naming pattern follows multiples of 100, making it easy to insert tokens between existing ones later.

### See Also [​](#see-also)

-   **Alphabetic**: For naming tokens with alphabetic sequences.
-   **Numeric**: For more customizable numeric naming patterns.

### Use Cases [​](#use-cases)

-   **Automatic Naming**: Quickly name a set of tokens without manually entering each name.
-   **Token Scale Creation**: Create evenly spaced naming for token scales (e.g., spacing or sizing scales).
-   **Token Organization**: Establish a clear numerical ordering for tokens in a collection.