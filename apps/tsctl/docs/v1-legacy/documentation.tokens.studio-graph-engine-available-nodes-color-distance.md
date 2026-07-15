<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/distance -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Distance [​](#distance)

### What It Does [​](#what-it-does)

The Distance node measures the geometric distance between two colors in a specified color space. Unlike Delta E, which measures perceptual difference, this node calculates raw mathematical distance between color coordinates. The output is based on the CIEDE2000 color difference formula.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Color A | First color for distance calculation | Color | No |
| Color B | Second color for distance calculation | Color | No |
| Precision | Number of decimal places in the result | Number | No |
| Space | Color space to perform calculation in (Lab, ICtCp, Jzazbz) | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The calculated distance between the colors | Number |

![](/images/CleanShot%202025-03-20%20at%2018.44.00@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Distance node into your graph.
2.  Connect two colors to "Color A" and "Color B" inputs.
3.  Select a color space (default is "Lab").
4.  Set the desired precision for the result (default is 4 decimal places).
5.  The output value indicates the geometric distance between the colors.

![](/images/CleanShot%202025-03-20%20at%2018.46.47@2x.png)

### Tips [​](#tips)

-   Different color spaces produce different results as they represent color differently.
-   Lab is generally a good default space for most design applications.
-   Higher values indicate greater distance/difference between colors.

### See Also [​](#see-also)

-   [**Delta E**](./delta-e): For calculating perceptually accurate color differences.
-   [**Sort Colors By Distance**](./sort-colors-by-distance): For sorting colors based on their differences.
-   [**Contrast**](./contrast): For calculating contrast ratio between colors.

### Use Cases [​](#use-cases)

-   **Color Sorting**: Organize colors based on their distance from a reference color.
-   **Color Difference Analysis**: Compare color similarity in mathematical terms.
-   **Color Space Exploration**: Understand how colors relate in different color spaces.