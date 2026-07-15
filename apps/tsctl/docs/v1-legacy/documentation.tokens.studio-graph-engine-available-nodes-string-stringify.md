<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/stringify -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Stringify [​](#stringify)

### What It Does [​](#what-it-does)

Converts any value type into a text string representation. This is useful for displaying non-text values or combining different data types into text format.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The value to convert to text | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The string representation of the input | String |

![](/images/CleanShot%202025-04-03%20at%2017.32.28@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Stringify node into your graph.
2.  Connect any value (number, boolean, object, etc.) to the "value" input.
3.  The node will convert the input to its string representation.

![](/images/CleanShot%202025-04-03%20at%2017.33.08@2x.png)

### Tips [​](#tips)

-   This node performs a simple conversion to string (equivalent to adding an empty string to a value).
-   For more complex object serialization, consider using other tools to format the data.

### See Also [​](#see-also)

-   [**Interpolation**](./interpolation): For embedding values into a template string.
-   [**Join Array**](./join): For combining multiple strings into one.

### Use Cases [​](#use-cases)

-   **Display Formatting**: Convert numeric design tokens to string format for display.
-   **Data Combination**: Convert values to strings before concatenating them with other text.
-   **Type Conversion**: Ensure values are in string format before passing to string-only operations.