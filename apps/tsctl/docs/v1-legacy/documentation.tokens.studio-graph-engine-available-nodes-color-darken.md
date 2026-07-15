<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/darken -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Darken Color [​](#darken-color)

### What It Does [​](#what-it-does)

Makes a color darker by reducing its lightness by a specified amount. It's perfect for creating shades of a base color or generating darker variants for hover states and hierarchical elements.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| color | The color to darken | Color | No |
| value | How much to darken the color (0-1) | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The darkened color | Color |

![](/images/CleanShot%202025-03-20%20at%2016.02.26@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Darken Color node into your graph.
2.  Connect a color (like `#5C9AFF`) to the "color" input.
3.  Set a value between 0 and 1 (like `0.3`) to the "value" input.
4.  Run the graph—your output will be a darker version of the input color (`#1d59b8`).

![](/images/CleanShot%202025-03-20%20at%2016.05.25@2x.png)

### Tips [​](#tips)

-   A value of 0 makes no change, while 1 produces black.
-   Use small increments (0.1-0.3) for subtle darkening effects in UI states.

### See Also [​](#see-also)

-   [**Lighten Color**](./lighten): For making colors lighter instead of darker.
-   [**Mix Colors**](./mix): For blending a color with black for more control.

### Use Cases [​](#use-cases)

-   **Button States**: Create darker variants of a button color for hover and active states.
-   **Color Scales**: Generate a range of related dark shades from a base color.
-   **Background Hierarchy**: Create darker backgrounds for elevated or nested UI elements.