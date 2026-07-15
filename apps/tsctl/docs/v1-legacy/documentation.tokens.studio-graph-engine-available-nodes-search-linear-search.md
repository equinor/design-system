<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/search/linear-search -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Search](/graph-engine/available-nodes/search)

# Linear Search [​](#linear-search)

### What It Does [​](#what-it-does)

Performs a linear search on an array to find the index of a target value. It goes through each element in the array one by one, comparing it to the target value, and returns the index of the first matching element.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The array to search through | List | Yes |
| target | The value to search for | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| index | The index of the target value (-1 if not found) | Number |
| found | Whether the target value was found | Yes/No |

![Linear Search Example](/images/Screenshot%202025-04-09%20at%201.19.24%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Linear Search node into your graph.
2.  Connect any array (like `[10, "hello", true, {key: "value"}]`) to the "array" input.
3.  Set the value you want to find (like `"hello"`) to the "target" input.
4.  Run the graph—with the example inputs, your output will be: index: `1`, found: `true`.

### Tips [​](#tips)

-   Linear Search works with any data type, including objects and nested structures.
-   The comparison is done using a deep equality check, so objects with the same properties will match even if they're different instances.
-   For large arrays, consider using more optimized search nodes if your data is sorted.

### See Also [​](#see-also)

-   **Find First Match**: For comparison-based searching (greater than, less than).
-   **Array Find**: For more complex finding conditions using an inner graph.

### Use Cases [​](#use-cases)

-   **Data Retrieval**: Find specific items in unsorted lists or arrays of mixed types.
-   **User Input Validation**: Check if a submitted value exists in a list of allowed values.
-   **Simple Lookups**: When working with small arrays where performance isn't critical.