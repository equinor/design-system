---
title: Button
sidebar_position: 2
---

# Button

Buttons are the primary action triggers in our design system. They help users perform concrete actions like saving, submitting forms, or confirming decisions. With variants to indicate hierarchy (primary, secondary, ghost) and tones to convey intent (accent, neutral, danger), buttons guide users toward meaningful interactions. Always pair buttons with clear, action-oriented labels.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-button--default"
  width="100%"
  height="70"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-button--default)

## When to Use

Use a button when a concrete action needs to be performed, such as saving or submitting a form, or when the application state changes (opening dialogs, starting processes).

**Avoid buttons for:**

- Navigating between pages - use **Link** instead
- Filtering information in lists or tables - use **Chip** instead
- Displaying selected filters - use **Chip** instead

## Structure

All button variants support:

- **Text-only** (default)
- **Left/right icons** (paired with text)
- **Icon-only** (requires an accessible name)

## Guidelines

### Variants

Use variants to guide users to the most important action:

| Variant   | Emphasis | Use Case                               |
| --------- | -------- | -------------------------------------- |
| Primary   | High     | Main actions (e.g., "Submit", "Save")  |
| Secondary | Medium   | Supporting actions (e.g., "Cancel")    |
| Ghost     | Low      | Tertiary actions (e.g., toolbar icons) |

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-button--all-variants"
  width="100%"
  height="370"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-button--all-variants)

### Tones

Tones communicate the intent or nature of an action:

- **Accent**: The default tone for standard actions. Uses the brand colour to draw attention.
- **Neutral**: A subdued option for actions that shouldn't compete for attention.
- **Danger**: Reserved for destructive actions (e.g., "Delete"). Danger buttons should be placed in opposite order to positive actions in button groups to prevent accidental activation.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-button--tones"
  width="100%"
  height="175"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-button--tones)

### Sizes

Buttons come in three sizes to accommodate different contexts:

| Size    | Spacious | Comfortable | Use Case                              |
| ------- | -------- | ----------- | ------------------------------------- |
| Small   | 24px     | 20px        | Compact spaces, inline actions        |
| Default | 36px     | 24px        | Standard use across most interfaces   |
| Large   | 44px     | 36px        | Prominent actions, touch-friendly UIs |

### Density

Density modes adjust the overall spacing and sizing of buttons:

- **Spacious**: The default density with comfortable padding. Recommended for most interfaces.
- **Comfortable**: A more compact option for dense UIs like toolbars or data tables. Must provide a way to switch to spacious mode for accessibility.

### Button Text

- Keep text short: 2-3 words maximum
- Use imperative verbs (send, sign, change)
- Capitalise only the first word
- Ensure unique button text per page
- Use consistent terminology throughout the service

### Icons

- Icons can appear before (preferred) or after the button text
- Icons paired with text should be decorative and hidden from screen readers
- Limit to one icon per button
- Icons must be directly related to the action and label of the button

**Icon-only buttons**

When space is limited, buttons can display only an icon. Icon-only buttons:

- Create square buttons by default
- Can be circular for a softer appearance
- Must always have an accessible name for screen readers

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-button--icon-only-variants"
  width="100%"
  height="120"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-button--icon-only-variants)

**Circular icon-only buttons**

Use the `round` prop on icon-only buttons to create circular buttons for a softer appearance.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-button--circular-icon-only"
  width="100%"
  height="130"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-button--circular-icon-only)

## Accessibility

**Standard Buttons**

- **Keyboard**: Supports Tab focus and activates with Enter or Space
- **Disabled state**: Disabled buttons should remain visible to screen readers. Consider providing a tooltip explaining why the button is disabled.

**Icon-Only Buttons**

- Always provide an accessible name for screen readers
- Avoid icon-only buttons unless space is severely constrained (e.g., toolbars)

**Comfortable Density**

Comfortable density should come with the option to switch to spacious mode for accessibility reasons.

## Figma

### Components

The Button is available as two components in Figma:

- **Button [EDS]**: Standard button with text label and optional icons
- **Icon Button [EDS]**: Compact button displaying only an icon

### Using the Button in Figma

1. In Figma, go to the **Assets Panel** and search for **Button** or **Icon Button**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

### Property Structure

Both components use a nested structure:

**Top level** - Set the **Tone** (Accent, Neutral, or Danger)

**Geometry Options** - Configure the **Size** (Large, Default, Small). For Icon Button, toggle **Round** for circular buttons.

**Button content** (⌘ Button or ⌘ Icon Button) - Set the **Variant** (Primary, Secondary, Ghost), **State**, and configure icons/labels.

### Adding Icons

For buttons with icons:

- Toggle **Show Leading Icon** to add an icon before the label
- Toggle **Show Trailing Icon** to add an icon after the label
- Click the icon instance to swap to a different icon from the library

## Do's and Don'ts

:::info **Do**

- Use variants to differentiate hierarchy
- Keep buttons in groups visually consistent, except when one is disabled
- Place danger buttons in opposite order to positive actions (Cancel before Delete) to prevent accidental activation
- Use icons that clearly communicate their intended purpose
- Provide accessible names for icon-only buttons
- Allow switching from comfortable to spacious density for accessibility
- Place primary buttons first when grouping (exception: Previous/Next ordering)
  :::

:::danger **Don't**

- Apply the same variant to all action buttons - users need to understand which action has the most emphasis
- Wrap text over multiple lines - scale the width to fit text on one line
- Use icons that can mislead the main action
- Rely on colour alone to convey meaning - ensure text and icons are clear
- Disable buttons without explanation - add a tooltip explaining why it's disabled
- Use more than one primary-variant accent-tone button per page
  :::
