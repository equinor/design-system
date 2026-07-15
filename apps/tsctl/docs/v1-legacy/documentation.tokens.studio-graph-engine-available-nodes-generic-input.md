<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/input -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Input [​](#input)

### What It Does [​](#what-it-does)

Defines the entry points for data flowing into your graph. This node allows you to create named inputs that can be configured when the graph runs, making your graph reusable with different values.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| \[custom inputs\] | Any named inputs you define become available as outputs | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| \[matching outputs\] | Each input you define creates a matching output | Any |

![Input Example](/images/Screenshot%202025-04-22%20at%206.22.55%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Input node into your graph (usually at the left/beginning).
2.  Click the "+" button to add a new named input (like "baseColor" or "spacing").
3.  Set the type and default value for each input.
4.  Connect the outputs to other nodes in your graph that need these values.
5.  When the graph is used, these inputs can be configured externally.

### Tips [​](#tips)

-   You should only have one Input node per graph.
-   Give your inputs clear, descriptive names that indicate their purpose.
-   Set meaningful default values so the graph works well even without custom inputs.

### See Also [​](#see-also)

-   **Output**: For defining what values are returned from your graph.
-   **Constant**: For values that don't need to change between uses of the graph.

### Use Cases [​](#use-cases)

-   **Design System Components**: Create reusable components with configurable properties.
-   **Theming**: Build a color scheme generator that takes base colors as inputs.
-   **Layout Systems**: Define spacing algorithms that can adapt to different base units.