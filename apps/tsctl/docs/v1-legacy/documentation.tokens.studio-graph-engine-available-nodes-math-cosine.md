<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/cosine -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Cosine [​](#cosine)

### What It Does [​](#what-it-does)

The Cosine node calculates the cosine of an angle value (in radians). It's particularly useful for creating oscillating patterns, circular movements, and wave effects in design.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The angle in radians | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The cosine of the input angle | Number |

![](/images/CleanShot%202025-03-18%20at%2019.42.46@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Cosine node into your graph.
2.  Connect a number to the "Value" input (e.g., 3.15) or use the default (0).
3.  The output will be the cosine of the input angle, which ranges from -1 to 1.
4.  Use this value for creating cyclic patterns and oscillations.

![](/images/CleanShot%202025-03-18%20at%2020.10.56@2x.png)

### Tips [​](#tips)

-   The output always ranges between -1 and 1.
-   Use multiples of π (3.14159...) for common angles: 0 gives 1, π/2 gives 0, π gives -1.

### See Also [​](#see-also)

-   [**Sine**](https://documentation.tokens.studio/graph-engine/available-nodes/math/sine): For calculating the sine function (phase-shifted cosine).
-   [**Tangent**](https://documentation.tokens.studio/graph-engine/available-nodes/math/tangent): For calculating the tangent function.

### Use Cases [​](#use-cases)

-   **Circular Motion**: Create circular or elliptical movements in animations.
-   **Wave Patterns**: Generate smooth wave patterns for transitions or visual effects.
-   **Color Cycling**: Create natural color oscillations by driving color components with cosine values.