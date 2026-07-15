<!-- source: https://documentation-v2.tokens.studio/tokenscript/what-is-tokenscript.html -->

# What Are Magic Generators? [​](#what-are-magic-generators)

Magic Generators are Studio's system for generating tokens programmatically. Instead of manually creating every token, you write rules that produce tokens automatically based on inputs and logic.

## Why Magic Generators? [​](#why-magic-generators)

Design systems often have tokens that follow mathematical or logical patterns:

-   A spacing scale that doubles each step (4, 8, 16, 32, 64)
-   Color shades generated from a base hue
-   Typography scales based on a modular ratio
-   Responsive breakpoints derived from a base size

Magic Generators let you define these patterns once, and Studio generates the tokens for you. When the inputs change, the outputs update automatically.

## How It Works [​](#how-it-works)

Magic Generators have two key building blocks:

![Schema marketplace showing available generator schemas](/images/figma/schema-marketplace-light.png)![Schema marketplace showing available generator schemas](/images/figma/schema-marketplace-dark.png)

### Schemas [​](#schemas)

Schemas define the shape of a generator — what inputs it accepts and what outputs it produces. Think of a schema as a template or recipe.

Schemas can come from:

-   **The registry** — Pre-built schemas for common patterns (e.g., color scale, spacing scale)
-   **Your project** — Custom schemas you create for your specific needs

### Generators [​](#generators)

Generators are instances of a schema. They take specific input values and produce tokens based on the schema's logic.

For example:

-   **Schema:** "Color Scale Generator" (takes a base color and produces 10 shades)
-   **Generator instance:** Base color = `#3B82F6` → produces `blue.50`, `blue.100`, … `blue.900`

## The Resolver [​](#the-resolver)

Magic Generator rules are executed by a resolver service. The resolver:

1.  Takes the generator inputs
2.  Executes the JavaScript expressions defined in the schema
3.  Produces the output tokens
4.  Links them to a generated token set

## Generated Token Sets [​](#generated-token-sets)

Tokens produced by a generator live in a **generated token set** (marked with ⚡). These sets are managed by the generator — you don't edit their tokens directly. Instead, you change the generator inputs and the outputs regenerate.

## Next Steps [​](#next-steps)

-   [Creating generators](./creating-generators.html)
-   [Schemas and dependencies](./schemas-and-dependencies.html)