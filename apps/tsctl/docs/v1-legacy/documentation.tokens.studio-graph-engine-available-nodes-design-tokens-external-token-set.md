<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/external-token-set -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# External Token Set [​](#external-token-set)

### What It Does [​](#what-it-does)

The External Token Set node retrieves a set of design tokens from an external source like a URL or file path. It loads and exposes these tokens for use in your design system graph.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| URI | The location of the external token set (URL or file path) | Text | Yes |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token Set | The loaded collection of design tokens | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the External Token Set node into your graph.
2.  Connect or enter a URI string pointing to your token set (e.g., a JSON file URL).
3.  The node will load the tokens from that location when the graph executes.
4.  The output will be the complete set of tokens ready for further processing.

### Tips [​](#tips)

-   Make sure the URI points to a valid token set in a supported format.
-   Use this node to import tokens from tools like Figma, Adobe XD, or other design systems.

### See Also [​](#see-also)

-   **Flatten Token Sets**: For combining multiple token sets into a single flat array.
-   **Resolve Tokens**: For resolving token references within imported token sets.

### Use Cases [​](#use-cases)

-   **Design System Integration**: Load tokens from an external design system repository.
-   **Version Control**: Reference tokens stored in a version-controlled repository.
-   **Remote Configuration**: Use remotely hosted tokens to enable centralized updates.