---
mode: 'agent'
model: Claude Sonnet 4
tools: ['edit/createFile', 'edit/editFile', 'search/codebase', 'figma/*']
description: 'Build React components from Figma designs using MCP'
---

## Task

Implement **${input:componentName}** from the selected Figma design.
Target: `${input:targetDirectory:packages/eds-core-react/src/components/next}`

---

## MCP Workflow

### 1. Analyze Design

```
figma_get_design_context  → Structure & Code Connect mappings
figma_get_screenshot      → Visual reference
```

### 2. Extract Tokens (⚠️ CRITICAL)

Call `figma_get_variable_defs` for **EACH state** separately:

- Default, Hover, Focus, Disabled, Error (if applicable)

**Rules:**

- ✅ Use EXACT variable names from Figma
- ❌ Never assume tokens (e.g., don't guess "disabled = text-subtle")
- ❌ Never hardcode hex values

### 3. Identify Sub-Components

Layer prefixes indicating nested components:

| Prefix      | Action                                    |
| ----------- | ----------------------------------------- |
| `⌘` `.` `↳` | Use `figma.nestedProps()` in Code Connect |

---

## Implementation

### File Structure

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── component-name.css (BEM convention)
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
├── ComponentName.figma.tsx
└── index.ts
```

### Code Connect Pattern

```tsx
figma.connect(Component, 'figma-url', {
  props: {
    disabled: figma.enum('State', { Disabled: true }),
    // Sub-components: name MUST match Figma layer exactly
    inner: figma.nestedProps('⌘ InnerComponent', {
      open: figma.enum('Open', { true: true }),
    }),
  },
  example: ({ disabled, inner }) => (
    <Component disabled={disabled} open={inner.open} />
  ),
})
```

---

## Rules

1. **Start fresh** - Implement only what Figma specifies
2. **Exact specs** - Use explicit properties from design
3. **Document deviations** - Justify any changes from design
4. **Vanilla CSS only** - No CSS-in-JS or styled-components

## Anti-patterns

- ❌ Copying patterns from similar components without verifying Figma
- ❌ Adding props/features not in design
- ❌ Using `figma_get_design_context` alone without `figma_get_variable_defs`
- ❌ Ignoring `⌘`/`.` prefixed layers (these are sub-components)

---

## Output

Provide: files created, token mapping per state, verification status.
