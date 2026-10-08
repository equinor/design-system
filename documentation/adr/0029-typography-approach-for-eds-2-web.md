# Typography approach for EDS 2.0 web, with weights that do not vary by size

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision makers:** Frida Erdal (Tech Lead), Edvard Bjørgen (Design Lead), EDS Core Team
- **Scope:** Web

## Context

This record supersedes [ADR-0018](./0018-typography-approach-for-eds-2.md). [ADR-0027](./0027-token-variable-architecture-typography-roles.md) restructured the typography tokens into three roles, `header` (Equinor), `label` and `body` (Inter), and gave each role a fixed set of weights instead of weights that vary by size: header is Medium (500) at every size, label has normal (400), medium (500) and bold (700), body has normal and bold. ADR-0018's weight model, size-matched weight tokens with an inherited `--_font-weight-bolder`, has nothing left to resolve. Accepted records are not edited, and the template asks for a full replacement, so this record restates what ADR-0018 decided that still applies, replaces the weight model, and drops two things ADR-0018 decided: text-box trimming and the `.eds-heading-bold` / `.eds-heading-light` utility classes.

As in ADR-0018, with text-box trimming taken out: EDS 2.0 needs a coherent typography system covering font families, type scale, font weights and line-height. The system must work for both heading and body text, support density modes, and keep text on a 4px grid.

ADR-0018 also aimed for optically correct weights, with lower weight numbers at larger sizes. ADR-0027 drops that: a text style keeps one weight at every size, so a `4xl` header uses the same Medium as an `md` header. The weight decision is ADR-0027's and this record implements it. ADR-0027 does not discuss optical compensation, so the trade-off is stated here, under Consequences.

ADR-0018 trimmed text to the cap height and alphabetic baseline with `text-box`, behind `@supports`. ADR-0027, like ADR-0007 before it, keeps trim out of the token set: every Figma text style has trim set to None, and line-height is never adjusted to compensate. ADR-0007 also expected component padding to be redone without trim (the "repad" work in [#5119](https://github.com/equinor/design-system/issues/5119)).

Nothing in `/next` follows the redefined typography tokens yet. Its typography CSS, `elements.css` and the component styles, still uses the 2.x token names and ADR-0018's per-size weight model. It is out of date and is not a reference for this record. This record describes the target that the typography implementation builds to.

## Decision Drivers

- Line boxes must sit on a 4px grid across all elements
- Text in `<strong>` and `<b>` must be heavier than normal (400) and medium (500) text, without per-context targeting
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

Use size-matched font-weight tokens at each heading/body level (`--eds-typography-header-5xl-font-weight-normal`), and expose pseudo-private weight variables, such as `--_font-weight-bolder`, for inline elements to inherit.

**Pros:**

- `strong` and other inline elements automatically resolve the right weight for their context via CSS inheritance — no extra markup

**Cons:**

- The redefined token set has no per-size weights to point at: each role uses a fixed set of the shared `font-weight/*` tokens (ADR-0027)
- Requires setting font-weight tokens on every heading and body level individually, and the pseudo-private pattern is non-obvious to contributors

### Option 3: The CSS `font-weight: bolder` keyword

Use the relative `bolder` keyword, which steps the weight up relative to the inherited value. This is what browsers do when no rule is set: the HTML rendering rules give `b, strong { font-weight: bolder; }`.

**Pros:**

- Simple, no tokens needed
- From the normal (400) and medium (500) defaults it steps to 700, the same weight as bold

**Cons:**

- The steps come from a fixed table in CSS Fonts 4, not from the tokens, so a weight change in Tokens Studio would not reach `<strong>` or `<b>`
- Inside bold text it steps to 900, a weight the token scale does not have

### Option 4: Shared semantic weight tokens, `<strong>` and `<b>` = bold (chosen)

Each element sets the weight tokens its role prescribes, and text in `<strong>` or `<b>` resolves to `font-weight/bold` (700).

**Pros:**

- Matches the token structure in ADR-0027 one to one
- `<strong>` and `<b>` need no context: bold (700) is heavier than normal (400) and medium (500)

**Cons:**

- Inside text that is already bold (`label/*/bold`, `body/*/bold`), `<strong>` and `<b>` show no difference

## Decision

Use **Option 4**.

1. **Each element sets its role's weight from the semantic tokens.** Heading elements use `--eds-font-weight-medium`. Label elements use `--eds-font-weight-normal` by default, and `--eds-font-weight-medium` or `--eds-font-weight-bold` for the medium and bold text styles. Body elements use `--eds-font-weight-normal` by default and `--eds-font-weight-bold` for the bold text style.
2. **Text wrapped in the `<strong>` or `<b>` HTML element resolves to `font-weight: 700`,** through the `font-weight/bold` token, whatever text surrounds it. The `<strong>` rule was decided in [#5530](https://github.com/equinor/design-system/issues/5530#issuecomment-6036525225), and `<b>` was [decided](https://github.com/equinor/design-system/issues/5530#issuecomment-6059203328) to resolve the same way:

   ```css
   :where(strong, b) {
     font-weight: var(--eds-font-weight-bold, 700);
   }
   ```

   The EDS variable font stylesheet (`eds-uprights-vf.css`) loads both typefaces as variable fonts. Equinor's weight axis runs from 300 to 700 and Inter's from 100 to 900, so 700 renders as each font's own Bold without synthesised bold, in headers too.

3. **No per-size weight tokens and no pseudo-private weight variables such as `--_font-weight-bolder`.** The implementation sets weights only from the semantic weight tokens.
4. **No `.eds-heading-bold` or `.eds-heading-light` utility classes.** ADR-0018 defined them to resolve to a heading's per-size alternative weights. Headers now have one weight, Medium (500), and ADR-0027 treats CSS utility classes as a post-v1 nice-to-have, so the two classes are dropped.

### Extension: font-family, font-size, line-height

The CSS-first principle from ADR-0018 is unchanged. Components in `/next` set `font-family`, `font-size`, `line-height` and `font-weight` directly in their CSS using per-role semantic tokens. With the redefined tokens these are `--eds-typography-{header,label,body}-{size}-{font-size,line-height}`, `--eds-font-family-{header,ui}` and `--eds-font-weight-{normal,medium,bold}`. No `/next` code uses these names yet: the current `/next` CSS is on the 2.x token names, and the implementation that follows this record replaces it ([#5119](https://github.com/equinor/design-system/issues/5119)). The `data-font-family` / `data-font-size` / `data-line-height` runtime-switching mechanism is reserved for `elements.css` defaults and ad-hoc consumer markup — a component's own elements should not carry these attributes, because the size and role are part of the component's design and are encoded in the token name. [`packages/eds-tokens/instructions/typography.md`](../../packages/eds-tokens/instructions/typography.md) describes both paths for the 2.x token shape and needs to follow this record.

Two typefaces are used: **Equinor** for the `header` role, **Inter** for `label` and `body`. Which role to use for which text is defined in [ADR-0027](./0027-token-variable-architecture-typography-roles.md), point 6.

### Text-box trimming

ADR-0018's `@supports` trim pattern is dropped, and the web does not trim text. The Figma text styles have trim set to None (ADR-0027), and the web renders the same line box: no `text-box` trim, and no line-height or padding adjusted to compensate for trimming. Text stays on the 4px grid through the line-height tokens, which are all multiples of 4px. Component padding is set for untrimmed text, as part of the repad work in [#5119](https://github.com/equinor/design-system/issues/5119).

### Consequences

- Good, because the web weights map one to one onto the semantic weight tokens, so a weight change in Tokens Studio reaches the CSS without per-size bookkeeping.
- Good, because `<strong>` and `<b>` share one rule, with no inheritance chain to understand.
- Good, because the pseudo-private variable pattern, which ADR-0018 noted was non-obvious to contributors, goes away.
- Good, because web text has the same line box as the Figma text styles.
- Bad, because weights are no longer optically compensated: a large header looks heavier than a small one at the same Medium. This follows from ADR-0027's one weight at every size, which it does not discuss as a trade-off.
- Bad, because `<strong>` and `<b>` inside already-bold text have no visible effect.
- Bad, because components that were padded for trimmed text need new padding for the full line box (#5119).
- Bad, because markup that uses `.eds-heading-bold` or `.eds-heading-light` no longer changes the heading's weight.
- Bad, because the existing `/next` typography CSS is built on the 2.x token names and ADR-0018's per-size weights, so the implementation replaces it rather than adjusting it.

## Related

- Supersedes [ADR-0018](./0018-typography-approach-for-eds-2.md)
- [ADR-0027](./0027-token-variable-architecture-typography-roles.md): the typography roles and weights this record implements on the web
- [ADR-0028](./0028-token-code-output-architecture-typography-roles.md): the token output, its naming and the published contract that the names above come from
- [ADR-0002: Use vanilla CSS with design tokens for EDS 2.0](0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
- [ADR-0017: Spacing approach for EDS 2.0](0017-spacing-approach-for-eds-2.md)
- [#5530](https://github.com/equinor/design-system/issues/5530): typography restructure, with the `<strong>` decision in [its decision comment](https://github.com/equinor/design-system/issues/5530#issuecomment-6036525225) and the `<b>`, trim and utility-class decisions in [the web decisions comment](https://github.com/equinor/design-system/issues/5530#issuecomment-6059203328); [#5119](https://github.com/equinor/design-system/issues/5119): component migration
