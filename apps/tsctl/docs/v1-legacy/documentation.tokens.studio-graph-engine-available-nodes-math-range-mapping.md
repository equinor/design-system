<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/range-mapping -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Range Mapping [​](#range-mapping)

### What It Does [​](#what-it-does)

Transforms a value from one numeric range to another. It takes a value within a source range and finds the equivalent value in a target range, maintaining the same relative position.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| inputValue | The value to transform | Number | No |
| inputMin | The minimum of the source range | Number | No |
| inputMax | The maximum of the source range | Number | No |
| outputMin | The minimum of the target range | Number | No |
| outputMax | The maximum of the target range | Number | No |
| clamp | Whether to restrict the result to the output range | Yes/No | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| mappedValue | The transformed value in the new range | Number |

![Range Mapping Example](/images/Screenshot%202025-04-22%20at%206.16.08%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Range Mapping node into your graph.
2.  Set "inputValue" to the number you want to transform (e.g., 50).
3.  Define your source range with "inputMin" (e.g., 0) and "inputMax" (e.g., 100).
4.  Define your target range with "outputMin" (e.g., 0) and "outputMax" (e.g., 1).
5.  Choose whether to clamp the result to the output range.
6.  Run the graph—with the example values, your output will be 0.5 (50% of the way between 0 and 1).

### Tips [​](#tips)

-   Ensure inputMin and inputMax are different values to avoid division by zero.
-   The output range can be reversed (e.g., outputMin=1, outputMax=0) to invert the mapping.
-   When clamp is enabled, the output will never exceed the output range boundaries.

### See Also [​](#see-also)

-   **Lerp**: For linear interpolation between two values.
-   **Clamp**: For restricting a value within a specific range.
-   **Math Scale**: For applying a scaling factor to a value.

### Use Cases [​](#use-cases)

-   **Responsive Design**: Map screen dimensions to appropriate element sizes.
-   **Data Visualization**: Convert raw data values to pixel coordinates for display.
-   **Animation Control**: Transform timing values into position, opacity, or scale values.
-   **Normalization**: Convert values from different scales into a common range (often 0-1).