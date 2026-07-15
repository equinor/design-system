<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/subgraph -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Subgraph [​](#subgraph)

### What It Does [​](#what-it-does)

Creates a nested graph within your main graph, allowing you to encapsulate complex logic into a reusable component. It acts like a function that can contain its own internal network of nodes.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| (dynamic) | Inputs are defined by the inner graph's Input nodes | Any | Depends on inner graph |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| (dynamic) | Outputs are defined by the inner graph's Output nodes | Any |

![Subgraph Example](/images/Screenshot%202025-04-22%20at%206.33.21%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Subgraph node into your graph.
2.  Double-click the node to open and edit the inner graph.
3.  Add Input and Output nodes within the inner graph to define the interface.
4.  Build your logic inside the subgraph using any other nodes.

### Tips [​](#tips)

-   Keep related functionality together by grouping it in a subgraph for better organization.
-   Inputs and outputs from the inner graph automatically appear on the parent subgraph node.

### See Also [​](#see-also)

-   **Input**: For defining inputs to your graph.
-   **Output**: For defining outputs from your graph.

### Use Cases [​](#use-cases)

-   **Reusable Components**: Create complex operations that can be reused across different parts of your design system.
-   **Logical Grouping**: Organize related nodes into a single component to reduce visual complexity.
-   **Abstraction**: Hide implementation details of complex calculations behind a simpler interface.