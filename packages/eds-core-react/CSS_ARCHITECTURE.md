# CSS Architecture

## Overview

Component CSS is centralized in `src/index.css` to prevent duplicate imports and enable automatic tree-shaking.

## Structure

```
src/
├── index.css           # Imports all component CSS
├── index.ts            # Imports index.css once
└── components/
    └── Input/
        ├── Input.new.tsx     # No CSS import
        └── input.new.css     # Styles defined here
```

## How It Works

1. Component CSS files contain the styles
2. `src/index.css` imports all component CSS with `@import`
3. `src/index.ts` imports `index.css` once
4. Users get all CSS automatically when importing components

## Adding Components

When creating a component with CSS:

1. Create `button.new.css` in component directory
2. Add to `src/index.css`:
   ```css
   @import './components/Button/button.new.css';
   ```
3. **Never** import CSS in `.tsx` files

## Build

Rollup builds CSS with PostCSS to bundle all `@import` statements:

- **Input**: `src/index.css`
- **Output**:
  - `build/index.css` (3.5KB formatted)
  - `build/index.min.css` (2.1KB minified)

## Usage

Import components normally -- CSS is included automatically:

```tsx
import { InputNew } from '@equinor/eds-core-react'
```

Or import CSS separately if needed:

```tsx
import '@equinor/eds-core-react/index.css' // Development
import '@equinor/eds-core-react/index.min.css' // Production
```

## Configuration

**package.json**:

- `"sideEffects": ["**/*.css"]` -- Preserves CSS during tree-shaking
- `"files": ["dist/*", "build/*"]` -- Publishes JS and CSS
- Exports CSS at `./index.css` and `./index.min.css`

**Storybook** (`.storybook/preview.mjs`):

```javascript
import '../src/index.css' // Global component styles
```
