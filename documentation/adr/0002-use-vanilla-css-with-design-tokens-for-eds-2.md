# Use vanilla CSS with design tokens for EDS 2.0 styling

- **Status:** Accepted
- **Date:** 2026-02-02
- **Decision makers:** EDS Core Team

## Context

EDS 1.x uses styled-components for all component styling. While this worked well initially, we've encountered several issues as the ecosystem evolved:

- **SSR hydration mismatches** in Next.js App Router and React Server Components
- **Runtime overhead** from CSS-in-JS (style injection, prop interpolation)
- **Bundle size** impact (styled-components adds ~13KB minified + gzipped to the bundle)
- **Developer experience** issues with style debugging and DevTools inspection
- **React 19 compatibility** concerns as the React team moves away from CSS-in-JS patterns
- **styled-components is in maintenance mode** – In March 2025, the styled-components maintainers [announced](https://opencollective.com/styled-components/updates/thank-you) that the project has entered maintenance mode. They stated: _"For new projects, I would not recommend adopting styled-components or most other css-in-js solutions"_ due to ecosystem shifts and React Server Components limitations.

For EDS 2.0, we need a styling approach that is future-proof and works seamlessly with modern React frameworks.

## Decision Drivers

- Must support Server-Side Rendering without hydration issues
- Must work with React Server Components
- Should minimize runtime JavaScript overhead
- Should leverage our existing design token system (`@equinor/eds-tokens`)
- Developers must be able to customize and override styles
- Should be familiar to web developers (low learning curve)
- Must support theming (light/dark mode, density modes)

## Options Considered

### CSS Modules

Scoped CSS with automatic class name generation.

**Pros:**

- Automatic scoping prevents style collisions
- Works with SSR
- Familiar CSS syntax

**Cons:**

- Class name hashing makes debugging harder
- Harder to override styles from consuming applications
- Less flexible for theming compared to CSS custom properties

### Tailwind CSS

Utility-first CSS framework.

**Pros:**

- Rapid development with utility classes
- Small production bundle (purged unused styles)
- Works with SSR

**Cons:**

- Verbose className strings reduce readability
- Adds external dependency and build complexity
- Utility classes don't align well with design token architecture
- Harder for consumers to understand component styling

### Keep styled-components

Continue with current CSS-in-JS approach.

**Pros:**

- Team is already familiar with it
- Type-safe props-based styling
- Automatic scoping

**Cons:**

- SSR hydration issues with modern React frameworks
- Runtime overhead
- Uncertain future with React Server Components
- Project is now in maintenance mode with no new features planned

## Decision

We will use **vanilla CSS with CSS custom properties** for EDS 2.0 components.

Components will:

1. Import a co-located `.css` file (e.g., `button.css`)
2. Use CSS custom properties from `@equinor/eds-tokens` for all design values
3. Use `data-*` attributes for variant styling (e.g., `data-variant="primary"`)
4. Use CSS `@layer` for style encapsulation and specificity control
5. Follow BEM-inspired naming for CSS classes (e.g., `.eds-button`, `.field__label`)

Example pattern:

```tsx
// Button.tsx
import './button.css'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', ...rest }, ref) => (
    <button ref={ref} className="eds-button" data-variant={variant} {...rest} />
  ),
)
```

```css
/* button.css */
@layer eds-components {
  .eds-button {
    background: var(--eds-color-bg-fill-emphasis-default);
    padding: var(--eds-selectable-space-vertical)
      var(--eds-selectable-space-horizontal);
  }

  .eds-button[data-variant='secondary'] {
    background: transparent;
    border: 1px solid var(--eds-color-border-strong);
  }
}
```

### Consequences

- Good, because zero runtime JavaScript for styling gives better performance
- Good, because native SSR support means no hydration issues with Next.js App Router or RSC
- Good, because excellent debugging experience with browser DevTools
- Good, because CSS custom properties enable theming without re-rendering components
- Good, because it's familiar technology with lower learning curve for contributors
- Good, because it's future-proof and aligns with where the React ecosystem is heading
- Good, because smaller bundle size without CSS-in-JS runtime
- Bad, because requires discipline with naming conventions (BEM) and `@layer` for scoping
- Bad, because less type-safety for style values compared to TypeScript-based CSS-in-JS
- Bad, because consumers need to ensure CSS is imported in their applications
- Bad, because it's a breaking change from EDS 1.x requiring migration effort for consumers

### Confirmation

- Code reviews verify that new `/next` components use vanilla CSS, not styled-components
- All CSS files in `/next` must use `@layer eds-components` for encapsulation
- Design token usage is validated through existing token linting

## Related

- [styled-components maintenance mode announcement (March 2025)](https://opencollective.com/styled-components/updates/thank-you)
- [styled-components and Next.js App Router issues](https://github.com/styled-components/styled-components/issues/4025)
- [Next.js CSS-in-JS documentation](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)
- [@equinor/eds-tokens package](https://github.com/equinor/design-system/tree/main/packages/eds-tokens)
