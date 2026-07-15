<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/case-convert -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Case Convert [​](#case-convert)

### What It Does [​](#what-it-does)

Transforms text between different case formats like camelCase, snake\_case, kebab-case, and PascalCase. It intelligently converts any string to your chosen case style.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| string | The text to convert | String | Yes |
| type | The target case format | String | No |
| delimiters | Characters to treat as word separators | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| string | The converted text in chosen case | String |

![](/images/CleanShot%202025-03-24%20at%2010.59.38@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Case Convert node into your graph.
2.  Connect the text you want to convert to the "string" input.
3.  Select the desired case format from the "type" dropdown (camel, snake, kebab, or pascal).
4.  Optionally specify custom delimiters if needed (default is "-\_.").

![](/images/CleanShot%202025-03-24%20at%2011.01.43@2x.png)

### Tips [​](#tips)

-   The node intelligently handles existing camelCase and PascalCase by adding spaces before capital letters.
-   Custom delimiters let you control what characters are treated as word separators.

### See Also [​](#see-also)

-   [**Uppercase**](./uppercase): For converting text to ALL CAPS format.
-   [**Lowercase**](./lowercase): For converting text to all lowercase format.

### Use Cases [​](#use-cases)

-   **Design Token Naming**: Standardize variable names when generating design tokens for different platforms.
-   **Code Generation**: Convert between naming conventions for different programming languages or frameworks.
-   **API Integration**: Transform data fields between different naming conventions for API payloads.