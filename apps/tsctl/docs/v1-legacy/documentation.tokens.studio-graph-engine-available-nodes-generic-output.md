<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/output -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Output [​](#output)

### What It Does [​](#what-it-does)

Defines the final results that your graph produces. This node collects values from within your graph and exposes them as named outputs, determining what data is returned when the graph completes.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| \[custom inputs\] | Any named inputs you add become the graph outputs | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| \[matching outputs\] | Each input creates a matching output (typically used internally) | Any |

![Output Example](/images/Screenshot%202025-04-22%20at%206.29.51%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Output node into your graph (usually at the right/end).
2.  Click the "+" button to add named inputs (like "resultColor" or "spacingScale").
3.  Connect values from your graph to these inputs.
4.  When the graph runs, these connected values will be available as the graph's outputs.

### Tips [​](#tips)

-   You should only have one Output node per graph.
-   Give your outputs clear, descriptive names that indicate what they contain.
-   Every value you want to access from outside the graph should connect to this node.

### See Also [​](#see-also)

-   **Input**: For defining entry points where data flows into your graph.
-   **Constant**: For fixed values that don't change during graph execution.

### Use Cases [​](#use-cases)

-   **Token Generation**: Export the final set of design tokens after processing.
-   **Calculation Results**: Return the results of complex calculations or transformations.
-   **Component APIs**: Define what properties a reusable graph component exposes.