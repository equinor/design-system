# Power Apps Button Gallery

## Overview

Interactive web gallery for browsing and copying EDS (Equinor Design System) button components for Microsoft Power Apps Canvas applications.

## Features

- **Visual Preview**: See how each button variant looks with EDS styling
- **One-Click Copy**: Copy YAML code directly to clipboard
- **All Variants**: Browse all 12 button combinations:
  - 3 styles: Contained, Outlined, Ghost
  - 3 colors: Primary, Secondary, Danger
  - Plus disabled states

## Usage

### Web Interface

1. Navigate to `/power-apps/buttons` in the running app
2. Browse the button variants organized by style
3. Click "Copy YAML" on any button
4. Open Power Apps Studio
5. Go to Tree View → (...) menu → "Paste YAML"
6. Paste the copied content

### Local Development

```bash
# Start the development server
pnpm dev

# Open in browser
http://localhost:3000/power-apps/buttons
```

### CLI Generation (Alternative)

```bash
# Generate all button YAML files to disk
pnpm generate:power-apps button

# Files will be created in:
scripts/power-apps/output/
```

## Components

### React Components

- **`ButtonPreview`** - Visual representation of Power Apps button with EDS styling
- **`CopyButton`** - Clipboard copy functionality with success feedback
- **`ComponentCard`** - Card layout combining preview and copy button
- **`generateButtonYaml`** - Client-side YAML generator (mirrors server-side logic)

### File Structure

```
src/
├── app/
│   └── power-apps/
│       └── buttons/
│           ├── page.tsx       # Main gallery page
│           └── layout.css     # Styling
├── components/
│   ├── ButtonPreview.tsx      # Button visual
│   ├── CopyButton.tsx         # Copy to clipboard
│   └── ComponentCard.tsx      # Card wrapper
└── lib/
    └── generateButtonYaml.ts  # YAML generation
```

## Technical Details

- **Framework**: Next.js 16 with App Router
- **Styling**: Vanilla CSS with BEM methodology
- **Typography**: Lato font (matches Power Apps)
- **Clipboard API**: Native browser API with fallback
- **Responsive**: Works on mobile and desktop

## Future Enhancements

- [ ] Text input field components
- [ ] Checkbox and radio button components
- [ ] Custom color picker for brand variations
- [ ] Export all components as single ZIP file
- [ ] Dark mode toggle
- [ ] Search and filter functionality

## Related Documentation

- [Power Apps YAML Schema](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/yaml-formulas)
- [EDS Tokens Documentation](../../packages/eds-tokens/README.md)
- [Generator CLI Documentation](../scripts/power-apps/README.md)
