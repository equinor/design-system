---
title: Input
sidebar_position: 4
---

# Input

Input is a foundational form element for collecting user data. It offers basic functionality and is ideal when you need full control over layout and validation—serving as a building block for higher-level components like TextField.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--introduction"
  width="100%"
  height="70"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--introduction)

## When to Use

Use Input when you need a basic input field without additional functionality, or when building custom fields and composite components where you want full control over error handling and layout.

**Avoid Input when:**

- You need a complete form field with label, description, and validation message—use TextField instead
- The field requires built-in accessibility features—use TextField which handles composition automatically

## Guidelines

### Input Types

Input supports a variety of native HTML input types for different data entry needs.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--types"
  width="100%"
  height="175"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--types)

### Validation States

Use the `invalid` prop to indicate validation errors. The input displays a red border and adornments inherit the error color.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--validation-states"
  width="100%"
  height="120"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--validation-states)

### Disabled & Read Only

Avoid using `disabled` where possible. Consider using `readOnly` instead—it keeps the value visible and accessible while preventing edits.

- **Disabled**: The input is non-interactive and visually dimmed
- **Read Only**: The value is visible but not editable, maintaining better accessibility

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--states"
  width="100%"
  height="225"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--states)

### Using with Labels

For a complete form field with label, description, helper message, and required/optional indicators, use the TextField component instead—it handles all the composition and accessibility for you.

When using Input with a visible label, use the Field component for proper spacing.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--with-label"
  width="100%"
  height="160"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--with-label)

### Density

Input supports two density modes to fit different UI contexts:

- **Spacious**: The default density with comfortable padding
- **Comfortable**: A more compact option for dense UIs like data tables

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--compact"
  width="100%"
  height="115"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--compact)

### Adornments

Use `startText` and `endText` for prefix/suffix text (e.g., "$", "USD", "km"). These stay neutral in all states.

Use `startAdornment` and `endAdornment` for elements (icons, buttons) that should inherit state colors—turning red when invalid.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--with-adornments"
  width="100%"
  height="380"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--with-adornments)

### Textarea Mode

Input can render as a multi-line textarea by setting `as="textarea"`.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-input--casted"
  width="100%"
  height="90"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-input--casted)

## Accessibility

When using Input without a visible label (e.g., in search fields or toolbars), you **must** provide an `aria-label` for accessibility.

While labels may be visually hidden in special cases (such as in tables), they must still be meaningful for screen readers using `aria-label` or `aria-labelledby`.

**Keyboard support:**

- **Tab**: Move focus to and from the input
- **Type**: Enter text when focused

**For form fields with visible labels**, use the TextField component instead—it handles accessibility automatically.

## Do's and Don'ts

:::info **Do**

- Use Input as a building block for custom compositions
- Provide `aria-label` when no visible label is present
- Use `readOnly` instead of `disabled` when the value should remain visible
- Use TextField for standard form fields with labels
- Place labels and descriptions above the input field
  :::

:::danger **Don't**

- Use Input when TextField would provide needed functionality
- Leave inputs without an accessible name (label or aria-label)
- Overuse the disabled state—prefer readOnly when appropriate
- Hide validation messages behind obscured elements
  :::
