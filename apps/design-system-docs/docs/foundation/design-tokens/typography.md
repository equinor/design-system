import TypeSpecimen from '@site/src/components/TypeSpecimen'

# Typography

Typography presents hierarchy and organises information as clearly and efficiently as possible. In EDS 2.0 it does more than that — type is also the **minimum spacing unit** the rest of the system is built on. Padding, gap, line-height and component height all derive from the active text size.

## Principles

EDS 2.0 typography rests on four principles. They sit underneath every decision about size, weight, line-height and alignment.

### To ensure safety – legibility always comes first

When it comes to typography, ensuring safety is our main goal, and we make sure of it through legibility. Anything that compromises a user's ability to read accurately and quickly is a regression, no matter how much it improves on other axes.

### We build from the inside to the outside

We build from our minimal unit — the text — and from there we define spatial proportions for paddings, line-heights and gaps that ensure harmony. Spacing isn't decided in isolation; it follows from the text it surrounds.

### Visual alignment over metric alignment

All our metrics are ruled by the need to create harmony. By creating harmonic visual rhythms in interfaces we make them easier to use. When the numbers and the eye disagree, the eye wins.

### A balance between flexibility and rigidity

We search for a balance of options that avoids decision paralysis but still gives teams enough freedom to express their specific needs. The system is opinionated where consistency matters, and open where context varies.

## Typefaces

EDS 2.0 uses two typefaces, each with a clear job:

| Context          | Typeface                     |
| ---------------- | ---------------------------- |
| UI labels & body | **Inter** (variable)         |
| Headings         | **Equinor** (brand typeface) |

Inter covers all UI text — button labels, form fields, captions, prose. Equinor is reserved for display headings. Equinor is rendered slightly larger at every step than Inter — its shorter x-height needs a small upward bump so headings and surrounding UI text feel optically equivalent.

### Specimens

The same modular scale drives both typefaces. Spacious density (`lg` = 16 px) shown.

<TypeSpecimen />

### Loading fonts

To use EDS components correctly, you must load both font families. The recommended approach is the EDS variable font stylesheet, which includes both Equinor and Inter:

```html
<link
  rel="stylesheet"
  href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css"
/>
```

:::warning eds-uprights-vf.css required for EDS 2.0 components
The older `equinor-font.css` stylesheet only includes the Equinor font. If you use EDS 2.0 (`next`) components with only `equinor-font.css`, UI components like Button and TextField will fall back to a generic sans-serif because the Inter font is missing.
:::

## The modular type scale

Too many type sizes cause confusion. EDS 2.0 uses a single modular scale with ten steps from `xs` to `6xl`, anchored at `lg`. Steps follow a geometric progression — five steps per octave (`pow(2, n/5)`) — so consecutive sizes always feel like the same kind of jump.

| Step  | Multiplier       | Spacious (lg = 16px) |
| ----- | ---------------- | -------------------- |
| `xs`  | ×2^(−3/5) ≈ 0.66 | 0.65625rem (10.5px)  |
| `sm`  | ×2^(−2/5) ≈ 0.76 | 0.75rem (12px)       |
| `md`  | ×2^(−1/5) ≈ 0.87 | 0.875rem (14px)      |
| `lg`  | ×1               | 1rem (16px)          |
| `xl`  | ×2^(1/5) ≈ 1.15  | 1.15625rem (18.5px)  |
| `2xl` | ×2^(2/5) ≈ 1.32  | 1.3125rem (21px)     |
| `3xl` | ×2^(3/5) ≈ 1.52  | 1.53125rem (24.5px)  |
| `4xl` | ×2^(4/5) ≈ 1.74  | 1.75rem (28px)       |
| `5xl` | ×2^(5/5) = 2     | 2rem (32px)          |
| `6xl` | ×2^(6/5) ≈ 2.30  | 2.3125rem (37px)     |

:::warning Reserve `xs` for decoration
At spacious density `xs` is 10.5 px and at comfortable it falls to ~9 px — below the practical WCAG 2.1 SC 1.4.4 minimum for readable body text. Use it for decorative or supplementary labels (badges, captions on dense visualisations), never for body copy or primary content.
:::

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-foundation-typography--ui-text"
  width="100%"
  height="520"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-foundation-typography--ui-text)

_Demo shows `xs`–`3xl`; the full scale extends to `6xl`._

## Density

The whole scale shifts when density changes — only the `--_base` value moves; every derived size and line-height re-derives automatically.

| Density            | Base  |
| ------------------ | ----- |
| Spacious (default) | 16 px |
| Comfortable        | 14 px |

Density is applied by setting `data-density` on an ancestor element. Components within that ancestor then read the cascaded base. The cascade reaches every typography axis (`font-size`, `line-height`, `tracking`, `font-weight`), so a single `data-density` is enough — you don't need to set `data-font-size` or other axes on individual components.

```html
<div data-density="comfortable">
  <!-- everything here uses the comfortable scale -->
</div>
```

:::info Accessibility
When you opt into `comfortable`, give users a way to switch back to `spacious`. Smaller default text shouldn't be a one-way door.
:::

## Line-height: default vs. squished

Every size step has two line-height variants. Pick the one that matches what the text is doing, not the size it happens to be.

- **`squished`** — tight leading for UI controls. Use this wherever text sits inside a component (buttons, inputs, badges, tabs). The reduced line-height keeps controls compact without sacrificing single-line legibility.
- **`default`** — comfortable leading for reading. Use this for body copy, descriptions, tooltips, and any text that may wrap to multiple lines.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-foundation-typography--long-form-text"
  width="100%"
  height="640"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-foundation-typography--long-form-text)

_Demo shows `xs`–`3xl`; the full scale extends to `6xl`._

<details>
<summary>Line-height multipliers per step</summary>

The multiplier decreases as font size increases, following an ease-out cubic curve — `1.39 − pow(n/9, 3) × 0.29` for default and `1.13 − pow(n/9, 3) × 0.13` for squished, where `n` is the step index (0 = `xs`, 9 = `6xl`). Reduction is barely perceptible at small sizes and accelerates toward the top of the scale, keeping large display text optically tight without compressing body copy.

| Step  | Default ≈ | Squished ≈ |
| ----- | --------- | ---------- |
| `xs`  | 1.39      | 1.13       |
| `sm`  | 1.39      | 1.13       |
| `md`  | 1.39      | 1.13       |
| `lg`  | 1.38      | 1.13       |
| `xl`  | 1.36      | 1.12       |
| `2xl` | 1.34      | 1.11       |
| `3xl` | 1.30      | 1.09       |
| `4xl` | 1.25      | 1.07       |
| `5xl` | 1.19      | 1.04       |
| `6xl` | 1.10      | 1.00       |

</details>

### Paragraph length

For prose, line length should sit between **55–80 characters** including spaces. Shorter lines force the eye to jump too often, breaking the reading rhythm; longer lines make it hard to find the next line in a large block of text.

## Baseline-grid alignment

EDS 2.0 treats single-line and multi-line text differently.

**Single-line UI text is _not_ snapped to the baseline grid.** The component derives its height from cap-height (`1cap`) rounded to the nearest 4 px, then distributes the remaining line-height symmetrically as padding. This keeps element height predictable and optically centred regardless of font.

**Multi-line text uses baseline trimming** (`text-box: trim-both ex alphabetic`). The top of the text block aligns to the baseline grid, so wrapping content sits consistently alongside other elements.

:::danger Anti-pattern: multi-line button labels
Multi-line button labels are harder to scan and weaker as call-to-action elements. Shorten the label instead. The `multiline` prop on Button is a safety valve, not a design choice.
:::

## Categorisation: where text lives

The system categorises every piece of UI by what surrounds the text. The category controls how the text is aligned vertically.

- **Elements** — Headings and body copy. Aligned to the baseline grid.
- **Selectables** — Anything clickable that contains a single line of text: chips, buttons, autocomplete, search, text fields, menu items, list items, labels, breadcrumbs, pagination. **Vertically centred** to the UI control.
- **Containers** — Popovers, tables, cards, side sheets, accordions, banners, dialogs and similar surfaces. Aligned to the baseline grid.
- **Pages** — Top-level groups of containers (the main content area excluding top bar and sidebar). Aligned to the baseline grid.

Knowing the category up-front tells you which line-height variant to pick and which alignment behaviour to expect.

## Tokens

| Concept     | Token                                                   |
| ----------- | ------------------------------------------------------- |
| Font family | `--eds-typography-header-font-family`                   |
|             | `--eds-typography-ui-body-font-family`                  |
| Font size   | `--eds-typography-ui-body-{size}-font-size`             |
|             | `--eds-typography-header-{size}-font-size`              |
| Font weight | `--eds-typography-{family}-{size}-font-weight-lighter`  |
|             | `--eds-typography-{family}-{size}-font-weight-normal`   |
|             | `--eds-typography-{family}-{size}-font-weight-bolder`   |
| Line height | `--eds-typography-{family}-{size}-line-height-default`  |
|             | `--eds-typography-{family}-{size}-line-height-squished` |
| Tracking    | `--eds-typography-{family}-{size}-tracking-tight`       |
|             | `--eds-typography-{family}-{size}-tracking-normal`      |
|             | `--eds-typography-{family}-{size}-tracking-wide`        |

`{family}` is one of `ui-body`, `header`. `{size}` is one of `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`.

## Implementation in Figma

EDS 2.0 doesn't ship a per-layer text-style library. Instead, all text is rendered through a single **Typography component** whose appearance is driven by variable modes set on the instance itself. The same `--eds-typography-*` variables that resolve in code (`font-family`, `font-size`, `font-weight`, `line-height`, `tracking`) resolve in Figma — switching a mode swaps the values they point to.

To set typography in Figma:

1. From the **Assets** panel, drag in an **EDS Typography** instance.
2. Type the content into the `text` property.
3. With the instance selected, open the **Variables** section in the **Design** panel and pick the mode for **size**, **weight**, **family**, **line-height** and **density**. The instance updates immediately.
4. Nest the instance inside whatever container needs it — buttons, list items, page headings — without flattening or detaching.

A freshly dragged-in instance leaves every mode at its default, so it inherits whatever modes are set on its parents. Set the density mode once on a page-level frame and every default Typography instance inside follows. The cascade stops at any instance where you've explicitly set a mode — that override sticks regardless of the parent.

## Do's and Don'ts

:::info[Do]

- Pick the line-height variant by what the text is doing — `squished` for controls, `default` for prose
- Use sentence case (capitalise only the first word) for headings and labels
- Keep paragraph lines between 55–80 characters
- Treat density as a global setting on an ancestor — don't switch it per component
- Provide a way to switch back to spacious when you opt into comfortable density

:::

:::danger[Don't]

- Wrap button or chip labels over multiple lines — shorten the label instead
- Mix typefaces within a single piece of UI; let Inter do the UI work and Equinor do the headlines
- Rely on font weight alone to communicate hierarchy without supporting size or position
- Override `font-size` directly in components — set density on a parent and let the scale re-derive

:::
