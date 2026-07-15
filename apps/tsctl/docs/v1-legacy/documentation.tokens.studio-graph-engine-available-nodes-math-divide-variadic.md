<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/divide-variadic -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Divide Variadic [​](#divide-variadic)

### What It Does [​](#what-it-does)

Performs sequential division of multiple numbers, starting with the first value and dividing by each subsequent value. Unlike the basic Divide node which has fixed inputs, this node can accept any number of values for division.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| inputs | The list of numbers to divide sequentially | List | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The result of the sequential division | Number |

![](/images/CleanShot%202025-04-02%20at%2019.43.13@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Divide (Variadic) node into your graph.
2.  Connect any number of numeric values to the "inputs" handle.
3.  Each connected value will automatically be added to the inputs list.
4.  Run the graph—the output will be the first value divided by all subsequent values.
5.  For example, with inputs (`100, 5, 20`), the output will be `1` (`100÷5÷20`).

![](/images/CleanShot%202025-04-02%20at%2019.41.16@2x.png)

### Tips [​](#tips)

-   You need at least one value for the node to work properly.
-   Division happens from left to right (first value divided by second, result divided by third, etc.).
-   Be careful with zero divisors—dividing by zero will cause errors.

### See Also [​](#see-also)

-   [**Divide**](./divide): The standard division node with two fixed inputs.
-   [**Multiply Variadic**](./multiply-variadic): For multiplying multiple values together.
-   [**Add Variadic**](./add-node-variadic): For adding multiple values together.

### Use Cases [​](#use-cases)

-   **Ratio Calculations**: Compute ratios involving multiple factors.
-   **Scaling**: Sequentially reduce a value by multiple divisors.
-   **Unit Conversions**: Apply multiple conversion factors in sequence.
-   **Proportional Distribution**: Calculate shares or portions from a total amount.