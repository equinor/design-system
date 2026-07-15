<!-- source: https://documentation-v2.tokens.studio/tokenscript/creating-generators.html -->

# Creating Generators [​](#creating-generators)

Generators produce tokens automatically based on schemas and inputs.

## Setting Up a Generator [​](#setting-up-a-generator)

1.  Go to the **Magic Generators** section of your project
2.  Click **New Generator**
3.  Select a schema (from the registry or your project)
4.  Configure the inputs for this generator
5.  Link the generator to a token set (a new generated set will be created)
6.  Click **Create**

![Schema marketplace for selecting generator schemas](/images/figma/schema-marketplace-light.png)![Schema marketplace for selecting generator schemas](/images/figma/schema-marketplace-dark.png)

## Using Registry Schemas [​](#using-registry-schemas)

Studio provides a registry of pre-built schemas for common patterns:

1.  Go to **Magic Generators → Schemas**
2.  Click **Enable from Registry**
3.  Browse available schemas
4.  Select the ones you want to use in your project

## Creating Custom Schemas [​](#creating-custom-schemas)

For custom generation logic:

1.  Go to **Magic Generators → Schemas**
2.  Click **New Schema**
3.  Define the schema:
    -   **Inputs** — What parameters the generator accepts
    -   **Outputs** — What tokens it produces
    -   **Logic** — JavaScript expressions that compute outputs from inputs
4.  Click **Save**

## Linking Generators to Token Sets [​](#linking-generators-to-token-sets)

Each generator is linked to a token set:

1.  Open a token set
2.  Click **Link Generator**
3.  Select the generator
4.  The token set becomes a generated set (⚡)

To unlink:

1.  Open the generated token set
2.  Click **Unlink Generator**
3.  The token set becomes a static set (tokens remain but are no longer auto-generated)

## Dependency Resolution [​](#dependency-resolution)

Generators can depend on each other. Studio resolves dependencies in the correct order:

1.  Generator A produces primitive tokens
2.  Generator B references Generator A's outputs to produce semantic tokens
3.  Studio resolves A first, then B

Use **Resolve Dependencies** to check and fix dependency order.

## Next Steps [​](#next-steps)

-   [What are Magic Generators?](./what-is-tokenscript.html)
-   [Schemas and dependencies](./schemas-and-dependencies.html)