---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
docs: inputs/selection_controls
---

## Summary

Radio lets users choose exactly one option from a group of mutually exclusive choices.

## Features

- Works as a controlled or an uncontrolled component, using `checked` or `defaultChecked`.
- Works as part of a native group, so only one radio in the same group can be selected at a time.
- Is disabled along with the rest of a disabled fieldset.
- Can sit inside a `fieldset` with a shared `legend`, for grouping related options.

## Usage

```tsx
<fieldset>
  <legend>Select option</legend>
  <Radio label="Option 1" name="group" value="1" />
  <Radio label="Option 2" name="group" value="2" />
</fieldset>
```

## Accessibility

- Radio renders a native `input` of type radio, so it has the radio role and the browser provides focus and keyboard behaviour.
- Arrow keys move both focus and selection together within a group, so users can step through options in one smooth motion without tabbing to each one individually. This comes from the browser's native radio-group behaviour, not from any code in Radio itself.
- A visible `label` provides the accessible name. Without one, the consumer must supply `aria-label`.
- Group related radios in a `fieldset` with a `legend`, so screen readers announce what the group is for.

## Related components

- [`Checkbox`](?path=/docs/beta-inputs-selection-controls-checkbox--docs) is for choosing any number of options from a list.
- [`Switch`](?path=/docs/beta-inputs-selection-controls-switch--docs) is for turning a single setting on or off straight away.
