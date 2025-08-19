# Chip

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Chip

_Chips_, also known as tags or badges, are advanced badges that represent discrete information.

**More examples available in** **.**

## Guidelines

Chips allow users to make selections, perform an action, input information and attributes, filter content and complete tasks. Chips can transform from free text or predefined text.



# Divider

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Divider

A _divider_ is a thin line that separates content into clear groups.

**More examples available in** **.**

## Guidelines

Dividers are subtle ways to group sections, and can only be used in the colours `**UI Background/Default**`, `**UI Background/Light**` and `**UI Background/Medium**`. Dividers can be used full-width where allowed by parent container, or attached to a column's width.



# List

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# List

_Lists_ organise information into related groups of content.

### Ordered

### Ordered from 15

### Unordered

**More examples available in** **.**

## Guidelines

Bulleted lists are used when order is not of importance. Numbered lists are used when order and hierarchy are needed.



# Popover

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Popover

A _popover_ is a floating card that provides more information or actions on hover or click.

### Activate on click

### Activate on hover

## Guidelines

Popovers provide excess or additional information that does not fit in the main content area. A popover always has an indicator (caret) towards the area in which it is attached. Popovers should never be wider than 560px and their height should not be taller than 80% of the screen.

To dismiss a popover, use the close icon, press the `ESC` key, open another popover or click outside the popover. If there are no actions in the popover, then the close icon should be the first focusable element.

**Caret** direction is available in all directions



# Table

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Table

_Tables_ display data in a structured format.

### Simple table

### Fixed table header

### Compact table

### Table sortable

## Guidelines

Tables display information in an easy to scan format.

-   Use tables if you are displaying information or data that will require minimal interaction such as editing or sorting.
    
-   Consider using a  if the table is using advanced functionalities.
    
-   Use tables to let users compare information in rows and columns.
    

**Table Caption**

-   Describes the whole content of a table.
    
-   Helps users find, navigate and understand tables.
    

**Table Header**

-   Tells users what the rows and columns represent.
    
-   The header row can have icons and text.
    
-   Icons can be used for sorting columns as well as a alternative text.
    

**Table Cell**

-   The cell row can have icons, text, links, inputs, numbers, monospaced numbers and other custom content (by using the placeholder).
    

  

### Header

The header row can have icons and text. Icons can be used for sorting columns as well as a text alternative.

Avoid labels that are too long. Titles should be to the point, short and no more than three words. Note that if the label is longer than the width available, it will be truncated and should have a tooltip provided. Labels should be aligned left except when numeric---then either left or right alignment is permitted.

The `Header` text component includes options for adding units and a placeholder icon for sorting icons. This component uses auto layout to place label text, icons and/or units with the correct spacing. Make sure to resize the component so that the spacing on the right is aligned to the most right part of the contents.

### Cell

The cell row can have icons, text, links, inputs, numbers, monospaced numbers and other custom content (by using the placeholder). For cells containing numbers only, use `Cell numeric monospaced` for better readability, and easier comparison and scannability of numbers between rows.

Colour usage:

-   `Text+static icons/Default` for icons that are not interactive.
    
-   `Interactive Primary/Resting` for icons that are interactive, like checkboxes.
    
-   `Interactive/Disabled/Text` for disabled state and icons that are not interactive.
    
-   `Interactive/Disabled/Fill` for disabled state and icons that are interactive, like checkboxes.
    

If a cell input is used in a column made out of `cell numeric monospaced` components, the text should be aligned to the right to match the alignment of the other cells in the column.



# Table data grid

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Table data grid

_Table_ _data grids_ display data in a grid-like format with advanced functionalities.

## Guidelines

Table data grids are used to display data and are recommended if the table has a large amount of columns/rows and offers advanced functionalities. Consider using a  if you want to display data with simple functionalities.

The header row can have icons and text. Icons can be used for sorting columns as well as a text alternative.

Avoid labels that are too long. Titles should be to the point, short and no more than three words. Note that if the label is longer than the width available, it will be truncated and should have a tooltip provided. Labels should be aligned left except when numeric---then either left or right alignment is permitted.

The header text component includes options for adding units and a placeholder icon for sorting icons. This component uses auto layout to place label text, icons and/or units with the correct spacing. Make sure to resize the component so that the spacing on the right is aligned to the most right part of the contents.

### Cell

The cell row can have icons, text, links, inputs, numbers, monospaced numbers and other custom content (by using the placeholder). For cells containing numbers only, use `cell monospaced numeric` for better readability, and easier comparison and scannability of numbers between rows.

Colour usage:

-   `Text+static icons/Default` for icons that are not interactive.
    
-   `Interactive Primary/Resting` for icons that are interactive, like checkboxes.
    
-   `Interactive/Disabled/Text` for disabled state and icons that are not interactive.
    
-   `Interactive/Disabled/Fill` for disabled state and icons that are interactive, like checkboxes.



# Tooltip

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Tooltip

_Tooltips_ show when hovered, focused or long-pressed (touch), and display information such as a text label or a short description.

## Guidelines

Tooltips disappear after the mouse is no longer hovering the target area, the focus has moved on or the long-press is released. The information provided should be very short and descriptive and explain icon meanings or differences between components.

Tooltips should aim to have a single line of text that does not wrap, and is kept to under 80 characters in length. The position of the tooltip is flexible, and they should always point to the component to which they give information about.