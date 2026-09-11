---
title: Autocomplete
sidebar_position: 1
---

# Autocomplete

Autocomplete is a text input that filters a list of options as the user types and lets them pick one. It supports string and object option lists, custom option rendering, asynchronous search, and the ability to confirm a typed value that is not already in the list.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--introduction"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--introduction)

## When to Use

Use Autocomplete when users need to choose a single value from a list that is too long for radio buttons or a basic select, or when typing is faster than scrolling. It works well for known data sets such as countries, materials, or wells, and for server-side search where results stream in as the user types.

**Avoid Autocomplete for:**

- Free-form text entry with no suggestions - use [TextField](./textfield) instead
- Quick keyword search across a page or site - use [Search](./search) instead
- A small, fixed set of mutually exclusive options - use Radio or a basic Select instead
- Multi-value selection - the EDS 2.0 Autocomplete is single-select

## Structure

Autocomplete is a composite field that combines several pieces:

- **Label**: Identifies the field
- **Description**: Optional context shown below the label
- **Input**: The search field with a leading search icon
- **Clear button**: A close icon that appears when the input has a value
- **Listbox**: A popover that lists filtered options, anchored to the input
- **Helper message**: Optional text below the input for validation feedback or hints

## Guidelines

### Controlled Selection

Use a controlled selection when the surrounding form, page, or another component needs to react to which option is currently chosen - for example to enable a Submit button or to drive a dependent field.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--controlled"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--controlled)

### Object Options

Use object options when each choice carries extra data beyond the label - an ID, a category, a relationship - so that information is available to the rest of the screen once a selection is made.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--object-options"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--object-options)

### Custom Option Rendering

Use a custom row when a single label is not enough to tell options apart - for example a name with a subtitle, an icon, or a status badge. Keep rows scannable and avoid stacking more than two lines of text.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--custom-option-rendering"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--custom-option-rendering)

### Disabled Options

Disable individual options when they exist in the data set but are not available right now - for example out of stock, restricted by role, or already chosen elsewhere. They stay visible so the user can see they exist, but cannot be selected.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--disabled-options"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--disabled-options)

### Allow Custom Value

Let users add a value that is not in the list when the data set is open-ended - tags, project codes, free-text categories. While the user types, an "Add" row appears at the top of the dropdown so they can confirm the new entry.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--allow-custom-value"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--allow-custom-value)

### Loading and Asynchronous Search

Use the loading state while results are being fetched from a server. For server-side search, turn off the built-in filtering and fetch results in response to input changes. Debounce the requests so the server is not called on every keystroke.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--loading"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--loading)

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--async"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--async)

### Validation States

Show the error state to mark the field as invalid, and pair it with a helper message that tells the user what is wrong and how to fix it. Keep the message specific and short.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--invalid"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--invalid)

### Disabled and Read Only

Prefer read-only over disabled when the value should remain visible and copyable but cannot be edited. Use disabled only when the field is currently unavailable and the value is not meaningful to the user.

#### Disabled

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--disabled"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--disabled)

#### Read Only

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--read-only"
  width="100%"
  height="105"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--read-only)

### Forms

Autocomplete works inside react-hook-form via Controller. Remember to reset the form value when the field is cleared so validation and submission stay in sync.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--with-react-hook-form"
  width="100%"
  height="280"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--with-react-hook-form)

### Density

Autocomplete adapts to density modes. Spacious is the default; comfortable provides a more compact layout for dense UIs. The dropdown rows respond to density as well.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--density-modes"
  width="100%"
  height="260"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--density-modes)

## Accessibility

Autocomplete implements the ARIA 1.2 combobox pattern. Labels, descriptions, and helper messages are wired up automatically, and the dropdown announces how many results are available as the user types.

**Keyboard support:**

- **Tab**: Move focus to and from the field
- **Type**: Filter the list as you type
- **Arrow Down / Arrow Up**: Open the listbox and move through options
- **Enter**: Select the highlighted option, or confirm a typed custom value when custom values are allowed
- **Escape**: Close the listbox without changing the selection

## Figma

The Autocomplete component lives in the **EDS Core Components** library as **Autocomplete [EDS]**.

### Variants

The component is defined by two variant axes:

- **State**: Default, Hover, Focus, Active, Active Add Option, Filled, Read-only, Disabled
- **Validation**: Default, Error

Every state combines with both validation values, except for Read-only and Disabled which are only published with Validation = Default - the error styling does not apply when the field cannot be edited.

### Properties

The component exposes the following Figma properties:

- **State** (variant): see list above
- **Validation** (variant): Default or Error
- **Title + Description** (boolean, default on): toggles the entire label block
- **Helper Message** (boolean, default off): toggles the helper-message row beneath the field
- **Helper Message Text** (text): content of the helper-message row
- **Placeholder** (text): placeholder copy for the empty input
- **Text area** (text): the filled-input value used when State = Filled

### Using Autocomplete in Figma

1. In Figma, open the **Assets Panel** and search for **Autocomplete [EDS]**
2. Drag an instance into your frame
3. In the **Design Panel**, set **State** and **Validation**, toggle **Title + Description** / **Helper Message**, and edit the **Placeholder**, **Text area**, and **Helper Message Text** values to match your content

## Do's and Don'ts

:::info **Do**

- Provide a clear, visible label so users know what they are searching for
- Keep option labels short and scannable so users can spot the right choice while typing
- Use a helper message to explain validation errors and how to recover
- Prefer read-only over disabled when the current value should remain visible and copyable

:::

:::danger **Don't**

- Hide or omit the label - placeholder text is not a substitute
- Use Autocomplete when the list is short enough for Radio or a basic Select - the extra typing is friction
- Pre-fill the field with a placeholder that looks like a real value - users may submit it by mistake
- Rely on the dropdown alone to communicate errors - always show a helper message

:::
