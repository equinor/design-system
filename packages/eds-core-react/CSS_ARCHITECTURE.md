# CSS Architecture

## Overview

Next EDS 2.0 components use vanilla CSS with EDS 2.0 tokens. Component CSS is centralized in `src/index.css` to prevent duplicate imports and enable automatic tree-shaking.

**Important:** Only Next EDS 2.0 components (in `src/components/next/`) use vanilla CSS. Stable components use styled-components and don't need CSS files.

## Structure

```
src/
├── index.css              # Imports all next/ component CSS
├── index.ts               # Stable components (no CSS import)
├── index.next.ts          # Imports index.css + exports next components
└── components/
    ├── Button/            # Stable component (styled-components)
    │   └── Button.tsx
    └── next/              # Next EDS 2.0 components (vanilla CSS)
        └── Input/
            ├── Input.tsx       # No CSS import
            └── input.css       # Styles defined here
```

## How It Works

1. Component CSS files contain the styles (e.g., `input.css`)
2. `src/index.css` imports all next/ component CSS with `@import`
3. `src/index.next.ts` imports `index.css` once
4. Users importing from `@equinor/eds-core-react/next` get all CSS automatically

## Adding Next EDS 2.0 Components

When creating a new component in `components/next/`:

1. Create `input.css` in component directory (lowercase with hyphens)
2. Add to `src/index.css`:
   ```css
   @import './components/next/Input/input.css';
   ```
3. **Never** import CSS in `.tsx` files
4. Export component from `src/index.next.ts`

## Build

Rollup builds CSS with PostCSS to bundle all `@import` statements:

- **Input**: `src/index.css`
- **Output**:
  - `build/index.css` (formatted)
  - `build/index.min.css` (minified)

## Usage

### Next EDS 2.0 Components

Import from the `/next` subpath -- CSS is included automatically:

```tsx
import { Input } from '@equinor/eds-core-react/next'
```

Or import CSS separately if needed:

```tsx
import '@equinor/eds-core-react/index.css' // Development
import '@equinor/eds-core-react/index.min.css' // Production
```

### Stable Components

Import normally from the main package (no CSS needed):

```tsx
import { Button, Typography } from '@equinor/eds-core-react'
```

## Configuration

**package.json**:

- `"sideEffects": ["**/*.css"]` -- Preserves CSS during tree-shaking
- `"files": ["dist/*", "build/*"]` -- Publishes JS and CSS
- Exports:
  - `.` -- Stable components (main package)
  - `./next` -- Next EDS 2.0 components (with CSS)
  - `./index.css` and `./index.min.css` -- Next component styles

**rollup.config.js**:

Two entry points are built:

1. `src/index.ts` → `dist/eds-core-react.cjs` (stable components)
2. `src/index.next.ts` → `dist/next.cjs` (next components with CSS)

**Storybook** (`.storybook/preview.mjs`):

```javascript
import '../src/index.css' // Next component styles
```

## Naming Conventions

- **CSS files:** lowercase with hyphens (e.g., `input.css`, `text-field.css`)
- **Component files:** PascalCase (e.g., `Input.tsx`, `TextField.tsx`)
- **Folder:** PascalCase matching component name (e.g., `Input/`, `TextField/`)
