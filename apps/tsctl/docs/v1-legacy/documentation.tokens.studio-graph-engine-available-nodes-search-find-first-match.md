<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/search/find-first-match -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Search](/graph-engine/available-nodes/search)

# Find First Match [​](#find-first-match)

### What It Does [​](#what-it-does)

Searches through a list of numbers to find the first item that satisfies a specified comparison with a target value. It can find values greater than or less than a specified number and returns both the matching value and its position.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list of numbers to search through | List | Yes |
| target | The comparison value to test against | Number | Yes |
| operator | The comparison type (">" for greater than or "<" for less than) | Text | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The first matching value found (undefined if none found) | Number |
| index | The position of the matching value in the array (-1 if none found) | Number |
| found | Whether a matching value was found | Yes/No |

![Find First Match Example](/images/Screenshot%202025-04-22%20at%206.05.06%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Find First Match node into your graph.
2.  Connect an array of numbers (like `[5, 10, 15, 20]`) to the "array" input.
3.  Set a target number (like `12`) to the "target" input.
4.  Choose an operator (like `>` to find values greater than the target).
5.  Run the graph—with the example inputs, your output will be: value: `15`, index: `2`, found: `true`.

### Tips [​](#tips)

-   Always check the "found" output before using the value, as it may be undefined if no match was found.
-   The search stops at the first matching item, even if multiple items would match.

### See Also [​](#see-also)

-   **Array Find**: For more complex finding conditions using an inner graph.
-   **Array Filter**: For getting all items that match a condition instead of just the first.

### Use Cases [​](#use-cases)

-   **Threshold Detection**: Find the first value that exceeds a minimum threshold.
-   **Breakpoint Identification**: Locate the first screen width breakpoint that's smaller than the current viewport.
-   **Financial Analysis**: Find the first data point where a value crosses above or below a critical level.