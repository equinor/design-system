## Summary

Icon renders an icon from `@equinor/eds-icons` as an SVG, on its own or next to text.

## Features

- Is `--eds-spacing-xl` by default, the icon size in the EDS Assets Figma file, whatever the size of the text around it.
- Takes its size from the spacing token of the same name, so `size="md"` is the `spacing-md` variable bound in Figma.
- Follows the density of its parent element, so it grows or shrinks with `data-density`.
- Inherits the text colour through `currentColor`, so it matches the text it sits next to.
- Is sized by the component when used inside Button, Chip or a standalone Link, so the `size` prop has no effect there.

## Usage

```tsx
<Icon data={save} />
```

## Accessibility

- Without `title`, the icon is decorative. It gets `aria-hidden`, so screen readers skip it. Use this when visible text next to it says the same.
- With `title`, the icon gets the `img` role and its title as accessible name. Use this when the icon carries meaning that no text gives.
- Icon is not focusable and has no keyboard behaviour.
- In an icon-only button, the button carries the name with `aria-label`, and the icon stays decorative. A `title` on the icon as well would be read twice.
- Colour alone does not reach a screen reader, so an icon whose colour shows a state, such as an error, needs text or a `title` saying so.

## Related components

- [`Button`](?path=/docs/eds-2-0-beta-inputs-button--docs) takes icons as children and sizes them.
