<!-- source: https://documentation.tokens.studio/example-graphs/creating-a-simple-color-scale -->

[Example Graphs](/example-graphs)

# Creating a simple color scale [​](#creating-a-simple-color-scale)

### What It Does [​](#what-it-does)

Creates a systematic color palette using algorithmic color scaling. This multi-step workflow generates a complete, systematic color scale using a algorithm. Starting with a base color, design tokens are created, organized, and named through it’s hierarchy.

### Complete Workflow [​](#complete-workflow)

This example demonstrates a 6-step process that transforms a single base color into a complete token system:

1.  Base Color Setup: Define the starting color
2.  Color Scale Generation: Create algorithmically related shades
3.  Token Creation: Convert each color into a named token
4.  Namespace Grouping: Add hierarchical prefixes
5.  Set Conversion: Format for token system output
6.  Final Export: Output structured token set

### Step 1: Selecting a base color for creating a scale [​](#step-1-selecting-a-base-color-for-creating-a-scale)

![](/images/Screenshot%202025-06-06%20at%208.43.36%E2%80%AFPM.png)

Selecting a color which will be used as the base color of a generated scale can be done in a number of ways using different nodes like [Constant](./../graph-engine/available-nodes/generic/constant), [Create Color](./../graph-engine/available-nodes/color/create), [Input](./../graph-engine/available-nodes/generic/input) etc. In this example, we will use Constant node as our starting point.

-   Drag a Constant node (Generic > Constant) into your graph.
-   Set the type of the input to be "Color" from the dropdown.
-   Set your base color value (the color that all other shades will be generated from).
-   The node will output the color value ready for scale generation.

> **Why Color Type Matters:** Setting the input type to "Color" ensures the Scale Colors node (which we will use to generate the color scale) can perform proper color calculations and transformations.

### Step 2: Generating a color scale using the base color [​](#step-2-generating-a-color-scale-using-the-base-color)

![](/images/CleanShot%202025-06-09%20at%2017.22.09@2x.png)

Once we have the base color as the output from our Constant node we want to generate a scale using the selected base color. To generate a color scale we will use a [Scale Colors](./../graph-engine/available-nodes/color/scale) node. This node takes a base color and generates a color scale, the number of steps in the scale can be adjusted by adjusting the `stepsUp` and `stepsDown` input in the node.

-   Drag a Scale Colors node into your graph.
-   Connect the output from your Constant node to the input named color in the Scale colors node.
-   You can adjust the number of steps in the scale, in this example we are creating a scale with 11 steps. This is done by setting the `stepsUp` to "5" and `stepsDown` to "5", so we have a scale with 5 colors above and below the base color.
-   The output will be a list (array) of 11 colors from lightest to darkest using your base color.  
    

![](/images/Screenshot%202025-06-06%20at%208.44.27%E2%80%AFPM.png)

We now have a list of colors but these colors are not yet in the design token format. In this example we want to convert these colors into design tokens and also name our design tokens in a logical manner.

### Step 3: Token Creation (Array Map Subgraph) [​](#step-3-token-creation-array-map-subgraph)

To create design tokens from our color scale, we use the [Array Map](./../graph-engine/available-nodes/array/array-map) node. The Array Map node allows you to perform an action on each item in a list. An Array Map node has an internal graph called a subgraph that operates on each item.

-   Drag an Array Map node into your graph.
-   Connect the output of your Scale colors node to the input of the Array Map node.

![](/images/CleanShot%202025-06-09%20at%2017.22.54@2x.png)

-   To define what happens inside the Array Map, click on the Subgraph Explorer button.
-   Inside the Array map we see a input node and an output node.
-   The input node inside the Array Map has the following inputs: value, index, length coming in from the Scale Color node. In the image below, we see a color with value `#191212` at index `10` and the length of the array `11`.

![](/images/CleanShot%202025-06-09%20at%2019.32.31@2x.png)

-   To create a design token we need to have the value as a string type, at this point the value that we have is a color type.
-   To convert a color to string we will use a [Color to string](./../graph-engine/available-nodes/color/color-to-string) node. Drag the Color to string node into the graph and connect the value from the input node to the color node. This will give us an output which is a string.  
    

![](/images/CleanShot%202025-06-09%20at%2019.48.24@2x.png)

-   There are various ways that we can name the design token, for this example we will use the [Numeric scale](./../graph-engine/available-nodes/naming/numeric-scale) node.
-   The Numeric scale node allows us the option to have a multiplier, a prefix and a suffix.
-   Drag a Numeric scale node into your graph. Connect the index from the input to the index of the Numeric scale node. We will add a multiplier of `100` and a prefix of `red.` to have a naming convention like `red.100` if the index is `1`.

![](/images/CleanShot%202025-06-09%20at%2019.54.28@2x.png)

-   Now we have the value and the name that we want to assign to our design token. To create a design token drag in the node [Create Design Token](./../graph-engine/available-nodes/design-tokens/create-design-token) into the graph.
-   Connect the output from the Numeric scale to the input called "name" in the Create Design Token node.
-   Connect the output from the Color to String node to the input name "value" in the Create Design Token node.
-   Set the type as "color" on the node from the input panel in the right, this is to create a color design token.

![](/images/CleanShot%202025-06-09%20at%2019.58.19@2x.png)

![](/images/CleanShot%202025-06-09%20at%2020.02.17@2x.png)

-   Now we have created a Design Token. Connect the output of the node to the output node that was present in the Array Map.

![](/images/CleanShot%202025-06-09%20at%2020.04.23@2x.png)

-   The output of the Array Map can be seen by clicking on the original graph.

![](/images/CleanShot%202025-06-09%20at%2020.20.35@2x.png)

-   On the original graph right-click the Array Map node and click on "Force Execution" to ensure that all the nodes inside the Array Map are executed on each item of our list from Scale Colors node.

![](/images/CleanShot%202025-06-09%20at%2020.22.38@2x.png)

-   The output of the Array Map will have a list of design tokens with the naming convention that we have created. Each color from the Scale colors node has been transformed to a design token with the correct naming.

![](/images/CleanShot%202025-06-09%20at%2020.25.47@2x.png)

### Step 4: Adding a namespace to the Design Tokens names [​](#step-4-adding-a-namespace-to-the-design-tokens-names)

-   We have the design tokens with the name as `red.100` . For this example we want to add a namespace "color" to our design token names (color.red.100).
-   To do this we will use the [Group Token](./../graph-engine/available-nodes/design-tokens/group-tokens) node, this node will let us add a namespace to an array of tokens.
-   Drag the Group Tokens node to the graph. In the input of the Group Tokens node, add "color" to the name input.
-   The output will be a list of design tokens that has the naming convention of "color.red.100".

![](/images/CleanShot%202025-06-09%20at%2020.33.12@2x.png)

### Step 5: Creating a token set [​](#step-5-creating-a-token-set)

-   At this point our design tokens are in a list or array. We need to convert the list to a token set before getting the final output.
-   To convert to a token set drag the [Array of tokens to Set](./../graph-engine/available-nodes/design-tokens/array-to-set) node. This will convert our design tokens from an array to a token set.

![](/images/CleanShot%202025-06-09%20at%2020.37.44@2x.png)

-   The output of this node gives us the design tokens in the format

```
{
"color": {
    "red": {
        "100": {
            "value": "#ede6e6",
            "type" : "color",
        }
        ......
    }
}
}
```

![](/images/Screenshot%202025-06-06%20at%209.32.22%E2%80%AFPM.png)

### Step 6: Final Output [​](#step-6-final-output)

-   To get the design tokens into the table format we need to connect it to the Output node.
-   **Important**: In the output node set the input in the right panel as "tokenSet".
-   Connect the output from the previous node to the input of the Output node.

![](/images/CleanShot%202025-06-09%20at%2020.50.30@2x.png)

### Step 7: Final Result [​](#step-7-final-result)

-   The graph is now complete and it will output the design tokens. Remember to click on the "Save" button to make sure that you do not lose your graph.

![](/images/Screenshot%202025-06-06%20at%209.35.58%E2%80%AFPM.png)

-   To view the design tokens in table format, click on the "Table" button next to the "Save" button.
-   We have a token set with colors generated from a single color which can be used as a reference in other sets. We can also now connect to the Tokens Studio for Figma plugin or the Companion by Tokens Studio plugin and use these design tokens in Figma.

![](/images/Screenshot%202025-06-06%20at%205.06.59%E2%80%AFPM.png)