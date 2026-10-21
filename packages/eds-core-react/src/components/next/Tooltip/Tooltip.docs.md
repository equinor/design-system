---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
---

## Summary

Tooltip shows a short piece of plain text beside an element when the user hovers or focuses it, such as the name of an icon-only button.

## Features

- Opens on keyboard focus as well as on hover.
- Moves to the opposite side, and then to the sides across, when its preferred side does not fit in the viewport, so the arrow always points at the trigger.
- Stays open while the pointer travels from the trigger to the tooltip, so its text can be read.
- Positions itself with CSS anchor positioning and the browser's popover, without measuring anything in JavaScript.
- Renders only its child when `disabled`, with no tooltip and no wrapper.

## Usage

```tsx
<Tooltip title="Save the draft">
  <Button>Save</Button>
</Tooltip>
```

## Accessibility

- The tooltip has the tooltip role and is linked to its trigger with `aria-describedby`, so a screen reader reads it as a description after the trigger's name.
- A tooltip describes its trigger and does not name it. An icon-only button still needs its own `aria-label`.
- It opens on focus as well as hover, so keyboard users get it too, and it stays open while the pointer is over it.
- Escape closes it in Chrome and Firefox, which support `popover="hint"`. Safari falls back to a manual popover, which works but has no Escape until Safari supports `hint`.
- Keep the text short and plain. The tooltip is not the place for links, buttons or anything the user must be able to reach.
