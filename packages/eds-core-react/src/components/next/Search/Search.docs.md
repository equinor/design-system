---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/search.html
---

## Summary

Search is a field for searching, with a label, a description, a helper message and a clear button that appears when the field has a value.

## Features

- Wraps the field in a `<search>` element, so assistive technology can jump straight to it.
- Shows a clear button while the field has a value, and returns focus to the input after clearing.
- Works as a controlled field with `value` and `onClear`, or as an uncontrolled field with `defaultValue`.
- Shows no error icon, so the helper message is what explains an error.
- Takes `clearLabel`, so the clear button can be named in another language.

## Usage

```tsx
<Search label="Search" placeholder="Search" />
```

## Accessibility

- Search renders a native `<input type="search">` inside a `<search>` element, which is the search landmark.
- The `label` names the landmark and the field. A search without a visible label needs an `aria-label`.
- The clear button is named "Clear search". Set `clearLabel` for any other language.
- The clear button only appears while the field has a value and is not disabled or read only.
- While `invalid` is set, the helper message is announced as an alert, so it should say what to fix.
- A disabled search cannot be focused. A read only search can be focused and its value is still submitted.

## Related components

- [`TextField`](?path=/docs/eds-2-0-beta-inputs-textfield--docs) is the complete field for other single line text.
