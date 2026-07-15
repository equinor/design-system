<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/gradient/gradient-stop -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Gradient](/graph-engine/available-nodes/gradient)

# Gradient Stop [​](#gradient-stop)

### What It Does [​](#what-it-does)

Creates a gradient stop by pairing a color with a position value. Gradient stops are the building blocks of gradients, defining which colors appear at specific points along the gradient line or radius.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| color | The color at this position in the gradient | Color | Yes |
| position | The location of this color (typically 0-1) | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| gradientStop | The combined gradient stop object (color + position) | Gradient Stop |

![Gradient Stop Example](/images/Screenshot%202025-04-09%20at%201.05.15%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Gradient Stop node into your graph.
2.  Connect a color (like `#3366FF`) to the "color" input.
3.  Connect or enter a position value (like `0.5` for the middle of the gradient) to the "position" input.
4.  Run the graph—your output will be a gradient stop that can be used in a gradient definition.

```
![](/images/Screenshot%202025-04-09%20at%201.07.48%E2%80%AFPM.png)
```

### Tips [​](#tips)

-   Position values typically range from 0 (start of gradient) to 1 (end of gradient).
-   Create multiple gradient stops and combine them to create a full gradient.

### See Also [​](#see-also)

-   **Create Gradient**: For combining multiple gradient stops into a complete gradient.
-   **Color Mix**: For creating intermediate colors that can be used in gradient stops.

### Use Cases [​](#use-cases)

-   **Custom Gradients**: Design multi-color gradients with precise control over color positions.
-   **Color Transitions**: Define exact transition points between colors in a UI element.
-   **Theming**: Create gradient definitions that can adapt to different color schemes.