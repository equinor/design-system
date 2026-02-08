# EDS Platform Components

A web application providing Equinor Design System components optimized for unconventional platforms and frameworks such as Power Platform, Power BI, and other low-code platforms.

## Purpose

This application serves as a showcase and resource for developers working with EDS components in environments that have unique constraints or requirements, such as:

- **Power Platform** - Components optimized for Power Apps and Power Pages, including YAML snippets and PowerFX formulas
- **Power BI** - Custom visuals and components for Power BI reports and dashboards
- **Low-Code Platforms** - Adaptations for various low-code and no-code development tools

## Features

- **Interactive Web Gallery** - Browse and copy Power Apps components with visual previews
- **Power Apps YAML Generator** - CLI tool to generate copy-paste ready YAML components
- Implementation examples and best practices
- Export/download capabilities for platform-specific formats
- Documentation for integration and customization
- Accessibility-focused design following WCAG 2.1 AA standards

## Power Apps Components

### Web Gallery (Recommended)

Browse, preview, and copy Power Apps components directly from your browser:

```bash
# Start the development server
pnpm dev

# Open in browser
http://localhost:3000/power-apps/buttons
```

Features:

- Visual preview of all button variants
- One-click copy to clipboard
- Organized by style (Contained, Outlined, Ghost)
- Live rendering with EDS styling

See [BUTTON_GALLERY.md](BUTTON_GALLERY.md) for details.

### CLI Generator (Alternative)

Generate YAML files to disk for batch processing:

```bash
# Generate button components
pnpm generate:power-apps button

# Output will be in scripts/power-apps/output/
```

See [scripts/power-apps/README.md](scripts/power-apps/README.md) for detailed documentation.

### Quick Usage

1. Visit `/power-apps/buttons` or run the CLI generator
2. Copy YAML code (click "Copy YAML" button or open generated file)
3. Open Power Apps Studio
4. Go to Tree View → Click (...) → Paste YAML
5. Paste the content

Available components:

- ✅ **Button** - Contained, Outlined, and Ghost variants in Primary, Secondary, and Danger colors

## Getting Started

### Development

First, install dependencies (from the repository root):

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm platform:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building

Build the application for production:

```bash
pnpm platform:build
```

### Testing

Run unit tests:

```bash
pnpm platform:test
```

Run end-to-end tests:

```bash
pnpm platform:test:e2e
```

### Linting

Lint the codebase:

```bash
pnpm platform:lint
```

## Project Structure

```text
eds-platform-components/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   └── styles/           # Additional style files
├── scripts/
│   └── power-apps/       # Power Apps component generators
│       ├── components/   # Component generators
│       ├── utils/        # Utilities and token mappings
│       └── output/       # Generated YAML files
├── tests/
│   └── e2e/              # Playwright E2E tests
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
└── README.md             # This file
```

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **EDS Core React** - Equinor Design System components
- **EDS Tokens** - Design tokens and CSS variables
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing

## Contributing

This project follows the Equinor Design System development guidelines:

- Use functional components with hooks
- Follow TypeScript best practices
- Maintain WCAG 2.1 AA accessibility standards
- Use vanilla CSS with BEM naming convention
- Write tests for all components

See the main [AGENTS.md](../../AGENTS.md) and [.github/copilot-instructions.md](../../.github/copilot-instructions.md) for detailed guidelines.

## Related Projects

- [EDS Color Palette Generator](../eds-color-palette-generator) - Tool for generating accessible color palettes
- [EDS Demo](../eds-demo) - Example implementations of EDS components
- [Design System Docs](../design-system-docs) - Official EDS documentation

## License

See the main [LICENSE](../../LICENSE) file in the repository root.
