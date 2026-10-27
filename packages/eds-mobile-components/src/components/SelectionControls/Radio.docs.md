## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Lets the user choose exactly one option from a group, unlike Checkbox, which allows any number.
- The whole row is pressable, so pressing the label selects the radio as well as the circle.
- Shows a brief coloured highlight while pressed, the only visual reaction to a press. Selecting itself has no separate animation.
- Without a label it becomes a round touch target, for lists of options where the row already says what is being selected.
- Reduces the contrast of the icon and the label when disabled.

## Usage

```tsx
const [selected, setSelected] = useState('apples')

<Radio
  label="Apples"
  checked={selected === 'apples'}
  onPress={() => setSelected('apples')}
/>
```

## Accessibility

- Radio sets the radio role automatically.
- It reports its checked and disabled state to screen readers.
- The `label` is used as the accessible name unless `accessibilityLabel` is set.
- Always provide a `label` or an `accessibilityLabel`. A radio with neither has no name for screen readers.

## Related components

- [`Checkbox`](?path=/docs/beta-inputs-selection-controls-checkbox--docs) is for selecting one or more options from a set.
- [`Switch`](?path=/docs/beta-inputs-selection-controls-switch--docs) is for turning a single setting on or off.
