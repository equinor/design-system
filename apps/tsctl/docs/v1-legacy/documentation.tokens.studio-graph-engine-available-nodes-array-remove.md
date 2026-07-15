<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/remove -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Remove Item [​](#remove-item)

### What It Does [​](#what-it-does)

Removes a single item from a list at a specific position. It returns both the modified list and the item that was removed, making it useful for extracting elements or trimming collections.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to remove an item from | List | Yes |
| index | The position of the item to remove | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The list with the item removed | List |
| item | The item that was removed | Any |

![Remove Item Example](/images/Screenshot%202025-04-17%20at%206.29.30%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Remove Item node into your graph.
2.  Connect a list (like `[Red, Blue, Green]`) to the "array" input.
3.  Connect a number (like `1`) to the "index" input to specify which position to remove.
4.  Run the graph—your "array" output will be `[Red, Green]` and your "item" output will be `Blue`.

![](/images/CleanShot%202025-05-07%20at%2018.49.31@2x.png)

### Tips [​](#tips)

-   Indexes start at 0, so the first item is at position 0, the second at position 1, etc.
-   You can use negative indexes (-1 removes the last item, -2 the second-to-last, etc.).

### See Also [​](#see-also)

-   [**Array Push**](./push): For adding an item to a list.
-   [**Array Filter**](./filter): For removing multiple items based on conditions.

### Use Cases [​](#use-cases)

-   **Token Refinement**: Remove specific tokens from a design system collection to create simplified subsets.
-   **Data Processing**: Extract a specific element from a data series for individual analysis.
-   **Sequential Operations**: Process items one-by-one by removing them from a working list as you handle them.