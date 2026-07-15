<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/inverse-linear-mapping -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Inverse Linear Mapping [​](#inverse-linear-mapping)

### What It Does [​](#what-it-does)

Maps a value from one numeric range to another, similar to range mapping. It takes a value within a source range and finds the equivalent value in a target range, maintaining the same relative position.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The value to transform | Number | No |
| inMin | The minimum of the source range | Number | No |
| inMax | The maximum of the source range | Number | No |
| outMin | The minimum of the target range | Number | No |
| outMax | The maximum of the target range | Number | No |
| clamp | Whether to restrict the result to the output range | Yes/No | No |
| precision | Number of decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The transformed value in the new range | Number |

![Inverse Linear Mapping Example](/images/Screenshot%202025-04-22%20at%206.07.36%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Inverse Linear Mapping node into your graph.
2.  Set "value" to the number you want to transform (e.g., 0.5).
3.  Define your source range with "inMin" (e.g., 0) and "inMax" (e.g., 1).
4.  Define your target range with "outMin" (e.g., 0) and "outMax" (e.g., 100).
5.  Choose whether to clamp the result to the output range.
6.  Set the "precision" for decimal rounding (default is 2).
7.  Run the graph—with the example values, your output will be 50.

### Tips [​](#tips)

-   Ensure inMin and inMax are different values to avoid division by zero.
-   The output range can be reversed (e.g., outMin=100, outMax=0) to invert the mapping.
-   When clamp is enabled, the output will never exceed the output range boundaries.

### See Also [​](#see-also)

-   **Range Mapping**: A similar node in the Math category with the same functionality.
-   **Lerp**: For linear interpolation between two values.
-   **Clamp**: For restricting a value within a specific range.

### Use Cases [​](#use-cases)

-   **Responsive Design**: Map screen dimensions to appropriate element sizes.
-   **Data Visualization**: Convert raw data values to pixel coordinates for display.
-   **Animation Control**: Transform timing values into position, opacity, or scale values.
-   **Normalization**: Convert values from different scales into a common range (often 0-1).