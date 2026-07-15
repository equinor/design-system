<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/add-node-variadic -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Add Variadic [​](#add-variadic)

### What It Does [​](#what-it-does)

Adds two or more numbers together, summing up all the connected inputs. Unlike the basic Add node which has fixed inputs, this node can accept any number of values to add.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| inputs | The list of numbers to add together | List | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The sum of all input values | Number |

![](/images/CleanShot%202025-03-18%20at%2018.38.37@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Add Node (Variadic) into your graph.
2.  Connect any number of numeric values to the "inputs" handle.
3.  Each connected value will automatically be added to the inputs list.
4.  Run the graph—the output will be the sum of all connected values.
5.  For example, with inputs (3, 5, 7, 9), the output will be 24.

![](/images/CleanShot%202025-03-18%20at%2018.42.50@2x.png)

### Tips [​](#tips)

-   You can keep connecting more inputs as needed—there's no limit.
-   If no inputs are connected, the output will be 0.
-   This node is useful when you don't know in advance how many values you'll need to add.

### See Also [​](#see-also)

-   [**Add**](./../vector2/add): The standard addition node with two fixed inputs.
-   [**Multiply Variadic**](./multiply-variadic): For multiplying multiple values together.

### Use Cases [​](#use-cases)

-   **Flexible Calculations**: Perform addition with a variable number of inputs.
-   **Dynamic Budgeting**: Add up expenses or income from multiple sources.
-   **Cumulative Values**: Combine multiple metrics or measurements.
-   **Configuration Sums**: Add together multiple customizable components of a value.