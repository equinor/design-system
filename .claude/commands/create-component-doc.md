# Create Component Documentation

Create structured component documentation from the raw content provided.

## Input

$ARGUMENTS

## Task

Take the raw content above (from Figma, design specs, meetings, etc.) and restructure it into properly formatted component documentation for the Equinor Design System.

## Rules

- **Only use content provided in the input** - do not generate or create information that is not already present
- **Do not create sections without content** - only include sections that have relevant information from the input
- **Always include the H1 title** - the component name must be present as a header 1
- **Remove artifacts** - clean up folder names in caps lock, duplicate paragraphs, dates/timestamps, and other noise
- **Follow the tone of voice** - apply the guidelines below to make the content approachable and professional

## Tone of Voice

- **Friendly and welcoming:** Write in an approachable, encouraging style that fosters collaboration and creativity.
- **Clear and concise:** Use short sentences and minimal jargon. Present information in a logical, easy-to-scan structure.
- **Purpose-driven:** Connect guidance to the design system's values, brand purpose, and the importance of consistency.
- **Inspirational:** Use positive phrasing to motivate readers (e.g., "designed with care", "inspire meaningful experiences").
- **Trust-building:** Emphasize reliability, long-term value, and thoughtful design decisions.
- **Inclusive:** Use inclusive language (e.g., "we" and "our") to build a sense of community.

## Output Structure

Use this template. Only include sections that have content from the input:

```markdown
---
title: [Component Name]
sidebar_position: [number if provided, otherwise omit]
---
# [Component Name]

[Brief explanation of what the component is and why it matters - rewrite from input in an approachable style]

## When to Use

[Describe appropriate use cases for this component]

## Structure

[Explain the component's anatomy, parts, or composition if applicable]

## Guidelines

[Provide guidance on how to use the component effectively]

## Accessibility

[Document accessibility considerations and requirements]

## Figma

[Information about the Figma implementation]

### Do's and don'ts

:::info **Do**

- [Best practices from input]
:::

:::danger **Don't**

- [Anti-patterns or things to avoid from input]
:::
```

## Success Criteria

- The documentation is clear, warm, and professional
- The content is restructured to match the template above
- The tone reflects friendliness, trust, and inspiration
- No content is fabricated - only restructured from the input
- Duplicate content and artifacts are removed
