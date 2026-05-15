# Accessibility Audit

This is the canonical accessibility audit playbook. Harness-specific entry points (`/accessibility-audit` in Claude Code, the `accessibility-audit` prompt in Copilot, the `accessibility-audit` agent in OpenCode) all reference this guide rather than restating it.

Audits target a deployed page or local Storybook story. They produce a written report against WCAG 2.1 AA, the level required by EDS (see [`AGENTS.md`](../../AGENTS.md) § Accessibility).

## Prerequisites

- A URL to audit. For EDS components, this is typically a Storybook story (run `pnpm run storybook` and use the story's URL) or the deployed docs site (`https://eds.equinor.com/...`).
- A browser-automation MCP server available to the agent (Playwright or Chrome DevTools). The Playwright server is wired up in [`.vscode/mcp.json`](../../.vscode/mcp.json) for Copilot in VS Code; Claude Code and OpenCode users configure their MCP servers in personal settings.

## Audit Checklist

The agent should systematically work through each of these areas. For each, record findings as actionable items (not just "looks OK").

### 1. General page load and responsiveness

- Page loads without console errors
- Layout responds across breakpoints (desktop, tablet, mobile)
- No content reflow that traps focus or hides content

### 2. Images and media

- Every `<img>` has a meaningful `alt` attribute, or `alt=""` if decorative
- List images missing `alt` with `src`, `class`, and current value
- Videos include captions; audio content has transcripts
- Animated content (GIFs, video) can be paused or has reduced-motion fallback

### 3. Form accessibility

- Every form field has an associated `<label>`
- Placeholder text is not used as a substitute for a label
- Required fields are programmatically marked (`aria-required` or `required`) and visually indicated
- Help text and instructions are linked to inputs (`aria-describedby`)

### 4. Error handling

Submit invalid or incomplete forms and verify:

- Error messages display clearly
- Errors are announced to screen readers (live region or focus management)
- Input fields in error are programmatically marked (`aria-invalid`, `aria-describedby` pointing to the error message)

### 5. Keyboard navigation

- Tab through the page; every interactive element (link, button, input) is focusable and operable
- Visible focus indicator on every interactive element (no `outline: none` without a replacement)
- Skip links at the top of the page (e.g. "Skip to main content") work
- No keyboard traps

### 6. Focus management

- Modal open: focus moves into the modal; Tab cycles within it
- Modal close: focus returns to the element that opened it
- Dynamic content loads do not steal focus or lose it
- `:focus-visible` is used so keyboard-only users see focus rings without showing them to mouse users

### 7. Landmarks and semantic structure

- Page uses HTML5 landmarks appropriately: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- Each landmark appears once at the top level (or has an `aria-label` to differentiate)
- Content is in a landmark, not orphaned

### 8. Heading structure

- One `<h1>` per page
- Headings follow logical order: no skipped levels (h1 → h3 without h2)
- Heading text describes the section content (no decorative-only headings)

### 9. Colour contrast

- Text contrast meets WCAG 2.1 AA: ≥ 4.5:1 for normal text, ≥ 3:1 for large text (18pt or 14pt bold)
- Non-text contrast (interactive borders, focus rings) meets ≥ 3:1
- Verify with a contrast checker; do not eyeball

### 10. ARIA attributes and roles

- Roles match the element's actual behaviour (`role="dialog"` only on actual dialogs)
- No redundant roles (`<button role="button">`)
- ARIA states are kept in sync with visual state (`aria-expanded`, `aria-pressed`, `aria-selected`)

### 11. Language attribute

- `<html lang="...">` is set and correct
- Sub-sections in a different language have their own `lang` attribute

### 12. Dynamic content

- Dropdowns, modals, tooltips, alerts: keyboard-operable and announced to screen readers
- Live regions (`aria-live`, `role="status"`, `role="alert"`) used correctly for content that updates without a page navigation

### 13. Accessible tables

- Data tables use `<th>` with `scope`
- Tables have a `<caption>` or accessible name (`aria-label`/`aria-labelledby`)
- Tables are navigable via keyboard and the column/row headers are read with each cell

## Output Format

Save the report as `YYYY-MM-DD_accessibility-report.md` (date is the audit date, ISO format). Use this structure:

```markdown
# Accessibility Audit — <page name>

_Date:_ YYYY-MM-DD
_URL:_ <audited URL>
_Standard:_ WCAG 2.1 AA

## Summary

<2–3 sentence overview: total findings, severity distribution, biggest themes.>

## Findings

### Images missing alt text

| Src         | Alt value   | Notes                       |
| ----------- | ----------- | --------------------------- |
| /logo.png   | _(missing)_ | No descriptive alt provided |
| /banner.jpg | ""          | Empty alt — is this decorative? |

### Form label issues

- "Email Address" field is missing a `<label>`
- Required field not indicated for "Phone Number"

### Colour contrast

- Button "Join Now" (#ffffff on #00c6ff) — contrast ratio 2.5:1 — fail (needs 4.5:1)

### Focus issues

- Focus not returned to triggering button after modal closes
- Custom dropdown loses focus when an item is selected

### Skip links

- No skip link to bypass repeated navigation

### Headings

- `<h1>` is missing on the page
- Heading jumps from `<h2>` to `<h4>` in the sidebar

### ARIA

- `role="dialog"` on a `<div>` that does not trap focus or have an accessible name

<add other sections as findings dictate>

## Severity rubric

- **Critical** — blocks a user with assistive tech from completing a primary task
- **Serious** — significantly degrades the experience for users with assistive tech
- **Moderate** — annoyance or confusion but workaround exists
- **Minor** — polish, best-practice deviation

Tag each finding with one of these.
```

## Tips for the agent

- Use the browser-automation MCP server to actually navigate and interact — do not rely on inferring from source code alone.
- For colour contrast, sample the rendered pixel colours (after CSS variables resolve), not the design-token names.
- For keyboard navigation, drive the Tab key with the MCP and screenshot the focused state at each stop.
- For dynamic content (modals, dropdowns), exercise the open and close transitions — bugs hide in the transitions.
- When in doubt about ARIA, prefer using a semantically correct HTML element instead of ARIA attributes.
