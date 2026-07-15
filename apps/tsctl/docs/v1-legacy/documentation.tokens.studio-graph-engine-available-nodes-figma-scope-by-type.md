<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/figma/scope-by-type -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Figma](/graph-engine/available-nodes/figma)

# Scope By Type [​](#scope-by-type)

### What It Does [​](#what-it-does)

The Scope By Type node automatically assigns appropriate Figma scopes to a token based on its type. It intelligently determines where a token can be used in Figma based on its data type.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token | The design token to automatically scope | Token | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token | The token with automatically assigned scopes | Token |

### How to Use It [​](#how-to-use-it)

1.  Drag the Scope By Type node into your graph.
2.  Connect a design token to the "Token" input.
3.  The node automatically assigns appropriate scopes based on the token type.
4.  The output token will have Figma scopes that match its intended use.

### Tips [​](#tips)

-   This node saves time by automatically determining the right scopes for different token types.
-   Review the assigned scopes if you need specific control over where tokens appear in Figma.

### See Also [​](#see-also)

-   **Scope All**: For making a token available in all possible contexts.
-   **Scope Color**: For more granular control over color token scopes.
-   **Scope Number**: For detailed control over number token scopes.

### Use Cases [​](#use-cases)

-   **Bulk Token Processing**: Quickly assign appropriate scopes to many tokens at once.
-   **Design System Setup**: Ensure all tokens have sensible scope defaults when being published to Figma.
-   **Token Type Conversion**: Automatically update scopes when a token changes type.