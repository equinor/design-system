# Power Apps CLI Generator

Batch generate Power Apps YAML components using shared logic from `src/lib/`.

## Quick Start

```bash
# From repo root
pnpm generate:power-apps button [outputDir]

# From this directory
tsx generate-components.ts button ./output
```

## How It Works

The CLI uses the **same generation logic** as the web app:

1. Imports schemas from `src/lib/buttonPropertySchema.ts`
2. Uses `src/lib/generateButtonYaml.ts` to generate YAML
3. Validates against Power Apps schema
4. Writes files to output directory

This ensures consistency between web-generated and CLI-generated components.

## Generated Files

```text
output/
├── button-contained-primary.yaml
├── button-contained-secondary.yaml
├── button-contained-danger.yaml
├── button-outlined-primary.yaml
├── button-outlined-secondary.yaml
├── button-outlined-danger.yaml
├── button-ghost-primary.yaml
├── button-ghost-secondary.yaml
├── button-ghost-danger.yaml
└── button-*-disabled.yaml
```

## Usage in Power Apps

1. Open Power Apps Studio
2. Go to **Tree View** → **...** → **Paste YAML**
3. Paste content from generated `.yaml` file
4. Component appears in your app

## Architecture

```text
scripts/power-apps/
├── generate-components.ts     # CLI entry point
├── components/
│   └── button.ts              # Wrapper (imports from lib/)
└── utils/
    ├── eds-tokens.ts          # Token mappings
    └── schema-validator.ts    # YAML validation

src/lib/                       # Shared logic
├── buttonPropertySchema.ts    # Property definitions
└── generateButtonYaml.ts      # YAML generator
```

The generators in `components/` are thin wrappers that call the shared lib functions.

## Adding Components

To add a new component:

1. Create schema in `src/lib/[component]PropertySchema.ts`
2. Create generator in `src/lib/generate[Component]Yaml.ts`
3. Create wrapper in `scripts/power-apps/components/[component].ts`
4. Add to CLI switch in `generate-components.ts`

See [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for details.

## Validation

Generated YAML is validated against:

- [Power Apps YAML Schema](https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml)
- PowerFx formula syntax
- Required properties

## Contributing

See [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
