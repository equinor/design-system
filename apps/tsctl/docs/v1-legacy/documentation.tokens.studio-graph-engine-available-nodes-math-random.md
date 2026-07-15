<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/random -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Random [​](#random)

### What It Does [​](#what-it-does)

The Random node generates a random decimal number between 0 (inclusive) and 1 (exclusive). It's useful for creating variability, randomized designs, and simulating unpredictable behaviors.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| _None_ | _This node has no inputs_ | _N/A_ | _N/A_ |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | A random number between 0 and 1 | Number |

![](/images/Screenshot%202025-04-08%20at%204.45.14%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Random node into your graph.
2.  The node generates a random value when it's first created.
3.  Connect the "Value" output to other nodes that need randomization.
4.  Note that the value stays fixed after generation and doesn't change during execution.

![Random Example](/images/Screenshot%202025-04-08%20at%204.44.22%E2%80%AFPM.png)

### Tips [​](#tips)

-   To get a random range other than 0-1, use math nodes to scale and shift the output.
-   For values like 0-100, multiply the random value by 100.
-   For ranges like 20-50, multiply by 30 (the range) and add 20 (the minimum).

### See Also [​](#see-also)

-   **Range Mapping**: For mapping the 0-1 output to other ranges.
-   **Multiply**: For scaling the random value.

### Use Cases [​](#use-cases)

-   **Variation in Design**: Add controlled randomness to spacing, sizing, or colors.
-   **Testing Edge Cases**: Simulate different possible values during system testing.
-   **Jitter Effects**: Add natural-looking variation to regular patterns or layouts.