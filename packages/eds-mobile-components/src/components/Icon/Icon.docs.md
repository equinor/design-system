## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Draws an icon from the Material Community Icons set by `name`, and the `IconName` type lists the valid names.
- Takes its default size and colour from the EDS tokens, so the colour follows the colour scheme.
- Takes every React Native text prop too, such as `accessibilityLabel`, and passes it on to the icon.

## Usage

```tsx
<Icon name="home" />
```

## Accessibility

- Icon sets no accessibility props of its own. Anything you pass, such as `accessibilityLabel`, goes straight to the icon.
- An icon that carries meaning on its own, such as one inside an icon-only action, needs an `accessibilityLabel`.
- A decorative icon that only repeats the text beside it can be hidden from screen readers with `accessibilityElementsHidden`.
- The default colour is a text colour, so it meets the contrast of the surrounding text. A `color` you set yourself needs enough contrast against the background in both colour schemes.
