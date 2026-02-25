# Typography

Typography presents hierarchy and organises information as clearly and efficiently as possible.

## Font families

EDS uses two font families:

- **Equinor** -- Primary typeface for headings (`data-font-family="header"`)
- **Inter** -- UI/body typeface for interface text such as buttons, inputs, and labels (`data-font-family="ui"`)

### Loading fonts

To use EDS components correctly, you must load both font families. The recommended approach is the EDS variable font stylesheet, which includes both Equinor and Inter:

```html
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css" />
```

:::warning eds-uprights-vf.css required for EDS 2.0 components
The older `equinor-font.css` stylesheet only includes the Equinor font. If you use EDS 2.0 (`next`) components with only `equinor-font.css`, UI components like Button and TextField will fall back to a generic sans-serif because the Inter font is missing.
:::

## Guidelines

The Equinor typeface is the primary typeface and is available in four weights: `light`, `regular`, `medium` and `bold` with accompanying italics. Please do not use `light` in digital interfaces except in special cases where the font size is over 48px.

:::info Note
Typography is called text styles in Figma.
:::

### Paragraph length

Paragraph length is the number of characters in a line of text---this includes spaces. To ensure readability, line length should be 55-80 characters. Lines less than 55 characters can cause strain on the eye requiring the eye to jump to the next line too quickly, breaking the reading rhythm. Lines greater than 80 characters can make it difficult for users to continue on the correct line in a large body of text.

## Styles

Too many type sizes can cause confusion. The EDS has a limited set of type sizes that work well together.

### Headings

There are seven headings to choose between: `H1bold`, `H1`, `H2`, `H3`, `H4`, `H5` and `H6`. Sentence case (The quick brown fox…) should be used instead of title case (The Quick Brown Fox…) since it contributes to better readability.

### Paragraph

There are many paragraph styles to choose between: `Overline`, `Ingress`, `Body long`, `Body long link`, `Body long italic`, `Body long bold`, `Body long bold italic`, `Body short`, `Body short link`, `Body short italic`, `Body short bold`, `Body short bold italic` and `Caption`.

The style `Body short` is used for short sentences containing around four words. It is most commonly used within components.

### Additional styles

There are other typography styles that are used internally within components.

## Implementation in Figma

### How to add

1.  Locate the _layer_ in the **Layers Panel** that needs typography style applied.

2.  Locate the **Design** tab in the **Inspector Panel**.

3.  Under the **Text** section, open the **Style library** menu to view the text styles in order of relevance.

4.  Choose a style by clicking on the style needed.
