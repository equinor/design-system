## Summary

Compact, non-interactive labels for conveying status, category, or metadata. For selectable labels, use [Chip](?path=/docs/eds-2-0-beta-data-display-chip--docs) instead.

## Usage

```tsx
<Badge tone="success">Approved</Badge>
```

## Accessibility

- Badge renders a plain `span` with no role and no `tabindex`, so it is not focusable.
- Tone is applied through colour only and is not announced. Do not rely on colour alone to convey meaning; let the label text carry the status.

## Related components

- [`Chip`](?path=/docs/eds-2-0-beta-data-display-chip--docs) is the selectable counterpart to Badge.
