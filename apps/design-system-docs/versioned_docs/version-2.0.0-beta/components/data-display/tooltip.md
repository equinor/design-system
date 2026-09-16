---
title: Tooltip
sidebar_position: 6
---

# Tooltip

Tooltips display brief, supplementary information when users hover over or focus on an element. They are ideal for clarifying the meaning of icons, explaining actions, or showing keyboard shortcuts - without cluttering the interface.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-tooltip--introduction"
  width="100%"
  height="150"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-tooltip--introduction)

## When to Use

Use a tooltip when a symbol or interactive element needs a brief explanation, or when you want to reveal a keyboard shortcut.

**Avoid tooltips for:**

- Text that is already visible on the page - the tooltip would be redundant
- Explanations longer than a short sentence - use **Popover** instead
- Content with links or interactive elements - use **Popover** instead
- Replacing alt text or title attributes - tooltips are supplementary, not a substitute

## Structure

A tooltip consists of:

- **Trigger** (required) - the focusable element that activates the tooltip on hover or focus. The trigger is wrapped in an inline-block span for anchor positioning.
- **Label** (required) - the brief text content displayed inside the tooltip bubble
- **Arrow** (automatic) - a directional indicator pointing toward the trigger

## Guidelines

### Placement

Tooltips support flexible positioning relative to their trigger element:

| Placement | Use Case                                     |
| --------- | -------------------------------------------- |
| Top       | Default position, suitable for most contexts |
| Bottom    | When space above the trigger is limited      |
| Left      | Useful beside right-aligned elements         |
| Right     | Useful beside left-aligned elements          |

The tooltip will automatically reposition itself to stay within the viewport boundary using CSS Anchor Positioning fallbacks.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-tooltip--placements"
  width="100%"
  height="228"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-tooltip--placements)

### Text Content

- Keep text to a maximum of one short sentence
- Do not repeat text that is already visible on the page
- Provide additional help or clarification that is not immediately obvious
- Tooltip text should never contain essential task information - use body text or help text for that

### Disabled State

The tooltip can be disabled via the `disabled` prop. When disabled, the tooltip is not rendered and the trigger element is returned unwrapped, with no additional DOM elements added.

<iframe
  class="sb-iframe"
  src="https://storybook.eds.equinor.com/iframe.html?globals=&args=&id=eds-2-0-beta-data-display-tooltip--disabled"
  width="100%"
  height="100"
  frameborder="1"
></iframe>

[View in Storybook](https://storybook.eds.equinor.com/?path=/story/eds-2-0-beta-data-display-tooltip--disabled)

## Accessibility

Tooltips must be attached to focusable elements so they can be reached via keyboard navigation.

- **Keyboard**: Tooltip appears on focus and dismisses on blur. In browsers supporting `popover="hint"`, pressing Escape also dismisses the tooltip.
- **Hover**: Tooltip appears on mouse enter and hides with a short delay on mouse leave. The delay allows the user to move their pointer over the tooltip itself without it disappearing.
- **ARIA**: The component uses `role="tooltip"` and links to its trigger via `aria-describedby`, providing supplementary context to screen readers.

**Disabled elements**

- Avoid attaching tooltips to natively disabled buttons, as browsers handle hover and focus inconsistently on disabled elements
- Use `aria-disabled` instead of `disabled` when a tooltip is needed on a button that should appear inactive

## Figma

### Components

- **Tooltip [EDS]** - the tooltip component with configurable placement and label

### Using the Tooltip in Figma

1. In Figma, go to the **Assets Panel** and search for **Tooltip**
2. Drag the component into your frame
3. Select the component to see its properties in the **Design Panel**
4. Set the **Tip Position** to control which direction the arrow points (Top, Bottom, Left, Right)
5. Edit the **text** property to change the tooltip label

## Do's and Don'ts

:::info **Do**

- Attach tooltips to focusable, interactive elements
- Keep tooltip text brief and supplementary
- Use tooltips to clarify icon meanings or actions
- Ensure tooltips are reachable via keyboard focus
- Use `aria-disabled` instead of `disabled` when a tooltip is needed on an inactive button
  :::

:::danger **Don't**

- Place essential information inside tooltips - users may never see it
- Use tooltips as a replacement for alt text or title attributes
- Add links, buttons, or other interactive content inside a tooltip - use **Popover** instead
- Attach tooltips to natively disabled elements
- Repeat text that is already visible on the page
  :::
