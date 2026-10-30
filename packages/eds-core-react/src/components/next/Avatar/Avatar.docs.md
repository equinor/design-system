## Summary

<!-- This summary is shown above both the React and React Native tabs. Write it so it is true on both platforms, and put anything that differs by platform in Features or Usage. -->

Avatar represents a person in a small circle, for example in lists and headers. Use `AvatarNameLabel` to show it next to the person's name.

## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the controls. -->

- Shows a profile photo, or initials when there is no photo or it fails to load.
- One `name` gives both the initials and the accessible name, so screen readers announce the person.
- Can show a notification dot that screen readers also announce.
- `AvatarNameLabel` has room for secondary text, such as a job title, and an open trailing slot that takes any content.

## Usage

```tsx
<Avatar name="Ada Lovelace" />
```

## Accessibility

- Avatar is not interactive. It has no `tabindex` and is not focusable.
- With `name` and no `src`, the avatar gets `role="img"` and an `aria-label` with the name. The initials themselves are hidden from screen readers.
- Without `name` or `src`, the avatar has no role and is decorative. Pass `name` when Avatar stands on its own.
- With `src`, the `img` carries the accessible name through `alt`, which falls back to `name`. Pass `alt=""` for a decorative photo. If the photo fails to load, the avatar shows the initials and gets the `role="img"` and `aria-label` it has without `src`.
- With `notification`, `notificationLabel` is added to the `aria-label` (`"Ada Lovelace, Notification"`). With a photo, or without `name`, there is no `aria-label`, so `notificationLabel` is read out as visually hidden text instead. The dot itself is hidden from screen readers. `notificationLabel` defaults to "Notification"; override it for other languages.
- Inside `AvatarNameLabel` the avatar is decorative, and the photo gets an empty `alt` by default, so the visible name is not announced twice. Content in the trailing slot needs its own accessible name, such as an `aria-label` on an icon button.
