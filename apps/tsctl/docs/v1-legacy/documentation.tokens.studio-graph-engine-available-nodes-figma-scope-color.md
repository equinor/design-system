<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/figma/scope-color -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Figma](/graph-engine/available-nodes/figma)

# Scope Color [​](#scope-color)

### What It Does [​](#what-it-does)

The Scope Color node defines specific variable scopes for color tokens in Figma. It allows precise control over where and how color variables can be used within the Figma interface.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Token | The design token to add scopes to | Token | Yes |
| All Fills | Include all fills scope | Yes/No | No |
| Effects | Include effects scope | Yes/No | No |
| Frame Fill | Include frame fill scope | Yes/No | No |
| Shape Fill | Include shape fill scope | Yes/No | No |
| Stroke | Include stroke scope | Yes/No | No |
| Text Fill | Include text fill scope | Yes/No | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token | The token with color scopes applied | Token |

### How to Use It [​](#how-to-use-it)

1.  Drag the Scope Color node into your graph.
2.  Connect a color token to the "Token" input.
3.  Check the boxes for contexts where the color should be available (e.g., Text Fill, Stroke).
4.  The output token will be available in Figma only for the selected contexts.

### Tips [​](#tips)

-   Only select the scopes that make sense for your color's intended use.
-   Using more specific scopes creates a cleaner variables panel in Figma.

### See Also [​](#see-also)

-   **Scope All**: For making a color available in all possible contexts.
-   **Scope By Type**: For automatically assigning appropriate scopes based on token type.

### Use Cases [​](#use-cases)

-   **Text-Only Colors**: Create color variables that only appear as options for text fills.
-   **Stroke-Specific Colors**: Define colors that are only available for strokes but not fills.
-   **UI Color Organization**: Separate colors by their function to create a more intuitive design system.