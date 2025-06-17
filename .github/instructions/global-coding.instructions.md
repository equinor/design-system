---
applyTo: '**'
---

# Project coding standards

- Maintain full accessibility (WCAG 2.1 AA compliance)
- Use ESLint for linting and code quality checks
- Always use named exports instead of default exports
- Remove unused declarations and imports

## Code Formatting with Prettier

- Use Prettier for consistent code formatting. Use the global prettier config.
- Run `pnpm prettier --write .` to format all files in the project

## Naming Conventions

- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (\_)
- Use ALL_CAPS for constants
