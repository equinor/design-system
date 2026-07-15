<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/array-length -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Array Length [​](#array-length)

### What It Does [​](#what-it-does)

Counts how many items are in a list and returns that number. It's perfect for determining the size of collections or arrays.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to count items in | List | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| length | The number of items in the list | Number |

![Array Length Example](/images/Screenshot%202025-04-17%20at%206.20.14%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Array Length node into your graph.
2.  Connect your list (like `[Red, Green, Blue]`) to the "array" input.
3.  The output will be the number of items in the list (e.g., 3).

![](/images/CleanShot%202025-05-06%20at%2013.45.37@2x.png)

### Tips [​](#tips)

-   An empty array will return 0.
-   This node only counts top-level items; it doesn't count elements in nested arrays.

### See Also [​](#see-also)

-   [**Index Array**](./index-array): For accessing specific items in a list by their position.

### Use Cases [​](#use-cases)

-   **Dynamic Sizing**: Use the length to calculate scalable spacing based on the number of elements.
-   **Limit Checking**: Verify if a token collection has the expected number of items.
-   **Conditional Logic**: Create different behaviors based on how many items exist in a collection.