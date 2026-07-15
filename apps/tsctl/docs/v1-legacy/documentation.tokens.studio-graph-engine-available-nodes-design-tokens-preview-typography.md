<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/preview-typography -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Preview Typography [​](#preview-typography)

### What It Does [​](#what-it-does)

The Preview Typography node creates a visual preview of typography tokens, allowing designers and developers to see how text appears with the specified typographic styling. It renders sample text using the font properties defined in the typography tokens.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The typography tokens to preview | List | Yes |
| Text | The sample text to display (defaults to "The quick brown fox jumps over the lazy dog") | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| None | This node is primarily for visual preview and does not produce output data | \- |

### How to Use It [​](#how-to-use-it)

1.  Drag the Preview Typography node into your graph.
2.  Connect a list of typography tokens to the "Value" input.
3.  Optionally, provide custom text in the "Text" input to see your specific content with the typography styles.
4.  The node will display a visual preview of each typography token applied to the sample text.

### Tips [​](#tips)

-   Use this node as a visual check when creating or modifying typography tokens.
-   The default pangram ("The quick brown fox...") is useful as it contains all letters of the alphabet.
-   Customize the preview text to see how specific content will look with your typography tokens.

### See Also [​](#see-also)

-   **Create Typography**: For creating typography tokens.
-   **Create Typography Token**: For generating typography design tokens.

### Use Cases [​](#use-cases)

-   **Typography Validation**: Quickly verify the appearance of typography tokens during design system development.
-   **Visual Documentation**: Generate visual examples of typography styles for design system documentation.
-   **Style Comparison**: Compare multiple typography tokens to ensure visual consistency across your design system.