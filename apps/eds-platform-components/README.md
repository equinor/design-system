# EDS Platform Components

Web application and tooling for Equinor Design System components optimized for low-code platforms (Power Platform, Power BI, etc.).

## Quick Start

```bash
# Start web app
pnpm dev

# Visit http://localhost:3000/power-apps/buttons
# Configure button → Copy YAML → Paste in Power Apps Studio
```

## Features

- **Interactive Configurator** - Filter variants, customize properties, get real-time YAML
- **Property Editor** - Fine-tune 14+ properties mapped to EDS design tokens
- **CLI Generator** - Batch generate YAML files (`pnpm generate:power-apps button`)
- **Type-Safe** - Shared TypeScript logic in `lib/` used by both web app and scripts

## Architecture

### Shared Logic (`lib/`)

The core generation logic is centralized and reusable:

- **`buttonPropertySchema.ts`** - Property definitions with EDS token mappings
- **`generateButtonYaml.ts`** - YAML generator accepting custom properties
- **Token mapping** - EDS design tokens → platform-specific format

Both the web app and CLI scripts use this shared logic, ensuring consistency.

### Web App (`src/`)

- **Dynamic configurator** - React app with filter chips and property editor
- **Real-time preview** - Live button preview with copy-to-clipboard
- **Platform routes** - `/power-apps/buttons`, future: `/power-bi/*`, etc.

### CLI Scripts (`scripts/`)

- **Batch generation** - Generate all variants to disk
- **Same logic** - Imports from `lib/` to ensure consistency
- **CI/CD friendly** - Scriptable for automated workflows

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed patterns.

## Usage

### Web App (Recommended)

1. Start: `pnpm dev`
2. Navigate to `/power-apps/buttons`
3. Select variant/color, customize properties
4. Copy YAML, paste in Power Apps Studio

### CLI Generator

```bash
pnpm generate:power-apps button [outputDir]
```

Generates all button variants to `scripts/power-apps/output/`.

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm test         # Run unit tests
pnpm test:e2e     # Run Playwright tests
pnpm lint         # Lint code
```

See main repo's [CLAUDE.md](../../.claude/CLAUDE.md) for development guidelines.

## Contributing

Follow repo-wide standards:

- Vanilla CSS with BEM + EDS tokens
- Named exports only
- WCAG 2.1 AA accessibility
- Conventional commits

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md).

## Project Structure

```text
eds-platform-components/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components (filters, editors)
│   └── lib/              # Shared logic (schemas, generators)
├── scripts/
│   └── power-apps/       # CLI tools (uses lib/)
└── tests/                # E2E tests
```

## Available Components

- ✅ **Button** - Contained, Outlined, Ghost × Primary, Secondary, Danger
- 🚧 **Text Input** - Planned
- 🚧 **Checkbox** - Planned

## License

See [LICENSE](../../LICENSE)
