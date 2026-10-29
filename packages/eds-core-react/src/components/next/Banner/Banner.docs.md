---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
---

## Summary

Banner shows a short, important message to the user, with optional actions to respond to it or to close it.

## Features

- Sets its colours from `tone`, so the message reads as information, a warning, an error or a success.
- Comes in parts, `Banner.Icon`, `Banner.Message` and `Banner.Actions`, so you include only the ones you need.
- Puts the actions beside the message, or below it across the full width with `placement="bottom"`.
- Shows a Dismiss button when you pass `onDismiss`.
- Announces its message to screen readers as a status by default, or as an alert when you set the `role`.

## Usage

```tsx
<Banner>
  <Banner.Message>Your changes have been saved.</Banner.Message>
</Banner>
```

## Accessibility

- A banner has the `status` role by default, so a screen reader announces the message politely without interrupting. Set `role="alert"` for an urgent message that needs attention at once.
- The tone is shown by colour, so the message itself should say what it means. Banner does not add an icon by itself, so add a `Banner.Icon`.
- The close button is named "Dismiss". Banner only calls `onDismiss`, so your code has to remove the banner and decide where focus goes next.
- A banner is not focusable. The buttons and links in its actions keep their own keyboard behaviour.
