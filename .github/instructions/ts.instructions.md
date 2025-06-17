---
applyTo: '**/*.ts,**/*.tsx'
---

# Project coding standards for TypeScript

## TypeScript Guidelines

- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Use explicit typing rather than inference when appropriate
- Extend existing type definitions where possible
- Use union types for props with a limited set of options
- Avoid using `any` unless absolutely necessary
- Create reusable type definitions for common patterns

## Testing Guidelines

- Use Jest and Testing Library for component tests
- Write descriptive test names that explain the expected behavior
- Use consistent formatting within test blocks:
  - No extra blank lines between render calls and assertions
  - Group related assertions together without blank lines
  - Include one blank line between test cases
- Use Testing Library best practices:
  - Test from the user's perspective
  - Query elements by role, text, or test ID, not by class or tag
  - Use `getBy*` for elements that should be in the document
  - Use `queryBy*` for elements that may not be in the document
- Format test files with the same Prettier rules as source files
