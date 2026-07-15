<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/flatten -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Flatten [​](#flatten)

### What It Does [​](#what-it-does)

Flattens an array of arrays into a single level array, combining all nested elements into one unified list.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The nested list to flatten | List | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The resulting flattened list | List |

![Array flatten Example](/images/Screenshot%202025-04-17%20at%206.14.52%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Array flatten node into your graph.
2.  Connect a nested list (like `[[1, 2], [3, 4]]`) to the "array" input.
3.  The node will output a single flattened list (like `[1, 2, 3, 4]`).

![](/images/CleanShot%202025-05-06%20at%2013.04.18@2x.png)

### Tips [​](#tips)

-   This node only flattens one level deep, not recursively through all nested arrays.
-   Make sure your input is actually an array of arrays, or the node will throw an error.

### See Also [​](#see-also)

-   [**Arrify**](./arrify): For converting any value into an array format.
-   [**Concat**](./concat): For joining multiple arrays together end-to-end.

### Use Cases [​](#use-cases)

-   **Merging Token Groups**: Combine nested token groups into a flat structure for easier processing.
-   **Simplifying Data Structures**: Convert complex nested lists of values into a simpler format for operations.
-   **Processing Multi-dimensional Data**: Transform grid-based data into a linear sequence for sequential processing.