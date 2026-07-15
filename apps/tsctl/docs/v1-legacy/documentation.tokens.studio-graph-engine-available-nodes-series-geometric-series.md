<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/geometric-series -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Geometric Series [​](#geometric-series)

### What It Does [​](#what-it-does)

The Geometric Series node generates a sequence where each number is multiplied by a constant ratio. It creates exponential progressions perfect for scales that require accelerating or decelerating growth.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Base | The central value of the series | Number | No |
| Steps Down | Number of steps to generate below the base value | Number | No |
| Steps Up | Number of steps to generate above the base value | Number | No |
| Ratio | The multiplier between consecutive values | Number | No |
| Precision | Number of decimal places for the output values | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Array | The resulting sequence of numbers | List |
| Indexed | Array of objects with index and value properties | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Geometric Series node into your graph.
2.  Set the "Base" value (default: 16) as the center point of your series.
3.  Configure "Steps Down" (default: 0) and "Steps Up" (default: 1) to control series length.
4.  Adjust the "Ratio" (default: 1.5) to set the multiplier between values.

![Geometric Series Example](/images/Screenshot%202025-04-17%20at%205.18.49%E2%80%AFPM.png)

### Tips [​](#tips)

-   With ratio > 1, values increase exponentially as you move up from the base.
-   With ratio < 1 but > 0, values decrease exponentially as you move up from the base.

### See Also [​](#see-also)

-   **Arithmetic Series**: For creating linear progressions with constant differences.
-   **Power Series**: For creating progressions based on powers of a number.

### Use Cases [​](#use-cases)

-   **Type Scales**: Create font size systems with meaningful proportional relationships (8, 12, 18, 27, 40.5).
-   **Spacing Systems**: Define spacing tokens with accelerating growth (4, 8, 16, 32, 64).
-   **Visual Hierarchy**: Generate size scales that create clear visual distinctions between elements.