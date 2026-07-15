<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/lerp -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Lerp [​](#lerp)

### What It Does [​](#what-it-does)

Performs linear interpolation between two values. It calculates a point that is a specified fraction of the way between two numbers, creating a smooth transition from one value to another.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| a | The starting value | Number | No |
| b | The ending value | Number | No |
| t | The interpolation factor (0-1) | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The interpolated result | Number |

### How to Use It [​](#how-to-use-it)

1.  Drag the Lerp node into your graph.
2.  Set "a" to your starting value (e.g., 0).
3.  Set "b" to your ending value (e.g., 100).
4.  Set "t" to the interpolation factor between 0 and 1 (e.g., 0.5).
5.  Run the graph—with the example values, your output will be 50 (halfway between 0 and 100).

### Tips [​](#tips)

-   When t=0, the output equals a; when t=1, the output equals b.
-   The t value is not limited to the 0-1 range. Values outside this range will extrapolate rather than interpolate.
-   For color transitions, use the Color Mix node which performs color-aware interpolation.

### See Also [​](#see-also)

-   **Range Mapping**: For mapping a value from one range to another.
-   **Sample Curve**: For non-linear interpolation using curves.
-   **Color Mix**: For interpolating between colors.

### Use Cases [​](#use-cases)

-   **Animations**: Calculate in-between values for smooth transitions.
-   **Responsive Design**: Adjust values based on screen size or other parameters.
-   **Data Visualization**: Generate intermediate values for graphs and charts.
-   **Gradual Adjustments**: Create incremental changes between two states or values.