<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/leonardo-theme -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Leonardo Theme [​](#leonardo-theme)

### What It Does [​](#what-it-does)

The Leonardo Theme node generates accessible color values based on Adobe's Leonardo color system. It takes Leonardo color configurations and produces a theme of colors that meet specified contrast requirements. The node calculates and outputs an array of colors that can be used to create design tokens.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Colors | Array of Leonardo color configurations | Array of LeonardoColor | Yes |
| Contrast | Global contrast modifier | Number | Yes |
| Lightness | Global lightness modifier | Number | Yes |
| Saturation | Global saturation modifier | Number | Yes |
| Background Color | Leonardo color configuration for the background | LeonardoColor | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Colors | Array of calculated color values | Array of Colors |

### How to Use It [​](#how-to-use-it)

1.  Drag the Leonardo Theme node into your graph.
2.  Connect an array of Leonardo Color node outputs to the "Colors" input.
3.  Connect a number to the "Contrast" input to adjust the global contrast.
4.  Connect a number to the "Lightness" input to adjust the global lightness.
5.  Connect a number to the "Saturation" input to adjust the global saturation.
6.  Connect a Leonardo Color node output to the "Background Color" input.
7.  The node outputs an array of calculated color values that can be further processed into design tokens.

### Tips [​](#tips)

-   The Background Color input is crucial as it determines the contrast base for all other colors.
-   Experiment with different contrast, lightness, and saturation values to fine-tune your color theme.
-   Connect the output to token creation nodes to integrate the colors into your design token system.
-   For best results, use a consistent approach to creating your input Leonardo colors.

### See Also [​](#see-also)

-   **Leonardo Color**: For creating Leonardo color configurations to feed into this node.
-   **Create Color Design Token**: For creating standard color tokens from the output colors.
-   **Create Design Token**: For creating other types of design tokens.

### Use Cases [​](#use-cases)

-   **Accessible Design Systems**: Generate complete color themes that meet WCAG accessibility guidelines.
-   **Adaptive Interfaces**: Create color systems that adapt to different background colors while maintaining accessibility.
-   **Brand Color Palettes**: Develop expanded color palettes from core brand colors that ensure contrast and readability.
-   **Dark/Light Themes**: Generate matching themes for both dark and light modes with guaranteed accessibility.