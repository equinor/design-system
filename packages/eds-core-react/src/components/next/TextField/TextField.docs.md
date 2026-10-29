## Summary

TextField is a complete form field for one line of text, with a label, a description, a helper message and validation styling built in.

## Features

- Combines the label, description, input and helper message in one component, and links them so a screen reader reads them with the field.
- Shows an indicator such as "(Required)" next to the label, and an info tooltip when you set `labelInfo`.
- Takes text or adornments such as icons at the start and end of the input.
- Announces the helper message as an alert while the field is invalid.

## Usage

```tsx
<TextField label="Email" placeholder="name@example.com" />
```

## Accessibility

- TextField renders a native `<input>` element, so it has the textbox role and the browser provides focus and keyboard behaviour.
- The `label` is the accessible name. A field without a visible label needs an `aria-label`.
- The description and helper message are linked to the input, so a screen reader reads them after the label.
- `indicator` is only visible text. Set `required` as well, so assistive technology and form validation know the field is required.
- While `invalid` is set, the helper message is announced as an alert, so it should say what to fix.
- A disabled field cannot be focused. A read only field can be focused and its value is still submitted.
- The `labelInfo` tooltip opens when the info button is hovered or focused, and the button is named "More information".

## Related components

- [`Field`](?path=/docs/beta-inputs-field--docs) provides the label, description and helper message that TextField is built from, for building a custom field.
- [`Input`](?path=/docs/beta-inputs-input--docs) is the single line input on its own, without a label or helper message.
- [`TextArea`](?path=/docs/beta-inputs-textarea--docs) is the complete field for text over several lines.
