<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/typing/assert-defined -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Typing](/graph-engine/available-nodes/typing)

# Assert Defined [​](#assert-defined)

### What It Does [​](#what-it-does)

The Assert defined node checks if a value is defined and throws an error if it's undefined. It helps enforce data requirements in your graph by stopping execution when required values are missing.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The value to check for being defined | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The original input value (if defined) | Any |

![Assert defined Example](/images/Screenshot%202025-04-22%20at%205.53.12%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Assert defined node into your graph.
2.  Connect any value to the "Value" input.
3.  If the value is defined, it passes through to the output.
4.  If the value is undefined, the node throws an error and stops graph execution.

### Tips [​](#tips)

-   Use this node to validate required inputs early in your graph.
-   This creates a clear failure point rather than propagating undefined values.

### See Also [​](#see-also)

-   **Has Value**: For checking if a value is defined without throwing an error.
-   **If**: For conditionally executing different paths based on value existence.

### Use Cases [​](#use-cases)

-   **Input Validation**: Ensure required parameters have values before processing.
-   **Error Prevention**: Stop graph execution early if critical data is missing.
-   **API Response Validation**: Verify that expected properties exist in data responses.