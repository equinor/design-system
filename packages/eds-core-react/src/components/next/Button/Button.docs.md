---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/button/
---

## Summary

Button triggers an action, such as saving a form or opening a dialog.

## Features

- Has hover, pressed and keyboard focus styles for every variant.
- Takes icons as children, before the label, after it, or alone in an icon-only button.
- Can render as a link or a router link with `asChild`, keeping the Button styles.
- Follows the density of its parent element, so it grows or shrinks with `data-density`.
- Does not submit a surrounding form unless you set `type="submit"`.

## Usage

```tsx
<Button>Save</Button>
```

## Accessibility

- Button renders a native `button` element, so it has the button role and the browser provides focus and keyboard behaviour.
- Enter and Space activate it once it has focus.
- Its text is the accessible name. An icon-only button has no text, so the consumer must supply `aria-label`.
- Icons next to a label are decorative, so give them `aria-hidden`, as the examples do.
- A disabled button uses the native `disabled` attribute, so it cannot be focused or pressed.
- With `asChild`, the child element decides the role. A link stays a link, and screen readers announce it as one.

## Related components

- [`Link`](?path=/docs/eds-2-0-beta-navigation-link--docs) is for moving to another page. Use Button for actions.
