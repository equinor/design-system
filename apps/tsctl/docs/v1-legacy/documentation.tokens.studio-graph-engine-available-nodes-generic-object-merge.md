<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/object-merge -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Object Merge [​](#object-merge)

### What It Does [​](#what-it-does)

The Merge objects node combines multiple objects into a single object. It's perfect for consolidating data from different sources, with later objects in the array overriding properties from earlier ones in case of conflicts.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Objects | An array of objects to merge together | List | No |
| Concat Array | How arrays should be merged: "concat" (join arrays), "merge" (replace arrays), or "combine" (smart merge) | Text | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The resulting merged object | Any |

![Merge objects Example](/images/Screenshot%202025-04-22%20at%206.24.12%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Merge objects node into your graph.
2.  Connect an array of objects to the "Objects" input.
3.  Select how you want arrays handled using the "Concat Array" input (defaults to "concat").
4.  Run the graph to get a single merged object that combines all properties.

### Tips [​](#tips)

-   Objects later in the array will override properties from earlier objects when there are conflicts.
-   Choose "concat" to join arrays, "merge" to replace them, or "combine" for a more intelligent merge.

### See Also [​](#see-also)

-   **Objectify**: For creating an object from key-value pairs.
-   **Object Property**: For accessing specific properties of an object.

### Use Cases [​](#use-cases)

-   **Token Combining**: Merge base tokens with theme-specific overrides to create a complete token set.
-   **Configuration Building**: Combine default settings with user preferences to create a final configuration.
-   **Data Aggregation**: Merge data objects from multiple sources into a single comprehensive object.