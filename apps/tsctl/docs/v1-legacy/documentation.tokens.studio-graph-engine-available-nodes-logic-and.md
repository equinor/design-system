<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/logic/and -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Logic](/graph-engine/available-nodes/logic)

# And [​](#and)

### What It Does [​](#what-it-does)

Checks if all connected inputs are true and returns a single true/false result. It's perfect for combining multiple conditions that all need to be met before proceeding with an action.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| inputs | Multiple values to check (can add as many as needed) | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | True if all inputs are true/truthy, false otherwise | Yes/No |

![](/images/Screenshot%202025-04-08%20at%203.03.14%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Logical AND node into your graph.
2.  Click the "+" button to add as many input connections as you need.
3.  Connect boolean values or conditions to each input.
4.  Run the graph—your output will be true only if all inputs are true.

![](/images/Screenshot%202025-04-08%20at%203.23.24%E2%80%AFPM.png)

### Tips [​](#tips)

-   Non-boolean values are converted to boolean: empty values, zero, null, and undefined become false.
-   An AND node with no inputs will return true (similar to mathematical product of an empty set).

### See Also [​](#see-also)

-   **Logical OR**: For checking if at least one condition is true.
-   **NOT**: For inverting a boolean value.

### Use Cases [​](#use-cases)

-   **Validation Rules**: Check if a color meets multiple criteria (high enough contrast AND within brand palette).
-   **Complex Conditions**: Enable a feature only when multiple requirements are met.
-   **Design States**: Apply a style only when an element is both hovered AND active.