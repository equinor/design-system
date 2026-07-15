<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/color/sort-colors-by-distance -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Color](/graph-engine/available-nodes/color)

# Sort Colors By Distance [​](#sort-colors-by-distance)

### What It Does [​](#what-it-does)

The Sort Colors By Distance node arranges an array of colors by their relationship to a reference color. It can sort based on various color attributes like contrast, hue, lightness, saturation, or overall color distance.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Colors | Array of colors to be sorted | List of Colors | Yes |
| Compare Color | Reference color to sort against | Color | Yes |
| Type | Sorting method (Contrast, Hue, Lightness, Saturation, Distance) | String | No |
| Algorithm | Contrast algorithm to use when sorting by contrast | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The sorted array of colors | List of Colors |
| Indices | The original indices of the colors in the sorted array | List of Numbers |

![](/images/CleanShot%202025-03-21%20at%2017.44.58@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Sort Colors By Distance node into your graph.
2.  Connect an array of colors to the "Colors" input. (Here a [Color Wheel](./color-wheel) node is used generate an array of colors).
3.  Connect a reference color to the "Compare Color" input (like `#1728E3`).
4.  Select a sorting method from the "Type" dropdown (default: Hue). Here lightness is selected.
5.  The output will be the sorted colors and their original indices.

![](/images/CleanShot%202025-03-21%20at%2018.44.42@2x.png)

### Tips [​](#tips)

-   Use different sorting methods to achieve various visual arrangements of color palettes.
-   The indices output is useful for tracking how the original array was rearranged.

### See Also [​](#see-also)

-   [**Color Wheel**](./color-wheel): For generating colors to sort.
-   [**Range**](./range): For creating color ranges to sort.

### Use Cases [​](#use-cases)

-   **Color Palette Organization**: Arrange colors in a visually logical order.
-   **Accessible Color Selection**: Sort by contrast to find the most readable options.
-   **Gradient Generation**: Sort colors by hue or lightness to create smooth transitions.