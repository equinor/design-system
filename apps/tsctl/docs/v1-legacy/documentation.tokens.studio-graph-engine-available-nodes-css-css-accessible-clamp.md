<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/css/css-accessible-clamp -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[CSS](/graph-engine/available-nodes/css)

# CSS Accessible Clamp [​](#css-accessible-clamp)

### What It Does [​](#what-it-does)

Generates a CSS clamp() function that creates fluid typography based on viewport width. It automatically calculates the correct formula to smoothly scale font sizes between minimum and maximum values, ensuring accessibility by using rem units.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| minSize | Minimum font size in pixels | Number | No |
| maxSize | Maximum font size in pixels | Number | No |
| minViewport | Minimum viewport width in pixels | Number | No |
| maxViewport | Maximum viewport width in pixels | Number | No |
| baseFontSize | Base font size in pixels (usually browser default of 16px) | Number | No |
| precision | Number of decimal places in the output | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The generated CSS clamp function | Text |

### How to Use It [​](#how-to-use-it)

1.  Drag the CSS Accessible Clamp node into your graph.
2.  Set the "minSize" for your smallest font size (default 16px).
3.  Set the "maxSize" for your largest font size (default 24px).
4.  Define the viewport range with "minViewport" (default 320px) and "maxViewport" (default 1920px).
5.  Run the graph—your output will be a CSS clamp() function like `clamp(1rem, calc(0.500vw + 0.5rem), 1.5rem)`.

### Tips [​](#tips)

-   The output uses rem units for better accessibility, allowing text to scale with browser settings.
-   Use this for responsive typography that respects user preferences.
-   The calculated formula ensures linear scaling between viewport sizes.

### See Also [​](#see-also)

-   **CSS Function**: For creating other CSS functions like var(), calc(), etc.
-   **Range Mapping**: For mapping values between ranges without generating CSS.
-   **Math Lerp**: For basic linear interpolation calculations.

### Use Cases [​](#use-cases)

-   **Responsive Typography**: Create text that smoothly scales from mobile to desktop.
-   **Accessible Design**: Ensure text sizes respect user preferences while maintaining proportions.
-   **Design Systems**: Generate fluid type scales that work across all viewport sizes.
-   **Component Libraries**: Define responsive text components that scale automatically.