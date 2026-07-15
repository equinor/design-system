<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/typing/parse-number -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Typing](/graph-engine/available-nodes/typing)

# Parse Number [​](#parse-number)

### What It Does [​](#what-it-does)

The Parse Number node converts a string representation of a number into an actual number value. If the conversion fails (resulting in NaN), the node throws an error.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The string to convert to a number | String | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The converted number value | Number |

![Parse Number Example](/images/Screenshot%202025-04-22%20at%205.56.46%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Parse Number node into your graph.
2.  Connect a string value to the "Value" input.
3.  The node attempts to convert the string to a number.
4.  If successful, the number is output.
5.  If the string cannot be parsed as a number, an error is thrown.

### Tips [​](#tips)

-   This node is stricter than JavaScript's built-in parsing as it throws an error on invalid input.
-   Use this node when you need to ensure numerical operations will work correctly.
-   Consider using a Try/Catch node to handle potential parsing errors gracefully.

### See Also [​](#see-also)

-   **Parse unit**: For extracting both the number and unit from a value.
-   **Pass unit**: For adding a unit to a number.
-   **Number To String**: For converting in the opposite direction.

### Use Cases [​](#use-cases)

-   **User Input Validation**: Convert user-provided string inputs to numbers for calculations.
-   **Data Cleaning**: Ensure values from external sources are proper numbers before processing.
-   **Configuration Parameter Processing**: Convert string configuration values to numbers for use in calculations.