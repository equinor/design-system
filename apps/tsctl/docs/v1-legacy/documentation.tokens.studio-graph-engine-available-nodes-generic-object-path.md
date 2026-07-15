<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/object-path -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Object Path [​](#object-path)

### What It Does [​](#what-it-does)

The Object Path node extracts a specific value from within a nested object structure using a dot notation path. It helps you access deeply nested properties without having to create multiple nodes.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Object | The object you want to extract data from | Any | Yes |
| Path | The location of the property you want (using dot notation like "colors.primary") | Text | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The extracted property value at the specified path | Any |
| Missing | Indicates whether the property was found (true if missing) | Yes/No |

![Object Path Example](/images/Screenshot%202025-04-22%20at%206.27.57%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Object Path node into your graph.
2.  Connect an object to the "Object" input.
3.  Set the "Path" input to specify which property to extract (e.g., "theme.colors.primary").
4.  Run the graph to receive the value at that path and a missing flag.

### Tips [​](#tips)

-   Use dot notation to navigate nested structures (e.g., "colors.primary.500").
-   Check the "Missing" output to determine if the property exists in the object.

### See Also [​](#see-also)

-   **Merge objects**: For combining multiple objects together.
-   **Objectify**: For creating objects from key-value pairs.

### Use Cases [​](#use-cases)

-   **Token Extraction**: Pull specific values from a complex token structure (like typography.body.fontSize).
-   **Conditional Logic**: Check if specific properties exist before using them.
-   **Data Transformation**: Extract and reformat specific parts of complex data structures.