# Equinor Design System (EDS)

This file provides guidance for Claude Code working in this repository.

## Overview

Equinor Design System (EDS) is a pnpm monorepo containing React component libraries and design tokens. **New components are developed in `/next`** (`packages/eds-core-react/src/components/next/`).

### Key Packages

- `@equinor/eds-core-react` - Main React component library
- `@equinor/eds-core-react/next` - New EDS 2.0 components (active development)
- `@equinor/eds-tokens` - Design tokens, CSS variables, and theming
- `@equinor/eds-icons` - Icon library

## Build/Lint/Test Commands

Package manager: `pnpm@10.15.0`

```bash
pnpm run build                    # Build all packages
pnpm run build:core-react         # Build eds-core-react only
pnpm run lint:all                 # Lint entire codebase
pnpm run lint ./path/to/file.tsx  # Lint specific file

pnpm run test:core-react          # Run eds-core-react tests
pnpm run test:watch:core-react    # Watch mode

# Run a single test file (from package directory)
cd packages/eds-core-react
pnpm test -- --testPathPattern="Icon"

pnpm run storybook                # Start Storybook
```

## Component File Structure (EDS 2.0)

New components go in `packages/eds-core-react/src/components/next/`:

```
ComponentName/
  index.ts               # Named exports only
  ComponentName.tsx      # Main component with forwardRef
  ComponentName.types.ts # TypeScript types with JSDoc
  componentname.css      # Vanilla CSS with BEM + design tokens
  componentName.figma.tsx # Figma Code Connect file for mapping code to Figma props
  ComponentName.test.tsx # Jest + Testing Library + jest-axe
  ComponentName.stories.tsx
```

## Code Style

### Formatting (Prettier)

- 2 spaces, no semicolons, single quotes, trailing commas, LF line endings

### Imports

```typescript
// 1. React
import { forwardRef, useId } from 'react'
// 2. Types (use `import type`)
import type { ComponentProps } from './Component.types'
// 3. Styles last
import './component.css'
```

**No default exports** (except Storybook files). Always use named exports.

### TypeScript

```typescript
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type IconProps = {
  /** Icon data from @equinor/eds-icons */
  data: IconData
  /** Title for accessibility - makes icon semantic with role="img" */
  title?: string
  /** Explicit size override */
  size?: IconSize
} & Omit<SVGProps<SVGSVGElement>, 'color'>
```

### React Components

```typescript
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { data, title, color = 'currentColor', size, className, ...rest },
  ref,
) {
  const titleId = useId()

  if (!data) {
    console.error('Icon: data prop is required')
    return null
  }

  const classes = ['icon', className].filter(Boolean).join(' ')

  return (
    <svg ref={ref} className={classes} data-icon-size={size} {...rest}>
      {title && <title id={titleId}>{title}</title>}
      <path d={data.svgPathData} />
    </svg>
  )
})
```

### CSS (Vanilla + BEM + Tokens)

```css
.icon {
  font-size: var(--eds-typography-icon-size, 1.5em);
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.icon[data-icon-size='lg'] {
  --_explicit-size: var(--eds-sizing-icon-lg);
  width: var(--_explicit-size);
  height: var(--_explicit-size);
}
```

### Testing

Jest + Testing Library. Organize tests by category with `describe` blocks:

```typescript
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Icon } from '.'

describe('Icon (next)', () => {
  describe('Rendering', () => {
    it('renders with data prop', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('is decorative (aria-hidden) when no title', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute('aria-hidden', 'true')
    })

    it('passes axe accessibility test', async () => {
      const { container } = render(<Icon data={save} title="Save" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
```

Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`

### Naming Conventions

- **Components/Types**: PascalCase (`Button`, `ButtonProps`)
- **Variables/Functions**: camelCase (`isDisabled`, `useToken`)
- **CSS classes**: lowercase BEM with 'eds-' prefix (`eds-icon`, `eds-button__label--disabled`)
- **Files**: Match export (`Icon.tsx`, `Icon.types.ts`, `icon.css`)

## Accessibility

- WCAG 2.1 AA compliance required
- Decorative elements: `aria-hidden="true"`
- Semantic elements: `role="img"` with `aria-labelledby`
- Test with `jest-axe` in every component

## Conventional Commits

```
type(scope): description
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes (packages)**: `eds-core-react`, `eds-data-grid-react`, `eds-icons`, `eds-lab-react`, `eds-tailwind`, `eds-tokens`, `eds-tokens-build`, `eds-tokens-sync`, `eds-utils`, `design-system-docs`, `eds-color-palette-generator`, `eds-demo`, `figma-broker`

**Scopes (infrastructure)**: `config`, `github`, `build`, `deps`, `docs`, `devcontainer`

**Breaking**: `feat(eds-core-react)!: remove deprecated prop`

See `documentation/how-to/CONVENTIONAL_COMMITS.md` for full guidelines.

## Git Workflow

⚠️ **CRITICAL: Always ask the user for permission before:**

- Creating commits
- Pushing to remote
- Creating branches
- Creating PRs with `gh`

**Never assume these actions are okay.** Even for small changes, always confirm with the user first. Example: "Ready to commit. Should I proceed?"

NEVER attribute AI, or add to the commit message "Co-authored by Claude" or similar.

## Additional Guidelines

See `.github/copilot-instructions.md` and `.github/instructions/` for detailed guidelines.

## Specialized Rules

Path-specific rules are available in `.claude/rules/`:

- `eds-component.md` - EDS 2.0 component building conventions
- `figma-component.md` - Figma-to-code workflow with MCP tools
- `advisor.md` - Read-only code review guidelines
