# Selection controls

_Selection controls_ allow users to select options, make decisions and set preferences.

## When to use

- Allow users to select options, make decisions and set preferences
- Are to be visible and understandable at a quick glance
- Are always accompanied with a clear label

## Structure

#### Checkbox

The checkboxes makes it easy to compare available options. They have also been in user interfaces for a long time and should be used as expected.

#### Radio button

Exposes all available options and makes it easy to compare available options.

#### Switch

- Toggle a single item on or off
- Immediately activate or deactivate something
- Switches make it easy to compare available options

## Guidelines

Selection controls are to be visible and understandable at a quick glance. Selected options are more visible than unselected. Selection controls are always accompanied with a clear label. Make sure that the labels are surrounded with a `clickbound` that activates the selection control as well as the control itself.

## Accessibility

To comply with accessibility, a ``label`` is always required on inputs. In some cases though, a visual label is not desirable. In such cases ``aria-label`` or ``aria-labelledby`` should be used.

## Implementation in Figma

1. In Figma go to the **Assets Panel** and search for **selection controls**.
2. Drag and drop the component in your frame.
3. Rename and resize the component if needed.
4. Choose the variant from the **Design Panel**.

## Do's and don'ts

✅  Use same type checkbox in a group

❌  Do not mix different selection controls within a grouped list

❌  Do not resize any of the selection controls