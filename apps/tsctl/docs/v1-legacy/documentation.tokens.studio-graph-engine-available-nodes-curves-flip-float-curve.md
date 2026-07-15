<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/curves/flip-float-curve -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Curves](/graph-engine/available-nodes/curves)

# Flip Float Curve [​](#flip-float-curve)

### What It Does [​](#what-it-does)

Mirrors a float curve horizontally, vertically, or both, creating transformed versions of the curve while maintaining its mathematical properties. This allows for quick creation of inverse or reflected curve behaviors.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| curve | The float curve to flip | Float Curve | Yes |
| flipHorizontal | Whether to mirror across Y-axis | Yes/No | No |
| flipVertical | Whether to mirror across X-axis | Yes/No | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| curve | The transformed float curve | Float Curve |

### How to Use It [​](#how-to-use-it)

1.  Drag the Flip Float Curve node into your graph.
2.  Connect a float curve to the "curve" input.
3.  Set "flipHorizontal" and/or "flipVertical" to true as needed.
4.  The node outputs a new curve with the specified transformations applied.

### Tips [​](#tips)

-   When both horizontal and vertical flips are false, the original curve is passed through unchanged.
-   Flipping horizontally will reverse the direction of the curve, useful for creating reverse animations.

### See Also [​](#see-also)

-   **Construct Float Curve**: For building a float curve from scratch.
-   **Sample Float Curve**: For evaluating the resulting curve at specific points.

### Use Cases [​](#use-cases)

-   **Animation Reversals**: Create reversed versions of easing functions.
-   **Symmetrical Designs**: Generate mirrored curves for symmetrical design elements.
-   **Curve Libraries**: Efficiently create variations of standard curves for different contexts.