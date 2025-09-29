# Accordion

The accordion component helps us organise content by letting people expand and collapse sections so pages stay tidy and easy to scan.

## When to Use

- Group related information while reducing visual clutter.
- Let people choose which sections to view and focus on what matters.
- Avoid using accordions for critical information that needs to stay visible.

## Structure

- Each accordion section has a header area and a content area.
- The header is the interactive element that expands or collapses the section.
- The content area appears when the section is expanded and holds the supporting information.

## Guidelines

- Keep the header area 48px high, whether expanded or collapsed, and include a clear action to expand or collapse.
- Make the entire header clickable for expand or collapse, while additional actions trigger only when clicked directly.
- Allow room for extra actions when they support the experience.
- Keep labels short and clear—ideally three words or fewer—and provide a tooltip or similar method when truncation occurs.
- Ensure the content area is at least 96px high when expanded and allow multiple sections to be open at the same time.

## Accessibility

Make every action keyboard accessible, maintain a logical tab order, and support tooltips for truncated text. When a section is expanded, people can use the tab key to move through headings and press enter or space to open the selected section.

## Implementation in Figma

1. Open the **Assets Panel** and search for **accordion**.
2. Drag and drop the component into your frame.
3. Rename and resize it as needed.
4. Select the desired variant from the **Design Panel**.

For implementation details and usage examples, please refer to our [Storybook documentation](https://storybook.eds.equinor.com/?path=/docs/surfaces-accordion--docs).
