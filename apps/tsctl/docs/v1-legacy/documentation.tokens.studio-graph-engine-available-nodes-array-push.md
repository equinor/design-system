<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/push -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Array Push [​](#array-push)

### What It Does [​](#what-it-does)

Adds a single item to the end of a list and gives you the updated list. It's perfect for growing collections like color palettes or spacing scales step-by-step.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list you want to add to | List | Yes |
| item | The single thing you want to add | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The new list with the item added | List |

![Array Push Example](/images/Screenshot%202025-04-17%20at%206.21.43%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Array Push into the editor.
2.  Connect a list (like `[Red, Blue, Green]`) to the "array" input.
3.  Connect a single item (like `Purple`) to the "item" input.
4.  Run the graph—your output will be `[Red, Blue, Green, Purple]`.

![](/images/CleanShot%202025-05-06%20at%2014.06.43@2x.png)

### Tips [​](#tips)

-   Match the item type to your list (e.g., don't add a number to a color list).
-   Use this when building a list one item at a time.

### See Also [​](#see-also)

-   [**Array Concat**](./concat): For combining two lists.
-   [**Array Remove**](./remove): For taking items out of a list.

### Use Cases [​](#use-cases)

-   **Building a Color Palette**: Start with a base color list and add new shades (e.g., push `#33F` to `[#00F, #66F]`).
-   **Spacing Scale**: Grow a spacing set by adding new values (e.g., push `16px` to `[4px, 8px]`).
-   **Design Token Collection**: Add a new token (like a border style) to an existing token list.