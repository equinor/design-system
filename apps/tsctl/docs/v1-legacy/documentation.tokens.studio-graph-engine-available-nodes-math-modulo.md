<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/modulo -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Modulo [​](#modulo)

### What It Does [​](#what-it-does)

The Modulo node calculates the remainder when dividing one number by another. It's useful for creating cycles, determining if a number is divisible by another, and implementing wrap-around behaviors.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| A | The dividend (number being divided) | Number | Yes |
| B | The divisor (number to divide by) | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The remainder of A ÷ B | Number |

### How to Use It [​](#how-to-use-it)

1.  Drag the Modulo node into your graph.
2.  Connect your dividend to the "A" input.
3.  Connect your divisor to the "B" input.
4.  The output will be the remainder after division.

### Tips [​](#tips)

-   The result is always less than the divisor (B).
-   To check if a number is divisible by another, see if the modulo result is 0.
-   Be careful when using negative numbers, as the result follows JavaScript's modulo behavior.

### See Also [​](#see-also)

-   **Divide**: For getting the quotient of division.
-   **Floor**: Often used with division to get integer division results.

### Use Cases [​](#use-cases)

-   **Cycling Patterns**: Create repeating patterns in design elements (every Nth item).
-   **Alternating Styles**: Apply different styles based on element position (odd/even).
-   **Constraint Ranges**: Keep values within a specific range by wrapping around.