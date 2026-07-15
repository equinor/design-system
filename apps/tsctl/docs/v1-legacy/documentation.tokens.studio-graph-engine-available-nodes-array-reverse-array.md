<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/reverse-array -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Reverse Array [​](#reverse-array)

### What It Does [​](#what-it-does)

Flips the order of items in a list, making the last element first and the first element last. It creates a new reversed list without changing the original.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to be reversed | List | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The reversed list | List |

![Reverse Array Example](/images/Screenshot%202025-04-17%20at%206.32.42%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Reverse Array node into your graph.
2.  Connect your list (like `[Red, Green, Blue]`) to the "array" input.
3.  The output will be the list in reverse order (e.g., `[Blue, Green, Red]`).

![](/images/CleanShot%202025-05-07%20at%2018.58.34@2x.png)

### Tips [​](#tips)

-   This node preserves the original list and outputs a new reversed copy.
-   Useful for changing the visual priority or sequence of design elements.

### See Also [​](#see-also)

-   [**Sort Array**](./sort-array): For arranging items based on specific criteria rather than simply reversing them.
-   [**Array Filter**](./array-filter): For selectively including or excluding items from a list.

### Use Cases [​](#use-cases)

-   **Reversing Color Gradients**: Flip a color sequence to create an opposite gradient direction.
-   **Priority Inversion**: Transform a list sorted by importance to focus on different priorities.
-   **Visual Hierarchy Experimentation**: Test alternative arrangements of design elements by reversing their order.