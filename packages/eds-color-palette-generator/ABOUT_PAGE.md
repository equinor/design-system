# About Page Documentation

## Overview

The About page provides comprehensive documentation on how the Color Palette Generator works internally, including interactive demonstrations of the key concepts.

## Location

- **Route:** `/about`
- **File:** `src/app/about/page.tsx`

## Features

### 1. Comprehensive Explanations

The page explains:

- How the color generation algorithm works
- The role of the Gaussian (bell curve) distribution
- How lightness values are configured for each step
- Why OKLCH color space is used
- Configuration options for light and dark modes

### 2. Interactive Bell Curve Visualization

The `BellCurveVisualization` component (`src/components/BellCurveVisualization.tsx`) provides:

- Visual representation of the Gaussian function
- Interactive controls for mean and standard deviation
- Real-time updates showing how parameters affect the curve shape
- Grid and axis labels for clarity
- Mean indicator showing the peak of the curve

### 3. Interactive Chroma Distribution Demo

The `ChromaDistributionDemo` component (`src/components/ChromaDistributionDemo.tsx`) provides:

- Color picker to select any base color
- Interactive controls for Gaussian parameters (mean and standard deviation)
- Visual chart showing chroma distribution across lightness values
- Generated color scale preview
- Real-time property calculations (base chroma, max chroma, peak lightness)

### 4. Color Step Pairings and Contrast Requirements

The `ContrastRequirementsTable` component (`src/components/ContrastRequirementsTable.tsx`) provides:

- Comprehensive list of all color steps with contrast requirements
- Direct reference to configuration file for always up-to-date information
- Detailed APCA (Accessible Perceptual Contrast Algorithm) levels and rules
- WCAG 2.1 contrast ratios and requirements
- Lightness values for both light and dark modes
- Step categorization and variants

### 5. Best Practices and Resources

- Guidelines for using the generator effectively
- Links to relevant specifications and tools:
  - Oklab color space specification
  - <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1 guidelines
  - <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr> contrast algorithm
  - OKLCH color picker and converter

## Components Created

### BellCurveVisualization

**File:** `src/components/BellCurveVisualization.tsx`

A client-side component that visualizes the Gaussian function used to calculate chroma multipliers.

**Props:**

- `initialMean?: number` -- Initial mean value (default: 0.6)
- `initialStdDev?: number` -- Initial standard deviation (default: 2)

**Features:**

- SVG-based bell curve visualization
- Interactive sliders for mean and standard deviation
- Grid lines and axis labels
- Mean indicator line
- Responsive design

### ChromaDistributionDemo

**File:** `src/components/ChromaDistributionDemo.tsx`

A client-side component that demonstrates how chroma varies across a color scale.

**Props:**

- `initialBaseColor?: string` -- Initial base color (default: '#FF6B6B')
- `initialMean?: number` -- Initial mean value (default: 0.6)
- `initialStdDev?: number` -- Initial standard deviation (default: 2)

**Features:**

- Color picker for base color selection
- Interactive Gaussian parameter controls
- Bar chart showing chroma distribution
- Color scale preview with hover states
- Real-time property calculations

### ContrastRequirementsTable

**File:** `src/components/ContrastRequirementsTable.tsx`

A client-side component that displays color step pairings and their contrast requirements, directly referencing the configuration file.

**Features:**

- Dynamically reads from `PALETTE_STEPS` configuration
- Displays APCA Lc levels with descriptions and rules
- Shows WCAG contrast ratios with requirements
- Lists all steps with their contrast pairings
- Lightness values for both light and dark modes
- Categorized by step type (Background, Border, Fill, Text)
- Always stays in sync with the configuration

## Navigation

The About page is accessible from the main page via:

- An "About" link in the header (added to `HeaderPanel` component)
- Direct URL navigation to `/about`

A "Back to generator" link is provided on the About page for easy navigation back to the main tool.

## Technical Implementation

### Color Space

The demos use the OKLCH color space via the `colorjs.io` library, which provides:

- Perceptually uniform color representation
- Independent manipulation of lightness, chroma, and hue
- Consistent behavior across different colors

### Gaussian Function

The mathematical formula used:

```typescript
gaussian(x, mean, stdDev) = exp((-25 / stdDev) × (mean - x)²)
```

This function produces a bell curve where:

- `x` is the lightness value (0 to 1)
- `mean` is the center of the curve (where chroma is maximum)
- `stdDev` controls the width (how quickly chroma decreases)

### Chroma Calculation

For each color step:

```typescript
chroma = gaussian(lightness, mean, stdDev) × DEFAULT_MAX_CHROMA
```

Where `DEFAULT_MAX_CHROMA` is a constant (0.37) that ensures all colors have the same chroma value at each step, regardless of the base color's original saturation. This creates visual consistency across different hues in the color palette.

The Gaussian function outputs a multiplier (0 to 1) that scales the maximum chroma value based on the distance from the mean lightness.

### Configuration References

The About page directly references the configuration files to ensure documentation stays synchronized:

- **PALETTE_STEPS** from `src/config/config.ts` -- All color steps with their lightness values and contrast requirements
- **APCA_CONTRAST_LEVELS** from `src/config/APCA_CONTRAST_LEVELS.ts` -- APCA Lc levels with descriptions and rules
- **WCAG_CONTRAST_LEVELS** from `src/config/WCAG_CONTRAST_LEVELS.ts` -- WCAG contrast ratios and requirements

This approach eliminates the need to manually update documentation when configuration changes, as the page reads directly from the source of truth.

## Styling

The page uses Tailwind CSS classes consistent with the rest of the application:

- `bg-canvas` -- Main background
- `bg-surface` -- Elevated surfaces
- `text-default` -- Default text color
- `text-neutral-subtle` -- Subtle text color
- `border-neutral-subtle` -- Subtle borders

The page is fully responsive and supports both light and dark modes through the existing color scheme system.

## Accessibility

The page follows accessibility best practices:

- Semantic HTML structure with proper heading hierarchy
- ARIA labels on interactive SVG elements
- Keyboard-navigable controls
- High contrast colors
- Descriptive link text and labels
- Proper use of `<abbr>` tags for abbreviations

## Future Enhancements

Potential improvements:

- Add more interactive demos (e.g., side-by-side light/dark mode comparison)
- Include examples of common use cases
- Add a tutorial mode with step-by-step guidance
- Export visualization as images
- Add comparison with other color generation methods
