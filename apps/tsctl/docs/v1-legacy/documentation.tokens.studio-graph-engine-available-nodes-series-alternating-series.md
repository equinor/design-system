<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/alternating-series -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Alternating Series [​](#alternating-series)

### What It Does [​](#what-it-does)

Creates a sequence where values alternate according to a repeating pattern. It applies a pattern of multipliers to an input sequence, allowing you to create alternating positive and negative values or other repeating patterns.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| sequence | The base sequence of numbers to transform | List | No |
| pattern | The pattern of multipliers to apply cyclically | List | No |
| precision | Number of decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The resulting alternating sequence | List |

![Alternating Series Example](/images/Screenshot%202025-04-17%20at%2012.49.24%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Alternating Series node into your graph.
2.  Set the "sequence" to your base values (default is \[1, 2, 3, 4\]).
3.  Set the "pattern" to define how values alternate (default is \[1, -1\]).
4.  Set the "precision" for decimal rounding (default is 2).
5.  Run the graph—with the default settings, your output will be \[1, -2, 3, -4\].

### Tips [​](#tips)

-   The default pattern \[1, -1\] creates a classic alternating positive/negative sequence.
-   Pattern values are not limited to 1 and -1; you can use any numbers to create custom patterns.
-   If the sequence is longer than the pattern, the pattern repeats cyclically.

### See Also [​](#see-also)

-   **Arithmetic Series**: For sequences with constant addition between terms.
-   **Geometric Series**: For sequences with constant multiplication between terms.
-   **Array Map**: For more complex transformations of arrays.

### Use Cases [​](#use-cases)

-   **Zigzag Patterns**: Create alternating visual layouts for tiles or elements.
-   **Oscillating Effects**: Generate sequences for wave-like animations or transitions.
-   **Signal Processing**: Create alternating patterns for signal manipulation.
-   **Checkerboard Layouts**: Generate values for grid-based designs with alternating properties.