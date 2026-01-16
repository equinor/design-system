# Table data grid

## Not in SB

_Table_ _data grids_ display data in a grid-like format with advanced functionalities.

## When to Use

Table data grids are used to display data and are recommended if the table has a large amount of columns/rows and offers advanced functionalities. Consider using a if you want to display data with simple functionalities.

## Structure

- Header row (icons and text; icons can be used for sorting columns as well as a text alternative)
- Header text component (options for adding units and a placeholder icon for sorting icons; auto layout places label text, icons and/or units with the correct spacing; resize so that the spacing on the right is aligned to the most right part of the contents)
- Cell row (icons, text, links, inputs, numbers, monospaced numbers and other custom content using the placeholder)
- Monospaced numeric cell (`cell monospaced numeric` for better readability, comparison and scannability)

## Guidelines

The header row can have icons and text. Icons can be used for sorting columns as well as a text alternative.

Avoid labels that are too long. Titles should be to the point, short and no more than three words. If the label is longer than the width available, it will be truncated and should have a tooltip provided. Labels should be aligned left except when numeric, then either left or right alignment is permitted.

The header text component includes options for adding units and a placeholder icon for sorting icons. This component uses auto layout to place label text, icons and/or units with the correct spacing. Make sure to resize the component so that the spacing on the right is aligned to the most right part of the contents.
