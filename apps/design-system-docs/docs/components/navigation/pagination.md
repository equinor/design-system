# Pagination

_Pagination_ allows long sets of data or content to be divided into multiple pages with controls to navigate between these pages. Designed with care, pagination creates manageable experiences that help users navigate through extensive content without feeling overwhelmed.

<iframe 
        class="sb-iframe"
        src="
        https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=navigation-pagination--introduction
        "
        width="100%"
        height="100"
        frameborder="1"
        ></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/docs/navigation-pagination--docs)

## When to Use

When content will take a long time to load or is better viewed in smaller sets, pagination can be used to divide this content into multiple pages. Pagination only loads one page at a time. Do not lazy load content as the user scrolls when using pagination.

## Structure

Our pagination component is built from clear, purposeful parts that work together to help users move smoothly through large sets of content. Each element plays a role in keeping navigation simple, consistent, and accessible.

#### Previous / Next Buttons

Previous and Next buttons guide users one page backward or forward.

- **Previous** is disabled on the first page, and **Next** is disabled on the last page.
- These buttons are always visible, giving users a dependable way to move step by step through content.

#### Page Number Buttons

Page numbers help users see where they are and jump directly to a specific page.

- When there are many pages, only a few are shown to keep the control compact and easy to scan.
- The current page stands out visually, ensuring orientation and clarity at a glance.

#### Current Page Indicator

The active page is highlighted to show which page the user is on.

- The current page is always distinguishable through both visual styling and accessible labels.
- This simple detail helps everyone stay oriented, whether they’re navigating visually or with assistive technology.

### Ellipsis (Truncation)

When there are too many pages to display, pagination automatically shortens with ellipses (`...`).

- The first and last pages remain visible for context.
- This keeps the control clean while still helping users understand where they are in the overall set.

#### Item Indicator

The **withItemIndicator** variant displays how many items are being shown out of the total, such as “1–10 of 120 items.”

- It gives users a sense of progress and scale.
- A small addition that builds transparency and trust in the interface.

![pagination](../assets/pagination-no.jpg)

## Implementation in Figma

1. In Figma go to the **Assets Panel** and search for **pagination**.
2. Drag and drop the component in your frame.
3. Rename and resize the component if needed.
4. Choose the variant from the **Design Panel**.
