<!-- source: https://documentation.tokens.studio/graph-engine/types -->

[Graph Engine](/graph-engine)

# Types [​](#types)

Every node port in the Graph Engine, whether it's an input or output, is **strongly typed**. This means that each port is designed to work with only one specific kind of data.

### What does "Strongly Typed" mean? [​](#what-does-strongly-typed-mean)

Think of a port like a specialized container - a `number` input can only accept numerical values (like 12, 42.5, 0.432, etc.), while a `color` port is specifically designed for color values (hex, rgba, hsl, p3, etc.). Trying to connect incompatible types, such as sending a color to a number input, won't work.

#### Benefits of Strong Typing [​](#benefits-of-strong-typing)

This approach keeps your graphs reliable by:

-   **Preventing common mistakes** - The Graph Engine stops you from making connections that don't make sense (like trying to perform math operations on text)
-   **Ensuring consistent outputs** - Your design tokens and generated code remain predictable
-   **Simplifying troubleshooting** - When something goes wrong, it's easier to find where the problem is

## Supported Types You'll Encounter [​](#supported-types-youll-encounter)

| Name | Description | Example |
| --- | --- | --- |
| Number | Integers or decimals | 5, 3.14, 0.025 |
| String | Text strings, special characters or text with spaces. | "bold", "#FF5733" |
| Color | Color objects such as RGB, HSL etc. formats. | rgb(76, 190, 66), hsl(67, 96, 65) |
| Array | Lists of values (contains multiple items of the same type) | \[10, 20, 30\], \["#263724", "#ED8DF0"\] |
| Object | Collections of related values with names in the format of "key" : "value". | { "foreground": "#177BF7"} |
| Boolean | True or False. Useful for decisions to your logic with the [logic](available-nodes/logic/) node. | true, false |
| Curve | A |  |
| Token | A design token that meets the DTCG format. |  |
| Token Set | A special type for design token collections |  |
| Any | An agnostic type value that you probably don't want to use. |  |

## How to Identify Port Types in the Graph Engine [​](#how-to-identify-port-types-in-the-graph-engine)

Ports use both colors and shapes to indicate what type of data they accept or output:

### Color Coding [​](#color-coding)

Each type has a distinct color associated with it:

| Color | Data Type |
| --- | --- |
| Blue | Number |
| Green | String |
| Red | Color |
| Orange | Boolean |
| Magenta | Curve |
| Teal | Object |
| Yellow | Array |
| Purple | Any |

### **Shape Indicators** [​](#shape-indicators)

Ports also use shapes to indicate whether they handle single values or collections:

-   **Circle/Dot** (●): Accepts or outputs a single value (e.g., one color, one number)
-   **Square** (■): Accepts or outputs an array/list of values (e.g., a list of colors)

INFO

Hovering over a port shows its type label (e.g., "color") if "Port Types" is enabled in settings.

## Displaying Labels for Port Types [​](#displaying-labels-for-port-types)

You can display the labels for all ports to easily identify the type. This can be done from clicking the "Settings" icon on the Top Bar and enabling Show Inline Types.

![](/images/2025-05-08%20at%2012.52.19%20-%20Screengrab@2x.png)

## Converting Types [​](#converting-types)

Mismatched types block connections, but conversion nodes fix this:

-   **Why It’s Needed**:
    -   Example: A "Color Generator" outputs a color object, but a "Create Design Token" needs a hex string. They won’t connect directly.
-   **How to Convert**:
    -   **Scenario**: Convert a color to a hex string.
        1.  Connect the "Create Color" output (color) to a "Color to String" node’s input.
        2.  The node outputs a hex string (e.g., "#FF5733").
        3.  Plug this into the "Create Design Token" input, which now works.
    -   **Other Conversions**: "Stringify" (e.g., 10 → "10").

![](/images/Type%20Conversion.png)