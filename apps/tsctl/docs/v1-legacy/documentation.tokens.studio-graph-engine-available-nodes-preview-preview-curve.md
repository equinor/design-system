<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/preview/preview-curve -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Preview](/graph-engine/available-nodes/preview)

# Preview Curve [​](#preview-curve)

### What It Does [​](#what-it-does)

The PreviewCurve node visualizes a curve or function as a graph. It helps you see the shape and behavior of mathematical curves for animation or interpolation.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The curve to visualize | Curve | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| _No outputs_ | This node is for preview purposes only | \- |

![PreviewCurve Example](/images/Screenshot%202025-04-08%20at%206.50.10%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the PreviewCurve node into your graph.
2.  Connect a curve value (like a Bezier curve or other function curve) to the "Value" input.
3.  The node will display a graphical representation of the curve's shape.
4.  Use the visualization to understand the curve's progression and behavior.

![](/images/Screenshot%202025-04-08%20at%206.48.46%E2%80%AFPM.png)

### Tips [​](#tips)

-   Use this to verify the shape of easing curves for animations.
-   Check transition curves to ensure they have the intended acceleration and deceleration.

### See Also [​](#see-also)

-   [**Bezier Curve**](./../curves/bezier-curve): For creating custom curves to preview.
-   [**Preset Bezier Curves**](./../curves/preset-bezier-curves): For selecting from common curve types.

### Use Cases [​](#use-cases)

-   **Animation Curves**: Visualize easing functions for animation timing.
-   **Interpolation Preview**: See how values will transition between points.
-   **Function Validation**: Verify that mathematical functions produce the expected curve shape.