<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/fibonacci-series -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Fibonacci Series [​](#fibonacci-series)

### What It Does [​](#what-it-does)

The Fibonacci Series node generates a sequence where each number is the sum of the two preceding ones. It creates a naturally occurring progression that appears in many design patterns and natural forms.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Length | Total number of values to generate in the sequence | Number | No |
| Start First | The first value in the sequence | Number | No |
| Start Second | The second value in the sequence | Number | No |
| Precision | Number of decimal places for the output values | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Array | The resulting Fibonacci sequence | List |

![Fibonacci Series Example](/images/Screenshot%202025-04-17%20at%204.31.48%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Fibonacci Series node into your graph.
2.  Set the "Length" (default: 8) to determine how many values to generate.
3.  Optionally customize the "Start First" (default: 0) and "Start Second" (default: 1) values.
4.  The node outputs the classic Fibonacci sequence by default: \[0, 1, 1, 2, 3, 5, 8, 13\].

### Tips [​](#tips)

-   The classic Fibonacci sequence uses 0 and 1 as starting values, but you can customize them.
-   Each number in the sequence is approximately 1.618 (the golden ratio) times the preceding number.

### See Also [​](#see-also)

-   **Arithmetic Series**: For creating linear progressions with constant differences.
-   **Geometric Series**: For creating exponential progressions with constant ratios.

### Use Cases [​](#use-cases)

-   **Natural Scaling**: Create size progressions that mimic natural growth patterns.
-   **Golden Ratio Layouts**: Design layouts using the aesthetically pleasing golden ratio.
-   **Organic Size Systems**: Develop spacing systems with a more organic feel than linear scales.