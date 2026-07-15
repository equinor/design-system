<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/arithmetic-series -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Arithmetic Series [​](#arithmetic-series)

### What It Does [​](#what-it-does)

The Arithmetic Series node generates a sequence of numbers where each value increases or decreases by a constant amount. It creates evenly-spaced numerical progressions for scales, grids, and other design patterns.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Base | The central value of the series | Number | No |
| Steps Down | Number of steps to generate below the base value | Number | No |
| Steps Up | Number of steps to generate above the base value | Number | No |
| Increment | The constant value to add/subtract between steps | Number | No |
| Precision | Number of decimal places for the output values | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Array | The resulting sequence of numbers | List |
| Indexed | Array of objects with index and value properties | List |

![Arithmetic Series Example](/images/Screenshot%202025-04-17%20at%201.16.19%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Arithmetic Series node into your graph.
2.  Set the "Base " value `21` (default: 16) as the center point of your series.
3.  Configure "Steps Down" (default: 0) and "Steps Up" (default: 1) to control series length.
4.  Adjust the "Increment" (default: 1) to set spacing between values.

### Tips [​](#tips)

-   The "Steps Down" parameter generates values below your base (smaller values).
-   The "Steps Up" parameter generates values above your base (larger values).

### See Also [​](#see-also)

-   **Geometric Series**: For creating exponential progressions where values multiply by a ratio.
-   **Linear Space**: For creating evenly spaced values between specific endpoints.

### Use Cases [​](#use-cases)

-   **Spacing Systems**: Create evenly-spaced size tokens for layout grids (4, 8, 12, 16, 20, 24).
-   **Font Size Scales**: Generate linear type scales (12, 14, 16, 18, 20px).
-   **Color Steps**: Define evenly-spaced opacity or intensity values (0.2, 0.4, 0.6, 0.8).