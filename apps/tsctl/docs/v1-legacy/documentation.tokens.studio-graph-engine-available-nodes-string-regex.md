<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/regex -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Regex [​](#regex)

### What It Does [​](#what-it-does)

Performs regular expression search and replace operations on text. It finds patterns in your input string and replaces them according to your specified replacement pattern.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| input | The text to process | String | Yes |
| match | The regular expression pattern to find | String | No |
| flags | Regex flags (like "g" for global, "i" for case-insensitive) | String | No |
| replace | The replacement pattern | String | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | The text after pattern replacement | String |

![](/images/CleanShot%202025-04-03%20at%2015.26.26@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Regex node into your graph.
2.  Connect the text you want to process to the "input" input. For e.g., `color.red.100`.
3.  Set the "match" value to the regular expression pattern you want to find (without the slashes). For e.g., `Color`.
4.  Set any "flags" you need for the regex operation (e.g., "i" to make it case insensitive).
5.  Define the "replace" pattern to substitute for matched text (e.g., `brand`).
6.  The output will be a string `brand.red.100`, where `color` is replaced with `brand`.

![](/images/CleanShot%202025-04-03%20at%2015.25.00@2x.png)

### Tips [​](#tips)

-   Don't include the slash delimiters in your match pattern - just the pattern itself.
-   Use the "g" flag to replace all occurrences rather than just the first match.
-   Regex flags:
    -   `i` : Ignore case, case-insensitive matching.
    -   `m` : Multi-line, multi-line matching.
    -   `s` : Dotall, dot matches any char including newline.
    -   `a` : ASCII, ASCII-only matching.
    -   `x` : Verbose, ignore whitespace and comments.
-   You can combine these flags in any order. For example:
    -   `i` - Case insensitive matching
    -   `im` - Case insensitive and multiline matching
    -   `is` - Case insensitive and dot matches newline
    -   `imsx` - Multiple flags combined

### See Also [​](#see-also)

-   [**Replace**](./replace): For simple string replacement without regular expressions.
-   [**Normalize**](./normalize): For standardizing text representation.

### Use Cases [​](#use-cases)

-   **Text Cleanup**: Remove or replace unwanted patterns or characters in text.
-   **Format Conversion**: Transform text patterns from one format to another.
-   **Data Extraction**: Isolate specific patterns from larger text blocks for token creation.