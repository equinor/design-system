<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/difference -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Difference [​](#difference)

### What It Does [​](#what-it-does)

The Difference node calculates the absolute difference between two numbers. It's useful for measuring the gap between values while disregarding which is larger.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| A | First number in the comparison | Number | No |
| B | Second number in the comparison | Number | No |
| Precision | How many decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Difference | The absolute difference between A and B | Number |

![](/images/CleanShot%202025-04-02%20at%2019.30.36@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Difference node into your graph.
2.  Connect your first number to the "A" input (e.g., `7.84`) or use the default (`0`).
3.  Connect your second number to the "B" (e.g., `13`) input or use the default (`0`).
4.  Optionally set the "Precision" input (defaults to 2 decimal places).
5.  The output will be the absolute value of the difference between the two numbers (e.g., `5.16`)

![](/images/CleanShot%202025-04-02%20at%2019.28.04@2x.png)

### Tips [​](#tips)

-   The result is always positive, regardless of which input is larger.
-   Use the precision input to control rounding (e.g., 0 for integers, 2 for cents).

### See Also [​](#see-also)

-   [**Absolute**](https://documentation.tokens.studio/graph-engine/available-nodes/math/absolute): For getting the absolute value of a single number.
-   [**Subtract**](https://documentation.tokens.studio/graph-engine/available-nodes/math/subtract): For getting the signed difference between numbers.

### Use Cases [​](#use-cases)

-   **Contrast Measurement**: Calculate the difference between foreground and background colors.
-   **Error Margins**: Determine how far a value deviates from a target.
-   **Spacing Consistency**: Check the difference between actual and intended spacing values.