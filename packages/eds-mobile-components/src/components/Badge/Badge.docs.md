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
