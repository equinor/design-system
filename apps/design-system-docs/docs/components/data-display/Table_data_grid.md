# Table data grid

_Table_ _data grids_ display data in a grid-like format with advanced functionalities.

## When to Use

Table data grids are used to display data and are recommended if the table has a large amount of columns/rows and offers advanced functionalities. Consider using a if you want to display data with simple functionalities.

## Structure

- Header row (icons and text; icons can be used for sorting columns as well as a text alternative)
- Header text component (options for adding units and a placeholder icon for sorting icons; auto layout places label text, icons and/or units with the correct spacing; resize so that the spacing on the right is aligned to the most right part of the contents)
- Cell row (icons, text, links, inputs, numbers, monospaced numbers and other custom content using the placeholder)
- Monospaced numeric cell (`cell monospaced numeric` for better readability, comparison and scannability)

## Guidelines

Avoid labels that are too long. Titles should be to the point, short and no more than three words. If the label is longer than the width available, it will be truncated and should have a tooltip provided. Labels should be aligned left except when numeric--then either left or right alignment is permitted.

For cells containing numbers only, use `cell monospaced numeric` for better readability, and easier comparison and scannability of numbers between rows.

Colour usage:

- `Text+static icons/Default` for icons that are not interactive.
- `Interactive Primary/Resting` for icons that are interactive, like checkboxes.
- `Interactive/Disabled/Text` for disabled state and icons that are not interactive.
- `Interactive/Disabled/Fill` for disabled state and icons that are interactive, like checkboxes.

If you have multiple lines text in a cell, adjust the height with 20 pixels per additional line.

Adjust the width of the header to fit the column width of the cells below, where the minimum width is defined by the right spacing.

Now you can either use auto layout or constraints.

## Accessibility

## Implementation in Figma

### Instructions

1. In Figma go to the **Assets Panel** and search for **data grid**.
2. Drag and drop the components in your frame.
3. Choose the variant from the **Design Panel**.

### How to use

1. Place the table data grid header components needed on the frame/artboard and choose a variant in the **Inspector Panel**.
2. Select a table data grid header in the frame/artboard.
3. Locate and expand the highlighted layer in the **Layers Panel**.
4. Edit the text label.
5. In the **Layers Panel** show the unit and/or placeholder icon as needed and adjust the unit text. Drag and drop an icon from the assets panel directly into the placeholder icon using:
   - Mac: `Command` + `Option`
   - PC: `Ctrl` + `ALT`
6. There are two ways to change the action icon:
   - Drag and drop
     1. Search or locate an icon in the **Assets Panel**
     2. Drag and drop the icon directly into the placeholder icon using:
     3. Mac: `Command` + `Option`
     4. PC: `Ctrl` + `ALT`
   - Manually
     1. Locate and select the `Icon > Nested icon > Placeholder Icon` or `Icon > Nested icon > chevron down` layer in the **Layers Panel**.
     2. Locate the **Design** tab in the **Inspector Panel**.
     3. Under the **Instance** section, click the icon name to expand the menu.
     4. Choose a new icon.
7. If you have multiple lines text in a cell, adjust the height with 20 pixels per additional line.
8. Adjust the width of the header to fit the column width of the cells below, where the minimum width is defined by the right spacing.

### How to use auto layout

1. Select all the cells and the header cell in one column and create a frame.
2. Add auto layout to the frame.
3. Make sure to name the column frame in the **Layers Panel**.
4. Locate the **Design** tab in the **Inspector Panel**. For each of the cells within a column frame select ´Stretch Left & Right´ at the top of the tab.
5. Repeat step 1 to 4 for all the columns.
6. Select all the column frames and add auto layout.
7. When editing text in the cells, adjust the width of the frame to fit to contents. The other columns will move accordingly.

### How to use constraints

1. Select all the Table data grid header layers and convert them to a frame/artboard by using:
   - Mac: `Command` + `Option` + `G`
   - PC: `Ctrl` + `ALT` + `G`
2. Make sure to name the new group.
3. Locate the **Design** tab in the **Inspector Panel**.
4. Under the **Constraints** section, set up constraints.
5. Repeat this process for each row that is needed in the table.
6. Once the header and all the rows have been added, select all the groupings and convert them to a frame/artboard by using:
   - Mac: `Command` + `Option` + `G`
   - PC: `Ctrl` + `ALT` + `G`
7. Make sure to name the new group.
8. Locate the **Design** tab in the **Inspector Panel**.
9. Under the **Constraints** section, set up constraints.
