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



# Design

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DATA DISPLAY

# Table data grid

_Table_ _data grids_ display data in a grid-like format with advanced functionalities.

## Implementation in Figma

### Instructions

1.  In Figma go to the **Assets Panel** and search for **data grid**.
    
2.  Drag and drop the components in your frame.
    
3.  Choose the variant from the **Design Panel**.
    

### How to use

1.  Place the table data grid header components needed on the frame/artboard and choose a _variant_ in the **Inspector Panel**.
    
2.  Select a table data grid header in the frame/artboard.
    
3.  Locate and expand the highlighted _layer_ in the **Layers Panel**.
    
4.  Edit the text label.
    
5.  In the **Layers panel** show the unit and/or placeholder icon as needed and adjust the unit text. Drag and drop an icon from the assets panel directly into the placeholder icon using:
    
    1.  Mac: `Command` + `Option`
        
    2.  PC: `Ctrl` + `ALT`
        
6.  There are two ways to change the action icon:
    
    1.  **Drag and drop**
        
        1.  Search or locate an icon in the **Assets Panel**
            
        2.  Drag and drop the icon directly into the placeholder icon using:
            
        3.  Mac: `Command` + `Option`
            
        4.  PC: `Ctrl` + `ALT`
            
    2.  **Manually**
        
        1.  Locate and select the `Icon > Nested icon > Placeholder Icon` or `Icon > Nested icon > chevron down` _layer_ in the **Layers Panel**.
            
        2.  Locate the **Design** tab in the **Inspector Panel**.
            
        3.  Under the **Instance** section, click the icon name to expand the menu.
            
        4.  Choose a new icon.
            
7.  If you have multiple lines text in a cell, adjust the height with 20 pixels per additional line. .
    
8.  Adjust the width of the header to fit the column width of the cells below, where the minimum width is defined by the right spacing.
    

Now you can either use auto layout or constraints.

### How to use auto layout

Auto layout enables easy reuse of the table, with the options to easily resize the width, change the order of the columns, show/hide columns and edit the contents.

1.  Select all the cells and the header cell in one column and create a frame.
    
2.  Add auto layout to the frame.
    
3.  Make sure to name the column frame in the **Layers Panel**.
    
4.  Locate the **Design** tab in the **Inspector Panel**. For each of the cells within a column frame select ´Stretch Left & Right´ at the top of the tab.
    
5.  Repeat step 1 to 4 for all the columns.
    
6.  Select all the column frames and add auto layout.
    
7.  When editing text in the cells, adjust the width of the frame to fit to contents. The other columns will move accordingly.
    

### How to use constraints

1.  Select all the **Table data grid** header layers and convert them to a frame/artboard by using the following shortcut:
    
    1.  Mac: `Command` + `Option` + `G`
        
    2.  PC: `Ctrl` + `ALT` + `G`
        
2.  Make sure to name the new group.
    
3.  Locate the **Design** tab in the **Inspector Panel**.
    
4.  Under the **Constraints** section, set up constraints.
    
5.  Repeat this process for each row that is needed in the table.
    
6.  Once the header and all the rows have been added, select all the groupings and convert them to a frame/artboard by using the following shortcut:
    
    1.  Mac: `Command` + `Option` + `G`
        
    2.  PC: `Ctrl` + `ALT` + `G`
        
7.  Make sure to name the new group.
    
8.  Locate the **Design** tab in the **Inspector Panel**.
    
9.  Under the **Constraints** section, set up constraints.