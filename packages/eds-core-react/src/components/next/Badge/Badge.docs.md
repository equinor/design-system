## Summary

<!-- This summary is shown above both the React and React Native tabs. Write it so it is true on both platforms, and put anything that differs by platform in Features or Usage. -->

Badge labels content with a status, a category or a piece of metadata. Place a badge next to a heading, in a table, or on a list row or card, so readers can see at a glance what the item is.

Badge is non-interactive: it cannot be selected, focused or dismissed. For labels that users select, use [Chip](?path=/docs/eds-2-0-beta-data-display-chip--docs) instead.

## Usage

```tsx
<Badge tone="success">Approved</Badge>
```

## Accessibility

- Badge renders a plain `span` with no role and no `tabindex`, so it is not focusable.
- Tone is applied through colour only and is not announced. Do not rely on colour alone to convey meaning; let the label text carry the status.

## Related components

- [`Chip`](?path=/docs/eds-2-0-beta-data-display-chip--docs) is the selectable counterpart to Badge.
