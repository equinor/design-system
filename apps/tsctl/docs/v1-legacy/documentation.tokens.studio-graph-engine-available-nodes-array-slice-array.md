<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/slice-array -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Slice Array [​](#slice-array)

### What It Does [​](#what-it-does)

Extracts a portion of a list to create a new list, based on start and end positions you specify. This lets you take a subset of items from any list.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to extract items from | List | Yes |
| start | The beginning position (index starts at 0) | Number | Yes |
| end | The end position (not included in the result) | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The extracted portion of list | List |

![Slice Array Example](/images/Screenshot%202025-04-17%20at%206.34.21%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Slice Array node into your graph.
2.  Connect your list (like `[Red, Blue, Green, Orange, Purple]`) to the "array" input.
3.  Set the "start" value (e.g., 1) and "end" value (e.g., 4).
4.  The output will be the specified portion of the list (e.g., `[Blue, Green, Orange]`).

![](/images/CleanShot%202025-05-07%20at%2019.12.55@2x.png)

### Tips [​](#tips)

-   The end index is not included in the result, so slice(1,4) returns items at positions 1, 2, and 3.
-   You can use negative indices to count from the end of the list (-1 is the last item).

### See Also [​](#see-also)

-   [**Index Array**](./index-array): For extracting a single item from a list.
-   [**Array Filter**](./filter): For selecting items based on a condition rather than position.

### Use Cases [​](#use-cases)

-   **Color Palette Segments**: Extract part of a color palette to use in a specific component.
-   **Token Subsets**: Create smaller token collections from larger standardized sets.
-   **Sequential Grouping**: Group related tokens together by extracting portions from a sequence.