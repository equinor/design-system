<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/objectify -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Objectify [​](#objectify)

### What It Does [​](#what-it-does)

Combines multiple inputs of any type into a single object, where each input becomes a property in the resulting object. This allows you to group related values together into a structured format.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| (dynamic) | Properties to include in the object | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | Object containing all input properties | Object |

![Objectify Example](/images/Screenshot%202025-04-22%20at%206.29.04%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Objectify node into your graph.
2.  Right-click on the node and select "Add Input" to create new property inputs.
3.  Name each input to define the property key in the resulting object.
4.  Connect values to each input to set the corresponding property values.

### Tips [​](#tips)

-   Property names in the resulting object match exactly the input names you define.
-   Add as many inputs as needed to construct your object with all required properties.

### See Also [​](#see-also)

-   **Object Path**: For extracting values from existing objects by path.
-   **Object Merge**: For combining multiple existing objects.

### Use Cases [​](#use-cases)

-   **Token Structure**: Create structured design tokens that contain multiple related properties.
-   **Component Configuration**: Build configuration objects for complex design components.
-   **Data Organization**: Group related values into a logical structure for easier processing.