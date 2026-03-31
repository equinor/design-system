# Spacing approach for EDS 2.0

- **Status:** Proposed
- **Date:** 2026-03-31
- **Decision makers:** EDS core team

## Context

EDS 2.0 components and element styles need a consistent spacing system that works across density modes, aligns to a 4px baseline grid, and does not rely on magic numbers. The system must handle both layout spacing (between components) and inset spacing (padding within components).

## Decision Drivers

- Spacing must align to a 4px baseline grid
- Spacing must adapt to density modes (`spacious`, `comfortable`) without per-component overrides
- Padding inside components must not interfere with text-box trimming — spacing and baseline offsets must be combined via `calc()`
- The first element in a container should not push away from the container edge (spacing before, not after)
- Spacing values should come from EDS tokens, not hardcoded numbers

## Options Considered

### Option 1: Data-attribute driven spacing (runtime)

Components and elements receive spacing via data-attributes (`data-selectable-space`, `data-space-proportions`) that resolve to CSS custom properties at runtime.

**Pros:**

- Maximum flexibility — any element can be given any spacing
- Easy to override per-instance in the markup

**Cons:**

- Requires authors to add data-attributes to every element
- `elements.css` is meant to be drop-in — adding attributes to `th`, `td`, `caption` etc. defeats the purpose
- Attributes create implicit coupling between markup and the variables file

### Option 2: Resolved tokens directly in component CSS

Trace the token chain from data-attributes to their resolved values and use those final tokens directly in component/element CSS.

**Pros:**

- Drop-in: no data-attributes needed on semantic elements
- Clear, explicit values — easy to audit and override
- `elements.css` works out of the box

**Cons:**

- Less flexible — changing spacing requires a CSS change, not a markup attribute
- Token names are longer and more specific (e.g. `--eds-spacing-inset-md-horizontal`)

### Option 3: Generic spacing scale (non-semantic)

Use a simple numeric scale (4px, 8px, 12px…) without token aliases.

**Pros:**

- Simple and familiar

**Cons:**

- Breaks token contract — spacing is no longer tied to density or the design system

## Decision

Use **Option 2** for `elements.css` base styles: resolve the token chain and use final tokens directly. Data-attribute driven spacing (Option 1) remains valid for component variants and interactive elements like `Button` where per-instance control is needed.

For spacing direction: **spacing before, not after** (`padding-top` / `margin-top`). The first element in a container should not push away from the container edge.

For elements with text-box trimming, padding must be combined with the baseline offset using `calc()`:

```css
@supports (text-box: trim-both ex alphabetic) {
  padding-top: calc(var(--eds-spacing-vertical-sm) + var(--padding-top-baseline));
  padding-bottom: 0;
  text-box: trim-both ex alphabetic;
}
```

### Consequences

- Good: `elements.css` is truly drop-in — no data-attributes required on semantic HTML
- Good: Spacing aligns to the 4px grid and responds to density automatically via the token system
- Good: Baseline trimming and inset spacing compose cleanly via `calc()`
- Bad: Changing spacing for a specific element size requires editing CSS rather than markup
- Bad: Token names in `elements.css` are more verbose and harder to read at a glance

## Related

- [ADR-0002: Use vanilla CSS with design tokens for EDS 2.0](0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
- [ADR-0005: Typography approach for EDS 2.0](0005-typography-approach-for-eds-2.md)
