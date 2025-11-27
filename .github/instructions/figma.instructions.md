---
applyTo: '**'
---

# Figma Component Creation

## Workflow

When creating a component from Figma design:

1. **Start fresh** - Do NOT reference existing components. Implement only what Figma specifies.
2. **Exact specifications** - Use all explicit properties and values from the design
3. **Deviation justification** - Only deviate if you have strong technical reasons; document why
4. **File structure** - Follow React guidelines: Component.tsx, Component.types.ts, component.css, Component.test.tsx, Component.stories.tsx

## Anti-patterns

- ❌ Combining Figma design with patterns from similar existing components
- ❌ Adding props or features not in the design
- ❌ Using CSS-in-JS or styled-components (use vanilla CSS)
- ❌ Importing from other components without explicit design requirement

## Checklist

- [ ] Figma design specifications documented
- [ ] Component implements only what's designed
- [ ] Storybook story includes all design variations
- [ ] Tests cover interaction and edge cases
- [ ] CSS follows BEM convention
