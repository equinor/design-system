---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/link/
---

## Summary

Link takes the user to another page or location, either inside a sentence or on its own.

## Features

- Comes as an inline link that takes the size of the text around it, or as a standalone link with its own layout for icons.
- Takes icons as children in the standalone variant, before the text, after it or on both sides.
- Can render as a router link with `asChild`, keeping the Link styles.
- Changes colour on hover and shows a focus outline for keyboard users.

## Usage

```tsx
<Link href="/docs">Read the documentation</Link>
```

## Accessibility

- Link renders a native `<a>` element, so it has the link role.
- A link with an `href` can be reached with Tab and followed with Enter.
- The link text is its accessible name, so it should make sense out of context. Write "Read the release notes", not "Click here".
- With `asChild`, the child element decides the role, so use an element that renders an `<a>`.

## Related components

- [`Button`](?path=/docs/eds-2-0-beta-inputs-button--docs) is for actions such as saving a form. Use Link to move to another page.
