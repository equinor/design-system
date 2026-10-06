## Summary

Badge labels content with status, category, or a numeric value. Use it in table cells, list rows, and card headers to communicate information at a glance.

Badge is a non-interactive component. For selectable or dismissible labels, use Chip. A notification badge (dot or count indicator on top of an icon or avatar) is planned as a separate component.

## Usage

```tsx
<Badge tone="success">Approved</Badge>
```

## Accessibility

- VoiceOver and TalkBack read the badge text automatically, so no extra setup is needed for basic use.
- Tone is not announced by screen readers. Avoid relying on color alone to convey meaning, and pair the badge with a visible text label where possible.
- When additional context is needed beyond the badge text, pass `accessibilityLabel` directly to the Badge component:

```tsx
<Badge tone="success" variant="solid" accessibilityLabel="Status: Approved">Approved</Badge>
```

## Related components

- [`Typography`](/components/typography) is for plain text labels that do not need a colored badge.
