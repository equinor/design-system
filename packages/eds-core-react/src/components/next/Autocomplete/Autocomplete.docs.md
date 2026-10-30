## Summary

Autocomplete is a text input that filters a list of options as the user types, so they can pick one from a long list. It can also let them add a value that is not in the list. Use [Select](?path=/docs/beta-inputs-select--docs) instead for a short list that needs no search.

## Features

- Lets the user add a value that is not in the list. With `allowCustomValue`, an "Add" option appears while they type, and `onCustomValueConfirm` receives the typed text.
- Filters the options as you type, with a case-insensitive substring match that `optionsFilter` can replace.
- Accepts plain strings or objects as options, with `getOptionLabel` for objects and `renderOption` for custom rows.
- Supports server-side search. `loading` shows a spinner, and `optionsFilter` can return true for every option when the server has already filtered.
- Takes a `label`, `description` and `helperMessage` and links them to the input for you.

## Usage

```tsx
<Autocomplete label="Element" options={['Copper', 'Iron', 'Zinc']} />
```

## Accessibility

- The input has the `combobox` role with `aria-expanded`, `aria-controls`, `aria-autocomplete="list"` and `aria-haspopup="listbox"`. The list is a `listbox` of `option` items.
- Arrow Down and Arrow Up move the highlight through the options. Enter picks the highlighted option, and Escape closes the list without picking one. Focus stays in the input, and `aria-activedescendant` points at the highlighted option.
- A hidden status region announces "No results" or the number of results as the user types.
- `label` renders a `<label>` tied to the input. Without a `label`, pass `aria-label` so the input has a name.
- `description` and `helperMessage` are linked with `aria-describedby`. With `invalid`, the helper message is announced as an alert when it appears.
- The clear button is named "Clear" and the loading spinner "Loading". Use `clearLabel` to translate the button name, and `loadingText` to translate the loading announcement and the text in the list. The spinner's name is not translated.

## Related components

- [`Select`](?path=/docs/beta-inputs-select--docs) is a native select for a short list without search.
