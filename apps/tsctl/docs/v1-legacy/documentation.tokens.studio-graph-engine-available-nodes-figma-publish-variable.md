<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/figma/publish-variable -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Figma](/graph-engine/available-nodes/figma)

# Publish Variable [​](#publish-variable)

### What It Does [​](#what-it-does)

The Publish Variable node controls whether a design token is published to Figma users. It allows you to make certain variables available or hidden in the Figma variables panel.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token | The design token to control publishing for | Token | Yes |
| Publish | Whether to publish this token to Figma | Yes/No | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token | The token with publishing setting applied | Token |

### How to Use It [​](#how-to-use-it)

1.  Drag the Publish Variable node into your graph.
2.  Connect a design token to the "Token" input.
3.  Set "Publish" to true (default) to make the token available to Figma users.
4.  Set "Publish" to false to hide the token, making it only available for references in other tokens.

### Tips [​](#tips)

-   Use this node to hide utility or intermediate tokens that aren't directly useful to designers.
-   Publishing fewer variables keeps the Figma variables panel cleaner and more user-friendly.

### See Also [​](#see-also)

-   **Code Syntax**: For adding code snippets to tokens visible in Figma.
-   **Scope By Type**: For automatically assigning appropriate Figma scopes.

### Use Cases [​](#use-cases)

-   **Design System Organization**: Show only the most essential variables to designers while keeping implementation details hidden.
-   **Developer-Only Tokens**: Hide technical tokens that are only needed for references or calculations.
-   **Variable Management**: Control which tokens from a larger set get exposed to designers in Figma.