<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/exponential-decay -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Exponential Decay [​](#exponential-decay)

### What It Does [​](#what-it-does)

Generates a sequence of values that decrease according to the exponential decay formula P\*e^(-kx). This creates a curve that starts at an initial value and rapidly decreases at first, then tapers off gradually.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| initialValue | The starting value (P) | Number | No |
| length | Number of values to generate | Number | No |
| decayRate | The rate of decay (k) | Number | No |
| precision | Number of decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| values | The sequence of decreasing values | List |

![Exponential Decay Example](/images/Screenshot%202025-04-17%20at%204.28.39%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Exponential Decay node into your graph.
2.  Set the "initialValue" (default is 100).
3.  Set the "length" to specify how many values you want (default is 5).
4.  Set the "decayRate" to control how quickly values decrease (default is 0.5).
5.  Run the graph—with the default settings, your output will be \[100, 60.65, 36.79, 22.31, 13.53\].

### Tips [​](#tips)

-   Higher decay rates cause values to decrease more rapidly.
-   The decay is most dramatic at the beginning and gradually levels off.
-   The values will never reach zero, but will get increasingly close as the sequence continues.

### See Also [​](#see-also)

-   **Geometric Series**: For a similar sequence where each term is a constant multiple of the previous.
-   **Arithmetic Series**: For sequences that decrease by a constant value.
-   **Power Series**: For sequences based on powers of a number.

### Use Cases [​](#use-cases)

-   **Animation Easing**: Create natural-looking deceleration effects.
-   **Fade Out Effects**: Generate opacity or volume values that gradually fade away.
-   **Diminishing Returns**: Model scenarios where additional inputs yield increasingly smaller outputs.
-   **Physical Systems**: Simulate natural decay processes like radioactive half-life or cooling.