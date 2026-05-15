# Create Component Documentation

Restructure the raw content in **$ARGUMENTS** into a properly formatted component doc for the Equinor Design System.

> **Canonical reference:** [`documentation/how-to/COMPONENT_DOC_STYLE.md`](../../documentation/how-to/COMPONENT_DOC_STYLE.md) — tone of voice, formatting conventions (British English, no em-dashes, admonitions), section order, output template, Storybook iframes workflow, sidebar registration, and the verification checklist. Project-wide conventions live in [`AGENTS.md`](../../AGENTS.md).

## Input

$ARGUMENTS

## Workflow

1. **Take the raw content above** (from Figma, design specs, meetings, scraped text, etc.) and identify the component name and category.

2. **Decide the target path.** Component docs live at `apps/design-system-docs/docs/components/{category}/{component}.md` — e.g. `apps/design-system-docs/docs/components/inputs/button.md`.

3. **Restructure into the template** per [`COMPONENT_DOC_STYLE.md`](../../documentation/how-to/COMPONENT_DOC_STYLE.md#output-template). Only include sections that have content from the input. Do not fabricate or invent content.

4. **Embed Storybook iframes** for the default story and per variant axis (variants, tones, icons). Measure each iframe's height per [`COMPONENT_DOC_STYLE.md`](../../documentation/how-to/COMPONENT_DOC_STYLE.md#measuring-iframe-height) using a browser MCP (Chrome DevTools is wired up for most setups).

5. **Register in the sidebar.** Update `apps/design-system-docs/sidebars.ts` per [`COMPONENT_DOC_STYLE.md`](../../documentation/how-to/COMPONENT_DOC_STYLE.md#sidebar-registration).

## Rules

- Use only content provided in the input — do not generate or invent information
- Do not create sections without content — skip them rather than filling with filler
- Always include the H1 title
- Remove artefacts: caps-locked folder names, duplicate paragraphs, dates/timestamps, scrape noise
- Follow the tone of voice and formatting (British English, no em-dashes, admonitions) per the canonical doc
