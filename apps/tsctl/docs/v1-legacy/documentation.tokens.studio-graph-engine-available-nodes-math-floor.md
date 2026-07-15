<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/floor -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Floor [​](#floor)

### What It Does [​](#what-it-does)

Rounds a number down to the nearest whole integer. This is useful for creating grid-based layouts, calculating complete units, or working with values that must be whole numbers.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The number to round down | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The input number rounded down to the nearest integer | Number |

![](/images/Screenshot%202025-03-27%20at%208.35.13%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Floor node into your graph.
2.  Connect a number (like `4.8`) to the "value" input.
3.  Run the graph—your output will be `4`.
4.  If the input is already a whole number like `13`, the output remains the same `13`.

![](/images/Screenshot%202025-03-27%20at%208.34.02%E2%80%AFPM.png)

### Tips [​](#tips)

-   Use floor when you need to count only complete units or ensure you never exceed a maximum.
-   Negative numbers are also rounded downward (e.g., -4.3 becomes -5).

### See Also [​](#see-also)

-   **Ceil**: For rounding up to the nearest integer.
-   **Round**: For rounding to the nearest integer (up or down).

### Use Cases [​](#use-cases)

-   **Page Indexing**: Calculate the current page number based on item count and items per page.
-   **Complete Units**: Count only complete units (e.g., whole hours passed).
-   **Max Constraints**: Ensure you never exceed a maximum by discarding fractional parts.