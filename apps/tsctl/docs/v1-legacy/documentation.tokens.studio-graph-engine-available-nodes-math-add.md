<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/add -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Add [​](#add)

### What It Does [​](#what-it-does)

Adds two numbers together to produce their sum. It's a basic math operation useful for combining numeric values like spacing tokens or opacity percentages.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| a | The first number to add | Number | Yes |
| b | The second number to add | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The sum of a and b | Number |

![](/images/CleanShot%202025-03-18%20at%2018.00.14@2x%20\(1\).png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Add node into your graph.
2.  Connect a number (like 3) to the "a" input.
3.  Connect another number (like `3`) to the "b" input.
4.  Run the graph—your output will be 6.

![](/images/CleanShot%202025-03-18%20at%2017.57.05@2x.png)

### Tips [​](#tips)

-   You can use the Add node with token references, like adding a base spacing value to an increment.
-   For adding more than two numbers, chain multiple Add nodes together or use the Variadic Add node.

### See Also [​](#see-also)

-   [**Subtract**](https://documentation.tokens.studio/graph-engine/available-nodes/math/subtract): For removing one number from another.
-   [**Multiply**](https://documentation.tokens.studio/graph-engine/available-nodes/math/multiply): For multiplying numbers together.

### Use Cases [​](#use-cases)

-   **Spacing Calculations**: Add a base spacing unit (4px) to a multiplier to create consistent spacing increments in your design system.
-   **Opacity Adjustments**: Add a percentage to a base opacity value to create a range of transparencies for different states.
-   **Font Size Scaling**: Add a fixed increment to your base font size to create larger heading sizes.