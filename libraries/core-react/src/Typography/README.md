# Typography

Typography component used to help render typography in EDS

## Usage

### Quick & easy

Simple access to `headings` and `paragraph` styles with colors
```jsx
<Typography variant="h1" color="primary" bold>Text</Typography>
<Typography variant="body_short" link>Text</Typography>
```
### Advanced

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
