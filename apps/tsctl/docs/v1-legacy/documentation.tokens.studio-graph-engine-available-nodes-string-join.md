<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/join -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Join Array [​](#join-array)

### What It Does [​](#what-it-does)

Combines all items in a list into a single text string, with a specified character or string between each item. This is useful for creating comma-separated lists, space-separated words, or any delimited text.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list of items to join together | List | Yes |
| delimiter | The character or string to insert between items | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The combined text string with delimiters | String |

![](/images/CleanShot%202025-03-24%20at%2011.15.25@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Join Array node into your graph.
2.  Connect a list (like `["red", "green", "blue"]`) to the "array" input.
3.  Set the "delimiter" to the character you want between items (like `", "`).
4.  Run the graph—your output will be a single string with the items joined (`"red, green, blue"`).

![](/images/CleanShot%202025-03-24%20at%2011.17.46@2x.png)

### Tips [​](#tips)

-   The default delimiter is a hyphen (`-`), but you can use any string, including spaces, commas, or even multi-character strings.
-   Non-string items in the array will be converted to strings automatically.

### See Also [​](#see-also)

-   [**Split String**](./split): For the reverse operation—breaking a string into an array of parts.

### Use Cases [​](#use-cases)

-   **CSV Generation**: Create comma-separated values for data export.
-   **UI Display**: Format lists of items for display in a user interface.