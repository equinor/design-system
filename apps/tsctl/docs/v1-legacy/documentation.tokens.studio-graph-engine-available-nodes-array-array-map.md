<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/array/array-map -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Array](/graph-engine/available-nodes/array)

# Array Map [​](#array-map)

### What It Does [​](#what-it-does)

Transforms each item in a list by applying the same operations to every element. It runs a mini-graph for each item in your list and collects the results into a new list of the same length.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| array | The list to process each item | List | Yes |
| _Dynamic inputs_ | Any inputs you add to the inner graph will appear here | Varies | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The resulting list after processing each item | List |

![Array Map Example](/images/Screenshot%202025-04-17%20at%206.39.37%E2%80%AFPM.png)

### Inner Graph Special Inputs [​](#inner-graph-special-inputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The current array item being processed | Any |
| index | The current position in the array | Number |
| length | The total length of the array | Number |

### Inner Graph Required Output [​](#inner-graph-required-output)

| Name | Description | Type |
| --- | --- | --- |
| value | The transformed value to include in the result array | Any |

![](/images/CleanShot%202025-05-07%20at%2019.54.05@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Array Map node into your graph.
2.  Connect your list (like `[2, 4, 6, 8, 10]`) to the "array" input.
3.  Click on the 'Subgraph Explorer' the node to open the inner graph editor.
4.  Inside the inner graph, build your transformation logic using the "value" input.
5.  In this example we connect the "value" to a "Multiply" node and multiply by 100.
6.  Connect your transformed result to the "value" output on the Output node.
7.  Return to the main graph, right click on the "Array Map" and click on "Force Execute" to ensure the inner graph is run on each item in the array. The output will be an array with the operation done on each item in the array.

![](/images/CleanShot%202025-05-07%20at%2020.00.10@2x.png)

![](/images/CleanShot%202025-05-07%20at%2020.00.41@2x.png)

### Tips [​](#tips)

-   The inner graph runs once for each item in the array, in order.
-   You can add your own inputs to the inner graph's Input node, which will appear as inputs on the main Array Map node.
-   Use "index" inside the inner graph to access the position of the current item being processed.
-   The resulting array will always have the same length as the input array.

### See Also [​](#see-also)

-   [**Array Filter**](./filter): For selecting only specific items from a list rather than transforming all of them.
-   [**Array Find**](./find): For finding a single item in an array based on custom criteria.

### Use Cases [​](#use-cases)

-   **Color Palette Generation**: Transform a list of base colors by applying the same adjustments to each.
-   **Scaling Values**: Convert all measurements in a list by applying the same mathematical operations.
-   **Token Transformation**: Process each design token in a collection to add or modify properties consistently.