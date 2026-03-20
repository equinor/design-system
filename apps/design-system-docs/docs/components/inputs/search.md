---
title: Search
sidebar_position: 5
---

# Search

Search allows users to quickly locate relevant content within a website or application. It consists of a search input field with a built-in search icon and an optional clear button that appears when text is entered.

{/* TODO: Replace with live Storybook iframe when the next/Search component is merged */}

<!--
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--default"
  width="100%"
  height="68"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--default)
-->

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

### Disabled State

A disabled search field prevents user interaction. Use this sparingly and only when the search functionality is temporarily unavailable.

{/* TODO: Replace with live Storybook iframe when the next/Search component is merged */}

<!--
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--disabled"
  width="100%"
  height="68"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--disabled)
-->

### Compact Mode

For denser interfaces such as toolbars or data tables, Search supports a compact density mode through `EdsProvider`. Compact mode should come with the option to switch to spacious mode for accessibility.

{/* TODO: Replace with live Storybook iframe when the next/Search component is merged */}

<!--
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--compact"
  width="100%"
  height="56"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--compact)
-->

## Accessibility

- **Label**: Always provide a label or `aria-label` that describes what is being searched. This helps screen reader users understand the purpose of the search field.
- **Form context**: Wrap Search in a `<form>` element so assistive technologies can identify it as a search landmark.
- **Keyboard**: Supports Tab focus. The clear button is keyboard-accessible when visible.
- **Disabled state**: Disabled search fields should remain visible to screen readers. Consider communicating why the search is unavailable.

{/* TODO: Replace with live Storybook iframe when the next/Search component is merged */}

<!--
<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-search--accessibility"
  width="100%"
  height="68"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-search--accessibility)
-->

## Figma

### Components

- **Search [EDS]**: Search input field with built-in search icon and conditional clear button

### Using the Search in Figma

1. In Figma, go to the **Assets Panel** and search for **Search**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

## Do's and Don'ts

:::info **Do**

- Wrap Search in a `<form>` element for proper accessibility
- Provide a descriptive `aria-label` or visible label
- Size the search field to match the expected query length
- Use Search to supplement existing navigation
- Allow switching from compact to spacious density for accessibility
  :::

:::danger **Don't**

- Rely on placeholder text as the only source of guidance - it disappears on input
- Use Search as a replacement for well-structured navigation
- Make the search field so narrow that typical queries are cut off
- Disable the search field without communicating why it is unavailable
  :::
