<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/naming/t-shirt-size -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Naming](/graph-engine/available-nodes/naming)

# T-Shirt Size [​](#t-shirt-size)

### What It Does [​](#what-it-does)

The T-Shirt Size node generates standardized t-shirt size naming conventions (XS, S, M, L, XL, etc.) based on index values. It supports different naming schemas (default, short, or long) and allows for customization with prefixes and suffixes.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Index | Position relative to base index (negative for smaller sizes) | Number | Yes |
| Base Index | Index in the sequence that represents the base size (md/m/medium) | Number | No |
| Schema | Naming schema to use (default, short, or long) | String | No |
| Prefix | Optional text to add before the size | String | No |
| Suffix | Optional text to add after the size | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The generated t-shirt size value with optional prefix and suffix | String |

![](/images/CleanShot%202025-04-03%20at%2023.51.22@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the T-Shirt Size node into your graph.
2.  Connect a number to the "Index" input or set it directly.
3.  Configure the optional inputs:
    -   Set "Base Index" to determine which index corresponds to the medium size.
    -   Choose a "Schema" (default: XS, S, M, L, XL; short: xs, s, m, l, xl; long: extra-small, small, medium, large, extra-large).
    -   Add a "Prefix" and/or "Suffix" if needed.
4.  The node will output the corresponding t-shirt size as a string.

![](/images/CleanShot%202025-04-03%20at%2023.53.09@2x.png)

### Tips [​](#tips)

-   Use negative index values to get sizes smaller than the base size, and positive values for larger sizes.
-   The node automatically clamps the result to the available sizes in the chosen schema.
-   This naming convention is commonly used for spacing, component sizes, and breakpoints in design systems.

### See Also [​](#see-also)

-   [**Alphabetic Scale**](./alphabetic-scale): For generating alphabetic sequences.
-   [**Numeric Scale**](./numeric-scale): For generating numeric sequences.

### Use Cases [​](#use-cases)

-   **Component Size Variants**: Create consistent size naming for component variants (button-s, button-m, button-l).
-   **Spacing Systems**: Establish a familiar naming convention for spacing tokens.
-   **Breakpoint Definitions**: Define standardized breakpoint names for responsive layouts.
-   **Typography Scales**: Create readable size classifications for typography tokens.