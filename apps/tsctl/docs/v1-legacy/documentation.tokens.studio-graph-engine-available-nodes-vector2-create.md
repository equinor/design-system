<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/vector2/create -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Vector2](/graph-engine/available-nodes/vector2)

# Create [​](#create)

### What It Does [​](#what-it-does)

Creates a 2D vector from x and y coordinate values. A 2D vector represents both direction and magnitude, useful for positions, dimensions, or movements in a 2D space.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| x | The horizontal component of the vector | Number | Yes |
| y | The vertical component of the vector | Number | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The created 2D vector | Vector2 |

![Create Vector2 Example](/images/Screenshot%202025-04-22%20at%206.01.06%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Create Vector2 node into your graph.
2.  Connect or enter a number for the "x" input.
3.  Connect or enter a number for the "y" input.
4.  Run the graph—your output will be a 2D vector containing both values.

### Tips [​](#tips)

-   Vectors are represented as \[x, y\] arrays but have special properties when used with vector operations.
-   Use this node when you need to work with positions, directions, or sizes in 2D space.

### See Also [​](#see-also)

-   **Vector2 Add**: For combining two vectors together.
-   **Vector2 Destructure**: For breaking a vector into its x and y components.

### Use Cases [​](#use-cases)

-   **Position Calculations**: Create position vectors for layout algorithms.
-   **Size Definition**: Define width and height as a vector for aspect ratio calculations.
-   **Direction Vectors**: Create normalized direction vectors for animations or gradients.