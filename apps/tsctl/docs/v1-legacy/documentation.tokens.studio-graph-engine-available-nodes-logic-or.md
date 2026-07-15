<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/logic/or -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Logic](/graph-engine/available-nodes/logic)

# Or [​](#or)

### What It Does [​](#what-it-does)

Checks if at least one of the connected inputs is true and returns a single true/false result. This is useful for combining alternative conditions where any one being true is sufficient.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| inputs | Multiple values to check (can add as many as needed) | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | True if any input is true/truthy, false otherwise | Yes/No |

![](/images/Screenshot%202025-04-08%20at%203.31.29%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Logical OR node into your graph.
2.  Click the "+" button to add as many input connections as you need.
3.  Connect boolean values or conditions to each input.
4.  Run the graph—your output will be true if at least one input is true.

![Logical OR Example](/images/Screenshot%202025-04-08%20at%203.33.50%E2%80%AFPM.png)

### Tips [​](#tips)

-   Non-boolean values are converted to boolean: most values become true except falsy values (0, "", null, undefined).
-   An OR node with no inputs will return false (similar to mathematical sum of an empty set).

### See Also [​](#see-also)

-   **Logical AND**: For checking if all conditions are true.
-   **NOT**: For inverting a boolean value.

### Use Cases [​](#use-cases)

-   **Fallback Logic**: Apply a style if either the primary or backup condition is met.
-   **Multi-Criteria Matching**: Match an item if it satisfies any one of several possible criteria.
-   **State Detection**: Detect when a component is in any one of several active states (hover OR focus OR active).