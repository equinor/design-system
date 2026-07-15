<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/linear-space -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Linear Space [​](#linear-space)

### What It Does [​](#what-it-does)

Generates a sequence of evenly spaced numbers between a start and end value. It divides the interval into equal steps, creating a uniform progression from the first to the last value.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| start | The first value in the sequence | Number | No |
| stop | The last value in the sequence | Number | No |
| length | The number of values to generate | Number | No |
| precision | Number of decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The sequence of evenly spaced values | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Linear Space node into your graph.
2.  Set the "start" value (default is 0).
3.  Set the "stop" value (default is 1).
4.  Set the "length" to specify how many values you want (default is 5).
5.  Set the "precision" for decimal rounding (default is 2).
6.  Run the graph—with the default settings, your output will be \[0, 0.25, 0.5, 0.75, 1\].

![Linear Space Example](/images/Screenshot%202025-04-22%20at%206.11.24%E2%80%AFPM.png)

### Tips [​](#tips)

-   The sequence always includes both the start and stop values.
-   For reversed sequences, set start higher than stop.
-   If length is 1, the output will be an array with just the start value.

### See Also [​](#see-also)

-   **Arithmetic Series**: For sequences defined by a base value and increment.
-   **Range Mapping**: For mapping a single value from one range to another.
-   **Array Map**: For transforming each element in an array with a function.

### Use Cases [​](#use-cases)

-   **Gradients**: Create evenly distributed color stops.
-   **Animation Keyframes**: Generate evenly spaced keyframe values.
-   **Data Visualization**: Create axis divisions or data sampling points.
-   **Layout Systems**: Generate evenly spaced position values for elements.