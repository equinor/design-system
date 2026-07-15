<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/create-reference -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Create Reference [​](#create-reference)

### What It Does [​](#what-it-does)

The Create Reference node builds a token reference string by joining path segments with dots and wrapping them in curly braces. It's used for creating references to other tokens in your design system.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Segments | Token path segments (can add multiple) | Text | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Reference | The formatted token reference | Text |

### How to Use It [​](#how-to-use-it)

1.  Drag the Create Reference node into your graph.
2.  Connect one or more text values as segments (like "colors", "primary", "base").
3.  The node will join these segments with dots and wrap them in curly braces.
4.  The output will be a reference string (e.g., "{colors.primary.base}").

### Tips [​](#tips)

-   Add as many segment inputs as needed to build your reference path.
-   The reference format follows the W3C Design Tokens standard.
-   If no segments are provided, the output will be an empty string.

### See Also [​](#see-also)

-   **Create Design Token**: For creating tokens that can use these references.
-   **Resolve**: For resolving references to their actual values.

### Use Cases [​](#use-cases)

-   **Token Aliasing**: Create references to reuse token values in multiple places.
-   **Theme Building**: Create references to base tokens for theme variations.
-   **Component Tokens**: Reference system tokens from component-specific tokens.