<!-- source: https://documentation.tokens.studio/platform/tokens/token-flow -->

[Platform](/platform)›[Tokens](/platform/tokens)

# Token flow [​](#token-flow)

### Overview [​](#overview)

Token Flow allows you to track references, dependencies, and how tokens are connected across different sets and themes. This feature helps in managing design tokens efficiently and ensuring consistency across your design system.

## Benefits of Token Flow [​](#benefits-of-token-flow)

-   **Improved visibility**: Easily see how tokens are structured and related.
-   **Efficient debugging**: Quickly identify and resolve issues with token dependencies.
-   **Seamless theming**: Understand how token values change dynamically across different themes.

## Accessing Token Flow [​](#accessing-token-flow)

### Step 1: **Navigate to the Tokens Module** [​](#step-1-navigate-to-the-tokens-module)

![](/images/CleanShot%202025-02-28%20at%2019.53.05@2x.png)

Open **Tokens Studio** and go to the **Tokens** module from the left-hand panel. Here, you will see a list of [Token Sets](./token-sets).

### Step 2: **Select a Token Set** [​](#step-2-select-a-token-set)

![](/images/CleanShot%202025-02-28%20at%2019.54.37@2x.png)

Click on any **Token Set** to view all the tokens it contains.

### Step 3: **View Token Flow** [​](#step-3-view-token-flow)

Select a token by clicking the checkbox next to it. At the bottom of the screen, the option to open **Token Flow** will appear. Click to open the Token Flow visualization panel and see the references and connections.

## Understanding Token Relationships [​](#understanding-token-relationships)

![](/images/CleanShot%202025-02-28%20at%2019.55.58.gif)

_Opening Token Flow to understand token relationships._

Using Token Flow you can:

-   **View token references**: See where the token is being referenced across different sets. This is helpful to understand the inheritance model and complexity of references
-   **Check dependency paths**: Identify which other tokens rely on the selected token.
-   **Explore theme-based variations**: Understand how token values change across different themes. For example, the value of a token may be dependent on

### Example Use Case [​](#example-use-case)

1.  Select a token, such as a color token.
2.  In **Token Flow**, observe:
    -   Which other tokens reference it.
    -   Whether it pulls values from another token (e.g., from a dark or light theme).
    -   How changing the theme affects the resolved token value.
3.  If you switch the theme from **Light** to **Dark**, you will see:
    -   The reference update from the light token set to the dark token set.
    -   The resolved token value changing accordingly.

## Navigating Between Token Sets [​](#navigating-between-token-sets)

-   You can click on any referenced token within Token Flow to jump directly to its token set.
-   This makes it easier to track how tokens interact across different sets.

![](/images/CleanShot%202025-02-28%20at%2020.00.19.gif)