<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/concat -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Concat [​](#concat)

### What It Does [​](#what-it-does)

Combines two lists into a single list by joining them end-to-end. This is perfect for merging collections like color arrays, spacing scales, or any other grouped token sets.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| a | The first list to combine | List | Yes |
| b | The second list to add to the end | List | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The combined list with all items from both lists | List |

![Array Concat Example](/images/Screenshot%202025-04-17%20at%206.13.09%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Array Concat node into your graph.
2.  Connect your first list (like `[Red, Blue]`) to the "a" input.
3.  Connect your second list (like `[Green, Yellow]`) to the "b" input.
4.  Run the graph—your output will be `[Red, Blue, Green, Yellow]`.

![](/images/CleanShot%202025-05-06%20at%2011.40.05@2x.png)

### Tips [​](#tips)

-   Both lists must be of the same type (e.g., both colors or both numbers).
-   Use multiple Concat nodes to combine more than two lists.

### See Also [​](#see-also)

-   [**Array Push**](./push): For adding just a single item to a list.
-   [**Array Remove**](./remove): For removing items from a list.

### Use Cases [​](#use-cases)

-   **Combining Token Collections**: Merge a base set of tokens with extension sets (e.g., join core colors with accent colors).
-   **Building Complete Scales**: Combine different parts of a scale (e.g., join negative and positive spacing values).
-   **Theme Management**: Join multiple theme-specific token collections to create a comprehensive theme.