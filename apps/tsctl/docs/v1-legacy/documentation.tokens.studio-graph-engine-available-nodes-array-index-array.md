<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/index-array -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Index Array [​](#index-array)

### What It Does [​](#what-it-does)

Extracts a single value from a list at a specified position (index). It allows you to retrieve individual elements from an array by their numerical position.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to extract the value from | List | Yes |
| index | The position to extract (starts at 0) | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The item found at that position | Any |

![Index Array Example](/images/Screenshot%202025-04-17%20at%206.16.40%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Index Array node into your graph.
2.  Connect an array (like `[Red, Green, Blue]`) to the "array" input.
3.  Set the "index" value (default is 0, which returns the first item).
4.  The output will be the value at that position (e.g., with index 1, the output would be "Green").

![](/images/CleanShot%202025-05-06%20at%2013.10.56@2x.png)

### Tips [​](#tips)

-   Array indexes start at 0, so the first item is at index 0, the second at index 1, etc.
-   If you use a negative index, it counts backward from the end (-1 is the last item).

### See Also [​](#see-also)

-   **Array Find**: For finding items by a specific condition rather than position.
-   **Slice**: For extracting a range of items from an array.

### Use Cases [​](#use-cases)

-   **Color Palette Access**: Extract a specific color from a palette array by its position.
-   **Token Selection**: Select a specific token from a standardized set based on importance level.
-   **Sequential Processing**: Access individual steps from a sequence of design values.