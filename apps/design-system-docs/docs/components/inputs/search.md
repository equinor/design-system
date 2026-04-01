---
title: Search
sidebar_position: 5
---

# Search

Search allows users to quickly locate relevant content within a website or application. It consists of a search input field with a built-in search icon and an optional clear button that appears when text is entered.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--introduction"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--introduction)

## When to Use

Use Search when users need help finding relevant information quickly on a website or in an application. It is particularly useful when the content is large or complex and users need to locate specific items by entering keywords or phrases.

**Avoid Search for:**

- Content that is easily navigable without search - rely on clear navigation instead
- Replacing solid navigation design - Search should supplement, not replace primary navigation
- Filtering structured data in tables - use **Chip** or dedicated filter controls instead

## Structure

The Search component is a composite element consisting of:

- **Search icon**: A magnifying glass icon on the left side indicating the field's purpose
- **Input field**: A text input where users type their query
- **Clear button**: A close icon button that appears when text is entered, allowing users to quickly clear the field

## Guidelines

### Width

The width of the search field should correspond to the typical length of search queries users are expected to enter. For example, a search for a personal identification number requires a narrower field than a site-wide content search. Field size signals to users what kind of content they can input - avoid excessively short fields that force content scrolling.

### Placeholder Text

Use placeholder text with care. It disappears when users begin typing, which can cause confusion. Placeholder text must also meet accessibility contrast requirements, and screen readers handle it inconsistently. Where possible, provide guidance through labels or descriptions instead.

### Labels

Use a visible label above the search field when the search purpose is not immediately obvious, or when the search field is part of a larger form. In standalone search contexts, an `aria-label` is sufficient.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--without-label"
  width="100%"
  height="68"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--without-label)

### Description and Helper Message

Use `description` to provide additional context about what the user can search for. Use `helperMessage` for validation feedback or hints displayed below the field.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--with-description"
  width="100%"
  height="120"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--with-description)

### Clear Button

A clear button appears automatically when the input has a value, allowing users to quickly reset the field. Use the `onClear` callback to handle clear events. The `clearLabel` prop lets you customize the accessible label for localization (defaults to "Clear search").

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--with-clear-button"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--with-clear-button)

### Controlled and Uncontrolled

Search supports both controlled and uncontrolled modes. In controlled mode, manage the value via `value` and `onChange` props. In uncontrolled mode, provide `defaultValue` and optionally use `onClear`.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--controlled"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--controlled)

### Invalid State

Use the `invalid` prop to indicate a validation error. Pair it with `helperMessage` to explain what went wrong.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--invalid"
  width="100%"
  height="120"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--invalid)

### Disabled State

A disabled search field prevents user interaction. Use this sparingly and only when the search functionality is temporarily unavailable. The clear button is automatically hidden when the field is disabled.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--disabled"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--disabled)

### Read-Only State

A read-only search field displays the current value but prevents editing. The clear button is hidden in this state.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--read-only"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--read-only)

## Accessibility

- **Label**: Always provide a `label` or `aria-label` that describes what is being searched. This helps screen reader users understand the purpose of the search field.
- **Semantic HTML**: The component renders inside a `<search>` element, providing a search landmark for assistive technologies.
- **Keyboard**: Supports Tab focus. The clear button is keyboard-accessible when visible, and focus returns to the input after clearing.
- **ARIA associations**: `description` and `helperMessage` are automatically associated with the input via `aria-describedby`.
- **Disabled state**: Disabled search fields remain visible to screen readers. Consider communicating why the search is unavailable.

## Figma

### Components

Search is available as a variant of the shared input component in Figma:

- **Input [EDS]**: Shared input component used for all input types, including Search

### Using Search in Figma

1. In the **Assets Panel**, search for **Input** and drag the **Input [EDS]** component into your frame
2. Select the component and locate the **↳ ⌘ Input Options** nested instance in the layers panel
3. With the instance selected, use the **Instance Swap** menu in the **Design Panel** to swap it to the **Search** variant — this adds the search icon as the left adornment
4. Configure the outer **Input [EDS]** properties: set the **Title**, **Description**, and toggle **Label + Description** or **Optional/Required** as needed
5. Configure the inner **Search** variant properties: set the **State** (e.g. `Default`, `Focus`, `Disabled`), **Validation** (`Default` or `Error`), **Placeholder** text, and toggle **Helper Message** or **Right Adornment** (clear button) on or off

## Do's and Don'ts

:::info **Do**

- Provide a descriptive `label` or `aria-label`
- Use `onClear` to handle clear events and reset related state
- Size the search field to match the expected query length
- Use Search to supplement existing navigation
- Use `helperMessage` to communicate validation errors
  :::

:::danger **Don't**

- Rely on placeholder text as the only source of guidance - it disappears on input
- Use Search as a replacement for well-structured navigation
- Make the search field so narrow that typical queries are cut off
- Disable the search field without communicating why it is unavailable
  :::
