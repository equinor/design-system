<!-- source: https://documentation-v2.tokens.studio/tokens/understanding-tokens.html -->

# Understanding Tokens [​](#understanding-tokens)

Design tokens are the foundational values of your design system — colors, spacing, typography, shadows, and more. They represent design decisions in a platform-agnostic format that can be consumed by any tool or technology.

## What Is a Design Token? [​](#what-is-a-design-token)

A design token is a named value with a type. For example:

json

```
{
  "blue-500": {
    "$type": "color",
    "$value": "#3B82F6",
    "$description": "Primary blue"
  }
}
```

Studio follows the [W3C Design Tokens Community Group (DTCG)](https://www.designtokens.org/) specification, which means your tokens are interoperable with any tool that supports the standard.

## Token Anatomy [​](#token-anatomy)

Every token in Studio has:

| Property | Description |
| --- | --- |
| **Name** | The token's identifier, used to reference it (e.g., `blue.500`) |
| **Type** | What kind of value it holds (color, dimension, number, etc.) |
| **Value** | The actual value, which can be a literal or a reference to another token |
| **Description** | Optional human-readable description |
| **Extensions** | Optional metadata (Figma mapping, deprecation status, etc.) |

## References [​](#references)

Tokens can reference other tokens using curly brace syntax:

```
{primitives.colors.blue.500}
```

This creates a dependency chain. When the referenced token changes, all tokens that reference it update automatically. This is how you build semantic layers:

-   **Primitives** — Raw values (`blue.500 = #3B82F6`)
-   **Semantic** — Contextual meanings (`primary = {blue.500}`)
-   **Component** — Component-specific (`button.background = {primary}`)

## Token Resolution [​](#token-resolution)

When Studio resolves tokens, it follows all references to produce the final computed value. For example:

```
button.background → {primary} → {blue.500} → #3B82F6
```

The resolved value is what gets exported to your codebase and synced to Figma.

## Event Sourcing [​](#event-sourcing)

Tokens in Studio are event-sourced. This means every change — creation, update, deletion — is recorded as an immutable event. The current state of a token is computed by replaying these events.

This gives you:

-   **Complete history** — See exactly what changed, when, and by whom
-   **Branch isolation** — Changes on a branch don't affect other branches until merged
-   **Conflict detection** — Studio can detect when two branches modify the same token

## DTCG Extensions [​](#dtcg-extensions)

Studio supports the DTCG `$extensions` property for storing tool-specific metadata:

json

```
{
  "blue-500": {
    "$type": "color",
    "$value": "#3B82F6",
    "$extensions": {
      "studio.tokens": {
        "figma": { "variableId": "VariableID:123:456" }
      }
    }
  }
}
```

## Deprecation [​](#deprecation)

You can mark tokens as deprecated to signal that they should no longer be used:

json

```
{
  "old-blue": {
    "$type": "color",
    "$value": "#2563EB",
    "$deprecated": {
      "severity": "warning",
      "message": "Use blue-500 instead"
    }
  }
}
```

Deprecated tokens are still functional but will show a warning in the UI.

## Next Steps [​](#next-steps)

-   [Creating tokens](./creating-tokens.html)
-   [Token types reference](./token-types.html)
-   [Organizing tokens into sets](./token-sets.html)