# Typography

Typography components used to help render typography in <abbr title="Equinor Design System">EDS</abbr>.

## The next-generation typography system is now available

A new and improved typography system is now available! The new system provides:

* **Three specialized components**: `TypographyNext`, `Heading`, and `Paragraph`
* **Baseline grid alignment** for consistent vertical rhythm
* **Better performance** and smaller bundle size
* **Improved accessibility** features

### Required: Import the stylesheet

The new typography components require the EDS foundation stylesheet to work correctly. When using `@equinor/eds-core-react`, you can import the main stylesheet:

```tsx
import '@equinor/eds-core-react/style.css'
```

This stylesheet imports the foundation CSS from `@equinor/eds-tokens`, which includes all typography styles with support for font families, sizes, weights, line heights, letter spacing, and baseline alignment.

**For standalone usage**, import directly from `@equinor/eds-tokens`:

```tsx
import '@equinor/eds-tokens/css/foundation.css'
```

> **Note:** Typography styles are now part of the `@equinor/eds-tokens` package in the foundation CSS. See the [eds-tokens README](../../../../packages/eds-tokens/README.md#foundation-css-variables--typography) for more details about typography utilities and CSS variables.

**Get started:**

```tsx
import { TypographyNext as Typography, Heading, Paragraph } from '@equinor/eds-core-react'
import '@equinor/eds-core-react/style.css' // Required - includes foundation CSS

<Heading as="h1">Welcome</Heading>
<Paragraph>This uses the new typography system.</Paragraph>
<Typography family="ui" size="md" lineHeight="default" baseline="grid" weight="normal" tracking="normal">
  Flexible inline text
</Typography>
```
---

## Current Typography Component

## Usage

### Quick & easy

Simple access to `headings` and `paragraph` styles with colors
```jsx
<Typography variant="h1" color="primary" bold>Text</Typography>
<Typography variant="body_short" link>Text</Typography>
```
### Advanced

### Lines

Use `lines` to limit how many lines of text are shown. Ends text with ellipsis.

```jsx
<Typography variant="body_long" lines={2}>
Sweet roll croissant sweet tiramisu ice cream lollipop. Tart bonbon tart marzipan sweet roll cake apple pie gummi bears pie. Carrot cake topping sweet. Apple pie topping candy jujubes muffin apple pie ice cream muffin macaroon. Bonbon liquorice wafer tart jelly sweet lollipop carrot cake. Brownie cotton candy topping. Donut candy canes liquorice icing lemon drops pastry danish. Lemon drops cheesecake cake tootsie roll apple pie candy canes jelly beans candy canes cupcake.
</Typography>
```

#### Group
Use `group` along with `variant` to render any typography style in EDS.
```jsx
<Typography group="ui" variant="chart">Text</Typography>
<Typography group="table" variant="cell_text">Text</Typography>
```

#### Semantic html

Use the `as` prop to change the underlying html element.
```jsx
<Typography variant="h4" as="h3">h3 styled as h4</Typography>
<ul>
  <Typography group="navigation" variant="breadcrumb" as="li">Breadcrumb</Typography>
</ul>
```

#### Custom

Use the `token` prop to extend/override the typography token used for rendering text.

```jsx
    <Typography
      token={{
        color: 'purple',
        fontFamily: 'Arial',
        fontSize: '1.875rem',
        fontWeight: 900,
        lineHeight: '1.714em',
        textTransform: 'uppercase',
      }}
    >
      Custom token
    </Typography>
```
