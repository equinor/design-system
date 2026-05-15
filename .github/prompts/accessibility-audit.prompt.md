---
mode: agent
description: Generate an accessibility audit report against WCAG 2.1 AA
---

# Accessibility Audit

> **Canonical reference:** [`documentation/how-to/ACCESSIBILITY_AUDIT.md`](../../documentation/how-to/ACCESSIBILITY_AUDIT.md) — the 13-section audit checklist, output format, severity rubric, and tips for the agent. Project-wide accessibility expectations live in [`AGENTS.md`](../../AGENTS.md) § Accessibility.

Conduct an accessibility audit of the following URL against WCAG 2.1 AA, following the checklist and output format in the canonical doc above.

🔗 **URL:** ${input:url}

## Steps

1. Open the URL with a browser-automation MCP server (Playwright is wired up in [`.vscode/mcp.json`](../../.vscode/mcp.json)).
2. Work through each of the 13 audit areas in the canonical doc. Drive the page with the browser MCP — do not infer from source code alone.
3. Tag every finding with a severity (Critical / Serious / Moderate / Minor) per the rubric.
4. Save the report as `YYYY-MM-DD_accessibility-report.md` in the repository root using the output format from the canonical doc.
