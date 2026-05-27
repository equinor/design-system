---
title: Autocomplete
sidebar_position: 8
---

# Autocomplete

Autocomplete is a text input that filters a list of options as the user types and lets them pick one. It supports string and object option lists, custom option rendering, asynchronous search, and the ability to confirm a typed value that is not in the list.

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

All Autocomplete instances support:

- **Filtering**: Case-insensitive substring match by default, overridable with `optionsFilter`
- **Keyboard navigation**: Arrow keys, Enter, and Escape
- **Loading state**: Spinner inside the field while options are fetched
- **Custom values**: Optional `Add: {value}` entry for confirming a typed value not in the list

## Guidelines

### Controlled selection

Use `value` and `onValueChange` to control the selected option. `onValueChange` receives the full option, or `undefined` when the user clears the field.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--controlled"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--controlled)

### Object options

When options are objects rather than strings, provide `getOptionLabel` so the component knows which field to display and search by. `onValueChange` returns the full object, giving you access to all of its fields.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--object-options"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--object-options)

### Custom option rendering

Use `renderOption` to show richer rows in the dropdown - icons, subtitles, badges, and so on. `getOptionLabel` still controls what appears in the input after selection and what is matched while typing. Pair with `optionsFilter` to search across multiple fields at once.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--custom-option-rendering"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--custom-option-rendering)

### Disabled options

Use `optionDisabled` to prevent specific options from being chosen. Disabled options remain visible and keyboard-navigable but cannot be selected, which keeps the list complete and predictable.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--disabled-options"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--disabled-options)

### Allow custom value

Set `allowCustomValue` to let users confirm a value that is not in the list. While the user types, an `Add: {value}` row appears at the top of the dropdown. Use `onCustomValueConfirm` to handle the new value (for example, append it to your options array and set it as the selection). Note that `onValueChange` fires only for existing list items - new values go through `onCustomValueConfirm`.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--allow-custom-value"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--allow-custom-value)

### Loading and asynchronous search

Set `loading` while options are being fetched. The spinner replaces the clear button and a loading message is shown in the dropdown. For server-side search, pass `optionsFilter={() => true}` to skip local filtering and use `onInputChange` to trigger fetches as the user types. Debounce requests so the server is not hit on every keystroke.

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

### Validation states

Use the `invalid` prop to show error styling. Pair it with `helperMessage` to explain what went wrong - the helper message is announced as a live alert when the field is invalid.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--invalid"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--invalid)

### Disabled and read-only

Avoid `disabled` where possible. Prefer `readOnly`, which keeps the current value visible and accessible while preventing edits.

#### Disabled

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--disabled"
  width="100%"
  height="350"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--disabled)

#### Read-only

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--read-only"
  width="100%"
  height="105"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--read-only)

### Forms

Autocomplete integrates with `react-hook-form` via `Controller`. Wire `value` and `onValueChange` to `field.value` and `field.onChange`, and pass `onClear={() => field.onChange(undefined)}` so clearing the field also resets the form value. Connect validation errors through `invalid` and `helperMessage`.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--with-react-hook-form"
  width="100%"
  height="280"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--with-react-hook-form)

### Density

Autocomplete adapts to density modes via the `data-density` attribute on a parent element. Spacious is the default; comfortable provides a more compact layout for dense UIs. The dropdown items respond to density as well.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-inputs-autocomplete--density-modes"
  width="100%"
  height="260"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-inputs-autocomplete--density-modes)

## Accessibility

Autocomplete implements the ARIA 1.2 combobox pattern. The input is exposed as `role="combobox"` with `aria-autocomplete="list"`, and the dropdown as `role="listbox"`. Labels, descriptions, and helper messages are connected automatically via `aria-describedby`, and the active option is tracked through `aria-activedescendant`.

**Keyboard support:**

- **Tab**: Move focus to and from the field
- **Type**: Filter the list as you type
- **Arrow Down / Arrow Up**: Open the listbox and move through options
- **Enter**: Select the highlighted option, or confirm a typed custom value when `allowCustomValue` is enabled
- **Escape**: Close the listbox without changing the selection

**Screen reader support:**

- The field label is announced on focus
- A live region announces the number of available results, "No results", or the loading text as the list updates
- Disabled options are marked with `aria-disabled` and skipped on selection
- The clear button has an accessible label (`clearLabel`, default "Clear") and can be localised

**Custom values:**

- The `Add: {value}` entry is announced with a descriptive label so screen-reader users know they are creating a new option rather than picking from the list

## Figma

The Autocomplete component lives in the **EDS Core Components** library as **`Autocomplete [EDS]`**.

### Variants

The component is defined by two variant axes:

- **State**: `Default`, `Hover`, `Focus`, `Active`, `Active Add Option`, `Filled`, `Read-only`, `Disabled`
- **Validation**: `Default`, `Error`

Every state combines with both validation values, except for `Read-only` and `Disabled` which are only published with `Validation = Default` - the error styling does not apply when the field cannot be edited.

### Properties

The component exposes the following Figma properties:

- **State** (variant): see list above
- **Validation** (variant): `Default` or `Error`
- **Title + Description** (boolean, default on): toggles the entire label block
- **Helper Message** (boolean, default off): toggles the helper-message row beneath the field
- **Helper Message Text** (text): content of the helper-message row
- **Placeholder** (text): placeholder copy for the empty input
- **Text area** (text): the filled-input value used when `State = Filled`

### Using Autocomplete in Figma

1. In Figma, open the **Assets Panel** and search for **Autocomplete [EDS]**
2. Drag an instance into your frame
3. In the **Design Panel**, set **State** and **Validation**, toggle **Title + Description** / **Helper Message**, and edit the **Placeholder**, **Text area**, and **Helper Message Text** values to match your content

## Do's and Don'ts

:::info **Do**

- Provide a clear, visible label so users know what they are searching for
- Use `getOptionLabel` and `getOptionValue` when options are objects, so filtering and selection stay stable across renders
- Use `optionsFilter={() => true}` together with `onInputChange` and `loading` for server-side search
- Debounce asynchronous fetches so the server is not hit on every keystroke
- Use `helperMessage` to explain validation errors when `invalid` is set
- Prefer `readOnly` over `disabled` when the value should remain visible and accessible

:::

:::danger **Don't**

- Hide or omit the label - placeholder text is not a substitute
- Use Autocomplete for free-form text input with no suggestions - use [TextField](./textfield) instead
- Treat Autocomplete as a site search - use [Search](./search) instead
- Mix `onValueChange` and `onCustomValueConfirm` expectations - `onValueChange` fires only for existing list items, `onCustomValueConfirm` for new typed values
- Override `onMouseDown`, `onClick`, `onFocus`, `onBlur`, `onKeyDown`, or `onKeyUp` - these power the combobox behaviour and are not configurable

:::
