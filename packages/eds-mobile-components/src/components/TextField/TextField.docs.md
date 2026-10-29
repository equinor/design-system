## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Combines a label, a description, the input and a helper message in one field.
- Shows an indicator such as "(Optional)" after the label.
- Passes every Input prop through, so it takes adornments, prefix and suffix text, read only and disabled.
- Dims the helper message while the field is disabled.

## Usage

```tsx
<TextField label="Email" placeholder="name@example.com" />
```

## Accessibility

- The `label` is the accessible name, unless you pass your own `accessibilityLabel`.
- The description and helper message are joined into the accessibility hint, unless you pass your own `accessibilityHint`, so a screen reader reads them with the field.
- While `invalid` is set, the helper message is the only place that says what is wrong, so write it to say what to fix.
- A disabled field is reported to screen readers as disabled. A read only field cannot be edited.

## Related components

- [`Input`](?path=/docs/eds-2-0-beta-inputs-input--docs) is the text input on its own, without a label or helper message.
- [`TextArea`](?path=/docs/eds-2-0-beta-inputs-textarea--docs) is the complete field for text over several lines, with a character count.
