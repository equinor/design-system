<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/contrasting-alpha -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Contrasting Alpha [​](#contrasting-alpha)

### What It Does [​](#what-it-does)

The Contrasting Alpha node adjusts a color's transparency until it reaches a target contrast ratio with a background. It uses binary search to find the optimal alpha value that provides the desired contrast level.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Foreground | The color to adjust transparency for | Color | No |
| Background | The background color to test contrast against | Color | No |
| Algorithm | Contrast calculation method (APCA is default) | String | No |
| Threshold | Target contrast value to achieve | Number | No |
| Precision | Number of binary search iterations (higher = more precise) | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Alpha | The calculated alpha value (0-1) | Number |
| Color | The resulting color with adjusted transparency | Color |
| Contrast | The actual contrast ratio achieved | Number |

![](/images/CleanShot%202025-03-19%20at%2022.56.06@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Contrasting Alpha node into your graph.
2.  Connect a foreground color (like `#737272`) and background color (like `#FFF`).
3.  Set your desired contrast threshold (default: 60).
4.  Adjust precision if needed (default: 5 iterations).
5.  The node outputs the color with adjusted alpha, the alpha value, and the resulting contrast.

![](/images/CleanShot%202025-03-19%20at%2022.58.22@2x.png)

### Tips [​](#tips)

-   Higher precision values give more accurate results but may increase processing time.
-   This node is useful for ensuring text remains readable while maintaining some transparency.

### See Also [​](#see-also)

-   [**Contrast**:](./contrast) For measuring contrast between two colors.
-   [**Contrasting Color**](./contrasting-color): For selecting between two colors based on contrast.
-   [**Flatten Alpha**](./flatten-alpha): For removing transparency from a color.

### Use Cases [​](#use-cases)

-   **Semi-Transparent UI Elements**: Create overlay panels that maintain text readability.
-   **Accessible Design**: Ensure text with transparency meets accessibility standards.
-   **Dynamic Backgrounds**: Automatically adjust text opacity based on varying background colors.