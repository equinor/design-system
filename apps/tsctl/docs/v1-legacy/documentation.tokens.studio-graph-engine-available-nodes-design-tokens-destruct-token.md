<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/destruct-token -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Destruct token [​](#destruct-token)

### What It Does [​](#what-it-does)

The Destruct token node breaks down a design token into its individual components. It's useful for accessing specific parts of a token for reference, modification, or creating new tokens.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token | The design token to break down | Token | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Name | The token's identifier | Text |
| Description | The token's description | Text |
| Type | The token's type (color, typography, etc.) | Text |
| $extensions | Additional metadata for the token | Object |
| Value | The token's primitive value (for basic tokens) | Text |
| Border | The token's border value (for border tokens) | Border |
| Typography | The token's typography value (for typography tokens) | Typography |
| Box Shadow | The token's box shadow values (for box shadow tokens) | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Destruct token node into your graph.
2.  Connect a token to the "Token" input.
3.  The node outputs all the individual components of the token.
4.  Only the outputs relevant to the token type will have values.

### Tips [​](#tips)

-   Not all outputs will contain data - only those relevant to the token type.
-   For references (like `{color.primary}`), the Value output will contain the reference string.

### See Also [​](#see-also)

-   **Create Design Token**: For creating new tokens using the extracted components.
-   **Extract Single Token**: For extracting one token from a collection.

### Use Cases [​](#use-cases)

-   **Token Modification**: Extract, modify, and recreate tokens with updated values.
-   **Token Analysis**: Examine the structure and properties of existing tokens.
-   **Token Transformation**: Convert between different token formats or structures.