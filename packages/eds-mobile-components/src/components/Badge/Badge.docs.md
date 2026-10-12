## Features

<!-- Three to five short lines on what the component does for you. Do not repeat the props table. -->

- Six tones cover the status range, from neutral to danger.
- Solid or outlined, so a badge stays readable on plain and coloured backgrounds.
- Accepts text or a number, which suits status labels and counts.
- Truncates to a single line.

## Usage

```tsx
<Badge tone="success">Approved</Badge>
```

## Accessibility

- Screen readers read the badge text automatically, so no extra setup is needed for basic use.
- Tone is not announced by screen readers. Avoid relying on colour alone to convey meaning, and pair the badge with a visible text label where possible.
- When additional context is needed beyond the badge text, pass `accessibilityLabel` directly to the Badge component:

```tsx
<Badge tone="success" variant="solid" accessibilityLabel="Status: Approved">Approved</Badge>
```

## Related components

- [`Typography`](/components/typography) is for plain text labels that do not need a coloured badge.
