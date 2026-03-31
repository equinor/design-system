# Typography approach for EDS 2.0

- **Status:** Proposed
- **Date:** 2026-03-31
- **Decision makers:** EDS core team

## Context

EDS 2.0 needs a coherent typography system covering font families, type scale, font weights, line-height, and text-box trimming. The system must work for both heading and body text, support density modes, and align text to a 4px baseline grid.

## Decision Drivers

- Text must align to a 4px baseline grid across all elements
- Font weights should account for optical sizing — larger text appears heavier and needs lighter numeric weights to achieve the same perceived emphasis
- Inline emphasis elements (`strong`, `em`) must automatically use the correct weight for their context (inherited font size)
- Line-height values must be from the token system, not browser defaults
- Typography must be drop-in via `elements.css` with no extra markup required

## Options Considered

### Option 1: Hardcoded font-weight values per element

Assign fixed numeric weights (e.g. `font-weight: 500`) to each element.

**Pros:**

- Simple to implement and understand

**Cons:**

- Ignores optical sizing — a `500` weight at `5xl` looks much heavier than at `lg`
- `strong` inside an `h1` would need separate targeting to get the right weight

### Option 2: Per-size font-weight tokens with context-aware inheritance

Use size-matched font-weight tokens at each heading/body level (`--eds-typography-header-5xl-font-weight-normal`), and expose pseudo-private `--_font-weight-bolder` / `--_font-weight-lighter` variables for inline elements to inherit.

**Pros:**

- Optically correct weights at every size level
- `strong` and other inline elements automatically resolve the right weight for their context via CSS inheritance — no extra markup
- Utility classes (`.eds-heading-bold`, `.eds-heading-light`) also resolve correctly regardless of heading level

**Cons:**

- Requires setting font-weight tokens on every heading and body level individually
- More verbose CSS

### Option 3: CSS `font-weight: bolder/lighter` keywords

Use the relative `bolder`/`lighter` keywords, which step up/down the weight relative to the inherited value.

**Pros:**

- Simple, no tokens needed

**Cons:**

- Steps are browser-defined and do not map to the EDS token scale
- No control over the specific numeric weight at each size

## Decision

Use **Option 2**. Each heading and body element sets:

1. `font-weight` using its size-matched token (e.g. `--eds-typography-header-5xl-font-weight-normal`)
2. `--_font-weight-bolder` and `--_font-weight-lighter` pseudo-private variables pointing to the corresponding bolder/lighter tokens

Inline elements (`strong`) consume `--_font-weight-bolder` via inheritance with a numeric fallback:

```css
:where(strong) {
  font-weight: var(--_font-weight-bolder, 500);
}
```

Utility classes `.eds-heading-bold` and `.eds-heading-light` work the same way, resolving to the correct weight for whatever heading level they are applied to.

For text-box trimming, the `@supports` progressive enhancement pattern is used:

```css
@supports (text-box: trim-both ex alphabetic) {
  padding-top: var(--padding-top-baseline);
  padding-bottom: var(--padding-bottom-baseline);
  text-box: trim-both ex alphabetic;
}
/* enhancement: Chrome/Edge 128+ (@function support) */
@supports (text-box: trim-both ex alphabetic) {
  padding-top: --padding-top(--mode: baseline);
  padding-bottom: --padding-bottom(--mode: baseline);
  text-box: trim-both ex alphabetic;
}
```

Two typefaces are used: **Equinor** for headings, **Inter** for body text and UI.

### Consequences

- Good: Optically correct font weights across the full type scale
- Good: `strong` and utility classes automatically adapt to their context — no targeting by heading level
- Good: Text aligns to 4px grid via text-box trimming with progressive enhancement
- Bad: Every heading and body element must explicitly set font-weight tokens — no shorthand
- Bad: The pseudo-private variable pattern is non-obvious to contributors unfamiliar with CSS inheritance

## Related

- [ADR-0002: Use vanilla CSS with design tokens for EDS 2.0](0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
- [ADR-0004: Spacing approach for EDS 2.0](0004-spacing-approach-for-eds-2.md)
