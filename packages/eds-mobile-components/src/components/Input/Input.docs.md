## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Adds prefix or suffix text, and adornments such as icons, at the start or end.
- Shows error styling and an error icon when invalid.
- Distinguishes disabled, which ignores presses and dims the input, from read only, which stops editing without dimming the input or marking it disabled for screen readers.
- Grows to fit multiple lines of text when `multiline` is set, so use TextArea instead when you need a complete, labelled field for multi-line text.

## Usage

```tsx
const [value, setValue] = useState('')

<Input value={value} onChange={setValue} accessibilityLabel="Description of input" />
```

## Accessibility

- Input wraps a native `TextInput`, so it reports itself to screen readers with its current value and, when disabled, its disabled state.
- Needs an accessible name from `accessibilityLabel`, since Input has no built-in label of its own.
- On iOS, selecting text in a read only input needs `multiline`. Single-line read only inputs are not selectable there.

## Related components

- [`TextField`](?path=/docs/beta-inputs-textfield--docs) wraps Input with a label, description, helper message and validation handled for you.
- [`TextArea`](?path=/docs/beta-inputs-textarea--docs) is the complete, labelled field for multi-line text, the same relationship TextField has to single-line Input.
