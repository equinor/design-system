---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
docs: inputs/selection_controls
---

## Summary

Switch turns a single setting on or off immediately, with no separate confirmation step.

## Features

- Always shows a visible label. There is no label-less variant.
- Works as a controlled or an uncontrolled component, using `checked` or `defaultChecked`.
- Is disabled along with the rest of a disabled fieldset.

## Usage

```tsx
<Switch label="Enable notifications" />
```

## Accessibility

- Switch renders a native checkbox input with `role="switch"`, so the browser provides focus and keyboard behaviour, and screen readers announce it as a switch rather than a checkbox.
- It can be toggled with the Space key once it has focus.
- The `label` prop is required, so Switch always has an accessible name.
- Switch does not announce what toggling it changed elsewhere on the page. If that matters, add your own `aria-live` region, as the example below shows.

## Related components

- [`Checkbox`](?path=/docs/beta-inputs-selection-controls-checkbox--docs) is for choosing any number of options from a list.
- [`Radio`](?path=/docs/beta-inputs-selection-controls-radio--docs) is for choosing one option from a mutually exclusive set.
