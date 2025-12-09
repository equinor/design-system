# CSS Architecture for EDS 2.0 (Next) Components

## Overview

EDS 2.0 components use **vanilla CSS** with EDS tokens. CSS is centralized and auto-injected when importing components.

**Note:** Only components in `src/components/next/` use vanilla CSS. Stable components use styled-components.

## Structure

```
src/
├── index.next.ts              # Imports CSS + re-exports components
└── components/
    └── next/
        ├── index.ts           # Barrel exports
        ├── index.css          # Imports all component CSS
        └── Input/
            ├── Input.tsx      # Component (no CSS import)
            └── input.css      # Styles
```

## Usage

### Default: Auto-injected CSS

Just import and use - CSS is included automatically:

```tsx
import { Input } from '@equinor/eds-core-react/next'

function App() {
  return <Input placeholder="Enter text" />
}
```

### SSR / Manual Control

For server-side rendering or manual control, import CSS separately:

```tsx
// In your _app.tsx, layout.tsx, or entry file
import '@equinor/eds-core-react/next/index.css'

// For production, use minified version
import '@equinor/eds-core-react/next/index.min.css'
```

## Adding New Components

1. Create component folder: `components/next/ComponentName/`
2. Create CSS file: `component-name.css` (lowercase with hyphens)
3. Add import to `components/next/index.css`:
   ```css
   @import './ComponentName/component-name.css';
   ```
4. Export from `components/next/index.ts`:
   ```ts
   export { ComponentName } from './ComponentName'
   export type { ComponentNameProps } from './ComponentName'
   ```
5. **Never** import CSS directly in `.tsx` files

## Build Output

| File | Purpose |
|------|---------|
| `dist/esm/index.next.js` | ESM with auto-injected CSS |
| `dist/index.next.cjs` | CJS with auto-injected CSS |
| `build/index.css` | Standalone CSS (for SSR) |
| `build/index.min.css` | Minified CSS (for SSR) |

## Package Exports

```json
{
  "./next": "dist/esm/index.next.js",
  "./next/index.css": "build/index.css",
  "./next/index.min.css": "build/index.min.css"
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| CSS files | lowercase-hyphen | `input.css`, `text-field.css` |
| Components | PascalCase | `Input.tsx`, `TextField.tsx` |
| Folders | PascalCase | `Input/`, `TextField/` |
