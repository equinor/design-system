# Architecture

This document explains the design patterns and architecture of the EDS Platform Components system.

## Core Principle: Shared Logic

All platform-specific generation logic lives in `src/lib/` and is shared between:

- **Web app** (`src/app/`) - Interactive configurator
- **CLI scripts** (`scripts/`) - Batch generation tools

This ensures consistency and reduces duplication.

## Pattern: Property Schema System

### 1. Define Component Schema

Each component has a schema defining customizable properties:

```typescript
// lib/buttonPropertySchema.ts
export type PropertyDefinition = {
  id: string                    // Property name
  label: string                 // Display label
  type: 'text' | 'number' | ... // Input type
  category: string              // Grouping (layout, style, etc.)
  defaultValue: any             // Default value
  powerAppsSupported: boolean   // Platform compatibility
  edsToken?: string             // EDS design token reference
  min?: number                  // Constraints
  max?: number
  // ...
}

export const buttonPropertySchema: PropertyDefinition[] = [
  {
    id: 'width',
    label: 'Width',
    type: 'number',
    category: 'layout',
    defaultValue: 132,
    powerAppsSupported: true,
    edsToken: 'Size: default = 132px',
    min: 60,
    max: 500,
  },
  // ... more properties
]
```

**Benefits:**

- Single source of truth for property definitions
- Type-safe property access
- Platform-specific filtering (e.g., only show Power Apps-supported properties)
- EDS token documentation inline

### 2. Create Generator Function

Generate platform-specific code from property values:

```typescript
// lib/generateButtonYaml.ts
export type ButtonYamlOptions = {
  variant: 'contained' | 'outlined' | 'ghost'
  color: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  width?: number
  height?: number
  // ... all customizable properties
}

export const generateButtonYaml = (options: ButtonYamlOptions): string => {
  const { variant, color, width = 132, height = 36, ... } = options

  // Map to platform format (Power Apps YAML)
  return `- ${name}:
    Control: Classic/Button@2.2.0
    Properties:
      Width: =${width}
      Height: =${height}
      Fill: =${colorScheme.resting}
      ...`
}
```

**Benefits:**

- Accepts all schema-defined properties
- Maps EDS tokens to platform-specific format
- Type-safe with TypeScript
- Reusable across web app and CLI

### 3. Build UI (Web App)

Dynamic property editor renders controls based on schema:

```typescript
// components/PropertyEditor.tsx
export const PropertyEditor = ({ schema, values, onChange }) => {
  return schema.map(property => {
    switch (property.type) {
      case 'number':
        return <TextField type="number" {...property} />
      case 'text':
        return <TextField {...property} />
      // ... other types
    }
  })
}

// app/power-apps/buttons/page.tsx
const [properties, setProperties] = useState(getDefaultPropertyValues())

<PropertyEditor
  schema={buttonPropertySchema}
  values={properties}
  onChange={handlePropertyChange}
/>

const yaml = generateButtonYaml({
  variant,
  color,
  ...properties  // All custom values
})
```

**Benefits:**

- No manual form building
- Automatically stays in sync with schema
- Consistent UX across all components

### 4. Use in CLI (Scripts)

CLI imports and uses the same logic:

```typescript
// scripts/power-apps/generate-components.ts
import { generateButtonYaml } from '../../src/lib/generateButtonYaml'
import { getDefaultPropertyValues } from '../../src/lib/buttonPropertySchema'

const properties = getDefaultPropertyValues()
const yaml = generateButtonYaml({
  variant: 'contained',
  color: 'primary',
  ...properties
})

saveYAML(yaml, 'button-contained-primary.yaml')
```

**Benefits:**

- Same logic = same output
- No duplication
- Easy to maintain

## Pattern: EDS Token Mapping

Design tokens are mapped per platform:

```typescript
// lib/edsTokens.ts (if needed for multiple platforms)
export const EDSColors = {
  primary: {
    hex: '#007079',
    powerApps: 'RGBA(0, 112, 121, 1)',
    powerBI: { r: 0, g: 112, b: 121 },
  }
}
```

Currently, Power Apps tokens are in `generateButtonYaml.ts` but can be extracted for reuse.

## Pattern: Platform Abstraction

To support multiple platforms (Power Apps, Power BI, etc.):

```typescript
// lib/buttonPropertySchema.ts
export type PropertyDefinition = {
  // ...
  platforms: {
    powerApps: { supported: true, propertyName: 'Width' },
    powerBI: { supported: true, propertyName: 'width' },
    pega: { supported: false }
  }
}
```

Then filter in UI:

```typescript
const supportedProperties = schema.filter(
  prop => prop.platforms.powerApps.supported
)
```

## Adding New Components

Follow this workflow:

### 1. Define Schema

```typescript
// lib/textInputPropertySchema.ts
export const textInputPropertySchema: PropertyDefinition[] = [...]
```

### 2. Create Generator

```typescript
// lib/generateTextInputYaml.ts
export const generateTextInputYaml = (options) => {...}
```

### 3. Build Web UI

```typescript
// app/power-apps/text-input/page.tsx
import { textInputPropertySchema } from '@/lib/textInputPropertySchema'
import { generateTextInputYaml } from '@/lib/generateTextInputYaml'

// Use PropertyEditor and filters as with buttons
```

### 4. Update CLI

```typescript
// scripts/power-apps/components/text-input.ts
import { generateTextInputYaml } from '../../../src/lib/generateTextInputYaml'

export const generateTextInput = (options) => {
  return generateTextInputYaml(options)
}
```

### 5. Register in CLI

```typescript
// scripts/power-apps/generate-components.ts
switch (componentType) {
  case 'button': ...
  case 'text-input':
    await generateTextInputComponents()
    break
}
```

## Directory Structure

```text
src/
├── lib/                              # Shared logic (THE SOURCE OF TRUTH)
│   ├── buttonPropertySchema.ts       # Property definitions
│   ├── generateButtonYaml.ts         # YAML generator
│   └── [future: textInputPropertySchema.ts, ...]
├── components/                       # Reusable React components
│   ├── PropertyEditor.tsx            # Dynamic property editor
│   ├── ButtonFilterControls.tsx     # Component-specific filters
│   └── ComponentCard.tsx             # Preview card
└── app/
    ├── page.tsx                      # Home (platform selector)
    └── power-apps/
        └── buttons/
            └── page.tsx              # Button configurator (uses lib/)

scripts/
└── power-apps/
    ├── generate-components.ts        # CLI entry
    ├── components/
    │   └── button.ts                 # Thin wrapper (imports lib/)
    └── utils/
        ├── eds-tokens.ts             # Token mappings (could move to lib/)
        └── schema-validator.ts       # YAML validation
```

## Design Decisions

### Why `lib/` for shared logic?

- Accessible to both `src/app/` and `scripts/`
- Clear separation of business logic from UI
- Easy to import with `@/lib/` alias

### Why property schemas?

- Single source of truth
- Type-safe
- Self-documenting (EDS tokens, descriptions)
- Platform-agnostic (can filter per platform)

### Why separate generators per component?

- Each component has unique properties
- Keeps generators focused and testable
- Easy to add new components independently

## Testing Strategy

- **Unit tests** - Test generators with various inputs
- **Integration tests** - Test schema + generator combination
- **E2E tests** - Test full user flow in web app

```typescript
// lib/generateButtonYaml.test.ts
describe('generateButtonYaml', () => {
  it('generates valid YAML', () => {
    const yaml = generateButtonYaml({ variant: 'contained', color: 'primary' })
    expect(yaml).toContain('Control: Classic/Button@2.2.0')
  })
})
```

## Future Enhancements

1. **Multi-platform support** - Extend property schema with platform flags
2. **Component library** - Extract more EDS components
3. **Template system** - Pre-configured component sets
4. **Export formats** - JSON, XML, etc. beyond YAML
5. **Visual editor** - Drag-drop component customization
