## Summary

Field arranges a label, a description, a control and a helper message into one form field. Use TextField instead for an ordinary text input, and use Field when you are building a custom field.

## Features

- Works around any control, so you choose the input.
- Styles the label, description and helper message as disabled together when you set `disabled`.
- Shows an `indicator` such as "(Required)" next to the label.
- Comes with `useFieldIds`, a hook that creates matching ids and the `aria-describedby` value, so the parts are linked to the control.

## Usage

```tsx
const { inputId, descriptionId, getDescribedBy } = useFieldIds()

<Field>
  <Field.Label htmlFor={inputId}>Last name</Field.Label>
  <Field.Description id={descriptionId}>Without spaces</Field.Description>
  <Input id={inputId} aria-describedby={getDescribedBy()} />
</Field>
```

## Accessibility

- Field is a plain container with no role of its own, so the control inside it carries the semantics. Connect `Field.Label` to the control with `htmlFor`, using the id from `useFieldIds`.
- Pass `aria-describedby={getDescribedBy()}` to the control, so a screen reader reads the description and the helper message after the label. Set `hasHelperMessage` only while a helper message is rendered.
- Wrap a message that appears later in a container with `role="alert"`, so screen readers announce it.
- `indicator` is shown, and read by a screen reader, as part of the label, but it does not mark the control as required. Set `required` on the control as well, so assistive technology and form validation know the field is required.
- `disabled` on Field only styles its parts. Set `disabled` on the control too.

## Related components

- [`TextField`](?path=/docs/eds-2-0-beta-inputs-textfield--docs) is the ready-made single line field, built from Field.
- [`Input`](?path=/docs/eds-2-0-beta-inputs-input--docs) is the text input that goes inside a Field.
