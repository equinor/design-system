<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/interpolation -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Interpolation [​](#interpolation)

### What It Does [​](#what-it-does)

Replaces placeholder variables in a string template with actual values. It allows you to create dynamic text by inserting variable content into a predefined template.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| template | The string template with placeholders like | String | Yes |
| (dynamic) | Values to insert into the template | Any | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The final string with replaced values | String |

![](/images/CleanShot%202025-03-24%20at%2011.02.28@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Interpolation node into your graph.
2.  Connect your template string with placeholders in curly braces like "color.{base}.500" to the "template" input. Here the placeholder is "base".
3.  Add custom inputs by right-clicking the node and adding inputs with names matching your placeholders.
4.  Connect values to each named input to replace the corresponding placeholders. Like "red".
5.  The output of the node is "color.red.500", the placeholder "base" is replaced by the named input "red".

![](/images/CleanShot%202025-03-24%20at%2011.08.54@2x.png)

### Tips [​](#tips)

-   Input names must exactly match the placeholder names in your template (without the curly braces).
-   Placeholders that don't have a matching input will remain unchanged in the output.

### See Also [​](#see-also)

-   [**Join**](./join): For combining multiple strings into one without using a template.
-   [**Replace**](./replace): For simpler find-and-replace text operations.

### Use Cases [​](#use-cases)

-   **Message Generation**: Create personalized messages by injecting names or other dynamic content.
-   **URL Construction**: Build dynamic URLs by inserting variable parameters into a template.
-   **Naming Patterns**: Generate consistent naming patterns for design tokens with variable components.