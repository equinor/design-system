---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
docs: inputs/selection_controls
---

## Summary

Checkbox lets users select one or more options from a set, or switch a single option on or off.

## Features

- Represents three states: checked, unchecked and indeterminate.
- Supports a subgroup, where a parent checkbox shows the indeterminate state while only some of its child checkboxes are checked.
- Can show a required or optional indicator with the label.
- Is disabled along with the rest of a disabled fieldset.
- Can sit inside a `fieldset` with a shared `legend`, for grouping related options.

## Usage

```tsx
<Checkbox label="Accept terms" />
```

## Accessibility

- Checkbox renders a native `input` of type checkbox, so it has the checkbox role and the browser provides focus and keyboard behaviour.
- The indeterminate state is exposed with `aria-checked="mixed"`.
- A visible `label` provides the accessible name. Without one, the consumer must supply `aria-label`.
- Group related checkboxes in a `fieldset` with a `legend`, so screen readers announce what the group is for.
- Colour alone does not carry any state, because the checked, unchecked and indeterminate states use different icons.

## Related components

- [`Radio`](?path=/docs/eds-2-0-beta-inputs-selection-controls-radio--docs) is for choosing one option from a mutually exclusive set.
- [`Switch`](?path=/docs/eds-2-0-beta-inputs-selection-controls-switch--docs) is for turning a single setting on or off straight away.
