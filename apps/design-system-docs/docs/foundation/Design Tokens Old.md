# Colour (old)

The EDS's look and feel is light and airy. Colour helps show hierarchy, champion the Equinor brand and indicate interactivity.

## Guidelines

Use the colours provided in the EDS. These have been tested to make sure they will either meet or exceed the accessibility guidelines. Our colours include the brand colours, but also have supplementary colours for infographics and similar.

Tip: _Many people have trouble differentiating certain colours, so make sure colour is not the only way to convey certain information._

## Styles

### Interactive colours

Moss Green is dedicated to be the `Interactive Primary` colour for internal digital interfaces and experiences. This is different from other branding seen in print and marketing. The decision was made to guarantee that there is no confusion with errors.

Slate Blue is dedicated to be the `Interactive Secondary` colour.

Energy Red is strategically not used for components in EDS since it is easy to misunderstand as an error or alert colour. If you are developing brand/communication related products, please refer to the Equinor  (internal Equinor site) to see how to utilise Energy Red as part of the interface.

### Dark mode

Dark mode is only available in Figma at the moment.

#### Primary colours

Light theme

Dark theme

#### Secondary colours

Light theme

Dark theme

### Feedback colours

#### Warning

Light theme

Dark theme

#### Danger

Light theme

Dark theme

#### Success

Light theme

Dark theme

### Text & static icons

When building interfaces, only use the `Primary` text colour which is used for `Headings` and for `Body` text. The `Secondary` and `Tertiary` text colours are nested into components that are already assembled.

Light theme

Dark theme

### UI Background Colours

Choose between `Default` (which is white) or `Light` and `Medium` greys for the interface background. The other `UI Backgrounds` are nested into components that are already assembled.

Please do not add additional background colours---the default theme is light and airy and does not allow for dark mode at this time.

Light theme

Dark theme

### Infographic colours

Please check the Equinor  (internal Equinor site) for colour usage and principles related to infographics. There are two sets of infographic colours to choose between: `Infographic Primary` and `Infographic Substitute`.

#### Primary infographic colours

Aim to avoid creating multi-coloured charts and diagrams. Monochrome charts and diagrams are preferred wherever possible. Please take care when using reds with blue and green colours to avoid making the red data points appear as a warning or negative data.

#### Substitute infographic colours

The `Infographic Substitute` colours have been developed for enhanced legibility. These can be used when the `Infographic Primary` colours do not offer enough clarity and definition.

### Exceptions for interactive and infographic colours only

If it is needed to use additional interactive or infographic colours for domain-specific requirements, make sure to test the added colours for contrast. This is for domain-specific cases only, and new colours are not to be chosen based on personal preferences. Use high contrast colours, as this both increases general readability and includes the needs of users with impaired vision.

# Elevation

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DESIGN TOKENS

# Elevation

Elevation is a visual effect that makes an element look like it's floating above the surface (using the z-axis).

## Guidelines

The elevation effect is made using shadows to help lift an element into focus --- it is a reference to the physical world. Elements may be stacked on top of each other but can’t pass through each other.

## Styles

There are six elevation effects to choose between:  `None`,  `Raised`,  `Overlay`,  `Sticky`,  `Temporary nav` and `Above scrim`.

None

Fill

rgba(255, 255, 255, 1.0)

Shadow

0.0px 0.0px 1.0px 0px rgba(0, 0, 0, 0.14)

Add notes

Raised

Fill

rgba(255, 255, 255, 1.0)

Shadow

0.0px 1.0px 5.0px 0px rgba(0, 0, 0, 0.2),0.0px 3.0px 4.0px 0px rgba(0, 0, 0, 0.12),0.0px 2.0px 4.0px 0px rgba(0, 0, 0, 0.14)

Add notes

Overlay

Fill

rgba(255, 255, 255, 1.0)

Shadow

0.0px 1.0px 10.0px 0px rgba(0, 0, 0, 0.2),0.0px 4.0px 5.0px 0px rgba(0, 0, 0, 0.12),0.0px 2.0px 4.0px 0px rgba(0, 0, 0, 0.14)

Add notes

Sticky

Fill

rgba(255, 255, 255, 1.0)

Shadow

0.0px 4.0px 5.0px 0px rgba(0, 0, 0, 0.2),0.0px 3.0px 14.0px 0px rgba(0, 0, 0, 0.12),0.0px 8.0px 10.0px 0px rgba(0, 0, 0, 0.14)

Add notes

Temporary Nav

Fill

rgba(255, 255, 255, 1.0)

Shadow

0.0px 7.0px 8.0px 0px rgba(0, 0, 0, 0.2),0.0px 5.0px 22.0px 0px rgba(0, 0, 0, 0.12),0.0px 12.0px 17.0px 0px rgba(0, 0, 0, 0.14)

Add notes

Above Scrim

Fill

rgba(255, 255, 255, 1.0)

Shadow

0.0px 11.0px 15.0px 0px rgba(0, 0, 0, 0.2),0.0px 9.0px 46.0px 0px rgba(0, 0, 0, 0.12),0.0px 24.0px 38.0px 0px rgba(0, 0, 0, 0.14)

Add notes

# Grid

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DESIGN TOKENS

# Grid

A grid adapts to screen size and orientation to help keep layouts consistent.

## Guidelines

Screen size is determined by the device and the user's window size. The EDS grid has three main content layouts that should cover all desktop, tablet and mobile needs adapting to different screen sizes and orientations.

### Grid layouts

- It is the responsibility of the designer to define a maximum width and choose the correct grid.
- It is up to the designer to make sure the design will scale correctly on all sizes. Start with a viewport that is the most common for the users. Make sure to test that the content will fit at smaller and larger viewports.
- It is the responsibility of the developers to implement the maximum width and use the grid as designed.

Tip: _Always remember to test designs and code by scaling the screen size or changing the orientation of the device._

### Grid influencers

When using a canvas navigation drawer or sidesheet, the content container could be resized. This will sometimes require a smaller grid to be used.

## Styles

### Grid columns

The columns used in the grid are **fluid** in width. There is not a defined width.

- `Grid/Large`
  - Use in content areas that are between 840px and larger.

- `Grid/Medium`
  - Use in content areas that are 600--839px.

- `Grid/Small`
  - Use in content areas that are 0--599px.

### Grid margins

Grid margins are the space at the outer edge of the grid against the frame's edge. Grid styles are available with and without margins. It is up to the designer to decide which works best for your interface.

- `Grid/Large`
  - Margins are set to 32px.

- `Grid/Medium`
  - Margins are set to 24px.

- `Grid/Small`
  - Margins are set to 16px.

### Grid gutters

Grid gutters are the space in between the columns of the grid.

- `Grid/Large`
  - Gutters are set to 16px.

- `Grid/Medium`
  - Gutters are set to 16px.

- `Grid/Small`
  - Gutters are set to 8px.

- Visit  for more details on on how to use the grid together with components.

# Shape

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DESIGN TOKENS

# Shape

Components can have many different shapes. Establishing a common shape keeps consistency.

## Guidelines

To reflect the round corners of the Equinor logo, our shapes have a default rounded corner of 4px. You will notice this in the corners of buttons, cards, menus and more.

## Variations

There are many different shapes to choose between when you are building a component such as: `Button`, `Icon button`,  `Corners`,  `Straight`,  `Field`  and `Circle`.

Button

Add notes

Button

Add notes

Circle

Add notes

Circle

Add notes

Corners

Add notes

Corners

Add notes

Icon Button

Add notes

Icon Button

Add notes

Rounded

Add notes

Rounded

Add notes

Straight

Add notes

Straight

Add notes

Toggle

Add notes

Toggle

Add notes

Toggle rounded border

Add notes

Toggle rounded border

Add notes

Toggle straight border

Add notes

Toggle straight border

Add notes

Caret

Add notes

Field

Add notes

# Spacing

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DESIGN TOKENS

# Spacing

Every part of your interface should be intentional, this also includes spacing. While spacing is invisible, it gives air and readability to your interface.

## Guidelines

Spacing is used to apply margin and padding across all platforms. The EDS has a predefined set of spacers. These predefined sizes will ensure consistency across interfaces. Our spacing scale is based on 8px increments.

The spacers `XX Small` and `X Small` are only to be used inside of components, while the spacers `Small` up to `XXX Large` can be used both within and between components.

- Always make sure to follow the  by having 8px of spacing between each clickbound.

There are eight spacers to choose between: `XX Small`, `X Small`,  `Small`, `Medium`, `Large`, `X Large`, `XX Large` and `XXX Large`. The spacers `XX Small` and `X Small` are only to be used inside components, while the other spacers are to be used in layouts.

# Typography

When expanded use tab to review current page headings and press enter or space to navigate to the selected section

DESIGN TOKENS

# Typography

Typography presents hierarchy and organises information as clearly and efficiently as possible.

## Guidelines

The Equinor typeface is the primary typeface and is available in four weights: `light`, `regular`, `medium` and `bold` with accompanying italics. Please do not use `light` in digital interfaces except in special cases where the font size is over 48px.

_Note: Typography is called text styles in Figma._

### Paragraph length

Paragraph length is the number of characters in a line of text---this includes spaces. To ensure readability, line length should be 55-80 characters. Lines less than 55 characters can cause strain on the eye requiring the eye to jump to the next line too quickly, breaking the reading rhythm. Lines greater than 80 characters can make it difficult for users to continue on the correct line in a large body of text.

## Styles

Too many type sizes can cause confusion. The EDS has a limited set of type sizes that work well together.

### Headings

There are seven headings to choose between: `H1bold`, `H1`, `H2`, `H3`, `H4`, `H5` and `H6`. Sentence case (The quick brown fox…) should be used instead of title case (The Quick Brown Fox…) since it contributes to better readability.

### Paragraph

There are many paragraph styles to choose between: `Overline`, `Ingress`, `Body long`, `Body long link`, `Body long italic`, `Body long bold`, `Body long bold italic`, `Body short`, `Body short link`, `Body short italic`, `Body short bold`, `Body short bold italic` and `Caption`.

The style `Body short` is used for short sentences containing around four words. It is most commonly used within components.

### Additional styles

There are other typography styles that are used internally within components.
