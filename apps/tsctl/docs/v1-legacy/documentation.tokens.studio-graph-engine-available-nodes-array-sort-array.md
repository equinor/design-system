<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/sort-array -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Sort Array [​](#sort-array)

### What It Does [​](#what-it-does)

Arranges items in a list in a specific order, either ascending or descending. It can sort by a specific property for complex objects, helping to organize collections.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to be sorted | List | Yes |
| order | Direction of sort ("asc" or "desc") | Text | No |
| sortBy | Property name to sort by (for object elements) | Text | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The sorted list | List |

![Sort Array Example](/images/Screenshot%202025-04-17%20at%206.37.35%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Sort Array node into your graph.
2.  Connect your list (like `[16, 18, 21, 24, 28, 32]`) to the "array" input.
3.  Set "sortBy" to the property to sort on (e.g., "value").
4.  Optionally change "order" to "desc" for descending order (default is "asc").

![](/images/CleanShot%202025-05-07%20at%2019.50.45@2x.png)

### Tips [​](#tips)

-   For simple lists (numbers or strings), use an empty string for the "sortBy" value.
-   The sort is stable, meaning equal items maintain their relative order.

### See Also [​](#see-also)

-   [**Reverse Array**](./reverse-array): For simply flipping the order of items without sorting.
-   [**Array Filter**](./filter): For selecting items rather than reordering them.

### Use Cases [​](#use-cases)

-   **Color Organization**: Sort colors by brightness, hue, or other properties.
-   **Token Prioritization**: Arrange design tokens by their importance or frequency of use.
-   **Size Sequencing**: Order spacing or sizing tokens from smallest to largest for consistent scales.