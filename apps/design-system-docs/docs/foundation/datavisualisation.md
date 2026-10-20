---
title: Data Visualisation
hide_title: true
description: 'A graphical presentation of information in a way that makes it easier to understand and process. It is usually interactive and allows for the user to draw their own conclusions about the data.'
---

## Infographics

An infographic is very similar to a data visualisation since it too is a graphical presentation of information that is presented in a way that is easy to digest and understand. Infographics are more subjective though by telling a complete and premeditated story which guides the user to a particular conclusion. Refer to the [Equinor Brand Center](https://communicationtoolbox.equinor.com/point/en/equinor/) for guidelines on creating infographics.

## Dashboards

A dashboard is a combination of data visualisations arranged on a screen which can be monitored at-a-glance. This is usually a summary of the most important data that is needed for users to take action or make decisions. A dashboard should effectively communicate a story using data. Drillthrough capabilities are typically available to allow for a more detailed analysis of the data.

### Data

Data accuracy is the top priority. Data must be displayed correctly and in a way that does not mislead the user.

- Be careful how missing, null and zero data are displayed
- Use visual techniques to effectively highlight and draw the user’s attention to the most important data
- Focus on presenting the information needed in the most simple and clear way
- Provide adequate context in the form of labels, data values or units to aid in interpretation of the data
- Add supplemental data when necessary to provide the correct context to understand the data. Examples are targets, trends, budgets, YTD, averages, etc.
- Enable users to drill-down with context to perform further analysis away from the dashboard
- Sort data for easier comparisons
- Minimise use of decimals where they are not relevant or don’t add value
- Take time to understand the data and data formatting so that visuals can be created accordingly with regards to spacing, text/numbers lengths, legends and colouring

### Layout

To help draw the user's attention to the most important information, the information should be positioned corresponding to how users are trained to read. Western cultures read left to right, meaning the most frequently viewed information should be placed in the upper left-hand corner. The least frequently viewed information should therefore be placed in the bottom right-hand corner.

Put thought into how the information is grouped on the dashboard based on the relationships of the data and the desired flow for the user. Keep in mind that users naturally assume that elements located near each other are related. They will also perceive that elements that visually look similar (size, shape, colour) are related even if they are not located near each other.

- Use the EDS typefaces: Equinor for titles and headings, Inter for labels, values and other text
- Use a screen size ratio of 16:9
- The dashboard should be confined to a single screen without scrolling
- Distribute content evenly over the width and height of the dashboard. This enables the user to see the whole picture at once
- There should always be an overall dashboard title located at the top
- Tabs can be used to guide the user to relevant views or pages. These should be placed at the top, and no more than six should be used
- Use whitespace to help group information and to declutter the page

:::tip For example
Add 16px margin around the entire dashboard, 16px padding around content in a visual and 12-16px between visualisations.
:::

Global filters should be grouped and placed together either on the top, left or right side of the dashboard. Filters applying to single visualisations should be placed close to the visualisation in which they apply to. Keep all filters and navigation in the same location throughout the dashboard.

### Colour

When colour is used appropriately, it can draw the user’s attention to something important, and it is also an easy way to help the user identify patterns or trends.

It is not recommended to rely on colour alone, since some users can have trouble distinguishing certain colours (colour blindness).

- Follow the [colour guidance](./accessibility.md#colour) in the accessibility foundation
- Keep bright and saturated colours to a minimum, only using them to highlight data requiring attention
- Use one palette per dashboard, and do not mix colours from different palettes
- Place visuals on `background.surface` and the overall dashboard on `background.canvas`, so the visuals stand out from the page in both colour schemes
- Be aware that changes in data can occur after the initial creation of a visual, and that this might affect colouring

#### Chart colour tokens

EDS has a separate group of colour tokens for charts, `data-visualization.*`. They are tuned for telling series apart, not for contrast against a background, and no EDS component uses them. The [palette page](./colour/palette.mdx#data-visualisation) shows every value.

| Group           | Tokens                                                             | Use for                                                                         |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Categorical** | `data-visualization.cat.1` to `cat.10`, each with steps `1` to `5` | Categories with no order between them, such as assets, regions or products      |
| **Sequential**  | `data-visualization.seq.1` to `seq.7`                              | Ordered values that run from low to high                                        |
| **Diverging**   | `data-visualization.div.1` to `div.9`                              | Values that run in two directions from a midpoint, such as above and below plan |

Most of the values differ between light and dark. Each categorical ramp runs from light to dark in one colour scheme and from dark to light in the other, so the same step does not have the same lightness in both. Check your charts in both colour schemes.

### Data visualisation types

It is important to understand the different types of visuals available in order to choose the right visual for the intended purpose.

Visualisations should include the data and context necessary to communicate the intended information in a clear and effective way.

- Be consistent with labelling and data formatting. Always label axes, show units and add a title
- Be aware of the scaling used and that it conveys the data correctly
- The vertical (y-axis) for a bar chart should usually start at zero. The starting point in other chart types should be reasonable for the data
- Avoid 3D, background images, animations or other unnecessary effects that reduce comprehension
- Ensure the user is not being misled. For example, parts of a whole should always add up to 100
- Use visual cues like arrows, colour or text to help users interpret the data
- Enhance the data pixels and reduce unnecessary non-data pixels (gridlines, borders, certain fill colours, etc.)
- Add a means for the user to interact with the data such as filters, slicers, sorting and drill-down possibilities
- Avoid pie and donut charts as they can be misleading and difficult to interpret

:::info Recommended further reading
Explore the books, blogs and articles written by data visualisation experts:  
Edward R. Tufte, Colin Ware, Wayne W. Eckerson, Stephen Few and Alberto Cairo.
:::
