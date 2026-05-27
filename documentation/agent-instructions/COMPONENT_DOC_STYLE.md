# Component Documentation Style Guide

This is the canonical reference for writing and reviewing EDS component documentation. Harness entry points — `/create-component-doc` in Claude Code, the `structure_components_prompt` / `verify_components_prompt` in Copilot, the `component-doc` agent in OpenCode — all read this guide rather than restating its content.

Component docs live in `apps/design-system-docs/docs/components/{category}/{component}.md`. For example, the Button doc is `apps/design-system-docs/docs/components/inputs/button.md`.

## Table of Contents

- [Audience](#audience)
- [Tone of Voice](#tone-of-voice)
- [Formatting Conventions](#formatting-conventions)
- [What NOT to Include](#what-not-to-include)
- [Section Order](#section-order)
- [Output Template](#output-template)
- [Storybook Iframes](#storybook-iframes)
- [Sidebar Registration](#sidebar-registration)
- [Reference Exemplars](#reference-exemplars)
- [Verification Checklist](#verification-checklist)

## Audience

These docs are the **usage guide** for the EDS component library. The audience is **anyone deciding whether and how to use a component** - designers building screens, developers picking between components, product folks scoping a feature, accessibility reviewers, contributors new to EDS.

This is not a designer-only reference, and it is not a Figma manual. It is the place a reader lands when they need to answer questions like: *Is this the right component for my problem? What is it for? When should I reach for a sibling instead? What does it look like in the Figma library? What should I avoid when I use it?*

Scope contract:

- **Storybook = implementation reference.** Owns props with literal values, code snippets, callback signatures, integration patterns (react-hook-form, debounce, controlled vs uncontrolled wiring), and the precise list of ARIA roles and attributes.
- **Docusaurus component doc (this guide) = usage reference.** Owns *when* a component is the right choice, *why*, what to avoid, the component's anatomy, and what it looks like in the Figma library.

Concretely, when writing prose:

- Each Guidelines paragraph answers **when** to use the pattern and **why**. The iframe + "View in Storybook" link below answers **how**.
- Prose comes from design intent, product context, and Figma - not from `*.types.ts` or `*.stories.tsx`. Use source code as a *fact-check source* for variant names, state names, and accessibility behaviour - not as content to paraphrase.

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

- Provide a clear, visible label so users know what they are selecting

:::

:::danger **Don't**

- Hide or omit the label - placeholder text is not a substitute

:::
```

Use `:::info` for Do's (positive UX guidance) and `:::danger` for Don'ts (things to avoid). Close every admonition with `:::`.

**Do's and Don'ts are usage decisions** made before implementation - label clarity, when to choose this component over a sibling, content pitfalls, accessibility hygiene visible to the user, expected list length, readOnly vs disabled. Do **not** list API rules, handler overrides, framework-integration warnings, or callback-ordering caveats - those belong in Storybook story descriptions.

## What NOT to Include

Before saving the file, re-read your draft and remove anything matching the list below. These are the red flags that mean the prose has drifted into developer-reference territory.

- **A prop name with a literal value** in prose. Examples: `prop={value}`, `prop="..."`, `optionsFilter={() => true}`. The Storybook iframe demonstrates it - the doc does not need to spell it out.
- **A JSDoc-style callback or return description.** Examples: "fires with the selected option", "receives the full option `T` or `undefined`", "returns `true` to include the option". Replace with a user-facing reason to use the pattern.
- **Integration code described in prose.** RHF Controller wiring, debounce snippets, controlled-vs-uncontrolled walkthroughs. One sentence naming the integration is enough; the iframe carries the wiring.
- **Exact ARIA role or attribute names beyond a one-sentence pattern reference.** "Implements the ARIA 1.2 combobox pattern" is fine; enumerating `role="combobox"`, `aria-autocomplete="list"`, `aria-activedescendant`, `role="listbox"` is not.
- **Live-region wording, screen-reader announcement copy, or aria-live mechanics.** Storybook owns this.
- **The same redirect ("use TextField instead", "use Search instead") appearing in both `When to Use` and the `Don't` list.** Pick one - usually `When to Use`, since that is where readers decide.
- **The same guidance appearing in a section body and the Do's / Don'ts list.** If `Disabled and Read Only` already says "prefer read-only over disabled", the Do's list should not repeat it.
- **Headings in sentence case** if siblings in the same category folder use Title Case. Check `apps/design-system-docs/docs/components/{category}/*.md` for the local convention before writing headings.

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

[Each subsection answers *when* to use a pattern and *why*. The iframe + "View in Storybook" link answers *how*. Use Title Case for headings (e.g. "Validation States", "Disabled and Read Only") and match the convention of sibling docs in the same category folder.]

### Variants

[Descriptive text explaining when each variant is appropriate. Do not include prop names with literal values - the iframe carries that.]

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

[One short paragraph naming the WAI-ARIA pattern the component implements (e.g. "implements the ARIA 1.2 combobox pattern") and confirming that labels, descriptions, and helper messages are wired up automatically. Do NOT enumerate role names or ARIA attribute names beyond that one-sentence pattern reference - Storybook owns the exact contract.]

**Keyboard support:**

- **Tab**: Move focus to and from the field
- **Enter / Space**: Activate
- [Other keys relevant to this component, in plain language]

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

## Reference Exemplars

When in doubt about prose style or section weight, imitate these existing docs rather than the raw template:

- [`apps/design-system-docs/docs/components/inputs/autocomplete.md`](../../apps/design-system-docs/docs/components/inputs/autocomplete.md) - Guidelines paragraphs that answer *when* and *why*, a two-sentence Accessibility section, and usage-only Do's and Don'ts. Use this as the primary exemplar for the usage-guide voice.
- [`apps/design-system-docs/docs/components/inputs/search.md`](../../apps/design-system-docs/docs/components/inputs/search.md) - Short Accessibility paragraph in the lighter style.

If your draft is noticeably more prop-heavy or callback-heavy than these, rewrite before saving.

## Verification Checklist

When reviewing an existing component doc, walk through these criteria. List findings as bullets — do not output tables.

1. **Usage-focused** (highest priority)
   - Could someone deciding whether to use this component read it without dropping into the source code or Storybook for each decision?
   - Does each Guidelines paragraph answer *when* and *why*, leaving *how* to the iframe?
   - Are any of the [What NOT to Include](#what-not-to-include) red flags present? Specifically:
     - Prop names with literal values in prose (`prop={value}`, `prop="..."`)
     - JSDoc-style callback/return descriptions ("fires with...", "receives the full...")
     - Integration code (RHF wiring, debounce, etc.) described in prose
     - ARIA role/attribute names enumerated beyond a one-sentence pattern reference
     - Duplicate redirects between `When to Use` and the `Don't` list
     - Same guidance repeated in a section body and the Do's / Don'ts list

2. **Clarity and understandability**
   - Is the component description clear and easy to understand?
   - Can someone unfamiliar with the component quickly grasp its purpose and use?

3. **Completeness**
   - Are the key sections present? (Title + intro, When to Use, Structure, Guidelines, Accessibility, Figma, Do's and Don'ts, hero iframe.)
   - Does each section contain useful information? Note what is missing.

4. **Tone of voice**
   - Is the tone friendly, approachable, and professional?
   - Does it reflect the brand values: inspiring, inclusive, practical, supportive?

5. **Consistency**
   - Is the structure consistent with other components in the same category folder?
   - Headings in Title Case if siblings use Title Case?
   - Are terms and formatting applied consistently (lists, admonitions, British English)?
   - Are em-dashes avoided?

6. **Redundancy or noise**
   - Are there duplicated or unnecessary paragraphs?
   - Is there leftover scrape artefact (notes, system labels, caps-locked folder names, dates/timestamps)?

7. **Practical usability**
   - Would the reader be able to use this documentation to choose the component and work with it in Figma?
   - Is there enough detail to take action without dropping into the source code or Storybook for every decision?

### Output format

When verifying, return:

- **Overall verdict:** Pass / Needs revision / Fail
- **What works well:** [bullet list]
- **What is missing:** [bullet list]
- **What does not work:** [bullet list]
- **Suggestions for improvement:** [bullet list]
