# Typography

Typography components used to help render typography in <abbr title="Equinor Design System">EDS</abbr>.

## EDS 2.0 typography — replacement in progress

`TypographyNext`, `Heading`, and `Paragraph` are deprecated. They still work, but avoid new adoption — every new use has to be undone when the replacement lands.

**What is coming ([ADR-0005](../../../../documentation/adr/0005-typography-approach-for-eds-2.md)):**

- A base element stylesheet giving `h1`–`h6` and `p` their default size and flow spacing ([#5477](https://github.com/equinor/design-system/issues/5477))
- Utility classes per text style for exceptions, mirroring Figma text styles ([#5501](https://github.com/equinor/design-system/issues/5501))

**In the meantime:** stay on EDS 1.0, or apply `--eds-typography-*` tokens directly with your own spacing (`gap` with `--eds-spacing-vertical-*` tokens on a flex/grid container).

---

## Current/Old/Deprecated Typography Component

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
