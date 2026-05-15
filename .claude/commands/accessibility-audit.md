# Accessibility Audit

Conduct an accessibility audit of the URL provided in **$ARGUMENTS** against WCAG 2.1 AA.

> **Canonical reference:** [`documentation/how-to/ACCESSIBILITY_AUDIT.md`](../../documentation/how-to/ACCESSIBILITY_AUDIT.md) — the 13-section audit checklist, output format, severity rubric, and tips for the agent. Project-wide accessibility expectations live in [`AGENTS.md`](../../AGENTS.md) § Accessibility.

## Steps

1. Open the URL with a browser-automation MCP server (Playwright or Chrome DevTools). MCP servers are configured in personal Claude Code settings.
2. Work through each of the 13 audit areas in the canonical doc. Drive the page with the browser MCP — do not infer from source code alone.
3. Tag every finding with a severity (Critical / Serious / Moderate / Minor) per the rubric.
4. Save the report as `YYYY-MM-DD_accessibility-report.md` in the repository root using the output format from the canonical doc.

If `$ARGUMENTS` is empty, ask the user for the URL before proceeding. For EDS components, the natural target is a Storybook story URL (`pnpm run storybook` to start the server locally).
