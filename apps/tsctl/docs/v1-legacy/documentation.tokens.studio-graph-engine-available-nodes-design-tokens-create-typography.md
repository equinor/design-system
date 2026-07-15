<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/create-typography -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Create a Typography [​](#create-a-typography)

### What It Does [​](#what-it-does)

The Create a Typography node generates a composite typography value by combining font properties like family, weight, size, and spacing. It's used to define consistent text styles in your design system.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Font Family | The font family name (e.g., "Inter" or "Roboto") | Text | No |
| Font Weight | The font weight (e.g., "400" or "Bold") | Text | No |
| Font Size | The font size (e.g., "16px" or "1rem") | Text | No |
| Line Height | The line height (e.g., "24px" or "1.5") | Text | No |
| Letter Spacing | The letter spacing (e.g., "0.5px" or "-0.01em") | Text | No |
| Paragraph Spacing | The spacing between paragraphs | Text | No |
| Text Decoration | The text decoration (e.g., "none" or "underline") | Text | No |
| Text Case | The text case transformation (e.g., "none" or "uppercase") | Text | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The composite typography value | Typography |

### How to Use It [​](#how-to-use-it)

1.  Drag the Create a Typography node into your graph.
2.  Connect values to the typography properties you want to define.
3.  Leave optional properties empty if you don't need them.
4.  The output provides a typography value that can be used in typography tokens.

### Tips [​](#tips)

-   You only need to specify the properties you want to use, leaving others blank.
-   Font sizes and spacing can use any CSS units (px, rem, em, etc.).

### See Also [​](#see-also)

-   **Create Typography Token**: For creating a complete typography token with name and metadata.
-   **Create Design Token**: For creating other types of design tokens.

### Use Cases [​](#use-cases)

-   **Text Styles**: Create consistent typography styles for headings, body text, and captions.
-   **Design System**: Define a typographic scale with harmonious sizes and spacing.
-   **Brand Guidelines**: Implement typography according to brand guidelines.