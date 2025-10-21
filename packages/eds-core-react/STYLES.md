# EDS Core React - Styles

## Using the Stylesheet

The `@equinor/eds-core-react` package exports a compiled stylesheet that includes all necessary component styles.

### Installation

```bash
npm install @equinor/eds-core-react
# or
pnpm add @equinor/eds-core-react
```

### Usage

Import the stylesheet in your application:

#### In JavaScript/TypeScript:

```javascript
import '@equinor/eds-core-react/style.css'
```

#### In CSS:

```css
@import '@equinor/eds-core-react/style.css';
```

#### In Storybook:

If you're using this in Storybook, the import will work out of the box:

```css
/* In your Storybook preview.css */
@import '@equinor/eds-core-react/style.css';
```

### What's Included

The `style.css` file currently includes:

- **Typography styles** - All typography component styles with support for:
  - Font families (UI and Header)
  - Text sizes (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
  - Line heights (default, squished)
  - Font weights (lighter, normal, bolder)
  - Letter spacing (tight, normal, loose)
  - Baseline alignment utilities

### Build Process

The stylesheet is automatically generated during the build process:

1. Source CSS files are located in `src/components/[Component]/[component].css`
2. The main entry point is `src/style.css` which imports component styles
3. During build, all imports are resolved and the CSS is minified
4. The final `style.css` is output to `dist/style.css`

### Adding More Styles

To include additional component styles in the main stylesheet:

1. Ensure the component has a CSS file (e.g., `src/components/Button/button.css`)
2. Add an import to `src/style.css`:
   ```css
   @import './components/Button/button.css';
   ```
3. Rebuild the package: `pnpm build`

### Notes

- The stylesheet uses CSS custom properties from `@equinor/eds-tokens`
- Make sure to also import the tokens CSS variables in your application
- The stylesheet is optimized and minified for production use
