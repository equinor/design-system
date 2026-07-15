<!-- source: https://documentation.tokens.studio/graph-engine/creating-a-graph-based-set/generating-a-token-set -->

[Graph Engine](/graph-engine)›[Creating a Graph Based Set](/graph-engine/creating-a-graph-based-set)

# Generating a Token Set [​](#generating-a-token-set)

Similar to static token sets, a graph-based set needs to define what tokens to be included, and what their values are.

To define the tokens of the token set, we need to generate a token set and set it as the output of the graph.

## What is a token set? [​](#what-is-a-token-set)

A token set is an object that contains the definitions of a single, or multiple design tokens. For example, a set of tokens that contain hex values, or font-size values.

## Basic Example [​](#basic-example)

### Step 1: Create a design token [​](#step-1-create-a-design-token)

To create a design token that will be included in a token set, use the [Create Design Token](./../available-nodes/design-tokens/create-design-token) node. Here, you can give your token a name, set the type and apply a value to it. You can set the values of each input manually, or use other nodes such as [Interpolation](./../available-nodes/string/interpolation) or [Constant](./../available-nodes/generic/constant).

INFO

There are of course many ways to generate the value of a token, and creating a design token may happen elsewhere in the flow, but the intention is the same.

![](/images/2025-05-08%20at%2010.57.19%20-%20Screengrab@2x.png)

_Defining a design token using the Create Design Token node._

### Step 2: Create an array of design tokens [​](#step-2-create-an-array-of-design-tokens)

To turn a token, or many, into a token set, first we need to build an array with them. Using the [Arrify](./../available-nodes/array/arrify) node, you can build an array by defining your design tokens as the input.

![](/images/2025-05-08%20at%2011.06.18%20-%20Screengrab@2x.png)

### Step 3: Convert Array to Token Set [​](#step-3-convert-array-to-token-set)

Now that you have an array of tokens, we need to turn it into a Token Set that we can output. Use the [Array To Set](./../available-nodes/design-tokens/array-to-set) node to turn the output of the Arrify node (currently an array of tokens), into a Token Set. You'll see that the output of the node is an object in the token format.

![](/images/2025-05-08%20at%2011.09.40%20-%20Screengrab@2x.png)

### Step 4: Output your Token Set [​](#step-4-output-your-token-set)

To capture the output of the graph and generate a tokenset, add an input named "tokenSet" and set the type to `any` . This will allow you to generate a token set, and export it directly.

![](/images/2025-05-08%20at%2010.33.28%20-%20Screengrab@2x.png)

_An output node with an input set to "tokenSet" and the type set to "any"._

Next, connect the output of the [Array To Set](./../available-nodes/design-tokens/array-to-set) node to your new tokenSet input

![](/images/2025-05-08%20at%2011.12.44%20-%20Screengrab@2x.png)

_Our entire graph where we create design tokens, group them in an array, turn the array into a set and then output them._

You'll now see your tokens presented with their resolved values in the table view of the set.

![](/images/2025-05-08%20at%2011.14.30%20-%20Screengrab@2x.png)

_Our outputted tokens in the table view of a Graph-Based set._