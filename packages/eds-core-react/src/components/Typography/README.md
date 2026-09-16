# Typography

Typography components used to help render typography in <abbr title="Equinor Design System">EDS</abbr>.

## EDS 2.0 typography: CSS-first

EDS 2.0 applies typography through CSS tokens and semantic HTML. `TypographyNext`, `Heading`, and `Paragraph` are deprecated transitional components — do not adopt them for new work.

**The recommended approach:**

```tsx
import '@equinor/eds-core-react/next/index.css'
```

```html
<div class="eds-elements">
  <h1>Page title</h1>
  <p>Correct size, weight, and flow spacing come from the stylesheet.</p>
  <h2>Section heading</h2>
  <p>No extra gap, margin, or wrapper components needed.</p>
</div>
```

See the [Foundation Typography Storybook docs](https://eds.equinor.com/storybook/?path=/docs/eds-2-0-beta-foundation-typography--docs) for the full approach. The decision is documented in [ADR-0005: Typography approach for EDS 2.0](../../../../documentation/adr/0005-typography-approach-for-eds-2.md).

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
