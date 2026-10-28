---
aria: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
---

## Summary

Accordion shows a list of sections where each header opens and closes its panel, so a page stays short and the user opens only what they need.

## Features

- Built on the native `<details>` and `<summary>` elements, so opening, closing and keyboard use come from the browser.
- Allows only one open item at a time when you set `exclusive`, using the native `name` attribute and no JavaScript.
- Lets each `Accordion.Item` keep its own open state, or be controlled with `open` and `onOpenChange`.
- Animates opening and closing with CSS alone. The animation is off for users who have turned on reduced motion in their system settings.

## Usage

```tsx
<Accordion>
  <Accordion.Item>
    <Accordion.Header>Delivery</Accordion.Header>
    <Accordion.Panel>
      Orders placed before 14:00 ship the same day.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

## Accessibility

- Each item is a native `<details>` with a `<summary>` header, so the header can be focused and toggled with Enter or Space, and the browser keeps track of whether the item is open.
- The chevron is decorative and hidden from screen readers.
- The header text is the name of the control, so it should say what the panel contains.
- With `exclusive`, opening one item closes the others through the browser's own grouping, so there is no focus handling to add.
- Animation is switched off when the user has asked for reduced motion.
