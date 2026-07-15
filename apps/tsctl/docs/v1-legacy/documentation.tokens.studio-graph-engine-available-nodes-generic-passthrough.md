<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/passthrough -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Passthrough [​](#passthrough)

### What It Does [​](#what-it-does)

Passes a value directly from input to output without modifying it. This is useful for reorganizing graph connections or making temporary connections during development.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The value to pass through | Any | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The same value as the input | Any |

![Passthrough Example](/images/Screenshot%202025-04-22%20at%206.32.03%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Passthrough node into your graph.
2.  Connect any value to the "value" input.
3.  Connect the "value" output to any node that should receive the original value.
4.  The node will simply pass the value through without changing it.

### Tips [​](#tips)

-   Use Passthrough nodes to clean up complicated graph layouts by redirecting connections.
-   The node preserves the exact type of data passed through it, making it work with any value type.

### See Also [​](#see-also)

-   **Note**: For adding comments to your graph without affecting data flow.
-   **Objectify**: For combining multiple values into an object structure.

### Use Cases [​](#use-cases)

-   **Graph Organization**: Improve the readability of complex graphs by rerouting connections.
-   **Debugging**: Insert between connections to create inspection points during development.
-   **Interface Planning**: Use as placeholders when designing node interfaces before implementation.