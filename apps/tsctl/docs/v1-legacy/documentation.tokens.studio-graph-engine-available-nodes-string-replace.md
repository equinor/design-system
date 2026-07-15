<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/replace -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Replace [​](#replace)

### What It Does [​](#what-it-does)

Finds and replaces all occurrences of a search string with a replacement string. This is useful for removing, substituting, or modifying specific parts of text.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| string | The original text to perform replacements on | String | Yes |
| search | The text pattern to find and replace | String | Yes |
| replace | The new text to insert in place of the search text | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| string | The resulting text after all replacements | String |

![](/images/CleanShot%202025-04-03%20at%2017.17.11@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Replace node into your graph.
2.  Connect your source text to the "string" input (like `"Hello World"`).
3.  Set the "search" input to the text you want to replace (like `"World"`).
4.  Set the "replace" input to the replacement text (like `"Universe"`).
5.  The output will be `"Hello Universe"`.

![](/images/CleanShot%202025-04-03%20at%2017.18.44@2x.png)

### Tips [​](#tips)

-   To remove text entirely, leave the "replace" input empty or set it to an empty string.
-   This node replaces all occurrences, not just the first match.
-   This node is case sensitive.

### See Also [​](#see-also)

-   [**Split**](./split): For breaking text into parts based on a separator.
-   [**Regex**:](./regex) For more advanced pattern matching and replacement.

### Use Cases [​](#use-cases)

-   **Text Cleaning**: Remove unwanted characters or fix common typos in text.
-   **Token Formatting**: Convert token references like `{spacing.sm}` to their actual values.
-   **Content Variations**: Create different text versions by replacing key terms or phrases.