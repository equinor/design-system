<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/delta-e -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Delta E [​](#delta-e)

### What It Does [​](#what-it-does)

The Delta E node calculates the perceptual distance between two colors. It provides a numeric measurement of how different two colors appear to the human eye, using various industry-standard algorithms.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Color A | First color for comparison | Color | No |
| Color B | Second color for comparison | Color | No |
| Precision | Number of decimal places in the result | Number | No |
| Algorithm | Color difference algorithm to use (76, CMC, 2000, Jz, ITP, OK) | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The calculated color difference (Delta E) | Number |

![](/images/CleanShot%202025-03-20%20at%2016.51.31@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Delta E node into your graph.
2.  Connect two colors to "Color A" and "Color B" inputs.
3.  Choose an algorithm (default is "2000", which is the industry-standard CIEDE2000).
4.  Set the desired precision for the result (default is 4 decimal places).
5.  The output value indicates how different the colors appear (higher values = more different).

![](/images/CleanShot%202025-03-20%20at%2016.56.59@2x.png)

### Tips [​](#tips)

-   Values below 1.0 are generally imperceptible to the human eye.
-   Values between 1.0 and 2.0 are perceptible only with close observation.
-   The CIEDE2000 (2000) algorithm is the most accurate for design work.

### See Also [​](#see-also)

-   [**Distance**](./distance): For calculating geometric distance between colors.
-   [**Contrast**](./contrast): For calculating contrast ratio between colors.
-   [**Sort Colors By Distance**](./sort-colors-by-distance): For sorting colors based on their differences.

### Use Cases [​](#use-cases)

-   **Color Matching**: Verify how close two colors appear to each other.
-   **Palette Refinement**: Ensure colors in a palette are sufficiently distinct.
-   **Accessibility Validation**: Check if color variations are perceptually different enough.