<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/color-wheel -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Color Wheel [​](#color-wheel)

### What It Does [​](#what-it-does)

Generates a set of colors arranged in a color wheel pattern. Starting from a base hue, it creates a specified number of colors by rotating around the color wheel at consistent intervals, while maintaining the same saturation and lightness values.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| baseHue | The starting hue angle (0-360 degrees) | Number | No |
| angle | The total angle to rotate around the color wheel | Number | No |
| saturation | The saturation percentage for all colors (0-100) | Number | No |
| lightness | The lightness percentage for all colors (0-100) | Number | No |
| colors | The number of colors to generate | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | An array of evenly spaced colors | List of Colors |

![](/images/CleanShot%202025-03-20%20at%2011.19.51@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Color Wheel node into your graph.
2.  Set the "baseHue" to your starting hue angle (default is 360/0, which is red).
3.  Set the "angle" to determine how far around the wheel to go (default is 180 degrees).
4.  Adjust "saturation" and "lightness" to control the vibrancy and brightness (defaults are 80%).
5.  Set the "colors" value to determine how many colors to generate (default is 8).
6.  Run the graph—your output will be an array of colors evenly distributed around the wheel.
7.  Connect a [Color Scale](./../vector2/scale) preview node to visualise your output.

![](/images/CleanShot%202025-03-20%20at%2011.25.40@2x.png)

![](/images/CleanShot%202025-03-20%20at%2011.45.27.gif)

### Tips [​](#tips)

-   For a full color wheel, set angle to 360 degrees.
-   For complementary colors, use 2 colors with angle 180.
-   For triadic colors, use 3 colors with angle 360.
-   For analogous colors, use 3-5 colors with a smaller angle (30-60 degrees).

### See Also [​](#see-also)

-   [**Range**](./range): For creating a range between two specific colors.
-   [**Scale Colors**](./../preview/color-scale): For generating a graduated scale of a single color.
-   [**Mix Colors**](./mix): For blending between two specific colors.

### Use Cases [​](#use-cases)

-   **Color Harmonies**: Create complementary, triadic, or other color schemes.
-   **Data Visualization**: Generate distinct colors for charts and graphs.
-   **UI Theming**: Develop consistent color families for interface elements.