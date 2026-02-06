# Power Apps Script System

## Overview

This directory contains scripts for generating Power Apps Canvas App components based on Equinor Design System (EDS) specifications.

## Directory Structure

```text
power-apps/
├── components/             # Component generators
│   └── button.ts          # Button component generator
├── utils/                 # Shared utilities
│   ├── eds-tokens.ts      # EDS token mappings
│   └── schema-validator.ts # YAML validation
├── output/                # Generated YAML files
├── schemas/               # Power Apps schema references
├── generate-components.ts # Main CLI script
├── README.md             # Detailed documentation
└── QUICKSTART.md         # Quick start guide
```

## Quick Reference

### Generate Components

```bash
# From repository root
pnpm platform:generate:power-apps button

# From app directory
pnpm generate:power-apps button

# Custom output directory
pnpm generate:power-apps button ./custom-output
```

### Generated Files

- **12 button variants** across 3 styles and 4 color schemes
- All files in `output/` directory
- Ready to copy-paste into Power Apps Studio

### Usage in Power Apps

1. Run generator
2. Open Power Apps Studio
3. Tree View → ... → Paste YAML
4. Copy content from `.yaml` file
5. Paste and customize

## Component Catalog

| Component  | Variants                   | Colors                     | Status         |
| ---------- | -------------------------- | -------------------------- | -------------- |
| **Button** | Contained, Outlined, Ghost | Primary, Secondary, Danger | ✅ Ready       |
| Text Field | -                          | -                          | 🔜 Coming Soon |
| Checkbox   | -                          | -                          | 🔜 Coming Soon |
| Radio      | -                          | -                          | 🔜 Coming Soon |
| Select     | -                          | -                          | 🔜 Coming Soon |

## Key Files

- **`generate-components.ts`** - Main CLI entry point
- **`components/button.ts`** - Button generator implementation
- **`utils/eds-tokens.ts`** - EDS design token mappings
- **`utils/schema-validator.ts`** - YAML validation utilities

## Adding New Components

1. Create generator in `components/[name].ts`
2. Define options interface and generation function
3. Use EDS tokens from `utils/eds-tokens.ts`
4. Add to CLI switch in `generate-components.ts`
5. Update documentation

## Documentation

- [README.md](README.md) - Comprehensive documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide for Power Apps users
- [output/README.md](output/README.md) - Generated files guide

## Support

For questions or issues:

- Review documentation files
- Check generated example files
- Refer to Power Apps and EDS documentation
- Create an issue in the repository
