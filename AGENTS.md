# AGENTS.md — Equinor Design System

This is the **canonical conventions file** for AI coding agents working in this repository. Tool-specific configs (`.claude/CLAUDE.md`, `.github/copilot-instructions.md`, `.opencode/`, `.cursorrules`) reference this file rather than duplicating its content.

## Overview

Equinor Design System (EDS) is a pnpm monorepo containing React component libraries and design tokens. **New components are developed in `/next`** (`packages/eds-core-react/src/components/next/`).

### Key Packages

- `@equinor/eds-core-react` — Main React component library
- `@equinor/eds-core-react/next` — New EDS 2.0 components (active development)
- `@equinor/eds-tokens` — Design tokens, CSS variables, and theming
- `@equinor/eds-icons` — Icon library

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
  index.ts                # Named exports only
  ComponentName.tsx       # Main component with forwardRef
  ComponentName.types.ts  # TypeScript types with JSDoc
  componentname.css       # Vanilla CSS with design tokens
  ComponentName.figma.tsx # Figma Code Connect (when a Figma design exists)
  ComponentName.test.tsx  # Jest + Testing Library + jest-axe
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

### CSS (Vanilla + Tokens + Nesting)

One `eds-`-prefixed root class per component. Internal elements use simple class names scoped by CSS nesting. Variants and state use data attributes.

```css
@layer eds-components {
  .eds-icon {
    font-size: var(--eds-typography-icon-size, 1.5em);
    width: 1em;
    height: 1em;
    flex-shrink: 0;

    &[data-icon-size='lg'] {
      --_explicit-size: var(--eds-sizing-icon-lg);
      width: var(--_explicit-size);
      height: var(--_explicit-size);
    }
  }
}
```

#### Pseudo-private custom properties

Define component-scoped variables with a `--_` prefix at the component root. Use these variables for all properties. In variants and states, **override only the variable — never the property directly**. The pattern was introduced for typography inheritance (see `documentation/adr/0005-typography-approach-for-eds-2.md`) and is now applied broadly across components.

```css
/* CORRECT */
.eds-button {
  --_color: var(--eds-color-text-strong-on-emphasis);
  --_bg-color: var(--eds-color-bg-fill-emphasis-default);
  color: var(--_color);
  background-color: var(--_bg-color);
}
.eds-button[data-variant='ghost']:disabled {
  --_color: var(--eds-color-text-disabled); /* override the variable */
}

/* WRONG — never override the property directly */
.eds-button[data-variant='ghost']:disabled {
  color: var(--eds-color-text-disabled);
}
```

#### CSS layers

Wrap all component styles in `@layer eds-components { }`. Rules outside the layer (e.g. display overrides) must be placed after the layer block with a comment explaining why they are outside.

#### Data attributes for variants and states

Use `data-*` attributes for all variants, sizes, and boolean states — not modifier classes.

```css
.eds-button[data-variant='primary'] {
}
.eds-button[data-selectable-space='lg'] {
}
.eds-button[data-icon-only] {
}
.eds-button[data-round] {
}
.eds-button[data-multiline] {
}
```

#### Density via ancestor attribute

Density variants are applied by setting `data-density` on an ancestor element. Component CSS selects against this ancestor. See `documentation/adr/0004-component-conventions-for-eds-2.md` and `documentation/adr/0004-spacing-approach-for-eds-2.md` for the rationale.

```css
[data-density='comfortable'] .eds-button[data-selectable-space='md'] {
  --_min-height: 1.5rem;
}
```

#### Modular type scale

Font sizes follow a mathematical scale based on a `--_base` value:

```css
:root,
[data-density='spacious'] {
  --_base: 16px;
  --font-size-md: round(calc(var(--_base) * pow(2, -1/5)), 0.5px);
}
[data-density='comfortable'] {
  --_base: 14px; /* only the base changes; all derived values update automatically */
}
```

#### Progressive enhancement with `@supports`

Use `@supports` to layer in advanced CSS features. The base styles work everywhere; the `@supports` block adds what only supported browsers can handle:

```css
/* Base — all browsers: symmetric padding keeps text vertically centred */
padding-block: var(--eds-selectable-space-vertical);

/* Enhancement — trims whitespace above/below the cap-height */
@supports (text-box: trim-both ex alphabetic) {
  padding-top: var(--padding-top-baseline);
  padding-bottom: 0;
  text-box: trim-both ex alphabetic;
}
```

CSS `@function` (Chrome/Edge 128+) is a future enhancement — define it and comment it in once Safari ships support.

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
- **CSS classes**: `eds-` prefix on root class (`eds-button`, `eds-text-area`); simple nested names for internal elements (`.label-row`, `.icon`); variants via data attributes
- **Files**: Match export (`Icon.tsx`, `Icon.types.ts`, `icon.css`)

## Polymorphism (`asChild` + `Slot`)

EDS 2.0 uses the `asChild` pattern for components that need polymorphic rendering (e.g. Link, Button). This lets consumers swap the underlying element for router links, custom components, etc. See `documentation/adr/0005-use-aschild-slot-for-polymorphism.md` for the rationale.

- **`Slot`** utility in `packages/eds-core-react/src/components/next/Slot/` merges parent props onto the child element
- Add `asChild?: boolean` to the component's props type
- When `asChild` is true, render `<Slot>` instead of the default element
- Extract shared props into a `sharedProps` object to avoid duplication
- See `Slot/README.md` for merge behavior details and usage examples

Components that should support `asChild`: **Link**, **Button**, and any component rendering an interactive element that consumers may want to swap.

## Figma-to-Code Workflow

When implementing a component from a Figma design:

1. **Start fresh** — implement only what the design specifies. Do not borrow props or patterns from similar components without verifying them in Figma.
2. **Use exact variable names from the design.** Never assume tokens based on semantics ("looks like accent blue → `--eds-color-accent-*`"). Verify the actual variable name.
3. **Never hardcode hex values** — always use `--eds-*` CSS variables from `@equinor/eds-tokens`.
4. **Check every state** — Default, Hover, Focus, Disabled, Error. Tokens often change between states (especially `data-color-appearance` on disabled icons).

### Sub-component convention

Figma layers prefixed with `⌘`, `.`, or `↳` represent nested sub-components. In React, model them as composable sub-components or map their props with Code Connect's `figma.nestedProps()`:

```tsx
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

### Anti-patterns

- Combining Figma design with patterns from similar existing components
- Adding props or features not in the design
- Importing from other components without explicit design requirement
- Ignoring `⌘` / `.` / `↳` prefixed layers

### Tool-specific extensions

- **Claude Code with Figma MCP**: see `.claude/rules/figma-component.md` for the `figma_get_design_context` / `figma_get_screenshot` / `figma_get_variable_defs` call sequence (loaded automatically when editing `*.figma.tsx`).

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

**Scope and release-please interaction**: Release-please detects packages from file paths — you don't always need a package scope. Using a package scope with a visible type forces a bump regardless of which files changed. For non-publishable changes (config, Storybook, tests, README, docs), use hidden types: `chore`, `build`, `ci`, `docs`, or `test`.

**PR titles** must also follow the conventional commits format — they appear in changelogs and merge history.

See `documentation/how-to/CONVENTIONAL_COMMITS.md` for full guidelines.

## Git Workflow

⚠️ **CRITICAL: Always ask the user for permission before:**

- Creating commits
- Pushing to remote
- Creating branches
- Creating PRs with `gh`

**Never assume these actions are okay.** Even for small changes, always confirm with the user first. Example: "Ready to commit. Should I proceed?"

NEVER attribute AI, or add to the commit message "Co-authored by Claude" or similar.

## Architecture Decision Records (ADRs)

Non-obvious EDS 2.0 patterns are documented in `documentation/adr/`. Read the relevant ADR before changing or extending these patterns:

- `0002-use-vanilla-css-with-design-tokens-for-eds-2.md` — why vanilla CSS over CSS-in-JS
- `0004-component-conventions-for-eds-2.md` — data attributes vs props, color scheme, density
- `0004-spacing-approach-for-eds-2.md` — spacing tokens, density modes, 4px baseline
- `0005-typography-approach-for-eds-2.md` — type scale, `--_font-weight-*` pseudo-private vars
- `0005-use-aschild-slot-for-polymorphism.md` — `asChild` + `Slot` for polymorphic components

## Tool-Specific Configurations

This file is the canonical source. Tool-specific configs add only what's unique to that tool:

| File                              | Purpose                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| `.claude/CLAUDE.md`               | Claude Code: hooks, slash commands, settings               |
| `.claude/rules/*.md`              | Claude Code: path-scoped rules (`/next`, `*.figma.tsx`)    |
| `.github/copilot-instructions.md` | GitHub Copilot: hub for path-scoped `applyTo` instructions |
| `.github/instructions/*.md`       | GitHub Copilot: file-pattern specific rules                |
| `.opencode/agent/*.md`            | OpenCode: agent definitions                                |
| `.cursorrules`                    | Cursor: pointer to copilot instructions                    |

When adding new conventions, update **this file** and let the tool-specific files reference it.
