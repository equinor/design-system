---
mode: agent
description: Restructure raw content into a component documentation file
---

# Structure Component Documentation

Take the raw content provided in context and restructure it into a properly formatted component documentation file for the Equinor Design System.

> **Canonical reference:** [`documentation/agent-instructions/COMPONENT_DOC_STYLE.md`](../../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md) — tone of voice, formatting conventions (British English, no em-dashes, admonitions), section order, output template, Storybook iframes workflow, sidebar registration. Project-wide conventions live in [`AGENTS.md`](../../../AGENTS.md).

## Workflow

1. Identify the component name and category from the input.
2. Choose the target path: `apps/design-system-docs/docs/components/{category}/{component}.md`.
3. Restructure into the template at [`COMPONENT_DOC_STYLE.md`](../../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#output-template). Only include sections that have content from the input.
4. Embed Storybook iframes for the default story and per variant axis. Measure each iframe's height per [`COMPONENT_DOC_STYLE.md`](../../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#measuring-iframe-height).
5. Register the new doc in `apps/design-system-docs/sidebars.ts` per [`COMPONENT_DOC_STYLE.md`](../../../documentation/agent-instructions/COMPONENT_DOC_STYLE.md#sidebar-registration).

## Rules

- Use only content provided in the input — do not invent information
- Skip sections without content rather than filling with filler
- Always include the H1 title
- Remove artefacts: caps-locked folder names, duplicate paragraphs, dates/timestamps, scrape noise
- Follow the canonical tone of voice and formatting (British English, no em-dashes, admonitions)
