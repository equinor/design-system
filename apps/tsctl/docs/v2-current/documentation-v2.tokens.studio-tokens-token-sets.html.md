<!-- source: https://documentation-v2.tokens.studio/tokens/token-sets.html -->

# Token Sets [​](#token-sets)

Token sets are collections of related tokens. They help you organize your design system into logical groups.

## What Is a Token Set? [​](#what-is-a-token-set)

A token set is a named container for tokens. Think of it like a folder in a file system — it groups tokens that belong together.

Common token set structures include:

-   **By category:** `colors`, `spacing`, `typography`, `shadows`
-   **By layer:** `primitives`, `semantic`, `component`
-   **By component:** `button`, `card`, `input`
-   **By brand:** `brand-a`, `brand-b`

## Token Set Types [​](#token-set-types)

Studio supports two types of token sets:

### Static Sets [​](#static-sets)

Static token sets are created and managed by you. You add, edit, and delete tokens in these sets manually (or via import).

### Generated Sets [​](#generated-sets)

Generated token sets are created and maintained by [Magic Generators](./../tokenscript/creating-generators.html). When you link a generator to a token set, the generator produces tokens automatically based on rules you define.

Generated sets are marked with a ⚡ icon in the UI.

## Creating a Token Set [​](#creating-a-token-set)

1.  Go to the **Tokens** tab in your project
    
2.  Click **New Token Set** (the **+** button next to **Token Sets** in the sidebar)
    
    ![Token set selected](/images/tokens/token-set-selected-light.png)![Token set selected](/images/tokens/token-set-selected-dark.png)
    
3.  Enter a name (use slashes for nesting, e.g., `primitives/colors`)
    
4.  Click **Create**
    

## Organizing Token Sets [​](#organizing-token-sets)

You can organize token sets hierarchically using slash-separated names:

-   primitives
    -   colors
    -   spacing
    -   typography
-   semantic
    -   colors
    -   spacing
-   component
    -   button
    -   card

This creates a tree structure in the sidebar that makes large systems easier to navigate.

## Token Sets and Themes [​](#token-sets-and-themes)

Token sets play a key role in theming. When you define theme options, you specify how tokens in certain sets should change per theme. See [Theme Groups and Options](./../theming/theme-groups-and-options.html) for details.

## Token Sets and Branches [​](#token-sets-and-branches)

Token sets are branch-aware. When you create a new token set on a branch, it only exists on that branch until you merge. Similarly, deleting a token set on a branch doesn't affect the main branch.

## Linking Generators [​](#linking-generators)

To link a Magic Generator to a token set:

1.  Open the token set
2.  Click **Link Generator**
3.  Select the generator from your project's registry
4.  Configure the generator parameters
5.  The generator will populate the token set with computed tokens

See [Magic Generators](./../tokenscript/what-is-tokenscript.html) for more on generators.

## Next Steps [​](#next-steps)

-   [Creating tokens](./creating-tokens.html)
-   [Importing tokens](./importing-tokens.html)
-   [Theme groups and options](./../theming/theme-groups-and-options.html)