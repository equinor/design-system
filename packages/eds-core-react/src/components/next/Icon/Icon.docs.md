## Summary

Icon shows a small symbol, so a button, a label or a line of text can carry a visual cue.

## Features

- Is `--eds-spacing-xl` by default, the icon size in the EDS Assets Figma file, whatever the size of the text around it.
- Takes its size from the spacing token of the same name, so `size="md"` is the `spacing-md` variable bound in Figma.
- Follows the density of its parent element, so it grows or shrinks with `data-density`.
- Takes the colour of the surrounding text by default, and `color` overrides it.
- Is sized by the component when used inside Button, Chip or a standalone Link, so the `size` prop has no effect there.

## Usage

```tsx
<Icon data={save} title="Save" />
```

## Accessibility

- An icon without a `title` is decorative. It gets `aria-hidden`, so a screen reader skips it.
- An icon with a `title` gets the `img` role and is named by that title. Use this when the icon carries meaning that the text beside it does not.
- Icon is not focusable and has no keyboard behaviour.
- An icon alone in a button has no text, so give the button an `aria-label`.
- The icon takes `currentColor`, so its contrast follows the text colour around it. A `color` you set yourself needs enough contrast against the background.
- Colour alone does not reach a screen reader, so an icon whose colour shows a state, such as an error, needs text or a `title` saying so.

## Related components

- [`Button`](?path=/docs/eds-2-0-beta-inputs-button--docs) takes icons as children and sizes them.
