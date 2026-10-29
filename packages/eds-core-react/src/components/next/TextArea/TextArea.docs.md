## Summary

TextArea is a complete form field for text over several lines, with a label, a description, a helper message and an optional character count.

## Features

- Grows as the user types. `rows` sets the starting height and `maxRows` caps the growth, after which the field scrolls.
- Can show a live character count, as "n / max" when `maxLength` is set.
- Combines the label, description, input and helper message in one component, and links them so a screen reader reads them with the field.
- Shows an indicator such as "(Required)" next to the label, and an info tooltip when you set `labelInfo`.

## Usage

```tsx
<TextArea label="Message" placeholder="Write a message" rows={3} />
```

## Accessibility

- TextArea renders a native `<textarea>` element, so it has the textbox role and the browser provides focus and keyboard behaviour.
- The `label` is the accessible name. A field without a visible label needs an `aria-label`.
- The description and helper message are linked to the field, so a screen reader reads them after the label.
- `indicator` is only visible text. Set `required` as well, so assistive technology and form validation know the field is required.
- While `invalid` is set, the helper message is announced as an alert, so it should say what to fix.
- With `showCharacterCount` and `maxLength`, the count is announced politely once it reaches 80% of the limit, so a screen reader user hears the limit coming without hearing every keystroke.
- The `labelInfo` tooltip opens when the info button is hovered or focused, and the button is named "More information".

## Related components

- [`TextField`](?path=/docs/beta-inputs-textfield--docs) is the complete field for a single line of text.
