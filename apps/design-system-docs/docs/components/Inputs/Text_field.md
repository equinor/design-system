# Text field

A _text field_ lets users enter, interact and edit content, typically in forms and dialogs.

        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=inputs-textfield--introduction
        "
        width="100%"
        height="100"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/inputs-textfield--docs)

## When to use

`TextField` should be discoverable, clear and efficient.

- Text fields should stand out and point that users can input information
- Text field states should be **clearly** distinguished from one another
- Text fields should make it easy to understand the required information and to address any errors
<iframe

## Structure

- Single line
- Multiline

## Guidelines

Text fields are used for long and short amounts of text. `Text inputs` are for a single line of text while `text areas` are for more than a single line of text.

The component includes options for writing unit for the field and a placeholder icon. This component uses auto layout to place an icon and/or unit with the correct spacing next to each other.

::: Note
While `type="number"` does provide native validation, the implementation is inconsistent across browsers. We instead recommend using custom validation.
:::

### Date and time

Textfield can be used with the native `type` prop which allows the usage of `"date"`/`"time"`/`"datetime-local"` to display the browser's built-in date/time pickers. Note that icon should not be used here, as browsers implement this input in different ways and some, such as Chrome, add their own icons inside the input.

::: Note
For a more feature rich datepicker please use our `DatePicker` and `DateRangePicker` components.
:::

## Implementation in Figma

1. In Figma go to the **Assets Panel** and search for **text field**.
2. Drag and drop the component in your frame.
3. Rename and resize the component if needed.
4. Choose the variant from the **Design Panel**.

## Do's and don'ts

✅ Use a label for the text field

❌ Do not remove the label

❌ Do not end placeholder text with a period for inputs
