<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/math/square-root -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Math](/graph-engine/available-nodes/math)

# Square Root [​](#square-root)

### What It Does [​](#what-it-does)

The Square Root node calculates the square root of a number - the value which, when multiplied by itself, equals the original number. It's essential for geometric calculations and creating non-linear scaling.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Radicand | The number to find the square root of | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The square root of the input number | Number |

![Square Root Example](/images/Screenshot%202025-04-08%20at%205.40.54%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Square Root node into your graph.
2.  Connect a positive number to the "Radicand" input.
3.  The output will be the square root of the input.
4.  Use this for creating non-linear scales or calculating geometric properties.

![](/images/Screenshot%202025-04-08%20at%205.41.31%E2%80%AFPM.png)

### Tips [​](#tips)

-   The input should be zero or positive for real number results.
-   Using a negative input will result in NaN (Not a Number).
-   Square root grows slower than linear functions, useful for compression effects.

### See Also [​](#see-also)

-   **Pow**: For calculating powers, including the reverse operation of square root.
-   **Abs**: For ensuring a value is positive before taking its square root.

### Use Cases [​](#use-cases)

-   **Non-linear Scaling**: Create spacing or sizing scales that grow more gradually.
-   **Distance Calculations**: Compute distances in 2D or 3D space.
-   **Visual Dampening**: Reduce extreme values while preserving smaller ones.