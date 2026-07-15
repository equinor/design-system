<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/typing/has-value -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Typing](/graph-engine/available-nodes/typing)

# Has Value [​](#has-value)

### What It Does [​](#what-it-does)

The Has Value node checks if a value is defined and outputs a boolean result. It evaluates whether the input is null or undefined, returning true if the value is missing and false if it exists.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The value to check for existence | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Result | True if the value is undefined or null, false otherwise | Boolean |

![Has Value Example](/images/Screenshot%202025-04-22%20at%205.55.40%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Has Value node into your graph.
2.  Connect any value to the "Value" input.
3.  The node outputs true if the value is null or undefined.
4.  Use the boolean output to control conditional logic in your graph.

### Tips [​](#tips)

-   This node is useful for handling optional inputs gracefully.
-   Combine with the If node to create fallback logic when values are missing.

### See Also [​](#see-also)

-   **Assert defined**: For throwing an error when a value is undefined.
-   **If**: For creating conditional branches based on the result.
-   **Parse Number**: For checking if a value can be parsed as a number.

### Use Cases [​](#use-cases)

-   **Default Value Selection**: Check if a value exists before deciding to use a fallback.
-   **Optional Parameter Handling**: Gracefully work with inputs that might not be provided.
-   **Data Validation**: Verify the presence of data before processing it.