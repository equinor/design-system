# Typography

Typography component used to help render typography in EDS

## Usage

### Quick

Simple access to heading and paragraph styles
```jsx

<Typography variant="h1">Text</Typography>
<Typography variant="body_short">Text</Typography>
<Typography variant="ingress">Text</Typography>
<Typography variant="caption">Text</Typography>
```
### Advanced

#### Group
Props `group` along with `variant` can be used to render any typography style.
```jsx
<Typography group="ui" variant="chart">Text</Typography>
<Typography group="table" variant="cell_text">Text</Typography>
<Typography variant="ingress">Text</Typography>
<Typography variant="caption">Text</Typography>
```

#### Semantic html

Use the `as` prop to change the underlying html element used to render the text
```jsx
<Typography variant="h2" as="a">H2 link</Typography>
<ul>
<Typography group="navigation" variant="breadcrumb" as="li">Breadcrumb</Typography>
</ul>
```

#### Colors

Colors can be set by using the `color` prop

```jsx
<Typography color="primary"> Primary</Typography>
<Typography color="secondary">Secondary</Typography>
<Typography color="danger">Danger</Typography>
<Typography color="warning">Warning</Typography>
<Typography color="success">Success</Typography>
<Typography color="disabled">Disabled</Typography>
```

#### Custom

If for any reason none of the typography styles work, you can set the underlying token used for rendering typography by using the `token` prop

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
