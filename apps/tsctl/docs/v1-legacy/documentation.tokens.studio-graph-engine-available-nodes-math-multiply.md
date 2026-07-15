<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/multiply -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Multiply [​](#multiply)

### What It Does [​](#what-it-does)

The Multiply node performs multiplication between two numbers. It's one of the fundamental math operations, useful for scaling values, calculating areas, and applying coefficients.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| A | The first number in the multiplication | Number | Yes |
| B | The second number in the multiplication | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The product of A × B | Number |

![](/images/CleanShot%202025-03-18%20at%2018.13.58@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Multiply node into your graph.
2.  Connect your first number to the "A" input.
3.  Connect your second number to the "B" input.
4.  The output will be the product of the two numbers.

![](/images/CleanShot%202025-03-18%20at%2018.16.27@2x.png)

### Tips [​](#tips)

-   Multiplication is commutative, so the order of A and B doesn't matter.
-   To scale a value by a percentage, multiply by the percentage divided by 100.
-   Multiplying by 0 always gives 0, and multiplying by 1 leaves the value unchanged.

### See Also [​](#see-also)

-   [**Multiply (Variadic)**](./multiply-variadic): For multiplying more than two numbers at once.
-   [**Divide**:](./divide) For the inverse operation of multiplication.

### Use Cases [​](#use-cases)

-   **Scaling**: Adjust the size or intensity of values by a factor.
-   **Area Calculations**: Calculate areas by multiplying width and height.
-   **Percentage Adjustments**: Apply percentage-based modifications to values.