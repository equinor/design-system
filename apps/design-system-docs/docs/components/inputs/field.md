---
title: Field
sidebar_position: 3
---

# Field

Field is a layout primitive for building accessible form fields. It automatically associates labels, descriptions, and helper messages with form controls using the correct ARIA attributes - ensuring a consistent and accessible experience.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-field--default"
  width="100%"
  height="125"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-field--default)

## When to Use

Use Field when you need to ensure Label, Description, and helper messages are correctly associated with a form control. Field is a low-level building block for creating custom form components.

**For most use cases, use TextField instead** - it handles all the composition and accessibility for you.

**Avoid Field when:**

- You need a complete, ready-to-use form field - use TextField instead
- You're grouping multiple related fields - use Fieldset instead

## Structure

Field is composed of several sub-components that work together:

- **Field.Label**: The label for the form control
- **Field.Description**: Additional context displayed below the label
- **Field.HelperMessage**: Validation feedback or hints below the input

Use the `useFieldIds` hook to generate IDs and wire up accessibility attributes:

```tsx
const { inputId, descriptionId, helperMessageId, getDescribedBy } = useFieldIds()
```

## Guidelines

### Required and Optional Indicators

Use the `indicator` prop on Field.Label to show required or optional status. This is a visual indicator only - remember to also set `aria-required` on the input for accessibility.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-field--with-indicator"
  width="100%"
  height="200"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-field--with-indicator)

### Descriptions

Use Field.Description to provide additional context below the label. Connect it to the input using `aria-describedby` for screen reader support.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-field--with-description"
  width="100%"
  height="105"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-field--with-description)

### Live Validation

For accessible live validation, wrap conditional content in a container with `role="alert"`. The wrapper acts as an ARIA live region - screen readers will announce changes when content appears inside it.

Pass IDs to `getDescribedBy()` conditionally based on what's rendered.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-field--live-validation"
  width="100%"
  height="125"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-field--live-validation)

### Disabled State

Set `disabled` on Field to apply disabled styling to all sub-components. The disabled state is passed down via the `data-disabled` attribute.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-field--disabled"
  width="100%"
  height="105"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-field--disabled)

### Label Position

Field supports flexible label positioning through the `position` prop. This is used internally by selection controls (Checkbox, Radio, Switch) to allow labels before or after the control.

## Accessibility

Field automatically manages ARIA relationships between form elements:

- Labels are connected to inputs via `htmlFor` and `id`
- Descriptions and helper messages are linked via `aria-describedby`
- Error states are announced to screen readers via `aria-live` regions

**Using the useFieldIds hook:**

The hook provides:
- `inputId`: ID for the form control
- `descriptionId`: ID for the description element
- `helperMessageId`: ID for helper/error messages
- `getDescribedBy()`: Helper to build the `aria-describedby` attribute

**Screen reader considerations:**

Screen readers won't automatically announce prefix/suffix text (like currency symbols or units). Ensure this information is also present in the label text for full accessibility.

## Do's and Don'ts

:::info **Do**

- Use the `useFieldIds` hook to manage accessibility attributes
- Place labels and descriptions above the form control
- Use `role="alert"` for live validation messages
- Set `aria-required` on inputs when using the required indicator
- Use TextField for standard form fields
  :::

:::danger **Don't**

- Forget to connect descriptions with `aria-describedby`
- Use Field when TextField would be simpler
- Rely only on visual indicators for required/optional status
- Skip the `useFieldIds` hook - manual ID management is error-prone
  :::
