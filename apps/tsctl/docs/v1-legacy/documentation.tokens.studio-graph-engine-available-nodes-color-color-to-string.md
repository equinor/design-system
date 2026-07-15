<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/color-to-string -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Color To String [​](#color-to-string)

### What It Does [​](#what-it-does)

Converts a color object into a text representation in a specified format. This is useful when you need to output colors as hex codes, CSS color functions, or other text-based formats.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| color | The color to convert to text | Color | No |
| space | The format to output (hex, rgb, hsl, etc.) | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The color as a text string | String |

![](/images/CleanShot%202025-03-20%20at%2011.02.30@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Color to String node into your graph.
2.  Drag the Input node and set the input type to "color". Set the input color (e.g. #2669F4)
3.  Connect the output to the "color" input.
4.  Choose an output format from the "space" dropdown (e.g., "hsl" for "hsl(225,0,0) format).
5.  Run the graph—your output will be a text string like "#2669F4" or "hsl(220.49 90.351% 55.294%)".

![](/images/CleanShot%202025-03-20%20at%2011.05.12@2x.png)

### Tips [​](#tips)

-   The "hex" format is most common for web development and design tools.
-   Other formats like "rgb" or "hsl" provide more readable information about the color's components.

### See Also [​](#see-also)

-   [**String to Color**](./string-to-color): For converting text color representations back into color objects.
-   [**Deconstruct Color**](./deconstruct): For breaking a color into its individual component values.

### Use Cases [​](#use-cases)

-   **CSS Output**: Generate color strings for use in CSS stylesheets or style objects.
-   **Design Token Export**: Convert colors to string format for export to design token files.
-   **Color Communication**: Create readable text versions of colors for documentation or sharing.