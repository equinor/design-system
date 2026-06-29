# Flat CSS class names for EDS 2.0 components

- **Status:** Accepted
- **Date:** 2026-06-29
- **Decision makers:** EDS Core Team

## Context

[ADR 0002](0002-use-vanilla-css-with-design-tokens-for-eds-2.md) established vanilla CSS with design tokens as the styling approach for EDS 2.0 and mentioned "BEM-inspired naming" as the class naming convention. Early components (Radio, Checkbox, Input, Field, Switch, TextField, Banner) were built following BEM, resulting in class names like `.eds-field__label`, `.eds-radio__icon-wrapper`, and `.eds-checkbox--standalone`.

As more components were built and the component architecture matured, the BEM approach showed practical drawbacks:

- **Verbose class names** — `.eds-radio__icon--checked` adds noise in the DOM with little benefit when CSS nesting already provides scoping.
- **Modifier classes duplicate data attributes** — EDS 2.0 already uses `data-*` attributes for variants and states (e.g., `data-variant`, `data-disabled`). BEM modifiers like `--standalone` or `--checked` created a parallel, inconsistent state-signalling system.
- **Cross-component leakage** — Components that composed Field (Radio, Checkbox, Switch) reached into Field's internals via `.eds-field__label`, creating brittle selector coupling across component boundaries.

Newer components (Button, Chip, Badge, Avatar) were built with a simpler flat approach and proved easier to read, maintain, and style.

## Decision Drivers

- Class names should be easy to read in DOM/DevTools without sacrificing scoping
- Variants and states should be expressed consistently via `data-*` attributes, not modifier classes
- Cross-component CSS selectors should not depend on another component's internal class names
- Convention should be consistent across all `/next` components

## Options Considered

### Option 1: Keep BEM

Continue with `.eds-{component}__{element}--{modifier}` naming.

**Pros:**

- Familiar to many CSS developers
- Self-documenting hierarchy in class names

**Cons:**

- Verbose and redundant when CSS nesting already scopes inner elements
- Modifiers overlap with existing `data-*` attribute convention
- Long class names obscure the DOM

### Option 2: Flat class names with CSS nesting

`eds-`-prefixed root class only. Inner elements use short, descriptive flat names scoped by CSS nesting. Modifiers/variants use `data-*` attributes.

**Pros:**

- Clean, readable DOM — `<span class="icon-wrapper">` instead of `<span class="eds-radio__icon-wrapper">`
- Consistent with the existing `data-*` attribute convention for variants
- CSS nesting provides scoping without encoding hierarchy in the name

**Cons:**

- Breaking change for consumers who target internal classes in their own CSS
- Generic names like `.label` or `.icon` could theoretically clash with consumer styles (mitigated by nesting under the `eds-`-prefixed root)

## Decision

We will use **flat class names scoped by CSS nesting** for all EDS 2.0 `/next` components.

### Rules

1. **Root class** — one `eds-`-prefixed class per component (e.g., `.eds-button`, `.eds-radio`). Applied to the outermost element.
2. **Inner elements** — simple, descriptive flat names (e.g., `.label`, `.icon-wrapper`, `.track`). No component prefix. Scoped in CSS by nesting inside the root class.
3. **Variants and states** — always `data-*` attributes, never modifier classes (e.g., `data-standalone`, `data-variant="primary"`, `data-disabled`).
4. **Pseudo-private CSS variables** — component-internal variables use the `--_` prefix (e.g., `--_icon-color`).
5. **Cross-component selectors** — target native HTML elements (e.g., `label`) rather than another component's internal class names.

### Example

```tsx
// Radio.tsx — standalone variant uses data attribute, not modifier class
<span className="eds-radio" data-standalone={true}>
  <input className="input" type="radio" />
  <span className="icon-wrapper">
    <Icon className="icon icon-checked" />
    <Icon className="icon icon-unchecked" />
  </span>
</span>
```

```css
/* radio.css */
@layer eds-components {
  .eds-radio {
    & .icon-wrapper { … }
    & .input { … }
    & .icon-checked { display: none; }
    & .icon-unchecked { display: block; }
    &:has(.input:checked) .icon-checked { display: block; }
    &:has(.input:checked) .icon-unchecked { display: none; }
  }
}
```

### Consequences

- Good, because the DOM is cleaner and easier to read in DevTools
- Good, because variants and states are expressed through a single, consistent `data-*` system
- Good, because components are decoupled — no component's CSS depends on another's internal class names
- Good, because it aligns with the pattern already used by Button, Chip, Badge, and Avatar
- Bad, because it is a breaking change for consumers who target internal class names directly in their own CSS; those consumers must update their selectors

### Confirmation

- Code reviews verify new `/next` components use flat inner class names and `data-*` attributes for variants
- The `eds-component.md` rule file loaded by Claude Code in `.claude/rules/` references this convention
- AGENTS.md documents the convention under the **CSS** section

## Related

- [ADR 0002](0002-use-vanilla-css-with-design-tokens-for-eds-2.md) — establishes vanilla CSS; this ADR supersedes the BEM-naming section
- [ADR 0004](0004-component-conventions-for-eds-2.md) — `data-*` attributes for variants and density
- [GitHub issue #5104](https://github.com/equinor/design-system/issues/5104) — migration of existing BEM components
