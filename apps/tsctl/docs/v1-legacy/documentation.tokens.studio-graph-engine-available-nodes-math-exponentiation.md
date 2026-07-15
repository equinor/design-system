<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/exponentiation -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Exponentiation [​](#exponentiation)

### What It Does [​](#what-it-does)

The Exponentiation node calculates e (Euler's number, approximately 2.71828) raised to a specified power. This function creates exponential growth or decay and is particularly useful for natural growth patterns.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Exponent | The power to raise e to | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The result of e^exponent | Number |

![](/images/Screenshot%202025-03-27%20at%208.32.43%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Exponentiation node into your graph.
2.  Connect a number to the "Exponent" input.
3.  The output will be e raised to the power of the input value.
4.  Use this for creating natural exponential growth or decay patterns.

![](/images/Screenshot%202025-03-27%20at%208.31.11%E2%80%AFPM.png)

### Tips [​](#tips)

-   Positive exponents create exponential growth (faster than linear or polynomial).
-   Negative exponents create exponential decay, approaching zero.
-   An exponent of 0 always outputs 1.

### See Also [​](#see-also)

### Use Cases [​](#use-cases)

-   **Natural Growth Patterns**: Model organic growth in design elements like spacing.
-   **Decay Effects**: Create natural fading or transition effects.
-   **Smooth Non-linear Scaling**: Generate values that change at an exponential rate.