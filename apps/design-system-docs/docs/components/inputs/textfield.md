---
title: Text field
sidebar_position: 8
---

# Text field

TextField lets users enter, interact with, and edit content in forms and dialogs. It's a pre-composed component that combines Label, Description, Input, and HelperMessage into a complete, accessible form field.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--introduction"
  width="100%"
  height="125"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--introduction)

## When to Use

Use TextField when you need a complete form field with label, description, and validation messaging. Text fields should be discoverable, clear, and efficient—making it easy for users to understand what's required and address any errors.

**Avoid TextField when:**

- You need a simple input without form composition—use [Input](./input) instead
- Users should choose from limited options—use Radio, Checkbox, Select, or Autocomplete instead
- You need multiline text entry—use Textarea instead

## Structure

TextField is composed of several elements that work together:

- **Label**: Required text identifying the field
- **Description**: Optional helper text below the label
- **Input**: The text entry area
- **HelperMessage**: Validation feedback or hints below the input

For more flexibility, use the individual components via the [Field](./field) composition pattern.

## Guidelines

### Required and Optional Indicators

Use the `indicator` prop to show "(Required)" or "(Optional)" next to the label. The `required` prop sets the HTML required attribute for form validation—these are separate concerns.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--with-indicator"
  width="100%"
  height="235"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--with-indicator)

### Descriptions

Use the `description` prop to provide additional context below the label.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--with-description"
  width="100%"
  height="105"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--with-description)

### Validation States

Use the `invalid` prop to show error styling with a red border and error icon. Pair it with a `helperMessage` to explain what went wrong.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--invalid-state"
  width="100%"
  height="110"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--invalid-state)

### Disabled and Read Only

Avoid using `disabled` where possible. Consider using `readOnly` instead—it keeps the value visible and accessible while preventing edits.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--disabled-state"
  width="100%"
  height="195"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--disabled-state)

### Prefix and Suffix

Use `startText` and `endText` to display units, currency, or contextual information. Note that screen readers won't announce these automatically—ensure matching information appears in the label text as well.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--full-example"
  width="100%"
  height="125"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--full-example)

### Input Types

Choose input types matching the data requested (tel, email, url). Avoid `type="number"` due to accessibility issues—use `type="text"` with `inputmode="numeric"` instead.

### Field Width

Adjust the width to match expected input length—shorter for phone numbers, wider for addresses or descriptions.

### Density

TextField adapts to density modes via `data-density` attribute. Spacious mode is the default with larger sizing, while comfortable mode provides a more compact layout for dense UIs.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textfield--density-modes"
  width="100%"
  height="235"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textfield--density-modes)

## Accessibility

TextField handles accessibility automatically by connecting labels, descriptions, and helper messages via proper ARIA attributes.

**Keyboard support:**

- **Tab**: Move focus to and from the field
- **Type**: Enter text when focused

**Screen reader considerations:**

- Labels are announced when the field receives focus
- Descriptions and helper messages are connected via `aria-describedby`
- Error states are communicated through `aria-invalid`

**Autocomplete attributes:**

Use appropriate `autocomplete` values for predefined input purposes (given-name, email, address-line1). Set `autocomplete="off"` for fields about other people.

## Figma

### Using TextField in Figma

1. In Figma, go to the **Assets Panel** and search for **text field**
2. Drag and drop the component into your frame
3. Rename and resize the component if needed
4. Choose the variant from the **Design Panel**

The component includes options for unit display and placeholder icons. It uses auto layout to place icons and units with correct spacing.

## Do's and Don'ts

:::info **Do**

- Always include a label for the text field
- Keep labels short and meaningful
- Use appropriate input types for the data requested
- Adjust field width to match expected input length
- Allow users to copy and paste content
  :::

:::danger **Don't**

- Remove or hide the label
- End placeholder text with a period
- Use placeholder text as a substitute for labels
- Disable copy and paste functionality
- Use `type="number"` for numeric input—use `inputmode="numeric"` instead
  :::
