## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Shows a clear button inside the field while it has text. Pressing it empties the field, so the user can type a new query.
- Can show a Cancel button next to the field when you set `cancellable`. It slides in while the field is focused. Pressing it empties the field, closes the keyboard and calls `onCancelPress`, so the user can leave the search.
- Combines a label, a description, the search field and a helper message in one field.
- Shows an error icon next to the search icon while the field is invalid.

## Usage

```tsx
<Search label="Search" placeholder="Search" />
```

## Accessibility

- The `label` is the accessible name. A field with no label, or one that needs a different name, takes an `accessibilityLabel`.
- The description and helper message are joined into the accessibility hint, unless you pass your own `accessibilityHint`, so a screen reader reads them with the field.
- The clear button is a button named "Clear search", and the Cancel button is named "Cancel".
- The search, error and clear icons are hidden from screen readers.
- While `invalid` is set, the error icon is hidden from screen readers, so the helper message is the only place that says what is wrong. Write it to say what to fix.
- A disabled field is reported to screen readers as disabled. A read only field cannot be edited.
