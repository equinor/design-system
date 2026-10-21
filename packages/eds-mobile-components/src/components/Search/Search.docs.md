## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Combines a label, a description, the search field and a helper message in one field.
- Shows a clear button while the field has text.
- Can show a Cancel button that slides in when the field is focused. Pressing it clears the text and closes the keyboard.
- Shows an error icon next to the search icon while the field is invalid.

## Usage

```tsx
<Search label="Search" placeholder="Search" />
```

## Accessibility

- The `label` is the accessible name, unless you pass your own `accessibilityLabel`.
- The description and helper message are joined into the accessibility hint, unless you pass your own `accessibilityHint`, so a screen reader reads them with the field.
- The clear button is a button named "Clear search", and the Cancel button is named "Cancel".
- The search, error and clear icons are hidden from screen readers.
- While `invalid` is set, the error icon is hidden from screen readers, so the helper message is the only place that says what is wrong. Write it to say what to fix.
- A disabled field is reported to screen readers as disabled. A read only field cannot be edited, but it is not reported as read only.
- A field with no label needs an `accessibilityLabel`.
