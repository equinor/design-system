# Text Component

A flexible typography component system that maintains a consistent 4px baseline grid throughout the interface.

## Features

- **Size Variants**: 10 text sizes from `xs` (10.5px) to `6xl` (48px)
- **Line Heights**: Two options - `default` (comfortable) and `squished` (compact)
- **Baseline Alignment**: Grid-aligned or centered text
- **Font Weights**: `lighter` (300), `normal` (400), and `bolder` (600)
- **Predefined Variants**: H1-H6 headings, body text, caption, and overline
- **Progressive Enhancement**: Uses CSS `text-box-trim` when available
- **Semantic HTML**: Separate components for headings, paragraphs, and spans

## Components

### Text

Generic text component rendered as `<span>`.

```tsx
<Text size="lg" lineHeight="default" baseline="grid" weight="normal">
  Hello World
</Text>
```

### Heading

Semantic heading component (h1-h6).

```tsx
<Heading as="h1" size="6xl" weight="bolder" baseline="grid">
  Page Title
</Heading>
```

### Paragraph

Paragraph component.

```tsx
<Paragraph size="md" baseline="grid">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Paragraph>
```

### Span

Inline text component.

```tsx
<Span weight="bolder">Bold inline text</Span>
```

## Props

### Common Props

- **size**: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'`
  - Controls font size
- **lineHeight**: `'default' | 'squished'`
  - `default`: Comfortable reading spacing
  - `squished`: Compact spacing
- **baseline**: `'grid' | 'center'`
  - `grid`: Aligns text to 4px baseline grid
  - `center`: Centers text vertically within line height
- **weight**: `'lighter' | 'normal' | 'bolder'`
  - Font weight (300, 400, 600)
- **variant**: Typography variant
  - `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`
  - `'body-large' | 'body' | 'body-small'`
  - `'caption' | 'overline'`
  - Overrides individual size/weight/baseline props
- **debug**: `boolean`
  - Visualizes text box boundaries

### Heading-specific Props

- **as**: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`
  - HTML heading level (default: `'h1'`)

## Usage Examples

### Size Variants

```tsx
<Text size="xs">Extra small (10.5px)</Text>
<Text size="sm">Small (12px)</Text>
<Text size="md">Medium (14px)</Text>
<Text size="lg">Large (16px)</Text>
<Text size="xl">Extra large (18px)</Text>
<Text size="2xl">2XL (20px)</Text>
<Text size="3xl">3XL (24px)</Text>
<Text size="4xl">4XL (32px)</Text>
<Text size="5xl">5XL (40px)</Text>
<Text size="6xl">6XL (48px)</Text>
```

### Line Height Options

```tsx
<Text size="lg" lineHeight="default">
  Comfortable reading spacing
</Text>

<Text size="lg" lineHeight="squished">
  Compact spacing for dense layouts
</Text>
```

### Baseline Alignment

```tsx
<Text size="lg" baseline="grid">
  Aligns to 4px grid
</Text>

<Text size="lg" baseline="center">
  Centered vertically
</Text>
```

### Combining Properties

```tsx
<Text size="3xl" lineHeight="default" baseline="grid" weight="bolder">
  Large, bold, grid-aligned heading
</Text>
```

### Using Variants

```tsx
<Text variant="h1">Main Heading</Text>
<Text variant="body">Regular body text</Text>
<Text variant="caption">Supplementary information</Text>
<Text variant="overline">LABEL TEXT</Text>
```

### Semantic Headings

```tsx
<Heading as="h1" size="6xl" weight="bolder" baseline="grid">
  Page Title
</Heading>

<Heading as="h2" size="4xl" weight="bolder" baseline="grid">
  Section Title
</Heading>
```

### Mixed Inline Styles

```tsx
<Paragraph size="md">
  This is regular text with <Span weight="bolder">bold emphasis</Span> and{' '}
  <Span size="lg">larger text</Span> inline.
</Paragraph>
```

## Predefined Typography Variants

### Headings

- **h1**: 48px / 56px line height / 600 weight
- **h2**: 40px / 48px line height / 600 weight
- **h3**: 32px / 40px line height / 600 weight
- **h4**: 24px / 32px line height / 600 weight
- **h5**: 20px / 28px line height / 600 weight
- **h6**: 18px / 28px line height / 600 weight

### Body Text

- **body-large**: 16px / 24px line height / 400 weight
- **body**: 14px / 20px line height / 400 weight
- **body-small**: 12px / 16px line height / 400 weight

### Specialty

- **caption**: 10.5px / 16px line height / 400 weight
- **overline**: 12px / 16px line height / 600 weight / uppercase / letter-spacing

## CSS Classes

The component generates CSS classes that can be used directly in HTML or other frameworks:

```css
/* Size classes */
.text-xs, .text-sm, .text-md, .text-lg, .text-xl,
.text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl

/* Line height classes */
.line-height-default
.line-height-squished

/* Baseline alignment classes */
.text-baseline-grid
.text-baseline-center

/* Font weight classes */
.font-lighter
.font-normal
.font-bolder

/* Composite variant classes */
.h1, .h2, .h3, .h4, .h5, .h6
.body-large, .body, .body-small
.caption, .overline
```

## Progressive Enhancement

The component uses CSS `text-box-trim` property when available for precise baseline alignment. In browsers that don't support it, text still looks good but may not align perfectly to the 4px grid.

```css
@supports (text-box: trim-both cap alphabetic) {
  .text-baseline-grid {
    text-box: trim-both ex alphabetic;
    padding-top: calc(round(1cap, 4px) - 1ex);
    padding-bottom: 0;
  }
}
```

## Accessibility

- Uses semantic HTML elements (`<h1>`, `<p>`, etc.) where appropriate
- Maintains proper heading hierarchy
- Font sizes are specified in pixels for consistency
- Line heights ensure readability
- Supports all standard HTML attributes and ARIA properties

## Browser Support

- Modern browsers with CSS custom properties support
- Progressive enhancement for `text-box-trim` (Chrome 123+, Safari TP)
- Fallback styling for browsers without `text-box-trim`
