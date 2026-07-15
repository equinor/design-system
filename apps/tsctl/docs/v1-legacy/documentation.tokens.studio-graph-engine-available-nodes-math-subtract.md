<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/subtract -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Subtract [​](#subtract)

### What It Does [​](#what-it-does)

Subtracts one number from another, producing their difference. This basic math operation is useful for finding gaps between values or reducing numeric values.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| a | The first number (minuend) | Number | Yes |
| b | The number to subtract (subtrahend) | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The difference (a minus b) | Number |

![Subtract Example](/images/Screenshot%202025-04-08%20at%205.45.31%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Subtract node into your graph.
2.  Connect a number (like `44`) to the "a" input.
3.  Connect another number (like `33`) to the "b" input.
4.  Run the graph—your output will be `10`.

![](/images/Screenshot%202025-04-08%20at%205.46.46%E2%80%AFPM.png)

### Tips [​](#tips)

-   Remember that subtraction is not commutative: a - b is not the same as b - a.
-   For absolute differences (regardless of which is larger), pair this with an Absolute node.

### See Also [​](#see-also)

-   **Add**: For adding numbers together.
-   **Multiply**: For multiplying numbers together.

### Use Cases [​](#use-cases)

-   **Spacing Adjustment**: Calculate the difference between container width and content width.
-   **Relative Positioning**: Determine offsets from a base position in layouts.
-   **Token Derivation**: Create derived tokens by subtracting values from a base token.