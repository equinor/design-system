# CSS Architecture

## Overview

Component CSS is centralized in `src/styles.css` to prevent duplicate imports and enable automatic tree-shaking.

## Structure

```
src/
├── styles.css          # Imports all component CSS
├── index.ts            # Imports styles.css once
└── components/
    └── Input/
        ├── Input.new.tsx     # No CSS import
        └── Input.new.css     # Styles defined here
```

## How It Works

1. Component CSS files contain the styles
2. `src/styles.css` imports all component CSS with `@import`
3. `src/index.ts` imports `styles.css` once
4. Users get all CSS automatically when importing components

## Adding Components

When creating a component with CSS:

1. Create `Button.new.css` in component directory
2. Add to `src/styles.css`:
   ```css
   @import './components/Button/Button.new.css';
   ```
3. **Never** import CSS in `.tsx` files

## Build

Rollup builds CSS with PostCSS to bundle all `@import` statements:

- **Input**: `src/styles.css`
- **Output**: 
  - `build/styles.css` (3.5KB formatted)
  - `build/styles.min.css` (2.1KB minified)

## Usage

Import components normally -- CSS is included automatically:

```tsx
import { InputNew } from '@equinor/eds-core-react'
```

Or import CSS separately if needed:

```tsx
import '@equinor/eds-core-react/styles.css'      // Development
import '@equinor/eds-core-react/styles.min.css'  // Production
```

## Configuration

**package.json**:
- `"sideEffects": ["**/*.css"]` -- Preserves CSS during tree-shaking
- `"files": ["dist/*", "build/*"]` -- Publishes JS and CSS
- Exports CSS at `./styles.css` and `./styles.min.css`

**Storybook** (`.storybook/preview.mjs`):
```javascript
import '../src/styles.css'  // Global component styles
```
