# EDS Color Palette Generator

An accessible color palette generator for the Equinor Design System. This tool creates harmonious color scales using Gaussian distribution and the OKLCH color space, ensuring consistent, accessible colors across different lightness levels.

## Features

* **Gaussian-based chroma distribution**: Colors maintain visual harmony using mathematical bell curves
* **OKLCH color space**: Perceptually uniform color generation
* **Multiple color anchors**: Support for interpolation between colors at specific steps for gradient-like scales
* **Accessibility-focused**: Built-in contrast checking with APCA and WCAG methods
* **Light and dark mode support**: Separate configurations for optimal contrast in each mode
* **Interactive configuration**: Adjust lightness values and Gaussian parameters in real-time
* **Export/Import**: Save and share color palette configurations
* **CLI tool**: Generate color tokens from configuration files (supports both single value and multiple anchors)
* **About page**: Comprehensive documentation with interactive demos explaining how the generator works

## Getting Started

### Web Interface

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the color palette generator.

To learn how the generator works internally, visit the About page at [http://localhost:3000/about](http://localhost:3000/about).

### CLI Tool

Generate color tokens from a configuration file:

```bash
generate-colors [configPath] [outputDir]
```

See [src/cli/README.md](./src/cli/README.md) for detailed CLI documentation and examples.

**Example:**

```bash
generate-colors examples/palette-config.json output/
```

This will generate `color.tokens.light.json` and `color.tokens.dark.json` files in the output directory.

## How It Works

The generator uses a three-step process:

1. **Define lightness values**: Each color step has predefined lightness values optimized for specific use cases (backgrounds, borders, text, etc.)
2. **Apply Gaussian distribution**: Chroma (color intensity) varies using a bell curve, creating natural color progression
3. **Generate color scale**: Colors are created in OKLCH space, maintaining hue while varying lightness and chroma

### Single Value vs. Multiple Anchors

* **Single value**: Provide one base color, and the generator applies Gaussian distribution across all steps
* **Multiple anchors**: Define colors at specific steps (e.g., step 6 and step 9), and the generator interpolates smoothly between them in OKLCH space while still applying Gaussian chroma distribution

For detailed explanations and interactive demonstrations showing the difference, see the [About page](http://localhost:3000/about) or read [ABOUT_PAGE.md](./ABOUT_PAGE.md).

## Key Concepts

* **Mean**: The lightness value where chroma is at maximum (center of the bell curve)
* **Standard deviation**: Controls how quickly chroma decreases away from the mean
* **Lightness**: Predefined values for each step based on accessibility requirements
* **Chroma**: Calculated as `gaussian(lightness, mean, stdDev) × baseChroma`

## Configuration

Color palettes can be configured through:

* **Display options panel**: Toggle contrast checking, lightness inputs, and Gaussian parameters
* **Quick actions menu**: Import/export configurations, change color format
* **Individual color controls**: Rename colors, adjust base colors, add or remove colors

## Testing

Run unit tests with:

```bash
pnpm test
```

Run end-to-end tests:

```bash
pnpm test:e2e
```

## Building

Build the CLI tool:

```bash
pnpm build:cli
```

This will compile the TypeScript CLI script into a distributable JavaScript file in the `dist/` directory.

## Documentation

* **[ABOUT_PAGE.md](./ABOUT_PAGE.md)**: Documentation for the About page and interactive components
* **[PALETTE_OVERVIEW.md](./PALETTE_OVERVIEW.md)**: Overview of the color palette structure
* **[PALETTE_CONTRAST_REPORT.md](./PALETTE_CONTRAST_REPORT.md)**: Contrast compliance report

## Built With

* [Next.js](https://nextjs.org) -- React framework
* [colorjs.io](https://colorjs.io) -- Color manipulation in OKLCH space
* [Tailwind CSS](https://tailwindcss.com) -- Styling
* [Lucide React](https://lucide.dev) -- Icons
* [EDS Tokens](https://github.com/equinor/design-system) -- Equinor Design System tokens

## Learn More

* [Oklab color space specification](https://bottosson.github.io/posts/oklab/)
* [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
* [APCA contrast algorithm](https://github.com/Myndex/SAPC-APCA)
* [OKLCH color picker](https://oklch.com/)
