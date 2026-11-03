## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Turns a setting on or off immediately, with no separate confirmation step.
- You own the active state. Pressing the switch reports the new value, and you pass it back in.
- Shows a soft highlight while it is pressed.
- Without a label it becomes a round touch target, for rows that already say what the switch controls.
- Reduces its opacity when disabled.

## Usage

```tsx
const [active, setActive] = useState(false)

<Switch
  label="Notifications"
  active={active}
  onChange={setActive}
/>
```

## Accessibility

- Switch sets the switch role automatically.
- It reports its active and disabled state to screen readers.
- The `label` is used as the accessible name unless `accessibilityLabel` is set.
- Always provide a `label` or an `accessibilityLabel`. A switch with neither has no name for screen readers.

## Related components

- [`Checkbox`](?path=/docs/beta-inputs-selection-controls-checkbox--docs) is for selecting one or more options from a set.
- [`Radio`](?path=/docs/beta-inputs-selection-controls-radio--docs) is for selecting a single option from a mutually exclusive set.
