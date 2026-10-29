## Summary

Input is a low-level text field for collecting a single line of text in custom compositions, so use TextField instead when you need a complete, labelled form field with validation handled for you.

## Features

- Accepts any native HTML input type, such as text, number or password, through the `type` prop.
- Adds prefix or suffix text, and adornments such as icons or buttons, at the start or end.
- Powers TextField and Search, which add the label or clear button it doesn't have itself.
- Distinguishes disabled, which is left out of focus and form submission, from read only, which stays focusable and submits its value but cannot be edited.

## Usage

```tsx
<Input placeholder="Enter text" aria-label="Description of input" />
```

## Accessibility

- Input renders a native `<input>` element, so it has the textbox role and the browser provides focus and keyboard behaviour for free.
- Needs an accessible name, either from a visible label paired through `Field.Label` or `Field`, or from `aria-label` when no visible label is shown.
- Pairs `invalid` with a visible or screen-reader-only description of what needs fixing, since the red border and error icon alone do not explain the problem.
- Hides the error icon with `hideErrorIcon` only when composing Input into another component that provides its own error indication, such as Search.

## Related components

- [`TextField`](?path=/docs/beta-inputs-textfield--docs) wraps Input with a label, description, helper message and validation handled for you.
- [`TextArea`](?path=/docs/beta-inputs-textarea--docs) is the complete, labelled field for multi-line text, the same relationship TextField has to single-line Input.
