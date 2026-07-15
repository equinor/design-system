<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/match-alpha -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Match Alpha [​](#match-alpha)

### What It Does [​](#what-it-does)

The Match Alpha node calculates the opacity value needed to blend a foreground color with a background color to match a reference color. It reverse-engineers the alpha value that would create the target color.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Foreground | The color to apply transparency to | Color | No |
| Background | The background color for blending | Color | No |
| Reference | The target color to match | Color | No |
| Threshold | Maximum allowable color difference (0-1) | Number | No |
| Precision | Calculation precision for alpha value | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| In Range | Whether a valid alpha value was found | Boolean |
| Color | The foreground color with the calculated alpha | Color |
| Alpha | The calculated alpha value (0-1) | Number |

![](/images/CleanShot%202025-03-20%20at%2019.13.49@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Match Alpha node into your graph.
2.  Connect your foreground color (like `#5C5656`), background color (like `#FFF`), and reference color (`#CFCDCD`).
3.  Adjust threshold and precision if needed (defaults are 0.01).
4.  The node outputs the calculated alpha value (0.3) and the semi-transparent foreground color (`#5C56564D`).
5.  If "In Range" is false, no suitable alpha value could be found.

![](/images/CleanShot%202025-03-20%20at%2019.16.07@2x.png)

### Tips [​](#tips)

-   Lower threshold values require more exact color matching.
-   If no suitable alpha is found, try different foreground and background colors.
-   This node works best when the reference color is between the foreground and background colors.

### See Also [​](#see-also)

-   [**Flatten Alpha**](./flatten-alpha): For the reverse operation - merging a transparent color with a background.
-   [**Contrasting Alpha**](./contrasting-alpha): For finding alpha values that maintain contrast requirements.

### Use Cases [​](#use-cases)

-   **Color System Analysis**: Discover the transparency values used in existing designs.
-   **Overlay Recreation**: Recreate the exact transparency of an existing overlay or glass effect.
-   **Color Harmonization**: Find transparency values that harmonize colors in a composition.