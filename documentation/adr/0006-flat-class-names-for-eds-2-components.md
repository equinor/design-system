# Flat CSS class names for EDS 2.0 components

- **Status:** Accepted
- **Date:** 2026-06-29
- **Decision makers:** EDS Core Team

## Context

The architectural direction for EDS 2.0 was established in [discussion #4639](https://github.com/equinor/design-system/discussions/4639), which argued that modern CSS features (nesting, `@layer`, `:has()`, custom properties) replace the workarounds that methodologies like BEM were built to provide. One of its conclusions was: **one root selector, nesting for everything else** — with BEM explicitly removed from the Stylelint config.

[ADR 0002](0002-use-vanilla-css-with-design-tokens-for-eds-2.md) codified the move to vanilla CSS but retained "BEM-inspired naming" as a placeholder. Early components (Radio, Checkbox, Input, Field, Switch, TextField, Banner) were built before the convention fully settled, resulting in class names like `.eds-field__label`, `.eds-radio__icon-wrapper`, and `.eds-checkbox--standalone`.

As more components were built and the architecture matured, the BEM approach showed practical drawbacks:

- **Verbose class names** — `.eds-radio__icon--checked` adds noise in the DOM with little benefit when CSS nesting already provides scoping.
- **Modifier classes duplicate data attributes** — EDS 2.0 already uses `data-*` attributes for variants and states (e.g., `data-variant`, `data-disabled`). BEM modifiers like `--standalone` or `--checked` created a parallel, inconsistent state-signalling system.
- **Cross-component leakage** — Components that composed Field (Radio, Checkbox, Switch) reached into Field's internals via `.eds-field__label`, creating brittle selector coupling across component boundaries.

Newer components (Button, Chip, Badge, Avatar) were built following the flat approach from discussion #4639 and proved easier to read, maintain, and style.

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

This approach is aligned with [CUBE CSS blocks](https://cube.fyi/block.html#no-formal-element-syntax), which explicitly avoids formal element syntax: the parent block class provides the namespace, so inner selectors can be simple (`.icon-wrapper`, `label`, `img`) without encoding hierarchy in their names.

**Pros:**

- Clean, readable DOM — `<span class="icon-wrapper">` instead of `<span class="eds-radio__icon-wrapper">`
- Consistent with the existing `data-*` attribute convention for variants
- CSS nesting provides scoping without encoding hierarchy in the name
- Aligns with the architectural direction set in [discussion #4639](https://github.com/equinor/design-system/discussions/4639)

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

### Native element selectors vs flat class names

CUBE CSS blocks allow targeting native elements directly within the block scope (e.g., `& p`, `& img`) rather than adding a class to every inner element. This is fine where an element is semantically stable, unique within the component, and not something consumers need to target. However, flat class names are preferred for most inner elements because they give consumers a stable, documented surface to hook into — e.g., to apply Tailwind utilities or custom CSS. Removing a class from an inner element is a breaking change; changing an element tag is not. When in doubt, use a class.

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

- [Discussion #4639 — Designing with CSS, not around it](https://github.com/equinor/design-system/discussions/4639) — architectural direction that established "one root selector, nesting for everything else" and removed BEM from the Stylelint config
- [CUBE CSS — Block: No formal element syntax](https://cube.fyi/block.html#no-formal-element-syntax) — the methodology whose block convention this approach is inspired by
- [ADR 0002](0002-use-vanilla-css-with-design-tokens-for-eds-2.md) — establishes vanilla CSS; this ADR supersedes the BEM-naming section
- [ADR 0004](0004-component-conventions-for-eds-2.md) — `data-*` attributes for variants and density
- [GitHub issue #5104](https://github.com/equinor/design-system/issues/5104) — migration of existing BEM components
