# Typography

Typography components used to help render typography in <abbr title="Equinor Design System">EDS</abbr>.

## EDS 2.0 typography — replacement in progress

`TypographyNext`, `Heading`, and `Paragraph` are deprecated, but supported for the 2.x line. Avoid new adoption.

**What is coming ([ADR-0018](../../../../../documentation/adr/0018-typography-approach-for-eds-2.md)):**

- A base element stylesheet giving `h1`–`h6` and `p` their default size and flow spacing ([#5477](https://github.com/equinor/design-system/issues/5477))
- Utility classes per text style for exceptions, mirroring Figma text styles ([#5501](https://github.com/equinor/design-system/issues/5501))

**In the meantime:**

- **Already using these components (or 1.0 `Typography`)?** Stay where you are. There is no need to migrate until the replacement is ready.
- **Writing new code that needs typography?** Use plain `h1`–`h6` and `p`. That is the markup the base stylesheet will style, so there is nothing to undo when it ships. They keep the browser's default margins until #5477 lands.
- Applying the `--eds-typography-*` tokens in a class of your own is still fine, as long as that class is easy to delete later — the token names differ between stable (`ui-body-md-*`) and beta (`ui-md-*`).

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
