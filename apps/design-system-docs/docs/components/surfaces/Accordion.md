---
title: Accordion
description: Organises content into expandable sections to reduce clutter and improve scanability.
tags: [surfaces, disclosure, content]
---

# Accordion

The accordion component helps you organise content by allowing users to expand and collapse sections. This keeps pages tidy and makes information easy to scan.

## When to Use

Accordions are useful for grouping related information and reducing visual clutter. They give users control over which sections they view, making it easier to focus on what matters. However, avoid using accordions for critical information that should always be visible.

**Consider using an accordion when:**

- You want to group related information.
- You need to reduce visual clutter on a page.
- Users should be able to choose which sections to view.

## Structure

An accordion is made up of a header area and a content area. The header is the clickable section that expands or collapses the content. The content area appears when the section is expanded.

## Guidelines

**Header area:**

- Always 48px in height, whether expanded or collapsed.
- Must include an action to expand or collapse the section.
- You may add extra actions if needed.
- The entire header is clickable for expand/collapse. Additional actions are triggered only by clicking directly on them.

**Labels:**

- Keep labels short and clear, ideally no more than three words.
- If a label is too long, it will be truncated. Provide a tooltip or another method to show the full label.

**Content area:**

- When expanded, the content area should be at least 96px in height. There is no maximum height.
- Users can expand multiple sections at the same time.
- When navigating with a keyboard, use the tab key to move through headings and press enter or space to open a section.

## Accessibility

Make sure all actions are keyboard accessible. Use clear labels and provide tooltips for truncated text. Maintain a logical tab order for easy navigation.

When an accordion section is expanded, you can use the tab key to move through headings. Press enter or space to open the selected section. This ensures users can efficiently navigate and interact with accordion sections using a keyboard.

## Implementation in Figma

To add an accordion in Figma:

1. Open the Assets Panel and search for "accordion".
2. Drag and drop the component into your frame.
3. Rename and resize it as needed.
4. Select the desired variant from the Design Panel.
<!-- Add link to Figma when the UI-User Interface board is redone-->

## Code Example

For implementation details and usage examples, please refer to our [Storybook documentation](https://storybook.eds.equinor.com/?path=/docs/surfaces-accordion--docs).

## Support / Next Steps

If you have questions or need support, please visit our [Support page](../../support/support.md). We are here to help you organise your content and create accessible, user-friendly experiences.
