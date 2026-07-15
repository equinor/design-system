<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/css/css-map -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[CSS](/graph-engine/available-nodes/css)

# CSS Map [​](#css-map)

### What It Does [​](#what-it-does)

Creates an object containing CSS properties from all connected inputs. It allows you to gather multiple CSS-related values into a single structured object.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| (dynamic) | Any CSS property you want to include | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | Object containing all CSS properties | Object |

### How to Use It [​](#how-to-use-it)

1.  Drag the CSS Map node into your graph.
2.  Add inputs by right-clicking the node and selecting "Add Input".
3.  Name each input using valid CSS property names (e.g., "color", "font-size").
4.  Connect values to each input to build your CSS object.

### Tips [​](#tips)

-   Only properties with connected values will appear in the output object.
-   Property names should match standard CSS property names for compatibility with CSS output formats.

### See Also [​](#see-also)

-   **CSS Box**: For creating box model-specific CSS properties.
-   **CSS Function**: For generating CSS function syntax like calc() or var().

### Use Cases [​](#use-cases)

-   **Component Styling**: Collect various style properties to define a component's appearance.
-   **Token Organization**: Group related CSS properties into a structured format for design systems.
-   **Style Preprocessing**: Prepare multiple CSS values before applying them to style generators.