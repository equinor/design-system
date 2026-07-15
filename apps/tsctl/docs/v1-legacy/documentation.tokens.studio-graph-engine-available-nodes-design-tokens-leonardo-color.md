<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/leonardo-color -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Leonardo Color [​](#leonardo-color)

### What It Does [​](#what-it-does)

The Leonardo Color node creates a color configuration for Adobe's Leonardo color system. It sets up parameters for generating accessible color scales based on specified color keys, contrast ratios, and smoothing settings. The output can be used with the Leonardo Theme node to create comprehensive color themes with guaranteed accessibility.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Name | Name for the Leonardo color | String | Yes |
| Color Keys | Array of colors that define the color range | Array of Colors | Yes |
| Ratios | Array of contrast ratios to generate | Array of Numbers | Yes |
| Smooth | Whether to apply smoothing to the generated scale | Boolean | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | Leonardo color configuration object | Object |

### How to Use It [​](#how-to-use-it)

1.  Drag the Leonardo Color node into your graph.
2.  Connect a string to the "Name" input to identify this color configuration.
3.  Connect an array of colors to the "Color Keys" input. These colors define the range of the scale.
4.  Connect an array of numbers to the "Ratios" input. These ratios define the contrast points to generate in the scale.
5.  Optionally, connect a boolean to the "Smooth" input to determine if the scale should be smoothed.
6.  Use the output as input to a Leonardo Theme node to generate a complete color theme.

### Tips [​](#tips)

-   Use at least two color keys to create an effective color range.
-   Choose ratios based on WCAG accessibility guidelines (e.g., 3, 4.5, 7) to ensure accessible color scales.
-   Experiment with smoothing on and off to see which produces better results for your specific color range.
-   Leonardo works best when you provide colors that create a logical progression (e.g., from light to dark).

### See Also [​](#see-also)

-   **Leonardo Theme**: For generating a complete theme from Leonardo color configurations.
-   **Create Color Design Token**: For creating standard color tokens from Leonardo outputs.
-   **Create Design Token**: For creating other types of design tokens.

### Use Cases [​](#use-cases)

-   **Accessible Color Systems**: Generate color scales that meet WCAG accessibility guidelines.
-   **Dark/Light Mode**: Create color scales that work consistently across both light and dark modes.
-   **Data Visualization**: Develop accessible and visually consistent color scales for charts and graphs.
-   **UI Component Themes**: Build comprehensive color themes for UI components with guaranteed accessibility.