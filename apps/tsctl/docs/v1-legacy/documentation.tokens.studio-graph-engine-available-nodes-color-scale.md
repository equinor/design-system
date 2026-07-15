<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/scale -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Scale Colors [​](#scale-colors)

### What It Does [​](#what-it-does)

Creates a palette of related colors by generating lighter and darker variations of a base color. This is perfect for building comprehensive color scales or creating light and dark variants for UI elements.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| color | The base color to create variations from | Color | No |
| stepsUp | Number of lighter variations to create | Number | No |
| stepsDown | Number of darker variations to create | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | Array of colors with lighter variations followed by darker variations | List |

![](/images/CleanShot%202025-03-21%20at%2017.44.28@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Scale Colors node into your graph.
2.  Connect your base color (like `#3366CC`) to the "color" input.
3.  Set "stepsUp" to the number of lighter variations you want (e.g., 3).
4.  Set "stepsDown" to the number of darker variations you want (e.g., 3).
5.  Run the graph—your output will be an array of colors with your base color in the middle.
6.  Drag in a [Color Scale](./../vector2/scale) preview node to visualise the colors.

![](/images/CleanShot%202025-03-21%20at%2017.47.55@2x.png)

### Tips [​](#tips)

-   The colors are arranged from lightest to darkest in the output array.
-   Use this to quickly create semantic UI color scales (e.g., primary-100 through primary-900).

### See Also [​](#see-also)

-   [**Range**](./range): For creating a color transition between two different colors.
-   [**Lighten Color**](./lighten): For simple lightness adjustments to a single color.

### Use Cases [​](#use-cases)

-   **UI Component Libraries**: Create complete color scales for buttons, alerts, and other UI elements.
-   **Background Variations**: Generate lighter and darker backgrounds for different UI states and hierarchies.
-   **Design System Scales**: Build systematic color scales with consistent lightness steps for your design system.