# System icons

System icons enhance interfaces by adding visual communication to actions, status and feedback while reducing cognitive load. They are to provide meaning at a glance.

## Guidelines

The EDS system icons are built on a copy of the [outlined GMD icons](https://fonts.google.com/icons?icon.set=Material+Icons&icon.style=Outlined) provided open-source by Google. The icons have been customised and renamed for Equinor's use and are available in EDS Storybook.

There are over 600 icons available divided in logical categories to make them easy to find.

Simple and clear icons require a strict underlying grid. The EDS icons are built on a 24x24px grid. System icons can be used in 24px and 16px sizes. However, when using compact mode the size of icons is 18px.

:::danger Don't
-   System icons are not to be used as product icons or as a favicon
:::

## Design

### Implementation in Figma

1.  Locate the **Assets** tab in the **Layers Panel**.
    
2.  There are two ways to locate the `System icon` component needed:
    
    1.  Use the search bar to search for a component grouping name or variation name.
        
    2.  Scroll through the folders list and open the relevant grouping.
        
3.  Once the component needed is located, click and drag it into the frame/artboard.
    
4.  Hold `Shift` when resizing the `System icon` to retain its aspect ratio.



## Library

All icons are available on EDS Storybook and can also be installed from NPM.

## Contribution

Missing a system icon? You can make it following these simple guidelines.

-   First make sure that the icon you are missing does not already exist by searching for all associated keywords in the library
-   All icons should be understandable regardless of language or location
    

### Style

Each icon needs to be reduced to its minimal form, being bold, geometrical and symmetrical. To reflect the rounded corners of the logo, icons need to have rounded corners of 2px where possible; however, internal corners should be square and not rounded. To reflect the brand, icons use a consistent stroke of 2px this includes curves, angles and both interior and exterior strokes. The default icon is outline, a filled icon may be provided only if there is an outlined icon.

The EDS icons are always facing forward and never rotated or dimensional. The icons are made for legibility and are not too literal or complex, neither are they overly playful or bubbly.

:::warning Exceptions
Extremely complex shapes sometimes require complex details. The guidelines allow for subtle adjustments that help improve legibility of icons these adjustments are referred to as **optical corrections**. This exception allows for use of 1.5px internal or external strokes. Using this exception should be avoided if possible.
:::

### Making a new icon

-   Create an artboard that is 24x24px
    -   Place the `System icon grid` from the **Utilities** page in **Assets File** as the bottom layer and lock it
    -   Choose the grid shape: circle, square, vertical rectangle or horizontal rectangle
    -   Make sure to align all artwork to the pixel grid
-   Never use centre borders, centering can cause half pixels
-   Avoid using the line tool, use the rectangle tool instead since the line tool will align to half pixels
-   If you end up using borders or the line tool (which is not recommended), make certain to outline (expand) your work
    

### Submitting your new icon

-   When your icon has been created, delete the `System icon grid` layer that you had locked
-   Make sure your icon is not grouped or nested
-   Make sure all your layers are named logically
-   Make sure to name the icon what it is avoid interpretive names that will make the icon hard to search and find
    -   If you make a filled icon to supplement the outlined icon, both icons need to have this stated in their name  

:::tip For example
    `add circle filled` and `add circle outlined`
:::

-   Pick a category for the icon to live under. Reference the library for current categories.
-   Supply a list of alternative names that people might associate with your icon. This will help when searching.

Get in touch with the EDS core team designers for further assistance.