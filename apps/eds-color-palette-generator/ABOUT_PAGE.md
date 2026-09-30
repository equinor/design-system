# About Page Documentation

## Overview

The About page explains how the EDS Colour Palette Generator works internally, with interactive demonstrations of the key concepts. The values it shows (lightness per step, step roles, contrast requirements) come from Tokens Studio through `src/config/tokensStudio.ts` and `src/config/config.ts`, so the page follows Tokens Studio without edits.

## Location

- **Route:** `/about`
- **File:** `src/app/about/page.tsx`

## Features

### 1. Comprehensive Explanations

The page explains:

- How the colour generation algorithm works
- The role of the Gaussian (bell curve) distribution
- How lightness values are configured for each step
- Why OKLCH colour space is used
- Configuration options for light and dark modes

### 2. Interactive Bell Curve Visualisation

The `BellCurveVisualization` component (`src/components/docs/BellCurveVisualization.tsx`) provides:

- Visual representation of the Gaussian function
- Interactive controls for mean and standard deviation
- Real-time updates showing how parameters affect the curve shape
- Grid and axis labels for clarity
- Mean indicator showing the peak of the curve

### 3. Interactive Chroma Distribution Demo

The `ChromaDistributionDemo` component (`src/components/docs/ChromaDistributionDemo.tsx`) provides:

- Colour picker to select any base colour
- Interactive controls for Gaussian parameters (mean and standard deviation)
- Visual chart showing chroma distribution across lightness values
- Generated colour scale preview
- Real-time property calculations (base chroma, max chroma, peak lightness)

### 4. Colour Step Pairings and Contrast Requirements

The `ContrastRequirementsTable` component (`src/components/docs/ContrastRequirementsTable.tsx`) provides:

- Comprehensive list of all colour steps with contrast requirements
- Direct reference to configuration file for always up-to-date information
- Detailed APCA (Accessible Perceptual Contrast Algorithm) levels and rules
- WCAG 2.1 contrast ratios and requirements
- Lightness values for both light and dark modes
- Each step named after its Tokens Studio role (ADR 0016 D5)

### 5. Best Practices and Resources

- Guidelines for using the generator effectively
- Links to relevant specifications and tools:
  - Oklab colour space specification
  - <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1 guidelines
  - <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr> contrast algorithm
  - OKLCH colour picker and converter

## Components Created

### BellCurveVisualization

**File:** `src/components/docs/BellCurveVisualization.tsx`

A client-side component that visualises the Gaussian function used to calculate chroma multipliers.

**Props:**

- `initialMean?: number` -- Initial mean value (default: 0.6)
- `initialStdDev?: number` -- Initial standard deviation (default: 2)

**Features:**

- SVG-based bell curve visualisation
- Interactive sliders for mean and standard deviation
- Grid lines and axis labels
- Mean indicator line
- Responsive design

### ChromaDistributionDemo

**File:** `src/components/docs/ChromaDistributionDemo.tsx`

A client-side component that demonstrates how chroma varies across a colour scale.

**Props:**

- `initialBaseColor?: string` -- Initial base colour (default: '#FF6B6B')
- `initialMean?: number` -- Initial mean value (default: 0.6)
- `initialStdDev?: number` -- Initial standard deviation (default: 2)

**Features:**

- Colour picker for base colour selection
- Interactive Gaussian parameter controls
- Bar chart showing chroma distribution
- Colour scale preview with hover states
- Real-time property calculations

### ContrastRequirementsTable

**File:** `src/components/docs/ContrastRequirementsTable.tsx`

A client-side component that displays colour step pairings and their contrast requirements, directly referencing the configuration file.

**Features:**

- Dynamically reads from `PALETTE_STEPS` configuration
- Displays APCA Lc levels with descriptions and rules
- Shows WCAG contrast ratios with requirements
- Lists all steps with their contrast pairings
- Lightness values for both light and dark modes
- Each requirement names the Tokens Studio pairing it checks (ADR 0016 Confirmation 5)
- Always stays in sync with the configuration

## Navigation

The About page is linked from the header navigation (`AppHeader`) on every route, and is available at `/about`. An "Open the original generator" link on the page points at the archived Gaussian generator at `/old`.

## Technical Implementation

### Colour Space

The demos use the OKLCH colour space via the `colorjs.io` library, which provides:

- Perceptually uniform colour representation
- Independent manipulation of lightness, chroma, and hue
- Consistent behaviour across different colours

### Gaussian Function

The mathematical formula used:

```typescript
gaussian(x, mean, stdDev) = exp((-25 / stdDev) × (mean - x)²)
```

This function produces a bell curve where:

- `x` is the lightness value (0 to 1)
- `mean` is the centre of the curve (where chroma is maximum)
- `stdDev` controls the width (how quickly chroma decreases)

### Chroma Calculation

For each colour step:

```typescript
chroma = gaussian(lightness, mean, stdDev) × baseChroma
```

The Gaussian function outputs a multiplier (0 to 1) that scales the base colour's chroma.

### Configuration References

The About page directly references the configuration files to ensure documentation stays synchronized:

- **PALETTE_STEPS** from `src/config/config.ts` -- All steps with their Tokens Studio lightness values, roles and contrast requirements
- **APCA_CONTRAST_LEVELS** from `src/config/APCA_CONTRAST_LEVELS.ts` -- APCA Lc levels with descriptions and rules
- **WCAG_CONTRAST_LEVELS** from `src/config/WCAG_CONTRAST_LEVELS.ts` -- WCAG contrast ratios and requirements

This approach eliminates the need to manually update documentation when configuration changes, as the page reads directly from the source of truth.

## Styling

The page uses the app's Tailwind classes, which map onto Tokens Studio semantic variables in `src/app/globals.css`:

- `bg-canvas` -- `background.canvas`, the page background
- `bg-surface` -- `background.surface`, cards and panels
- `text-primary` -- `text.primary`
- `text-secondary` -- `text.secondary`
- `border-muted` -- `border.non-interactive.neutral.muted`

The page is responsive and follows the light and dark colour schemes.

## Accessibility

The page follows accessibility best practices:

- Semantic HTML structure with proper heading hierarchy
- ARIA labels on interactive SVG elements
- Keyboard-navigable controls
- High contrast colours
- Descriptive link text and labels
- Proper use of `<abbr>` tags for abbreviations

## Future Enhancements

Potential improvements:

- Add more interactive demos (e.g., side-by-side light/dark mode comparison)
- Include examples of common use cases
- Add a tutorial mode with step-by-step guidance
- Export visualisation as images
- Add comparison with other colour generation methods
