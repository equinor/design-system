<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/power -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Power [​](#power)

### What It Does [​](#what-it-does)

The Power node raises a base number to the power of an exponent. It's useful for creating exponential growth, quadratic curves, and scaling values non-linearly.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Base | The number to be raised to a power | Number | Yes |
| Exponent | The power to raise the base to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The result of base^exponent | Number |

![Power Example](/images/Screenshot%202025-04-08%20at%204.38.55%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Power node into your graph.
2.  Connect a number to the "Base" input.
3.  Set the "Exponent" input (defaults to 2 if not connected).
4.  The output will be the base raised to the power of the exponent.

![](/images/Screenshot%202025-04-08%20at%204.42.21%E2%80%AFPM.png)

### Tips [​](#tips)

-   An exponent of 2 (the default) calculates the square of the base.
-   An exponent of 0.5 calculates the square root of the base.
-   Negative exponents give reciprocal powers (1/base^|exponent|).

### See Also [​](#see-also)

-   **Square Root**: For specifically calculating square roots.
-   **Exp**: For calculating e (Euler's number) raised to a power.

### Use Cases [​](#use-cases)

-   **Non-linear Scaling**: Create exponential growth for spacing or sizing systems.
-   **Emphasis Effects**: Use powers greater than 1 to emphasize differences between values.
-   **Compression Effects**: Use powers between 0 and 1 to compress ranges of values.