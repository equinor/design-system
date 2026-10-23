## Summary

Chip is a small button for a compact choice. It can be toggled, removed, or used to open a menu. Chip is interactive, so use [Badge](?path=/docs/eds-2-0-beta-data-display-badge--docs) instead for a label that nobody selects.

## Features

- Works as a toggle by default. It tells screen readers whether it is pressed and shows a check icon while it is selected.
- Turns into a delete button when you pass `onDelete`. A click, or Backspace or Delete while it has focus, calls it, so the whole chip is the delete button.
- Has a dropdown type with a trailing arrow that flips up while `selected` is set, for a chip that opens a menu you build.
- Gives an `Icon` child the chip's own icon size.

## Usage

```tsx
const [selected, setSelected] = useState(false)

<Chip selected={selected} onClick={() => setSelected(!selected)}>
  Filter
</Chip>
```

## Accessibility

- Chip renders a native `button`, so it has the button role and the browser provides focus and keyboard behaviour. Enter and Space activate it.
- A selectable chip sets `aria-pressed` to match `selected`, so a screen reader announces it as a toggle button.
- A dropdown chip sets `aria-expanded` to match `selected`. Chip does not open the menu or link to it, so manage the menu and its focus yourself.
- The check icon and the dropdown arrow are hidden from screen readers. The text is the accessible name.
- The remove icon on a deletable chip has the title "Remove".
- The type is fixed to `button`, so a chip never submits a surrounding form.

## Related components

- [`Badge`](?path=/docs/eds-2-0-beta-data-display-badge--docs) labels content with a status or category and is not interactive.
