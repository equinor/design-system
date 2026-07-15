<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/string/normalize -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[String](/graph-engine/available-nodes/string)

# Normalize [​](#normalize)

### What It Does [​](#what-it-does)

Standardizes text by applying Unicode normalization and optionally removing diacritical marks (accents). It ensures consistent text representation regardless of how characters were originally encoded.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| string | The text to normalize | String | Yes |
| form | The Unicode normalization form | String | No |
| removeAccents | Whether to remove accents from characters | Yes/No | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| string | The normalized text | String |

![](/images/CleanShot%202025-03-24%20at%2011.29.05@2x.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Normalize node into your graph.
2.  Connect the text you want to normalize to the "string" input.
3.  Select the desired normalization form (NFC, NFD, NFKC, or NFKD).
4.  Set "removeAccents" to true if you want to remove diacritical marks from characters.

![](/images/CleanShot%202025-04-03%20at%2015.59.40@2x.png)

### Tips [​](#tips)

-   Use NFC (default) for most general text normalization needs.
-   Setting "removeAccents" to true will convert characters like "é" to "e" while preserving the base character.

### See Also [​](#see-also)

-   [**Case Convert**](./case-convert): For changing between different text case formats.
-   [**Regex**](./regex): For more advanced text transformations using regular expressions.

### Use Cases [​](#use-cases)

-   **Search Optimization**: Normalize text for more accurate searching across accented and non-accented versions.
-   **Internationalization**: Standardize user input from different languages and character sets.
-   **URL Generation**: Create clean, accent-free slugs for web addresses from international text.