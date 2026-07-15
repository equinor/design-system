<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/name-color -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Name Color [​](#name-color)

### What It Does [​](#what-it-does)

The Name Color node identifies the closest standard [CSS color name](https://www.w3schools.com/tags/ref_colornames.asp) for any color. It compares the input color to all named web colors and returns the name with the smallest perceptual difference.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Color | The color to identify | Color | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The name of the closest matching CSS color | String |

![](/images/CleanShot%202025-03-21%20at%2017.43.05@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Name Color node into your graph.
2.  Connect any color to the "Color" input (like `#E91BCB`).
3.  The node will automatically find the closest CSS color name.
4.  The output will be a string like "fuchsia", "mediumorchid", or "firebrick".

![](/images/CleanShot%202025-03-21%20at%2017.46.10@2x.png)

### Tips [​](#tips)

-   This node uses perceptual distance (Delta E) for matching to available CSS colors and provide accurate naming.
-   CSS named colors are limited, so the result might not be an exact match.

### See Also [​](#see-also)

-   [**String to Color**](./string-to-color): For the reverse operation - converting color names to colors.
-   [**Delta E**](./delta-e): For calculating the difference between colors.

### Use Cases [​](#use-cases)

-   **Color Communication**: Convert exact color values to human-readable names for team discussions.
-   **Design Documentation**: Generate descriptive color names for design specifications.
-   **Data Visualization**: Simplify color data by grouping similar colors under standard names.