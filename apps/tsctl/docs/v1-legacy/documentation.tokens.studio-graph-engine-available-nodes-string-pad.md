<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/pad -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Pad [​](#pad)

### What It Does [​](#what-it-does)

Adds characters to the beginning or end of a string until it reaches the desired length. This is useful for aligning text, creating fixed-width formats, or visual styling.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| string | The text to pad | String | Yes |
| length | The target length for the padded string | Number | Yes |
| character | The character to pad with | String | Yes |
| position | Where to add padding (start or end) | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| string | The padded text | String |

![](/images/CleanShot%202025-04-03%20at%2015.32.04@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Pad node into your graph.
2.  Connect the text you want to pad to the "string" input. For e.g., `name`.
3.  Set the desired "length" for the final string. For e.g., `10`.
4.  Specify the "character" to use for padding (only the first character will be used).
5.  Select the "position" to add padding (start or end).

![](/images/CleanShot%202025-04-03%20at%2015.31.34@2x.png)

### Tips [​](#tips)

-   If your string is already longer than the specified length, it won't be truncated.
-   Only the first character of the "character" input will be used for padding.

### See Also [​](#see-also)

-   [**Case Convert**](./case-convert): For changing text case format.
-   [**Normalize**](./normalize): For standardizing text representation.

### Use Cases [​](#use-cases)

-   **UI Display**: Create fixed-width elements for consistent visual alignment.
-   **Code Formatting**: Format code identifiers with consistent spacing.
-   **Data Export**: Prepare fixed-width fields for legacy systems or data exchange formats.