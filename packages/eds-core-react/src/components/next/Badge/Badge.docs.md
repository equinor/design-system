## Summary

<!-- This summary is shown above both the React and React Native tabs. Write it so it is true on both platforms, and put anything that differs by platform in Features or Usage. -->

Badge labels content with a status, a category or a piece of metadata, so readers can see at a glance what an item is. Badge is non-interactive, so use [Chip](?path=/docs/eds-2-0-beta-data-display-chip--docs) instead for labels that users select.

## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the controls. -->

- Short text for indicating status or priority.
- Can go before or after other content, as a prefix or a suffix.
- Can be paired with other components.
- Several can sit together on one item.
- Follows the density of its parent element.

## Usage

```tsx
<Badge tone="success">Approved</Badge>
```

## Accessibility

- Badge renders a plain `span` with no role and no `tabindex`, so it is not focusable.
- Tone is applied through colour only and is not announced. Do not rely on colour alone to convey meaning; let the label text carry the status.

## Related components

- [`Chip`](?path=/docs/eds-2-0-beta-data-display-chip--docs) is the selectable counterpart to Badge.
