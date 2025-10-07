# Tooltip

_Tooltips_ show when hovered, focused or long-pressed (touch), and display information such as a text label or a short description.

![tooltip](../assets/tooltip.jpg)


## Guidelines

Tooltips disappear after the mouse is no longer hovering the target area, the focus has moved on or the long-press is released. The information provided should be very short and descriptive and explain icon meanings or differences between components.

Tooltips should aim to have a single line of text that does not wrap, and is kept to under 80 characters in length. The position of the tooltip is flexible, and they should always point to the component to which they give information about.

## Accessibility
Keep in mind that if `Tooltip` is added to a non-focusable element, it is inaccessible to people dependent on keyboard navigation and assistive technologies.



## Implementation in Figma

### Instructions

1.  In Figma go to the **Assets Panel** and search for **tooltip**.
2.  Drag and drop the component in your frame.
3.  Choose the variant from the **Design Panel**.

# Code

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

[View in Storybook](https://storybook.eds.equinor.com/index.html?path=/story/data-display-tooltip--docs)

## Do's and don'ts

✅  Use single/short line of text

❌  Do not format the text, such as bold or italics

❌  Do not add images, such as avatars or icons

❌  Do not have links within tooltips