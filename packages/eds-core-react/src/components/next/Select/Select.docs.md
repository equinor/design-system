## Summary

Select lets the user pick a single option from a list. It does not support selecting several. For a long list that people need to search, use [Autocomplete](?path=/docs/eds-2-0-beta-inputs-autocomplete--docs) instead.

## Features

- Uses the browser's native select, so the option list and keyboard use come from the browser. Where `appearance: base-select` is supported, the list is styled to match EDS.
- Links the label, description and helper message to the select for you.
- Keeps a read only select focusable and, when it has a `name`, still submits its value, while blocking changes.
- Shows groups of options as native `<optgroup>` sections.

## Usage

```tsx
<Select label="Country" options={['Norway', 'Denmark', 'Sweden']} />
```

## Accessibility

- Select renders a native `<select>`, so the browser provides focus, keyboard behaviour and the option list.
- `label` renders a `<label>` tied to the select. Without a `label`, pass `aria-label` so the select has a name.
- `description` and `helperMessage` are linked to the select with `aria-describedby`, so a screen reader reads them after the label.
- `invalid` sets `aria-invalid` and shows an error icon, but does not block form submission, so use `required` for that. Use `helperMessage` to say what needs fixing, since the colour and icon alone do not explain it. The helper message is announced as an alert when it appears.
- A native `<select>` has no `readonly` attribute, so `readOnly` sets `aria-readonly` and blocks every key except Tab and Shift. The select stays focusable.
- `indicator` is shown, and read by a screen reader, as part of the label, but it does not mark the select as required. Set `required` on the select as well, so assistive technology and form validation know the field is required.
- `disabled` takes the select out of the tab order and out of form submission.

## Related components

- [`Autocomplete`](?path=/docs/eds-2-0-beta-inputs-autocomplete--docs) lets the user type to filter a long list of options.
