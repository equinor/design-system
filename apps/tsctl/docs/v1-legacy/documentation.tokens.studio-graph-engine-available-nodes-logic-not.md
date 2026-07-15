<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/logic/not -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Logic](/graph-engine/available-nodes/logic)

# Not [​](#not)

### What It Does [​](#what-it-does)

Inverts a boolean value, turning true into false and false into true. This is useful for creating opposite conditions or toggling states in your design logic.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The boolean value to negate | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The opposite of the input value | Yes/No |

![](/images/Screenshot%202025-04-08%20at%203.26.38%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Logical Not node into your graph.
2.  Connect a boolean value (true/false) to the "value" input.
3.  Run the graph—if you input true, you'll get false; if you input false, you'll get true.
4.  Non-boolean values are converted to boolean before negation (e.g., 0 becomes false, then true).

![Logical Not Example](/images/Screenshot%202025-04-08%20at%203.29.06%E2%80%AFPM.png)

### Tips [​](#tips)

-   In JavaScript, values like 0, empty strings, null, and undefined are "falsy" and will be converted to true by the Not node.
-   Use Not to create inverse conditions rather than duplicating logic with opposite rules.

### See Also [​](#see-also)

-   **Logical AND**: For checking if multiple conditions are all true.
-   **Logical OR**: For checking if at least one condition is true.

### Use Cases [​](#use-cases)

-   **Toggle States**: Invert a boolean state to toggle between two modes (e.g., light/dark theme).
-   **Exclusion Rules**: Create rules for when something should not apply (e.g., "not mobile" for desktop-only features).
-   **Alternate Paths**: Set up different design logic paths based on the negation of a condition.