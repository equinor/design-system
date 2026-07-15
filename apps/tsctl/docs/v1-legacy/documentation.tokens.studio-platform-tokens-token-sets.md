<!-- source: https://documentation.tokens.studio/platform/tokens/token-sets -->

[Platform](/platform)›[Tokens](/platform/tokens)

# Token Sets [​](#token-sets)

## Static and Graph-Based Sets [​](#static-and-graph-based-sets)

Studio supports two distinct types of token sets. Understanding the differences between **Static Sets** and **Graph-Based Sets** is key to optimizing your token management workflow.

### Static Sets [​](#static-sets)

Static sets are the traditional token sets you are familiar with. They have the following characteristics:

-   **Editable in Table View:** Static sets are displayed in a table editor, where each token is represented in a JSON format behind the scenes.
-   **Manual Token Management:** You directly edit token values and metadata—ideal for straightforward token collections that do not require dynamic logic.
-   **Predictable Structure:** Since the values are manually set, static sets offer consistency without additional computation.

![](/images/Static%20Sets.png)

> **Tip:** Use static sets for standard tokens that do not need dynamic calculations.

### Graph-Based Sets [​](#graph-based-sets)

Graph-based sets leverage our powerful graph engine to build logic-driven token structures:

-   **Logic-Based Calculations:** Instead of directly editing tokens, you define a logical decision tree using nodes. These nodes perform dynamic calculations (for example, building color or type scales) that generate a static output token set.
-   **Dynamic Output:** The result is a dynamically generated token set, which you can view in both the graph view and the table view.
-   **Foundational Usage Only:** Graph-based sets should only be used on the foundational layer. They are designed to drive core logic, and you should avoid referencing a graph-based set on top of another logic-driven set. This limitation is due to current constraints in consuming platforms (such as Figma or CSS) regarding the translation of complex logics.

![](/images/Graph%20Based%20Set.png)

> **Note:** For advanced dynamic calculations like semantic scaling or automated color adjustments, graph-based sets offer powerful capabilities. However, keep them simple to ensure compatibility when the tokens are consumed in different platforms.

### Switching Between Views [​](#switching-between-views)

In graph-based sets, you have the flexibility to switch between:

-   **Graph View:** Where you build and modify the logical structure of your token set.
-   **Table View:** Where you can inspect the final output of your dynamic calculations in a familiar tabular format.

![](/images/Switch%20between%20Graph%20and%20Static%20set.gif)

### Best Practices [​](#best-practices)

-   **Use Static Sets** when your tokens require minimal or no dynamic logic.
-   **Employ Graph-Based Sets** for foundational layers where dynamic calculations (such as generating color or type scales) are necessary.
-   **Avoid Nesting Graph-Based Sets:** Do not reference one graph-based set inside another, as this can complicate logic translation to consuming platforms.