## Summary

<!-- This summary is shown above both the React and React Native tabs. Write it so it is true on both platforms, and put anything that differs by platform in Features or Usage. -->

Avatar represents a person with their initials or a profile photo in a circle. Use `AvatarNameLabel` to show the avatar together with a name and secondary text, for example in lists and headers.

## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the controls. -->

- Derives the initials from a name, using the first and last word.
- Shows a profile photo instead of initials, cropped to the circle.
- Can show a notification dot, which is also read out to screen readers.
- `AvatarNameLabel` adds a name, secondary text and a trailing slot, and truncates long text in the vertical layout.
- Follows the density of its parent element.

## Usage

```tsx
<Avatar name="Ada Lovelace" />
```

## Accessibility

- Avatar is not interactive. It has no `tabindex` and is not focusable.
- With `name` and no `src`, the avatar gets `role="img"` and an `aria-label` with the name. The initials themselves are hidden from screen readers.
- Without `name` or `src`, the avatar has no role and is decorative. Pass `name` when Avatar stands on its own.
- With `src`, the `img` carries the accessible name through `alt`, which falls back to `name`. Pass `alt=""` for a decorative photo.
- With `notification`, "notification" is added to the label (`"Ada Lovelace, notification"`). Without a label, a visually hidden "Notification" text is read out instead. The dot itself is hidden from screen readers.
- Inside `AvatarNameLabel` the avatar is decorative, and the photo gets an empty `alt` by default, so the visible name is not announced twice. Content in the trailing slot needs its own accessible name, such as an `aria-label` on an icon button.
