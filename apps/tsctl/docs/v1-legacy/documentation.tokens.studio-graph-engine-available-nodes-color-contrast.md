<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/contrast -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Contrast [​](#contrast)

### What It Does [​](#what-it-does)

The Contrast node calculates the contrast ratio between two colors. It provides a numeric value representing the contrast level, with higher numbers indicating greater contrast between the colors.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| A | First color to compare | Color | No |
| B | Second color to compare | Color | No |
| Algorithm | Contrast calculation method (APCA is default) | String | No |
| Absolute | Whether to return the absolute value of the contrast | Yes/No | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The calculated contrast ratio between the two colors | Number |

![](/images/CleanShot%202025-03-19%20at%2022.35.36@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Contrast node into your graph.
2.  Connect two colors to the "A" and "B" inputs (defaults are black and white).
3.  Optionally choose the algorithm method and whether to use absolute value.
4.  The output will be a numeric value representing the contrast ratio.

![](/images/CleanShot%202025-03-19%20at%2022.40.59@2x.png)

### Tips [​](#tips)

-   Higher contrast values generally indicate better readability when using text.
-   The APCA algorithm provides perceptually accurate contrast measurements.

### See Also [​](#see-also)

-   [**Contrasting**:](./contrasting-color) For finding a color with sufficient contrast against a background.
-   [**Contrasting Alpha**:](./contrasting-alpha) For adjusting opacity to achieve a target contrast.

### Use Cases [​](#use-cases)

-   **Accessibility Verification**: Check if text and background color combinations meet WCAG standards.
-   **Readability Testing**: Evaluate if UI elements have sufficient contrast for clear visibility.
-   **Color Pair Evaluation**: Compare different color combinations to find optimal contrast ratios.