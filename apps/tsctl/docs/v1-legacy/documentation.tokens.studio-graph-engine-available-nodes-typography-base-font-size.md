<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/typography/base-font-size -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Typography](/graph-engine/available-nodes/typography)

# Base Font Size [​](#base-font-size)

### What It Does [​](#what-it-does)

Calculates an optimal base font size according to DIN 1450 standards, considering factors like viewing distance, screen properties, and visual acuity. This is useful for creating accessible typography that's properly sized for your specific use case.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| visualAcuity | Visual acuity factor (typical human vision is around 0.7) | Number | No |
| correctionFactor | Adjustment factor for calculation (default is 13) | Number | No |
| lightingCondition | Factor representing lighting conditions (bright to dim, 0-1) | Number | No |
| distance | Viewing distance in centimeters | Number | No |
| xHeightRatio | Ratio of x-height to font size in the typeface you're using | Number | No |
| ppi | Pixels per inch of the display | Number | No |
| pixelDensity | Pixel density factor (higher for retina/high DPI displays) | Number | No |
| precision | Decimal precision of the result | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The calculated base font size in pixels | Number |

![Base Font Size Example](/images/Screenshot%202025-04-09%20at%207.28.02%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Base Font Size node into your graph.
2.  Adjust the input values to match your specific scenario (device, viewing distance, etc.).
3.  For most inputs, the default values work well for typical screen reading.
4.  Connect the output to your typography system or use directly as a font size.

![](/images/Screenshot%202025-04-09%20at%207.24.05%E2%80%AFPM.png)

### Tips [​](#tips)

-   The x-height ratio varies by font; common values are 0.5-0.55 for most typefaces.
-   For accessibility, you may want to increase the result slightly beyond the calculated minimum.

### See Also [​](#see-also)

-   **Font Size**: For directly setting font sizes or creating a scale.
-   **Typography Style**: For creating complete text styles with multiple properties.

### Use Cases [​](#use-cases)

-   **Accessibility Compliance**: Ensure text meets readability standards for different devices.
-   **Responsive Typography**: Calculate appropriate font sizes based on device characteristics.
-   **Design Systems**: Create a scientifically-backed foundation for your typography scale.