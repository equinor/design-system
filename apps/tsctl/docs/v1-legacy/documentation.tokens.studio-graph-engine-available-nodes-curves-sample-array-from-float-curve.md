<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/curves/sample-array-from-float-curve -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Curves](/graph-engine/available-nodes/curves)

# Sample Array from Float Curve [​](#sample-array-from-float-curve)

### What It Does [​](#what-it-does)

Evaluates a float curve at multiple X positions and returns an array of the corresponding Y values. This allows you to generate sequences of values based on a curve's shape.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| curve | The float curve to sample | Float Curve | Yes |
| samplePoints | Array of X positions (0-1) to sample | List | Yes |
| precision | Number of decimal places for the results | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| values | Array of Y values sampled from the curve | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Sample Array from Float Curve node into your graph.
2.  Connect a float curve to the "curve" input.
3.  Connect an array of X positions (between 0 and 1) to the "samplePoints" input.
4.  Optionally set the "precision" input to control decimal places (default is 2).

### Tips [​](#tips)

-   All X values must be between 0 and 1, representing normalized positions along the curve.
-   Higher precision values will give more accurate results but might be unnecessary for most design applications.

### See Also [​](#see-also)

-   **Sample Float Curve**: For sampling a single point on a curve.
-   **Construct Float Curve**: For creating custom curves to sample.

### Use Cases [​](#use-cases)

-   **Animation Keyframes**: Generate multiple animation steps from a single easing curve.
-   **Data Visualization**: Create smooth distributions of values based on a curve shape.
-   **Design Scales**: Build graduated scales for spacing, sizing, or opacity based on a mathematical curve.