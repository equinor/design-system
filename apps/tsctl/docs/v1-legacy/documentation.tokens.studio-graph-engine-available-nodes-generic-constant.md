<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/constant -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Constant [​](#constant)

### What It Does [​](#what-it-does)

Provides a fixed value that doesn't change during graph execution. It allows you to set a single value that can be connected to multiple nodes, making it easier to maintain consistent values across your graph.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The value to output | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The constant value | Any |

![Constant Example](/images/Screenshot%202025-04-15%20at%203.37.48%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Constant node into your graph.
2.  Double-click the node or edit its properties to set the desired value.
3.  Connect the node's output to any other nodes that need this value.
4.  Run the graph—the constant value will be passed to all connected nodes.

![](/images/Screenshot%202025-04-15%20at%203.31.01%E2%80%AFPM.png)

### Tips [​](#tips)

-   Use Constants for values that are used in multiple places to avoid duplicating the same value.
-   The Constant node can hold any type of data (text, numbers, colors, arrays, etc.).
-   If you need to change a value used in multiple places, updating the Constant node will update all connections.

### See Also [​](#see-also)

-   **Input**: For values that should be configurable from outside the graph.
-   **Output**: For exporting values from the graph.
-   **Note**: For adding comments and documentation to your graph.

### Use Cases [​](#use-cases)

-   **Shared Values**: Use a single source for values needed in multiple calculations.
-   **Configuration**: Set design system constants like base sizes or colors.
-   **Default Values**: Provide fallback values for optional inputs.
-   **Documentation**: Label important values in your graph for better understanding.