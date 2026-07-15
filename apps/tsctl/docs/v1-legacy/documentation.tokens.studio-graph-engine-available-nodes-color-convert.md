<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/convert -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Convert Color [​](#convert-color)

### What It Does [​](#what-it-does)

Transforms a color from one color space to another. This allows you to change how a color is represented and measured, which is useful for different operations and color manipulations.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| color | The color to convert | Color | Yes |
| space | The target color space (e.g., srgb, hsl, oklch) | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| color | The converted color in the new color space | Color |

![](/images/CleanShot%202025-03-20%20at%2013.28.12@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Convert Color node into your graph.
2.  Connect a color (like `#FF0000`) to the "color" input.
3.  Select a color space (like "oklch") from the "space" dropdown or input.
4.  Run the graph—your output will be the same color but represented in the new color space.

### Tips [​](#tips)

-   Different color spaces are better for different operations: HSL for hue adjustments, OKLCH for perceptual lightness.
-   Converting between spaces preserves the visual color but changes how its values are structured.

### See Also [​](#see-also)

-   [**Create Color**](./create): For building a color from raw values in a specific color space.
-   [**Deconstruct Color**](./deconstruct): For breaking a color into its component values.

### Use Cases [​](#use-cases)

-   **Perceptual Editing**: Convert to OKLCH to make perceptually uniform color adjustments.
-   **HSL Manipulations**: Convert to HSL to easily modify hue, saturation, or lightness independently.
-   **Color System Standardization**: Ensure all colors in your design system use the same color space for consistent manipulation.