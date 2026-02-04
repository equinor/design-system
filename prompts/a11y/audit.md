---
agent: 'agent'
model: Claude Opus 4.5
tools: ['edit/createFile', 'search/codebase', 'microsoft/playwright-mcp/*']
description: 'Generate Accessibility Audit Report'
---

### **Task**

Conduct a thorough accessibility audit of the following website:
🔗 **URL:** ${input:url}

---

### **Audit Checklist**

#### 1. **General Page Load & Responsiveness**

- Confirm the page loads without errors.
- Test for responsive design across common breakpoints (desktop, tablet, mobile).

#### 2. **Images & Media**

- List all `<img>` elements missing meaningful `alt` attributes.
- Include image metadata (e.g., `src`, `class`, `alt` value).
- **Accessible Media:** Ensure all videos include captions and all audio content has transcripts.

#### 3. **Form Accessibility**

- Verify each form field has an associated `<label>` element.
- Ensure placeholder text is not used as a substitute for labels.
- Check that form instructions, hints, and required field indicators are clear and accessible.

#### 4. **Error Handling**

- Submit invalid or incomplete forms and check that:
  - Error messages are displayed clearly.
  - Errors are announced to screen readers.
  - Input fields in error are programmatically marked (`aria-invalid`, `aria-describedby`, etc.).

#### 5. **Keyboard Navigation**

- Tab through the page and ensure all interactive elements (links, buttons, inputs) are focusable and operable.
- Check for **skip links** at the top of the page (e.g., "Skip to main content") and verify they function correctly.

#### 6. **Focus Management**

- Check that focus is correctly managed:
  - When modals open/close, focus should move inside and return logically.
  - After dynamic content loads, ensure the focus doesn't get lost.

#### 7. **Landmarks & Semantic Structure**

- Validate the use of HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- Ensure they are present and used appropriately.

#### 8. **Headings Structure**

- Headings (`<h1>` through `<h6>`) should follow a logical order without skipping levels.
- There should be one primary `<h1>` per page.

#### 9. **Color Contrast**

- Check text and background color combinations for sufficient contrast.
- Use WCAG 2.1 AA standards (minimum 4.5:1 for normal text).

#### 10. **ARIA Attributes & Roles**

- Confirm appropriate use of ARIA roles (`role="dialog"`, `role="navigation"`, etc.).
- Check for misuse or redundant roles that may confuse screen readers.

#### 11. **Language Attribute**

- Confirm that the `<html>` tag includes a correct `lang` attribute (e.g., `<html lang="en">`).

#### 12. **Dynamic Content**

- For any JavaScript-rendered content (e.g., dropdowns, modals, alerts):
  - Ensure it is accessible by keyboard.
  - Check if it is properly announced to screen readers.

#### 13. **Accessible Tables**

- Ensure data tables use semantic markup (`<th>`, `<caption>`, `scope`, etc.).
- Tables should be navigable via keyboard and understandable by screen readers.

---

### **Output Format (Markdown)**

```markdown
## Accessibility Issues Summary

### Images Missing Alt Text

| Src         | Alt Value   | Notes                       |
| ----------- | ----------- | --------------------------- |
| /logo.png   | _(missing)_ | No descriptive alt provided |
| /banner.jpg | ""          | Empty alt attribute         |

### Form Label Issues

- "Email Address" field is missing a `<label>`
- Required field not indicated for "Phone Number"

### Color Contrast

- Button "Join Now" (#ffffff text on #00c6ff) has contrast ratio 2.5:1 (fail)

### Focus Issues

- Focus not returned to triggering button after modal closes

### Missing Skip Links

- No skip link to bypass repeated navigation

## Output Report:

Make sure to save the output audit report as a markdown file: `YYYY-MM-DD_accessibility-report.md`
```
