# EDS Prompts

Reusable prompts for AI-assisted workflows in the Equinor Design System.

## Structure

```
prompts/
├── README.md           # This file
├── a11y/
│   └── audit.md        # Accessibility audit for websites
├── components/
│   ├── structure.md    # Structure component documentation
│   └── verify.md       # Verify documentation quality
└── figma/
    └── workflow.md     # Figma-to-code component workflow
```

## Workflows

### Documentation Workflow

For creating consistent component documentation:

```
Raw content → structure.md → verify.md → Final documentation
```

1. **Step 1: Structure** (`components/structure.md`)
   - Input: Raw/unstructured documentation
   - Output: Consistently formatted markdown
   - Run on files that need restructuring

2. **Step 2: Verify** (`components/verify.md`)
   - Input: Structured documentation
   - Output: QA report with verdict
   - Run to validate before publishing

### Accessibility Workflow

For auditing websites against WCAG standards:

```
URL → audit.md → Accessibility report
```

- **Audit** (`a11y/audit.md`)
  - Input: Website URL
  - Output: Detailed a11y report with issues
  - Uses Playwright MCP for browser automation

### Figma-to-Code Workflow

For building components from Figma designs:

```
Figma design → workflow.md → React component
```

- **Workflow** (`figma/workflow.md`)
  - Input: Figma component URL/selection
  - Output: Complete component files
  - Uses Figma MCP for design extraction

## Usage

### VS Code / GitHub Copilot

Prompts with frontmatter are compatible with VS Code prompt files:

```yaml
---
agent: 'agent'
model: Claude Opus 4.5
tools: ['editFiles', 'readFile']
---
```

### Claude Code

Reference prompts directly or use them as context.

### OpenCode

Prompts can be referenced from OpenCode agents.

## Frontmatter Reference

| Field | Description | Example |
|-------|-------------|---------|
| `agent` | Agent mode | `'agent'` |
| `model` | AI model to use | `Claude Opus 4.5` |
| `tools` | Available tools | `['editFiles', 'readFile']` |
| `description` | Short description | `'Audit accessibility'` |

## Related

- `.claude/rules/` - Claude Code rules (always active for specific paths)
- `.claude/CLAUDE.md` - Main Claude Code instructions
