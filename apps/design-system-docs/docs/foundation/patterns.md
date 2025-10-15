---
title: Patterns
---

Effective design patterns help you create consistent, user-friendly interfaces by providing proven solutions to common design challenges. These patterns ensure your components work harmoniously together whilst maintaining visual structure throughout your product.

## Grid System and Spacing

The organisation of space is fundamental to great design. By aligning your components to a grid system, you provide clear visual structure that helps users navigate and understand your interface more easily.

EDS is built on an 8px ratio system, which means you should maintain a minimum of 8px spacing between objects and elements. This consistent spacing creates visual rhythm and helps establish clear relationships between interface elements.

For comprehensive guidelines on implementing our grid system, please refer to the [grid documentation](./design-tokens/grid.md).

### Best Practices

:::info **Do**

- Use the 8px minimum spacing between all components
- Align objects within grid columns for consistency
- Apply appropriate grid sizes based on your component dimensions
  :::
  :::danger **Don't**

- Use spacing less than 8px between components
- Mix on-grid and off-grid object placement without purpose
- Ignore the grid system when positioning elements
  :::

## Reading Patterns and Layout

Understanding how users scan and read content helps you place elements effectively. Two primary reading patterns guide interface design: F-pattern and Z-pattern scanning.

The **F-shaped scanning pattern** occurs when users concentrate their attention at the top and left side of the page. Users typically read horizontally across the upper content area, then move down slightly and read across again in a shorter horizontal movement. This pattern works well for content-heavy interfaces and suggests placing primary actions and important information along the left side of your layout.

The **Z-shaped pattern** traces how users scan pages from left to right, top to bottom. Users read horizontally across the top, then move diagonally down and left, followed by another horizontal movement across to the right. This pattern suits marketing pages and simple layouts, with primary actions positioned strategically along the Z-path.

For dialogue windows and modal interfaces, place primary buttons in the bottom right corner for easy access. Position supplemental actions on the opposite side of the dialogue from the main button group to create clear visual hierarchy and prevent accidental clicks.

## Input Patterns

Input fields and selection menus allow users to provide information and make choices within your interface. Consistent input patterns reduce cognitive load and improve usability across your application.

**Menus** (also known as dropdowns) display choice lists on temporary surfaces, allowing single or multiple selections. Create effective menus using the menu container and menu items components, triggered by user interaction with icons, buttons, or other controls. Ensure your menus are easily scannable, simple to interact with, and suited to your users' specific needs.

For **multiselect dropdown menus**, clearly indicate selected items using checkboxes or chips. Display selections within the field, inside the menu, or below the field based on your interface requirements and available space.

**Contextual menus** appear when users right-click, displaying actions related to the selected object based on your application's current state. Keep these menus focused and relevant to avoid overwhelming users with unnecessary options.
