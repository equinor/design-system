<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/arrify -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Arrify [​](#arrify)

### What It Does [​](#what-it-does)

Takes any input value and ensures it is converted into an array format. It accepts various input types and transforms them into a uniform array structure.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| items | The value(s) to be converted into an array | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | A properly formatted array of items | List |

![Arrify Example](/images/Screenshot%202025-04-17%20at%206.11.40%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Arrify node into your graph.
2.  Connect any value or multiple values to the "items" input.
3.  The node will output an array containing all input values.

![](/images/CleanShot%202025-05-06%20at%2011.40.05@2x%20\(1\).png)

### Tips [​](#tips)

-   This node is particularly useful when you need to standardize varied data formats into a consistent array structure.
-   If you provide multiple inputs, they will all be included as elements in the resulting array.

### See Also [​](#see-also)

-   [**Array flatten**](./flatten): For flattening nested arrays into a single level.
-   [**Concat**](./concat): For joining multiple arrays together end-to-end.

### Use Cases [​](#use-cases)

-   **Normalizing Data Structures**: Convert inconsistent data formats into standardized arrays for consistent processing.
-   **Preparing Input for Array Operations**: Ensure values are in array format before applying array-specific nodes.
-   **Creating Collections**: Gather multiple individual design tokens into a collection for batch processing.