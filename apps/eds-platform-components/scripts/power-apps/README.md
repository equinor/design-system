# Power Apps Component Generator

Generate Power Apps Canvas App YAML components based on Equinor Design System (EDS) specifications.

## Overview

This script system generates copy-paste ready YAML code snippets for Power Apps that replicate EDS component designs. The generated components maintain visual fidelity with EDS tokens while being optimized for Power Apps Canvas Apps.

## Features

- ✅ **Visual Fidelity**: Matches EDS design tokens (colors, typography, spacing)
- ✅ **Multiple Variants**: Generates all component variants (contained, outlined, ghost)
- ✅ **Color Schemes**: Supports primary, secondary, and danger color palettes
- ✅ **Accessibility**: Includes proper ARIA properties and keyboard navigation
- ✅ **Schema Validation**: Validates generated YAML against Power Apps schema
- ✅ **Ready to Use**: Direct copy-paste into Power Apps Studio

## Quick Start

### Generate Components

From the repository root:

```bash
# Generate button components
pnpm run generate:power-apps button

# Generate to custom output directory
pnpm run generate:power-apps button ./custom-output
```

From the app directory:

```bash
cd apps/eds-platform-components

# Generate button components
tsx scripts/power-apps/generate-components.ts button

# Specify output directory
tsx scripts/power-apps/generate-components.ts button ./my-output
```

### Use in Power Apps

1. Run the generator to create YAML files
2. Open Power Apps Studio
3. Create or open a Canvas App
4. Go to **Tree View** (left panel)
5. Click the **...** menu → Select **Paste YAML**
6. Copy content from generated `.yaml` file and paste
7. The component will appear in your app!

## Generated Components

### Button Component

The button generator creates EDS-compliant button components with three variants:

#### Contained Button

- **File**: `button-contained-[color].yaml`
- **Description**: Filled button with solid background
- **Variants**: primary, secondary, danger, disabled
- **Use Case**: Primary actions, important CTAs

#### Outlined Button

- **File**: `button-outlined-[color].yaml`
- **Description**: Button with border, transparent background
- **Variants**: primary, secondary, danger, disabled
- **Use Case**: Secondary actions, alternative choices

#### Ghost Button

- **File**: `button-ghost-[color].yaml`
- **Description**: Text-only button, no border or background
- **Variants**: primary, secondary, danger, disabled
- **Use Case**: Tertiary actions, less prominent options

### Color Schemes

Each variant is available in three color schemes aligned with EDS tokens:

| Color | Hex Value | Use Case |
| ----- | --------- | -------- |
| **Primary** | #007079 | Standard brand actions |
| **Secondary** | #243746 | Alternative actions |
| **Danger** | #EB0037 | Destructive actions (delete, remove) |

## File Structure

```text
scripts/power-apps/
├── generate-components.ts    # Main CLI script
├── components/
│   └── button.ts             # Button component generator
├── utils/
│   ├── eds-tokens.ts         # EDS design token mappings
│   └── schema-validator.ts   # YAML validation utilities
├── output/                   # Generated YAML files (default)
│   ├── button-contained-primary.yaml
│   ├── button-contained-secondary.yaml
│   ├── button-contained-danger.yaml
│   ├── button-outlined-primary.yaml
│   └── ...
└── schemas/                  # Power Apps schema references
```

## EDS Token Mapping

The generator maps EDS tokens to Power Apps properties:

### Colors

```typescript
EDS Token → Power Apps RGBA
--eds-color-primary → RGBA(0, 112, 121, 1)
--eds-color-secondary → RGBA(36, 55, 70, 1)
--eds-color-danger → RGBA(235, 0, 55, 1)
```

### Typography

```typescript
Font: Segoe UI (closest to Equinor font)
Size: 16px (button text)
Weight: Semibold (FontWeight.Semibold)
```

### Spacing & Shape

```typescript
Border Radius: 4px (small corners)
Height: 36px (default button height)
Padding: Controlled via width property
```

## Customization

### Modify Generated Components

The generated YAML includes placeholder actions. Update the `OnSelect` property:

```yaml
OnSelect: |-
  =// Replace with your action
  Navigate(NextScreen, ScreenTransition.Fade)
```

### Adjust Positioning

Update X and Y coordinates in the YAML or drag in Power Apps:

```yaml
X: =100
Y: =200
```

### Change Size

Modify width and height properties:

```yaml
Width: =200
Height: =48
```

## Validation

The generator includes basic YAML validation:

- ✅ Valid YAML syntax
- ✅ Required Power Apps properties
- ✅ PowerFX formula syntax checks
- ⚠️ Warnings for potential issues

For full schema validation, the official Power Apps schema is referenced:
<https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml>

## Adding New Components

To add a new component type:

1. Create generator in `components/[component-name].ts`
2. Define component options interface
3. Implement generation function using EDS tokens
4. Add to CLI switch in `generate-components.ts`
5. Update this README

Example structure:

```typescript
// components/text-field.ts
import { EDSColors, EDSTypography } from '../utils/eds-tokens'

export type TextFieldOptions = {
  name?: string
  label?: string
  placeholder?: string
  // ... other options
}

export const generateTextField = (options: TextFieldOptions): string => {
  // Implementation
  return `- ${name}:
    Control: TextInput
    Properties:
      # ... properties
  `
}
```

## Troubleshooting

### "YAML parsing error"

- Check that YAML syntax is valid
- Ensure proper indentation (2 spaces)
- Verify PowerFX formulas are correct

### "Component not appearing in Power Apps"

- Ensure you're using **Tree View** → **Paste YAML**
- Check that app is in edit mode
- Verify YAML was copied completely

### "Colors don't match EDS"

- Power Apps uses RGBA format, values are pre-converted
- Some color variations may appear due to Power Apps rendering
- Adjust RGBA values in `eds-tokens.ts` if needed

## References

- [EDS Storybook](https://storybook.eds.equinor.com/)
- [EDS GitHub](https://github.com/equinor/design-system)
- [Power Apps YAML Schema](https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml)
- [PowerFX Reference](https://github.com/microsoft/Power-Fx)
- [Power Apps Documentation](https://learn.microsoft.com/en-us/power-apps/)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new components or improving existing generators.

## Support

For issues or questions:

1. Check existing generated YAML for examples
2. Review EDS documentation for component specifications
3. Refer to Power Apps YAML documentation
4. Create an issue in the repository

## License

Part of the Equinor Design System. See main repository [LICENSE](../../../../LICENSE).
