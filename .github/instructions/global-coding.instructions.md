---
applyTo: '**'
---

# Global Coding Standards

## Core Requirements

- **Accessibility:** WCAG 2.1 AA compliance (non-negotiable)
- **Code quality:** ESLint and Prettier (automated checks)
- **Exports:** Named exports only (no default exports)
- **Cleanup:** Remove unused imports and declarations

## Code Formatting

**Prettier configuration:**

```bash
# Format entire project
pnpm prettier --write .

# Format specific file
pnpm prettier --write src/components/Button.tsx
```

Use the global prettier config in the repository root. All files should pass Prettier formatting automatically.

## Naming Conventions

| Type            | Convention  | Example                             |
| --------------- | ----------- | ----------------------------------- |
| Components      | PascalCase  | `Button`, `TextInput`, `DataGrid`   |
| Interfaces      | PascalCase  | `ButtonProps`, `TableColumn`        |
| Types           | PascalCase  | `Theme`, `Variant`                  |
| Variables       | camelCase   | `buttonLabel`, `isDisabled`         |
| Functions       | camelCase   | `handleClick`, `formatDate`         |
| Constants       | ALL_CAPS    | `MAX_RETRIES`, `DEFAULT_TIMEOUT`    |
| Private members | \_camelCase | `_internalState`, `_handleInternal` |

## Linting & Quality

**Before submitting:**

```bash
# Run linting for all packages in the monorepo
pnpm lint

# Run tests for all packages in the monorepo
pnpm test

# (Optional) To lint or test a specific package, use the package-specific script.
# Example for core-react package:
pnpm lint:core-react
pnpm test:core-react

# Format code
pnpm prettier --write .
```

**Common issues:**

- ❌ Unused imports
- ❌ Default exports
- ❌ Variables not following naming convention
- ❌ Missing accessibility attributes

## Imports

```typescript
// ✅ Named exports
export const Button = () => {}
export const useButton = () => {}

// ❌ Avoid default exports
export default Button

// ✅ Import named exports
import { Button, useButton } from '@equinor/eds-core-react'

// ❌ Don't import default
import Button from '@equinor/eds-core-react'
```
