<!-- source: https://documentation-v2.tokens.studio/tokenscript/schemas-and-dependencies.html -->

# Schemas and Dependencies [​](#schemas-and-dependencies)

## Schema Structure [​](#schema-structure)

A Magic Generator schema defines:

-   **Name** — The schema identifier
-   **Description** — What the schema does
-   **Inputs** — Parameters the generator accepts (types, defaults, constraints)
-   **Outputs** — Token definitions with JavaScript expressions for computing values
-   **Dependencies** — Other schemas this schema depends on

![Schema marketplace displaying available schemas](/images/figma/schema-marketplace-light.png)![Schema marketplace displaying available schemas](/images/figma/schema-marketplace-dark.png)

## The Schema Registry [​](#the-schema-registry)

Studio includes a registry of community schemas for common design system patterns. You can:

-   **Browse** available schemas at **Magic Generators → Registry**
-   **Enable** schemas for use in your project
-   **View** schema source code and documentation
-   **Check health** of registry services

## Dependency Management [​](#dependency-management)

When schemas depend on each other, Studio handles resolution:

### Resolving Dependencies [​](#resolving-dependencies)

1.  Go to **Magic Generators → Schemas**
2.  Click **Resolve Dependencies**
3.  Studio analyzes the dependency graph and ensures all required schemas are available
4.  Missing dependencies are flagged

### Dependency Order [​](#dependency-order)

Generators are executed in dependency order. If Generator B depends on tokens from Generator A, A runs first.

Studio automatically detects circular dependencies and prevents them.

## Next Steps [​](#next-steps)

-   [What are Magic Generators?](./what-is-tokenscript.html)
-   [Creating generators](./creating-generators.html)