---
title: Button
sidebar_position: 2
hide_title: true
description: 'Buttons are the primary action triggers in our design system. They help users perform concrete actions like saving, submitting forms, or confirming decisions. With variants to indicate hierarchy (primary, secondary, ghost) and tones to convey intent (accent, neutral, danger), buttons guide users toward meaningful interactions. Always pair buttons with clear, action-oriented labels.'
---

{/* Portable-stories pilot: this story renders natively (no iframe) via
composeStories — see src/components/StoryCanvas. */}

<StoryCanvas of="Button/Introduction" showLink />

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

<StoryCanvas of="Button/AllVariants" showLink />

### Tones

Tones communicate the intent or nature of an action:

- **Accent**: The default tone for standard actions. Uses the brand colour to draw attention.
- **Neutral**: A subdued option for actions that shouldn't compete for attention.
- **Danger**: Reserved for destructive actions (e.g., "Delete"). Danger buttons should be placed in opposite order to positive actions in button groups to prevent accidental activation.

<StoryCanvas of="Button/Tones" showLink />

### Sizes

Buttons come in two sizes. The height of each size follows the density the button sits in:

| Size    | Compact | Comfortable | Relaxed | Use Case                            |
| ------- | ------- | ----------- | ------- | ----------------------------------- |
| Small   | 16px    | 24px        | 32px    | Tight spaces, inline actions        |
| Default | 28px    | 36px        | 44px    | Standard use across most interfaces |

<StoryCanvas of="Button/Sizes" showLink />

### Density

Buttons follow the density set on a parent element, so their padding, label size and icon size change together with the rest of the layout:

- **Compact**: For dense views such as tables, toolbars and dashboards, where showing more on screen is worth smaller targets
- **Comfortable**: The default, for ordinary application UI
- **Relaxed**: For touch screens and pages where targets need to be larger

The [density guidelines](/docs/Next/foundation/design-tokens/spacing#density) explain how to choose between them.

<StoryCanvas of="Button/DensityComparison" showLink />

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

<StoryCanvas of="Button/IconOnlyVariants" showLink />

**Circular icon-only buttons**

<StoryCanvas of="Button/CircularIconOnly" showLink />

## Accessibility

**Standard Buttons**

- **Keyboard**: Supports Tab focus and activates with Enter or Space
- **Disabled state**: Disabled buttons should remain visible to screen readers. Consider providing a tooltip explaining why the button is disabled.

**Icon-Only Buttons**

- Always provide an accessible name for screen readers
- Avoid icon-only buttons unless space is severely constrained (e.g., toolbars)

**Density and target size**

Buttons are smaller at Compact density, where a small button is 16px high. Check that buttons are large enough to hit at the density you ship, as described in the [target size guidelines](/docs/Next/foundation/accessibility#target-size). A default button at Relaxed density is 44px high, the size we recommend for touch screens.

## Figma

### Components

- **Button [EDS Beta]**: One component for every button, with or without a text label

### Using the Button in Figma

1. In Figma, go to the **Assets Panel** and search for **Button**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**

Density is not a property of the component. Set the density with a variable mode on your top-level frame, and every button inside it follows.

### Property Structure

- **Icon button** - Off for a button with a text label, On for an icon-only button
- **Variant** - Primary, Secondary, Ghost
- **Tone** - Accent, Neutral, Danger
- **Size** - Default, Small
- **Style** - Default (square) or Rounded (circular). Only icon-only buttons have the Rounded style
- **State** - Default, Hover, Focus, Active, Disabled. Use these to show a state in a design; in the product the button changes state on its own

### Adding Icons

For buttons with a text label:

- Toggle **Has Leading Icon** to add an icon before the label
- Toggle **Has Trailing Icon** to add an icon after the label
- Use **↳ Leading Icon** and **↳ Trailing Icon** to swap to a different icon from the library

For icon-only buttons, use **↳ Leading Icon** to choose the icon.

## Do's and Don'ts

:::info **Do**

- Use variants to differentiate hierarchy
- Keep buttons in groups visually consistent, except when one is disabled
- Place danger buttons in opposite order to positive actions (Cancel before Delete) to prevent accidental activation
- Use icons that clearly communicate their intended purpose
- Provide accessible names for icon-only buttons
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
