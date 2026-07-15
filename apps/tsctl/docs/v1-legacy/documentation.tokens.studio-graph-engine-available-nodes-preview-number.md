<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/preview/number -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Preview](/graph-engine/available-nodes/preview)

# Number [​](#number)

### What It Does [​](#what-it-does)

The Number node displays numeric values in a formatted way. It provides a visual preview of numbers with configurable precision.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The number to display | Number | No |
| Precision | The number of decimal places to show | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| _No outputs_ | This node is for preview purposes only | \- |

![Number Example](/images/Screenshot%202025-04-08%20at%206.59.27%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Number node into your graph.
2.  Connect a numeric value to the "Value" input or use the default (12.27633).
3.  Optionally set the "Precision" input to control decimal places (default is 2).
4.  The node will display the formatted number for easy viewing (12.28).

![](/images/Screenshot%202025-04-08%20at%206.59.43%E2%80%AFPM.png)

### Tips [​](#tips)

-   Adjust the precision based on your needs—use higher values for more decimal places.
-   Use this node to monitor calculated values at specific points in your graph.

### See Also [​](#see-also)

-   [**Math Expression**](./math-expression): For calculating mathematical expressions.
-   [**Round**](./../math/round): For rounding numbers to specific precisions.

### Use Cases [​](#use-cases)

-   **Value Monitoring**: Display important numeric values in your design system.
-   **Calculation Verification**: Check intermediate or final calculation results.
-   **Parameter Display**: Show current values of key parameters in your graph.