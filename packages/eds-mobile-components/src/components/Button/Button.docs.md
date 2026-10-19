## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Can have an icon before the label, after it, or both.
- Changes its background while it is pressed.
- Looks greyed out when disabled, whatever its tone is.
- Has an icon-only variant, `Button.Icon`, for compact actions. It takes the same `tone`, `size` and `variant`, and its own props are listed under Props.

## Usage

```tsx
<Button label="Save" onPress={handleSave} />
```

## Accessibility

- Button sets the button role automatically.
- It reports its disabled state to screen readers.
- The `label` is the accessible name.
- Any `accessibilityState` you pass is merged with the built-in disabled state.
- `Button.Icon` has no text, so always give it an `accessibilityLabel`.
