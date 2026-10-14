---
applyTo: 'packages/eds-core-react/src/components/next/**/*.{ts,tsx}'
---

# React Guidelines

> See [`AGENTS.md`](../../AGENTS.md) for the canonical conventions (file structure, code style, `forwardRef` + `displayName` pattern, helper-fn placement, polymorphism, accessibility, testing). This file adds Copilot-specific reminders for `/next` components.

## Reminders

- No conditional hooks (extract into separate components if a hook needs to be skipped)
- No `React` namespace import needed in modern JSX

## Storybook stories

Stories feed the generated docs page. Follow [`STORYBOOK_DOC_STYLE.md`](../../documentation/agent-instructions/STORYBOOK_DOC_STYLE.md):

- An `Introduction` playground story, then one captioned export for each example
- At least one example besides `Introduction`
- No beta callout, import snippet or description in the story file, because the page generates them
