<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/extract-token -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Extract token [​](#extract-token)

### What It Does [​](#what-it-does)

The Extract token node retrieves a specific token from a set of tokens based on its name. It's useful for filtering out a single token from a larger collection for individual processing or reference.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Tokens | The collection of tokens to search through | List | Yes |
| Name | The name of the token to extract | Text | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Found | Boolean indicating whether the token was found | Yes/No |
| Token | The extracted token if found, otherwise undefined | Token |

### How to Use It [​](#how-to-use-it)

1.  Drag the Extract token node into your graph.
2.  Connect a list of tokens to the "Tokens" input.
3.  Connect the name of the token you want to extract to the "Name" input.
4.  The "Found" output will be true if the token was found, false otherwise.
5.  The "Token" output will contain the extracted token if found.

### Tips [​](#tips)

-   The token name must match exactly (case-sensitive).
-   Use the "Found" output to conditionally process the token only when it exists.

### See Also [​](#see-also)

-   **Destruct Token**: For breaking down the extracted token into its components.
-   **Create Design Token**: For creating new tokens based on extracted ones.

### Use Cases [​](#use-cases)

-   **Targeted Modification**: Extract specific tokens for individual processing or modification.
-   **Token References**: Pull specific tokens to reference in other token definitions.
-   **Token Validation**: Check if a specific token exists within a set.