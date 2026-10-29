## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Combines a label, a description, the text area and a helper message in one field.
- Shows an indicator such as "(Optional)" after the label.
- Can show a character count, as "n / max" when `maxLength` is set.
- Announces the count to screen readers when it reaches 80% and 100% of `maxLength`.
- Shows an error icon while the field is invalid.

## Usage

```tsx
<TextArea label="Message" placeholder="Write a message" />
```

## Accessibility

- The `label` is the accessible name. A field with no label, or one that needs a different name, takes an `accessibilityLabel`.
- The description and helper message are joined into the accessibility hint, unless you pass your own `accessibilityHint`, so a screen reader reads them with the field.
- While `invalid` is set, the error icon is hidden from screen readers, so the helper message is the only place that says what is wrong. Write it to say what to fix.
- A disabled field is reported to screen readers as disabled. A read only field cannot be edited.
- With `showCharacterCount` and `maxLength`, a screen reader announces "n of N characters" when the count reaches 80% and 100% of the limit.

## Related components

- [`TextField`](?path=/docs/eds-2-0-beta-inputs-textfield--docs) is the complete field for a single line of text.
