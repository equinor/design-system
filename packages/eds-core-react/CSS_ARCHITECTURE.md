# Global CSS Architecture

## Overview

Component CSS is now centralized in a global `styles.css` file to prevent duplicate CSS imports when users consume the library.

## Structure

```
src/
├── styles.css                    # Global CSS entry point
├── index.ts                      # Imports styles.css once
└── components/
    └── Input/
        ├── Input.new.tsx         # No CSS import
        └── Input.new.css         # Styles imported via styles.css
```

## How It Works

1. **Component CSS files** (`Input.new.css`) contain the styles
2. **Global styles.css** imports all component CSS files
3. **Main index.ts** imports `styles.css` once
4. **Users** get all CSS automatically when they import any component

## Benefits

✅ **No duplicate CSS** - CSS is imported once at the package level  
✅ **Automatic tree-shaking** - Bundlers can optimize unused CSS  
✅ **Better performance** - Single CSS import instead of per-component  
✅ **Easier maintenance** - All CSS imports in one place  

## Adding New Components

When creating a new component with CSS:

1. Create the component CSS file (e.g., `Button.new.css`)
2. Add import to `src/styles.css`:
   ```css
   @import './components/Button/Button.new.css';
   ```
3. **Do NOT** import CSS in the component `.tsx` file

## Storybook Configuration

The `.storybook/preview.mjs` imports the global CSS file:

```javascript
import './preview.css'
import '../src/styles.css'  // Global component styles
```

This ensures all component styles are available in Storybook stories.

## User Consumption

Users automatically get all CSS when importing components:

```tsx
// This imports both the component AND all CSS
import { InputNew } from '@equinor/eds-core-react'
```

Alternatively, users can import just the CSS if needed:

```tsx
import '@equinor/eds-core-react/styles.css'
```

## Package Configuration

The `package.json` includes:

- `"sideEffects": ["**/*.css"]` - Preserves CSS imports during tree-shaking
- `"./styles.css": "./dist/esm/styles.css"` - Exports CSS separately if needed
