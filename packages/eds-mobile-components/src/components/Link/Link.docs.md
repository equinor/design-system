## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Comes as a standalone link that sits on its own, or as an inline link that sits inside a sentence.
- Follows the Typography size scale, so a link can match the text around it.
- Changes colour while it is pressed.
- Can show an icon that marks a link opening outside the app.
- Shows a visited colour when you mark the link as visited. You track the visited state yourself.

## Usage

```tsx
<Link onPress={handlePress}>Open documentation</Link>
```

## Accessibility

- Link sets the link role automatically, on both variants.
- The text of `children` is the accessible name, so it should make sense out of context. Write "Open the documentation", not "Click here".
- Link does not accept an `accessibilityLabel`, so the visible text has to carry the meaning.
