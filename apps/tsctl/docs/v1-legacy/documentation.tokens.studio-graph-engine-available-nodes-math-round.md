<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/round -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Round [​](#round)

### What It Does [​](#what-it-does)

The Round node adjusts a floating-point number to the nearest integer or to a specified precision. It's essential for cleaning up decimal values and ensuring consistent precision in your calculations.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Value | The number you want to round | Number | No |
| Precision | How many decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The rounded number | Number |

![Round Example](/images/Screenshot%202025-04-08%20at%204.55.41%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Round node into your graph.
2.  Connect the number you want to round to the "Value" input.
3.  Set the "Precision" input to specify how many decimal places to keep.
4.  The output will be your number rounded to the specified precision.

![](/images/Screenshot%202025-04-08%20at%204.56.26%E2%80%AFPM%20\(1\).png)

### Tips [​](#tips)

-   A precision of 0 (the default) rounds to the nearest whole number.
-   Positive precision values round to that many decimal places (e.g., 2 gives 0.01 precision).
-   To round to the nearest 10, 100, etc., use negative precision values (-1, -2, etc.).

### See Also [​](#see-also)

-   **Floor**: For always rounding down to the nearest integer.
-   **Ceil**: For always rounding up to the nearest integer.
-   **Snap**: For rounding to specific increments beyond simple decimal places.

### Use Cases [​](#use-cases)

-   **Clean Decimal Display**: Ensure values display with a consistent number of decimal places.
-   **Financial Calculations**: Round currency values to 2 decimal places.
-   **Measurement Precision**: Control the precision of physical measurements in design systems.