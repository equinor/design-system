## Summary

Icon shows a small symbol, so a button, a label or a line of text can carry a visual cue.

## Features

- Draws the icon from `@equinor/eds-icons` as an inline SVG.
- Picks its size from the first rule that applies: an explicit `size`, then the surrounding Typography, then 1.5 times the surrounding font size.
- Follows the density of its parent element when you set `size`, so the same size renders larger or smaller with the density.
- Takes the colour of the surrounding text by default, and `color` overrides it.
- Is hidden from screen readers unless you give it a `title`, which turns it into an image with that name.

## Usage

```tsx
import { save } from '@equinor/eds-icons'

<Icon data={save} title="Save" />
```

## Accessibility

- An icon without a `title` is decorative. It gets `aria-hidden`, so a screen reader skips it.
- An icon with a `title` gets the `img` role and is named by that title. Use this when the icon carries meaning that the text beside it does not.
- An icon alone in a button has no text, so the button needs its own `aria-label`, or the icon needs a `title`.
- The icon takes `currentColor`, so its contrast follows the text colour around it. A `color` you set yourself needs enough contrast against the background.
