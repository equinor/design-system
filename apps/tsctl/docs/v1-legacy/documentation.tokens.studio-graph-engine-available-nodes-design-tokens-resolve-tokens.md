<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/resolve-tokens -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Resolve tokens [​](#resolve-tokens)

### What It Does [​](#what-it-does)

The Resolve tokens node processes a set of design tokens, resolving any references between them into their actual values. It's essential for handling token aliasing and transforming abstract token definitions into concrete values.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Inputs | The primary set of tokens to resolve | List of Lists | Yes |
| Context | Additional tokens to use for reference resolution | List of Lists | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Value | The resolved set of tokens with references replaced by actual values | List |

### How to Use It [​](#how-to-use-it)

1.  Drag the Resolve tokens node into your graph.
2.  Connect your primary tokens to the "Inputs" input.
3.  Optionally, connect additional tokens as context for reference resolution to the "Context" input.
4.  The output will be a flattened list of tokens with all references resolved to their actual values.

### Tips [​](#tips)

-   Context tokens are used for resolution but are excluded from the final output.
-   The node maintains token structure but replaces reference values like `{color.primary}` with their actual values.

### See Also [​](#see-also)

-   **Create Reference**: For creating references that can be resolved by this node.
-   **Destruct Token**: For breaking down tokens into their individual components.

### Use Cases [​](#use-cases)

-   **Token Preprocessing**: Prepare tokens for export by resolving all internal references.
-   **Reference Validation**: Verify that all token references can be successfully resolved.
-   **Theme Generation**: Create complete theme sets with all abstract references resolved to concrete values.