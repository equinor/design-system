<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/replace-item -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Replace Item [​](#replace-item)

### What It Does [​](#what-it-does)

Substitutes an item at a specific position in a list with a new item. The original list remains unchanged while a new list is created with the replacement.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The original list | List | Yes |
| item | The new item to put into the list | Any | Yes |
| index | The position to replace (starts at 0) | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The list with the replaced item | List |

![Replace Item Example](/images/Screenshot%202025-04-17%20at%206.31.17%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Replace Item node into your graph.
2.  Connect your list (like `[Red, Green, Blue]`) to the "array" input.
3.  Connect the replacement item (like `Yellow`) to the "item" input.
4.  Set the "index" value (e.g., 2 to replace the third item).

![](/images/CleanShot%202025-05-07%20at%2018.53.47@2x.png)

### Tips [​](#tips)

-   Array indexes start at 0, so index 1 refers to the second item in the list.
-   You can use negative indices to count from the end (-1 replaces the last item).

### See Also [​](#see-also)

-   [**Inject Item**](./inject-item): For inserting new items without replacing existing ones.
-   [**Remove Item**](./remove): For removing items from a list without replacements.

### Use Cases [​](#use-cases)

-   **Color Palette Refinement**: Replace a color in a palette with an improved version.
-   **Token Update**: Swap out a specific design token in a collection with an updated value.
-   **Content Revision**: Update specific items in a structured content list without changing the list structure.