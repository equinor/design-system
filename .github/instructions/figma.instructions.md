---
applyTo: '**'
---

# Figma Component Creation

> See [`AGENTS.md`](../../AGENTS.md) for the canonical EDS conventions.

## Workflow

When creating a component from Figma design:

1. **Start fresh** — Do NOT reference existing components. Implement only what Figma specifies.
2. **Exact specifications** — Use all explicit properties and values from the design
3. **Deviation justification** — Only deviate if you have strong technical reasons; document why
4. **File structure** — Follow React guidelines: Component.tsx, Component.types.ts, component.css, Component.test.tsx, Component.stories.tsx

## Critical rules

- **Use exact variable names from the Figma design.** Never assume tokens based on semantics, and never copy from similar components without verifying.
- **Never hardcode hex values** — always use the `--eds-*` CSS variables from `@equinor/eds-tokens`.
- **Check every state** — Default, Hover, Focus, Disabled, Error. Tokens often change between states (especially `data-color-appearance` for disabled icons).

## Sub-component convention

Figma layers prefixed with `⌘`, `.`, or `↳` represent nested sub-components. In React, model them as composable sub-components or use Code Connect's `figma.nestedProps()` to map their props.

```tsx
// Code Connect example
figma.connect(Component, 'figma-url', {
  props: {
    disabled: figma.enum('State', { Disabled: true }),
    inner: figma.nestedProps('⌘ InnerComponent', {
      open: figma.enum('Open', { true: true }),
    }),
  },
  example: ({ disabled, inner }) => (
    <Component disabled={disabled} open={inner.open} />
  ),
})
```

## Anti-patterns

- Combining Figma design with patterns from similar existing components
- Adding props or features not in the design
- Using CSS-in-JS or styled-components (use vanilla CSS)
- Importing from other components without explicit design requirement
- Ignoring `⌘` / `.` / `↳` prefixed layers

## Checklist

- [ ] Figma design specifications documented
- [ ] Component implements only what's designed
- [ ] All states (default, hover, focus, disabled, error) verified against Figma
- [ ] Storybook story includes all design variations
- [ ] Tests cover interaction and edge cases
- [ ] CSS follows component conventions (eds-prefixed root class, nesting, data attributes)

---

> **Claude Code users:** when the Figma MCP server is available, follow the detailed token-extraction workflow in `.claude/rules/figma-component.md` (loaded automatically). It adds the `figma_get_variable_defs` call sequence that Copilot does not have access to.
