# Typography approach for EDS 2.0 web, with one font weight per role

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision makers:** Frida Erdal, EDS core team
- **Scope:** Web

> **Draft: two questions to settle before acceptance.**
>
> 1. **Text-box trim.** ADR-0018 decided an `@supports` trim pattern for the web. [ADR-0027](./0027-token-variable-architecture-typography-roles.md), like ADR-0007 before it, keeps trim out of the token set, and every Figma text style has trim set to None. This draft carries ADR-0018's pattern over so the question stays visible. Should the implementation trim on the web when the Figma styles do not?
> 2. **`.eds-heading-bold` and `.eds-heading-light`.** ADR-0018 defined these utilities to resolve to a heading's per-size bolder and lighter weights. Headers now have one weight, Medium (500). Should the utilities map to `font-weight/bold` (700) and `font-weight/lighter` (300), be renamed, or be dropped?

## Context

This record supersedes [ADR-0018](./0018-typography-approach-for-eds-2.md). [ADR-0027](./0027-token-variable-architecture-typography-roles.md) restructured the typography tokens into three roles, `header` (Equinor), `label` and `body` (Inter), and gave each role a fixed set of weights instead of weights that vary by size: header is Medium (500) at every size, label has normal (400), medium (500) and bold (700), body has normal and bold. ADR-0018's weight model, size-matched weight tokens with an inherited `--_font-weight-bolder`, has nothing left to resolve. Accepted records are not edited, and the template asks for a full replacement, so this record restates what ADR-0018 decided that still applies and replaces the weight model.

As in ADR-0018: EDS 2.0 needs a coherent typography system covering font families, type scale, font weights, line-height, and text-box trimming. The system must work for both heading and body text, support density modes, and align text to a 4px baseline grid.

ADR-0018 also aimed for optically correct weights, lighter numbers at larger sizes. ADR-0027 drops that: a `4xl` header uses the same Medium as an `md` header. That is a design decision recorded there; this record implements it.

No implementation follows the redefined typography tokens yet. The current `/next` typography CSS, `elements.css` and the component styles, still uses the 2.x token names and ADR-0018's per-size weight model. It is out of date and is not a reference for this record. This record describes the target that the typography implementation builds to.

## Decision Drivers

- Text must align to a 4px baseline grid across all elements
- Inline emphasis (`strong`) must be visibly heavier than the text around it, in every role, without per-context targeting
- Weights, sizes and line-heights must come from the semantic tokens, not browser defaults or literal numbers
- Typography must be drop-in via the element defaults stylesheet (`elements.css`), with no extra markup required

## Options Considered

### Option 1: Hardcoded font-weight values per element

Assign fixed numeric weights (e.g. `font-weight: 500`) to each element.

**Pros:**

- Simple to implement and understand

**Cons:**

- Bypasses the token system: a weight change in Tokens Studio would not reach the CSS

### Option 2: Per-size font-weight tokens with context-aware inheritance (ADR-0018's decision)

Use size-matched font-weight tokens at each heading/body level (`--eds-typography-header-5xl-font-weight-normal`), and expose pseudo-private `--_font-weight-bolder` / `--_font-weight-lighter` variables for inline elements to inherit.

**Pros:**

- `strong` and other inline elements automatically resolve the right weight for their context via CSS inheritance — no extra markup

**Cons:**

- The redefined token set has no per-size weights to point at: weight is one token per role (ADR-0027)
- Requires setting font-weight tokens on every heading and body level individually, and the pseudo-private pattern is non-obvious to contributors

### Option 3: CSS `font-weight: bolder/lighter` keywords

Use the relative `bolder`/`lighter` keywords, which step up/down the weight relative to the inherited value.

**Pros:**

- Simple, no tokens needed

**Cons:**

- Steps are browser-defined and do not map to the EDS token scale
- No control over the specific numeric weight at each size

### Option 4: One semantic weight token per role, `strong` = bold (chosen)

Each element sets the weight token its role prescribes, and `strong` uses `font-weight/bold` everywhere.

**Pros:**

- Matches the token structure in ADR-0027 one to one
- `strong` needs no context: bold (700) is heavier than every role's default weight

**Cons:**

- Inside text that is already bold (`label/*/bold`, `body/*/bold`), `strong` shows no difference

## Decision

Use **Option 4**.

1. **Each element sets its role's weight from the semantic tokens.** Heading elements use `--eds-font-weight-medium`. Body and label elements use `--eds-font-weight-normal` by default, and `--eds-font-weight-medium` or `--eds-font-weight-bold` where a medium or bold variant applies.
2. **Inline emphasis uses bold in every role:**

   ```css
   :where(strong) {
     font-weight: var(--eds-font-weight-bold, 700);
   }
   ```

   Equinor and Inter are both loaded as variable fonts covering weights 1–999, so 700 renders without synthesised bold, in headers too.

3. **No per-size weight tokens and no `--_font-weight-bolder` / `--_font-weight-lighter` pseudo-private variables.** The implementation sets weights only from the semantic weight tokens.
4. **Utility classes** `.eds-heading-bold` and `.eds-heading-light`: open, see the questions at the top.

### Extension: font-family, font-size, line-height

The CSS-first principle from ADR-0018 is unchanged. Components in `/next` set `font-family`, `font-size`, `line-height` and `font-weight` directly in their CSS using per-role semantic tokens. With the redefined tokens these are `--eds-typography-{header,label,body}-{size}-{font-size,line-height}`, `--eds-font-family-{header,ui}` and `--eds-font-weight-{normal,medium,bold}`. Nothing uses these names yet: the current `/next` CSS is on the 2.x token names, and the implementation that follows this record replaces it ([#5119](https://github.com/equinor/design-system/issues/5119)). The `data-font-family` / `data-font-size` / `data-line-height` runtime-switching mechanism is reserved for `elements.css` defaults and ad-hoc consumer markup — a component's own elements should not carry these attributes, because the size and role are part of the component's design and are encoded in the token name. [`packages/eds-tokens/instructions/typography.md`](../../packages/eds-tokens/instructions/typography.md) describes both paths for the 2.x token shape and needs to follow this record.

Which role to use: `header` for titles, `label` for single-line functional text (buttons, navigation, table cells, form labels, captions), `body` for running text that wraps.

### Text-box trimming

Carried over from ADR-0018 unchanged, pending question 1 at the top. For text-box trimming, the `@supports` progressive enhancement pattern is used:

```css
/* Base — all browsers */
padding-block: var(--eds-selectable-space-vertical);

/* Enhancement — trims whitespace to cap-height/alphabetic baseline */
@supports (text-box: trim-both ex alphabetic) {
  padding-top: var(--padding-top-baseline);
  padding-bottom: 0;
  text-box: trim-both ex alphabetic;
}
```

CSS `@function` (Chrome/Edge 128+) can replace the custom property approach once Safari ships support — the logic is identical but computed at the CSS layer rather than pre-calculated.

Two typefaces are used: **Equinor** for the `header` role, **Inter** for `label` and `body`.

### Consequences

- Good, because the web weights map one to one onto the semantic weight tokens, so a weight change in Tokens Studio reaches the CSS without per-size bookkeeping.
- Good, because `strong` has one rule and no inheritance chain to understand.
- Good, because the pseudo-private variable pattern, which ADR-0018 noted was non-obvious to contributors, goes away.
- Bad, because weights are no longer optically compensated: a large header looks heavier than a small one at the same Medium (ADR-0027 accepts this).
- Bad, because `strong` inside already-bold text has no visible effect.
- Bad, because the existing `/next` typography CSS is built on the 2.x token names and ADR-0018's per-size weights, so the implementation replaces it rather than adjusting it.

## Related

- Supersedes [ADR-0018](./0018-typography-approach-for-eds-2.md)
- [ADR-0027](./0027-token-variable-architecture-typography-roles.md): the typography roles and weights this record implements on the web
- [ADR-0002: Use vanilla CSS with design tokens for EDS 2.0](0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
- [ADR-0017: Spacing approach for EDS 2.0](0017-spacing-approach-for-eds-2.md)
- [#5530](https://github.com/equinor/design-system/issues/5530): typography restructure; [#5119](https://github.com/equinor/design-system/issues/5119): component migration
