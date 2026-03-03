---
title: Text area
sidebar_position: 8
---

# Text area

Text area lets users enter and edit multiline text content. It's built using the TextField component with `as="textarea"`, combining Label, Description, Input, and HelperMessage into a complete, accessible form field designed for longer text entries like descriptions, feedback, or notes.

<!-- TODO: Replace with actual Storybook iframe when TextArea stories are available -->

```tsx
import { TextField } from '@equinor/eds-core-react/next'

<TextField as="textarea" label="Description" placeholder="Enter text..." />
```

## When to Use

Use Text area when users are expected to write more than one line of text, or when they need space to express themselves freely with answers that don't have a fixed structure.

**Avoid Text area when:**

- You expect short, single-line answers - use [TextField](./textfield) instead
- Users should choose from limited options - use Radio, Checkbox, Select, or Autocomplete instead
- Dealing with structured data requiring validation (e.g., ID numbers, dates) - use [TextField](./textfield) with the appropriate input type

## Structure

Text area is composed of several elements that work together:

- **Label**: Required text identifying the field
- **Description**: Optional helper text below the label
- **Textarea**: The multiline text entry area
- **HelperMessage**: Validation feedback or hints below the textarea

For more flexibility, use the individual components via the [Field](./field) composition pattern.

## Guidelines

### Height Configuration

Set the `rows` attribute to specify the initial visible height of the text area. This helps indicate the expected volume of text. Choose a height that matches the expected content length - provide more visual space for fields that expect longer responses.

### Field Width

Maintain 50-75 characters per line (including spaces) for optimal readability. Adjust the width to match expected content.

### Required and Optional Indicators

Use the `indicator` prop to show "(Required)" or "(Optional)" next to the label. The `required` prop sets the HTML required attribute for form validation - these are separate concerns.

Follow this rule to keep forms clear and reduce visual noise:

- **If most fields are required** - only mark optional fields by adding "(Optional)" to the label
- **If most fields are optional** - only mark required fields by adding "(Required)" to the label

<!-- TODO: Replace with actual Storybook iframe
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--with-indicator"
  width="100%"
  height="280"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--with-indicator)
-->

### Descriptions

Use the `description` prop to provide additional context below the label.

<!-- TODO: Replace with actual Storybook iframe
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--with-description"
  width="100%"
  height="150"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--with-description)
-->

### Validation States

Use the `invalid` prop to show error styling with a red border and error icon. Pair it with a `helperMessage` to explain what went wrong.

<!-- TODO: Replace with actual Storybook iframe
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--invalid-state"
  width="100%"
  height="150"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--invalid-state)
-->

### Disabled and Read Only

Avoid using `disabled` where possible. Disabled states can confuse users about why a field is unusable - consider alternatives before using this state.

Use `readOnly` sparingly and only when necessary, as it may confuse users expecting editable fields. Read-only fields remain in tab order and their content submits with forms, making them useful for form summaries. When using this state, make sure to explain to the user why the content cannot be edited.

<!-- TODO: Replace with actual Storybook iframe
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--read-only-state"
  width="100%"
  height="150"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--read-only-state)
-->

### Density

Text area adapts to density modes via `data-density` attribute. Spacious mode is the default with larger sizing, while comfortable mode provides a more compact layout for dense UIs.

<!-- TODO: Replace with actual Storybook iframe
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--density-modes"
  width="100%"
  height="250"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--density-modes)
-->

## Accessibility

Text area handles accessibility automatically by connecting labels, descriptions, and helper messages via proper ARIA attributes.

**Keyboard support:**

- **Tab**: Move focus to and from the field
- **Type**: Enter text when focused
- **Enter**: Creates a new line (does not submit form)

**Screen reader considerations:**

- Labels are announced when the field receives focus
- Descriptions and helper messages are connected via `aria-describedby`
- Error states are communicated through `aria-invalid`

## Figma

### Components

The Text area is available as one component in Figma:

- **_Text Area [EDS]**: Complete form field combining label, description, textarea, and helper message

### Subcomponents

Text area is built from two main subcomponents, each with their own toggleable parts:

**.Label + Description** - The upper section containing the label and optional description text.

- **.↳ Optional/Required**: Indicator text next to the label. Type: `(Optional)` or `(Required)`.
- **.↳ Information Icon**: Info circle icon next to the label for tooltip content. State: `Default` or `Hover`.
- **Description**: Toggleable descriptive text below the label.

**.⌘ Text Area** - The textarea field with helper message.

- **Helper Message**: Toggleable text below the textarea for validation or hints.
- **Focus Frame**: Visual focus indicator around the textarea.
- **State**: `Default`, `Hover`, `Focus`, `Active`, `Filled`, `Read-only`, or `Disabled`.
- **Validation**: `Default` or `Error`.

### Using Text Area in Figma

1. In Figma, go to the **Assets Panel** and search for **Text Area**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

### Property Structure

The component uses a nested structure:

**Top level** (Text Area) - Contains the label section and textarea section.

**.Label + Description** - Set the **Label** text, and toggle visibility of **Description**, **Optional/Required** indicator, and **Information Icon**.

**.⌘ Text Area** - Set the **State** (Default, Hover, Focus, Active, Filled, Read-only, Disabled), **Validation** (Default, Error), **Placeholder** text, and toggle **Helper Message**.

## Do's and Don'ts

:::info **Do**

- Always include a label for the text area
- Keep labels short and meaningful
- Use the `rows` attribute to indicate expected text volume
- Adjust field width to maintain 50-75 characters per line
- Allow users to copy and paste content
- Provide clear helper messages for validation errors
  :::

:::danger **Don't**

- Remove or hide the label
- Use placeholder text as a substitute for labels
- End placeholder text with a period
- Disable copy and paste functionality
- Use text area for short, single-line inputs - use TextField instead
- Disable fields without providing an explanation to the user
  :::
