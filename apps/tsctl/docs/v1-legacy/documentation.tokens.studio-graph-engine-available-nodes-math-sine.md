<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/sine -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Sine [​](#sine)

### What It Does [​](#what-it-does)

The Sine node calculates the sine of an angle value (in radians). It produces a smooth wave output that oscillates between -1 and 1, perfect for creating fluid animations and wave effects.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The angle in radians | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The sine of the input angle | Number |

![Sine Example](/images/Screenshot%202025-04-08%20at%205.27.24%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Sine node into your graph.
2.  Connect a number to the "Value" input or use the default (0).
3.  The output will be the sine of the input angle, which ranges from -1 to 1.
4.  Use this value for creating wave patterns and smooth oscillations.

![](/images/Screenshot%202025-04-08%20at%205.29.16%E2%80%AFPM.png)

### Tips [​](#tips)

-   The output always ranges between -1 and 1.
-   For smooth wave patterns, feed the Sine node with continuously increasing values.
-   Common angles: sin(0) = 0, sin(π/2) = 1, sin(π) = 0, sin(3π/2) = -1.

### See Also [​](#see-also)

-   **Cosine**: For calculating the cosine function (90° phase-shifted sine).
-   **Tangent**: For calculating the tangent function.

### Use Cases [​](#use-cases)

-   **Smooth Animations**: Create natural, organic motion for UI elements.
-   **Wave Effects**: Generate wave patterns for backgrounds, borders, or dynamic layouts.
-   **Periodic Value Generation**: Create cycling values for recurring patterns in design tokens.