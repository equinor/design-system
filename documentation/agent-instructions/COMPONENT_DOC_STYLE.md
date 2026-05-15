# Component Documentation Style Guide

This is the canonical reference for writing and reviewing EDS component documentation. Harness entry points — `/create-component-doc` in Claude Code, the `structure_components_prompt` / `verify_components_prompt` in Copilot, the `component-doc` agent in OpenCode — all read this guide rather than restating its content.

Component docs live in `apps/design-system-docs/docs/components/{category}/{component}.md`. For example, the Button doc is `apps/design-system-docs/docs/components/inputs/button.md`.

## Table of Contents

- [Tone of Voice](#tone-of-voice)
- [Formatting Conventions](#formatting-conventions)
- [Section Order](#section-order)
- [Output Template](#output-template)
- [Storybook Iframes](#storybook-iframes)
- [Sidebar Registration](#sidebar-registration)
- [Verification Checklist](#verification-checklist)

## Tone of Voice

- **Friendly and welcoming** — approachable, encouraging, fosters collaboration
- **Clear and concise** — short sentences, minimal jargon, logical scannable structure
- **Purpose-driven** — connect guidance to the design system's values and the importance of consistency
- **Inspirational** — positive phrasing that motivates (e.g. "designed with care", "inspire meaningful experiences")
- **Trust-building** — emphasise reliability, long-term value, thoughtful design decisions
- **Inclusive** — "we" and "our" to build community

Do not fabricate content. Restructure and clean up the input — do not invent features, guidelines, or examples.

## Formatting Conventions

### Language

Use **British English** throughout: "colour" not "color", "behaviour" not "behavior", "summarise" not "summarize", "centre" not "center".

### Dashes

Use standard hyphens (`-`) or en-dashes (`–`) for separating clauses. **Never use em-dashes (`—`)**.

```
✅ "Navigating between pages - use Link instead"
✅ "Navigating between pages – use Link instead"
❌ "Navigating between pages — use Link instead"
```

### Lists and tables

- Use `-` for unordered lists, not `*`
- Use `1.` for ordered/numbered steps
- Bold key terms with the `**Term**: Description` pattern
- Tables: consistent column widths with dashes, left-aligned, with a header separator row

### Admonitions

Component docs render via Docusaurus, which supports the `:::type` admonition syntax.

```markdown
:::info **Do**

- Good practice from input

:::

:::danger **Don't**

- Anti-pattern or thing to avoid

:::
```

Use `:::info` for Do's (positive guidance) and `:::danger` for Don'ts (things to avoid). Close every admonition with `:::`.

## Section Order

Every component doc follows this order. Skip sections that have no content from the input — never invent content to fill a section.

1. Frontmatter
2. Title + introduction
3. Hero iframe (default story)
4. When to Use
5. Structure
6. Guidelines (with inline iframes per variant axis)
7. Accessibility
8. Figma
9. Do's and Don'ts

## Output Template

Use this skeleton. Only include sections that have content from the input.

```markdown
---
title: [Component Name]
sidebar_position: [number if provided, otherwise omit]
---

# [Component Name]

[Brief explanation of what the component is and why it matters — rewrite from input in an approachable style.]

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-{category}-{component}--default"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-{category}-{component}--default)

## When to Use

[Describe appropriate use cases for this component.]

**Avoid [component] for:**

- Alternative 1 - use X instead
- Alternative 2 - use Y instead

## Structure

[Explain the component's anatomy, parts, or composition if applicable.]

All [component] variants support:

- **Feature 1** (description)
- **Feature 2** (description)

## Guidelines

### Variants

[Descriptive text explaining variants.]

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

[Descriptive text about tones/colours.]

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

[Icon usage guidelines if applicable.]

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-{category}-{component}--icon-only-variants"
  width="100%"
  height="{HEIGHT}"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-{category}-{component}--icon-only-variants)

## Accessibility

[Document accessibility considerations and requirements.]

**Standard [Component]**

- **Keyboard**: Tab focus, Enter/Space activation
- **Disabled state**: Guidelines

**Icon-Only Variant** (if applicable)

- Accessible name requirements

## Figma

[Information about the Figma implementation.]

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

## Storybook Iframes

### Story ID pattern

```
eds-2-0-beta-{category}-{component}--{story-name}
```

Example: `eds-2-0-beta-inputs-button--default`.

### Iframe template

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

Link format: use the `/story/` path (not `/docs/`) so the link goes directly to the specific story.

### Measuring iframe height

The iframe needs a fixed pixel `height`. Use a browser-automation MCP server (Chrome DevTools or Playwright — wired up in [`.vscode/mcp.json`](../../.vscode/mcp.json) or configured in personal harness settings) to navigate to each story's iframe URL and measure the rendered content height.

1. Navigate to the Storybook docs page for the component:
   `https://storybook.eds.equinor.com/?path=/docs/eds-2-0-beta-{category}-{component}--docs`
2. Take a page snapshot to list available stories. Extract story IDs from the sidebar links (look for `?path=/story/{story-id}`).
3. For each story you want to embed, navigate to the bare iframe URL:
   `https://storybook.eds.equinor.com/iframe.html?globals=&args=&id={STORY_ID}`
4. Evaluate a small script that returns `document.getElementById('storybook-root').scrollHeight`.
5. Add roughly 32 px for padding/centring — that's the iframe `height`.

## Sidebar Registration

After writing the doc, update `apps/design-system-docs/sidebars.ts` so the component shows up in the Docusaurus navigation:

- The sidebar is manually configured in `componentsSidebar`.
- Add the component doc ID (e.g. `'components/navigation/link'`) to the appropriate category's `items` array.
- If the category doesn't exist, create a new category entry following the existing pattern.

## Verification Checklist

When reviewing an existing component doc, walk through these criteria. List findings as bullets — do not output tables.

1. **Clarity and understandability**
   - Is the component description clear and easy to understand?
   - Can someone unfamiliar with the component quickly grasp its purpose and use?

2. **Completeness**
   - Are the key sections present? (Title + intro, When to Use, Structure, Guidelines, Accessibility, Figma, Do's and Don'ts, hero iframe.)
   - Does each section contain useful information? Note what is missing.

3. **Tone of voice**
   - Is the tone friendly, approachable, and professional?
   - Does it reflect the brand values: inspiring, inclusive, practical, supportive?

4. **Consistency**
   - Is the structure consistent with other components?
   - Are terms and formatting applied consistently (headings, lists, admonitions, British English)?
   - Are em-dashes avoided?

5. **Redundancy or noise**
   - Are there duplicated or unnecessary paragraphs?
   - Is there leftover scrape artefact (notes, system labels, caps-locked folder names, dates/timestamps)?

6. **Practical usability**
   - Would a designer or developer be able to use this documentation to work with the component in Figma and code?
   - Is there enough detail to take action?

### Output format

When verifying, return:

- **Overall verdict:** Pass / Needs revision / Fail
- **What works well:** [bullet list]
- **What is missing:** [bullet list]
- **What does not work:** [bullet list]
- **Suggestions for improvement:** [bullet list]
