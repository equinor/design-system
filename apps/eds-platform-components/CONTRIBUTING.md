# Contributing to EDS Platform Components

Thank you for your interest in contributing to the EDS Platform Components application!

## Development Setup

1. **Install dependencies** (from repository root):

   ```bash
   pnpm install
   ```

2. **Start development server**:

   ```bash
   pnpm platform:dev
   ```

3. **Run tests**:

   ```bash
   pnpm platform:test        # Unit tests
   pnpm platform:test:e2e    # E2E tests
   ```

4. **Lint code**:
   ```bash
   pnpm platform:lint
   ```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # Reusable React components
│   └── ComponentName/
│       ├── index.ts                 # Named exports
│       ├── ComponentName.tsx        # Component implementation
│       ├── ComponentName.types.ts   # TypeScript types
│       ├── component-name.css       # Component styles
│       └── ComponentName.test.ts    # Unit tests
└── styles/           # Shared style utilities
tests/
└── e2e/              # Playwright E2E tests
```

## Component Guidelines

### File Structure

Every component should follow this structure:

```
ComponentName/
├── index.ts                 # Export only
├── ComponentName.tsx        # Component implementation
├── ComponentName.types.ts   # Props and type definitions
├── component-name.css       # Styles (vanilla CSS, BEM)
└── ComponentName.test.ts    # Unit tests
```

### TypeScript

```typescript
// ComponentName.types.ts
export type ComponentNameProps = {
  /** Description of prop */
  title: string
  /** Optional prop with default */
  variant?: 'primary' | 'secondary'
}
```

### Component Implementation

```typescript
// ComponentName.tsx
import type { ComponentNameProps } from './ComponentName.types'
import './component-name.css'

export const ComponentName = ({
  title,
  variant = 'primary',
}: ComponentNameProps) => {
  return (
    <div className={`component-name component-name--${variant}`}>
      {title}
    </div>
  )
}
```

### Styling

Use vanilla CSS with BEM naming convention:

```css
/* component-name.css */
.component-name {
  padding: var(--eds-spacing-medium, 1rem);
  color: var(--eds-color-text-primary, #000);
}

.component-name--primary {
  background: var(--eds-color-bg-primary, #007079);
}

.component-name__element {
  margin-bottom: 0.5rem;
}
```

### Testing

```typescript
// ComponentName.test.ts
import { describe, it, expect } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    expect(true).toBe(true)
  })
})
```

## Code Style

- **Formatting**: Prettier (2 spaces, no semicolons, single quotes)
- **Naming**:
  - Components/Types: PascalCase
  - Variables/Functions: camelCase
  - CSS classes: lowercase-with-hyphens (BEM)
- **Exports**: Named exports only (no default exports except in Next.js pages)
- **Accessibility**: WCAG 2.1 AA compliance required

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(platform): add Power Platform component
fix(ui): correct button alignment
docs(readme): update installation steps
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Pull Requests

1. Create a feature branch: `feat/your-feature-name`
2. Make your changes following the guidelines
3. Run tests and linting: `pnpm platform:test && pnpm platform:lint`
4. Commit with conventional commit messages
5. Push and create a pull request
6. Wait for review and address feedback

## Platform-Specific Guidelines

### Power Platform Components

- Focus on simplicity and declarative APIs
- Provide clear documentation for low-code developers
- Include copy-paste ready examples
- Consider canvas app constraints

### Power BI Components

- Optimize for data visualization
- Follow Power BI visual guidelines
- Provide data binding examples
- Test with various data scales

### Low-Code Platforms

- Maximize reusability across platforms
- Document platform-specific quirks
- Provide fallback behaviors
- Keep dependencies minimal

## Need Help?

- Check the main [AGENTS.md](../../AGENTS.md) for repository-wide guidelines
- Review [.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Look at existing components for examples
- Ask questions in pull request discussions

## Resources

- [Equinor Design System](https://eds.equinor.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
