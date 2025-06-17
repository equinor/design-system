---
applyTo: '**/*.ts,**/*.tsx'
---

# Project coding standards for React

## React Guidelines

- It is not necessary to import React in every file.
- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Components should be composable
- Implement proper error boundaries
- Always implement proper keyboard navigation and focus management
- Every component must support proper ARIA attributes
- A component directory should be capitalized and named after the component
- Keep component style and script as simple and small as possible.
- A component should have these files in its directory:
  - Component.tsx
  - Component.types.ts
  - Component.css
  - Component.test.tsx
  - Component.stories.tsx
  - Use `index.ts` to export the component
- Define helper functions outside the component but in the module scope
- If a component with the same name already exists, create a new component with suffix `.new` (e.g. `Button.new.tsx`) and ensure it is not used in the codebase
