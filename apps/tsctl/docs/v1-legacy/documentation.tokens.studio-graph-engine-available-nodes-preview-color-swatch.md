<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/preview/color-swatch -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Preview](/graph-engine/available-nodes/preview)

# Color Swatch [​](#color-swatch)

### What It Does [​](#what-it-does)

The Color Swatch node displays a single color in a swatch format. It provides a visual preview of a color for design reference.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The color to display as a swatch | Color | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| _No outputs_ | This node is for preview purposes only | \- |

![Color Swatch Example](/images/Screenshot%202025-04-08%20at%207.01.39%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Color Swatch node into your graph.
2.  Connect a color value to the "Value" input.
3.  The node will display the color as a swatch in the editor.
4.  Use it to visually check the appearance of the color in your design system.

![](/images/Screenshot%202025-04-08%20at%207.04.28%E2%80%AFPM%20\(1\).png)

### Tips [​](#tips)

-   Add multiple Color Swatch nodes to visualize different colors simultaneously.
-   Use this node at key points in your graph to monitor color transformations.

### See Also [​](#see-also)

-   [**Color Compare**](./color-compare): For comparing two colors side-by-side.
-   [**Color Scale**](./color-scale): For visualizing a sequence of colors.

### Use Cases [​](#use-cases)

-   **Color Verification**: Visually confirm the exact appearance of generated colors.
-   **Design System Reference**: Display brand colors or theme colors for reference.
-   **Color Transformation**: Monitor color changes after operations like lightening, darkening, or mixing.