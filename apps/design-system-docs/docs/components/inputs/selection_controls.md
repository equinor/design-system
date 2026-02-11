---
title: Selection controls
sidebar_position: 6
---

# Selection controls

Selection controls allow users to select options, make decisions, and set preferences. They are designed to be visible and understandable at a quick glance, helping users make confident choices in forms and settings.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
  <div>
    <strong>Checkbox</strong>
    <iframe
      class="sb-iframe"
      src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-checkbox--introduction"
      width="100%"
      height="70"
      frameborder="1"
    ></iframe>
  </div>
  <div>
    <strong>Radio</strong>
    <iframe
      class="sb-iframe"
      src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-radio--introduction"
      width="100%"
      height="70"
      frameborder="1"
    ></iframe>
  </div>
  <div>
    <strong>Switch</strong>
    <iframe
      class="sb-iframe"
      src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-switch--introduction"
      width="100%"
      height="70"
      frameborder="1"
    ></iframe>
  </div>
</div>

View Storybook: [Checkbox](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-checkbox--introduction) · [Radio](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-radio--introduction) · [Switch](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-switch--introduction)

## When to Use

Use selection controls when users need to:

- Select one or more options from a set
- Make binary decisions (on/off, yes/no)
- Set preferences or toggle settings

**Choosing the right control:**

| Control  | Use Case                                        |
| -------- | ----------------------------------------------- |
| Checkbox | Multiple selections allowed, or accepting terms |
| Radio    | Only one selection from a group                 |
| Switch   | Immediate on/off toggle with instant effect     |

**Avoid selection controls for:**

- More than seven options - use Select or Autocomplete instead
- Navigating between content views - use Tabs or ToggleGroup instead
- Filtering content - use Chip instead

## Structure

### Checkbox

Checkboxes allow users to select one or more options from a set, or toggle a single option on/off. They are ideal for accepting terms and conditions or selecting multiple items from a list.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-checkbox--spacious"
  width="100%"
  height="275"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-checkbox--spacious)

### Radio

Radio buttons allow users to select exactly one option from a group. They expose all available options, making it easy to compare choices at a glance.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-radio--spacious"
  width="100%"
  height="225"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-radio--spacious)

### Switch

Switches toggle a single setting on or off. Changes take effect immediately when the user interacts with the switch - there's no need for a submit action.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-switch--states"
  width="100%"
  height="275"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-switch--states)

## Guidelines

### Labels and Grouping

Selection controls should always be accompanied by a clear label. Make sure labels are concise and use consistent wording across grouped controls. Selection controls use the [Field](./field) component internally to manage label positioning and accessibility.

**For checkboxes and radios:**

- Wrap multiple controls in a `<fieldset>` with a `<legend>` explaining the question
- Keep answer options brief and linguistically parallel
- Place critical information before the choices to help users decide confidently

**For switches:**

- Labels should describe what the function controls, not its current state
- The label should make sense when read aloud followed by "on/off"
- Avoid mentioning on/off status in the label text

### Layout and Placement

Position selection controls vertically whenever possible for better scannability. Horizontal layouts are acceptable only for:

- Two short-label options (e.g., "Yes" / "No")
- Rating scales (Likert scales)

### Option Ordering

Sort options alphabetically unless there's a compelling reason otherwise. Be cautious about placing the most common option first for sensitive or personal questions.

### Preselection

Exercise caution with preselected options, as they can influence user choice. For consent confirmations, checkboxes must never be pre-selected to ensure voluntary agreement.

### Indeterminate State (Checkbox)

The indeterminate state indicates a partially checked condition - useful for "select all" scenarios where some, but not all, child items are selected.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-checkbox--grouped-checkbox"
  width="100%"
  height="180"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-checkbox--grouped-checkbox)

### Grouped Radio Buttons

Radio buttons with the same `name` attribute form a group. Users can navigate within the group using arrow keys (↑↓ or ←→).

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-radio--grouped-radio"
  width="100%"
  height="180"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-radio--grouped-radio)

### Density

All selection controls support two density modes:

- **Spacious**: The default density with comfortable padding
- **Comfortable**: A more compact option for dense UIs like data tables

### Error Handling

When validation fails on grouped controls, apply error messages to the entire group (the fieldset) rather than individual items.

## Accessibility

A `label` is always required on selection controls. In cases where a visual label is not desirable, use `aria-label` or `aria-labelledby` to provide an accessible name.

**Keyboard support:**

- **Checkbox/Switch**: Tab to focus, Space to toggle
- **Radio**: Tab to focus the group, arrow keys to navigate between options

**Without visible labels:**

When no visible label is needed (e.g., in tables), use `aria-label` to provide an accessible name for screen readers.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-selection-controls-checkbox--without-visible-label"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-selection-controls-checkbox--without-visible-label)

**Status announcements (Switch):**

If toggling a switch triggers an important status change, announce it with an `aria-live` region so screen reader users are informed of the change.

## Figma

### Using Selection Controls in Figma

1. In Figma, go to the **Assets Panel** and search for **selection controls**
2. Drag and drop the component into your frame
3. Rename and resize the component if needed
4. Choose the variant from the **Design Panel**

## Do's and Don'ts

:::info **Do**

- Use the same type of selection control within a grouped list
- Position controls vertically for better scannability
- Always provide clear labels for each control
- Use `fieldset` and `legend` for grouped checkboxes and radios
- Make the clickable area include both the control and its label
  :::

:::danger **Don't**

- Mix different selection controls within the same grouped list
- Resize any of the selection controls beyond their intended dimensions
- Pre-select consent checkboxes
- Use switches for form questions - use **Radio** or **Checkbox** instead
- Use more than seven options in one group - consider **Select** or **Autocomplete**
  :::
