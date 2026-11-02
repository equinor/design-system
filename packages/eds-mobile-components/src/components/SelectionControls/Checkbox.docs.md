## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- The whole row is pressable, so pressing the label toggles the checkbox as well as the box.
- You own the checked state. Pressing the checkbox reports the new value, and you pass it back in.
- Shows a soft highlight while it is pressed.
- Without a label it becomes a round touch target, for lists and bulk selection headers.
- Reduces the contrast of the icon and the label when disabled.

## Usage

```tsx
const [checked, setChecked] = useState(false)

<Checkbox label="Accept terms" checked={checked} onPress={setChecked} />
```

## Accessibility

- Checkbox sets the checkbox role automatically.
- It reports its state to screen readers as checked, unchecked or mixed (when indeterminate), together with whether it is disabled.
- The `label` is used as the accessible name unless `accessibilityLabel` is set.
- Always provide a `label` or an `accessibilityLabel`. A checkbox with neither has no name for screen readers.

## Related components

- [`Radio`](?path=/docs/beta-inputs-selection-controls-radio--docs) is for choosing one option from a mutually exclusive set.
- [`Switch`](?path=/docs/beta-inputs-selection-controls-switch--docs) is for turning a single setting on or off.
