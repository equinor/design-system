<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/create-box-shadow-design-token -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Design Tokens](/graph-engine/available-nodes/design-tokens)

# Create Box Shadow Design Token [​](#create-box-shadow-design-token)

### What It Does [​](#what-it-does)

The Create Box Shadow Design Token node constructs a box-shadow-type design token from provided inputs. It allows you to define shadow properties such as x-offset, y-offset, blur, spread, and color, and generates a standardized token object that can be used in a design system.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| Name | The name identifier for the token | String | Yes |
| Reference | A reference to another token (used when the token references another token) | String | No\* |
| Value | Array of box shadow values defining x, y, blur, spread and color | Array | No\* |
| Description | Optional description of what the token represents | String | No |
| $extensions | Optional metadata for the token | Object | No |

\*Either Reference or Value must be provided

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| Token | The complete design token object | Object |

### How to Use It [​](#how-to-use-it)

1.  Drag the Create Box Shadow Design Token node into your graph.
2.  Connect a string to the "Name" input to identify your token.
3.  Either:
    -   Connect an array of box shadow values to the "Value" input, or
    -   Connect a reference string to the "Reference" input if this token references another token.
4.  Optionally add a description and any extension metadata.
5.  The node will output a complete box shadow token object that follows the Tokens Studio format.

### Tips [​](#tips)

-   Box shadow tokens typically include properties like x-offset, y-offset, blur radius, spread radius, and color.
-   You can create multiple shadow layers by providing an array of shadow objects.
-   The "Reference" input allows you to create alias tokens that point to other tokens.
-   Make sure your shadow values follow the expected structure with x, y, blur, spread, and color properties.

### See Also [​](#see-also)

-   **Create Color Design Token**: For creating color tokens.
-   **Create Typography Design Token**: For creating typography tokens.
-   **Create Border Design Token**: For creating border tokens.
-   **Flatten Token Sets**: For managing collections of tokens.

### Use Cases [​](#use-cases)

-   **Elevation System**: Create consistent shadow styles for different elevation levels.
-   **Component States**: Define shadow tokens for different interactive states (hover, active, etc.).
-   **Modal Overlays**: Establish shadow tokens for modal and popup components.
-   **Card Depth**: Create standardized shadow tokens for indicating visual hierarchy through depth.