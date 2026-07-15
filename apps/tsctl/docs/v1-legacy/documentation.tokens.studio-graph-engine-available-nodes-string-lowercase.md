<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/lowercase -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Lowercase [​](#lowercase)

### What It Does [​](#what-it-does)

Converts all characters in a text string to lowercase (small letters). This helps create consistent text formatting or normalize user input for comparisons.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The text to convert to lowercase | String | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The converted lowercase text | String |

![](/images/CleanShot%202025-03-24%20at%2011.21.49@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Lowercase node into your graph.
2.  Connect a text string (like `"Hello World"`) to the "value" input.
3.  Run the graph—your output will be `"hello world"`.
4.  Special characters and numbers remain unchanged.

![](/images/CleanShot%202025-03-24%20at%2011.23.37@2x.png)

### Tips [​](#tips)

-   Lowercase is particularly useful for normalizing text for case-insensitive comparisons.
-   It's often used for body text, URLs, and email addresses in design systems.

### See Also [​](#see-also)

-   [**Uppercase**](./uppercase): For converting text to all capital letters.
-   [**Case Convert**](./case-convert): For more text casing options like title case or camel case.

### Use Cases [​](#use-cases)

-   **Text Normalization**: Standardize text from different sources for consistent display.
-   **Search Terms**: Process search inputs for case-insensitive matching.
-   **Design System Text**: Ensure consistent casing for body copy, captions, or labels.