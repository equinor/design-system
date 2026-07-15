<!-- source: https://documentation.tokens.studio/connect-studio-to-code/ -->

# Connect Studio to Code [​](#connect-studio-to-code)

## **Using the Studio CLI and API** [​](#using-the-studio-cli-and-api)

This documentation provides a detailed guide on how to use the Studio CLI and API for managing design tokens efficiently.

## **Accessing the SDK and CLI Documentation** [​](#accessing-the-sdk-and-cli-documentation)

Tokens Studio publishes documentation for the SDK on our Github. You can refer to the documentation for any questions and tooling you may need. [https://tokens-studio.github.io/studio-app/](https://tokens-studio.github.io/studio-app/)

### **Accessing documentation within Studio** [​](#accessing-documentation-within-studio)

1.  Open the Studio application.
2.  Go to your **organization dashboard**.
3.  Click the **SDK and CLI** button.

![](/images/CleanShot%202025-02-17%20at%2012.35.31.png)

## **Creating an API Key** [​](#creating-an-api-key)

-   **Generate a Key:**
    -   Go to **Personal Settings** in Studio.
        -   Select **API Keys** (below "Edit Profile").
        -   Create a new API key (e.g., "Test Key").
-   **Copy and Store the Key:**
    -   Copy the key string and **store it securely** (e.g., in a password manager or vault).
        -   You won’t be able to view the key again after closing the window.

![](/images/CleanShot%202025-02-17%20at%2012.52.32.png)

## Accessing the API [​](#accessing-the-api)

The API operates on a **GraphQL interface**. You can use tools like **Postman**, **Curl**, or the **Apollo Sandbox** to interact with it.

[Tokens Studio Cli](./tokens-studio-cli)

[Graphql](./graphql)

[Postman](./postman)

## **Best Practices** [​](#best-practices)

1.  **Secure API Key Storage:**
    -   Use a password manager or secure vault.
    -   Avoid storing keys in plain text.
2.  **Automation:**
    -   Use environment variables to prevent manual prompts in CI pipelines.
3.  **Explore API Schema:**
    -   Use Apollo Sandbox for schema introspection before creating complex queries.

This documentation provides an overview of using Studio’s API and CLI effectively. For further assistance, refer to the official [SDK and CLI documentation page](https://tokens-studio.github.io/studio-app/).