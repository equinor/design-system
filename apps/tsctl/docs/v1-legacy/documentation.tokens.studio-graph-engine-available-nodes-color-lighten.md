<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/lighten -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Lighten Color [​](#lighten-color)

### What It Does [​](#what-it-does)

Makes a color lighter by increasing its lightness by a specified amount. This is useful for creating tints of a base color or generating lighter variants for disabled states and background elements.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| color | The color to lighten | Color | No |
| value | How much to lighten the color (0-1) | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The lightened color | Color |

![](/images/CleanShot%202025-03-20%20at%2019.06.07@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Lighten Color node into your graph.
2.  Connect a color (like `#1D1CEE`) to the "color" input.
3.  Set a value between 0 and 1 (like `0.4`) to the "value" input.
4.  Run the graph—your output will be a lighter version of the input color (`#77A0FF`).

![](/images/CleanShot%202025-03-20%20at%2019.05.38@2x.png)

### Tips [​](#tips)

-   A value of 0 makes no change, while 1 produces white.
-   Dark colors can be lightened more before losing their character than light colors.

### See Also [​](#see-also)

-   [**Darken Color**](./darken): For making colors darker instead of lighter.
-   [**Mix Colors**](./mix): For blending a color with white for more control.

### Use Cases [​](#use-cases)

-   **Disabled States**: Create lighter variants of interface elements to indicate disabled status.
-   **Background Variations**: Generate lighter background colors that complement your main palette.
-   **Tint Series**: Create a progression of increasingly lighter tints from a base brand color.