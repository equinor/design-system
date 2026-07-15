<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/uppercase -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Uppercase [​](#uppercase)

### What It Does [​](#what-it-does)

Converts all characters in a text string to uppercase (capital letters). This is useful for creating consistent text formatting, headers, or emphasizing text.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| value | The text to convert to uppercase | String | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The converted uppercase text | String |

![](/images/CleanShot%202025-04-03%20at%2017.35.33@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Uppercase node into your graph.
2.  Connect a text string (like `"Hello World"`) to the "value" input.
3.  Run the graph—your output will be `"HELLO WORLD"`.
4.  Special characters and numbers remain unchanged.

![](/images/CleanShot%202025-04-03%20at%2017.36.12@2x.png)

### Tips [​](#tips)

-   Uppercase is useful for creating consistent formatting regardless of input casing.
-   Consider accessibility implications when using all caps, as it can be harder to read.

### See Also [​](#see-also)

-   [**Lowercase**](./lowercase): For converting text to all lowercase letters.
-   [**Case Convert**](./case-convert): For more text casing options like title case or camel case.

### Use Cases [​](#use-cases)

-   **Button Labels**: Convert text to uppercase for button labels in a design system.
-   **Headings & Titles**: Create standardized uppercase headings.
-   **Acronyms**: Ensure acronyms and initialisms are consistently displayed in caps.