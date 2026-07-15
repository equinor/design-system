<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/curves/sample-float-curve -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Curves](/graph-engine/available-nodes/curves)

# Sample Float Curve [​](#sample-float-curve)

### What It Does [​](#what-it-does)

Evaluates a float curve at a specific X value and returns the corresponding Y value. This node allows you to get a precise point along a curve for interpolation or animation.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| curve | The float curve to sample | Float Curve | Yes |
| x | The position along the curve (0-1) to sample | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| y | The calculated value at the given position | Number |

![Sample Float Curve Example](/images/Screenshot%202025-04-09%20at%207.59.50%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Sample Float Curve node into your graph.
2.  Connect a float curve to the "curve" input.
3.  Set the "x" value to a number between 0 and 1 (defaults to 0).
4.  The node outputs the y-value at that position on the curve.

```
![](/images/Screenshot%202025-04-09%20at%208.03.37%E2%80%AFPM.png)
```

### Tips [​](#tips)

-   The x value must be between 0 and 1, representing the normalized position along the curve.
-   For easing functions, 0 typically represents the start and 1 represents the end of the animation.

### See Also [​](#see-also)

-   **Sample Array from Float Curve**: For sampling multiple points along a curve at once.
-   **Bezier Curve**: For creating standard cubic bezier curves to sample.

### Use Cases [​](#use-cases)

-   **Animation Timing**: Get precise intermediate values for smooth animations.
-   **Easing Functions**: Apply custom easing to transitions between states.
-   **Interpolation**: Calculate values between keyframes based on curved rather than linear progression.