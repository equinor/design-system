<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/range -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Range [​](#range)

### What It Does [​](#what-it-does)

Creates a sequence of colors that transition smoothly between two endpoint colors. Perfect for generating color palettes, gradients, or stepping between design tokens with customizable interpolation.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| colorA | The starting color | Color | No |
| colorB | The ending color | Color | No |
| space | The color space to interpolate in | String | No |
| hue | How to interpolate the hue (shorter, longer, etc.) | String | No |
| steps | Number of colors to generate (including endpoints) | Number | No |
| progression | The interpolation curve (linear, quadratic, cubic) | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| colors | Array of colors transitioning from colorA to colorB | List |

![](/images/CleanShot%202025-03-21%20at%2017.43.58@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Range node into your graph.
2.  Connect your starting color (like `#3366FF`) to the "colorA" input.
3.  Connect your ending color (like `#FF6633`) to the "colorB" input.
4.  Set the color "space" to interpolate in (like lab).
5.  Set "steps" to the number of colors you want (e.g., 5).
6.  Set the progression to define the interpolation (like linear).
7.  Run the graph—your output will be an array of colors that form a smooth transition.

![](/images/CleanShot%202025-03-21%20at%2017.47.06@2x.png)

### Tips [​](#tips)

-   Different color spaces produce different transitions. "Lab" and "Oklch" usually give the most perceptually uniform results.
-   The "progression" parameter controls the easing of the transition—try different options for varied effects.

### See Also [​](#see-also)

-   [**Mix Colors**](./mix): For blending just two colors together.
-   [**Scale Colors**](./scale): For creating variants of a single color.

### Use Cases [​](#use-cases)

-   **Color Palettes**: Generate a consistent palette with evenly spaced colors for data visualization.
-   **Gradient Creation**: Build multi-stop gradient definitions for backgrounds or UI elements.
-   **Token Scales**: Create a complete set of design tokens from light to dark for a design system.