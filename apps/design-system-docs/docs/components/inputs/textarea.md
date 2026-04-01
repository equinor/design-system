---
title: Text area
sidebar_position: 8
---

# Text area

Text area lets users enter and edit multiline text content. It combines Label, Description, Textarea, and HelperMessage into a complete, accessible form field designed for longer text entries like descriptions, feedback, or notes. The textarea auto-grows as the user types by default.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--introduction"
  width="100%"
  height="200"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--introduction)

```tsx
import { TextArea } from '@equinor/eds-core-react/next'

<TextArea label="Description" placeholder="Enter text..." rows={3} />
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

### Height and Auto-grow

Text area auto-grows as the user types. Use `rows` to set the initial visible height (acts as the minimum), and `maxRows` to cap how tall it can grow before becoming scrollable. Set both to the same value for a fixed-height textarea.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--auto-grow"
  width="100%"
  height="380"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--auto-grow)

### Field Width

Maintain 50-75 characters per line (including spaces) for optimal readability. Adjust the width to match expected content.

### Required and Optional Indicators

Use the `indicator` prop to show "(Required)" or "(Optional)" next to the label. The `required` prop sets the HTML required attribute for form validation - these are separate concerns.

Follow this rule to keep forms clear and reduce visual noise:

- **If most fields are required** - only mark optional fields by adding "(Optional)" to the label
- **If most fields are optional** - only mark required fields by adding "(Required)" to the label

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--with-indicator"
  width="100%"
  height="380"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--with-indicator)

### Descriptions

Use the `description` prop to provide additional context below the label.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--full-field"
  width="100%"
  height="220"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--full-field)

### Character Count

Use `showCharacterCount` to display a live character count below the textarea. When `maxLength` is also set, it renders as "n / max".

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--with-character-count"
  width="100%"
  height="380"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--with-character-count)

### Validation States

Use the `invalid` prop to show error styling with a red border and error icon. Pair it with a `helperMessage` to explain what went wrong.

### Disabled and Read Only

Avoid using `disabled` where possible. Disabled states can confuse users about why a field is unusable - consider alternatives before using this state.

Use `readOnly` sparingly and only when necessary, as it may confuse users expecting editable fields. Read-only fields remain in tab order and their content submits with forms, making them useful for form summaries. When using this state, make sure to explain to the user why the content cannot be edited.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--states"
  width="100%"
  height="500"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--states)

### Density

Text area adapts to density modes via `data-density` attribute. Spacious mode is the default with larger sizing, while comfortable mode provides a more compact layout for dense UIs.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-textarea--density-modes"
  width="100%"
  height="250"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-textarea--density-modes)

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

Text area is available as a variant of the shared input component in Figma:

- **Input [EDS]**: Shared input component used for all input types, including Text Area

### Using Text Area in Figma

1. In the **Assets Panel**, search for **Input** and drag the **Input [EDS]** component into your frame
2. Select the component and locate the **↳ ⌘ Input Options** nested instance in the layers panel
3. With the instance selected, use the **Instance Swap** menu in the **Design Panel** to swap it to the **Text Area** variant
4. Configure the outer **Input [EDS]** properties: set the **Title**, **Description**, and toggle **Label + Description** or **Optional/Required** as needed
5. Configure the inner **Text Area** variant properties: set the **State** (e.g. `Default`, `Focus`, `Filled`, `Read-only`, `Disabled`), **Validation** (`Default` or `Error`), **Placeholder** text, and toggle **Helper Message** on or off

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
