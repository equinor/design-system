<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/tangent -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Tangent [​](#tangent)

### What It Does [​](#what-it-does)

The Tan node calculates the tangent of an angle value (in radians). Unlike sine and cosine which range from -1 to 1, tangent can produce values from negative infinity to positive infinity, creating more extreme oscillations.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The angle in radians | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The tangent of the input angle | Number |

![Tan Example](/images/Screenshot%202025-04-08%20at%205.56.04%E2%80%AFPM%20\(2\).png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Tan node into your graph.
2.  Connect a number to the "Value" input or use the default (0).
3.  The output will be the tangent of the input angle.
4.  Be aware that at certain values (like π/2, 3π/2, etc.), the output approaches infinity.

![](/images/Screenshot%202025-04-08%20at%205.56.45%E2%80%AFPM.png)

### Tips [​](#tips)

-   The tangent function has vertical asymptotes at odd multiples of π/2 (±π/2, ±3π/2, etc.).
-   For stable results, avoid angles too close to these asymptotes.
-   The tangent is mathematically equivalent to sine/cosine.

### See Also [​](#see-also)

-   **Sine**: For a bounded oscillating value between -1 and 1.
-   **Cosine**: For another bounded oscillating value with a 90° phase shift from sine.

### Use Cases [​](#use-cases)

-   **Sharp Transitions**: Create dramatic, rapid changes in values.
-   **Non-linear Mapping**: Transform linear inputs into non-linear outputs with steep changes.
-   **Mathematical Modeling**: Implement specialized mathematical functions that require tangent calculations.