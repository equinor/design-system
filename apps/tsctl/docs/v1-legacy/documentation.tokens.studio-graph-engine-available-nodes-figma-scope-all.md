<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/figma/scope-all -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Figma](/graph-engine/available-nodes/figma)

# Scope All [​](#scope-all)

### What It Does [​](#what-it-does)

The Scope All node adds the ALL\_SCOPES scope to a design token, making it available for all possible uses in Figma. This allows the token to be used in any context within Figma's variables system.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token | The design token to add ALL\_SCOPES to | Token | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token | The token with ALL\_SCOPES applied | Token |

### How to Use It [​](#how-to-use-it)

1.  Drag the Scope All node into your graph.
2.  Connect a design token to the "Token" input.
3.  The node will add the ALL\_SCOPES scope to the token.
4.  The output token will be available for all possible uses in Figma.

### Tips [​](#tips)

-   Use this node when you want a token to be available everywhere in Figma.
-   This is ideal for universal tokens that should be applicable in any context.

### See Also [​](#see-also)

-   **Scope By Type**: For automatically assigning specific scopes based on token type.
-   **Scope Color**: For more granular control over color token scopes.

### Use Cases [​](#use-cases)

-   **Universal Tokens**: Make tokens like brand colors available for any purpose in Figma.
-   **Multi-purpose Variables**: Create variables that can be used across different contexts.
-   **Simplified Scope Management**: Avoid having to specify individual scopes for versatile tokens.