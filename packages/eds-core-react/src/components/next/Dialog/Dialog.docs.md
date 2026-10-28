---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

## Summary

Dialog interrupts the page with a modal window, to ask the user for a decision or to show something that needs their attention before they carry on.

## Features

- Built on the native `<dialog>` element, opened with `showModal()`, so focus is trapped, the page behind is inert and Escape closes it.
- Closes when the user clicks the backdrop, but not when they select text inside the dialog and let go of the mouse over the backdrop.
- Takes its accessible name from `Dialog.Title`, so you do not set `aria-labelledby` yourself. A label you pass is used instead.
- Leaves the open state to you: set `open` and update it in `onOpenChange`.
- Comes with `Dialog.Header`, `Dialog.Title`, `Dialog.Content` and `Dialog.Actions` for the layout, and lets you drop the backdrop with `scrim={false}`.

## Usage

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Header>
    <Dialog.Title>Sign out?</Dialog.Title>
  </Dialog.Header>
  <Dialog.Content>You will need to sign in again.</Dialog.Content>
  <Dialog.Actions>
    <Button variant="secondary" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setOpen(false)}>Sign out</Button>
  </Dialog.Actions>
</Dialog>
```

## Accessibility

- The native `<dialog>` has the dialog role, and opening it as a modal traps focus inside it and makes the page behind inert.
- `Dialog.Title` is an `<h2>` and names the dialog. Without a `Dialog.Title`, pass an `aria-label` or `aria-labelledby`.
- There are three ways to close it: pressing Escape, clicking the backdrop and using the close button. Each calls `onOpenChange(false)`, so update your `open` state in response.
- The close button in the header is named "Close".
- Keep the content short and put the actions last, in the order the user will read them.

## Related components

- [`Banner`](?path=/docs/eds-2-0-beta-feedback-banner--docs) shows a message without interrupting the page, for something that does not need a decision.
