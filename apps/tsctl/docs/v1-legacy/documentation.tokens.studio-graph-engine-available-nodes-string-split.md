<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/split -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Split String [​](#split-string)

### What It Does [​](#what-it-does)

Divides a text string into smaller parts based on a separator character or string. This is useful for breaking comma-separated lists, space-separated words, or any delimited text into individual items.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The text to split into parts | String | Yes |
| separator | The character or string that marks where to split | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | An array containing the separated parts | List |

![](/images/CleanShot%202025-04-03%20at%2017.28.45@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Split String node into your graph.
2.  Connect a text string (like `"red,green,blue"`) to the "value" input.
3.  Set the "separator" to the character that divides your items (like `","`).
4.  The output will be a list of individual items (`["red", "green", "blue"]`).

![](/images/CleanShot%202025-04-03%20at%2017.29.46@2x.png)

### Tips [​](#tips)

-   The default separator is a comma (`,`).
-   If the separator is not found in the input string, the output will be an array with just the original string.

### See Also [​](#see-also)

-   [**Join Array**](./join): For the reverse operation—combining array items into a single string.
-   [**Array Find**](./../array/array-find): For searching through the resulting array of items.

### Use Cases [​](#use-cases)

-   **Tag Processing**: Split a list of tags into individual items for filtering or display.
-   **Data Parsing**: Extract individual values from formatted text like CSV data.
-   **Path Handling**: Break file paths or URLs into their component parts.