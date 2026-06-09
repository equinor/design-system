# Create Component Documentation

Restructure the raw content in **$ARGUMENTS** into a properly formatted component doc for the Equinor Design System.

> **Canonical reference:** [`documentation/agent-instructions/COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md) — tone of voice, formatting conventions (British English, no em-dashes, admonitions), section order, output template, Storybook iframes workflow, sidebar registration, and the verification checklist. Project-wide conventions live in [`AGENTS.md`](../../AGENTS.md).

@../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md

## Input

$ARGUMENTS

## Audience reminder

These docs are the **usage guide** for the EDS component library. The audience is **anyone deciding whether and how to use a component** - designers, developers picking between components, product folks scoping a feature, accessibility reviewers, contributors new to EDS. They are not a designer-only reference, and they are not a Figma manual. Storybook owns implementation (props, code, callbacks, integration). Read the [Audience](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#audience) section of `COMPONENT_DOC_STYLE.md` before drafting anything.

## Workflow

1. **Identify the component name and category from the raw input.** The input may include Figma specs, meeting notes, scraped text, or pointers to source code. Treat source code (`*.tsx`, `*.types.ts`, `*.stories.tsx`) as a **fact-check source** for variant names, state names, and accessibility behaviour - not as content to paraphrase. The prose in the doc comes from Figma and design intent.

2. **Decide the target path.** Component docs live at `apps/design-system-docs/docs/components/{category}/{component}.md` — e.g. `apps/design-system-docs/docs/components/inputs/button.md`.

3. **Restructure into the template** per [`COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#output-template). Only include sections that have content from the input. Do not fabricate or invent content.

4. **Embed Storybook iframes** for the default story and per variant axis (variants, tones, icons). Measure each iframe's height per [`COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#measuring-iframe-height) using a browser MCP (Chrome DevTools is wired up for most setups).

5. **Register in the sidebar.** Update `apps/design-system-docs/sidebars.ts` per [`COMPONENT_DOC_STYLE.md`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#sidebar-registration).

6. **Self-review pass before saving.** Re-read your draft against [`What NOT to Include`](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#what-not-to-include) and remove every red flag you find. Then sanity-check against the [Reference Exemplars](../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#reference-exemplars).

## Rules

- Use only content provided in the input — do not generate or invent information
- Do not create sections without content — skip them rather than filling with filler
- Always include the H1 title
- Remove artefacts: caps-locked folder names, duplicate paragraphs, dates/timestamps, scrape noise
- Follow the tone of voice and formatting (British English, no em-dashes, admonitions) per the canonical doc
- Each Guidelines paragraph answers _when_ and _why_; the iframe answers _how_
- Do's and Don'ts are usage guidance only - never API rules, handler overrides, or framework-integration warnings
