<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/figma/code-syntax -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Figma](/graph-engine/available-nodes/figma)

# Code Syntax [​](#code-syntax)

### What It Does [​](#what-it-does)

The Code Syntax node defines code snippets for different platforms (Web, Android, iOS) that will appear in the Figma variables panel. It helps developers understand how to use design tokens in code.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token | The design token to add code syntax to | Token | Yes |
| Web | Web platform code syntax | Text | No |
| Android | Android platform code syntax | Text | No |
| iOS | iOS platform code syntax | Text | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token | The design token with added code syntax | Token |

### How to Use It [​](#how-to-use-it)

1.  Drag the Code Syntax node into your graph.
2.  Connect a design token to the "Token" input.
3.  Add code snippets for specific platforms (e.g., `$colors.primary` for Web, `R.color.primary` for Android).
4.  The token will now display these code references when published to Figma.

### Tips [​](#tips)

-   Only add syntax for platforms your team actually uses to avoid confusion.
-   Use platform-specific naming conventions to make the code useful for developers.

### See Also [​](#see-also)

-   **Publish Variable**: For controlling whether this token is published to Figma users.
-   **Scope By Type**: For automatically assigning appropriate Figma scopes.

### Use Cases [​](#use-cases)

-   **Design System Integration**: Provide developers with ready-to-use code snippets for each design token.
-   **Cross-Platform Development**: Display different syntax for each platform where the design token will be used.
-   **Developer Handoff**: Streamline the implementation process by showing exactly how to reference variables in code.