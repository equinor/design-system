<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/inject-item -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Inject Item [​](#inject-item)

### What It Does [​](#what-it-does)

Adds a single item into a list at a specific position. Unlike push which adds to the end, this allows you to insert an item anywhere in the list.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The original list | List | Yes |
| item | The item to insert into the list | Any | Yes |
| index | The position to insert the item at | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The list with the new item added | List |

![Inject Item Example](/images/Screenshot%202025-04-17%20at%206.18.42%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Inject Item node into your graph.
2.  Connect your list (like `[16, 24]`) to the "array" input.
3.  Connect the item to insert (like `15`) to the "item" input.
4.  Set the "index" value (e.g., 1 to insert between the first and second items).

![](/images/CleanShot%202025-05-06%20at%2013.23.12@2x.png)

### Tips [​](#tips)

-   Use index 0 to insert at the beginning of the list.
-   You can use negative indexes to count from the end (-1 inserts before the last item).

### See Also [​](#see-also)

-   [**Array Push**](./push): For adding items to the end of an array.
-   [**Replace**](./../string/replace): For replacing existing items rather than inserting new ones.

### Use Cases [​](#use-cases)

-   **Color Palette Refinement**: Insert a transitional color between existing shades at a specific position.
-   **Priority Insertion**: Add a new high-priority item in the middle of an existing sequence.
-   **Layered Structure Design**: Insert elements between existing layers in a design structure.