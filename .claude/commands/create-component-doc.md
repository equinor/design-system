# Create Component Documentation

Create structured component documentation from the raw content provided.

## Input

$ARGUMENTS

## Task

Take the raw content above (from Figma, design specs, meetings, etc.) and restructure it into properly formatted component documentation for the Equinor Design System.

## File Location

Component docs: `apps/design-system-docs/docs/components/{category}/{component}.md`

Example: `apps/design-system-docs/docs/components/inputs/button.md`

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

## Formatting Conventions

### Tables

- Use consistent column widths with dashes
- Left-align all columns
- Include header separator row

### Lists

- Use `-` for unordered lists
- Use `1.` for ordered/numbered steps
- Bold key terms: `**Term**: Description`

### Em Dashes

Use em dashes (—) not hyphens for alternatives:
- "Navigating between pages—use Link instead"

### Admonitions

- `:::info` for Do's (positive guidance)
- `:::danger` for Don'ts (things to avoid)
- Close with `:::`

## Storybook Iframes

### Story ID Pattern

`eds-2-0-beta-{category}-{component}--{story-name}`

Example: `eds-2-0-beta-inputs-button--default`

### Iframe Template

```html
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id={STORY_ID}"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/{STORY_ID})
```

### Height Guidance

- Measure content height using Chrome MCP
- **Formula:** `iframe height = content height + ~32px` (for padding/centering)
- **Link format:** Use `/story/` path (not `/docs/`) to link directly to the specific story

### Chrome MCP Workflow for Iframes

1. **Navigate to Storybook docs page:**
   ```
   mcp__chrome-devtools__navigate_page → https://storybook.eds.equinor.com/?path=/docs/eds-2-0-beta-{category}-{component}--docs
   ```

2. **Find available stories:**
   ```
   mcp__chrome-devtools__take_snapshot → See sidebar with all story links
   ```
   Extract story IDs from link URLs (e.g., `?path=/story/{story-id}`)

3. **Navigate to story iframe:**
   ```
   mcp__chrome-devtools__navigate_page → https://storybook.eds.equinor.com/iframe.html?globals=&args=&id={STORY_ID}
   ```

4. **Measure content height:**
   ```javascript
   // Use mcp__chrome-devtools__evaluate_script
   () => {
     const storyRoot = document.getElementById('storybook-root');
     return { storyRootHeight: storyRoot ? storyRoot.scrollHeight : null };
   }
   ```

5. **Calculate iframe height:** Add ~32px padding to content height

## Section Order

1. Frontmatter
2. Title + Introduction
3. Hero iframe
4. When to Use
5. Structure
6. Guidelines (with iframes inline)
7. Accessibility
8. Figma
9. Do's and Don'ts

## Output Structure

Use this template. Only include sections that have content from the input:

```markdown
---
title: [Component Name]
sidebar_position: [number if provided, otherwise omit]
---

# [Component Name]

[Brief explanation of what the component is and why it matters - rewrite from input in an approachable style]

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-{category}-{component}--default"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-{category}-{component}--default)

## When to Use

[Describe appropriate use cases for this component]

**Avoid [component] for:**

- Alternative 1—use X instead
- Alternative 2—use Y instead

## Structure

[Explain the component's anatomy, parts, or composition if applicable]

All [component] variants support:

- **Feature 1** (description)
- **Feature 2** (description)

## Guidelines

### Variants

[Descriptive text explaining variants]

| Variant   | Emphasis | Use Case           |
| --------- | -------- | ------------------ |
| Primary   | High     | Main actions       |
| Secondary | Medium   | Supporting actions |

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-{category}-{component}--all-variants"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-{category}-{component}--all-variants)

### Tones

[Descriptive text about tones/colors]

- **Tone1**: Description
- **Tone2**: Description

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-{category}-{component}--tones"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-{category}-{component}--tones)

### Icons

[Icon usage guidelines if applicable]

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-{category}-{component}--icon-only-variants"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-{category}-{component}--icon-only-variants)

## Accessibility

[Document accessibility considerations and requirements]

**Standard [Component]**

- **Keyboard**: Tab focus, Enter/Space activation
- **Disabled state**: Guidelines

**Icon-Only Variant** (if applicable)

- Accessible name requirements

## Figma

[Information about the Figma implementation]

### Components

- **ComponentName [EDS]**: Description

### Using the Component in Figma

1. Step-by-step instructions
2. Where to find it

## Do's and Don'ts

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
- Storybook iframes are included with correct heights (use Chrome MCP to measure)
- "View in Storybook" links use `/story/` path format
