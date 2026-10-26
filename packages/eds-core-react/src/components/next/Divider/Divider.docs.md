## Summary

Divider is a thin horizontal line that separates related content, such as the rows of a list or the sections of a page.

## Features

- Spans the full width of its container.
- Draws a thin line in the subtle border colour, so it separates content without competing with it.
- Has no margin of its own, so your layout sets the space around it.

## Usage

```tsx
<Divider />
```

## Accessibility

- Divider renders a native `<hr>` element, so it has the separator role and the browser announces it as one.
- It is not focusable and has no keyboard interaction.
- Use it where the content really changes. For a line that is purely decorative, pass `aria-hidden` so screen readers skip it.
